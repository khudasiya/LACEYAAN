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

# 2. PREVIEW_PRODUCT.HTML (Product Studio & Accordions)
product_main = """
<main id="MainContent" class="main-content" role="main">
  <section class="main-product-section">
    <div class="container">
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="preview_public_store.html">Home</a>
        <span class="bc-sep">/</span>
        <a href="preview_public_store.html#featured-collection">Atelier Laces</a>
        <span class="bc-sep">/</span>
        <span class="bc-current">10mm Chunky Braided Rope Laces</span>
      </nav>

      <div class="product-layout-grid">
        <!-- Left: High-Resolution Atelier Product Gallery -->
        <div class="product-gallery atelier-product-gallery">
          <div class="main-gallery-viewport" id="ProductPageGalleryViewport">
            <div class="gallery-main-image-wrap" id="ProductMainImageWrap">
              <img src="assets/product-rope.jpg" alt="10mm Chunky Braided Rope Laces" class="main-product-img" id="ProductMainImage">
            </div>
            <div class="gallery-badges">
              <span class="badge badge-sale">Save 25%</span>
            </div>
          </div>

          <div class="gallery-thumbs-rail" id="ProductGalleryThumbs">
            <button type="button" class="gallery-thumb-btn active" data-media-url="assets/product-rope.jpg" aria-label="Still 1">
              <img src="assets/product-rope.jpg" alt="Rope Still">
            </button>
            <button type="button" class="gallery-thumb-btn" data-media-url="assets/lace-white.jpg" aria-label="Still 2">
              <img src="assets/lace-white.jpg" alt="White lace">
            </button>
            <button type="button" class="gallery-thumb-btn" data-media-url="assets/lace-black.jpg" aria-label="Still 3">
              <img src="assets/lace-black.jpg" alt="Black lace">
            </button>
            <button type="button" class="gallery-thumb-btn" data-media-url="assets/product-waxed.jpg" aria-label="Still 4">
              <img src="assets/product-waxed.jpg" alt="Waxed lace">
            </button>
          </div>
        </div>

        <!-- Right: Product Info & Buy Controls -->
        <div class="product-info-wrap">
          <span class="badge badge-gold">✦ SIGNATURE ATELIER DROP</span>
          <h1 class="product-detail-title">10mm Chunky Braided Rope Laces</h1>
          <div class="product-price-row">
            <span class="current-price">₹899.00</span>
            <span class="tax-badge">MRP Incl. of all taxes</span>
          </div>

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
                <span class="pincode-check-icon">✓</span>
                <div class="pincode-message-content">
                  <p class="pincode-delivery-date">Delivering to <strong data-pincode-display>------</strong>: <span class="date-highlight">Before 20 December</span></p>
                  <p class="pincode-delivery-sub">Complimentary Express Dispatch &bull; COD &amp; Prepaid Available</p>
                </div>
                <button type="button" class="btn-pincode-change" data-pincode-change>Change</button>
              </div>
            </div>
          </div>

          <!-- Variant Selector Pills -->
          <div class="variant-select-group">
            <label class="variant-group-label">Select Length:</label>
            <div class="length-pills-row">
              <button type="button" class="length-pill-btn active"><span>120 CM (5-6 Eyelets)</span></button>
              <button type="button" class="length-pill-btn"><span>140 CM (6-7 Eyelets)</span></button>
              <button type="button" class="length-pill-btn"><span>160 CM (7-8 Eyelets)</span></button>
            </div>
          </div>

          <!-- Aglet Finish Selector -->
          <div class="variant-select-group">
            <label class="variant-group-label">Aglet Metal Finish:</label>
            <div class="aglet-pills-row">
              <button type="button" class="aglet-pill-btn active"><span>Naval Solid Brass</span></button>
              <button type="button" class="aglet-pill-btn"><span>Matte Noir</span></button>
              <button type="button" class="aglet-pill-btn"><span>Brushed Silver</span></button>
            </div>
          </div>

          <!-- Quantity & Add to Cart -->
          <div class="product-purchase-row">
            <div class="product-qty-control">
              <button type="button" class="qty-btn" data-qty-action="minus">-</button>
              <input type="number" class="qty-input" value="1" min="1">
              <button type="button" class="qty-btn" data-qty-action="plus">+</button>
            </div>
            <button type="button" class="btn-primary btn-add-to-cart-main" id="MainAddToCartBtn">
              <span>ADD TO BAG [ ₹899 ]</span>
            </button>
          </div>

          <!-- Product Accordions -->
          <div class="product-accordion-suite">
            <details class="accordion-item" open>
              <summary class="accordion-header">
                <span>Craft &amp; Architecture</span>
                <span class="accordion-icon">+</span>
              </summary>
              <div class="accordion-body">
                <p>Triple-braided on high-tension Japanese shuttle looms. Woven from 100% long-staple combed cotton, finished with solid CNC-milled brass tips engraved with the LACEYAAN hallmark.</p>
              </div>
            </details>
            <details class="accordion-item">
              <summary class="accordion-header">
                <span>Sneaker Compatibility</span>
                <span class="accordion-icon">+</span>
              </summary>
              <div class="accordion-body">
                <p>Designed for Nike Dunk Low &amp; High, Air Jordan 1 Retro, New Balance 550 &amp; 990v6, Travis Scott collabs, and luxury high-top silhouettes.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sticky Mobile Buy Bar -->
  <div class="mobile-sticky-buy-bar is-visible" id="StickyMobileBuyBar">
    <div class="sticky-buy-bar-inner">
      <div class="sticky-product-info">
        <img src="assets/product-rope.jpg" alt="Thumb" class="sticky-thumb-img">
        <div class="sticky-text-meta">
          <span class="sticky-title">10mm Chunky Braided Rope Laces</span>
          <span class="sticky-price">₹899.00</span>
        </div>
      </div>
      <button type="button" class="btn-primary sticky-add-btn" id="StickyAddBtn">ADD TO BAG</button>
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
