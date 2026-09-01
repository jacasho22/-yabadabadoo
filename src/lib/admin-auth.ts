import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'yaba_admin_session';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours
const revokedTokens = new Map<string, number>();

// ---------------------------------------------------------------------------
// Secret key — falls back to a hard-coded dev key so the app works without
// an env variable, but you should set ADMIN_SESSION_SECRET in production.
// ---------------------------------------------------------------------------
function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'yaba-dev-secret-change-me-in-prod';
}

// ---------------------------------------------------------------------------
// Minimal HMAC-signed token  (no external JWT library needed)
// Format:  base64url(payload JSON).<hmac-sha256 hex>
// ---------------------------------------------------------------------------
function sign(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(data)
    .digest('hex');
  return `${data}.${sig}`;
}

function verify(token: string): Record<string, unknown> | null {
  try {
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const data = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    // Constant-time comparison to prevent timing attacks
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(data)
      .digest('hex');

    const expectedBuf = Buffer.from(expected, 'hex');
    const sigBuf = Buffer.from(sig, 'hex');
    if (expectedBuf.length !== sigBuf.length) return null;
    if (!crypto.timingSafeEqual(expectedBuf, sigBuf)) return null;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    return payload;
  } catch {
    return null;
  }
}

function cleanupRevokedTokens(now: number) {
  for (const [token, expiresAt] of revokedTokens.entries()) {
    if (expiresAt <= now) {
      revokedTokens.delete(token);
    }
  }
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------
export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? 'admin@camperyaba.com',
    password: process.env.ADMIN_PASSWORD ?? 'camperyaba123',
  };
}

export function validateAdminCredentials(email: string, password: string): boolean {
  try {
    const admin = getAdminCredentials();

    const emailBuf = Buffer.from(email);
    const adminEmailBuf = Buffer.from(admin.email);
    const passBuf = Buffer.from(password);
    const adminPassBuf = Buffer.from(admin.password);

    // Both comparisons must run (no short-circuit) to avoid timing leaks
    const emailsMatch =
      emailBuf.length === adminEmailBuf.length &&
      crypto.timingSafeEqual(emailBuf, adminEmailBuf);
    const passesMatch =
      passBuf.length === adminPassBuf.length &&
      crypto.timingSafeEqual(passBuf, adminPassBuf);

    return emailsMatch && passesMatch;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Session — now stateless: the token IS the session (no Map needed)
// ---------------------------------------------------------------------------
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    const now = Date.now();
    cleanupRevokedTokens(now);
    if (revokedTokens.has(token)) return false;

    const payload = verify(token);
    if (!payload) return false;

    const expiresAt = payload.expiresAt as number;
    if (!expiresAt || now > expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}

export async function createSession(email: string): Promise<string> {
  const now = Date.now();
  return sign({
    email,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  });
}

export async function destroySession(sessionId: string): Promise<void> {
  const payload = verify(sessionId);
  const expiresAt =
    typeof payload?.expiresAt === 'number'
      ? payload.expiresAt
      : Date.now() + SESSION_DURATION_MS;

  cleanupRevokedTokens(Date.now());
  revokedTokens.set(sessionId, expiresAt);
}

// ---------------------------------------------------------------------------
// Guard helper for API routes
// ---------------------------------------------------------------------------
export async function ensureAdminAccess() {
  if (await isAdminAuthenticated()) {
    return null;
  }

  return NextResponse.json(
    { error: 'Sesión no autorizada.' },
    { status: 401 }
  );
}

// Legacy export — kept for backward compatibility with any code that may
// reference it, but is no longer used internally.
export function generateSecureSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
