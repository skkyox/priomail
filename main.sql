-- Table des utilisateurs (étend l'auth Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL,
  email TEXT,
  subscription_status TEXT DEFAULT 'trial', -- active, cancelled, past_due
  stripe_customer_id TEXT,
  PRIMARY KEY (id)
);

-- Comptes emails connectés (Gmail, Outlook...)
CREATE TABLE public.email_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  provider TEXT, -- 'google', 'outlook', 'imap'
  email_address TEXT,
  access_token TEXT, -- Encrypted!
  refresh_token TEXT -- Encrypted!
);

-- Les emails synchronisés et traités
CREATE TABLE public.emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.email_accounts(id),
  remote_id TEXT, -- ID unique chez le provider (Gmail ID)
  subject TEXT,
  sender TEXT,
  body_text TEXT,
  received_at TIMESTAMPTZ,
  
  -- Champs IA
  ai_category TEXT, -- 'Devis', 'Facture', 'Urgent', 'Spam', 'Info'
  ai_urgency_score INT, -- 0 à 100
  ai_summary TEXT,
  ai_suggested_reply TEXT,
  ai_sentiment TEXT, -- 'Positive', 'Negative', 'Neutral'
  
  is_processed BOOLEAN DEFAULT FALSE
);
