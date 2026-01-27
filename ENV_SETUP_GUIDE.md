================================================================
ENVIRONMENT VARIABLES CONFIGURATION GUIDE
Beacon Press Hub - Full Setup
================================================================

📍 FILE LOCATIONS:

- Local development: .env.local
- Production (Netlify): Set in Netlify Dashboard > Site Settings > Build & Deploy > Environment

================================================================

1. NEXTAUTH CONFIGURATION
================================================================

URL TO USE:
If developing LOCALLY:
  NEXTAUTH_URL=<http://localhost:3000>
  
If using NETLIFY:
  NEXTAUTH_URL=<https://beacon-press-hub-news.netlify.app>

GENERATE NEXTAUTH_SECRET:
Run this command in terminal:
  openssl rand -base64 32

OR visit: <https://generate-secret.vercel.app/32>

Then add to .env.local:
  NEXTAUTH_SECRET=your-generated-secret-here
  NEXTAUTH_URL=<http://localhost:3000> (for local development)

Example .env.local:
  NEXTAUTH_URL=<http://localhost:3000>
  NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

================================================================
2. SUPABASE CONFIGURATION
================================================================

Get these from: <https://supabase.com/dashboard>

1. Go to your project
2. Click "Settings" → "API"

REQUIRED:
  NEXT_PUBLIC_SUPABASE_URL=<https://your-project-id.supabase.co>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only)

Example:
  NEXT_PUBLIC_SUPABASE_URL=<https://xyzsomething.supabase.co>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

================================================================
3. ANALYTICS CONFIGURATION
================================================================

NEXT_PUBLIC_ANALYTICS_ID options:

OPTION A: Google Analytics (Recommended)
  Get from: <https://analytics.google.com>

  1. Create new property for your site
  2. Find Measurement ID (starts with 'G-')
  3. Add to .env.local:
     NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

  Example:
     NEXT_PUBLIC_ANALYTICS_ID=G-ABC123DEF456

OPTION B: Vercel Analytics
  Get from: <https://vercel.com/analytics>

  1. Go to your Vercel project
  2. Copy Web Vitals ID
  3. Add to .env.local:
     NEXT_PUBLIC_ANALYTICS_ID=your-vercel-analytics-id

OPTION C: Mixpanel
  Get from: <https://mixpanel.com>

  1. Create new project
  2. Find Project Token
  3. Add to .env.local:
     NEXT_PUBLIC_ANALYTICS_ID=your-mixpanel-token

OPTION D: Plausible Analytics
  Get from: <https://plausible.io>

  1. Create new site
  2. Find Data Domain
  3. Add to .env.local:
     NEXT_PUBLIC_ANALYTICS_ID=yourdomain.com

Recommended: Google Analytics (FREE, most features)

================================================================
4. ADMIN CREDENTIALS
================================================================

OPTION A: Hardcoded (Development Only - NOT for production)
  ADMIN_EMAIL=<admin@beaconpress.com>
  ADMIN_PASSWORD=Beacon123!@#

OPTION B: Supabase Auth (Production - Recommended)
  No additional env vars needed - use Supabase auth directly

For development, add to .env.local:
  NEXT_PUBLIC_ADMIN_EMAIL=<admin@beaconpress.com>
  NEXT_PUBLIC_ADMIN_PASSWORD=Beacon123!@#

⚠️ NEVER commit passwords to GitHub!

================================================================
5. COMPLETE .env.local TEMPLATE FOR LOCAL DEVELOPMENT
================================================================

# === NEXTAUTH ===

NEXTAUTH_URL=<http://localhost:3000>
NEXTAUTH_SECRET=your-generated-secret-here

# === SUPABASE ===

NEXT_PUBLIC_SUPABASE_URL=<https://your-project.supabase.co>
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# === ANALYTICS ===

NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# === ADMIN (Development Only) ===

NEXT_PUBLIC_ADMIN_EMAIL=<admin@beaconpress.com>
NEXT_PUBLIC_ADMIN_PASSWORD=Beacon123!@#

# === COMPANY INFO ===

NEXT_PUBLIC_COMPANY_NAME=AY'SMART INVESTMENT LTD
NEXT_PUBLIC_COMPANY_PHONE=+234 813 627 2360
NEXT_PUBLIC_COMPANY_EMAIL=<admin@ayinvestmentltd.com>
NEXT_PUBLIC_COMPANY_WHATSAPP=+234 813 627 2360

================================================================
6. NETLIFY DASHBOARD SETUP
================================================================

1. Go to: <https://app.netlify.com>
2. Select your site: "beacon-press-hub-news"
3. Go to: Site settings → Build & deploy → Environment
4. Click "Add environment variables"

Add ALL of the following (DO NOT include NEXTAUTH_SECRET on Netlify if using Vercel):

NEXTAUTH_URL=<https://beacon-press-hub-news.netlify.app>
NEXTAUTH_SECRET=(same secret as local)
NEXT_PUBLIC_SUPABASE_URL=(your supabase URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=(your anon key)
SUPABASE_SERVICE_ROLE_KEY=(your service role key)
NEXT_PUBLIC_ANALYTICS_ID=(your analytics ID)

⚠️ Important Notes:

- SUPABASE_SERVICE_ROLE_KEY is marked as SECRET (hidden)
- NEXT_PUBLIC_* variables are visible in browser (OK)
- All variables except NEXT_PUBLIC_* are server-side only

================================================================
7. HOW TO ACCESS PAGES - LOCALHOST vs NETLIFY
================================================================

LOCAL DEVELOPMENT (<http://localhost:3000>):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Homepage:           <http://localhost:3000>
  Admin Login:        <http://localhost:3000/admin/login>
  Publisher:          <http://localhost:3000/admin/publisher>
  Flier Generator:    <http://localhost:3000/admin/flier-generator>
  
  Login Credentials:
    Email:    <admin@beaconpress.com>
    Password: Beacon123!@#

NETLIFY PRODUCTION (<https://beacon-press-hub-news.netlify.app>):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Homepage:           <https://beacon-press-hub-news.netlify.app>
  Admin Login:        <https://beacon-press-hub-news.netlify.app/admin/login>
  Publisher:          <https://beacon-press-hub-news.netlify.app/admin/publisher>
  Flier Generator:    <https://beacon-press-hub-news.netlify.app/admin/flier-generator>
  
  Login Credentials:
    Email:    <admin@beaconpress.com>
    Password: Beacon123!@#

CUSTOM DOMAIN (Once you set up custom domain):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Homepage:           <https://yourdomain.com>
  Admin Login:        <https://yourdomain.com/admin/login>
  Publisher:          <https://yourdomain.com/admin/publisher>
  Flier Generator:    <https://yourdomain.com/admin/flier-generator>

================================================================
8. STEP-BY-STEP SETUP PROCESS
================================================================

STEP 1: Generate Secrets
  → Run: openssl rand -base64 32
  → Save the output (NEXTAUTH_SECRET)

STEP 2: Get Supabase Keys
  → Go to supabase.com/dashboard
  → Find your project API keys
  → Copy: SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY

STEP 3: Set up Analytics
  → Visit analytics.google.com
  → Create new property
  → Get Measurement ID (G-XXXXXXXX)

STEP 4: Update Local .env.local
  → Create file: .env.local
  → Add all values from template above
  → Save & close

STEP 5: Test Locally
  → Run: npm run dev
  → Visit: <http://localhost:3000/admin/login>
  → Login with credentials
  → Try Flier Generator: /admin/flier-generator

STEP 6: Configure Netlify
  → Login to netlify.com
  → Go to your site settings
  → Add environment variables
  → Trigger redeploy
  → Verify at: <https://beacon-press-hub-news.netlify.app>

STEP 7: Verify Production
  → Visit Netlify URL
  → Test admin login
  → Test flier generator
  → Check console for errors

================================================================
9. QUICK REFERENCE TABLE
================================================================

┌─────────────────────────────────────────────────────────────┐
│ Variable Name           │ Local Value    │ Netlify Value   │
├─────────────────────────────────────────────────────────────┤
│ NEXTAUTH_URL            │ localhost:3000 │ netlify domain  │
│ NEXTAUTH_SECRET         │ (generated)    │ (generated)     │
│ SUPABASE_URL            │ (same)         │ (same)          │
│ SUPABASE_ANON_KEY       │ (same)         │ (same)          │
│ SUPABASE_SERVICE_ROLE   │ (same)         │ (same)          │
│ ANALYTICS_ID            │ (same)         │ (same)          │
│ ADMIN_EMAIL             │ (same)         │ (same)          │
│ ADMIN_PASSWORD          │ (same)         │ (same)          │
└─────────────────────────────────────────────────────────────┘

================================================================
10. TROUBLESHOOTING
================================================================

Problem: NextAuth not working
  → Check NEXTAUTH_URL matches your current domain
  → Check NEXTAUTH_SECRET is set
  → Clear cookies and retry

Problem: Supabase connection failing
  → Check SUPABASE_URL and ANON_KEY
  → Verify both have no extra spaces
  → Check Supabase project is active

Problem: Admin login not working
  → For hardcoded: Check ADMIN_EMAIL and ADMIN_PASSWORD
  → For Supabase Auth: Check user exists in Supabase
  → Clear browser cache and retry

Problem: Analytics not tracking
  → Check ANALYTICS_ID is correct
  → Verify property is active in analytics dashboard
  → Check no ad blockers interfering
  → Wait 24 hours for data to appear

Problem: Netlify showing 404 on admin pages
  → Check Netlify build logs for errors
  → Verify all env vars are set in Netlify
  → Trigger manual redeploy
  → Check middleware is enabled

================================================================
