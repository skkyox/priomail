# Smart Inbox - Installation Guide

Welcome! This guide will help you set up the Smart Inbox project locally for development.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ and npm installed
- **Git** for version control
- **Supabase** account (free tier is fine for development)
- **Google OAuth credentials** (for Gmail integration)
- **Stripe account** (for payment testing)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-inbox
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

**This is the most important step!**

We use environment variables to store sensitive configuration. Here's how:

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **What is `.env.example`?**
   - It's a template file showing ALL environment variables you need
   - It contains placeholder values (NOT real credentials)
   - It's safe to commit to git (no secrets inside)
   - Every developer copies it to `.env.local` to set their own values

3. **Edit `.env.local` with your credentials:**
   ```bash
   # Use your favorite editor
   nano .env.local
   # or
   code .env.local
   ```

4. **Get your credentials:**

   | Variable | Where to get it |
   |----------|----------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API |
   | `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |
   | `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 Credentials |
   | `GOOGLE_CLIENT_SECRET` | Google Cloud Console (same location) |
   | `GOOGLE_REDIRECT_URI` | `http://localhost:3000/api/emails/oauth/callback` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
   | `STRIPE_SECRET_KEY` | Stripe Dashboard |

5. **⚠️ Important Security Notes:**
   - `.env.local` is in `.gitignore` - NEVER commit it
   - `.env.example` has no real secrets - safe to commit
   - Always use `.env.local` for local development

### 4. Set Up the Database

**Important: Run this SQL in your Supabase dashboard to set up tables correctly:**

1. Go to your Supabase project → SQL Editor
2. Click "New query"
3. Paste this SQL:

```sql
-- Drop existing tables
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS email_accounts CASCADE;

-- Create email_accounts (NO foreign key to auth.users)
CREATE TABLE email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email_address TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  is_connected BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  remote_id TEXT NOT NULL,
  subject TEXT,
  sender TEXT,
  sender_name TEXT,
  body_text TEXT,
  received_at TIMESTAMP WITH TIME ZONE,
  ai_category TEXT,
  ai_urgency_score INT DEFAULT 50,
  ai_summary TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, remote_id)
);

-- Create indexes for performance
CREATE INDEX idx_emails_account_id ON emails(account_id);
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_email_accounts_user_id ON email_accounts(user_id);

-- Disable RLS to avoid authentication issues in MVP
ALTER TABLE email_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE emails DISABLE ROW LEVEL SECURITY;
```

4. Click "Run" to execute
5. Done! Your database is ready

### 5. Run the Development Server

```bash
npm run dev
```

The app will start at **http://localhost:5000** (configured for Replit compatibility)

### 6. Test the Application

1. Open http://localhost:5000 in your browser
2. Sign up with a test email
3. Go to "Comptes Email" (Email Accounts)
4. Click "Connecter un Compte Gmail" (Connect Gmail Account)
5. Authenticate with Google
6. Click "Resync" to fetch emails

## 📁 Project Structure

```
smart-inbox/
├── app/                      # Next.js app directory
│   ├── api/                  # Backend API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── emails/          # Email sync & management
│   │   └── stripe/          # Payment webhooks
│   ├── dashboard/           # Main dashboard (protected)
│   ├── email-accounts/      # Gmail account management
│   ├── login/               # Login page
│   ├── signup/              # Registration page
│   └── pricing/             # Pricing page
├── components/              # Reusable React components
├── lib/                     # Utility functions & configuration
│   ├── config.ts           # Environment & constants
│   ├── google-client.ts    # Gmail API client
│   ├── supabase.ts         # Supabase client setup
│   └── store.ts            # Zustand state management
├── public/                 # Static assets
├── .env.example           # Environment variables template (commit this)
├── .env.local             # Local env vars (DO NOT commit)
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
└── package.json           # Dependencies
```

## 🔧 Common Development Tasks

### Add a New Environment Variable

1. Add it to `.env.example`:
   ```
   NEW_VARIABLE=example_value
   ```

2. Add it to `.env.local` with your actual value

3. Use it in code:
   ```typescript
   import { env } from '@/lib/config';
   const value = env.yourVariable;
   ```

### Run Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
```

### Format Code

```bash
npm run format
```

## 🐛 Troubleshooting

### "Failed to create email account" Error

- Make sure your `.env.local` has valid credentials
- Check that Google OAuth credentials are correct
- Verify Supabase URL and keys are correct

### Cannot connect to database

- Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Ensure your Supabase project is active
- Check internet connection

### "violates foreign key constraint" Error

If you get: `violates foreign key constraint "email_accounts_user_id_fkey"`

This means your database still has the old schema with a foreign key to `auth.users`. **Run the database setup SQL above to fix it** (in step 4).

### Gmail won't authenticate

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Make sure redirect URI matches: `http://localhost:5000/api/emails/oauth/callback`
- Check that Gmail API is enabled in Google Cloud Console

### Port 5000 already in use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📚 Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o-mini
- **Payments:** Stripe
- **Email API:** Gmail API
- **State Management:** Zustand

## 🌐 API Documentation

### Email Sync
```
POST /api/emails/sync
Body: { accessToken, accountId, email }
```

### List Emails
```
GET /api/emails/list?limit=50
```

### Gmail OAuth Flow
```
1. GET /api/emails/oauth/start → Google auth page
2. Google redirects → /api/emails/oauth/callback
3. Redirects back to app with tokens
```

## 📖 Language

- **UI:** French (français)
- **Code Comments:** English & French
- **API Responses:** English

## 🤝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create pull request
git push origin feature/my-feature
```

## 💡 Tips for New Developers

1. **Always copy `.env.example` to `.env.local`** - it's the first step!
2. Start by exploring the `/app/email-accounts/page.tsx` to understand the flow
3. Check `/lib/config.ts` to see how environment variables are loaded
4. Frontend is in French - use `locale/fr.json` for translations
5. Use the Supabase dashboard to inspect database directly
6. Test Gmail OAuth on a separate Google account first

## ❓ Need Help?

- Check the troubleshooting section above
- Review `.env.example` to ensure all variables are set
- Check server logs for detailed error messages
- Ask your team lead or create an issue

---

**Happy coding! 🚀**
