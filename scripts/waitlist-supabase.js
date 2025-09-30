// Waitlist Integration via Secure Edge Function
class WaitlistSupabase {
    constructor() {
        // Edge Function URL - no sensitive credentials exposed!
        this.edgeFunctionUrl = 'https://srhffhqehbvtpmquecuv.supabase.co/functions/v1/submit-waitlist';
        // Public anon key (safe to expose - limited by RLS policies)
        this.anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaGZmaHFlaGJ2dHBtcXVlY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzE5MzYsImV4cCI6MjA3NDUwNzkzNn0.td7agrQiZyy5WZQd-h8Zv5WbyL-RQGv6rP81kQ_IWUY';
    }

    async submitEmail(email) {
        try {
            const response = await fetch(this.edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.anonKey}`
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await response.json();

            if (response.ok) {
                return { 
                    success: true, 
                    alreadyExists: data.alreadyExists || false 
                };
            } else {
                console.error('Waitlist error:', data);
                return { 
                    success: false, 
                    error: data.error || 'Failed to submit' 
                };
            }
        } catch (error) {
            console.error('Failed to submit to waitlist:', error);
            return { 
                success: false, 
                error: 'Network error. Please try again.' 
            };
        }
    }

    // Note: Email checking is now handled server-side for security
    async checkEmailExists(email) {
        // This method is no longer needed as duplicate checking
        // is now handled securely by the Edge Function
        return false;
    }
}

// Create global instance
window.waitlistSupabase = new WaitlistSupabase();
