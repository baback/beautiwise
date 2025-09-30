// Waitlist Integration via Secure Edge Function
class WaitlistSupabase {
    constructor() {
        // Edge Function URL - no sensitive credentials exposed!
        this.edgeFunctionUrl = 'https://srhffhqehbvtpmquecuv.supabase.co/functions/v1/submit-waitlist';
    }

    async submitEmail(email) {
        try {
            const response = await fetch(this.edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
