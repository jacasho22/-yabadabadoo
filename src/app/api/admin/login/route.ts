import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  validateAdminCredentials,
  createSession,
} from '@/lib/admin-auth';

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const LOGIN_RATE_LIMIT = 5; // 5 attempts
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts) {
    return false;
  }

  if (now - attempts.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return false;
  }

  if (attempts.count >= LOGIN_RATE_LIMIT) {
    return true;
  }

  return false;
}

function incrementLoginAttempt(ip: string) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts || now - attempts.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    attempts.count++;
  }
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');

    if (!validateAdminCredentials(email, password)) {
      incrementLoginAttempt(ip);
      return NextResponse.json(
        { error: 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    resetLoginAttempts(ip);
    const sessionId = await createSession(email);

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'No se pudo iniciar sesión.' },
      { status: 500 }
    );
  }
}
