╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║    🔐 SUPABASE AUTH REDIRECT URL CONFIGURATION GUIDE                      ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ THE PROBLEM YOU'RE FACING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Supabase authentication is still pointing to localhost, but you need to:

1. Keep localhost for LOCAL development
2. Add your Netlify URL for PRODUCTION deployment
3. Configure both so auth works in both environments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ HOW TO FIX - STEP BY STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Go to Supabase Dashboard
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Visit: <https://supabase.com/dashboard>                               │
│ 2. Select your project: ptenbtyommucwleqzdwd                            │
│ 3. Go to: Authentication (left sidebar)                                 │
│ 4. Click: URL Configuration                                             │
└─────────────────────────────────────────────────────────────────────────┘

STEP 2: Configure Site URL
┌─────────────────────────────────────────────────────────────────────────┐
│ "Site URL" should be your PUBLIC URL:                                   │
│                                                                          │
│ For LOCAL TESTING:                                                       │
│   <http://localhost:3000>                                                 │
│                                                                          │
│ For PRODUCTION:                                                          │
│   <https://beacon-press-hub-news.netlify.app>                             │
│                                                                          │
│ 👉 SET IT TO YOUR CURRENT ENVIRONMENT                                   │
│    (Start with localhost for local development)                         │
└─────────────────────────────────────────────────────────────────────────┘

STEP 3: Add Redirect URLs (Most Important!)
┌─────────────────────────────────────────────────────────────────────────┐
│ "Redirect URLs" should include BOTH:                                     │
│                                                                          │
│ For LOCAL Development:                                                   │
│   <http://localhost:3000/auth/callback>                                   │
│   <http://localhost:3000/admin/login>                                     │
│                                                                          │
│ For PRODUCTION:                                                          │
│   <https://beacon-press-hub-news.netlify.app/auth/callback>              │
│   <https://beacon-press-hub-news.netlify.app/admin/login>                │
│                                                                          │
│ HOW TO ADD:                                                              │
│ 1. Click "Add URL" button                                               │
│ 2. Paste: <http://localhost:3000/auth/callback>                           │
│ 3. Click "Save"                                                          │
│ 4. Repeat for each URL                                                  │
│                                                                          │
│ ✅ FINAL LIST SHOULD HAVE:                                              │
│   - <http://localhost:3000/auth/callback>                                 │
│   - <http://localhost:3000/admin/login>                                   │
│   - <https://beacon-press-hub-news.netlify.app/auth/callback>            │
│   - <https://beacon-press-hub-news.netlify.app/admin/login>              │
└─────────────────────────────────────────────────────────────────────────┘

STEP 4: Additional Email Settings (Optional but Recommended)
┌─────────────────────────────────────────────────────────────────────────┐
│ Go to: Authentication → Email Templates                                  │
│ This is where you can customize password reset emails                    │
│                                                                          │
│ The redirect link in emails should use your Site URL                    │
└─────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 NEXTAUTH SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your environment variables are now configured:

✅ NEXTAUTH_URL=<http://localhost:3000>
✅ NEXTAUTH_SECRET=IWVf9N/ZJf8O+D/lezppuZptoAi/X0ysVlmsCt3H3VA=

These tell NextAuth:
  • What your site URL is (for cookie domain)
  • How to encrypt session tokens
  • Where to redirect after login

For PRODUCTION (Netlify):
  Change NEXTAUTH_URL to: <https://beacon-press-hub-news.netlify.app>
  Keep NEXTAUTH_SECRET the same (or generate a new one)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SUPABASE AUTHENTICATION FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When user logs in:

  1. App sends credentials to Supabase
  2. Supabase validates & creates session
  3. Redirects to: <http://localhost:3000/auth/callback>
  4. NextAuth processes the callback
  5. Sets encrypted session cookie
  6. Redirects to admin dashboard (/admin/publisher)

⚠️ IF REDIRECT URLS NOT CONFIGURED:
  • Auth will fail with "Redirect URL not allowed" error
  • User will get stuck on login page
  • Check browser console for errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 TEST YOUR SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Run locally:
   npm run dev

2. Go to:
   <http://localhost:3000/admin/login>

3. Try logging in:
   Email: <admin@beaconpress.com>
   Password: Beacon123!@#

4. Check for errors:
   • Open browser DevTools (F12)
   • Look at Console tab
   • Check Network tab for failed requests
   • Look for "Redirect URL not allowed" errors

5. If it works:
   ✅ You're redirected to /admin/publisher
   ✅ Session cookie is set
   ✅ Auth is working correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PRODUCTION DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When deploying to Netlify:

1. UPDATE .env variables:
   NEXTAUTH_URL=<https://beacon-press-hub-news.netlify.app>

2. ADD to Netlify Dashboard:
   Settings → Build & Deploy → Environment

   NEXTAUTH_URL=<https://beacon-press-hub-news.netlify.app>
   NEXTAUTH_SECRET=(same as local)
   NEXT_PUBLIC_SUPABASE_URL=(your URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=(your key)
   SUPABASE_SERVICE_ROLE_KEY=(your key)

3. Redeploy:
   git push origin master

4. Test:
   <https://beacon-press-hub-news.netlify.app/admin/login>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ COMMON ISSUES & FIXES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "Redirect URL not allowed" error
   ✅ Add the callback URL to Supabase redirect URLs
   ✅ Make sure it matches exactly (http vs https, domain, path)

❌ Login works locally but not on Netlify
   ✅ Check NEXTAUTH_URL is set to Netlify URL in Netlify Dashboard
   ✅ Check Supabase redirect URLs include Netlify URLs
   ✅ Trigger manual redeploy

❌ Session not persisting
   ✅ Check NEXTAUTH_SECRET is set in both local and production
   ✅ Clear browser cookies
   ✅ Make sure .env.local is in .gitignore

❌ Getting "Token invalid" errors
   ✅ Check Supabase ANON_KEY and SERVICE_ROLE_KEY are correct
   ✅ Verify keys haven't been rotated
   ✅ Check keys are not expired

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 QUICK REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supabase Dashboard: <https://supabase.com/dashboard>
Your Project ID: ptenbtyommucwleqzdwd

Auth Configuration Link:
<https://supabase.com/dashboard/project/ptenbtyommucwleqzdwd/auth/url-configuration>

Local Site URL: <http://localhost:3000>
Production Site URL: <https://beacon-press-hub-news.netlify.app>

Admin Login: /admin/login
Publisher: /admin/publisher
Flier Generator: /admin/flier-generator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your .env.local is now ready with the correct NEXTAUTH_SECRET!
Next step: Configure Supabase redirect URLs as shown above.

═══════════════════════════════════════════════════════════════════════════════
