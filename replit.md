# Smart Inbox - SaaS Platform

## Project Overview
AI-powered email management platform for automated email sorting and prioritization. Users connect their Gmail accounts via OAuth, and emails are automatically analyzed and categorized by AI.

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI Engine**: OpenAI GPT-4o-mini
- **Payments**: Stripe
- **Email API**: Gmail API via Google OAuth
- **State Management**: Zustand
- **Language**: French UI

## Architecture

### Database Schema (Supabase PostgreSQL)
```sql
-- Users via Supabase Auth
-- profiles: user metadata (tier, subscription)
-- email_accounts: Gmail connections with OAuth tokens
-- emails: synced emails with AI analysis results
-- subscriptions: Stripe subscription tracking
```

### API Routes Structure
```
/api/auth/
  ├── signup/route.ts        → User registration
  ├── login/route.ts         → User authentication
  └── logout/route.ts        → Session termination

/api/emails/
  ├── oauth/
  │   ├── start/route.ts     → Redirect to Google OAuth
  │   └── callback/route.ts  → Handle Google callback
  ├── sync/route.ts          → Fetch emails from Gmail
  ├── list/route.ts          → Retrieve user's emails
  └── route.ts               → Email management

/api/stripe/
  └── webhook/route.ts       → Stripe payment webhooks

/api/health/route.ts         → Health check endpoint
```

### Pages & Components
```
/app/
  ├── page.tsx              → Landing page (marketing)
  ├── layout.tsx            → Root layout with navigation
  ├── globals.css           → Global styles
  ├── login/page.tsx        → User login page
  ├── signup/page.tsx       → User registration page
  ├── dashboard/page.tsx    → Main dashboard (protected)
  ├── email-accounts/page.tsx → Gmail account management
  └── pricing/page.tsx      → Pricing plans

/components/
  ├── navbar.tsx            → Navigation bar
  └── email-card.tsx        → Email list item component

/lib/
  ├── supabase.ts           → Supabase client setup
  ├── google-client.ts      → Gmail API client
  ├── ai-engine.ts          → OpenAI integration
  └── store.ts              → Zustand state management
```

## Features Implemented

### ✅ Authentication System
- Sign up with email/password
- Login with JWT sessions (7-day expiration)
- Secure httpOnly cookies
- Protected routes via middleware
- Logout functionality
- Database migrations complete

### ✅ Gmail Integration
- Google OAuth 2.0 flow
- Email sync from Gmail API
- Multiple account support
- Token storage in database
- Email list with filters

### ✅ Frontend UI
- Marketing landing page (French)
- Responsive design with Tailwind CSS
- Navigation with sign in/sign up
- Protected dashboard
- Email accounts management page
- Pricing page with tiers

### ⏳ In Development
- AI email analysis (GPT-4o-mini)
- Stripe payment integration
- Background sync jobs
- Email categorization dashboard

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL        = Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   = Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY       = Supabase admin key (server-only)
OPENAI_API_KEY                  = OpenAI API key (from integrations)
NEXT_PUBLIC_STRIPE_PUBLISHABLE  = Stripe public key
STRIPE_SECRET_KEY               = Stripe secret key
GOOGLE_CLIENT_ID                = Google OAuth client ID
GOOGLE_CLIENT_SECRET            = Google OAuth client secret
GOOGLE_REDIRECT_URI             = OAuth callback URL
```

## Deployment Status
- ✅ Development server running
- ✅ Database connected
- ⏳ Ready for production deployment

## Next Priority Features
1. **AI Email Analysis** - Categorize and score emails by urgency
2. **Stripe Payments** - Implement subscription billing
3. **Background Sync** - Hourly automatic email synchronization
4. **Token Encryption** - Secure sensitive data storage
5. **Email Analytics** - Dashboard with email insights

## Project Structure Cleanup
- ✅ Removed old documentation files
- ✅ Removed deprecated source files (app.js, index.ts)
- ✅ Organized API routes by feature
- ✅ Consolidated all guides into this file

---

**Last Updated**: November 22, 2025
**Status**: Alpha - Core features complete, ready for payment integration
