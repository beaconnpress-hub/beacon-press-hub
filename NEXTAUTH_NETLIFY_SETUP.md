╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║          🚀 NEXTAUTH + NETLIFY CONFIGURATION GUIDE                        ║
║                  NOT Vercel - NETLIFY SPECIFIC                            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT: NETLIFY ≠ VERCEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're using NETLIFY, not Vercel!

Your URLs MUST be:
  PRODUCTION: https://beacon-press-hub-news.netlify.app
  LOCAL: http://localhost:3000

NOT any Vercel URLs!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CORRECT NEXTAUTH CONFIGURATION FOR NETLIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOR LOCAL DEVELOPMENT (.env.local):
┌─────────────────────────────────────────────────────────────────────────┐
│ NEXTAUTH_URL=http://localhost:3000                                       │
│ NEXTAUTH_SECRET=IWVf9N/ZJf8O+D/lezppuZptoAi/X0ysVlmsCt3H3VA=           │
└─────────────────────────────────────────────────────────────────────────┘

FOR PRODUCTION (Netlify Dashboard):
┌─────────────────────────────────────────────────────────────────────────┐
│ NEXTAUTH_URL=https://beacon-press-hub-news.netlify.app                  │
│ NEXTAUTH_SECRET=IWVf9N/ZJf8O+D/lezppuZptoAi/X0ysVlmsCt3H3VA=           │
│                                                                          │
│ (Keep the same NEXTAUTH_SECRET in both local and production)            │
└─────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NETLIFY ENVIRONMENT VARIABLES SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Go to Netlify Dashboard
  https://app.netlify.com

Step 2: Select your site
  "beacon-press-hub-news"

Step 3: Navigate to Site Settings
  Click: Site Settings (top navigation)

Step 4: Build & Deploy
  Left sidebar → Build & Deploy → Environment

Step 5: Add Environment Variables
  Click: "Add environment variable"

Add THESE variables (exact values):
┌─────────────────────────────────────────────────────────────────────────┐
│ Variable: NEXTAUTH_URL                                                  │
│ Value: https://beacon-press-hub-news.netlify.app                        │
│ (NOT localhost, NOT Vercel)                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ Variable: NEXTAUTH_SECRET                                               │
│ Value: IWVf9N/ZJf8O+D/lezppuZptoAi/X0ysVlmsCt3H3VA=                    │
│ (Same as your local .env.local)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Variable: NEXT_PUBLIC_SUPABASE_URL                                      │
│ Value: https://ptenbtyommucwleqzdwd.supabase.co                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Variable: NEXT_PUBLIC_SUPABASE_ANON_KEY                                 │
│ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Variable: SUPABASE_SERVICE_ROLE_KEY (MARK AS SECRET!)                  │
│ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...                         │
└─────────────────────────────────────────────────────────────────────────┘

Step 6: Trigger Redeploy
  After adding variables, click "Deploy site" or "Trigger deploy"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 SUPABASE REDIRECT URLs - FOR NETLIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to Supabase Dashboard:
  https://supabase.com/dashboard/project/ptenbtyommucwleqzdwd/auth/url-configuration

Site URL (set to):
  https://beacon-press-hub-news.netlify.app

Redirect URLs (add BOTH):
  ✓ http://localhost:3000/auth/callback        (for local testing)
  ✓ https://beacon-press-hub-news.netlify.app/auth/callback  (for production)
  ✓ https://beacon-press-hub-news.netlify.app/admin/login    (for production)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 HOW TO TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL TESTING:
  1. npm run dev
  2. Go to: http://localhost:3000/admin/login
  3. Email: admin@beaconpress.com
  4. Password: Beacon123!@#
  5. Should redirect to: http://localhost:3000/admin/publisher

PRODUCTION TESTING (after deploying to Netlify):
  1. Go to: https://beacon-press-hub-news.netlify.app/admin/login
  2. Email: admin@beaconpress.com
  3. Password: Beacon123!@#
  4. Should redirect to: https://beacon-press-hub-news.netlify.app/admin/publisher

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ COMMON NETLIFY MISTAKES TO AVOID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Don't use Vercel URLs:
   NEXTAUTH_URL=https://vercel.com/... ← WRONG!
   ✓ NEXTAUTH_URL=https://beacon-press-hub-news.netlify.app ← CORRECT!

❌ Don't forget to update Netlify environment variables:
   Just having .env.local won't work on Netlify
   ✓ Must add to Netlify Dashboard → Site Settings → Environment

❌ Don't use localhost for production:
   NEXTAUTH_URL=http://localhost:3000 ← WRONG for production!
   ✓ NEXTAUTH_URL=https://beacon-press-hub-news.netlify.app ← CORRECT!

❌ Don't forget to redeploy after adding variables:
   ✓ After adding env vars, trigger new deploy or push to master

❌ Don't use Vercel Analytics:
   Netlify has its own Analytics (different setup)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 NETLIFY-SPECIFIC FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your project uses:
  ✓ Netlify hosting (NOT Vercel)
  ✓ Netlify Build → npx next build
  ✓ Netlify Functions (if needed later)
  ✓ Netlify Environment Variables
  ✓ Netlify Deploy Previews (on pull requests)

Your netlify.toml already has:
  ✓ @netlify/plugin-nextjs (handles Next.js routing)
  ✓ Correct build command
  ✓ Correct publish directory (.next)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 QUICK REFERENCE TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────┐
│ Setting         │ Local Value              │ Netlify Value              │
├─────────────────────────────────────────────────────────────────────────┤
│ NEXTAUTH_URL    │ http://localhost:3000    │ https://beacon-press...    │
│ NEXTAUTH_SECRET │ IWVf9N/ZJf8O+D/...       │ IWVf9N/ZJf8O+D/... (same) │
│ Supabase URL    │ https://ptenbty...       │ https://ptenbty... (same)  │
│ Supabase Keys   │ (same keys)              │ (same keys)                │
└─────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 IMPORTANT LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Netlify Dashboard:
  https://app.netlify.com/sites/beacon-press-hub-news/settings/general

Netlify Environment Variables:
  https://app.netlify.com/sites/beacon-press-hub-news/settings/build#environment

Supabase Auth Configuration:
  https://supabase.com/dashboard/project/ptenbtyommucwleqzdwd/auth/url-configuration

Your Netlify Site:
  https://beacon-press-hub-news.netlify.app

Local Development:
  http://localhost:3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DEPLOYMENT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LOCAL DEVELOPMENT:
   npm run dev
   → http://localhost:3000 (uses .env.local with localhost URL)

2. TEST LOCALLY:
   Log in and test features
   → Verify everything works

3. PUSH TO GITHUB:
   git add .
   git commit -m "Your message"
   git push origin master

4. NETLIFY AUTO-DEPLOYS:
   → Picks up NEXTAUTH_URL from Netlify env vars
   → Builds with production settings
   → Deploys to https://beacon-press-hub-news.netlify.app

5. TEST PRODUCTION:
   https://beacon-press-hub-news.netlify.app/admin/login
   → Should work with same credentials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remember: You're using NETLIFY, not Vercel!
All configuration should reference your Netlify domain only.

═══════════════════════════════════════════════════════════════════════════════
