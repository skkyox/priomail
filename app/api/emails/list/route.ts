import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
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

    // Get emails for user's accounts
    const { data: accounts } = await supabase
      .from('email_accounts')
      .select('id')
      .eq('user_id', userId);

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        emails: [],
        message: 'No email accounts connected',
      });
    }

    const accountIds = accounts.map((a) => a.id);

    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .in('account_id', accountIds)
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
