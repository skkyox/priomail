import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            📧 Smart Inbox
          </Link>
          <Link href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </header>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">Plans d'Abonnement</h1>
        <p className="text-center text-gray-600 mb-12">Choisissez le plan qui vous convient</p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Freemium */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4">Gratuit</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              0€ <span className="text-lg text-gray-600">/mois</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>1 compte email</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Tri basique IA</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>50 emails/jour</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-gray-300 mr-3" />
                <span>Réponses IA</span>
              </li>
            </ul>
            <Link href="/signup" className="w-full block text-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Commencer
            </Link>
          </div>

          {/* Pro - Popular */}
          <div className="bg-blue-50 border-2 border-blue-600 rounded-xl shadow-lg p-8 transform scale-105">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-4">Populaire</div>
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              19€ <span className="text-lg text-gray-600">/mois</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>3 comptes emails</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Tri avancé</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Réponses IA</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>1000 emails/jour</span>
              </li>
            </ul>
            <Link href="/signup" className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Souscrire
            </Link>
          </div>

          {/* Business */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4">Business</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              49€ <span className="text-lg text-gray-600">/mois</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Comptes illimités</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Extraction de données</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Support prioritaire</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span>Emails illimités</span>
              </li>
            </ul>
            <Link href="/signup" className="w-full block text-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Souscrire
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-8">Questions Fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Puis-je changer de plan?</h3>
              <p className="text-gray-600">Oui, vous pouvez changer de plan à tout moment. Les changements sont appliqués au prochain cycle de facturation.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Y a-t-il une période d'essai?</h3>
              <p className="text-gray-600">Oui, commencez avec le plan Gratuit et upgradez quand vous êtes prêt.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Qu'inclut le support prioritaire?</h3>
              <p className="text-gray-600">Support par email en moins de 24h et accès direct à notre équipe technique.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Comment fonctionne l'extraction de données?</h3>
              <p className="text-gray-600">Exportez automatiquement les montants, dates et numéros des factures en CSV.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
