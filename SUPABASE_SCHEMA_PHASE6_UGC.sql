-- ============================================================================
-- BEACON PRESS HUB - EXTENDED SCHEMA (Phase 6: UGC + Content Management)
-- Run these SQL commands in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- CREATE ENUM TYPES (Must be first!)
-- ============================================================================

-- Contribution status enum
CREATE TYPE contribution_status AS ENUM ('pending', 'approved', 'rejected', 'published');

-- Contribution category enum
CREATE TYPE contribution_category AS ENUM ('motivational', 'guest_article', 'success_story', 'tips', 'news_analysis');

-- Moderation action enum
CREATE TYPE moderation_action AS ENUM ('approved', 'rejected', 'flagged', 'archived');

-- Report reason enum
CREATE TYPE report_reason AS ENUM ('spam', 'inappropriate', 'misleading', 'plagiarism', 'other');

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- ============================================================================
-- 1. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- active, unsubscribed
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  categories TEXT[] DEFAULT ARRAY['news', 'property'], -- Topics subscribed to
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- ============================================================================
-- 2. APP USERS TABLE (for user-generated content contributors)
-- ============================================================================
CREATE TABLE IF NOT EXISTS app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  oauth_provider VARCHAR(50), -- 'google', 'apple', 'email'
  oauth_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  is_contributor BOOLEAN DEFAULT FALSE,
  contributor_verified BOOLEAN DEFAULT FALSE,
  contributor_badge VARCHAR(50), -- 'speaker', 'journalist', 'expert'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_is_contributor ON app_users(is_contributor);

-- ============================================================================
-- 3. USER CONTRIBUTIONS TABLE (Guest articles, motivational posts, etc)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  author_email VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_bio TEXT,
  
  title VARCHAR(500) NOT NULL,
  summary VARCHAR(1000),
  content TEXT NOT NULL,
  category contribution_category NOT NULL,
  image_url VARCHAR(500),
  
  -- Moderation fields
  status contribution_status DEFAULT 'pending',
  rejection_reason TEXT,
  
  -- Admin review
  reviewed_by UUID REFERENCES admin_users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Community feedback
  reports_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  
  -- Metadata
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contributions_author_id ON user_contributions(author_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON user_contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_category ON user_contributions(category);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON user_contributions(created_at DESC);

-- ============================================================================
-- 4. MODERATION LOG TABLE (Track what admins do)
-- ============================================================================
CREATE TABLE IF NOT EXISTS moderation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id UUID REFERENCES user_contributions(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  action moderation_action NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_contribution_id ON moderation_log(contribution_id);
CREATE INDEX IF NOT EXISTS idx_moderation_admin_id ON moderation_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_moderation_created_at ON moderation_log(created_at DESC);

-- ============================================================================
-- 5. CONTRIBUTION REPORTS TABLE (User reports spam/inappropriate content)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contribution_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id UUID REFERENCES user_contributions(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES app_users(id),
  reporter_email VARCHAR(255),
  reason report_reason NOT NULL,
  details TEXT,
  status VARCHAR(50) DEFAULT 'open', -- open, reviewed, resolved
  reviewed_by UUID REFERENCES admin_users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_contribution_id ON contribution_reports(contribution_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON contribution_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON contribution_reports(created_at DESC);

-- ============================================================================
-- 6. DAILY CONTENT TABLE (Horoscopes, quotes, jokes, etc)
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- 'quote', 'horoscope', 'joke', 'poem', 'tip'
  title VARCHAR(255),
  content TEXT NOT NULL,
  author VARCHAR(255),
  source_url VARCHAR(500),
  image_url VARCHAR(500),
  date_posted DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_content_type ON daily_content(content_type);
CREATE INDEX IF NOT EXISTS idx_daily_content_date ON daily_content(date_posted DESC);

-- ============================================================================
-- 7. RSS FEEDS TABLE (Track integrated news sources)
-- ============================================================================
CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL UNIQUE,
  category VARCHAR(100), -- 'crypto', 'real_estate', 'finance', 'politics', 'tech'
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched TIMESTAMP WITH TIME ZONE,
  fetch_interval_hours INT DEFAULT 4,
  article_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rss_feeds_category ON rss_feeds(category);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_is_active ON rss_feeds(is_active);

-- ============================================================================
-- 8. FEDERATED ARTICLES TABLE (Articles from RSS feeds)
-- ============================================================================
CREATE TABLE IF NOT EXISTS federated_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rss_feed_id UUID REFERENCES rss_feeds(id),
  external_url VARCHAR(500) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  image_url VARCHAR(500),
  author VARCHAR(255),
  source_name VARCHAR(255),
  category VARCHAR(100),
  
  published_date TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Analytics
  views_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_federated_rss_feed_id ON federated_articles(rss_feed_id);
CREATE INDEX IF NOT EXISTS idx_federated_category ON federated_articles(category);
CREATE INDEX IF NOT EXISTS idx_federated_published_date ON federated_articles(published_date DESC);

-- ============================================================================
-- 9. TRENDING POSTS TABLE (Global Pulse calculation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS trending_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_type VARCHAR(50) NOT NULL, -- 'original', 'contributed', 'federated'
  post_id UUID NOT NULL, -- References posts.id, user_contributions.id, or federated_articles.id
  title VARCHAR(500),
  category VARCHAR(100),
  
  views_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  trending_score NUMERIC(10, 2) DEFAULT 0,
  
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_until TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trending_post_type ON trending_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_trending_score ON trending_posts(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_display_until ON trending_posts(display_until);

-- ============================================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================================

-- Newsletter subscribers - only admins can view all, users can view their own
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage subscribers"
  ON newsletter_subscribers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- App users - public profile, but private data
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles"
  ON app_users FOR SELECT
  USING (TRUE);

CREATE POLICY "Users manage own profile"
  ON app_users FOR UPDATE
  USING (auth.uid() = id);

-- User contributions - public read, author/admin write
ALTER TABLE user_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published contributions"
  ON user_contributions FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authors can submit contributions"
  ON user_contributions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update own contributions"
  ON user_contributions FOR UPDATE
  USING (author_id = auth.uid() OR auth.role() = 'authenticated');

-- Moderation log - admin only
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view moderation log"
  ON moderation_log FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample RSS feeds
INSERT INTO rss_feeds (name, url, category, description, is_active)
VALUES
  ('CoinDesk - Crypto News', 'https://www.coindesk.com/arc/outboundfeeds/rss/', 'crypto', 'Leading crypto news source', TRUE),
  ('Bloomberg Real Estate', 'https://www.bloomberg.com/feed/podcast/real-estate.rss', 'real_estate', 'Real estate market analysis', TRUE),
  ('Reuters Politics', 'https://feeds.reuters.com/reuters/businessNews', 'politics', 'Political news and analysis', TRUE),
  ('TechCrunch', 'http://feeds.techcrunch.com/TechCrunch/', 'tech', 'Technology and startup news', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample newsletter subscriber
INSERT INTO newsletter_subscribers (email, full_name, status, categories)
VALUES ('subscriber@example.com', 'Sample Subscriber', 'active', ARRAY['news', 'property'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- HELPFUL NOTES
-- ============================================================================
/*

IMPORTANT SETUP STEPS:

1. Run this entire schema file in Supabase SQL Editor

2. Create app_users auth records (same as admin_users):
   - Go to Authentication → Users
   - Create users with email/password or OAuth
   - Users will automatically appear in app_users after first login

3. For RSS Feeds:
   - URLs above are examples - verify they're still active
   - You'll set up a cron job to fetch feeds hourly

4. For Daily Content:
   - Integrate APIs: quotable.io, horoscope-api, joke-api, poetrydb.org
   - Or manually insert content daily

5. Permissions:
   - Admins: Can moderate all contributions, manage feeds, view all data
   - Contributors: Can submit articles (pending review)
   - Users: Can view published content, report inappropriate items
   - Public: Can view published content only

*/
