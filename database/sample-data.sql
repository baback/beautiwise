-- Sample Data for BeautiWise
-- Run this after creating the schema

-- Insert sample prompts_card data (matching your current home page cards)
INSERT INTO prompts_card (title, description, prompt_text, image_url, category, display_order) VALUES
('Build a complete skincare routine', 'Get personalized recommendations for your skin type', 'I want to build a complete skincare routine tailored to my skin type. Can you help me identify the right products for cleansing, moisturizing, and treating specific concerns like acne, aging, or sensitivity?', 'assets/img/img-1.jpg', 'skincare', 1),
('Foundation matching', 'Find your perfect foundation shade and formula', 'I need help finding the perfect foundation match for my skin tone and type. Can you guide me through choosing the right shade, undertone, and formula that will work best for my skin?', 'assets/img/img-2.jpg', 'makeup', 2),
('Hair care routine', 'Discover the best hair care products for your hair type', 'I want to improve my hair care routine. Can you recommend products and techniques for my specific hair type, texture, and concerns like dryness, damage, or lack of volume?', 'assets/img/img-3.jpg', 'haircare', 3),
('Budget beauty upgrade', 'Affordable beauty products that deliver results', 'I''m looking to upgrade my beauty routine on a budget. Can you recommend affordable but effective products for skincare, makeup, and hair care that give great results without breaking the bank?', 'assets/img/img-4.jpg', 'budget', 4),
('Acne solutions', 'Effective treatments for acne-prone skin', 'I struggle with acne and breakouts. Can you recommend a comprehensive approach including skincare products, ingredients to look for, and lifestyle tips to help clear my skin?', 'assets/img/img-5.jpg', 'skincare', 5),
('Sensitive skin care', 'Gentle products for reactive skin', 'I have very sensitive skin that reacts to many products. Can you help me find gentle, hypoallergenic beauty products and create a routine that won''t cause irritation?', 'assets/img/img-6.jpg', 'skincare', 6),
('K-beauty routine', 'Explore Korean beauty trends and products', 'I''m interested in K-beauty and want to try Korean skincare and makeup products. Can you introduce me to the key steps, popular products, and brands to start with?', 'assets/img/img-7.jpg', 'trends', 7),
('Learn everyday makeup', 'Master daily makeup techniques and looks', 'I want to learn how to do everyday makeup that looks natural and polished. Can you teach me basic techniques and recommend beginner-friendly products for a simple daily routine?', 'assets/img/img-8.jpg', 'makeup', 8),
('Anti-aging skincare', 'Prevent and treat signs of aging', 'I want to learn about anti-aging skincare and what ingredients I should look for. Can you recommend a routine that helps with fine lines, wrinkles, and maintaining youthful skin?', 'assets/img/img-9.jpg', 'skincare', 9),
('Clean beauty ingredients', 'Understand natural and clean beauty products', 'I''m interested in clean and natural beauty products. Can you help me understand which ingredients to avoid and recommend clean beauty brands and products that are effective?', 'assets/img/img-10.jpg', 'clean', 10);

-- Insert sample articles data
INSERT INTO articles (title, content, excerpt, image_url, reading_time, views_count, category, tags) VALUES
('10 Skincare Ingredients You Should Know', 'A comprehensive guide to the most important skincare ingredients and their benefits...', 'Learn about the key ingredients that can transform your skincare routine', 'assets/img/img-6.jpg', 3, 15420, 'skincare', ARRAY['ingredients', 'skincare', 'guide']),
('Budget-Friendly Skincare That Actually Works', 'You don''t need to spend a fortune to have great skin. Here are the best affordable products...', 'Discover effective skincare products that won''t break the bank', 'assets/img/img-7.jpg', 2, 9800, 'budget', ARRAY['budget', 'skincare', 'affordable']),
('The Complete Guide to K-Beauty', 'Everything you need to know about Korean beauty trends, products, and routines...', 'Dive into the world of K-beauty with this comprehensive guide', 'assets/img/img-8.jpg', 4, 12350, 'trends', ARRAY['k-beauty', 'korean', 'trends']),
('Makeup Tips for Beginners', 'Starting your makeup journey? Here are essential tips and techniques for beginners...', 'Master the basics of makeup with these beginner-friendly tips', 'assets/img/img-9.jpg', 2, 8750, 'makeup', ARRAY['makeup', 'beginners', 'tips']);

-- Insert sample products data
INSERT INTO products (name, description, price, image_url, brand, category, rating, reviews_count, affiliate_url, affiliate_provider) VALUES
('CeraVe Foaming Cleanser', 'Gentle foaming cleanser for normal to oily skin', 12.99, 'assets/img/img-1.jpg', 'CeraVe', 'cleanser', 4.5, 2847, 'https://amazon.com/cerave-cleanser', 'amazon'),
('The Ordinary Niacinamide 10%', 'High-strength vitamin and zinc formula', 7.20, 'assets/img/img-3.jpg', 'The Ordinary', 'serum', 4.2, 4192, 'https://amazon.com/ordinary-niacinamide', 'amazon'),
('Paula''s Choice 2% BHA', 'Liquid exfoliant for blackheads and enlarged pores', 32.00, 'assets/img/img-5.jpg', 'Paula''s Choice', 'exfoliant', 4.8, 15000, 'https://amazon.com/paulas-choice-bha', 'amazon'),
('Neutrogena Hydro Boost', 'Water gel moisturizer for dry skin', 19.97, 'assets/img/img-2.jpg', 'Neutrogena', 'moisturizer', 4.3, 7500, 'https://amazon.com/neutrogena-hydro', 'amazon'),
('Fenty Beauty Foundation', 'Full coverage foundation in 50 shades', 39.00, 'assets/img/img-4.jpg', 'Fenty Beauty', 'foundation', 4.6, 3200, 'https://amazon.com/fenty-foundation', 'amazon'),
('Olaplex Hair Treatment', 'Professional hair strengthening treatment', 28.00, 'assets/img/img-10.jpg', 'Olaplex', 'hair', 4.7, 5800, 'https://amazon.com/olaplex-treatment', 'amazon');
