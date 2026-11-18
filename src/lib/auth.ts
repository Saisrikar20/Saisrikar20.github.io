/**
 * Cryptographic authentication utility for Admin CMS protection.
 * Uses the Web Crypto API (supported natively across Edge Middleware & Node.js).
 * Ensures zero plaintext passwords are ever stored in cookies or exposed over the wire.
 */

const AUTH_SALT = process.env.ADMIN_SALT || 'saisrikar-defensive-salt-2026';

export async function computeToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + AUTH_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminToken(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue || typeof cookieValue !== 'string') return false;
  const adminPassword = process.env.ADMIN_PASSWORD || 'saisrikar-admin-2026';
  const expectedToken = await computeToken(adminPassword);
  return cookieValue === expectedToken;
}

export async function verifyPassword(
  inputPassword: string
): Promise<{ valid: boolean; token: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD || 'saisrikar-admin-2026';
  const expectedToken = await computeToken(adminPassword);
  const inputToken = await computeToken(inputPassword);

  return {
    valid: inputToken === expectedToken,
    token: expectedToken,
  };
}
