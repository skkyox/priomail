import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!env.supabase.url || !env.supabase.serviceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(env.supabase.url, env.supabase.serviceKey);

    // MVP mode: Use a fixed user ID for all data
    const MVP_USER_ID = '00000000-0000-0000-0000-000000000000';

    // Get all emails for MVP user
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .eq('user_id', MVP_USER_ID)
      .order('received_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch emails' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      emails: emails || [],
      total: emails?.length || 0,
    });
  } catch (error) {
    console.error('List emails error:', error);
    return NextResponse.json(
      { error: 'Failed to list emails' },
      { status: 500 }
    );
  }
}
