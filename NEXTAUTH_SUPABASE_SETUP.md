╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║        NEXTAUTH & SUPABASE CONFIGURATION - COMPLETE SETUP GUIDE          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STEP 1: GENERATE NEXTAUTH_SECRET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The NEXTAUTH_SECRET is used to encrypt session tokens. You need a strong random key.

METHOD 1: Online Generator (Easiest)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Visit: <https://generate-secret.vercel.app/32>
2. Click the button to generate a secret
3. You'll see something like: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6==
4. Copy the entire string
5. In .env.local, replace:
   NEXTAUTH_SECRET=your_random_secret_key_here
   with:
   NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6==

METHOD 2: Using OpenSSL (Linux/Mac/WSL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open terminal
2. Run: openssl rand -base64 32
3. Copy the output
4. Paste into .env.local as NEXTAUTH_SECRET value

METHOD 3: Using Node.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open terminal
2. Run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
3. Copy the output
4. Paste into .env.local as NEXTAUTH_SECRET value

METHOD 4: Using Python (Windows PowerShell)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open PowerShell
2. Run: python -c "import secrets; print(secrets.token_urlsafe(32))"
3. Copy the output
4. Paste into .env.local as NEXTAUTH_SECRET value

✅ RECOMMENDED: Use METHOD 1 (online generator) - easiest and fastest

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STEP 2: SET NEXTAUTH_URL (Already Done!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXTAUTH_URL is where your app is running:

For LOCAL DEVELOPMENT:
  NEXTAUTH_URL=<http://localhost:3000>
  ✅ Already set in .env.local

For PRODUCTION (Netlify):
  NEXTAUTH_URL=<https://beacon-press-hub-news.netlify.app>
  ← You'll change this when deploying to production

For CUSTOM DOMAIN:
  NEXTAUTH_URL=<https://yourdomain.com>
  ← Change if you add a custom domain later

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  STEP 3: FIX SUPABASE REDIRECT URLS (IMPORTANT!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Currently your Supabase is set to localhost only. You need to add:

1. Local redirect URL (<http://localhost:3000>)
2. Production redirect URL (your Netlify URL)
3. Site URL

FOLLOW THESE STEPS:

1. Go to: <https://supabase.com/dashboard>
2. Select your project: "beacon-press-hub"
3. Click: Authentication (left sidebar)
4. Click: URL Configuration
5. You'll see:

   ┌─────────────────────────────────────────────────────────┐
   │ Site URL                                                │
   │ [input field]                                           │
   │                                                          │
   │ Redirect URLs                                           │
   │ [input field 1] [+ Add URL]                             │
   │ [input field 2]                                         │
   │ [input field 3]                                         │
   └─────────────────────────────────────────────────────────┘

6. In "Site URL" field, enter:
   <http://localhost:3000>

7. In "Redirect URLs", add BOTH:

   URL 1: <http://localhost:3000/api/auth/callback/google>
   URL 2: <https://beacon-press-hub-news.netlify.app/api/auth/callback/google>
   URL 3: <http://localhost:3000>
   URL 4: <https://beacon-press-hub-news.netlify.app>

   (You can add more URLs with the "+ Add URL" button)

8. Click: Save

✅ IMPORTANT REDIRECT URL PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For ANY authentication provider (Google, GitHub, etc):
  <http://localhost:3000/api/auth/callback/[PROVIDER>]
  <https://beacon-press-hub-news.netlify.app/api/auth/callback/[PROVIDER>]

Replace [PROVIDER] with:

- google (for Google Sign-In)
- github (for GitHub Sign-In)
- discord (for Discord Sign-In)
- etc.

Also add the base URLs:
  <http://localhost:3000>
  <https://beacon-press-hub-news.netlify.app>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETE LIST OF REDIRECT URLS TO ADD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Copy & Paste these into Supabase Redirect URLs:

1. <http://localhost:3000>
2. <http://localhost:3000/api/auth/callback/google>
3. <http://localhost:3000/api/auth/callback/github>
4. <https://beacon-press-hub-news.netlify.app>
5. <https://beacon-press-hub-news.netlify.app/api/auth/callback/google>
6. <https://beacon-press-hub-news.netlify.app/api/auth/callback/github>

(Add more if you use other providers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR CURRENT SUPABASE PROJECT INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project ID: ptenbtyommucwleqzdwd
Supabase URL: <https://ptenbtyommucwleqzdwd.supabase.co>
Region: (check in your dashboard)

✅ All credentials are already in your .env.local file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR .env.local STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ NEXT_PUBLIC_SUPABASE_URL = <https://ptenbtyommucwleqzdwd.supabase.co>
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = [Set correctly]
✅ SUPABASE_SERVICE_ROLE_KEY = [Set correctly]
✅ NEXT_PUBLIC_ADMIN_EMAIL = <admin@beaconpress.com>
✅ NEXT_PUBLIC_ADMIN_PASSWORD = Beacon123!@#
✅ NEXTAUTH_URL = <http://localhost:3000>
⏳ NEXTAUTH_SECRET = [Need to generate and add]
⏳ NEXT_PUBLIC_ANALYTICS_ID = [Optional - add Google Analytics ID if you want]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ 1. Generate NEXTAUTH_SECRET (<https://generate-secret.vercel.app/32>)
☐ 2. Add NEXTAUTH_SECRET to .env.local
☐ 3. Go to Supabase URL Configuration
☐ 4. Set Site URL: <http://localhost:3000>
☐ 5. Add Redirect URLs (see list above)
☐ 6. Click Save in Supabase
☐ 7. Save .env.local file
☐ 8. Run: npm run dev
☐ 9. Test login at <http://localhost:3000/admin/login>
☐ 10. Success! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER DEPLOYMENT TO NETLIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Once you deploy to Netlify, you'll need to:

1. Set NEXTAUTH_SECRET in Netlify Dashboard:
   → Site Settings → Build & Deploy → Environment Variables
   → Add NEXTAUTH_SECRET (same value as local)

2. Update NEXTAUTH_URL in Netlify:
   → Change from <http://localhost:3000>
   → To: <https://beacon-press-hub-news.netlify.app>

3. Supabase Redirect URLs are already set above, so no change needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: "NEXTAUTH_SECRET not found"
  → Make sure .env.local is in project root
  → Make sure NEXTAUTH_SECRET is not commented out
  → Restart dev server (npm run dev)

Problem: "Invalid URL" error from NextAuth
  → Check NEXTAUTH_URL matches your current domain
  → No trailing slash: <http://localhost:3000> (not :3000/)
  → No protocol: just domain, not protocol://domain/path

Problem: Authentication fails
  → Check Supabase Redirect URLs are set correctly
  → Verify SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY
  → Check .env.local has all variables

Problem: "Redirect URL not allowed"
  → Add the failing URL to Supabase Redirect URLs
  → Save in Supabase
  → Clear browser cookies
  → Try again

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Generate NEXTAUTH_SECRET ← DO THIS FIRST
2. Add to .env.local
3. Configure Supabase Redirect URLs
4. Run npm run dev
5. Test login at <http://localhost:3000/admin/login>

═══════════════════════════════════════════════════════════════════════════════
