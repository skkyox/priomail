import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Signup failed' },
        { status: 400 }
      );
    }

    // Create user profile in public.profiles table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user?.id,
      email: data.user?.email,
      created_at: new Date(),
      tier: 'free',
    });

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Signup successful!',
      user: { id: data.user?.id, email: data.user?.email },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
