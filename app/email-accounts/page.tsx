'use client';

import { useState, useEffect } from 'react';
import { Mail, Plus, Loader, RefreshCw } from 'lucide-react';

interface EmailAccount {
  id: string;
  email_address: string;
  provider: string;
  is_connected: boolean;
  last_sync: string | null;
}

export default function EmailAccounts() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load existing accounts from localStorage
    const loadStoredAccounts = () => {
      try {
        const stored = localStorage.getItem('email_accounts');
        if (stored) {
          setAccounts(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load stored accounts:', error);
      }
    };

    loadStoredAccounts();

    // Load email accounts from URL params (from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('success')) {
      const email = params.get('email') || '';
      const accessToken = params.get('access_token') || '';
      const refreshToken = params.get('refresh_token') || '';

      if (accessToken) {
        saveEmailAccount(email, accessToken, refreshToken);
      }
    }

    if (params.get('error')) {
      setMessage(`OAuth error: ${params.get('error')}`);
    }

    setLoading(false);
  }, []);

  const saveEmailAccount = async (
    email: string,
    accessToken: string,
    refreshToken: string
  ) => {
    try {
      // In MVP, store in localStorage since we don't have proper session handling
      const newAccount = {
        id: Date.now().toString(),
        email_address: email,
        provider: 'gmail',
        is_connected: true,
        last_sync: null,
      };

      // Store tokens in localStorage (⚠️ Not production ready - use encrypted storage in production)
      localStorage.setItem(
        `gmail_tokens_${newAccount.id}`,
        JSON.stringify({ accessToken, refreshToken })
      );

      const updatedAccounts = [...accounts, newAccount];
      localStorage.setItem('email_accounts', JSON.stringify(updatedAccounts));
      setAccounts(updatedAccounts);
      setMessage(`Connected ${email} successfully!`);

      // Sync emails
      syncEmails(newAccount.id, accessToken);
    } catch (error) {
      setMessage('Failed to save email account');
      console.error('Save account error:', error);
    }
  };

  const syncEmails = async (accountId: string, accessToken: string) => {
    setSyncing(true);
    try {
      const response = await fetch('/api/emails/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accessToken,
          accountId,
          userId: 'current-user-id',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✓ ${data.synced || 0} emails synchronisés`);
      } else {
        setMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to sync emails');
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectGmail = () => {
    window.location.href = '/api/emails/oauth/start';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Comptes Email
          </h1>
          <p className="text-gray-600">
            Connectez vos comptes email pour que Smart Inbox puisse les analyser
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
            {message}
          </div>
        )}

        {/* Connected Accounts */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Comptes Connectés</h2>

          {accounts.length === 0 ? (
            <p className="text-gray-600">Aucun compte connecté</p>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{account.email_address}</p>
                      <p className="text-sm text-gray-500">
                        {account.provider.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        account.is_connected ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {account.last_sync && (
                      <p className="text-sm text-gray-500">
                        Dernière sync: {new Date(account.last_sync).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        const tokens = JSON.parse(
                          localStorage.getItem(`gmail_tokens_${account.id}`) || '{}'
                        );
                        if (tokens.accessToken) {
                          syncEmails(account.id, tokens.accessToken);
                        }
                      }}
                      disabled={syncing}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                    >
                      {syncing ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Sync...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Resync</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connect Gmail Button */}
        <button
          onClick={handleConnectGmail}
          disabled={loading || syncing}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {syncing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Synchronisation en cours...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Connecter un Compte Gmail</span>
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">🔐 Comment ça marche?</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Vous donnez la permission à Smart Inbox de lire vos emails</li>
            <li>✓ Aucune donnée n'est stockée sans votre permission</li>
            <li>✓ Vous pouvez révoquer l'accès à tout moment</li>
            <li>✓ Vos passwords ne sont jamais partagés</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
