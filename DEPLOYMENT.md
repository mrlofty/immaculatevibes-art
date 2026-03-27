# Deployment Guide — Immaculate Vibes Rebuild

## 🚀 Quick Start

### Local Preview
```bash
# Navigate to the rebuild directory
cd /home/adam/clawd/agents/builder/output/immaculatevibes-rebuild

# Open in browser (option 1: simple Python server)
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

Or just open `index.html` directly in your browser (some features like lazy loading work better with a local server).

---

## 📦 Deployment Options

### Option 1: Replace Existing Site
If you already have immaculatevibes deployed somewhere:

```bash
# Copy all files to your existing web directory
cp -r /home/adam/clawd/agents/builder/output/immaculatevibes-rebuild/* /path/to/your/webroot/
```

### Option 2: Netlify (Recommended — Free & Easy)
1. Go to https://netlify.com
2. Drag the `immaculatevibes-rebuild/` folder onto the Netlify dashboard
3. Done! Your site is live with HTTPS

**Or via CLI:**
```bash
npm install -g netlify-cli
cd /home/adam/clawd/agents/builder/output/immaculatevibes-rebuild
netlify deploy --prod
```

### Option 3: Vercel
```bash
npm install -g vercel
cd /home/adam/clawd/agents/builder/output/immaculatevibes-rebuild
vercel --prod
```

### Option 4: GitHub Pages
1. Create a new GitHub repo
2. Push this folder to the repo
3. Enable GitHub Pages in repo settings
4. Done!

```bash
cd /home/adam/clawd/agents/builder/output/immaculatevibes-rebuild
git init
git add .
git commit -m "Immaculate Vibes gallery rebuild"
git remote add origin https://github.com/YOUR_USERNAME/immaculatevibes.git
git push -u origin main
```

### Option 5: Traditional Web Host (cPanel, FTP, etc.)
1. Zip the `immaculatevibes-rebuild/` folder
2. Upload via FTP or cPanel File Manager
3. Extract in your web directory
4. Point domain to the directory

---

## 🔧 Configuration

### Update Google Analytics
Already configured with ID: `G-5GKMYBWHGR`

If you need to change it, edit `index.html`:
```javascript
gtag('config', 'YOUR-GA-ID-HERE');
```

### Update Social Links
Currently set to:
- Instagram: `https://www.instagram.com/immaculatevibes.art/`
- Email: `hello@immaculatevibes.art`

Edit footer in `index.html` to change.

### Domain Setup
If deploying to `immaculatevibes.art`:
1. Deploy to Netlify/Vercel
2. Point your domain DNS to the provided nameservers
3. Enable HTTPS (auto on Netlify/Vercel)

---

## ✅ Pre-Deployment Checklist

- [x] All images present in `images/` folder
- [x] CSS and JS files linked correctly
- [x] Responsive design tested
- [x] Lazy loading working
- [x] Lightbox keyboard nav working
- [x] Search and filter working
- [x] Shuffle working
- [x] Mobile-friendly
- [x] Analytics configured
- [ ] Domain pointed (if using custom domain)
- [ ] SSL certificate active (auto on Netlify/Vercel)

---

## 🎨 Post-Deployment

### Test Checklist
After deployment, verify:
1. All images load correctly
2. Filters work (Saturday Night, Origins, All)
3. Search finds artwork by title
4. Lightbox opens and navigates with arrow keys
5. Shuffle randomizes gallery
6. Sort dropdown works
7. Mobile layout looks good
8. Footer links work
9. Scroll is smooth
10. Analytics tracking works

### Share
- Post to Instagram: `@immaculatevibes.art`
- Update bio with new site link
- Share in relevant communities

---

## 📊 Analytics & Monitoring

### Google Analytics Dashboard
- Real-time visitors
- Page views
- Popular artwork (via event tracking — add if needed)
- Geographic data
- Device types

### Performance Monitoring
- Use Lighthouse in Chrome DevTools
- Aim for 90+ scores across all metrics
- Monitor image loading speeds
- Check mobile performance

---

## 🐛 Troubleshooting

### Images Not Loading
- Check file paths in HTML match actual filenames
- Ensure images are in `images/` directory
- Check browser console for 404 errors

### Lightbox Not Working
- Make sure `js/gallery.js` is loaded
- Check browser console for JavaScript errors
- Verify all gallery items have `data-collection` and `data-title` attributes

### Filters Not Working
- Ensure filter tabs have correct `data-filter` values
- Check that gallery items have matching `data-collection` attributes

### Styles Not Applied
- Verify `css/style.css` is loaded
- Clear browser cache
- Check for CSS syntax errors in console

---

## 🔄 Future Updates

### Adding New Collections
1. Add images to `images/` folder
2. Add gallery items to `index.html` with appropriate `data-collection`
3. Add new filter tab if creating a new collection
4. Test filtering works

### Updating Styles
- All colors are in CSS variables at top of `style.css`
- Change `--accent` to update theme color throughout site
- Adjust `--bg-primary` for background darkness
- Modify grid column width in `.gallery-grid`

---

## 📞 Support

If you run into issues:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Test in different browsers
4. Check README.md for feature details

Built with ⚒️ by Forge
