# ⚡ Quick Auth System Guide

## How to Use

### User Signs Up
```
1. Click "S'inscrire" on landing page
2. Enter email + password
3. Account created in Supabase
4. Redirected to login
```

### User Logs In
```
1. Go to /login
2. Enter email + password
3. Session cookie set (7 days)
4. Access to dashboard ✓
```

### User Logs Out
```
1. Click "Déconnexion" on dashboard
2. Session cookie cleared
3. Redirected to home page
4. Can't access dashboard anymore
```

---

## What's Protected?

These routes require login:
- `/dashboard`
- `/settings`
- `/email-accounts`

---

## Testing

### Create Test Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123"
  }' \
  -c cookies.txt
```

### Access Protected Route
```bash
curl -b cookies.txt http://localhost:5000/dashboard
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## Next Steps

1. **Test Locally** - Try signup/login/logout flow
2. **Publish** - Click "Publish" to deploy
3. **Share URL** - Users can now sign up!
4. **Add Email Sync** - Connect Gmail/IMAP (future)

Done! 🎉
