-- ============================================
-- CONNECT-DAET.ph Database Schema
-- Tourism Impact Assessment and Data Analytics System
-- Team 10 - Our Lady of Lourdes College Foundation
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Profiles table for all users
-- Links to Supabase auth.users table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  user_type TEXT CHECK (user_type IN ('tourist', 'artisan', 'operator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Reward history - the "glue" that connects all 11 subsystems
-- This is the primary data source for Team 10 Analytics
CREATE TABLE reward_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subsystem_source TEXT NOT NULL,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries on analytics dashboard
CREATE INDEX idx_reward_history_user_id ON reward_history(user_id);
CREATE INDEX idx_reward_history_subsystem ON reward_history(subsystem_source);
CREATE INDEX idx_reward_history_created_at ON reward_history(created_at DESC);

-- ============================================
-- SUBSYSTEM-SPECIFIC TABLES (Placeholders)
-- ============================================

-- Team 1: Tourist Information
CREATE TABLE info_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  query_text TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team 3: Museum System
CREATE TABLE museum_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  qr_code TEXT UNIQUE,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE museum_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  artifact_id UUID REFERENCES museum_artifacts(id),
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team 7: E-commerce Shop
CREATE TABLE shop_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  artisan_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shop_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team 8: Tours
CREATE TABLE tours_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tours_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  tour_id UUID REFERENCES tours_listings(id),
  booking_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team 9: Feedback
CREATE TABLE feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  subsystem_source TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: Everyone can view, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Reward History: Everyone can view (for analytics)
CREATE POLICY "Reward history is viewable by everyone" 
  ON reward_history FOR SELECT 
  USING (true);

CREATE POLICY "System can insert reward history" 
  ON reward_history FOR INSERT 
  WITH CHECK (true);

-- Museum Artifacts: Public viewing
CREATE POLICY "Museum artifacts are viewable by everyone" 
  ON museum_artifacts FOR SELECT 
  USING (true);

-- Museum Scans: Users can view their own scans
CREATE POLICY "Users can view own scans" 
  ON museum_scans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create scans" 
  ON museum_scans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Shop Products: Public viewing
CREATE POLICY "Shop products are viewable by everyone" 
  ON shop_products FOR SELECT 
  USING (true);

-- Shop Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" 
  ON shop_orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
  ON shop_orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Tours: Public viewing for listings
CREATE POLICY "Tour listings are viewable by everyone" 
  ON tours_listings FOR SELECT 
  USING (true);

-- Tour Bookings: Users can view their own bookings
CREATE POLICY "Users can view own bookings" 
  ON tours_bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
  ON tours_bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Feedback: Everyone can view aggregate feedback
CREATE POLICY "Feedback is viewable by everyone" 
  ON feedback_submissions FOR SELECT 
  USING (true);

CREATE POLICY "Users can submit feedback" 
  ON feedback_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS FOR ANALYTICS
-- ============================================

-- Function to calculate daily tourism metrics
CREATE OR REPLACE FUNCTION get_daily_metrics(start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  total_points INTEGER,
  unique_visitors BIGINT,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    SUM(points_earned)::INTEGER as total_points,
    COUNT(DISTINCT user_id) as unique_visitors,
    COUNT(*) as transaction_count
  FROM reward_history
  WHERE DATE(created_at) BETWEEN start_date AND end_date
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at);
END;
$$ LANGUAGE plpgsql;

-- Function to get subsystem performance
CREATE OR REPLACE FUNCTION get_subsystem_stats()
RETURNS TABLE (
  subsystem TEXT,
  transaction_count BIGINT,
  total_points INTEGER,
  unique_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    subsystem_source as subsystem,
    COUNT(*) as transaction_count,
    SUM(points_earned)::INTEGER as total_points,
    COUNT(DISTINCT user_id) as unique_users
  FROM reward_history
  GROUP BY subsystem_source
  ORDER BY transaction_count DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Note: Run this only in development/testing environment
-- Comment out for production

/*
-- Insert sample profile (requires auth.users entry first)
INSERT INTO profiles (id, full_name, user_type, points) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Test Tourist', 'tourist', 150);

-- Insert sample reward history
INSERT INTO reward_history (user_id, subsystem_source, points_earned) VALUES
  ('00000000-0000-0000-0000-000000000001', 'museum_qr_scan', 50),
  ('00000000-0000-0000-0000-000000000001', 'tour_booking', 100);
*/

-- ============================================
-- END OF SCHEMA
-- ============================================
