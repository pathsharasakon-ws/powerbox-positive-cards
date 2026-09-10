import { env } from 'cloudflare:workers';

const json = (data: unknown, status = 200) => Response.json(data, { status });
const normalizeCode = (value: unknown) => String(value ?? '').replace(/\D/g, '').slice(0, 6);

async function getRoom(code: string) {
  const room = await env.DB.prepare('SELECT code, name, status, duration_minutes AS durationMinutes FROM rooms WHERE code = ?').bind(code).first();
  if (!room) return null;
  const result = await env.DB.prepare('SELECT id, name FROM participants WHERE room_code = ? ORDER BY joined_at, name').bind(code).all();
  return { ...room, participants: result.results };
}

export async function GET(request: Request) {
  const code = normalizeCode(new URL(request.url).searchParams.get('code'));
  if (code.length !== 6) return json({ error: 'invalid_code' }, 400);
  const room = await getRoom(code);
  return room ? json(room) : json({ error: 'room_not_found' }, 404);
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  if (body.action === 'create') {
    const name = String(body.name ?? '').trim().slice(0, 80);
    const adminName = String(body.adminName ?? '').trim().slice(0, 60);
    const durationMinutes = Math.min(30, Math.max(5, Number(body.durationMinutes) || 10));
    if (!name || !adminName) return json({ error: 'room_and_admin_name_required' }, 400);
    const adminToken = crypto.randomUUID();
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      try {
        const participant = { id: crypto.randomUUID(), name: adminName };
        await env.DB.batch([
          env.DB.prepare('INSERT INTO rooms (code, name, admin_token, status, duration_minutes, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(code, name, adminToken, 'waiting', durationMinutes, Date.now()),
          env.DB.prepare('INSERT INTO participants (id, room_code, name, joined_at) VALUES (?, ?, ?, ?)').bind(participant.id, code, participant.name, Date.now()),
        ]);
        return json({ code, name, status: 'waiting', adminToken, participants: [participant] }, 201);
      } catch (error) {
        if (attempt === 11) throw error;
      }
    }
  }
  if (body.action === 'join') {
    const code = normalizeCode(body.code);
    const name = String(body.name ?? '').trim().slice(0, 60);
    if (code.length !== 6 || !name) return json({ error: 'invalid_join' }, 400);
    const room = await env.DB.prepare('SELECT status FROM rooms WHERE code = ?').bind(code).first<{ status: string }>();
    if (!room) return json({ error: 'room_not_found' }, 404);
    if (room.status !== 'waiting') return json({ error: 'room_started' }, 409);
    const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM participants WHERE room_code = ?').bind(code).first<{ count: number }>();
    if (count && count.count >= 100) return json({ error: 'room_full' }, 409);
    await env.DB.prepare('INSERT OR IGNORE INTO participants (id, room_code, name, joined_at) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), code, name, Date.now()).run();
    return json(await getRoom(code));
  }
  return json({ error: 'invalid_action' }, 400);
}

export async function PATCH(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const code = normalizeCode(body.code);
  const adminToken = String(body.adminToken ?? '');
  const room = await env.DB.prepare('SELECT admin_token FROM rooms WHERE code = ?').bind(code).first<{ admin_token: string }>();
  if (!room || room.admin_token !== adminToken) return json({ error: 'forbidden' }, 403);
  if (body.action === 'start') {
    const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM participants WHERE room_code = ?').bind(code).first<{ count: number }>();
    if (!count || count.count < 2) return json({ error: 'need_more_participants' }, 409);
    await env.DB.prepare("UPDATE rooms SET status = 'started' WHERE code = ?").bind(code).run();
  } else if (body.action === 'update_participants' && Array.isArray(body.participants)) {
    const names = [...new Set(body.participants.map((value) => String(value).trim().slice(0, 60)).filter(Boolean))].slice(0, 100);
    const existing = await env.DB.prepare('SELECT id, name FROM participants WHERE room_code = ?').bind(code).all<{ id: string; name: string }>();
    await env.DB.batch([
      ...existing.results.filter((person) => !names.includes(person.name)).map((person) => env.DB.prepare('DELETE FROM participants WHERE id = ?').bind(person.id)),
      ...names.filter((name) => !existing.results.some((person) => person.name === name)).map((name) => env.DB.prepare('INSERT INTO participants (id, room_code, name, joined_at) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), code, name, Date.now())),
    ]);
  } else {
    return json({ error: 'invalid_action' }, 400);
  }
  return json(await getRoom(code));
}
