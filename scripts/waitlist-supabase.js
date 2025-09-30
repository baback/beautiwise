// Supabase Waitlist Integration
class WaitlistSupabase {
    constructor() {
        this.supabaseUrl = 'https://srhffhqehbvtpmquecuv.supabase.co';
        this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaGZmaHFlaGJ2dHBtcXVlY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzE5MzYsImV4cCI6MjA3NDUwNzkzNn0.td7agrQiZyy5WZQd-h8Zv5WbyL-RQGv6rP81kQ_IWUY';
    }

    async submitEmail(email) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    email: email,
                    source: 'website',
                    ip_address: null, // Can be populated from server-side
                    user_agent: navigator.userAgent
                })
            });

            if (response.ok || response.status === 201) {
                return { success: true };
            } else if (response.status === 409) {
                // Duplicate email
                return { success: true, alreadyExists: true };
            } else {
                const error = await response.json();
                console.error('Supabase error:', error);
                return { success: false, error: error.message };
            }
        } catch (error) {
            console.error('Failed to submit to waitlist:', error);
            return { success: false, error: error.message };
        }
    }

    async checkEmailExists(email) {
        try {
            const response = await fetch(
                `${this.supabaseUrl}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=id`,
                {
                    headers: {
                        'apikey': this.supabaseAnonKey,
                        'Authorization': `Bearer ${this.supabaseAnonKey}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.length > 0;
            }
            return false;
        } catch (error) {
            console.error('Failed to check email:', error);
            return false;
        }
    }
}

// Create global instance
window.waitlistSupabase = new WaitlistSupabase();
