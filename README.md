# LACEYAAN - Shopify Online Store 2.0 Theme

> **High-Snobiety & Broadcast-Inspired Luxury Sneaker Lace Atelier Theme**  
> Tailored specifically for **LACEYAAN** (`khudasiya/LACEYAAN`).

---

## 🏛️ Theme Architecture (Online Store 2.0)

This repository contains a **100% native Shopify Online Store 2.0 theme** built without heavy client-side frameworks (no React / Vite dependencies in runtime). All storefront functionality is powered by Shopify Liquid, native Web APIs, semantic CSS, and pure Vanilla JavaScript.

```
laceyaan/
├── assets/                  # High-res photography, logos, theme.css, theme.js
│   ├── theme.css           # Curated typography, colors (#141311, #C5A880, #FAF9F5), micro-interactions
│   ├── theme.js            # Ajax cart drawer, variant selector, slider, search, calculator
│   └── [product & hero images]
├── config/
│   ├── settings_schema.json# Global theme settings (Brand logos, colors, cart threshold, typography)
│   └── settings_data.json  # Brand default configuration
├── layout/
│   └── theme.liquid        # Master skeleton with Google Fonts (Playfair, Cormorant, Outfit, Inter)
├── locales/
│   └── en.default.json     # Comprehensive localization keys
├── sections/               # Dynamic sections with full Theme Editor schemas & presets
│   ├── announcement-bar.liquid
│   ├── before-after-slider.liquid
│   ├── design-lab-showcase.liquid
│   ├── faq.liquid
│   ├── featured-collection.liquid
│   ├── footer.liquid
│   ├── header.liquid
│   ├── hero-banner.liquid
│   ├── home-portals.liquid
│   ├── length-calculator.liquid
│   ├── lookbook.liquid
│   ├── main-404.liquid
│   ├── main-cart.liquid
│   ├── main-collection.liquid
│   ├── main-page.liquid
│   ├── main-product.liquid
│   ├── main-search.liquid
│   ├── reviews-press.liquid
│   ├── header-group.json
│   └── footer-group.json
├── snippets/               # Reusable components & icons
│   ├── cart-drawer.liquid
│   ├── icon-*.liquid
│   ├── price.liquid
│   ├── product-card.liquid
│   ├── quick-view-modal.liquid
│   ├── search-modal.liquid
│   └── social-meta-tags.liquid
└── templates/              # JSON Templates for Shopify Theme Editor
    ├── 404.json
    ├── cart.json
    ├── collection.json
    ├── index.json
    ├── list-collections.json
    ├── page.before-after.json
    ├── page.json
    ├── page.length-guide.json
    ├── page.lookbook.json
    ├── product.json
    └── search.json
```

---

## ⚡ Features & Capabilities

1. **Ajax Cart Drawer (`/cart.js`, `/cart/add.js`, `/cart/change.js`)**:
   - Real-time cart updates without full-page refreshes.
   - Dynamic free shipping threshold calculation bar (configured at ₹1,499).
   - Order note collector with automatic debounce.
   - Real-time quantity selectors (`+`, `-`, delete).
2. **Product Detail Engine (`sections/main-product.liquid`)**:
   - Multi-option variant selector (Length: 120cm/140cm/160cm, Finish: Raw/Waxed/Gold Aglets, Color: Noir/Sail/Heritage).
   - Dynamic price and compare-at sale price updater.
   - Dynamic stock inventory badges.
   - Gallery image switcher with sticky details column.
   - Interactive Shoelace Specs & Dispatch accordions.
3. **Interactive Visual Modules**:
   - **Before & After Slider (`sections/before-after-slider.liquid`)**: Touch & drag interactive comparison showcasing standard factory laces vs LACEYAAN atelier weaves.
   - **Shoelace Length Calculator (`sections/length-calculator.liquid`)**: Dynamic recommendation engine based on eyelet count (4–9 pairs) and lacing style.
   - **Editorial Lookbook Hotspots (`sections/lookbook.liquid`)**: Streetwear lookbook with interactive pulse pins linking to products.
   - **Rotating Quote Announcement Bar**: Autoplay ticker cycling through curated quotes and shipping notices.
4. **Predictive Search Modal (`snippets/search-modal.liquid`)**:
   - Live predictive search querying `/search/suggest.json` with instant thumbnail rendering.
5. **SEO & Performance**:
   - Dynamic OpenGraph and Twitter card metadata.
   - Fully optimized image tags (`image_tag`, `image_url`, widths, lazy loading below fold).
   - Strict adherence to Shopify Theme Check standards (0 errors).

---

## 🚀 How to Connect to Shopify Store

1. In your **Shopify Admin**, navigate to:  
   **Online Store** &rarr; **Themes**
2. Under **Theme library**, click **Add theme** &rarr; **Connect from GitHub**.
3. Select your GitHub account and repository:  
   `khudasiya/LACEYAAN`
4. Select the migration branch:  
   **`shopify-theme`**
5. Click **Connect**. Shopify will automatically pull the branch into your Theme library as a draft theme.
6. Click **Actions** &rarr; **Preview** to inspect the theme live with your store data without affecting your active storefront.
7. Click **Customize** to open the Shopify Theme Editor and assign collections, menus, and media.
