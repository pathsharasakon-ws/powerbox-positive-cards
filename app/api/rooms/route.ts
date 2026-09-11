import { env } from 'cloudflare:workers';

const json = (data: unknown, status = 200) => Response.json(data, { status });
const normalizeCode = (value: unknown) => String(value ?? '').replace(/\D/g, '').slice(0, 6);
const normalizeName = (value: unknown) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
const nameKey = (value: unknown) => normalizeName(value).toLocaleLowerCase('en-US');

async function getRoom(code: string) {
  const room = await env.DB.prepare('SELECT code, name, status, duration_minutes AS durationMinutes, ends_at AS endsAt, deck_json AS deckJson FROM rooms WHERE code = ?').bind(code).first<{ code: string; name: string; status: string; durationMinutes: number; endsAt: number | null; deckJson: string | null }>();
  if (!room) return null;
  const result = await env.DB.prepare('SELECT id, name FROM participants WHERE room_code = ? ORDER BY joined_at, name').bind(code).all();
  const { deckJson, ...roomFields } = room;
  return { ...roomFields, deck: deckJson ? JSON.parse(deckJson) : null, participants: result.results };
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
    const adminName = normalizeName(body.adminName);
    const durationMinutes = Math.min(30, Math.max(5, Number(body.durationMinutes) || 10));
    if (!name || !adminName) return json({ error: 'room_and_admin_name_required' }, 400);
    const adminToken = crypto.randomUUID();
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      try {
        const participantToken = crypto.randomUUID();
        const participant = { id: crypto.randomUUID(), name: adminName };
        await env.DB.batch([
          env.DB.prepare('INSERT INTO rooms (code, name, admin_token, status, duration_minutes, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(code, name, adminToken, 'waiting', durationMinutes, Date.now()),
          env.DB.prepare('INSERT INTO participants (id, room_code, name, name_key, session_token, joined_at) VALUES (?, ?, ?, ?, ?, ?)').bind(participant.id, code, participant.name, nameKey(participant.name), participantToken, Date.now()),
        ]);
        return json({ code, name, status: 'waiting', adminToken, participantToken, participantName: adminName, participants: [participant] }, 201);
      } catch (error) {
        if (attempt === 11) throw error;
      }
    }
  }
  if (body.action === 'join') {
    const code = normalizeCode(body.code);
    const name = normalizeName(body.name);
    if (code.length !== 6 || !name) return json({ error: 'invalid_join' }, 400);
    const room = await env.DB.prepare('SELECT status FROM rooms WHERE code = ?').bind(code).first<{ status: string }>();
    if (!room) return json({ error: 'room_not_found' }, 404);
    if (room.status !== 'waiting') return json({ error: 'room_started' }, 409);
    const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM participants WHERE room_code = ?').bind(code).first<{ count: number }>();
    if (count && count.count >= 100) return json({ error: 'room_full' }, 409);
    const duplicate = await env.DB.prepare('SELECT id FROM participants WHERE room_code = ? AND (name_key = ? OR name = ? COLLATE NOCASE)').bind(code, nameKey(name), name).first();
    if (duplicate) return json({ error: 'duplicate_name' }, 409);
    const participantToken = crypto.randomUUID();
    try {
      await env.DB.prepare('INSERT INTO participants (id, room_code, name, name_key, session_token, joined_at) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), code, name, nameKey(name), participantToken, Date.now()).run();
    } catch {
      return json({ error: 'duplicate_name' }, 409);
    }
    return json({ ...(await getRoom(code)), participantToken, participantName: name });
  }
  if (body.action === 'leave') {
    const code = normalizeCode(body.code);
    const name = normalizeName(body.name);
    const participantToken = String(body.participantToken ?? '');
    const adminToken = String(body.adminToken ?? '');
    if (code.length !== 6 || !name) return json({ error: 'invalid_leave' }, 400);
    const room = await env.DB.prepare('SELECT admin_token FROM rooms WHERE code = ?').bind(code).first<{ admin_token: string }>();
    if (!room) return json({ ok: true });
    if (adminToken && adminToken === room.admin_token) {
      await env.DB.prepare('DELETE FROM participants WHERE room_code = ? AND name = ?').bind(code, name).run();
      return json({ ok: true });
    }
    if (!participantToken) return json({ error: 'forbidden' }, 403);
    await env.DB.prepare('DELETE FROM participants WHERE room_code = ? AND name = ? AND session_token = ?').bind(code, name, participantToken).run();
    return json({ ok: true });
  }
  return json({ error: 'invalid_action' }, 400);
}

export async function PATCH(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const code = normalizeCode(body.code);
  const adminToken = String(body.adminToken ?? '');
  const room = await env.DB.prepare('SELECT admin_token, status, duration_minutes FROM rooms WHERE code = ?').bind(code).first<{ admin_token: string; status: string; duration_minutes: number }>();
  if (!room || room.admin_token !== adminToken) return json({ error: 'forbidden' }, 403);
  if (body.action === 'start') {
    const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM participants WHERE room_code = ?').bind(code).first<{ count: number }>();
    if (!count || count.count < 2) return json({ error: 'need_more_participants' }, 409);
    const endsAt = Date.now() + room.duration_minutes * 60 * 1000;
    await env.DB.prepare("UPDATE rooms SET status = 'started', ends_at = ? WHERE code = ?").bind(endsAt, code).run();
  } else if (body.action === 'test_final') {
    if (room.status !== 'started') return json({ error: 'room_not_started' }, 409);
    await env.DB.prepare('UPDATE rooms SET ends_at = ? WHERE code = ?').bind(Date.now() + 15_000, code).run();
  } else if (body.action === 'update_deck' && Array.isArray(body.deck)) {
    if (room.status !== 'waiting') return json({ error: 'game_already_started' }, 409);
    const allowedTones = new Set(['bg-[#fff5d7]', 'bg-[#e7f3e9]', 'bg-[#fde8e4]', 'bg-[#eee8fa]', 'bg-[#fff0bd]', 'bg-[#e5f1f5]', 'bg-[#f9e6ef]', 'bg-[#e8edfa]', 'bg-[#fff0d9]', 'bg-[#f6e5dc]', 'bg-[#e5eee8]']);
    const deck = body.deck.slice(0, 24).map((raw, index) => {
      const card = raw as Record<string, unknown>;
      return {
        id: Number.isInteger(Number(card.id)) ? Number(card.id) : index + 1,
        th: String(card.th ?? '').trim().slice(0, 400),
        en: String(card.en ?? '').trim().slice(0, 400),
        imageIndex: Math.min(12, Math.max(1, Number(card.imageIndex) || 1)),
        tone: allowedTones.has(String(card.tone)) ? String(card.tone) : 'bg-[#fff5d7]',
      };
    }).filter((card) => card.th && card.en);
    if (deck.length === 0) return json({ error: 'deck_required' }, 400);
    const thaiMessages = deck.map((card) => card.th.toLocaleLowerCase());
    const englishMessages = deck.map((card) => card.en.toLocaleLowerCase());
    if (new Set(thaiMessages).size !== deck.length || new Set(englishMessages).size !== deck.length) {
      return json({ error: 'duplicate_card_message' }, 409);
    }
    await env.DB.prepare('UPDATE rooms SET deck_json = ? WHERE code = ?').bind(JSON.stringify(deck), code).run();
  } else if (body.action === 'remove_participant') {
    const participantName = normalizeName(body.name);
    if (!participantName) return json({ error: 'participant_required' }, 400);
    await env.DB.batch([
      env.DB
        .prepare('DELETE FROM participants WHERE room_code = ? AND (name_key = ? OR name = ? COLLATE NOCASE)')
        .bind(code, nameKey(participantName), participantName),
      env.DB.prepare('DELETE FROM sent_cards WHERE room_code = ? AND (recipient_name = ? OR sender_name = ?)').bind(code, participantName, participantName),
    ]);
  } else if (body.action === 'update_participants' && Array.isArray(body.participants)) {
    const normalizedNames = body.participants.map(normalizeName).filter(Boolean);
    const names = normalizedNames.filter((name, index) => normalizedNames.findIndex((candidate) => nameKey(candidate) === nameKey(name)) === index).slice(0, 100);
    const existing = await env.DB.prepare('SELECT id, name FROM participants WHERE room_code = ?').bind(code).all<{ id: string; name: string }>();
    await env.DB.batch([
      ...existing.results.filter((person) => !names.includes(person.name)).map((person) => env.DB.prepare('DELETE FROM participants WHERE id = ?').bind(person.id)),
      ...names.filter((name) => !existing.results.some((person) => person.name === name)).map((name) => env.DB.prepare('INSERT INTO participants (id, room_code, name, name_key, joined_at) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), code, name, nameKey(name), Date.now())),
    ]);
  } else {
    return json({ error: 'invalid_action' }, 400);
  }
  return json(await getRoom(code));
}
