## Génère moi une plateforme clé en main, codée en Next.js pour le front et pour le back je te laisse choisir la techno. 

Sur cette plateforme on pourra se connecter à sa/ses boites mails, elle sera doté d'agents IA qui permettront de trier automatiquement les mails entrants, les classer selon le degrés d'urgence, si demande de devis, facture, etc ... 

L'accès se fera via inscription et abonnement mensuel.

Si j'ai oublié des features que tu sembles vitales, libre à toi de les ajouter pour avoir un projet complet, monétisable et publiable. 

C'est un projet ambitieux et tout à fait réalisable avec les outils modernes. Pour créer une plateforme **SaaS (Software as a Service)** commercialisable, évolutive et sécurisée, nous ne pouvons pas nous contenter d'un simple script. Il faut une architecture robuste.

Comme je ne peux pas générer les milliers de fichiers nécessaires en une seule réponse, je vais agir comme ton **CTO (Chief Technical Officer)**. Je vais te fournir l'architecture complète, la stack technique idéale (Back + Front), le schéma de base de données, les fonctionnalités vitales ajoutées et les blocs de code critiques pour l'IA et la gestion des emails.

Voici ta feuille de route "Clé en main".

-----

### 1\. Choix de la Stack Technique (Le "Back" choisi)

Pour le backend, j'ai choisi une architecture **Serverless & Event-Driven** pour minimiser tes coûts de départ et maximiser la scalabilité.

  * **Frontend :** **Next.js 14+ (App Router)** + Tailwind CSS + Shadcn/UI (pour une UI pro et rapide).
  * **Backend / Database / Auth :** **Supabase**. C'est une alternative open-source à Firebase. Elle te donne PostgreSQL, l'Authentification, et le stockage. C'est idéal pour Next.js.
  * **AI Engine :** **OpenAI API (GPT-4o-mini)** pour le tri (rapide et très peu cher) ou **Mistral AI** (pour une option européenne RGPD friendly).
  * **Email Sync :** Plutôt que de recoder le protocole IMAP (complexe et buggé), nous utiliserons **Nylas** ou **Gmail API/Graph API** directement. Pour ce MVP, nous simulerons une connexion IMAP directe via la librairie `imapflow` (Node.js) pour réduire les coûts tiers.
  * **Queueing (File d'attente) :** **BullMQ** + **Redis**. C'est vital. Le traitement des mails doit se faire en arrière-plan, pas pendant que l'utilisateur attend.
  * **Paiement :** **Stripe**.

-----

### 2\. Fonctionnalités Vitales Ajoutées (Pour rendre le projet "Monétisable")

Pour qu'un utilisateur paie un abonnement, il faut plus que du simple tri. Voici ce que j'ai ajouté :

1.  **Le "Smart Reply" (Brouillon Auto) :** L'IA ne se contente pas de classer, elle rédige une réponse brouillon adaptée au contexte (ex: "Refus poli", "Acceptation de devis").
2.  **Résumé Executif Quotidien :** Un email ou une vue dashboard qui résume : "Tu as reçu 50 mails, seuls ces 3 demandent ton attention immédiate".
3.  **Détection de Sentiment :** Indiquer si le client est "En colère", "Heureux", ou "Neutre".
4.  **Extraction de Données (Data Parsing) :** Si c'est une facture, extraire automatiquement le Montant, la Date et le Numéro de facture pour l'exporter en CSV/Compta.
5.  **Mode "Focus" :** Une inbox qui cache tout ce qui n'est pas urgent.

-----

### 3\. Architecture de la Base de Données (PostgreSQL via Supabase)

Voici les tables essentielles pour structurer ton projet.

```sql
-- Table des utilisateurs (étend l'auth Supabase)
create table public.profiles (
  id uuid references auth.users not null,
  email text,
  subscription_status text default 'trial', -- active, cancelled, past_due
  stripe_customer_id text,
  primary_key (id)
);

-- Comptes emails connectés (Gmail, Outlook...)
create table public.email_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  provider text, -- 'google', 'outlook', 'imap'
  email_address text,
  access_token text, -- Encrypted!
  refresh_token text -- Encrypted!
);

-- Les emails synchronisés et traités
create table public.emails (
  id uuid default uuid_generate_v4() primary key,
  account_id uuid references public.email_accounts(id),
  remote_id text, -- ID unique chez le provider (Gmail ID)
  subject text,
  sender text,
  body_text text,
  received_at timestamptz,
  
  -- Champs IA
  ai_category text, -- 'Devis', 'Facture', 'Urgent', 'Spam', 'Info'
  ai_urgency_score int, -- 0 à 10
  ai_summary text,
  ai_suggested_reply text,
  ai_sentiment text, -- 'Positive', 'Negative', 'Neutral'
  
  is_processed boolean default false
);
```

-----

### 4\. Le Code (Les parties critiques)

Je vais te donner les blocs logiques pour Next.js.

#### A. L'Agent IA (Le cerveau du tri)

Crée un fichier `lib/ai-agent.ts`. Nous utilisons le "Function Calling" ou le mode JSON pour avoir une réponse structurée stricte.

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeEmail(subject: string, content: string, sender: string) {
  const prompt = `
    Tu es un assistant exécutif expert. Analyse cet email.
    Expéditeur: ${sender}
    Sujet: ${subject}
    Contenu: ${content}

    Tâche :
    1. Catégorise l'email (Urgent, Devis, Facture, Newsletter, Personnel, Autre).
    2. Donne un score d'urgence de 0 à 100.
    3. Résume l'email en une phrase.
    4. Suggère une réponse courte si nécessaire.
    
    Réponds UNIQUEMENT au format JSON.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Rapide et économique
    messages: [
      { role: "system", content: "Tu es une API JSON stricte." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result;
}
```

#### B. Le Worker de Synchronisation (Background Job)

Ceci est un exemple conceptuel. Dans la réalité, tu hébergerais ça sur un serveur Node.js séparé ou via des Server Actions déclenchées par Cron (Vercel Cron).

```typescript
// lib/email-worker.ts
import { imapFlow } from 'imapflow'; // Bibliothèque hypothétique standard
import { analyzeEmail } from './ai-agent';
import { supabase } from './supabase-client';

export async function processInbox(userAccount: any) {
  // 1. Connexion IMAP sécurisée
  const client = new ImapFlow({
    host: userAccount.imap_host,
    port: 993,
    secure: true,
    auth: { user: userAccount.email, pass: decrypt(userAccount.password) }
  });

  await client.connect();

  // 2. Récupérer les mails non lus
  const lock = await client.getMailboxLock('INBOX');
  try {
    for await (const message of client.fetch('1:*', { envelope: true, source: true })) {
      
      // 3. Analyse IA
      const analysis = await analyzeEmail(
        message.envelope.subject, 
        message.source.toString(), 
        message.envelope.from[0].address
      );

      // 4. Sauvegarde en Base de Données
      await supabase.from('emails').insert({
        account_id: userAccount.id,
        subject: message.envelope.subject,
        ai_category: analysis.category,
        ai_urgency_score: analysis.urgency_score,
        ai_summary: analysis.summary,
        ai_suggested_reply: analysis.suggested_reply,
        is_processed: true
      });

      // Optionnel : Déplacer le mail dans un dossier sur le serveur mail réel
      // await client.messageMove(message.uid, 'INBOX/' + analysis.category);
    }
  } finally {
    lock.release();
  }
  await client.logout();
}
```

#### C. L'Interface Utilisateur (Dashboard Next.js)

Fichier `app/dashboard/page.tsx`. Utilisation de Server Components pour la rapidité.

```typescript
import { createClient } from '@/utils/supabase/server';
import { EmailCard } from '@/components/email-card';

export default async function Dashboard() {
  const supabase = createClient();
  
  // Récupérer les emails triés par urgence
  const { data: emails } = await supabase
    .from('emails')
    .select('*')
    .order('ai_urgency_score', { ascending: false }) // Les plus urgents en haut
    .limit(50);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Ta Smart Inbox 🧠</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Urgente */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <h2 className="text-red-600 font-bold mb-4">🚨 Urgent / À traiter</h2>
          {emails?.filter(e => e.ai_category === 'Urgent' || e.ai_urgency_score > 80)
            .map(email => (
              <EmailCard key={email.id} email={email} type="urgent" />
          ))}
        </div>

        {/* Colonne Business */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h2 className="text-blue-600 font-bold mb-4">💼 Devis & Factures</h2>
          {emails?.filter(e => ['Devis', 'Facture'].includes(e.ai_category))
            .map(email => (
              <EmailCard key={email.id} email={email} type="business" />
          ))}
        </div>

        {/* Le reste */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h2 className="text-gray-600 font-bold mb-4">📥 Autres</h2>
          {emails?.filter(e => e.ai_urgency_score < 50 && !['Devis', 'Facture'].includes(e.ai_category))
            .map(email => (
              <EmailCard key={email.id} email={email} type="normal" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

-----

### 5\. Stratégie de Monétisation & Structure de Prix

Pour rendre le projet viable financièrement :

  * **Freemium :** Connexion de 1 compte mail + Tri basique.
  * **Pro (19€/mois) :** 3 comptes mails + Rédaction de réponse IA + Synthèse quotidienne.
  * **Business (49€/mois) :** Comptes illimités + Extraction de données (CSV pour comptabilité) + Support prioritaire.

### 6\. Structure du Projet (File Tree)

```text
/my-saas-mailer
├── app/
│   ├── api/               # Webhooks (Stripe, Cron jobs)
│   ├── auth/              # Pages Login/Register
│   ├── dashboard/         # L'app principale
│   └── page.tsx           # Landing page (Marketing)
├── components/
│   ├── email-card.tsx     # Composant UI d'un mail
│   ├── subscription-btn.tsx
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── ai-agent.ts        # Logique OpenAI
│   ├── email-service.ts   # Logique IMAP/Gmail
│   └── supabase.ts        # Client DB
├── supabase/
│   └── migrations/        # Scripts SQL
└── middleware.ts          # Protection des routes (Auth)
```

-----

### Prochaine étape pour toi

C'est un projet complexe qui touche à des données sensibles (emails).

**Veux-tu que je génère :**

1.  Le fichier `package.json` complet avec toutes les dépendances nécessaires ?
2.  Le composant React détaillé de la **"EmailCard"** qui affiche le résumé IA et le bouton "Réponse rapide" ?
3.  Ou le prompt système complet pour l'IA afin de maximiser la précision du tri ?