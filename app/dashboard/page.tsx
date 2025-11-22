'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, AlertCircle, FileText, Send, Settings } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  sender: string;
  ai_category: string;
  ai_urgency_score: number;
  ai_summary: string;
  received_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if session cookie exists (middleware already protects this route)
      // For now, just set a placeholder user object
      setUser({ email: 'user@example.com' });
      
      // Charger les emails (simulation pour maintenant)
      const mockEmails: Email[] = [
        {
          id: '1',
          subject: 'Devis pour votre projet',
          sender: 'client@example.com',
          ai_category: 'Devis',
          ai_urgency_score: 85,
          ai_summary: 'Client demande un devis pour développement web',
          received_at: new Date().toISOString(),
        },
        {
          id: '2',
          subject: 'Newsletter hebdomadaire',
          sender: 'newsletter@tech.com',
          ai_category: 'Newsletter',
          ai_urgency_score: 20,
          ai_summary: 'Dernières actualités technologiques',
          received_at: new Date().toISOString(),
        },
      ];
      setEmails(mockEmails);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Urgent': 'bg-red-100 text-red-800',
      'Devis': 'bg-blue-100 text-blue-800',
      'Facture': 'bg-green-100 text-green-800',
      'Newsletter': 'bg-gray-100 text-gray-800',
      'Personnel': 'bg-purple-100 text-purple-800',
      'Autre': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">📧 Smart Inbox</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={() => router.push('/email-accounts')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Settings className="w-4 h-4" />
              <span>Comptes Email</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Mail className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-600 text-sm">Emails reçus</p>
            <p className="text-2xl font-bold">{emails.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
            <p className="text-gray-600 text-sm">Urgents</p>
            <p className="text-2xl font-bold">{emails.filter(e => e.ai_urgency_score > 80).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FileText className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-600 text-sm">Devis & Factures</p>
            <p className="text-2xl font-bold">{emails.filter(e => ['Devis', 'Facture'].includes(e.ai_category)).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Send className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-gray-600 text-sm">À traiter</p>
            <p className="text-2xl font-bold">{emails.filter(e => e.ai_urgency_score > 50).length}</p>
          </div>
        </div>

        {/* Emails Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emails.map((email) => (
            <div key={email.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{email.subject}</h3>
                  <p className="text-sm text-gray-500">{email.sender}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(email.ai_category)}`}>
                  {email.ai_category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{email.ai_summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className={`h-2 rounded-full ${
                      email.ai_urgency_score > 80 ? 'bg-red-600' :
                      email.ai_urgency_score > 50 ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}
                    style={{ width: `${email.ai_urgency_score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{email.ai_urgency_score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
