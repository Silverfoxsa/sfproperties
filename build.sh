#!/bin/bash
# --------------------------------------------
# 🚀 Build Script for S&F Property Management
# Cleans, rebuilds, and prepares /dist for Firebase Hosting
# --------------------------------------------

set -e  # Stop on any error

echo "🧹 Cleaning old dist folder..."
rm -rf dist
mkdir -p dist

echo "📂 Copying files from src to dist..."
cp -r src/* dist/

# --------------------------------------------
# 🎨 CSS Minification
# --------------------------------------------
echo "🎨 Minifying CSS..."
npx clean-css-cli -o dist/css/style.min.css src/css/style.css

# --------------------------------------------
# 🧼 HTML Optimization
# --------------------------------------------
echo "🧼 Optimizing HTML..."
find dist -name "*.html" -exec npx html-minifier \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  -o {} {} \;

# --------------------------------------------
# 🖼️ Image Optimization
# --------------------------------------------
echo "🖼️ Optimizing images (if cwebp is installed)..."
if command -v cwebp &> /dev/null
then
  for img in dist/images/*.{jpg,jpeg,png}; do
    [ -f "$img" ] && cwebp -q 80 "$img" -o "${img%.*}.webp" && echo "Converted $img → ${img%.*}.webp"
  done
else
  echo "⚠️ cwebp not found — skipping image optimization."
fi

# --------------------------------------------
# 📊 Run Lighthouse Reports (Desktop + Mobile)
# --------------------------------------------
echo "📈 Running Lighthouse tests..."
mkdir -p reports
timestamp=$(date +"%Y-%m-%d_%H-%M")

# Desktop report
echo "🖥️  Generating desktop Lighthouse report..."
npx lighthouse http://127.0.0.1:5500/dist/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop \
  --output html \
  --output-path=reports/lighthouse-desktop_${timestamp}.html || true

# Mobile report
echo "📱  Generating mobile Lighthouse report..."
npx lighthouse http://127.0.0.1:5500/dist/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --emulated-form-factor=mobile \
  --throttling-method=simulate \
  --output html \
  --output-path=reports/lighthouse-mobile_${timestamp}.html || true

# --------------------------------------------
# ✅ Done
# --------------------------------------------
echo "✅ Build complete!"
echo "📊 Reports saved in: /reports"
echo "🚀 To deploy: firebase deploy --only hosting"