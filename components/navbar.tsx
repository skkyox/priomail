'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  user?: { email: string };
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📧</span>
            <span className="font-bold text-gray-900">Smart Inbox</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <span className="text-gray-600 text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                  Tarifs
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Connexion
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Tarifs
                </Link>
                <Link href="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Connexion
                </Link>
                <Link href="/signup" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
