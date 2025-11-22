import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

    // Create user profile in public.profiles table using REST API
    try {
      const profileResponse = await fetch(`${env.supabase.url}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.supabase.serviceKey}`,
          'apikey': env.supabase.serviceKey,
        },
        body: JSON.stringify({
          id: data.user?.id,
          email: data.user?.email,
          subscription_tier: 'free',
        }),
      });

      if (!profileResponse.ok) {
        console.error('Profile creation failed:', await profileResponse.text());
        // Continue anyway - auth is created, profile can be created later
      }
    } catch (profileErr) {
      console.error('Profile creation error:', profileErr);
      // Continue anyway
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
