// BeautiWise Chat Page Application
class BeautiWiseChatPage {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendMessageBtn = document.getElementById('sendMessageBtn');
        this.productsList = document.getElementById('productsList');
        this.articlesList = document.getElementById('articlesList');
        this.isLoading = false;
        
        // OpenAI API configuration
        this.apiKey = ''; // Add your OpenAI API key here
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.conversationHistory = [];
        
        // Personalization flow
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialMessage();
    }

    setupEventListeners() {
        // Send button click
        this.sendMessageBtn.addEventListener('click', () => this.sendFollowUp());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendFollowUp();
            }
        });
    }

    loadInitialMessage() {
        // Get the initial message from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const initialMessage = urlParams.get('message') || localStorage.getItem('beautiwise_initial_message');
        
        if (initialMessage) {
            // Add user's initial message to chat with timestamp
            this.addUserMessageWithTime(initialMessage);
            
            // Start the processing flow
            setTimeout(() => {
                this.startLinearQuestionFlow(initialMessage);
            }, 500);
            
            // Clear from localStorage
            localStorage.removeItem('beautiwise_initial_message');
        }
    }

    addUserMessageWithTime(message) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 justify-end mb-4 message-user';
        messageDiv.innerHTML = `
            <div class="text-right">
                <div class="bg-[#F1F0ED] rounded-2xl p-4 max-w-sm mb-1 message-bubble">
                    <p class="text-[#68645F]">${this.escapeHtml(message)}</p>
                </div>
                <p class="text-xs text-gray-500">${timeString}</p>
            </div>
            <div class="w-8 h-8 bg-[#68645F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <i class="fas fa-user text-white text-sm"></i>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 justify-end mb-4 message-user';
        messageDiv.innerHTML = `
            <div class="text-right">
                <div class="bg-[#F1F0ED] rounded-2xl p-4 max-w-sm message-bubble">
                    <p class="text-[#68645F]">${this.escapeHtml(message)}</p>
                </div>
            </div>
            <div class="w-8 h-8 bg-[#68645F] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <i class="fas fa-user text-white text-sm"></i>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 mb-4 message-bot';
        messageDiv.innerHTML = `
            <img src="../assets/logo/sqr-logo-accent.svg" alt="BeautiWise" class="w-8 h-8 flex-shrink-0 mt-1">
            <div class="flex-1">
                <div class="flex items-center space-x-1 mb-2">
                    <p class="text-gray-800 text-md font-semibold">BeautiWise</p>
                    <div class="w-4 h-4 bg-neutral-900 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-white">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M11.106 2.553a1 1 0 0 1 1.788 0l2.851 5.701l5.702 2.852a1 1 0 0 1 .11 1.725l-.11 .063l-5.702 2.851l-2.85 5.702a1 1 0 0 1 -1.726 .11l-.063 -.11l-2.852 -5.702l-5.701 -2.85a1 1 0 0 1 -.11 -1.726l.11 -.063l5.701 -2.852z" />
                        </svg>
                    </div>
                </div>
                <div class="text-gray-700 message-bubble">
                    ${this.formatMessage(message)}
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    async startLinearQuestionFlow(message) {
        // Generate questions based on the message
        const questions = this.generatePersonalizationQuestions(message);
        
        // Start asking questions one by one
        this.currentQuestions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        
        // Ask first question
        setTimeout(() => {
            this.askNextQuestion();
        }, 1000);
    }

    generatePersonalizationQuestions(message) {
        // Generate contextual questions based on the user's initial message (reduced to 2 questions)
        const baseQuestions = [
            {
                question: "How would you describe your T-zone (forehead, nose, chin)?",
                options: ["Very oily with large pores", "Moderately oily", "Slightly oily", "Normal", "Sometimes oily, sometimes normal", "Dry"]
            },
            {
                question: "What's your biggest challenge with combination skin?",
                options: ["Balancing oily and dry areas", "Finding products that work for both zones", "Breakouts in T-zone", "Dryness on cheeks", "Enlarged pores", "Uneven texture"]
            }
        ];

        return baseQuestions;
    }

    askNextQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            // All questions answered, start processing
            this.finalizePesonalization();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        this.addBotQuestionMessage(question);
    }

    addBotQuestionMessage(questionData) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 mb-4 message-bot';
        
        const optionsHtml = questionData.options.map((option, index) => 
            `<button class="linear-option-btn bg-white border border-gray-200 hover:border-[#68645F] hover:bg-[#F1F0ED] rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors" onclick="chatPage.selectLinearOption('${option}')">${option}</button>`
        ).join('');
        
        messageDiv.innerHTML = `
            <img src="../assets/logo/sqr-logo-accent.svg" alt="BeautiWise" class="w-8 h-8 flex-shrink-0 mt-1">
            <div class="flex-1">
                <div class="flex items-center space-x-1 mb-2">
                    <p class="text-gray-800 text-md font-semibold">BeautiWise</p>
                    <div class="w-4 h-4 bg-neutral-900 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-white">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M11.106 2.553a1 1 0 0 1 1.788 0l2.851 5.701l5.702 2.852a1 1 0 0 1 .11 1.725l-.11 .063l-5.702 2.851l-2.85 5.702a1 1 0 0 1 -1.726 .11l-.063 -.11l-2.852 -5.702l-5.701 -2.85a1 1 0 0 1 -.11 -1.726l.11 -.063l5.701 -2.852z" />
                        </svg>
                    </div>
                </div>
                <div class="mb-3">
                    <p class="text-gray-700 mb-3">${questionData.question}</p>
                    <div class="flex flex-wrap gap-2">
                        ${optionsHtml}
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    selectLinearOption(option) {
        // Store the answer
        this.userAnswers.push(option);
        
        // Add user's answer as a message
        this.addUserMessage(option);
        
        // Move to next question
        this.currentQuestionIndex++;
        
        // Ask next question after a short delay
        setTimeout(() => {
            this.askNextQuestion();
        }, 800);
    }

    finalizePesonalization() {
        // Add user's answers summary
        this.addUserAnswersToChat();
        
        // Hide personalization interactivity
        this.hidePersonalizationInteractivity();
        
        // Start processing steps
        setTimeout(() => {
            this.startLinearProcessing();
        }, 1000);
    }

    addUserAnswersToChat() {
        const answersText = `My answers: ${this.userAnswers.join(', ')}`;
        this.addUserMessage(answersText);
    }

    hidePersonalizationInteractivity() {
        // Disable all option buttons
        const optionButtons = document.querySelectorAll('.linear-option-btn');
        optionButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.onclick = null;
        });
    }

    startLinearProcessing() {
        // Show loading state in right sidebar
        this.showLoadingState();
        
        // Add combined processing steps
        this.addCombinedProcessingSteps();
        
        // After processing animation, add final explanation and show products
        setTimeout(() => {
            this.addFinalExplanation();
            // Show products and articles after routine is complete
            setTimeout(() => {
                this.showProductsAndArticles();
            }, 1000);
        }, 6000);
    }

    addCombinedProcessingSteps() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 mb-4 message-bot';
        messageDiv.innerHTML = `
            <img src="../assets/logo/sqr-logo-accent.svg" alt="BeautiWise" class="w-8 h-8 flex-shrink-0 mt-1">
            <div class="flex-1">
                <div class="flex items-center space-x-1 mb-2">
                    <p class="text-gray-800 text-md font-semibold">BeautiWise</p>
                    <div class="w-4 h-4 bg-neutral-900 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-white">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M11.106 2.553a1 1 0 0 1 1.788 0l2.851 5.701l5.702 2.852a1 1 0 0 1 .11 1.725l-.11 .063l-5.702 2.851l-2.85 5.702a1 1 0 0 1 -1.726 .11l-.063 -.11l-2.852 -5.702l-5.701 -2.85a1 1 0 0 1 -.11 -1.726l.11 -.063l5.701 -2.852z" />
                        </svg>
                    </div>
                </div>
                <div class="space-y-3">
                    <!-- Step 1 -->
                    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div class="flex items-center space-x-3">
                            <div class="w-6 h-6 flex items-center justify-center step1-icon">
                                <div class="w-4 h-4 border-2 border-[#68645F] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <span class="text-gray-700">Analyzing your preferences...</span>
                        </div>
                    </div>
                    <!-- Step 2 -->
                    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div class="flex items-center space-x-3">
                            <div class="w-6 h-6 flex items-center justify-center step2-icon">
                                <div class="w-4 h-4 border-2 border-[#68645F] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <span class="text-gray-700">Finding the best products for you...</span>
                        </div>
                    </div>
                    <!-- Step 3 -->
                    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div class="flex items-center space-x-3">
                            <div class="w-6 h-6 flex items-center justify-center step3-icon">
                                <div class="w-4 h-4 border-2 border-[#68645F] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <span class="text-gray-700">Calculating prices and discounts...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Animate each step completion
        setTimeout(() => {
            const step1Icon = messageDiv.querySelector('.step1-icon');
            step1Icon.innerHTML = '<i class="fas fa-check text-green-500"></i>';
        }, 2000);
        
        setTimeout(() => {
            const step2Icon = messageDiv.querySelector('.step2-icon');
            step2Icon.innerHTML = '<i class="fas fa-check text-green-500"></i>';
        }, 3500);
        
        setTimeout(() => {
            const step3Icon = messageDiv.querySelector('.step3-icon');
            step3Icon.innerHTML = '<i class="fas fa-check text-green-500"></i>';
        }, 4500);
    }

    addFinalExplanation() {
        const explanation = `Perfect! I've created a complete skincare routine specifically designed for combination skin with oily T-zone and dry cheeks. Here's your personalized morning and evening regimen:

## 🌅 **MORNING ROUTINE**

**Step 1: Gentle Cleansing**
• **CeraVe Foaming Facial Cleanser** - Perfect for combination skin, cleanses oily T-zone without over-drying cheeks
• Apply to damp skin, massage gently, rinse with lukewarm water

**Step 2: Targeted Treatment**
• **The Ordinary Niacinamide 10% + Zinc 1%** - Focus on T-zone to control oil and minimize pores
• Apply 2-3 drops only to oily areas (forehead, nose, chin)

**Step 3: Hydration**
• **Neutrogena Hydro Boost Water Gel** - Lightweight hydration that won't clog pores
• Apply all over face, with extra attention to dry cheek areas

**Step 4: Sun Protection**
• **EltaMD UV Clear Broad-Spectrum SPF 46** - Non-comedogenic, perfect for combination skin
• Apply generously 15 minutes before sun exposure

## 🌙 **EVENING ROUTINE**

**Step 1: Double Cleanse (3x per week)**
• **DHC Deep Cleansing Oil** - Removes makeup and sunscreen without stripping
• **CeraVe Foaming Cleanser** - Follow with your morning cleanser

**Step 2: Exfoliation (2-3x per week)**
• **Paula's Choice SKIN PERFECTING 2% BHA Liquid** - Focus on T-zone
• Apply with cotton pad to oily areas only, avoid dry cheeks

**Step 3: Hydrating Treatment**
• **The INKEY List Hyaluronic Acid Serum** - Apply to entire face while still damp
• Focus extra layers on dry cheek areas

**Step 4: Moisturizer**
• **Oily areas**: Neutrogena Hydro Boost (same as morning)
• **Dry areas**: **CeraVe Daily Moisturizing Lotion** - Richer formula for cheeks and around eyes

**Step 5: Weekly Treatment**
• **The Ordinary AHA 30% + BHA 2% Peeling Solution** - Once weekly for overall skin renewal
• Apply for 10 minutes max, always follow with moisturizer

## 💡 **PRO TIPS FOR COMBINATION SKIN**

• **Zone Application**: Use different products on different areas of your face
• **Seasonal Adjustments**: Your T-zone may be oilier in summer, drier in winter
• **Patch Test**: Always test new products on a small area first
• **Consistency**: Give new routines 4-6 weeks to show results

The products shown on the right are specifically chosen for combination skin and include current prices, reviews, and direct purchase links. Each product addresses your unique skin needs without disrupting your skin's natural balance.`;

        this.addBotMessage(explanation);
    }

    async updatePersonalizedSidebar() {
        try {
            // Get personalized products
            const products = await this.getAmazonProducts('', this.userAnswers);
            const articles = this.generatePersonalizedArticles(this.userAnswers);
            
            this.updateProductGrid(products);
            this.updateArticlesList(articles);
        } catch (error) {
            console.error('Error updating sidebar:', error);
        }
    }

    async getAmazonProducts(message, userAnswers) {
        try {
            // Initialize Multi-Affiliate Manager
            if (!this.affiliateManager) {
                this.affiliateManager = new MultiAffiliateManager();
            }

            // Get products from multiple affiliate programs
            const products = this.affiliateManager.getCombinedProducts(userAnswers);
            return this.affiliateManager.formatProductsForUI(products);
        } catch (error) {
            console.error('Error getting products:', error);
            return this.generateFallbackProducts();
        }
    }

    generateFallbackProducts() {
        return [
            {
                name: "CeraVe Foaming Cleanser",
                price: "$12.99",
                image: "../assets/img/img-1.jpg",
                rating: 4.5,
                reviewCount: 2847,
                url: "#",
                brand: "CeraVe"
            },
            {
                name: "The Ordinary Niacinamide 10%",
                price: "$7.20",
                image: "../assets/img/img-3.jpg",
                rating: 4.3,
                reviewCount: 4192,
                url: "#",
                brand: "The Ordinary"
            }
        ];
    }

    updateProductGrid(products) {
        const productsList = document.getElementById('productsList');
        const emptyState = document.getElementById('productsEmptyState');
        
        if (products && products.length > 0) {
            // Hide empty state
            if (emptyState) emptyState.style.display = 'none';
            
            // Clear existing products except empty state
            const existingProducts = productsList.querySelectorAll('.bg-white');
            existingProducts.forEach(product => product.remove());
            
            // Add new products
            products.forEach(product => {
                const productCard = this.createProductCard(product);
                productsList.appendChild(productCard);
            });
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer product-card';
        
        const stars = this.generateStarRating(product.rating);
        
        card.innerHTML = `
            <div class="relative h-64 w-full">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#68645F]/80 via-[#68645F]/30 to-transparent"></div>
                
                <div class="absolute top-4 right-4 flex items-center">
                    <div class="flex text-white text-[10px] mr-2">
                        ${stars}
                    </div>
                    <span class="text-[10px] text-white/90 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">(${product.reviewCount.toLocaleString()})</span>
                </div>

                <!-- Content -->
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <h3 class="font-bold text-white text-lg mb-3 leading-tight">${product.name}</h3>
                    <div class="flex items-center justify-between">
                        <!-- Price Tag -->
                        <div class="text-white text-xl py-2 font-bold">
                            ${product.price}
                        </div>
                        <button onclick="window.open('${product.url}', '_blank')" class="text-sm text-white/90 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-2 px-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    generatePersonalizedArticles(userAnswers) {
        const allArticles = [
            {
                title: "The Complete Guide to Combination Skin Care",
                image: "../assets/img/img-5.jpg",
                readTime: "2min reading",
                views: "12.5K views"
            },
            {
                title: "Budget-Friendly Skincare That Actually Works",
                image: "../assets/img/img-7.jpg",
                readTime: "2min reading",
                views: "8.2K views"
            },
            {
                title: "Understanding Clean Beauty: What to Look For",
                image: "../assets/img/img-9.jpg",
                readTime: "2min reading",
                views: "15.7K views"
            },
            {
                title: "Morning vs Evening Skincare: What's the Difference?",
                image: "../assets/img/img-11.jpg",
                readTime: "2min reading",
                views: "9.8K views"
            }
        ];

        return allArticles;
    }

    updateArticlesList(articles) {
        const articlesList = document.getElementById('articlesList');
        const emptyState = document.getElementById('articlesEmptyState');
        
        if (articles && articles.length > 0) {
            // Hide empty state
            if (emptyState) emptyState.style.display = 'none';
            
            // Clear existing articles except empty state
            const existingArticles = articlesList.querySelectorAll('.bg-white');
            existingArticles.forEach(article => article.remove());
            
            // Add new articles
            articles.forEach(article => {
                const articleCard = this.createArticleCard(article);
                articlesList.appendChild(articleCard);
            });
        }
    }

    createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer article-card';
        
        card.innerHTML = `
            <div class="relative h-32 w-full">
                <img src="${article.image}" alt="Article" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                
                <!-- Content -->
                <div class="absolute inset-0 p-6 flex flex-col justify-center">
                    <h3 class="font-bold text-white text-lg mb-3 line-clamp-2 leading-tight">${article.title}</h3>
                    <div class="flex items-center text-white/90 text-sm space-x-4">
                        <span class="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <i class="far fa-clock mr-2"></i>
                            ${article.readTime}
                        </span>
                        <span class="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <i class="far fa-eye mr-2"></i>
                            ${article.views}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    sendFollowUp() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;

        // Show waitlist modal instead of processing the message
        openWaitlistModal();
    }

    formatMessage(message) {
        // Remove emojis and format message
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        const cleanMessage = message.replace(emojiRegex, '');
        
        // Convert markdown-style formatting
        return cleanMessage
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    // 3-State System: Empty -> Loading -> Content
    showEmptyState() {
        this.hideAllStates();
        const emptyElement = document.getElementById('rightSidebarEmpty');
        if (emptyElement) {
            emptyElement.style.display = 'flex';
            emptyElement.style.opacity = '1';
        }
        console.log('Sidebar: Empty state shown');
    }
    
    showLoadingState() {
        this.hideAllStates();
        const loadingElement = document.getElementById('rightSidebarLoading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.style.opacity = '0';
            loadingElement.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                loadingElement.style.opacity = '1';
                loadingElement.style.transform = 'scale(1)';
            }, 50);
        }
        console.log('Sidebar: Loading state shown');
    }
    
    showProductsAndArticles() {
        this.hideAllStates();
        
        // Show products section with smooth fade in
        const productsSection = document.getElementById('productsSection');
        if (productsSection) {
            productsSection.style.display = 'block';
            productsSection.style.opacity = '0';
            productsSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                productsSection.style.opacity = '1';
                productsSection.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Show articles section with slight delay
        setTimeout(() => {
            const articlesSection = document.getElementById('articlesSection');
            if (articlesSection) {
                articlesSection.style.display = 'block';
                articlesSection.style.opacity = '0';
                articlesSection.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    articlesSection.style.opacity = '1';
                    articlesSection.style.transform = 'translateY(0)';
                }, 50);
            }
        }, 200);
        
        console.log('Sidebar: Products and articles revealed');
    }
    
    hideAllStates() {
        const emptyElement = document.getElementById('rightSidebarEmpty');
        const loadingElement = document.getElementById('rightSidebarLoading');
        const productsSection = document.getElementById('productsSection');
        const articlesSection = document.getElementById('articlesSection');
        
        if (emptyElement) emptyElement.style.display = 'none';
        if (loadingElement) loadingElement.style.display = 'none';
        if (productsSection) productsSection.style.display = 'none';
        if (articlesSection) articlesSection.style.display = 'none';
    }
    
    // Legacy method for demo controls
    hideProductsAndArticles() {
        this.showEmptyState();
        console.log('Demo: Reset to empty state');
    }
    
    // Simulate a complete beauty routine response (for demo)
    simulateBeautyRoutineResponse() {
        // First trigger loading state
        this.showLoadingState();
        
        // After a short delay, add the routine message
        setTimeout(() => {
            this.addFinalExplanation();
            
            // Show products after routine is complete
            setTimeout(() => {
                this.showProductsAndArticles();
            }, 1000);
        }, 2000);
    }
}

// Sidebar functionality for chat page
function initializeChatSidebar() {
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
                    // Clear the chat and start fresh
                    if (window.chatPage) {
                        window.chatPage.clearChat();
                        const messageInput = document.getElementById('messageInput');
                        if (messageInput) {
                            messageInput.focus();
                        }
                    }
                    break;
                case 'Explore':
                    // Navigate to home page
                    window.location.href = '../index.html';
                    break;
                case 'History':
                    console.log('History clicked - currently active');
                    // Add history functionality here
                    break;
                case 'Help':
                    console.log('Help clicked');
                    // Add help functionality here
                    break;
                case 'BeautiWise':
                    // Navigate to home page
                    window.location.href = '../index.html';
                    break;
            }
        });
    });
}

// Demo control functions (for video recording) - 3-State System
window.showEmpty = () => {
    if (window.chatPage) {
        window.chatPage.showEmptyState();
    }
};

window.showLoading = () => {
    if (window.chatPage) {
        window.chatPage.showLoadingState();
    }
};

window.showProducts = () => {
    if (window.chatPage) {
        window.chatPage.showProductsAndArticles();
    }
};

window.hideProducts = () => {
    if (window.chatPage) {
        window.chatPage.showEmptyState();
    }
};

window.simulateRoutine = () => {
    if (window.chatPage) {
        window.chatPage.simulateBeautyRoutineResponse();
    }
};

// Keyboard shortcuts for demo
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + E = Empty state
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        window.showEmpty();
        console.log('Demo: Empty state shown');
    }
    
    // Ctrl/Cmd + Shift + L = Loading state
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        window.showLoading();
        console.log('Demo: Loading state shown');
    }
    
    // Ctrl/Cmd + Shift + P = Show products
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        window.showProducts();
        console.log('Demo: Products shown');
    }
    
    // Ctrl/Cmd + Shift + R = Simulate routine response
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        window.simulateRoutine();
        console.log('Demo: Routine response simulated');
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatPage = new BeautiWiseChatPage();
    initializeChatSidebar();
    
    console.log('🎬 Demo controls available (3-State System):');
    console.log('- showEmpty() - Show empty state (initial)');
    console.log('- showLoading() - Show elegant loading animation');
    console.log('- showProducts() - Reveal products and articles');
    console.log('- simulateRoutine() - Add routine message and show products');
    console.log('- Keyboard shortcuts: Cmd+Shift+E (empty), Cmd+Shift+L (loading), Cmd+Shift+P (products), Cmd+Shift+R (routine)');
});

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

function submitWaitlist(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('waitlistEmail');
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('waitlistSuccess');
    const email = emailInput.value;
    
    if (!email) return;
    
    // Here you would normally send to your backend/database
    // For now, we'll just show success message
    console.log('Waitlist email submitted:', email);
    
    // Store in localStorage for now
    const waitlist = JSON.parse(localStorage.getItem('beautiwise_waitlist') || '[]');
    waitlist.push({
        email: email,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('beautiwise_waitlist', JSON.stringify(waitlist));
    
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
        }, 300);
    }, 3000);
}

// Make functions globally available
window.openWaitlistModal = openWaitlistModal;
window.closeWaitlistModal = closeWaitlistModal;
window.submitWaitlist = submitWaitlist;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BeautiWiseChatPage;
}
