import { env } from 'cloudflare:workers';

const json = (data: unknown, status = 200) => Response.json(data, { status });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = (url.searchParams.get('code') ?? '').replace(/\D/g, '').slice(0, 6);
  const recipient = (url.searchParams.get('recipient') ?? '').trim().slice(0, 60);
  if (code.length !== 6 || !recipient) return json({ error: 'invalid_request' }, 400);
  const result = await env.DB.prepare('SELECT id, card_id AS cardId, sender_name AS senderName, anonymous FROM sent_cards WHERE room_code = ? AND recipient_name = ? ORDER BY sent_at').bind(code, recipient).all();
  return json({ cards: result.results });
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const code = String(body.code ?? '').replace(/\D/g, '').slice(0, 6);
  const recipientName = String(body.recipientName ?? '').trim().slice(0, 60);
  const senderName = String(body.senderName ?? '').trim().slice(0, 60);
  const cardId = Number(body.cardId);
  if (code.length !== 6 || !recipientName || !senderName || !Number.isInteger(cardId) || cardId < 1) return json({ error: 'invalid_card' }, 400);
  const members = await env.DB.prepare('SELECT name FROM participants WHERE room_code = ? AND name IN (?, ?)').bind(code, recipientName, senderName).all();
  if (members.results.length !== 2) return json({ error: 'participant_not_found' }, 404);
  await env.DB.prepare('INSERT INTO sent_cards (id, room_code, card_id, recipient_name, sender_name, anonymous, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), code, cardId, recipientName, senderName, body.anonymous ? 1 : 0, Date.now()).run();
  return json({ ok: true }, 201);
}
