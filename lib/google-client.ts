import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/emails/oauth/callback';

export const getOAuthClient = () => {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
};

export const getAuthUrl = () => {
  const oauth2Client = getOAuthClient();
  
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent screen for offline access
  });

  return authUrl;
};

export const getTokensFromCode = async (code: string) => {
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const getGmailClient = (accessToken: string) => {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });
  
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

export const getUserInfo = async (accessToken: string) => {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const people = google.people({ version: 'v1', auth: oauth2Client });
  const response = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names',
  });

  return response.data;
};
