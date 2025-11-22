import { NextRequest, NextResponse } from 'next/server';
import { getGmailClient } from '@/lib/google-client';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config';

interface EmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  internalDate: string;
  payload?: {
    headers: Array<{ name: string; value: string }>;
    parts?: Array<any>;
    body?: { data?: string };
  };
  historyId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, accountId, userId, email } = await request.json();

    if (!accessToken || !accountId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const gmail = getGmailClient(accessToken);

    // First, ensure the email account exists in Supabase
    if (!env.supabase.url || !env.supabase.serviceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(env.supabase.url, env.supabase.serviceKey);

    // Create or update email_accounts entry
    const { error: accountError } = await supabase
      .from('email_accounts')
      .upsert({
        id: accountId,
        user_id: null,
        email_address: email,
        provider: 'gmail',
        access_token: accessToken,
        is_connected: true,
        last_sync: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (accountError) {
      console.error('Account creation error:', accountError);
      return NextResponse.json(
        { error: `Failed to create email account: ${accountError.message}` },
        { status: 500 }
      );
    }

    // Get messages from Gmail
    const messagesResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      q: 'is:inbox',
    });

    const messages = messagesResponse.data.messages || [];

    // Fetch full message details
    const emailsData = await Promise.all(
      messages.slice(0, 10).map(async (msg) => {
        const messageDetail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'full',
        });

        const payload = messageDetail.data.payload;
        const headers = payload?.headers || [];

        const getHeader = (name: string) => {
          return headers.find((h) => h.name === name)?.value || '';
        };

        const subject = getHeader('Subject');
        const sender = getHeader('From');
        const date = getHeader('Date');

        // Get body
        let body = '';
        if (payload?.parts) {
          const textPart = payload.parts.find((p) => p.mimeType === 'text/plain');
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        } else if (payload?.body?.data) {
          body = Buffer.from(payload.body.data, 'base64').toString();
        }

        return {
          remote_id: msg.id,
          subject,
          sender,
          sender_name: sender.split('<')[0].trim(),
          body_text: body.substring(0, 1000), // Limit to 1000 chars
          received_at: new Date(date).toISOString(),
          is_read: !msg.labelIds?.includes('UNREAD'),
          account_id: accountId,
        };
      })
    );

    // Save emails to Supabase
    // Insert emails (ignore duplicates)
    const { error, data } = await supabase.from('emails').upsert(emailsData, {
      onConflict: 'account_id,remote_id',
    });

    if (error) {
      console.error('Database error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { 
          error: `Database error: ${error.message}`,
          details: error.details || error.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      synced: emailsData.length,
      message: `Successfully synced ${emailsData.length} emails`,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: `Failed to sync emails: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
