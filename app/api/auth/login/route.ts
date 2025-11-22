import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Mock implementation - in production use Supabase
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    return NextResponse.json({
      message: 'Login successful',
      token: 'mock-token',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
