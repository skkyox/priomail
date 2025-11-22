# 🔧 Guide Complet: Configuration Supabase pour Smart Inbox

## Étape 1: Créer un Compte Supabase (2 minutes)

### 1.1 Aller sur Supabase
- **URL**: https://supabase.com
- Cliquer sur **"Start your project"** ou **"Sign up"**

### 1.2 S'identifier
- Créer un compte avec **Email** ou **GitHub**
- Vérifier votre email

### 1.3 Créer une Organisation
- Choisir un nom: ex "Smart Inbox"
- Cliquer **"Create organization"**

---

## Étape 2: Créer un Projet PostgreSQL (3 minutes)

### 2.1 Créer un Nouveau Projet
- Dans l'organisation, cliquer **"New Project"**

### 2.2 Configuration du Projet
Remplir les champs:
```
Project name:      smart-inbox-dev
Database name:     postgres (par défaut)
Database password: [Générer un bon mot de passe - GARDEZ-LE!]
Region:            Europe (Frankfurt) ou US
Pricing:           Free Tier (gratuit)
```

⚠️ **IMPORTANT**: Copier et sauvegarder le password database dans un endroit sûr!

### 2.3 Créer le Projet
- Cliquer **"Create new project"**
- Attendre 2-3 minutes pour que Supabase initialise votre base

---

## Étape 3: Récupérer les Credentials (1 minute)

### 3.1 Aller dans Settings
Une fois le projet créé:
1. Cliquer sur **Settings** (engrenage) en bas à gauche
2. Cliquer sur **"API"** dans le menu

### 3.2 Copier les URLs
Vous verrez:
```
Project URL:      https://[projet].supabase.co
Anon Public Key:  eyJhbGc... (très long)
Service Role Key: eyJhbGc... (très long)
```

**Copier ces 3 valeurs!**

---

## Étape 4: Ajouter à .env.local (1 minute)

### 4.1 Ouvrir .env.local dans votre éditeur
Le fichier existe déjà dans Replit à la racine.

### 4.2 Ajouter les Credentials
Remplacer les valeurs par celles de Supabase:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY_HERE

# Si besoin (backend uniquement)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

**Exemple réel:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.3 Sauvegarder
Ctrl+S (ou Cmd+S sur Mac)

---

## Étape 5: Exécuter les Migrations SQL (2 minutes)

### 5.1 Aller dans SQL Editor
- Dans votre projet Supabase
- Cliquer sur **"SQL Editor"** (gauche)
- Cliquer sur **"New Query"**

### 5.2 Copier le Schéma
Ouvrir le fichier `database.sql` de votre projet Replit et **copier TOUT le contenu**.

### 5.3 Exécuter
- Coller dans le SQL Editor Supabase
- Cliquer **"Run"**

✅ Vous devriez voir:
```
Success! Ran 1 command.
```

### 5.4 Vérifier
- Aller dans **"Table Editor"** (gauche)
- Vous devriez voir 10 tables:
  - profiles
  - email_accounts
  - emails
  - user_actions
  - email_templates
  - dashboard_stats
  - urgent_emails (view)
  - email_stats (view)

---

## Étape 6: Tester la Connexion (1 minute)

### 6.1 Redémarrer l'App
```bash
npm run dev
# ou cliquer "Restart" dans Replit
```

### 6.2 Vérifier les Logs
Vous devriez voir:
```
Ready in 1234ms
✓ Compiled successfully
```

❌ Si erreur:
```bash
# Vérifier les variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 6.3 Tester l'API
```bash
curl http://localhost:5000/api/health
```

Réponse attendue:
```json
{
  "status": "ok",
  "timestamp": "2024-11-22T..."
}
```

---

## Étape 7: Configurer l'Authentification (2 minutes)

### 7.1 Aller dans Auth Settings
- Projet Supabase → **Settings** → **Authentication**

### 7.2 Site URLs
Ajouter votre domaine Replit:
```
https://votre-replit-url.replit.dev
```

### 7.3 Redirect URLs
```
https://votre-replit-url.replit.dev/auth/callback
http://localhost:5000/auth/callback (local development)
```

### 7.4 Providers (Optionnel)
- Pour Gmail/Google: Aller dans **Providers** → **Google**
- Pour GitHub: Aller dans **Providers** → **GitHub**
- Ajouter les clés OAuth

---

## Checkpoint: Vérification Complète

### ✅ Vérifier que tout fonctionne:

```bash
# 1. App démarre
npm run dev

# 2. Landing page accessible
curl http://localhost:5000/

# 3. Database connectée
# (Vérifier les logs Supabase: Dashboard → Logs)

# 4. API fonctionne
curl http://localhost:5000/api/health

# 5. .env.local correct
cat .env.local
```

---

## Troubleshooting

### ❌ Erreur: "Module not found 'supabase'"
```bash
npm install @supabase/supabase-js
```

### ❌ Erreur: "Invalid API key"
- Vérifier que la clé est **ANON** pas **SERVICE ROLE**
- Copier sans espaces
- Recommencer à l'Étape 4

### ❌ Erreur: "Connection refused"
- Vérifier que l'URL contient `.supabase.co`
- Vérifier que vous n'avez pas de typo
- Tester: `curl https://votre-url.supabase.co/rest/v1`

### ❌ Erreur: "Policy (?) does not exist"
- Cela vient des politiques RLS
- Temporairement, désactiver RLS:
  - Supabase → Tables → cliquer sur table
  - **RLS toggle** → OFF
  - ⚠️ Réactiver en production!

### ❌ Les migrations ne s'exécutent pas
- Copier le fichier `database.sql` **au complet**
- Ne pas ajouter de commentaires supplémentaires
- Exécuter dans SQL Editor
- Vérifier le résultat

---

## Prochaines Étapes

Après cette configuration, vous pouvez:

1. **Tester Login/Signup**
   - Aller sur `/signup`
   - S'inscrire avec un email
   - Vérifier que c'est dans Supabase

2. **Tester Dashboard**
   - Aller sur `/dashboard` après login
   - Voir les statistiques en temps réel

3. **Activer Stripe**
   - Ajouter clés Stripe
   - Tester le checkout

4. **Ajouter Emails**
   - Intégrer Gmail API
   - Synchroniser les emails
   - Voir l'analyse IA

---

## Résumé des Identifiants

Gardez précieusement:

```
Supabase URL:            https://[projet].supabase.co
Anon Key:                [GARDEZ SECRET]
Service Role Key:        [SUPER SECRET - Backend seulement]
Database Password:       [GARDEZ SECRET]
Database Host:           [projet].c.supabase.co
Database Name:           postgres
Database User:           postgres
Database Port:           5432
```

---

## Support

### Besoin d'aide?
- Docs Supabase: https://supabase.com/docs
- Discord Supabase: https://discord.supabase.com
- Issues: https://github.com/supabase/supabase/issues

### Questions fréquentes?

**Q: Puis-je tester sans Supabase?**
R: Oui, temporairement. Mais vous avez besoin d'une DB pour production.

**Q: Combien ça coûte?**
R: Gratuit jusqu'à 500 MB de stockage. Pro à partir de $25/mois.

**Q: Comment migrer vers une autre région?**
R: Créer un nouveau projet, exporter les données, importer dans le nouveau.

---

## ✅ Vous avez Maintenant

- ✅ Compte Supabase
- ✅ Base de données PostgreSQL
- ✅ Schema smart-inbox complet
- ✅ Credentials dans .env.local
- ✅ Authentification configurée
- ✅ App prête pour production

**🎉 Félicitations! Supabase est configuré et votre app fonctionne!**

**Prochaine étape: Publier avec le bouton "Publish" dans Replit et avoir une URL live! 🚀**
