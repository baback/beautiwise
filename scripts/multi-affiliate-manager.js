// Multi-Affiliate Manager - Combine Multiple Programs
class MultiAffiliateManager {
    constructor() {
        this.affiliatePrograms = {
            // Direct brand programs (easiest approval)
            theOrdinary: {
                name: 'The Ordinary',
                commission: '15%',
                approvalTime: '2-3 days',
                baseUrl: 'https://theordinary.com',
                affiliateParam: '?ref=YOUR_DECIEM_ID'
            },
            colourpop: {
                name: 'ColourPop',
                commission: '20%',
                approvalTime: '1-2 days',
                baseUrl: 'https://colourpop.com',
                affiliateParam: '?ref=YOUR_COLOURPOP_ID'
            },
            bhCosmetics: {
                name: 'BH Cosmetics',
                commission: '15%',
                approvalTime: 'Same day',
                baseUrl: 'https://bhcosmetics.com',
                affiliateParam: '?ref=YOUR_BH_ID'
            }
        };
    }

    // Get products from multiple sources
    getCombinedProducts(userAnswers = []) {
        const products = [
            // The Ordinary Products (Direct affiliate)
            {
                source: 'theOrdinary',
                name: 'The Ordinary Niacinamide 10% + Zinc 1%',
                price: '$7.20',
                image: 'src/img/img-3.jpg',
                rating: 4.3,
                reviewCount: 15420,
                brand: 'The Ordinary',
                category: 'Serum',
                commission: '15%',
                productUrl: '/product/rdn-niacinamide-10pct-zinc-1pct-30ml',
                suitableFor: ['Oily', 'Combination'],
                addresses: ['Large pores', 'Acne', 'Oil control']
            },
            {
                source: 'theOrdinary',
                name: 'The Ordinary Hyaluronic Acid 2% + B5',
                price: '$8.90',
                image: 'src/img/img-7.jpg',
                rating: 4.2,
                reviewCount: 12890,
                brand: 'The Ordinary',
                category: 'Serum',
                commission: '15%',
                productUrl: '/product/rdn-hyaluronic-acid-2pct-b5-30ml',
                suitableFor: ['Dry', 'Normal', 'Sensitive'],
                addresses: ['Dryness', 'Hydration', 'Fine lines']
            },

            // ColourPop Products
            {
                source: 'colourpop',
                name: 'ColourPop Super Shock Shadow',
                price: '$6.00',
                image: 'src/img/img-1.jpg',
                rating: 4.4,
                reviewCount: 8934,
                brand: 'ColourPop',
                category: 'Eyeshadow',
                commission: '20%',
                productUrl: '/products/super-shock-shadow',
                suitableFor: ['All skin types'],
                addresses: ['Makeup', 'Color', 'Eyes']
            },
            {
                source: 'colourpop',
                name: 'ColourPop Pretty Fresh Tinted Moisturizer',
                price: '$14.00',
                image: 'src/img/img-4.jpg',
                rating: 4.1,
                reviewCount: 3456,
                brand: 'ColourPop',
                category: 'Tinted Moisturizer',
                commission: '20%',
                productUrl: '/products/pretty-fresh-tinted-moisturizer',
                suitableFor: ['Normal', 'Dry', 'Combination'],
                addresses: ['Light coverage', 'Hydration', 'Natural look']
            },

            // BH Cosmetics Products
            {
                source: 'bhCosmetics',
                name: 'BH Cosmetics Floral Blush Palette',
                price: '$12.00',
                image: 'src/img/img-2.jpg',
                rating: 4.0,
                reviewCount: 2134,
                brand: 'BH Cosmetics',
                category: 'Blush',
                commission: '15%',
                productUrl: '/products/floral-blush-palette',
                suitableFor: ['All skin types'],
                addresses: ['Makeup', 'Color', 'Cheeks']
            },
            {
                source: 'bhCosmetics',
                name: 'BH Cosmetics Studio Pro Foundation',
                price: '$8.00',
                image: 'src/img/img-6.jpg',
                rating: 3.9,
                reviewCount: 1567,
                brand: 'BH Cosmetics',
                category: 'Foundation',
                commission: '15%',
                productUrl: '/products/studio-pro-foundation',
                suitableFor: ['All skin types'],
                addresses: ['Coverage', 'Makeup base', 'Full coverage']
            },

            // Generic/Amazon backup products
            {
                source: 'amazon',
                name: 'CeraVe Foaming Facial Cleanser',
                price: '$12.99',
                image: 'src/img/img-5.jpg',
                rating: 4.5,
                reviewCount: 28470,
                brand: 'CeraVe',
                category: 'Cleanser',
                commission: '8%',
                productUrl: 'https://amazon.ca/dp/B01N1LL62W?tag=beautiwise-20',
                suitableFor: ['Oily', 'Combination', 'Normal'],
                addresses: ['Cleansing', 'Acne', 'Daily routine']
            },
            {
                source: 'amazon',
                name: 'Neutrogena Ultra Sheer SPF 30',
                price: '$8.97',
                image: 'src/img/img-8.jpg',
                rating: 4.2,
                reviewCount: 15230,
                brand: 'Neutrogena',
                category: 'Sunscreen',
                commission: '8%',
                productUrl: 'https://amazon.ca/dp/B004D2DR0Q?tag=beautiwise-20',
                suitableFor: ['All skin types'],
                addresses: ['Sun protection', 'Daily routine', 'SPF']
            }
        ];

        return this.filterAndRankProducts(products, userAnswers);
    }

    filterAndRankProducts(products, userAnswers) {
        let filteredProducts = products;

        if (userAnswers && userAnswers.length > 0) {
            filteredProducts = products.filter(product => {
                // Budget filtering
                const budget = userAnswers.find(answer => answer.includes('$'));
                if (budget) {
                    const price = parseFloat(product.price.replace('$', ''));
                    if (budget === 'Under $25' && price > 25) return false;
                    if (budget === '$25-50' && (price < 25 || price > 50)) return false;
                    if (budget === '$50-100' && (price < 50 || price > 100)) return false;
                }

                // Skin type compatibility
                const userSkinType = userAnswers.find(answer => 
                    ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].includes(answer)
                );
                
                if (userSkinType && !product.suitableFor.includes(userSkinType) && !product.suitableFor.includes('All skin types')) {
                    return false;
                }

                // Check if addresses user concerns
                const userConcerns = userAnswers.filter(answer => 
                    ['Acne', 'Fine lines', 'Dark spots', 'Large pores', 'Dullness', 'Redness'].includes(answer)
                );
                
                if (userConcerns.length > 0) {
                    const addressesConcern = userConcerns.some(concern => 
                        product.addresses.some(addr => addr.toLowerCase().includes(concern.toLowerCase()))
                    );
                    if (!addressesConcern) return false;
                }

                return true;
            });
        }

        // If no matches, return diverse selection
        if (filteredProducts.length === 0) {
            filteredProducts = products.slice(0, 6);
        }

        // Rank by commission rate and relevance
        filteredProducts.sort((a, b) => {
            const commissionA = parseFloat(a.commission.replace('%', ''));
            const commissionB = parseFloat(b.commission.replace('%', ''));
            return commissionB - commissionA; // Higher commission first
        });

        // Add affiliate URLs
        return filteredProducts.slice(0, 6).map(product => ({
            ...product,
            url: this.generateAffiliateUrl(product)
        }));
    }

    generateAffiliateUrl(product) {
        if (product.source === 'amazon') {
            return product.productUrl; // Already has affiliate tag
        }

        const program = this.affiliatePrograms[product.source];
        if (program) {
            return program.baseUrl + product.productUrl + program.affiliateParam;
        }

        return '#'; // Fallback
    }

    formatProductsForUI(products) {
        return products.map(product => ({
            name: product.name,
            price: product.price,
            image: product.image,
            rating: product.rating,
            reviewCount: product.reviewCount,
            url: product.url,
            brand: product.brand,
            commission: product.commission
        }));
    }

    // Get signup links for each program
    getSignupInfo() {
        return {
            theOrdinary: {
                name: 'The Ordinary (Deciem)',
                signupUrl: 'https://deciem.com/affiliate-program',
                commission: '15%',
                approval: '2-3 days',
                requirements: 'Basic website, no minimum traffic'
            },
            colourpop: {
                name: 'ColourPop',
                signupUrl: 'https://colourpop.com/pages/affiliate-program',
                commission: '20%',
                approval: '1-2 days',
                requirements: 'Social media or website'
            },
            bhCosmetics: {
                name: 'BH Cosmetics',
                signupUrl: 'https://www.bhcosmetics.com/pages/affiliate-program',
                commission: '15%',
                approval: 'Same day',
                requirements: 'Instagram or website with beauty content'
            },
            shareASale: {
                name: 'ShareASale Network',
                signupUrl: 'https://www.shareasale.com/shareasale.cfm?task=affSignup',
                commission: '8-20%',
                approval: '24-48 hours',
                requirements: 'Website with original content'
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiAffiliateManager;
} else {
    window.MultiAffiliateManager = MultiAffiliateManager;
}
