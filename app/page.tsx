import Link from 'next/link';
import { ArrowRight, Mail, Zap, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">📧 Smart Inbox</h1>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">
            Connexion
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Triez vos emails avec l'IA
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Automatisez la gestion de vos emails entrants. Catégorisez, priorisez et répondez en quelques clics.
        </p>
        <div className="space-x-4">
          <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Démarrer Gratuitement <ArrowRight className="ml-2" size={20} />
          </Link>
          <Link href="/pricing" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100">
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-xl shadow-md">
            <Mail className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">Tri Intelligent</h3>
            <p className="text-gray-600">
              L'IA classe automatiquement vos emails par urgence, catégorie et type.
            </p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-md">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Gain de Temps</h3>
            <p className="text-gray-600">
              Réduisez votre temps de traitement des emails de 70%.
            </p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-md">
            <Lock className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">Sécurisé</h3>
            <p className="text-gray-600">
              Chiffrement end-to-end et respect total de la vie privée.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Plans d'Abonnement</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Freemium */}
            <div className="p-8 border-2 border-gray-200 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Gratuit</h3>
              <p className="text-3xl font-bold text-blue-600 mb-6">0€<span className="text-sm text-gray-600">/mois</span></p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li>✓ 1 compte email</li>
                <li>✓ Tri basique</li>
                <li>✓ 50 emails/jour</li>
              </ul>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">Commencer</button>
            </div>

            {/* Pro */}
            <div className="p-8 border-2 border-blue-600 rounded-xl bg-blue-50 transform scale-105">
              <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-4">Populaire</div>
              <h3 className="text-xl font-bold mb-4">Pro</h3>
              <p className="text-3xl font-bold text-blue-600 mb-6">19€<span className="text-sm text-gray-600">/mois</span></p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li>✓ 3 comptes emails</li>
                <li>✓ Tri avancé</li>
                <li>✓ Réponses IA</li>
                <li>✓ 1000 emails/jour</li>
              </ul>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Souscrire</button>
            </div>

            {/* Business */}
            <div className="p-8 border-2 border-gray-200 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Business</h3>
              <p className="text-3xl font-bold text-blue-600 mb-6">49€<span className="text-sm text-gray-600">/mois</span></p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li>✓ Comptes illimités</li>
                <li>✓ Extraction de données</li>
                <li>✓ Support prioritaire</li>
                <li>✓ Emails illimités</li>
              </ul>
              <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Souscrire</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; 2024 Smart Inbox. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
