// Amazon Product Advertising API Integration
class AmazonAPI {
    constructor() {
        // These will be your actual Amazon API credentials
        this.accessKey = 'YOUR_ACCESS_KEY';  // Replace with your Access Key ID
        this.secretKey = 'YOUR_SECRET_KEY';  // Replace with your Secret Access Key
        this.partnerTag = 'beautiwise-20';   // Your approved Associate Tag!
        this.region = 'us-east-1';
        this.host = 'webservices.amazon.com';
        this.uri = '/paapi5/searchitems';
    }

    // Generate search terms based on user preferences
    generateSearchTerms(userAnswers) {
        const searchTerms = [];
        
        // Map user answers to product search terms
        const searchMapping = {
            // Skin types
            'Oily': ['oil control cleanser', 'mattifying moisturizer', 'salicylic acid'],
            'Dry': ['hydrating cleanser', 'moisturizing cream', 'hyaluronic acid'],
            'Combination': ['gentle cleanser', 'lightweight moisturizer', 'niacinamide'],
            'Sensitive': ['gentle cleanser', 'fragrance free moisturizer', 'sensitive skin'],
            'Normal': ['daily cleanser', 'daily moisturizer', 'vitamin c serum'],
            
            // Skin concerns
            'Acne': ['acne treatment', 'benzoyl peroxide', 'salicylic acid cleanser'],
            'Fine lines': ['retinol serum', 'anti aging cream', 'peptide moisturizer'],
            'Dark spots': ['vitamin c serum', 'brightening serum', 'dark spot corrector'],
            'Large pores': ['niacinamide serum', 'pore minimizer', 'BHA exfoliant'],
            'Dullness': ['exfoliating serum', 'brightening mask', 'vitamin c'],
            'Redness': ['gentle cleanser', 'calming serum', 'centella asiatica'],
            
            // Budget ranges - will filter results
            'Under $25': { maxPrice: 2500 }, // Amazon uses cents
            '$25-50': { minPrice: 2500, maxPrice: 5000 },
            '$50-100': { minPrice: 5000, maxPrice: 10000 },
            '$100+': { minPrice: 10000 }
        };

        // Generate search terms based on user answers
        userAnswers.forEach(answer => {
            if (searchMapping[answer] && Array.isArray(searchMapping[answer])) {
                searchTerms.push(...searchMapping[answer]);
            }
        });

        // Remove duplicates and limit to top 5 search terms
        return [...new Set(searchTerms)].slice(0, 5);
    }

    // Mock Amazon API response (for development)
    async searchProducts(searchTerms, userAnswers = []) {
        // In production, this would make actual Amazon API calls
        // For now, return mock data that matches user preferences
        
        const mockProducts = this.generateMockProducts(searchTerms, userAnswers);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return mockProducts;
    }

    generateMockProducts(searchTerms, userAnswers) {
        const baseProducts = [
            {
                title: "CeraVe Foaming Facial Cleanser",
                price: "$12.99",
                priceValue: 1299,
                image: "src/img/img-1.jpg",
                rating: 4.5,
                reviewCount: 2847,
                url: "https://amazon.com/dp/B01N1LL62W?tag=" + this.partnerTag,
                brand: "CeraVe",
                category: "Cleanser",
                suitableFor: ["Oily", "Combination", "Normal"],
                addresses: ["Acne", "Large pores"]
            },
            {
                title: "The Ordinary Niacinamide 10% + Zinc 1%",
                price: "$7.20",
                priceValue: 720,
                image: "src/img/img-3.jpg",
                rating: 4.3,
                reviewCount: 4192,
                url: "https://amazon.com/dp/B06Y2GGQ4Q?tag=" + this.partnerTag,
                brand: "The Ordinary",
                category: "Serum",
                suitableFor: ["Oily", "Combination"],
                addresses: ["Large pores", "Acne", "Dullness"]
            },
            {
                title: "Neutrogena Ultra Sheer Dry-Touch SPF 30",
                price: "$8.97",
                priceValue: 897,
                image: "src/img/img-2.jpg",
                rating: 4.2,
                reviewCount: 1523,
                url: "https://amazon.com/dp/B004D2DR0Q?tag=" + this.partnerTag,
                brand: "Neutrogena",
                category: "Sunscreen",
                suitableFor: ["All skin types"],
                addresses: ["Sun protection"]
            },
            {
                title: "Olay Regenerist Micro-Sculpting Cream",
                price: "$15.49",
                priceValue: 1549,
                image: "src/img/img-4.jpg",
                rating: 4.1,
                reviewCount: 892,
                url: "https://amazon.com/dp/B00NR1YQK4?tag=" + this.partnerTag,
                brand: "Olay",
                category: "Moisturizer",
                suitableFor: ["Dry", "Normal", "Combination"],
                addresses: ["Fine lines", "Dullness"]
            },
            {
                title: "Paula's Choice SKIN PERFECTING 2% BHA",
                price: "$32.00",
                priceValue: 3200,
                image: "src/img/img-5.jpg",
                rating: 4.4,
                reviewCount: 3156,
                url: "https://amazon.com/dp/B00949CTQQ?tag=" + this.partnerTag,
                brand: "Paula's Choice",
                category: "Exfoliant",
                suitableFor: ["Oily", "Combination"],
                addresses: ["Large pores", "Acne", "Dark spots"]
            },
            {
                title: "Cetaphil Daily Facial Cleanser",
                price: "$9.47",
                priceValue: 947,
                image: "src/img/img-6.jpg",
                rating: 4.6,
                reviewCount: 5234,
                url: "https://amazon.com/dp/B001ET76EY?tag=" + this.partnerTag,
                brand: "Cetaphil",
                category: "Cleanser",
                suitableFor: ["Sensitive", "Dry", "Normal"],
                addresses: ["Redness", "Sensitive skin"]
            }
        ];

        // Filter products based on user preferences
        let filteredProducts = baseProducts.filter(product => {
            // Check if product is suitable for user's skin type
            const userSkinType = userAnswers.find(answer => 
                ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].includes(answer)
            );
            
            if (userSkinType && !product.suitableFor.includes(userSkinType) && !product.suitableFor.includes('All skin types')) {
                return false;
            }

            // Check if product addresses user's concerns
            const userConcerns = userAnswers.filter(answer => 
                ['Acne', 'Fine lines', 'Dark spots', 'Large pores', 'Dullness', 'Redness'].includes(answer)
            );
            
            if (userConcerns.length > 0) {
                const addressesConcern = userConcerns.some(concern => 
                    product.addresses.includes(concern)
                );
                if (!addressesConcern) return false;
            }

            // Check budget constraints
            const budget = userAnswers.find(answer => answer.includes('$'));
            if (budget) {
                if (budget === 'Under $25' && product.priceValue > 2500) return false;
                if (budget === '$25-50' && (product.priceValue < 2500 || product.priceValue > 5000)) return false;
                if (budget === '$50-100' && (product.priceValue < 5000 || product.priceValue > 10000)) return false;
            }

            return true;
        });

        // If no products match, return some basic products
        if (filteredProducts.length === 0) {
            filteredProducts = baseProducts.slice(0, 4);
        }

        // Limit to 6 products max
        return filteredProducts.slice(0, 6);
    }

    // Format products for the UI
    formatProductsForUI(products) {
        return products.map(product => ({
            name: product.title,
            price: product.price,
            image: product.image,
            rating: product.rating,
            reviewCount: product.reviewCount,
            url: product.url,
            brand: product.brand
        }));
    }

    // Real Amazon API call (for production)
    async makeAmazonAPICall(searchTerm) {
        // This would be the actual Amazon Product Advertising API call
        // Requires proper authentication and request signing
        
        const payload = {
            Keywords: searchTerm,
            SearchIndex: "Beauty",
            ItemCount: 10,
            Resources: [
                "Images.Primary.Medium",
                "ItemInfo.Title",
                "ItemInfo.Features",
                "Offers.Listings.Price",
                "CustomerReviews.StarRating",
                "CustomerReviews.Count"
            ]
        };

        // In production, you'd sign this request and make the API call
        // For now, return mock data
        return this.generateMockProducts([searchTerm], []);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmazonAPI;
} else {
    window.AmazonAPI = AmazonAPI;
}
