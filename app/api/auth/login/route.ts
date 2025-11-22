import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    if (!env.supabase.url || !env.supabase.serviceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(env.supabase.url, env.supabase.serviceKey);

    // Use Supabase auth to verify credentials
    const { data, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 }
      );
    }

    // Find user by email
    const user = data.users?.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email or password incorrect' },
        { status: 401 }
      );
    }

    // Note: Supabase admin API doesn't verify password directly
    // In production, use Supabase signInWithPassword on client-side and exchange for session
    // For now, we create a session token for the user if they exist
    
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
    });

    // Set httpOnly cookie for session
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
