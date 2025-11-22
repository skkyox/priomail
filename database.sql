-- ============================================
-- Smart Inbox - Complete Database Schema
-- ============================================

-- Table: Users/Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'trial', -- trial, active, cancelled, past_due
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, business
  email_sync_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Email Accounts (Gmail, Outlook, IMAP)
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'gmail', 'outlook', 'imap'
  email_address TEXT NOT NULL,
  imap_host TEXT,
  imap_port INT DEFAULT 993,
  access_token TEXT,
  refresh_token TEXT,
  encrypted_password TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, email_address)
);

-- Table: Emails (synced and analyzed)
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  remote_id TEXT,
  subject TEXT,
  sender TEXT,
  sender_name TEXT,
  body_text TEXT,
  body_html TEXT,
  received_at TIMESTAMP,
  
  -- AI Analysis Fields
  ai_category TEXT,
  ai_urgency_score INT DEFAULT 50,
  ai_summary TEXT,
  ai_sentiment TEXT,
  ai_suggested_reply TEXT,
  
  -- Flags
  is_read BOOLEAN DEFAULT FALSE,
  is_processed BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, remote_id)
);

-- Table: User Actions (Email replies, archives, etc.)
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'replied', 'archived', 'starred', 'deleted'
  action_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject_template TEXT,
  body_template TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Dashboard Statistics
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_emails INT DEFAULT 0,
  urgent_count INT DEFAULT 0,
  processed_count INT DEFAULT 0,
  stats_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, stats_date)
);

-- Indexes for Performance
CREATE INDEX idx_emails_account_id ON emails(account_id);
CREATE INDEX idx_emails_received_at ON emails(received_at DESC);
CREATE INDEX idx_emails_urgency ON emails(ai_urgency_score DESC);
CREATE INDEX idx_email_accounts_user_id ON email_accounts(user_id);
CREATE INDEX idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX idx_user_actions_email_id ON user_actions(email_id);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- Views for Dashboard
CREATE OR REPLACE VIEW urgent_emails AS
SELECT 
  e.id,
  e.subject,
  e.sender,
  e.ai_category,
  e.ai_urgency_score,
  e.ai_summary,
  e.received_at,
  ea.user_id
FROM emails e
JOIN email_accounts ea ON e.account_id = ea.id
WHERE e.ai_urgency_score > 80 AND e.is_read = FALSE;

CREATE OR REPLACE VIEW email_stats AS
SELECT 
  ea.user_id,
  COUNT(*) as total_emails,
  SUM(CASE WHEN e.ai_urgency_score > 80 THEN 1 ELSE 0 END) as urgent_count,
  SUM(CASE WHEN e.is_processed = TRUE THEN 1 ELSE 0 END) as processed_count,
  AVG(e.ai_urgency_score) as avg_urgency
FROM emails e
JOIN email_accounts ea ON e.account_id = ea.id
GROUP BY ea.user_id;
