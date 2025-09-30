// Supabase Configuration
class SupabaseConfig {
    constructor() {
        // Your Supabase project configuration
        this.supabaseUrl = 'https://srhffhqehbvtpmquecuv.supabase.co';
        this.supabaseAnonKey = 'YOUR_ANON_KEY_HERE'; // You need to add your anon key here
        
        // Initialize Supabase client when key is available
        this.supabase = null;
        this.initializeClient();
    }
    
    async initializeClient() {
        if (!this.supabaseAnonKey) {
            console.warn('Supabase anon key not provided. Please add it to supabase-config.js');
            return;
        }
        
        try {
            // Import Supabase client
            const { createClient } = supabase;
            this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
            console.log('Supabase client initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
        }
    }
    
    getClient() {
        return this.supabase;
    }
    
    // Helper method to check if client is ready
    isReady() {
        return this.supabase !== null;
    }
}

// BeautiWise Database Service
class BeautiWiseDB {
    constructor() {
        this.config = new SupabaseConfig();
        this.supabase = null;
        this.initializeDB();
    }
    
    async initializeDB() {
        // Wait for Supabase client to be ready
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!this.config.isReady() && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (this.config.isReady()) {
            this.supabase = this.config.getClient();
            console.log('BeautiWise DB service ready');
        } else {
            console.error('Failed to initialize BeautiWise DB service');
        }
    }
    
    // Prompts Card Methods
    async getPromptsCards() {
        try {
            const { data, error } = await this.supabase
                .from('prompts_card')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching prompts cards:', error);
            return [];
        }
    }
    
    // Articles Methods
    async getArticles(limit = 4) {
        try {
            const { data, error } = await this.supabase
                .from('articles')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    }
    
    async incrementArticleViews(articleId) {
        try {
            const { data, error } = await this.supabase
                .rpc('increment_article_views', { article_id: articleId });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error incrementing article views:', error);
        }
    }
    
    // Products Methods
    async getProducts(limit = 6) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('rating', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
    
    async searchProducts(query, category = null, limit = 6) {
        try {
            let queryBuilder = this.supabase
                .from('products')
                .select('*')
                .eq('is_active', true);
            
            if (query) {
                queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
            }
            
            if (category) {
                queryBuilder = queryBuilder.eq('category', category);
            }
            
            const { data, error } = await queryBuilder
                .order('rating', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }
    
    // Users Methods
    async createUser(userData) {
        try {
            const { data, error } = await this.supabase
                .from('beautiwise_users')
                .insert([userData])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }
    
    async getUser(authUserId) {
        try {
            const { data, error } = await this.supabase
                .from('beautiwise_users')
                .select('*')
                .eq('auth_user_id', authUserId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
    
    async updateUser(userId, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('beautiwise_users')
                .update(updateData)
                .eq('id', userId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }
    
    // Chats Methods
    async createChat(userId, title, initialMessage = null) {
        try {
            const messages = initialMessage ? [initialMessage] : [];
            const { data, error } = await this.supabase
                .from('chats')
                .insert([{
                    user_id: userId,
                    title: title,
                    messages: messages
                }])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating chat:', error);
            return null;
        }
    }
    
    async getUserChats(userId, limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('chats')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('updated_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user chats:', error);
            return [];
        }
    }
    
    async updateChatMessages(chatId, messages) {
        try {
            const { data, error } = await this.supabase
                .from('chats')
                .update({ messages: messages })
                .eq('id', chatId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating chat messages:', error);
            return null;
        }
    }
    
    // Authentication Methods
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error signing up:', error);
            return null;
        }
    }
    
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error signing in:', error);
            return null;
        }
    }
    
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error signing out:', error);
            return false;
        }
    }
    
    async getCurrentUser() {
        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
    
    // Listen to auth state changes
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange(callback);
    }
}

// Global instance
window.beautiWiseDB = new BeautiWiseDB();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SupabaseConfig, BeautiWiseDB };
}
