/* Admin session: an expiry timestamp signed with HMAC-SHA256 (Web Crypto, so it also runs in middleware).
   The key includes ADMIN_PASSWORD, so changing the password signs everyone out.
   Without ADMIN_PASSWORD the admin stays closed. */

export const SESSION_COOKIE = 'up_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();
const key = () => {
  const password = process.env.ADMIN_PASSWORD;
  return password ? `${process.env.ADMIN_SESSION_SECRET ?? ''}|${password}` : null;
};
export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

async function sign(message: string, secret: string) {
  const k = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', k, encoder.encode(message)));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compare fixed-length digests so the comparison time does not depend on the input.
  return sameString(await sign(input, 'compare'), await sign(password, 'compare'));
}

export async function createSession() {
  const secret = key();
  if (!secret) throw new Error('ADMIN_PASSWORD is not set');
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE);
  return `${expires}.${await sign(expires, secret)}`;
}

export async function verifySession(token: string | undefined) {
  const secret = key();
  if (!secret || !token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  return sameString(signature, await sign(expires, secret));
}
