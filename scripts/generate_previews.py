import os
import re

print("Generating multi-page preview suites for comprehensive viewport auditing...")

with open('preview_public_store.html', 'r', encoding='utf-8') as f:
    full = f.read()

# Extract shell (head, header, mobile-drawer, quick-view, search-modal, footer)
header_end = full.find('<!-- Mobile Navigation Drawer -->')
head_and_nav = full[:header_end]

mobile_drawer_end = full.find('<main id="MainContent"')
mobile_drawer_html = full[header_end:mobile_drawer_end]

footer_start = full.find('<footer class="site-footer')
footer_and_scripts = full[footer_start:]

# 1. PREVIEW_CART.HTML
cart_main = """
<main id="MainContent" class="main-content" role="main">
  <section class="main-cart-section section-padding">
    <div class="container">
      <div class="cart-page-header text-center">
        <span class="badge badge-gold">✦ ATELIER ROTATION</span>
        <h1 class="editorial-heading">Your Shopping Bag</h1>
        <p class="section-subtitle">Review your curated laces, select delivery preferences, or update quantities.</p>
      </div>

      <div class="cart-page-container">
        <!-- Pincode Estimator -->
        <div class="pincode-checker-widget pincode-context-cart-page" data-pincode-widget>
          <div class="pincode-header">
            <div class="pincode-title-wrap">
              <span class="pincode-title">Estimated Delivery</span>
            </div>
          </div>
          <div class="pincode-form" data-pincode-form>
            <div class="pincode-input-wrapper">
              <input type="text" class="pincode-input" data-pincode-input placeholder="Enter 6-digit Pincode" maxlength="6">
              <button type="button" class="btn-pincode-check" data-pincode-submit><span>CHECK</span></button>
            </div>
          </div>
          <div class="pincode-result" data-pincode-result style="display: none;">
            <div class="pincode-success-row">
              <span class="pincode-check-icon">✓</span>
              <div class="pincode-message-content">
                <p class="pincode-delivery-date">Delivering to <strong data-pincode-display>------</strong>: <span class="date-highlight">Before 20 December</span></p>
                <p class="pincode-delivery-sub">Complimentary Express Dispatch &bull; COD &amp; Prepaid Available</p>
              </div>
              <button type="button" class="btn-pincode-change" data-pincode-change>Change</button>
            </div>
          </div>
        </div>

        <!-- Cart Table Form -->
        <form action="/cart" method="post" id="cart-page-form" class="cart-page-form">
          <table class="cart-page-table">
            <thead class="cart-page-thead">
              <tr>
                <th class="th-item">Product</th>
                <th class="th-price">Price</th>
                <th class="th-qty">Quantity</th>
                <th class="th-total">Total</th>
              </tr>
            </thead>
            <tbody id="cart-page-tbody">
              <tr class="cart-page-row" data-line="1">
                <td class="item-cell">
                  <div class="cart-item-meta-wrap">
                    <img src="assets/product-rope.jpg" alt="10mm Chunky Braided Rope Laces" class="cart-page-item-img" width="80" height="80">
                    <div class="cart-item-details">
                      <a href="#product" class="cart-page-item-title">10mm Chunky Braided Rope Laces</a>
                      <span class="cart-page-item-variant">Raw Ecru Cotton &bull; 140cm (6-7 Eyelets)</span>
                      <button type="button" class="cart-page-remove-btn" data-cart-page-remove data-item-line="1">Remove</button>
                    </div>
                  </div>
                </td>
                <td class="price-cell">
                  <span class="price-text">₹899.00</span>
                </td>
                <td class="qty-cell">
                  <div class="cart-page-qty-stepper">
                    <button type="button" class="cart-page-qty-btn" data-cart-page-qty="minus" data-item-line="1">-</button>
                    <input type="number" class="cart-page-qty-input" value="1" min="0" data-cart-page-qty-input data-item-line="1">
                    <button type="button" class="cart-page-qty-btn" data-cart-page-qty="plus" data-item-line="1">+</button>
                  </div>
                </td>
                <td class="total-cell">
                  <span class="line-total-price">₹899.00</span>
                </td>
              </tr>
              <tr class="cart-page-row" data-line="2">
                <td class="item-cell">
                  <div class="cart-item-meta-wrap">
                    <img src="assets/product-waxed.jpg" alt="Japanese Waxed Flat Sneaker Laces" class="cart-page-item-img" width="80" height="80">
                    <div class="cart-item-details">
                      <a href="#product" class="cart-page-item-title">Japanese Waxed Flat Sneaker Laces</a>
                      <span class="cart-page-item-variant">Matte Noir Wax &bull; 120cm (5-6 Eyelets)</span>
                      <button type="button" class="cart-page-remove-btn" data-cart-page-remove data-item-line="2">Remove</button>
                    </div>
                  </div>
                </td>
                <td class="price-cell">
                  <span class="price-text">₹799.00</span>
                </td>
                <td class="qty-cell">
                  <div class="cart-page-qty-stepper">
                    <button type="button" class="cart-page-qty-btn" data-cart-page-qty="minus" data-item-line="2">-</button>
                    <input type="number" class="cart-page-qty-input" value="1" min="0" data-cart-page-qty-input data-item-line="2">
                    <button type="button" class="cart-page-qty-btn" data-cart-page-qty="plus" data-item-line="2">+</button>
                  </div>
                </td>
                <td class="total-cell">
                  <span class="line-total-price">₹799.00</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="cart-page-footer">
            <div class="cart-notes-col">
              <label for="cart-notes">Special Atelier Instructions</label>
              <textarea id="cart-notes" name="note" placeholder="Custom lace swap instructions or notes for the courier..."></textarea>
            </div>
            <div class="cart-summary-col">
              <div class="cart-summary-row">
                <span>Subtotal:</span>
                <span id="cart-page-base-subtotal" class="subtotal-val">₹1,698.00</span>
              </div>
              <p class="cart-taxes-note">Taxes included. Express domestic shipping calculated at checkout.</p>
              <div class="cart-actions-row">
                <a href="preview_public_store.html#featured-collection" class="btn-secondary">Continue Shopping</a>
                <button type="submit" name="checkout" class="btn-primary btn-checkout-glow">Proceed to Checkout [ &rarr; ]</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</main>
"""

with open('preview_cart.html', 'w', encoding='utf-8') as f:
    f.write(head_and_nav + mobile_drawer_html + cart_main + footer_and_scripts)
print("Created preview_cart.html")

# 2. PREVIEW_PRODUCT.HTML (Bluorng Editorial Layout & Multi-Image Suite)
product_main = """
<main id="MainContent" class="main-content" role="main">
  <section class="main-product-section bluorng-product-page">
    <div class="container bluorng-container">
      <!-- Clean Minimalist Breadcrumbs -->
      <nav class="breadcrumb-nav bluorng-breadcrumb" aria-label="Breadcrumb">
        <a href="preview_public_store.html">Home</a>
        <span class="bc-sep">/</span>
        <a href="preview_collection.html">Atelier Laces</a>
        <span class="bc-sep">/</span>
        <span class="bc-current">10mm Chunky Braided Rope Laces</span>
      </nav>

      <div class="bluorng-product-layout">
        <!-- Left: Bluorng Multi-Image Editorial Gallery -->
        <div class="bluorng-gallery-col" id="BluorngGalleryCol">
          <!-- Floating Controls / Counter on Gallery -->
          <div class="gallery-floating-bar">
            <span class="gallery-counter-pill" id="GalleryCounterPill">1 / 4</span>
            <button type="button" class="gallery-zoom-trigger" id="GalleryZoomTrigger" aria-label="Open Fullscreen Lightbox">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              <span>EXPAND</span>
            </button>
          </div>

          <!-- Editorial Gallery Grid (Desktop 2-Column Mosaic) & Swipe Carousel (Mobile) -->
          <div class="bluorng-editorial-grid" id="BluorngEditorialGrid" data-media-count="4">
            <!-- Photo 1: Large Hero Portrait (Matches Bluorng full model shot) -->
            <div class="gallery-item-card is-hero-item active" data-media-index="0" data-full-url="assets/product-rope.jpg">
              <img src="assets/product-rope.jpg" alt="10mm Chunky Braided Rope Laces" class="gallery-editorial-img" id="ProductMainImage">
              <button type="button" class="card-expand-btn" aria-label="View photo 1 in high resolution">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
            </div>

            <!-- Photo 2: Secondary Close-up Detail (Matches Bluorng top detail) -->
            <div class="gallery-item-card" data-media-index="1" data-full-url="assets/lace-white.jpg">
              <img src="assets/lace-white.jpg" alt="Atelier Weave Close-up" class="gallery-editorial-img" loading="lazy">
              <button type="button" class="card-expand-btn" aria-label="View photo 2 in high resolution">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
            </div>

            <!-- Photo 3: Third Detail Shot (Matches Bluorng bottom detail) -->
            <div class="gallery-item-card" data-media-index="2" data-full-url="assets/lace-black.jpg">
              <img src="assets/lace-black.jpg" alt="Atelier Noir Contrast" class="gallery-editorial-img" loading="lazy">
              <button type="button" class="card-expand-btn" aria-label="View photo 3 in high resolution">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
            </div>

            <!-- Photo 4: Fourth Still Shot -->
            <div class="gallery-item-card" data-media-index="3" data-full-url="assets/product-waxed.jpg">
              <img src="assets/product-waxed.jpg" alt="Atelier Waxed Finish" class="gallery-editorial-img" loading="lazy">
              <button type="button" class="card-expand-btn" aria-label="View photo 4 in high resolution">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
            </div>
          </div>

          <!-- Mobile Carousel Navigation Controls (Arrows + Dots) -->
          <div class="gallery-carousel-nav" id="GalleryCarouselNav">
            <button type="button" class="carousel-arrow-btn prev-btn" id="GalleryPrevBtn" aria-label="Previous photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            
            <div class="carousel-dots-wrap" id="GalleryDotsWrap">
              <button type="button" class="carousel-dot active" data-dot-index="0" aria-label="Slide 1"></button>
              <button type="button" class="carousel-dot" data-dot-index="1" aria-label="Slide 2"></button>
              <button type="button" class="carousel-dot" data-dot-index="2" aria-label="Slide 3"></button>
              <button type="button" class="carousel-dot" data-dot-index="3" aria-label="Slide 4"></button>
            </div>

            <button type="button" class="carousel-arrow-btn next-btn" id="GalleryNextBtn" aria-label="Next photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <!-- Desktop Quick Thumbnail Bar below grid -->
          <div class="bluorng-thumbs-dock" id="BluorngThumbsDock">
            <button type="button" class="thumb-dock-pill gallery-thumb-btn active" data-thumb-index="0" data-media-url="assets/product-rope.jpg" aria-label="Photo 1">
              <img src="assets/product-rope.jpg" alt="Rope Still">
            </button>
            <button type="button" class="thumb-dock-pill gallery-thumb-btn" data-thumb-index="1" data-media-url="assets/lace-white.jpg" aria-label="Photo 2">
              <img src="assets/lace-white.jpg" alt="White Still">
            </button>
            <button type="button" class="thumb-dock-pill gallery-thumb-btn" data-thumb-index="2" data-media-url="assets/lace-black.jpg" aria-label="Photo 3">
              <img src="assets/lace-black.jpg" alt="Black Still">
            </button>
            <button type="button" class="thumb-dock-pill gallery-thumb-btn" data-thumb-index="3" data-media-url="assets/product-waxed.jpg" aria-label="Photo 4">
              <img src="assets/product-waxed.jpg" alt="Waxed Still">
            </button>
          </div>
        </div>

        <!-- Right: Bluorng Floating White Purchasing Card -->
        <div class="bluorng-card-col">
          <div class="bluorng-buy-card">
            <!-- Card Header: Title & Wishlist Bookmark -->
            <div class="card-title-row">
              <h1 class="card-product-title">10mm Chunky Braided Rope Laces</h1>
              <button type="button" class="btn-wishlist-bookmark" id="WishlistBookmarkBtn" aria-label="Save to Wishlist" title="Save to Wishlist">
                <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>

            <!-- Price & Stock Status -->
            <div class="card-price-row">
              <span class="card-price-now">Rs. 899.00</span>
              <span class="card-price-was">Rs. 1,199.00</span>
              <span class="card-stock-status">
                <span class="stock-dot"></span>
                <span>In Stock &mdash; Ready to Dispatch</span>
              </span>
            </div>

            <!-- Size / Length Selection with Size Guide Trigger -->
            <div class="card-variants-section">
              <div class="variant-label-row">
                <span class="variant-name-label">Select Length: <strong class="active-val">140 CM</strong></span>
                <button type="button" class="btn-size-guide-pill" id="OpenSizeGuideBtn">Size Guide</button>
              </div>

              <div class="variant-pills-row">
                <button type="button" class="variant-size-pill" data-variant-size="120">120 CM (5-6 Eyelets)</button>
                <button type="button" class="variant-size-pill is-selected" data-variant-size="140">140 CM (6-7 Eyelets)</button>
                <button type="button" class="variant-size-pill" data-variant-size="160">160 CM (7-8 Eyelets)</button>
              </div>
            </div>

            <!-- Aglet Hardware Finish Selection -->
            <div class="card-variants-section">
              <div class="variant-label-row">
                <span class="variant-name-label">Aglet Finish: <strong class="active-val">Naval Solid Brass</strong></span>
              </div>
              <div class="variant-pills-row">
                <button type="button" class="variant-size-pill is-selected">Naval Solid Brass</button>
                <button type="button" class="variant-size-pill">Matte Noir</button>
                <button type="button" class="variant-size-pill">Brushed Silver</button>
              </div>
            </div>

            <!-- Actions Row: Add to Bag (White) + Buy Now (Black) -->
            <div class="card-actions-row">
              <button type="button" class="btn-bluorng-bag" id="MainAddToCartBtn">
                ADD TO BAG
              </button>
              <button type="button" class="btn-bluorng-buy" id="MainBuyNowBtn" onclick="window.location.href='preview_cart.html'">
                BUY NOW
              </button>
            </div>

            <!-- Bluorng Tabs & Luxury Streetwear Perks -->
            <div class="card-tabs-suite" id="CardTabsSuite">
              <div class="tabs-nav-bar">
                <button type="button" class="tab-nav-btn active" data-tab-target="tab-desc">Details &amp; Description</button>
                <button type="button" class="tab-nav-btn" data-tab-target="tab-shipping">Shipping &amp; Delivery</button>
                <button type="button" class="tab-nav-btn" data-tab-target="tab-fit">Fit &amp; Sizing</button>
              </div>

              <div class="tab-pane active" id="tab-desc">
                <div class="luxury-perks-list">
                  <div class="perk-item"><span class="perk-bullet">&bull;</span> Packed within 24 hours.</div>
                  <div class="perk-item"><span class="perk-bullet">&bull;</span> Free delivery pan-India.</div>
                  <div class="perk-item"><span class="perk-bullet">&bull;</span> Dispatches next day.</div>
                </div>
                <div class="tab-description-rte">
                  <p>Triple-braided on high-tension Japanese shuttle looms. Woven from 100% long-staple combed cotton, finished with solid CNC-milled brass tips engraved with the LACEYAAN hallmark.</p>
                </div>
              </div>

              <div class="tab-pane" id="tab-shipping" hidden>
                <p class="tab-lead-text">Dispatched from our New Delhi atelier with express pan-India tracking.</p>
                <!-- Pincode Estimator Widget -->
                <div class="pincode-checker-widget pincode-context-product" data-pincode-widget>
                  <div class="pincode-header">
                    <div class="pincode-title-wrap">
                      <span class="pincode-title">Estimated Delivery</span>
                    </div>
                  </div>
                  <div class="pincode-form" data-pincode-form>
                    <div class="pincode-input-wrapper">
                      <input type="text" class="pincode-input" data-pincode-input placeholder="Enter 6-digit Pincode" maxlength="6">
                      <button type="button" class="btn-pincode-check" data-pincode-submit><span>CHECK</span></button>
                    </div>
                  </div>
                  <div class="pincode-result" data-pincode-result style="display: none;">
                    <div class="pincode-success-row">
                      <span class="pincode-check-icon">&#10003;</span>
                      <div class="pincode-message-content">
                        <p class="pincode-delivery-date">Delivering to <strong data-pincode-display>------</strong>: <span class="date-highlight">Before 20 December</span></p>
                        <p class="pincode-delivery-sub">Complimentary Express Dispatch &bull; COD &amp; Prepaid Available</p>
                      </div>
                      <button type="button" class="btn-pincode-change" data-pincode-change>Change</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane" id="tab-fit" hidden>
                <p class="tab-lead-text">Count the pairs of eyelets on your footwear to select your length:</p>
                <ul class="tab-fit-list">
                  <li><strong>120cm (47")</strong> &mdash; 5 to 6 Eyelets (Low-tops &amp; untied court sneakers)</li>
                  <li><strong>140cm (55")</strong> &mdash; 6 to 7 Eyelets (Standard mid-top &amp; lifestyle kicks)</li>
                  <li><strong>160cm (63")</strong> &mdash; 7 to 8 Eyelets (High-tops tied to top eyelet)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Fullscreen Lightbox Image Gallery Modal ("i should be able to go through all the pictures") -->
  <div class="gallery-lightbox-modal" id="GalleryLightboxModal" aria-hidden="true">
    <div class="lightbox-overlay" id="LightboxOverlay"></div>
    <div class="lightbox-stage">
      <button type="button" class="lightbox-close-btn" id="LightboxCloseBtn" aria-label="Close Lightbox">&times;</button>
      
      <div class="lightbox-counter-bar">
        <span class="lightbox-counter" id="LightboxCounter">1 / 4</span>
        <span class="lightbox-title">10mm Chunky Braided Rope Laces</span>
      </div>

      <div class="lightbox-image-wrap">
        <button type="button" class="lightbox-arrow-btn prev-arrow" id="LightboxPrevBtn" aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <img src="assets/product-rope.jpg" alt="Product Image" class="lightbox-active-img" id="LightboxActiveImg">
        <button type="button" class="lightbox-arrow-btn next-arrow" id="LightboxNextBtn" aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="lightbox-thumbs-strip" id="LightboxThumbsStrip"></div>
    </div>
  </div>

  <!-- Interactive Size Guide Modal -->
  <div class="size-guide-modal" id="SizeGuideModal" aria-hidden="true">
    <div class="size-guide-backdrop" id="SizeGuideBackdrop"></div>
    <div class="size-guide-dialog">
      <div class="size-guide-header">
        <h3 class="size-guide-title">Shoelace Length &amp; Fit Guide</h3>
        <button type="button" class="size-guide-close" id="SizeGuideCloseBtn" aria-label="Close Size Guide">&times;</button>
      </div>
      <div class="size-guide-body">
        <p class="size-guide-sub">Use your shoe's eyelet count to select the perfect drape:</p>
        <div class="size-guide-table-wrap">
          <table class="size-guide-table">
            <thead>
              <tr>
                <th>Pairs of Eyelets</th>
                <th>Recommended Length</th>
                <th>Sneaker Silhouettes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>4 Eyelets</strong></td>
                <td>90cm (36")</td>
                <td>Low-top casuals, dress shoes</td>
              </tr>
              <tr>
                <td><strong>5 &ndash; 6 Eyelets</strong></td>
                <td>120cm (47")</td>
                <td>Air Force 1 Low, Dunk Low, Sambas</td>
              </tr>
              <tr>
                <td><strong>6 &ndash; 7 Eyelets</strong></td>
                <td>140cm (55")</td>
                <td>Jordan 1 Mid, New Balance 550, Forum</td>
              </tr>
              <tr>
                <td><strong>7 &ndash; 8 Eyelets</strong></td>
                <td>160cm (63")</td>
                <td>Jordan 1 High, Dunk High, Blazers</td>
              </tr>
              <tr>
                <td><strong>8+ Eyelets</strong></td>
                <td>180cm (71")</td>
                <td>Boots, high basketball collars</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky Mobile Buy Bar -->
  <div class="mobile-sticky-buy-bar" id="mobile-sticky-buy-bar">
    <div class="sticky-buy-bar-inner">
      <div class="sticky-product-info">
        <img src="assets/product-rope.jpg" alt="Thumb" class="sticky-thumb-img">
        <div class="sticky-text-meta">
          <span class="sticky-title">10mm Chunky Braided Rope Laces</span>
          <span class="sticky-price">Rs. 899.00</span>
        </div>
      </div>
      <button type="button" class="btn-primary sticky-add-btn" id="StickyAddToCartBtn">ADD TO BAG</button>
    </div>
  </div>
</main>
"""

with open('preview_product.html', 'w', encoding='utf-8') as f:
    f.write(head_and_nav + mobile_drawer_html + product_main + footer_and_scripts)
print("Created preview_product.html")

# 3. PREVIEW_COLLECTION.HTML (2-column Catalog & Filters)
collection_main = """
<main id="MainContent" class="main-content" role="main">
  <section class="main-collection-section section-padding">
    <div class="container">
      <div class="collection-header text-center">
        <span class="badge badge-gold">✦ ATELIER CATALOG</span>
        <h1 class="editorial-heading">All Signature Weaves</h1>
        <p class="section-subtitle">Precision engineered laces crafted to elevate every sneaker rotation.</p>
      </div>

      <!-- Filter / Sort Toolbar -->
      <div class="collection-toolbar">
        <span class="collection-count">8 Silhouettes</span>
        <div class="toolbar-actions">
          <button type="button" class="btn-filter-trigger"><span>Filter Laces</span></button>
          <select class="sort-select" aria-label="Sort silhouettes">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- 2-Column Product Grid -->
      <div class="product-grid-layout grid-cols-4">
        <div class="product-card product-card-editorial">
          <div class="card-media">
            <a href="preview_product.html" class="media-link"><img src="assets/product-rope.jpg" alt="10mm Chunky Braided Rope Laces" class="primary-img"></a>
            <button type="button" class="card-bookmark-btn" aria-label="Save">★</button>
          </div>
          <div class="card-content-editorial">
            <div class="card-info-row">
              <h3 class="card-title"><a href="preview_product.html">10mm Chunky Braided Rope Laces</a></h3>
              <div class="card-price-row"><span class="price-now">₹899</span></div>
            </div>
            <button type="button" class="card-action-plus-btn" aria-label="Add to bag">+</button>
          </div>
        </div>

        <div class="product-card product-card-editorial">
          <div class="card-media">
            <a href="preview_product.html" class="media-link"><img src="assets/product-waxed.jpg" alt="Japanese Waxed Flat Sneaker Laces" class="primary-img"></a>
            <button type="button" class="card-bookmark-btn" aria-label="Save">★</button>
          </div>
          <div class="card-content-editorial">
            <div class="card-info-row">
              <h3 class="card-title"><a href="preview_product.html">Japanese Waxed Flat Sneaker Laces</a></h3>
              <div class="card-price-row"><span class="price-now">₹799</span></div>
            </div>
            <button type="button" class="card-action-plus-btn" aria-label="Add to bag">+</button>
          </div>
        </div>

        <div class="product-card product-card-editorial">
          <div class="card-media">
            <a href="preview_product.html" class="media-link"><img src="assets/lace-white.jpg" alt="Nocturnal 3M Reflective Rope Laces" class="primary-img"></a>
            <button type="button" class="card-bookmark-btn" aria-label="Save">★</button>
          </div>
          <div class="card-content-editorial">
            <div class="card-info-row">
              <h3 class="card-title"><a href="preview_product.html">Nocturnal 3M Reflective Rope Laces</a></h3>
              <div class="card-price-row"><span class="price-now">₹999</span></div>
            </div>
            <button type="button" class="card-action-plus-btn" aria-label="Add to bag">+</button>
          </div>
        </div>

        <div class="product-card product-card-editorial">
          <div class="card-media">
            <a href="preview_product.html" class="media-link"><img src="assets/lace-black.jpg" alt="1985 Vintage Distressed Flat Laces" class="primary-img"></a>
            <button type="button" class="card-bookmark-btn" aria-label="Save">★</button>
          </div>
          <div class="card-content-editorial">
            <div class="card-info-row">
              <h3 class="card-title"><a href="preview_product.html">1985 Vintage Distressed Flat Laces</a></h3>
              <div class="card-price-row"><span class="price-now">₹799</span></div>
            </div>
            <button type="button" class="card-action-plus-btn" aria-label="Add to bag">+</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
"""

with open('preview_collection.html', 'w', encoding='utf-8') as f:
    f.write(head_and_nav + mobile_drawer_html + collection_main + footer_and_scripts)
print("Created preview_collection.html")
