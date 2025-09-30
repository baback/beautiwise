-- BeautiWise Database Schema
-- Run this SQL in your Supabase project dashboard

-- Create BeautiWise users table
CREATE TABLE IF NOT EXISTS beautiwise_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    skin_type VARCHAR(50),
    skin_concerns TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompts_card table for home page cards
CREATE TABLE IF NOT EXISTS prompts_card (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table for conversation history
CREATE TABLE IF NOT EXISTS chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES beautiwise_users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    messages JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table for beauty articles
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    reading_time INTEGER DEFAULT 2,
    views_count INTEGER DEFAULT 0,
    category VARCHAR(100),
    tags TEXT[],
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table for beauty products
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    brand VARCHAR(100),
    category VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    affiliate_url TEXT,
    affiliate_provider VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers for all tables
CREATE TRIGGER update_beautiwise_users_updated_at 
    BEFORE UPDATE ON beautiwise_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_card_updated_at 
    BEFORE UPDATE ON prompts_card 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at 
    BEFORE UPDATE ON chats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE beautiwise_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_card ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS policies for beautiwise_users
CREATE POLICY "Users can view own profile" ON beautiwise_users
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON beautiwise_users
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile" ON beautiwise_users
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- RLS policies for prompts_card (public read)
CREATE POLICY "Anyone can view active prompts" ON prompts_card
    FOR SELECT USING (is_active = true);

-- RLS policies for chats (user-specific)
CREATE POLICY "Users can view own chats" ON chats
    FOR SELECT USING (user_id IN (SELECT id FROM beautiwise_users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own chats" ON chats
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM beautiwise_users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own chats" ON chats
    FOR UPDATE USING (user_id IN (SELECT id FROM beautiwise_users WHERE auth_user_id = auth.uid()));

-- RLS policies for articles (public read)
CREATE POLICY "Anyone can view published articles" ON articles
    FOR SELECT USING (is_published = true);

-- RLS policies for products (public read)
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE articles 
    SET views_count = views_count + 1 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
