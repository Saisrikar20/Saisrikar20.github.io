import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid administrator credentials.' },
        { status: 400 }
      );
    }

    const { valid, token } = await verifyPassword(password);

    if (!valid) {
      // Artificial delay to mitigate timing attacks and automated brute-force attempts
      await new Promise((resolve) => setTimeout(resolve, 350));
      return NextResponse.json(
        { error: 'Invalid credentials. Access denied.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Access granted.',
    });

    // Store strictly the cryptographically hashed token in an HttpOnly, SameSite=Strict cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: 'Server authentication fault.' },
      { status: 500 }
    );
  }
}
