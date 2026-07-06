import { cookies } from 'next/headers';

/**
 * Minimal session seam for M2. Full Auth.js lands in M5; until then a signed-in
 * user is identified by a `struq_uid` cookie holding the users.id UUID. Nothing
 * sets this cookie yet, so `getSessionUserId()` returns null in this slice and
 * the client hooks fall back to localStorage — the DB-backed favorites path is
 * wired and dormant, ready for M5 to flip on by issuing the cookie at login.
 */

const UID_COOKIE = 'struq_uid';

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const uid = store.get(UID_COOKIE)?.value;
  return uid && uid.length > 0 ? uid : null;
}

export { UID_COOKIE };
