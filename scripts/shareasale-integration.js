// ShareASale Integration - Easy Approval, Great Beauty Brands
class ShareASaleIntegration {
    constructor() {
        this.affiliateId = 'YOUR_SHAREASALE_ID'; // You'll get this after approval
        this.baseUrl = 'https://shareasale.com/r.cfm';
    }

    // Generate ShareASale affiliate links
    generateAffiliateLink(merchantId, productUrl) {
        return `${this.baseUrl}?b=${merchantId}&u=${this.affiliateId}&m=${merchantId}&urllink=${encodeURIComponent(productUrl)}`;
    }

    // Curated beauty products from ShareASale merchants
    getCuratedProducts(userAnswers = []) {
        const allProducts = [
            // Paula's Choice (Merchant ID: 1234 - example)
            {
                merchantId: '1234',
                name: 'Paula\'s Choice SKIN PERFECTING 2% BHA Liquid Exfoliant',
                price: '$32.00',
                image: 'src/img/img-5.jpg',
                rating: 4.4,
                reviewCount: 3156,
                brand: 'Paula\'s Choice',
                category: 'Exfoliant',
                commission: '20%',
                originalUrl: 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html',
                suitableFor: ['Oily', 'Combination'],
                addresses: ['Large pores', 'Acne', 'Dark spots']
            },
            {
                merchantId: '1234',
                name: 'Paula\'s Choice CALM Restoring Cleanser',
                price: '$18.00',
                image: 'src/img/img-6.jpg',
                rating: 4.3,
                reviewCount: 1892,
                brand: 'Paula\'s Choice',
                category: 'Cleanser',
                commission: '20%',
                originalUrl: 'https://www.paulaschoice.com/calm-restoring-cleanser/190.html',
                suitableFor: ['Sensitive', 'Dry', 'Normal'],
                addresses: ['Redness', 'Sensitive skin']
            },

            // Morphe (Example products)
            {
                merchantId: '5678',
                name: 'Morphe 35O Nature Glow Eyeshadow Palette',
                price: '$25.00',
                image: 'src/img/img-1.jpg',
                rating: 4.2,
                reviewCount: 2456,
                brand: 'Morphe',
                category: 'Eyeshadow',
                commission: '15%',
                originalUrl: 'https://www.morphe.com/products/35o-nature-glow-eyeshadow-palette',
                suitableFor: ['All skin types'],
                addresses: ['Makeup', 'Color']
            },

            // BH Cosmetics
            {
                merchantId: '9012',
                name: 'BH Cosmetics Floral Blush Palette',
                price: '$12.00',
                image: 'src/img/img-2.jpg',
                rating: 4.1,
                reviewCount: 1234,
                brand: 'BH Cosmetics',
                category: 'Blush',
                commission: '15%',
                originalUrl: 'https://www.bhcosmetics.com/products/floral-blush-palette',
                suitableFor: ['All skin types'],
                addresses: ['Makeup', 'Color']
            },

            // Tarte (Example)
            {
                merchantId: '3456',
                name: 'Tarte Shape Tape Concealer',
                price: '$29.00',
                image: 'src/img/img-3.jpg',
                rating: 4.5,
                reviewCount: 5678,
                brand: 'Tarte',
                category: 'Concealer',
                commission: '12%',
                originalUrl: 'https://tartecosmetics.com/shop/shape-tape-concealer/',
                suitableFor: ['All skin types'],
                addresses: ['Coverage', 'Dark circles']
            },

            // More affordable options
            {
                merchantId: '9012',
                name: 'BH Cosmetics Studio Pro Foundation',
                price: '$8.00',
                image: 'src/img/img-4.jpg',
                rating: 4.0,
                reviewCount: 892,
                brand: 'BH Cosmetics',
                category: 'Foundation',
                commission: '15%',
                originalUrl: 'https://www.bhcosmetics.com/products/studio-pro-foundation',
                suitableFor: ['All skin types'],
                addresses: ['Coverage', 'Makeup base']
            }
        ];

        return this.filterProducts(allProducts, userAnswers);
    }

    filterProducts(products, userAnswers) {
        if (!userAnswers || userAnswers.length === 0) {
            return products.slice(0, 6);
        }

        let filteredProducts = products.filter(product => {
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

            return true;
        });

        if (filteredProducts.length === 0) {
            filteredProducts = products.slice(0, 4);
        }

        // Add affiliate links
        return filteredProducts.slice(0, 6).map(product => ({
            ...product,
            url: this.generateAffiliateLink(product.merchantId, product.originalUrl)
        }));
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
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShareASaleIntegration;
} else {
    window.ShareASaleIntegration = ShareASaleIntegration;
}
