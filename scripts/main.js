// Main Page JavaScript
class BeautiWiseMain {
    constructor() {
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatBox = document.getElementById('chatBox');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFocusEffects();
    }

    setupEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key press
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }

    setupFocusEffects() {
        // Add outline to chat box when textarea is focused
        this.chatInput.addEventListener('focus', () => {
            this.chatBox.style.outline = '2px solid #68645F';
            this.chatBox.style.outlineOffset = '2px';
        });

        // Remove outline when textarea loses focus
        this.chatInput.addEventListener('blur', () => {
            this.chatBox.style.outline = 'none';
            this.chatBox.style.outlineOffset = '0';
        });
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Show waitlist modal instead of navigating
        openWaitlistModal();
    }

    navigateToChat(message) {
        // Store message in localStorage for the chat page
        localStorage.setItem('beautiwise_initial_message', message);
        
        // Navigate to chat page
        window.location.href = 'chat/index.html?message=' + encodeURIComponent(message);
    }

    setLoadingState(loading) {
        if (loading) {
            this.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin text-white text-sm"></i>';
            this.sendButton.disabled = true;
            this.chatInput.disabled = true;
        } else {
            this.sendButton.innerHTML = '<i class="fas fa-arrow-up text-white text-sm"></i>';
            this.sendButton.disabled = false;
            this.chatInput.disabled = false;
        }
    }
}

// Global function for suggestion buttons and cards
function usePrompt(element, prompt) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = prompt;
        
        // Add visual feedback
        element.classList.add('loading');
        
        // Auto-resize textarea
        const main = new BeautiWiseMain();
        main.autoResizeTextarea();
        
        // Send message after short delay
        setTimeout(() => {
            main.sendMessage();
        }, 300);
    }
}

// Sidebar functionality
function initializeSidebar() {
    // Add click handlers for sidebar buttons
    const sidebarButtons = document.querySelectorAll('.w-16 button');
    
    sidebarButtons.forEach((button, index) => {
        // Get the tooltip text to identify the button
        const tooltip = button.parentElement.querySelector('.absolute.left-12');
        const buttonType = tooltip ? tooltip.textContent.trim() : '';
        
        button.addEventListener('click', () => {
            switch(buttonType) {
                case 'Profile':
                    console.log('Profile clicked');
                    // Add profile functionality here
                    break;
                case 'New Chat':
                    // Clear the textarea and focus it
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) {
                        chatInput.value = '';
                        chatInput.focus();
                    }
                    break;
                case 'Explore':
                    console.log('Explore clicked - already on explore page');
                    break;
                case 'History':
                    console.log('History clicked');
                    // Add history functionality here
                    break;
                case 'Help':
                    console.log('Help clicked');
                    // Add help functionality here
                    break;
                case 'BeautiWise':
                    console.log('Logo clicked');
                    // Add logo functionality here
                    break;
            }
        });
    });
}

// Waitlist Modal Functions
function openWaitlistModal() {
    const modal = document.getElementById('waitlistModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeWaitlistModal() {
    const modal = document.getElementById('waitlistModal');
    if (modal) {
        modal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

async function submitWaitlist(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('waitlistEmail');
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('waitlistSuccess');
    const submitButton = event.target.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    if (!email) return;
    
    // Disable form while submitting
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Joining...';
    
    try {
        // Submit to Supabase
        const result = await window.waitlistSupabase.submitEmail(email);
        
        if (result.success) {
            console.log('✅ Email submitted to waitlist:', email);
            
            // Show success message
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeWaitlistModal();
                // Reset form for next time
                setTimeout(() => {
                    form.classList.remove('hidden');
                    successMessage.classList.add('hidden');
                    emailInput.value = '';
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Join Waitlist';
                }, 300);
            }, 3000);
        } else {
            throw new Error(result.error || 'Failed to submit');
        }
    } catch (error) {
        console.error('Error submitting to waitlist:', error);
        alert('Oops! Something went wrong. Please try again.');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Join Waitlist';
    }
}

// Make functions globally available
window.openWaitlistModal = openWaitlistModal;
window.closeWaitlistModal = closeWaitlistModal;
window.submitWaitlist = submitWaitlist;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BeautiWiseMain();
    initializeSidebar();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BeautiWiseMain;
}
