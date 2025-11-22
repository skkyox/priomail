import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-client';

export async function GET(request: NextRequest) {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth start error:', error);
    return NextResponse.json(
      { error: 'Failed to start OAuth flow' },
      { status: 500 }
    );
  }
}
