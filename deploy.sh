#!/bin/bash

# Beautiwise Deployment Script
echo "🚀 Deploying Beautiwise to Cloudflare Pages..."
echo ""

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=beautiwise --branch=main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Visit: https://beautiwise.pages.dev"
