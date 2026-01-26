-- ============================================================================
-- BEACON PRESS HUB - SUPABASE DATABASE SCHEMA
-- Run these SQL commands in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. POSTS TABLE (For News/Articles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  summary VARCHAR(500),
  image_url VARCHAR(500),
  author VARCHAR(255) DEFAULT 'Beacon Admin',
  is_sponsored BOOLEAN DEFAULT FALSE,
  link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- ============================================================================
-- 2. FLIERS TABLE (For Real Estate Marketing Fliers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS fliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  size VARCHAR(100),
  price_per_plot VARCHAR(100),
  price_per_acre VARCHAR(100),
  title_type VARCHAR(255),
  highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url VARCHAR(500),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  format VARCHAR(50) DEFAULT 'instagram-story',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fliers_created_at ON fliers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fliers_created_by ON fliers(created_by);

-- ============================================================================
-- 3. ADMIN_USERS TABLE (For Admin Access Control)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- ============================================================================
-- 4. AUDIT_LOG TABLE (For Tracking Admin Actions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100),
  table_name VARCHAR(100),
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON audit_log(admin_id);

-- ============================================================================
-- 5. CONTACTS TABLE (For Contact Form Submissions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  flier_id UUID REFERENCES fliers(id),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- ============================================================================
-- 6. ANALYTICS TABLE (For Tracking Page Views & Events)
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255),
  event_name VARCHAR(100),
  event_type VARCHAR(50),
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(45),
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
  os_name VARCHAR(100),
  browser_name VARCHAR(100),
  properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_page_url ON analytics(page_url);

-- ============================================================================
-- 7. PROPERTIES TABLE (For Real Estate Listings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  size DECIMAL(10, 2),
  size_unit VARCHAR(20) DEFAULT 'sqm',
  price DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'NGN',
  image_url VARCHAR(500),
  images_urls VARCHAR(500)[],
  property_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'available',
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) - SECURITY BEST PRACTICE
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - For Testing)
-- ============================================================================

-- Insert sample post
INSERT INTO posts (title, category, summary, author, is_sponsored)
VALUES (
  'Greenfield Estate Launch',
  'Real Estate',
  'New premium property development with excellent ROI potential',
  'Beacon Admin',
  FALSE
);

-- Insert sample admin user
-- Note: Replace 'your-user-uuid' with actual Supabase auth user UUID
-- INSERT INTO admin_users (user_id, email, full_name, role)
-- VALUES ('your-user-uuid', 'admin@ayinvestmentltd.com', 'AY Smart Admin', 'admin');

-- ============================================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================================
/*
1. AUTHENTICATION:
   - Users are stored in Supabase's auth.users table (created automatically)
   - admin_users table links authenticated users with admin roles

2. RLS POLICIES (Create these in Supabase Dashboard):
   - Posts: Public read, admin write
   - Fliers: Creator read/write, admin full access
   - Admin Users: Self read, super-admin write
   - Analytics: Public write, authenticated read

3. PERFORMANCE:
   - All primary tables have created_at indexes for sorting
   - Category/status fields indexed for filtering
   - User relationship fields indexed for joins

4. SECURITY:
   - Enable RLS on all tables
   - Use Row-Level Security policies
   - Never expose sensitive data in frontend queries
   - Validate all inputs server-side

5. MIGRATION:
   - Run this SQL in Supabase SQL Editor (one section at a time)
   - If table exists, will be skipped
   - Indexes are idempotent (safe to re-run)
*/
