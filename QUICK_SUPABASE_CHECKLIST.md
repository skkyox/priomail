# ⚡ Checklist Rapide Supabase (5 minutes)

## ☑️ À Faire

### 1️⃣ Créer Supabase
- [ ] Aller sur https://supabase.com
- [ ] S'inscrire (Email ou GitHub)
- [ ] Créer un projet nommé "smart-inbox"
- [ ] Copier le Database Password
- [ ] Attendre que le projet s'initialise (2-3 min)

### 2️⃣ Récupérer les Credentials
- [ ] Aller dans **Settings → API**
- [ ] Copier: **Project URL** (commence par https://...supabase.co)
- [ ] Copier: **Anon Public Key** (eyJhbGc...)

### 3️⃣ Ajouter à .env.local
Remplacer dans votre fichier `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

- [ ] Sauvegarder avec Ctrl+S

### 4️⃣ Exécuter les Migrations
- [ ] Dans Supabase: **SQL Editor → New Query**
- [ ] Ouvrir `database.sql` dans votre projet
- [ ] Copier TOUT le contenu
- [ ] Coller dans SQL Editor Supabase
- [ ] Cliquer **"Run"**
- [ ] Vérifier le succès ✓

### 5️⃣ Redémarrer l'App
- [ ] Dans Replit, cliquer **"Stop"**
- [ ] Cliquer **"Run"** ou `npm run dev`
- [ ] Attendre le message: "Ready in XXms"

### 6️⃣ Tester
- [ ] Aller sur http://localhost:5000
- [ ] Cliquer sur "Tarification"
- [ ] Cliquer sur "S'inscrire"
- [ ] Tester l'inscription avec un email
- [ ] Vérifier que c'est dans Supabase

### 7️⃣ Publier
- [ ] Cliquer **"Publish"** dans Replit
- [ ] Attendre le domaine
- [ ] BOOM! 🚀 **Vous avez une URL live!**

---

## 🎯 Résultat Attendu

Après avoir suivi ces étapes:

✅ Supabase est configuré
✅ Base de données fonctionne
✅ App accepte les utilisateurs
✅ Données sont sauvegardées en DB
✅ Prêt pour Stripe et emails

---

## 🆘 Problèmes Courants

| Problème | Solution |
|----------|----------|
| "Invalid API key" | Vérifier que c'est la clé **ANON** (pas Service Role) |
| "Connection refused" | Vérifier l'URL du projet (doit finir par .supabase.co) |
| "Can't find database.sql" | Le fichier est à la racine: `/database.sql` |
| "SQL Error" | Copier le fichier **entièrement**, pas en parties |
| App redémarre pas | Faire: Ctrl+C puis `npm run dev` |

---

## 📝 Template à Copier-Coller

Voici la structure `.env.local` finale:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (déjà configuré ✅)
OPENAI_API_KEY=sk-proj-...

# Stripe (déjà configuré ✅)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# JWT
JWT_SECRET=your-secret-key-change-me

# API
API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## ✨ Vous Êtes Maintenant

- ✅ Développeur SaaS
- ✅ Avec une vraie base de données
- ✅ Et des utilisateurs qui se connectent
- ✅ Et des données persistantes
- ✅ Et une URL publique

**Prochaine étape: Ajouter les emails! 📧**
