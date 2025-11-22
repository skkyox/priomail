import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, getUserInfo } from '@/lib/google-client';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(new URL('/email-accounts?error=access_denied', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/email-accounts?error=no_code', request.url));
    }

    // Get tokens from Google
    const tokens = await getTokensFromCode(code);
    const userInfo = await getUserInfo(tokens.access_token || '');

    // Get user from session cookie
    const sessionToken = request.cookies.get('session-token')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // For MVP, store tokens with temporary user ID
    // In production, decode JWT to get actual user ID
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.redirect(new URL('/email-accounts?error=config', request.url));
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For MVP, store in localStorage or pass via URL
    // In production, decrypt session and get user ID properly
    const emailAddress = userInfo.emailAddresses?.[0]?.value || 'unknown@gmail.com';
    
    const redirectUrl = new URL('/email-accounts', request.url);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('email', emailAddress);
    redirectUrl.searchParams.set('access_token', tokens.access_token || '');
    redirectUrl.searchParams.set('refresh_token', tokens.refresh_token || '');

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/email-accounts?error=callback_failed', request.url));
  }
}
