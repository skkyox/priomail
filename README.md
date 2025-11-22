# 📧 Smart Inbox - AI-Powered Email Management SaaS

Une plateforme SaaS complète pour automatiser la gestion de vos emails avec l'intelligence artificielle.

## ✨ Fonctionnalités

### 🎯 Tri Intelligent
- **Catégorisation automatique** : Urgent, Devis, Facture, Newsletter, Personnel, Autre
- **Score d'urgence** : 0-100 basé sur le contenu et le contexte
- **Analyse de sentiment** : Détecte si le client est en colère, heureux ou neutre
- **Résumés générés** : Récaps d'une ligne pour chaque email

### 🚀 Fonctionnalités Avancées
- **Réponses IA** : Brouillons de réponse générés automatiquement
- **Synchronisation multi-comptes** : Gmail, Outlook, ou serveurs IMAP
- **Dashboard intelligent** : Vue d'ensemble de votre inbox en un coup d'œil
- **Extraction de données** : Montants, dates, numéros de facture automatiquement extraits
- **Mode Focus** : Masquez tout ce qui n'est pas urgent

### 💳 Monétisation
- **Plan Gratuit** : 1 compte email, 50 emails/jour
- **Pro (19€/mois)** : 3 comptes, réponses IA, 1000 emails/jour
- **Business (49€/mois)** : Comptes illimités, export CSV, support prioritaire

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 + TypeScript + Tailwind CSS
- **Backend** : Next.js API Routes
- **Database** : PostgreSQL (Supabase ou Replit DB)
- **Auth** : Supabase Authentication
- **AI** : OpenAI GPT-4o-mini
- **Paiement** : Stripe
- **État** : Zustand

## 📦 Installation & Configuration

### 1. Cloner et Installer

```bash
npm install
```

### 2. Variables d'Environnement

Créez un fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# OpenAI (déjà configuré)
OPENAI_API_KEY=your_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# JWT
JWT_SECRET=your-secret-key-change-me
```

### 3. Database

Exécutez les migrations SQL dans `database.sql` sur votre base de données PostgreSQL :

```sql
-- Tout le schéma est défini dans database.sql
-- Incluant tables, indexes, et vues
```

### 4. Lancer le Serveur

```bash
npm run dev
```

L'app sera disponible sur `http://localhost:5000`

## 📁 Structure du Projet

```
smart-inbox/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Connexion
│   ├── signup/page.tsx       # Inscription
│   ├── dashboard/page.tsx    # Dashboard principal
│   ├── pricing/page.tsx      # Page de tarification
│   ├── api/
│   │   ├── emails/           # Analyse IA
│   │   ├── auth/             # Authentication
│   │   └── stripe/           # Webhooks Stripe
│   └── layout.tsx            # Layout global
├── components/
│   ├── email-card.tsx        # Composant email
│   └── navbar.tsx            # Navigation
├── lib/
│   ├── ai-engine.ts          # Moteur IA OpenAI
│   ├── supabase.ts           # Client Supabase
│   └── store.ts              # État global (Zustand)
├── middleware.ts             # Protection des routes
├── database.sql              # Schéma complet
└── package.json
```

## 🔑 API Endpoints

### Emails
- `POST /api/emails` - Analyser un email
- `GET /api/emails` - Lister les emails (dashboard)

### Authentication
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Stripe
- `POST /api/stripe/webhook/:uuid` - Webhooks Stripe
- `POST /api/checkout` - Créer session checkout

### Santé
- `GET /api/health` - Vérifier l'état du serveur

## 🚀 Déploiement

### Sur Replit

1. **Configurer les secrets** :
   - OpenAI API Key ✅ (déjà configuré)
   - Stripe Publishable Key
   - Stripe Secret Key
   - Supabase URL et Key

2. **Database** :
   - Créer une base PostgreSQL
   - Exécuter le schéma `database.sql`

3. **Publier** :
   - Cliquer sur "Publish"
   - Configurer le domaine personnalisé (optionnel)

### Sur Vercel

```bash
vercel deploy --prod
```

### Sur Render/Railway

```bash
# Ajouter la commande de build
npm run build

# Ajouter la commande de start
npm start
```

## 📊 Cas d'Utilisation

- **Freelancers** : Gérer les devis et factures automatiquement
- **Support Client** : Prioriser les tickets urgents
- **Executive** : Résumé quotidien des emails importants
- **E-commerce** : Alertes automatiques sur les commandes urgentes

## 🔒 Sécurité

- ✅ Authentification Supabase (OAuth + Email/Password)
- ✅ JWT tokens
- ✅ Chiffrement des tokens
- ✅ HTTPS obligatoire en production
- ✅ Webhooks Stripe sécurisés (UUID-based routing)
- ✅ Respect RGPD

## 🐛 Troubleshooting

### La base de données n'est pas accessible

```bash
# Vérifier la variable DATABASE_URL
echo $DATABASE_URL
```

### Les emails ne se synchronisent pas

1. Vérifier les credentials IMAP
2. Vérifier que l'API OpenAI fonctionne : `GET /api/health`
3. Regarder les logs du serveur

### Stripe n'est pas actif

1. Vérifier que les clés sont correctes
2. Vérifier que le webhook est enregistré
3. Tester avec `npm test`

## 📝 Roadmap

- [ ] Intégration Gmail API
- [ ] Intégration Microsoft Graph (Outlook)
- [ ] Mobile app (React Native)
- [ ] Analytics avancées
- [ ] Collaborations d'équipe
- [ ] Intégrations Zapier/Make
- [ ] Détection spam avancée
- [ ] Auto-réponse intelligente

## 💬 Support

Pour les questions ou bugs, créez une issue sur le repo.

## 📄 Licence

MIT

---

**Créé avec ❤️ pour productivité maximale**
