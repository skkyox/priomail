/**
 * Environment Variables Configuration
 * This file validates that all required secrets are properly configured
 */

const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',
  SUPABASE_SERVICE_ROLE_KEY: 'Supabase service role key',
  
  // Authentication
  JWT_SECRET: 'JWT signing secret',
  
  // OpenAI
  OPENAI_API_KEY: 'OpenAI API key',
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'Stripe publishable key',
  STRIPE_SECRET_KEY: 'Stripe secret key',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: 'Google OAuth client ID',
  GOOGLE_CLIENT_SECRET: 'Google OAuth client secret',
  GOOGLE_REDIRECT_URI: 'Google OAuth redirect URI',
};

/**
 * Validate that all required environment variables are configured
 */
export function validateEnv() {
  const missing: string[] = [];
  
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];
    if (!value || value === `your-${key.toLowerCase()}`) {
      missing.push(`${key}: ${description}`);
    }
  }
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing or unconfigured environment variables:');
    missing.forEach(m => console.warn(`  - ${m}`));
    
    // In production, this should fail
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

/**
 * Safe access to environment variables
 */
export const env = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.SESSION_EXPIRES_IN || '7d',
  },
  
  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  // Stripe
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  
  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
  },
  
  // URLs
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    internalUrl: process.env.API_URL || 'http://localhost:5000',
  },
};

// Validate on module load (non-fatal in development)
if (typeof window === 'undefined') {
  // Server-side only validation
  validateEnv();
}
