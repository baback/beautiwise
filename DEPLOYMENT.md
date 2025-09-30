# Beautiwise - Deployment Guide

## 🌐 Live Site
**Production URL:** https://beautiwise.pages.dev

## 📦 Deployment Instructions

### Deploy to Cloudflare Pages

When you're ready to deploy updates:

```bash
# Navigate to project directory
cd "/Users/baback/My Drive/Develop/beautiwise"

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=beautiwise --branch=main
```

That's it! Your site will be live in ~2-3 seconds.

## 🔄 Quick Workflow

1. Make your changes to the code
2. Test locally (optional):
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```
3. Commit to Git (optional but recommended):
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. Deploy to Cloudflare:
   ```bash
   wrangler pages deploy . --project-name=beautiwise --branch=main
   ```

## 📊 GitHub Repository
https://github.com/baback/beautiwise

## 🛠️ Tools Used
- **Hosting:** Cloudflare Pages (Free)
- **Version Control:** GitHub
- **Deployment:** Wrangler CLI
- **Local Testing:** Python HTTP Server

## ⚡ Features
- ✅ Global CDN
- ✅ Free SSL/HTTPS
- ✅ Unlimited bandwidth
- ✅ Custom domain support
- ✅ Instant deployments

---

**Need help?** Just ask! 🚀
