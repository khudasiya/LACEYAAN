/**
 * LACEYAAN - Luxury Streetwear & Sneaker Lace Atelier
 * Production Shopify Online Store 2.0 Theme JS
 * Pure Vanilla JavaScript (No jQuery / React dependencies)
 */

(function () {
  'use strict';

  // Global Namespace
  window.Laceyaan = window.Laceyaan || {};

  /* ==========================================================================
     Utility Helpers
     ========================================================================== */
  const Utils = {
    formatMoney(cents, format) {
      if (typeof cents === 'string') cents = cents.replace('.', '');
      let value = '';
      const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      const formatString = format || window.Laceyaan.moneyFormat || '₹{{amount}}';

      function defaultOption(opt, def) {
        return typeof opt === 'undefined' ? def : opt;
      }

      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal = defaultOption(decimal, '.');

        if (isNaN(number) || number == null) return 0;
        number = (number / 100.0).toFixed(precision);

        const parts = number.split('.');
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
        const cents = parts[1] ? decimal + parts[1] : '';

        return dollars + (precision > 0 ? cents : '');
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
        default:
          value = formatWithDelimiters(cents, 2);
      }

      return formatString.replace(placeholderRegex, value);
    },

    debounce(fn, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    showToast(message, type = 'info', action = null) {
      let toastContainer = document.getElementById('toast-container') || document.getElementById('laceyaan-toast');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      
      let actionHtml = '';
      if (action && action.url) {
        actionHtml = `<a href="${action.url}" class="toast-action-link">${action.text || 'View Cart &rarr;'}</a>`;
      }

      toast.innerHTML = `
        <span class="toast-indicator"></span>
        <span class="toast-message">${message}</span>
        ${actionHtml}
      `;
      toastContainer.appendChild(toast);

      setTimeout(() => toast.classList.add('is-visible'), 10);
      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 400);
      }, 4500);
    }
  };

  window.Laceyaan.Utils = Utils;

  /* ==========================================================================
     1. Announcement Bar Rotator
     ========================================================================== */
  class AnnouncementBar {
    constructor() {
      this.container = document.querySelector('[data-announcement-bar]');
      if (!this.container) return;

      this.slides = this.container.querySelectorAll('.announcement-slide');
      if (this.slides.length <= 1) return;

      this.currentIndex = 0;
      this.speed = parseInt(this.container.dataset.speed || '5', 10) * 1000;
      this.timer = null;

      this.prevBtn = this.container.querySelector('[data-announcement-prev]');
      this.nextBtn = this.container.querySelector('[data-announcement-next]');

      this.init();
    }

    init() {
      this.showSlide(0);
      this.startTimer();

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.prev();
          this.resetTimer();
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.next();
          this.resetTimer();
        });
      }

      this.container.addEventListener('mouseenter', () => this.stopTimer());
      this.container.addEventListener('mouseleave', () => this.startTimer());
    }

    showSlide(index) {
      this.slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('is-active');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('is-active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });
      this.currentIndex = index;
    }

    next() {
      const newIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(newIndex);
    }

    prev() {
      const newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.showSlide(newIndex);
    }

    startTimer() {
      this.stopTimer();
      this.timer = setInterval(() => this.next(), this.speed);
    }

    stopTimer() {
      if (this.timer) clearInterval(this.timer);
    }

    resetTimer() {
      this.startTimer();
    }
  }

  /* ==========================================================================
     2. Sticky Header & Mobile Drawer
     ========================================================================== */
  class Header {
    constructor() {
      this.header = document.querySelector('[data-header], #site-header, .site-header');
      this.menuTrigger = document.querySelector('[data-mobile-menu-trigger], #mobile-menu-toggle, .mobile-menu-toggle');
      this.menuDrawer = document.querySelector('[data-mobile-menu-drawer], #mobile-drawer, .mobile-drawer');
      this.menuClose = document.querySelector('[data-mobile-menu-close], #close-mobile-drawer, .drawer-close-btn');
      this.menuOverlay = document.querySelector('[data-mobile-menu-overlay], #mobile-drawer-overlay, .mobile-drawer-overlay');

      this.initSticky();
      this.initMobileDrawer();
    }

    initSticky() {
      if (!this.header) return;
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          this.header.classList.add('header--scrolled');
        } else {
          this.header.classList.remove('header--scrolled');
        }
      }, { passive: true });
    }

    initMobileDrawer() {
      if (!this.menuTrigger || !this.menuDrawer) return;

      const openDrawer = () => {
        this.menuDrawer.classList.add('is-open', 'active');
        this.menuDrawer.setAttribute('aria-hidden', 'false');
        if (this.menuTrigger) this.menuTrigger.setAttribute('aria-expanded', 'true');
        if (this.menuOverlay) {
          this.menuOverlay.classList.add('is-open', 'active');
          this.menuOverlay.setAttribute('aria-hidden', 'false');
        }
        document.body.classList.add('overflow-hidden');
      };

      const closeDrawer = () => {
        this.menuDrawer.classList.remove('is-open', 'active');
        this.menuDrawer.setAttribute('aria-hidden', 'true');
        if (this.menuTrigger) this.menuTrigger.setAttribute('aria-expanded', 'false');
        if (this.menuOverlay) {
          this.menuOverlay.classList.remove('is-open', 'active');
          this.menuOverlay.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('overflow-hidden');
      };

      this.menuTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
      if (this.menuClose) {
        this.menuClose.addEventListener('click', (e) => {
          e.preventDefault();
          closeDrawer();
        });
      }
      if (this.menuOverlay) {
        this.menuOverlay.addEventListener('click', (e) => {
          e.preventDefault();
          closeDrawer();
        });
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && (this.menuDrawer.classList.contains('active') || this.menuDrawer.classList.contains('is-open'))) {
          closeDrawer();
        }
      });

      // Accordion dropdowns in mobile menu
      const dropdownTriggers = this.menuDrawer.querySelectorAll('[data-dropdown-trigger], .mobile-nav-accordion-btn');
      dropdownTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const content = btn.nextElementSibling;
          if (content) {
            const isOpen = content.classList.contains('is-open') || content.classList.contains('open');
            content.classList.toggle('is-open', !isOpen);
            content.classList.toggle('open', !isOpen);
            btn.classList.toggle('is-open', !isOpen);
            btn.classList.toggle('open', !isOpen);
            btn.setAttribute('aria-expanded', !isOpen);
          }
        });
      });
    }
  }

  /* ==========================================================================
     3. Native Shopify Cart Drawer (Ajax API)
     ========================================================================== */
  class CartDrawer {
    constructor() {
      this.drawer = document.getElementById('cart-drawer');
      if (!this.drawer) return;

      this.overlay = document.getElementById('cart-drawer-overlay');
      this.closeBtn = this.drawer.querySelector('[data-cart-close], #close-cart-drawer');
      this.openTriggers = document.querySelectorAll('[data-cart-drawer-trigger], [data-open-cart], #open-cart-drawer, .bag-btn');
      this.itemsContainer = this.drawer.querySelector('#cart-drawer-items, #cart-items-container');
      this.countElements = document.querySelectorAll('#cart-drawer-count, .cart-count-bubble, [data-cart-count], #header-cart-count, .bag-count-bubble');
      this.subtotalElement = this.drawer.querySelector('#cart-drawer-subtotal, #drawer-subtotal-amount');
      this.freeShippingBar = this.drawer.querySelector('#shipping-progress-fill, .shipping-progress-fill');
      this.freeShippingText = this.drawer.querySelector('#shipping-progress-text, .shipping-progress-text');
      this.emptyState = this.drawer.querySelector('#cart-drawer-empty, .cart-empty-state');
      this.filledState = this.drawer.querySelector('#cart-drawer-filled, .drawer-footer');
      this.extrasState = this.drawer.querySelector('#cart-drawer-extras');

      this.threshold = parseInt(window.Laceyaan.freeShippingThreshold || '149900', 10);

      this.bindEvents();
    }

    bindEvents() {
      this.openTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.overlay) this.overlay.addEventListener('click', () => this.close());

      // Global intercept for all Shopify product add forms
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.matches('form[action*="/cart/add"]') || form.dataset.type === 'add-to-cart-form') {
          e.preventDefault();
          this.handleFormSubmit(form);
        }
      });

      // Standalone Add to Bag Buttons
      document.addEventListener('click', async (e) => {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (!addBtn || addBtn.closest('form')) return;

        e.preventDefault();
        const variantId = addBtn.dataset.variantId;
        const handle = addBtn.dataset.productHandle;

        if (variantId) {
          const originalContent = addBtn.innerHTML;
          addBtn.disabled = true;
          try {
            const formData = new FormData();
            formData.append('id', variantId);
            formData.append('quantity', '1');
            const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Could not add to bag');
            const item = await res.json();
            if (window.Laceyaan.cartDrawer) {
              await window.Laceyaan.cartDrawer.refresh();
              window.Laceyaan.cartDrawer.open();
            }
            Utils.showToast(`${item.title} added to your bag`, 'success', { text: 'View Bag [ → ]', url: '/cart' });
          } catch (err) {
            Utils.showToast(err.message, 'error');
          } finally {
            addBtn.disabled = false;
            addBtn.innerHTML = originalContent;
          }
        } else if (handle) {
          window.location.href = `/products/${handle}`;
        } else {
          window.location.href = '/collections/all';
        }
      });

      // Standalone BUY NOW Buttons (Direct Checkout)
      document.addEventListener('click', async (e) => {
        const buyBtn = e.target.closest('[data-buy-now], [data-direct-buy-now]');
        if (!buyBtn) return;

        e.preventDefault();
        const variantId = buyBtn.dataset.variantId || document.getElementById('selected-variant-id')?.value;
        const handle = buyBtn.dataset.productHandle;

        if (variantId) {
          const originalText = buyBtn.innerHTML;
          buyBtn.disabled = true;
          buyBtn.innerHTML = '<span>CHECKING OUT...</span>';

          // Get selected quantity from nearest quantity input or default to 1
          const form = buyBtn.closest('form') || document.querySelector('.native-product-form');
          const qtyInput = form ? form.querySelector('[name="quantity"]') : null;
          const quantity = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

          try {
            const formData = new FormData();
            formData.append('id', variantId);
            formData.append('quantity', String(quantity));
            const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
            if (res.ok) {
              window.location.href = '/checkout';
            } else {
              window.location.href = '/cart';
            }
          } catch (err) {
            window.location.href = '/checkout';
          } finally {
            buyBtn.disabled = false;
            buyBtn.innerHTML = originalText;
          }
        } else if (handle) {
          window.location.href = `/products/${handle}`;
        } else {
          window.location.href = '/collections/all';
        }
      });

      // Editorial Streetwear Product Card Minimalist Plus (+) Quick-Action Button
      document.addEventListener('click', async (e) => {
        const plusBtn = e.target.closest('[data-action-plus]');
        if (!plusBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const handle = plusBtn.dataset.productHandle;
        const variantId = plusBtn.dataset.variantId;
        const available = plusBtn.dataset.available !== 'false';
        const hasVariants = plusBtn.dataset.hasVariants === 'true';
        const isPrototype = plusBtn.dataset.isPrototype === 'true';

        // If prototype, multi-variant, or unavailable -> navigate directly to product page in full screen
        if (isPrototype || hasVariants || !available || !variantId) {
          if (handle) {
            window.location.href = `/products/${handle}`;
          } else {
            const card = plusBtn.closest('.product-card');
            const link = card ? card.querySelector('.media-link, .card-title a') : null;
            if (link && link.href) {
              window.location.href = link.href;
            } else {
              window.location.href = '/collections/all';
            }
          }
          return;
        }

        // Single variant in stock -> 1-click add to cart & open cart drawer
        const originalContent = plusBtn.innerHTML;
        plusBtn.disabled = true;
        plusBtn.innerHTML = '<span class="plus-symbol" style="display:inline-block;animation:spin 0.6s linear infinite;">↻</span>';

        try {
          const formData = new FormData();
          formData.append('id', variantId);
          formData.append('quantity', '1');
          const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
          if (!res.ok) throw new Error('Could not add to bag');
          const item = await res.json();
          if (window.Laceyaan.cartDrawer) {
            await window.Laceyaan.cartDrawer.refresh();
            window.Laceyaan.cartDrawer.open();
          }
          Utils.showToast(`${item.title} added to your bag`, 'success', { text: 'View Bag [ → ]', url: '/cart' });
        } catch (err) {
          if (handle) {
            window.location.href = `/products/${handle}`;
          } else {
            Utils.showToast(err.message || 'Error adding to bag', 'error');
          }
        } finally {
          plusBtn.disabled = false;
          plusBtn.innerHTML = originalContent;
        }
      });

      // Cart Item modifications inside Drawer
      if (this.itemsContainer) {
        this.itemsContainer.addEventListener('click', (e) => {
          const target = e.target.closest('[data-cart-item-action]');
          if (!target) return;

          const action = target.dataset.cartItemAction;
          const key = target.dataset.itemKey;
          const line = parseInt(target.dataset.itemLine, 10);
          const currentQty = parseInt(target.dataset.itemQty, 10);

          if (action === 'remove') {
            this.changeQuantity(key || line, 0);
          } else if (action === 'plus') {
            this.changeQuantity(key || line, currentQty + 1);
          } else if (action === 'minus') {
            this.changeQuantity(key || line, Math.max(0, currentQty - 1));
          }
        });

        this.itemsContainer.addEventListener('change', (e) => {
          if (e.target.matches('[data-cart-quantity-input]')) {
            const key = e.target.dataset.itemKey;
            const line = parseInt(e.target.dataset.itemLine, 10);
            const qty = parseInt(e.target.value, 10);
            if (!isNaN(qty)) this.changeQuantity(key || line, qty);
          }
        });
      }

      // Order Note updating
      const noteInput = this.drawer.querySelector('#cart-note');
      if (noteInput) {
        noteInput.addEventListener('change', Utils.debounce(() => {
          fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: noteInput.value })
          });
        }, 500));
      }
    }

    async open() {
      this.drawer.classList.add('active', 'is-open');
      if (this.overlay) this.overlay.classList.add('active', 'is-open');
      this.drawer.setAttribute('aria-hidden', 'false');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overflow-hidden');
      await this.refresh();
    }

    close() {
      this.drawer.classList.remove('active', 'is-open');
      if (this.overlay) this.overlay.classList.remove('active', 'is-open');
      this.drawer.setAttribute('aria-hidden', 'true');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    }

    async refresh() {
      try {
        const res = await fetch('/cart.js');
        const cart = await res.json();
        this.render(cart);
      } catch (err) {
        console.error('Cart fetch failed:', err);
      }
    }

    async handleFormSubmit(form) {
      const submitBtn = form.querySelector('[type="submit"], [name="add"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> ADDING...';
      }

      try {
        const formData = new FormData(form);
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.description || 'Could not add item to bag');
        }

        const addedItem = await res.json();
        await this.refresh();
        this.open();
        Utils.showToast(`${addedItem.title} added to your bag`, 'success', { text: 'View Bag [ → ]', url: '/cart' });
      } catch (err) {
        Utils.showToast(err.message, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    }

    async changeQuantity(identifier, quantity) {
      try {
        const payload = (typeof identifier === 'string' && identifier.length > 5)
          ? { id: identifier, quantity: parseInt(quantity, 10) }
          : { line: parseInt(identifier, 10), quantity: parseInt(quantity, 10) };

        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Could not update cart quantity');
        const cart = await res.json();
        this.render(cart);

        if (window.Laceyaan.cartPage) {
          window.Laceyaan.cartPage.render(cart);
        }
      } catch (err) {
        console.error('Cart quantity update error:', err);
        Utils.showToast('Could not update quantity', 'error');
      }
    }

    render(cart) {
      // Update count badges
      this.countElements.forEach(el => {
        el.textContent = cart.item_count;
        if (el.classList.contains('cart-count-bubble')) {
          el.style.display = cart.item_count > 0 ? 'inline-flex' : 'none';
        }
      });

      if (cart.item_count === 0) {
        if (this.emptyState) this.emptyState.style.display = 'block';
        if (this.filledState) this.filledState.style.display = 'none';
        if (this.itemsContainer) this.itemsContainer.style.display = 'none';
        if (this.extrasState) this.extrasState.style.display = 'none';
        return;
      }

      if (this.emptyState) this.emptyState.style.display = 'none';
      if (this.filledState) this.filledState.style.display = 'block';
      if (this.itemsContainer) this.itemsContainer.style.display = 'block';
      if (this.extrasState) this.extrasState.style.display = 'block';

      // Subtotal
      if (this.subtotalElement) {
        this.subtotalElement.dataset.basePrice = cart.total_price;
        this.subtotalElement.textContent = Utils.formatMoney(cart.total_price);
      }

      // Sync Delivery Method and Recalculate Totals
      if (window.Laceyaan.deliveryManager) {
        window.Laceyaan.deliveryManager.updatePricesForCart(cart.total_price);
      }

      // Free shipping threshold
      if (this.freeShippingBar && this.freeShippingText) {
        const remaining = this.threshold - cart.total_price;
        const progress = Math.min(100, (cart.total_price / this.threshold) * 100);
        this.freeShippingBar.style.width = `${progress}%`;

        if (remaining <= 0) {
          this.freeShippingText.innerHTML = '<div class="shipping-unlocked"><span>⚡</span> <span>Complimentary Express Shipping Unlocked!</span></div>';
        } else {
          this.freeShippingText.innerHTML = `Add <strong>${Utils.formatMoney(remaining)}</strong> more for Complimentary Express Shipping`;
        }
      }

      // Render Items
      if (this.itemsContainer) {
        this.itemsContainer.innerHTML = cart.items.map((item, index) => {
          const line = index + 1;

          // Safe image resolution
          let itemImg = '';
          if (item.featured_image) {
            itemImg = (typeof item.featured_image === 'object' && item.featured_image.url) 
              ? item.featured_image.url 
              : (typeof item.featured_image === 'string' ? item.featured_image : '');
          }
          if (!itemImg && item.image) {
            itemImg = typeof item.image === 'string' ? item.image : (item.image.url || '');
          }

          // Safe options resolution
          let optionsHtml = '';
          if (item.variant_title && item.variant_title !== 'Default Title') {
            optionsHtml = `<div class="cart-item-options"><span class="item-option-pill">${item.variant_title}</span></div>`;
          } else if (item.options_with_values && item.options_with_values.length) {
            optionsHtml = `<div class="cart-item-options">${item.options_with_values.map(opt => `<span class="item-option-pill">${opt.name}: ${opt.value}</span>`).join('')}</div>`;
          }

          const productTitle = item.product_title || item.title || 'Atelier Shoelaces';
          const linePrice = Utils.formatMoney(item.final_line_price != null ? item.final_line_price : (item.line_price != null ? item.line_price : (item.price * item.quantity)));

          return `
            <div class="cart-item-card" data-line="${line}">
              <div class="cart-item-image-wrapper">
                ${itemImg ? `<img src="${itemImg}" alt="${item.title || ''}" class="cart-item-img" width="75" height="75" loading="lazy">` : ''}
              </div>
              <div class="cart-item-content">
                <div class="cart-item-header">
                  <h4 class="cart-item-title"><a href="${item.url || '/cart'}">${productTitle}</a></h4>
                  <button type="button" class="cart-item-remove" data-cart-item-action="remove" data-item-key="${item.key}" data-item-line="${line}" aria-label="Remove item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                ${optionsHtml}
                <div class="cart-item-footer">
                  <div class="cart-qty-control">
                    <button type="button" class="qty-btn" data-cart-item-action="minus" data-item-key="${item.key}" data-item-line="${line}" data-item-qty="${item.quantity}">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" data-cart-quantity-input data-item-key="${item.key}" data-item-line="${line}">
                    <button type="button" class="qty-btn" data-cart-item-action="plus" data-item-key="${item.key}" data-item-line="${line}" data-item-qty="${item.quantity}">+</button>
                  </div>
                  <div class="cart-item-price">${linePrice}</div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  /* ==========================================================================
     3B. Delivery Method Manager (Founder Hand Delivery vs Standard)
     ========================================================================== */
  class DeliveryManager {
    constructor() {
      this.FEE_CENTS = 300000; // ₹3,000 in cents / paise
      this.STORAGE_KEY = 'laceyaan_founder_delivery';

      this.init();
    }

    init() {
      this.initCartPage();
      this.initCartDrawer();
      this.syncUI(this.isFounderSelected());
    }

    isFounderSelected() {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'true') return true;
      if (stored === 'false') return false;

      // Check pre-rendered markup
      const pageFounderRadio = document.querySelector('input[data-delivery-radio="founder"]');
      if (pageFounderRadio && pageFounderRadio.checked) return true;

      const drawerFounderRadio = document.querySelector('input[name="drawer_delivery_radio"][value="founder"]');
      if (drawerFounderRadio && drawerFounderRadio.checked) return true;

      return false;
    }

    setFounderSelected(selected) {
      localStorage.setItem(this.STORAGE_KEY, selected ? 'true' : 'false');
      this.syncUI(selected);
      this.updateCartAttributes(selected);
      this.syncLineItem(selected);
    }

    async syncLineItem(selected) {
      const pageSelector = document.getElementById('cart-delivery-selector') || document.getElementById('drawer-delivery-selector');
      const variantId = pageSelector ? pageSelector.dataset.founderVariantId : null;

      try {
        const res = await fetch('/cart.js');
        if (!res.ok) return;
        const cart = await res.json();
        const founderItem = cart.items.find(item => 
          (variantId && item.variant_id == variantId) ||
          item.title.toLowerCase().includes('founder') ||
          (item.product_title && item.product_title.toLowerCase().includes('founder'))
        );

        if (selected && !founderItem && variantId) {
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: [{ id: parseInt(variantId, 10), quantity: 1 }] })
          });
          if (window.Laceyaan.cartDrawer) await window.Laceyaan.cartDrawer.refresh();
        } else if (!selected && founderItem) {
          await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: founderItem.key, quantity: 0 })
          });
          if (window.Laceyaan.cartDrawer) await window.Laceyaan.cartDrawer.refresh();
        }
      } catch (e) {
        console.debug('Line item sync error:', e);
      }
    }

    updateCartAttributes(selected) {
      const addressInput = document.getElementById('cart-founder-vellore-address');
      const velloreAddress = (addressInput && addressInput.value) ? addressInput.value.trim() : '';

      const attributes = {
        'Delivery Method': selected ? 'Hand Delivered by Founder (₹3,000 - Only available in Vellore)' : 'Standard Atelier Shipping',
        'Founder Delivery Fee': selected ? '₹3,000' : '',
        'Delivery City': selected ? 'Only available in Vellore' : '',
        'delivery_method': selected ? 'Hand Delivered by Founder' : 'Standard'
      };

      if (selected && velloreAddress) {
        attributes['founder_delivery_vellore_address'] = velloreAddress;
      }

      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes })
      }).catch(err => console.debug('Cart attribute update sync:', err));
    }

    syncUI(selected) {
      // 1. Sync Cart Page (main-cart.liquid)
      const pageSelector = document.getElementById('cart-delivery-selector');
      if (pageSelector) {
        const standardBox = pageSelector.querySelector('[data-delivery-type="standard"]');
        const founderBox = pageSelector.querySelector('[data-delivery-type="founder"]');
        const standardRadio = pageSelector.querySelector('input[data-delivery-radio="standard"]');
        const founderRadio = pageSelector.querySelector('input[data-delivery-radio="founder"]');
        const velloreDetails = document.getElementById('cart-founder-vellore-details');
        const founderFeeRow = document.getElementById('cart-founder-fee-row');
        const baseSubtotalEl = document.getElementById('cart-page-base-subtotal');
        const finalTotalEl = document.getElementById('cart-page-final-total');

        if (standardBox) standardBox.classList.toggle('is-selected', !selected);
        if (founderBox) founderBox.classList.toggle('is-selected', selected);
        if (standardRadio) standardRadio.checked = !selected;
        if (founderRadio) founderRadio.checked = selected;

        if (velloreDetails) {
          velloreDetails.style.display = selected ? 'block' : 'none';
        }
        if (founderFeeRow) {
          founderFeeRow.style.display = selected ? 'flex' : 'none';
        }

        if (baseSubtotalEl && finalTotalEl) {
          const baseCents = parseInt(baseSubtotalEl.dataset.basePrice || '0', 10);
          const finalCents = selected ? (baseCents + this.FEE_CENTS) : baseCents;
          finalTotalEl.textContent = Utils.formatMoney(finalCents);
        }
      }

      // 2. Sync Cart Drawer (cart-drawer.liquid)
      const drawerSelector = document.getElementById('drawer-delivery-selector');
      if (drawerSelector) {
        const drawerStandardPill = drawerSelector.querySelector('[data-drawer-delivery="standard"]');
        const drawerFounderPill = drawerSelector.querySelector('[data-drawer-delivery="founder"]');
        const drawerStandardRadio = drawerSelector.querySelector('input[name="drawer_delivery_radio"][value="standard"]');
        const drawerFounderRadio = drawerSelector.querySelector('input[name="drawer_delivery_radio"][value="founder"]');
        const drawerFeeRow = document.getElementById('drawer-founder-fee-row');
        const drawerTotalRow = document.getElementById('drawer-final-total-row');
        const drawerSubtotalEl = document.getElementById('cart-drawer-subtotal');
        const drawerFinalTotalEl = document.getElementById('drawer-final-total-amount');
        const drawerAttrMethod = document.getElementById('drawer-attr-delivery-method');
        const drawerAttrFee = document.getElementById('drawer-attr-founder-fee');

        if (drawerStandardPill) drawerStandardPill.classList.toggle('is-selected', !selected);
        if (drawerFounderPill) drawerFounderPill.classList.toggle('is-selected', selected);
        if (drawerStandardRadio) drawerStandardRadio.checked = !selected;
        if (drawerFounderRadio) drawerFounderRadio.checked = selected;

        if (drawerFeeRow) drawerFeeRow.style.display = selected ? 'flex' : 'none';
        if (drawerTotalRow) drawerTotalRow.style.display = selected ? 'flex' : 'none';

        if (drawerAttrMethod) {
          drawerAttrMethod.value = selected ? 'Hand Delivered by Founder (₹3,000 - Vellore Only)' : 'Standard Atelier Shipping';
        }
        if (drawerAttrFee) {
          drawerAttrFee.value = selected ? '₹3,000' : '';
        }

        if (drawerSubtotalEl && drawerFinalTotalEl) {
          const baseCents = parseInt(drawerSubtotalEl.dataset.basePrice || '0', 10);
          const finalCents = selected ? (baseCents + this.FEE_CENTS) : baseCents;
          drawerFinalTotalEl.textContent = Utils.formatMoney(finalCents);
        }
      }
    }

    initCartPage() {
      const pageSelector = document.getElementById('cart-delivery-selector');
      if (!pageSelector) return;

      const radios = pageSelector.querySelectorAll('.delivery-radio-input');
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          const isFounder = radio.dataset.deliveryRadio === 'founder';
          this.setFounderSelected(isFounder);
        });
      });

      const boxes = pageSelector.querySelectorAll('.delivery-option-box');
      boxes.forEach(box => {
        box.addEventListener('click', (e) => {
          if (e.target.matches('input')) return;
          const isFounder = box.dataset.deliveryType === 'founder';
          this.setFounderSelected(isFounder);
        });
      });

      const addressInput = document.getElementById('cart-founder-vellore-address');
      if (addressInput) {
        addressInput.addEventListener('input', Utils.debounce(() => {
          if (this.isFounderSelected()) {
            this.updateCartAttributes(true);
          }
        }, 500));
      }
    }

    initCartDrawer() {
      const drawerSelector = document.getElementById('drawer-delivery-selector');
      if (!drawerSelector) return;

      const pills = drawerSelector.querySelectorAll('.drawer-delivery-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          if (e.target.matches('input')) return;
          const isFounder = pill.dataset.drawerDelivery === 'founder';
          this.setFounderSelected(isFounder);
        });
      });

      const radios = drawerSelector.querySelectorAll('input[name="drawer_delivery_radio"]');
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          const isFounder = radio.value === 'founder';
          this.setFounderSelected(isFounder);
        });
      });
    }

    updatePricesForCart(totalPriceCents) {
      const isFounder = this.isFounderSelected();

      // Update Cart Page subtotal base
      const pageBaseEl = document.getElementById('cart-page-base-subtotal');
      const pageFinalEl = document.getElementById('cart-page-final-total');
      if (pageBaseEl) {
        pageBaseEl.dataset.basePrice = totalPriceCents;
        pageBaseEl.textContent = Utils.formatMoney(totalPriceCents);
      }
      if (pageFinalEl) {
        const finalPrice = isFounder ? (totalPriceCents + this.FEE_CENTS) : totalPriceCents;
        pageFinalEl.textContent = Utils.formatMoney(finalPrice);
      }

      // Update Cart Drawer base
      const drawerSubtotalEl = document.getElementById('cart-drawer-subtotal');
      const drawerFinalTotalEl = document.getElementById('drawer-final-total-amount');
      if (drawerSubtotalEl) {
        drawerSubtotalEl.dataset.basePrice = totalPriceCents;
        drawerSubtotalEl.textContent = Utils.formatMoney(totalPriceCents);
      }
      if (drawerFinalTotalEl) {
        const finalPrice = isFounder ? (totalPriceCents + this.FEE_CENTS) : totalPriceCents;
        drawerFinalTotalEl.textContent = Utils.formatMoney(finalPrice);
      }

      this.syncUI(isFounder);
    }
  }

  /* ==========================================================================
     4. Predictive Live Search Modal
     ========================================================================== */
  class PredictiveSearch {
    constructor() {
      this.modal = document.getElementById('search-modal');
      if (!this.modal) return;

      this.openTriggers = document.querySelectorAll('[data-open-search], #open-search-modal');
      this.closeBtn = this.modal.querySelector('[data-search-close], #close-search-modal');
      this.input = this.modal.querySelector('#search-modal-input, #predictive-search-input');
      this.resultsContainer = this.modal.querySelector('#search-modal-results, #search-results-container');
      this.overlay = document.getElementById('search-modal-overlay') || this.modal.querySelector('.search-modal-backdrop');

      this.bindEvents();
    }

    bindEvents() {
      this.openTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.overlay) this.overlay.addEventListener('click', () => this.close());

      if (this.input) {
        this.input.addEventListener('input', Utils.debounce((e) => {
          this.performSearch(e.target.value.trim());
        }, 300));
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && (this.modal.classList.contains('active') || this.modal.classList.contains('is-open'))) {
          this.close();
        }
      });
    }

    open() {
      this.modal.classList.add('active', 'is-open');
      if (this.overlay) this.overlay.classList.add('active', 'is-open');
      this.modal.setAttribute('aria-hidden', 'false');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overflow-hidden');
      if (this.input) {
        setTimeout(() => this.input.focus(), 150);
      }
    }

    close() {
      this.modal.classList.remove('active', 'is-open');
      if (this.overlay) this.overlay.classList.remove('active', 'is-open');
      this.modal.setAttribute('aria-hidden', 'true');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    }

    async performSearch(query) {
      if (!this.resultsContainer) return;

      if (!query || query.length < 2) {
        this.resultsContainer.innerHTML = '';
        return;
      }

      this.resultsContainer.innerHTML = '<div class="search-loading">Exploring the collection...</div>';

      try {
        const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=show`);
        const data = await res.json();
        const products = data.resources.results.products;

        if (!products || products.length === 0) {
          this.resultsContainer.innerHTML = `<div class="search-empty">No bespoke laces found matching "${query}".</div>`;
          return;
        }

        this.resultsContainer.innerHTML = `
          <div class="search-results-grid">
            ${products.map(prod => `
              <a href="${prod.url}" class="search-result-item">
                <div class="search-result-thumb">
                  <img src="${prod.image || prod.featured_image || ''}" alt="${prod.title}" width="60" height="60" loading="lazy">
                </div>
                <div class="search-result-info">
                  <span class="search-result-title">${prod.title}</span>
                  <span class="search-result-price">${Utils.formatMoney(prod.price)}</span>
                </div>
              </a>
            `).join('')}
          </div>
          <div class="search-results-footer">
            <a href="/search?q=${encodeURIComponent(query)}" class="search-view-all-link">View all matching laces &rarr;</a>
          </div>
        `;
      } catch (err) {
        this.resultsContainer.innerHTML = '<div class="search-empty">Unable to fetch suggestions.</div>';
      }
    }
  }

  /* ==========================================================================
     5. Before & After Interactive Comparison Slider
     ========================================================================== */
  class BeforeAfterSlider {
    constructor() {
      const containers = document.querySelectorAll('[data-before-after-slider], #before-after-slider, .slider-container');
      containers.forEach(container => this.initSlider(container));
    }

    initSlider(container) {
      const handle = container.querySelector('[data-slider-handle], #slider-handle, .slider-handle');
      const beforeLayer = container.querySelector('[data-before-layer], #before-layer, .before-layer');
      const labelBefore = container.querySelector('[data-label-before], .label-before');
      const labelAfter = container.querySelector('[data-label-after], .label-after');
      if (!handle || !beforeLayer) return;

      let isDragging = false;

      const setPosition = (clientX) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0) return;
        const offsetX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));

        handle.style.left = `${percentage}%`;
        beforeLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        handle.setAttribute('aria-valuenow', Math.round(percentage));

        if (labelBefore) {
          labelBefore.style.opacity = percentage < 15 ? '0' : '1';
        }
        if (labelAfter) {
          labelAfter.style.opacity = percentage > 85 ? '0' : '1';
        }
      };

      // Pointer events support mouse, pen, and touch seamlessly
      container.addEventListener('pointerdown', (e) => {
        isDragging = true;
        try {
          container.setPointerCapture(e.pointerId);
        } catch (err) {}
        setPosition(e.clientX);
      });

      container.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        setPosition(e.clientX);
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try {
            container.releasePointerCapture(e.pointerId);
          } catch (err) {}
        }
      };

      container.addEventListener('pointerup', stopDrag);
      container.addEventListener('pointercancel', stopDrag);

      // Fallback touch events for older webviews
      container.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          isDragging = true;
          setPosition(e.touches[0].clientX);
        }
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches && e.touches[0]) {
          setPosition(e.touches[0].clientX);
        }
      }, { passive: true });

      container.addEventListener('touchend', () => { isDragging = false; });

      // Keyboard accessibility
      handle.addEventListener('keydown', (e) => {
        const current = parseFloat(handle.style.left) || 50;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const next = Math.max(0, current - 5);
          handle.style.left = `${next}%`;
          beforeLayer.style.clipPath = `polygon(0 0, ${next}% 0, ${next}% 100%, 0 100%)`;
          handle.setAttribute('aria-valuenow', Math.round(next));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = Math.min(100, current + 5);
          handle.style.left = `${next}%`;
          beforeLayer.style.clipPath = `polygon(0 0, ${next}% 0, ${next}% 100%, 0 100%)`;
          handle.setAttribute('aria-valuenow', Math.round(next));
        }
      });
    }
  }

  /* ==========================================================================
     6. Shoelace Length Calculator
     ========================================================================== */
  class LengthCalculator {
    constructor() {
      this.container = document.querySelector('[data-length-calculator]');
      if (!this.container) return;

      this.eyeletRadios = this.container.querySelectorAll('input[name="eyelets"]');
      this.styleRadios = this.container.querySelectorAll('input[name="lacing_style"]');
      this.resultCm = this.container.querySelector('#calc-result-cm');
      this.resultInches = this.container.querySelector('#calc-result-inches');
      this.resultSneakers = this.container.querySelector('#calc-recommended-sneakers');

      this.dataMatrix = {
        4: { normal: 100, loose: 90, high: 110, sneakers: 'Vans Era, Stan Smith Low' },
        5: { normal: 110, loose: 100, high: 120, sneakers: 'Air Force 1 Low, Dunk Low' },
        6: { normal: 120, loose: 110, high: 130, sneakers: 'Air Jordan 1 Low, SB Dunk' },
        7: { normal: 130, loose: 120, high: 140, sneakers: 'Air Jordan 1 Mid, Air Max 90' },
        8: { normal: 140, loose: 130, high: 160, sneakers: 'Air Jordan 1 High OG, Forum High' },
        9: { normal: 160, loose: 140, high: 180, sneakers: 'Rick Owens Geobasket, Boots' }
      };

      this.init();
    }

    init() {
      const calculate = () => {
        const eyeletChecked = this.container.querySelector('input[name="eyelets"]:checked');
        const styleChecked = this.container.querySelector('input[name="lacing_style"]:checked');

        const eyelets = eyeletChecked ? eyeletChecked.value : '6';
        const style = styleChecked ? styleChecked.value : 'normal';

        const matrix = this.dataMatrix[eyelets] || this.dataMatrix[6];
        const cm = matrix[style] || 120;
        const inches = Math.round(cm / 2.54);

        if (this.resultCm) this.resultCm.textContent = `${cm} cm`;
        if (this.resultInches) this.resultInches.textContent = `(${inches}")`;
        if (this.resultSneakers) this.resultSneakers.textContent = matrix.sneakers;
      };

      this.eyeletRadios.forEach(r => r.addEventListener('change', calculate));
      this.styleRadios.forEach(r => r.addEventListener('change', calculate));
      calculate();
    }
  }

  /* ==========================================================================
     7. Dynamic Product Page Variant Selector
     ========================================================================== */
  class ProductVariantSelector {
    constructor() {
      this.section = document.querySelector('[data-section-type="main-product"]');
      if (!this.section) return;

      const variantJsonEl = this.section.querySelector('[data-product-variants-json]');
      if (!variantJsonEl) return;

      try {
        this.variants = JSON.parse(variantJsonEl.textContent);
      } catch (err) {
        console.error('Failed to parse variants JSON', err);
        return;
      }

      this.form = this.section.querySelector('form[action*="/cart/add"]');
      this.masterSelect = this.section.querySelector('[name="id"]');
      this.priceEl = this.section.querySelector('[data-product-price]');
      this.comparePriceEl = this.section.querySelector('[data-compare-price]');
      this.saveBadgeEl = this.section.querySelector('[data-save-badge]');
      this.submitBtn = this.section.querySelector('[data-add-to-cart-button]');
      this.availabilityBadge = this.section.querySelector('[data-stock-badge]');

      this.init();
    }

    init() {
      const optionInputs = this.section.querySelectorAll('[data-option-input]');
      optionInputs.forEach(input => {
        input.addEventListener('change', () => {
          // Update active chip classes & label display
          const group = input.closest('[data-option-group]');
          if (group) {
            group.querySelectorAll('[data-chip-label]').forEach(chip => chip.classList.remove('active'));
            const parentChip = input.closest('[data-chip-label]');
            if (parentChip) parentChip.classList.add('active');

            const labelEl = group.querySelector('[data-selected-option-label]');
            if (labelEl) labelEl.textContent = input.value;
          }
          this.onOptionChange();
        });
      });

      // Quantity buttons
      const minusBtn = this.section.querySelector('[data-qty-minus]');
      const plusBtn = this.section.querySelector('[data-qty-plus]');
      const qtyInput = this.section.querySelector('[name="quantity"]');

      if (minusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
          let val = parseInt(qtyInput.value, 10);
          if (val > 1) qtyInput.value = val - 1;
        });
      }

      if (plusBtn && qtyInput) {
        plusBtn.addEventListener('click', () => {
          let val = parseInt(qtyInput.value, 10);
          qtyInput.value = val + 1;
        });
      }

      // Thumbnail gallery clicks
      const thumbs = this.section.querySelectorAll('[data-thumb-target]');
      const mainMediaImages = this.section.querySelectorAll('[data-main-media]');

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          const index = thumb.dataset.thumbTarget;
          thumbs.forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');

          mainMediaImages.forEach(img => {
            if (img.dataset.mediaIndex === index) {
              img.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        });
      });

      // Ensure Add to Bag button never shows price tags (User instruction: only ADD TO BAG must be there)
      const cleanBagButton = () => {
        const bagButtons = document.querySelectorAll('.btn-bluorng-bag, [data-add-to-cart-button], .btn-add-main');
        bagButtons.forEach(btn => {
          const priceEls = btn.querySelectorAll('.btn-price, .price, [data-button-price]');
          priceEls.forEach(el => el.remove());
          const textEl = btn.querySelector('[data-add-to-cart-text], span');
          if (textEl && (textEl.textContent.includes('•') || textEl.textContent.includes('·') || textEl.textContent.includes('Rs.'))) {
            const parts = textEl.textContent.split(/[•·]/);
            textEl.textContent = parts[0].trim();
          }
        });
      };
      cleanBagButton();
      setTimeout(cleanBagButton, 500);
      setTimeout(cleanBagButton, 1500);
    }

    getSelectedOptions() {
      const selected = [];
      const optionGroups = this.section.querySelectorAll('[data-option-group]');
      optionGroups.forEach(group => {
        const checked = group.querySelector('input:checked, select');
        if (checked) selected.push(checked.value);
      });
      return selected;
    }

    onOptionChange() {
      const selectedOptions = this.getSelectedOptions();
      const matchedVariant = this.variants.find(variant => {
        return variant.options.every((opt, idx) => opt === selectedOptions[idx]);
      });

      if (matchedVariant) {
        this.updateVariant(matchedVariant);
      } else {
        if (this.submitBtn) {
          this.submitBtn.disabled = true;
          this.submitBtn.textContent = 'Unavailable';
        }
      }
    }

    updateVariant(variant) {
      if (this.masterSelect) {
        this.masterSelect.value = variant.id;
      }

      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());

      // Update Price
      if (this.priceEl) {
        this.priceEl.textContent = Utils.formatMoney(variant.price);
      }

      if (this.comparePriceEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          this.comparePriceEl.textContent = Utils.formatMoney(variant.compare_at_price);
          this.comparePriceEl.style.display = 'inline';
          if (this.saveBadgeEl) {
            const savings = variant.compare_at_price - variant.price;
            this.saveBadgeEl.textContent = `SAVE ${Utils.formatMoney(savings)}`;
            this.saveBadgeEl.style.display = 'inline-block';
          }
        } else {
          this.comparePriceEl.style.display = 'none';
          if (this.saveBadgeEl) this.saveBadgeEl.style.display = 'none';
        }
      }

      // Update Availability & Add To Bag Button (No price tag, only ADD TO BAG)
      if (this.submitBtn) {
        if (variant.available) {
          this.submitBtn.disabled = false;
          this.submitBtn.innerHTML = '<svg class="bag-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span>ADD TO BAG</span>';
        } else {
          this.submitBtn.disabled = true;
          this.submitBtn.innerHTML = '<span>SOLD OUT</span>';
        }
      }

      // Update Direct Buy Now button
      const buyNowBtn = this.section.querySelector('[data-direct-buy-now]');
      if (buyNowBtn) {
        buyNowBtn.dataset.variantId = variant.id;
        if (variant.available) {
          buyNowBtn.disabled = false;
          buyNowBtn.style.display = 'inline-flex';
        } else {
          buyNowBtn.disabled = true;
          buyNowBtn.style.display = 'none';
        }
      }

      // Update Sticky Mobile Bar
      const stickyBtn = document.getElementById('StickyAddToCartBtn');
      const stickyPrice = document.getElementById('StickyBarPrice');
      if (stickyPrice) stickyPrice.textContent = Utils.formatMoney(variant.price);
      if (stickyBtn) {
        if (variant.available) {
          stickyBtn.disabled = false;
          stickyBtn.textContent = 'ADD TO BAG';
        } else {
          stickyBtn.disabled = true;
          stickyBtn.textContent = 'SOLD OUT';
        }
      }

      if (this.availabilityBadge) {
        if (variant.available) {
          this.availabilityBadge.className = 'stock-badge in-stock';
          this.availabilityBadge.innerHTML = '<span class="status-dot"></span> In Stock & Ready for Dispatch';
        } else {
          this.availabilityBadge.className = 'stock-badge out-of-stock';
          this.availabilityBadge.innerHTML = '<span class="status-dot"></span> Vault Closed &bull; Sold Out';
        }
      }

      // Switch to variant real product photo if available
      if (variant.featured_image && variant.featured_image.src) {
        if (window.Laceyaan.productGallery) {
          window.Laceyaan.productGallery.setImage(variant.featured_image.src);
        } else {
          const mainImg = document.getElementById('ProductMainImage');
          if (mainImg) {
            mainImg.src = variant.featured_image.src;
            mainImg.removeAttribute('srcset');
          }
        }
      }
    }
  }

  /* ==========================================================================
     8. LACEYAAN 3D Studio Sneaker Showcase & Quick View Modal
     ========================================================================== */
  class QuickViewModal {
    constructor() {
      this.modal = document.getElementById('quick-view-modal');
      if (!this.modal) return;

      this.overlay = document.getElementById('quick-view-overlay');
      this.closeBtn = this.modal.querySelector('#close-quick-view, [data-modal-close]');
      this.content = this.modal.querySelector('#quick-view-content');

      this.bindEvents();
    }

    bindEvents() {
      // Open modal on click of explicit quick view trigger
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-studio-modal], [data-quick-view-trigger], .quick-view-btn');
        if (!trigger) return;

        // Respect keyboard shortcuts or new-tab clicks (Cmd/Ctrl/Middle click)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        // Skip if user interacted with card sub-elements like bookmark or voting buttons
        if (e.target.closest('.card-bookmark-btn') || e.target.closest('[data-action-plus]')) return;

        const handle = trigger.dataset.productHandle || 
                       trigger.getAttribute('data-quick-view-trigger') || 
                       trigger.closest('[data-product-handle]')?.dataset.productHandle;

        if (handle) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = `/products/${handle}`;
          return;
        }
      });

      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.overlay) this.overlay.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && (this.modal.classList.contains('active') || this.modal.classList.contains('is-open'))) {
          this.close();
        }
      });

      // Handle interactive studio controls inside modal
      this.content.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('[data-studio-view]');
        if (viewBtn) {
          e.preventDefault();
          this.setStudioMode(viewBtn.dataset.studioView);
          return;
        }

        const pillBtn = e.target.closest('.variant-pill-btn');
        if (pillBtn) {
          e.preventDefault();
          this.selectVariant(pillBtn.dataset.variantId, pillBtn);
          return;
        }
      });

      // Intercept Quick View add to bag form
      this.modal.addEventListener('submit', async (e) => {
        const form = e.target.closest('.quick-view-form');
        if (!form) return;
        e.preventDefault();

        const submitBtn = form.querySelector('.quick-view-submit, .studio-btn-add');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner"></span> ADDING...';
        }

        try {
          const formData = new FormData(form);
          const res = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.description || 'Could not add to bag');
          }

          const addedItem = await res.json();
          this.close();
          if (window.Laceyaan.cartDrawer) {
            await window.Laceyaan.cartDrawer.refresh();
            window.Laceyaan.cartDrawer.open();
          }
          Utils.showToast(`${addedItem.title} added to your bag`, 'success', { text: 'View Bag [ → ]', url: '/cart' });
        } catch (err) {
          Utils.showToast(err.message, 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      });
    }

    async open(handle, trigger) {
      const h = handle || trigger?.dataset?.productHandle || trigger?.getAttribute('data-quick-view-trigger') || trigger?.closest('[data-product-handle]')?.dataset?.productHandle;
      if (h) {
        window.location.href = `/products/${h}`;
        return;
      }
      const cardLink = trigger?.closest('.product-card')?.querySelector('.media-link, .card-title a');
      if (cardLink && cardLink.href) {
        window.location.href = cardLink.href;
        return;
      }
      if (!this.modal || !this.overlay) return;

      this.modal.classList.add('active', 'is-open');
      if (this.overlay) this.overlay.classList.add('active', 'is-open');
      this.modal.setAttribute('aria-hidden', 'false');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overflow-hidden');

      // 1. Check DOM for embedded product JSON (instant 0ms render, password-safe)
      const card = trigger ? trigger.closest('[data-product-handle]') : document.querySelector(`[data-product-handle="${handle}"]`);
      if (card) {
        const jsonEl = card.querySelector('.product-card-json');
        if (jsonEl && jsonEl.textContent) {
          try {
            const product = JSON.parse(jsonEl.textContent);
            this.renderProduct(product, card);
            return;
          } catch (e) {}
        }
      }

      // 2. Fallback to network request
      this.content.innerHTML = '<div class="quick-view-loading"><span class="spinner"></span><p>Initializing 3D Atelier Render...</p></div>';

      try {
        const res = await fetch(`/products/${handle}.js`);
        if (!res.ok) throw new Error('Product not found');
        const product = await res.json();
        this.renderProduct(product, card);
      } catch (err) {
        // 3. Graceful fallback from DOM card attributes if offline or password-protected
        if (card) {
          const title = card.getAttribute('data-product-title') || card.querySelector('.card-title')?.textContent?.trim() || handle;
          const img = card.querySelector('img.primary-img')?.src || '';
          this.renderProduct({
            title: title,
            handle: handle,
            featured_image: img,
            available: false,
            variants: [{ id: card.getAttribute('data-product-id') || 1, price: 0, available: false, compare_at_price: 0, title: 'Standard' }],
            tags: [],
            description: 'Slow-crafted atelier shoelaces engineered with bespoke hardware and precision weaves.'
          }, card);
        } else {
          this.content.innerHTML = '<div class="quick-view-error" style="padding: 2.5rem; text-align: center;"><p>Unable to load product preview.</p><button type="button" class="btn-primary" onclick="window.Laceyaan.quickViewModal.close()" style="margin-top: 1rem;">Close</button></div>';
        }
      }
    }

    close() {
      this.modal.classList.remove('active', 'is-open');
      if (this.overlay) this.overlay.classList.remove('active', 'is-open');
      this.modal.setAttribute('aria-hidden', 'true');
      if (this.overlay) this.overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    }

    setStudioMode(mode) {
      // Direct photo presentation only - no video, no 360, no glow dark
    }

    selectVariant(variantId, buttonEl) {
      const form = this.content.querySelector('.studio-buy-form');
      if (form) {
        const idInput = form.querySelector('input[name="id"]');
        if (idInput) idInput.value = variantId;
      }
      const buttons = this.content.querySelectorAll('.variant-pill-btn');
      buttons.forEach(b => b.classList.toggle('is-selected', b === buttonEl));
      
      const price = buttonEl.dataset.variantPrice;
      if (price) {
        const priceEl = this.content.querySelector('.price-now');
        if (priceEl) priceEl.textContent = Utils.formatMoney(price);
      }
    }

    async buyNow(variantId) {
      const buyBtn = this.content.querySelector('.studio-btn-buy');
      const originalText = buyBtn ? buyBtn.innerHTML : '';
      if (buyBtn) {
        buyBtn.disabled = true;
        buyBtn.innerHTML = '<span>CHECKING OUT...</span>';
      }
      try {
        const formData = new FormData();
        formData.append('id', variantId);
        formData.append('quantity', '1');
        const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
        if (res.ok) {
          window.location.href = '/checkout';
        } else {
          window.location.href = '/cart';
        }
      } catch (err) {
        window.location.href = '/checkout';
      } finally {
        if (buyBtn) {
          buyBtn.disabled = false;
          buyBtn.innerHTML = originalText;
        }
      }
    }

    renderProduct(product, card) {
      const firstVariant = (product.variants && product.variants[0]) || { price: 0, compare_at_price: 0, available: false, id: product.id };
      const hasVariants = product.variants && product.variants.length > 1;
      
      const isSoldOut = !product.available || (product.variants && product.variants.every(v => !v.available));
      const tagsStr = (Array.isArray(product.tags) ? product.tags.join(' ') : String(product.tags || '')).toLowerCase();

      const comparePrice = firstVariant.compare_at_price > firstVariant.price 
        ? `<s class="price-was" style="margin-left: 0.5rem; color: #8C8880; font-size: 0.9em; text-decoration: line-through;">${Utils.formatMoney(firstVariant.compare_at_price)}</s>` 
        : '';

      const featuredImg = product.featured_image || (product.images && product.images[0]) || '';

      this.content.innerHTML = `
        <div class="studio-modal-grid">
          <!-- Left Column: Direct High-Resolution Product Still Photography -->
          <div class="studio-viewport-col">
            <div class="studio-viewport" id="StudioModalViewport" style="background: #F4F1EA; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 420px; padding: 1.5rem;">
              <img src="${featuredImg}" alt="${product.title}" class="studio-stills-img primary-img" width="600" height="600" loading="eager" style="max-width: 100%; height: auto; object-fit: contain; display: block; border-radius: 6px;">
            </div>
          </div>

          <!-- Right Column: Product Intelligence & Buying / Voting Panel -->
          <div class="studio-details-col" data-product-handle="${product.handle}" data-product-title="${product.title}">
            <div class="studio-eyebrow-row">
              <span class="studio-craft-badge">LACEYAAN ATELIER // LUXURY ACCESSORIES</span>
              <span class="badge badge-dark">IN STOCK</span>
            </div>

            <h2 class="studio-product-title">${product.title}</h2>

            <div class="studio-price-block">
              <span class="price-now">${Utils.formatMoney(firstVariant.price)}</span>
              ${comparePrice}
              ${firstVariant.compare_at_price > firstVariant.price ? `<span class="badge badge-sale">SAVE ${Math.round((firstVariant.compare_at_price - firstVariant.price) * 100 / firstVariant.compare_at_price)}%</span>` : ''}
            </div>

            <div class="studio-desc-text">
              ${product.description ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 260) + '...' : 'Atelier slow-crafted shoelaces engineered with solid CNC milled brass hardware, bespoke aglets, and precision weaves.'}
            </div>

              <!-- In Stock Add to Bag & Buy Now Form -->
              <form action="/cart/add" method="post" class="quick-view-form studio-buy-form">
                <input type="hidden" name="id" value="${firstVariant.id}">
                
                ${hasVariants ? `
                  <div class="studio-variants-wrap" style="margin: 1.25rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
                      <span class="studio-option-label">SELECT LENGTH</span>
                      <button type="button" class="studio-guide-btn" onclick="document.getElementById('portal-modal-calculator')?.classList.add('is-open')" style="background: none; border: none; font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent-gold-dark); text-decoration: underline; cursor: pointer; padding: 0;">Size Guide &bull; Calculator</button>
                    </div>
                    <div class="studio-variant-pills">
                      ${product.variants.map((v, idx) => `
                        <button 
                          type="button" 
                          class="variant-pill-btn ${idx === 0 ? 'is-selected' : ''}" 
                          data-variant-id="${v.id}"
                          data-variant-price="${v.price}"
                          data-variant-available="${v.available}"
                        >
                          <span>${v.title}</span>
                        </button>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                <div class="studio-actions-row" style="display: flex; gap: 0.65rem; margin-top: 1.25rem;">
                  <button type="submit" class="btn-primary studio-btn-add" style="flex: 1; padding: 0.85rem 1rem;">
                    <span>ADD TO BAG</span>
                  </button>
                  <button type="button" class="btn-secondary studio-btn-buy" onclick="window.Laceyaan.quickViewModal.buyNow('${firstVariant.id}')" style="flex: 1; padding: 0.85rem 1rem;">
                    <span>BUY NOW</span>
                  </button>
                </div>
              </form>

            <div class="studio-full-page-link" style="margin-top: 1.35rem; padding-top: 1rem; border-top: 1px solid rgba(20,19,17,0.08); text-align: center;">
              <a href="/products/${product.handle}" class="link-view-full-page" style="font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.12em; color: #141311; text-transform: uppercase; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>View Full Atelier Spec Sheet</span>
                <span>[ &rarr; ]</span>
              </a>
            </div>
          </div>
        </div>
      `;


    }
  }

  /* ==========================================================================
     8b. Main Product Detail Page Bluorng Editorial Gallery & Lightbox Suite
     - Direct Picture Navigation & Carousel Controls ("go through all the pictures")
     - Fullscreen Image Lightbox Modal with Arrow & Keyboard Navigation
     - Wishlist Bookmark Toggle
     - Size Guide Modal
     - Bluorng Streetwear Tabs
     ========================================================================== */
  class ProductGalleryController {
    constructor() {
      this.galleryGrid = document.getElementById('BluorngEditorialGrid');
      this.cards = document.querySelectorAll('.gallery-item-card');
      this.counterPill = document.getElementById('GalleryCounterPill');
      this.zoomTrigger = document.getElementById('GalleryZoomTrigger');
      this.prevBtn = document.getElementById('GalleryPrevBtn');
      this.nextBtn = document.getElementById('GalleryNextBtn');
      this.dots = document.querySelectorAll('.carousel-dot');
      this.thumbs = document.querySelectorAll('.thumb-dock-pill, .gallery-thumb-btn');

      // Lightbox elements
      this.lightbox = document.getElementById('GalleryLightboxModal');
      this.lightboxImg = document.getElementById('LightboxActiveImg');
      this.lightboxCounter = document.getElementById('LightboxCounter');
      this.lightboxPrev = document.getElementById('LightboxPrevBtn');
      this.lightboxNext = document.getElementById('LightboxNextBtn');
      this.lightboxClose = document.getElementById('LightboxCloseBtn');
      this.lightboxOverlay = document.getElementById('LightboxOverlay');
      this.lightboxThumbsStrip = document.getElementById('LightboxThumbsStrip');
      this.lightboxZoomBtn = document.getElementById('LightboxZoomBtn');
      this.zoomLevelText = document.getElementById('ZoomLevelText');
      this.lightboxImageWrap = document.getElementById('LightboxImageWrap');

      // Zoom & Gesture state for Mobile & Desktop
      this.zoomScale = 1;
      this.panX = 0;
      this.panY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.initialDistance = 0;
      this.initialScale = 1;
      this.lastTap = 0;
      this.touchStartX = 0;
      this.touchStartY = 0;

      // Card controls
      this.bookmarkBtn = document.getElementById('WishlistBookmarkBtn');
      this.sizeGuideBtn = document.getElementById('OpenSizeGuideBtn');
      this.sizeGuideModal = document.getElementById('SizeGuideModal');
      this.sizeGuideClose = document.getElementById('SizeGuideCloseBtn');
      this.sizeGuideBackdrop = document.getElementById('SizeGuideBackdrop');
      this.tabBtns = document.querySelectorAll('.tab-nav-btn');

      this.currentIndex = 0;
      this.imagesList = [];

      this.initImageList();
      this.bindEvents();
      this.initTabs();
      this.initSizeGuide();
      this.initBookmark();
    }

    initImageList() {
      this.imagesList = [];
      if (this.cards.length > 0) {
        this.cards.forEach((card, idx) => {
          const img = card.querySelector('img');
          const fullUrl = card.dataset.fullUrl || (img ? img.src : '');
          const thumbUrl = img ? img.src : fullUrl;
          this.imagesList.push({
            index: idx,
            fullUrl: fullUrl,
            thumbUrl: thumbUrl,
            alt: img ? img.alt : ''
          });
        });
      } else {
        const thumbBtns = document.querySelectorAll('.gallery-thumb-btn, [data-media-url]');
        if (thumbBtns.length > 0) {
          thumbBtns.forEach((btn, idx) => {
            const url = btn.dataset.mediaUrl || (btn.querySelector('img') ? btn.querySelector('img').src : '');
            if (url) {
              this.imagesList.push({
                index: idx,
                fullUrl: url,
                thumbUrl: url,
                alt: ''
              });
            }
          });
        }
        if (this.imagesList.length === 0) {
          const mainImg = document.getElementById('ProductMainImage');
          if (mainImg) {
            this.imagesList.push({
              index: 0,
              fullUrl: mainImg.src,
              thumbUrl: mainImg.src,
              alt: mainImg.alt || ''
            });
          }
        }
      }

      this.ensureHeroArrows();
      this.updateCounter();
    }

    ensureHeroArrows() {
      if (this.imagesList.length <= 1) return;
      let prevArrow = document.getElementById('HeroPrevArrow');
      let nextArrow = document.getElementById('HeroNextArrow');

      if (!prevArrow || !nextArrow) {
        const host = document.querySelector('.gallery-item-card.is-hero-item') ||
                     document.getElementById('ProductMainImageWrap') ||
                     document.getElementById('ProductPageGalleryViewport') ||
                     document.querySelector('.main-gallery-viewport');
        if (host) {
          host.style.position = 'relative';
          if (!prevArrow) {
            prevArrow = document.createElement('button');
            prevArrow.type = 'button';
            prevArrow.className = 'hero-nav-arrow hero-prev-arrow';
            prevArrow.id = 'HeroPrevArrow';
            prevArrow.setAttribute('aria-label', 'Previous photo');
            prevArrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
            host.appendChild(prevArrow);
          }
          if (!nextArrow) {
            nextArrow = document.createElement('button');
            nextArrow.type = 'button';
            nextArrow.className = 'hero-nav-arrow hero-next-arrow';
            nextArrow.id = 'HeroNextArrow';
            nextArrow.setAttribute('aria-label', 'Next photo');
            nextArrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
            host.appendChild(nextArrow);
          }
        }
      }

      if (prevArrow && !prevArrow.dataset.bound) {
        prevArrow.dataset.bound = 'true';
        prevArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.goToSlide(this.currentIndex - 1);
        });
      }
      if (nextArrow && !nextArrow.dataset.bound) {
        nextArrow.dataset.bound = 'true';
        nextArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.goToSlide(this.currentIndex + 1);
        });
      }
    }

    bindEvents() {
      // 1. Click on card or expand button opens fullscreen lightbox
      this.cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('#HeroPrevArrow') || e.target.closest('#HeroNextArrow')) return;
          e.preventDefault();
          const targetIdx = card.classList.contains('is-hero-item') ? this.currentIndex : idx;
          this.openLightbox(targetIdx);
        });
      });

      // Also allow clicking directly on main product image if separate
      const mainProductImg = document.getElementById('ProductMainImage');
      if (mainProductImg) {
        mainProductImg.addEventListener('click', (e) => {
          if (e.target.closest('#HeroPrevArrow') || e.target.closest('#HeroNextArrow')) return;
          e.preventDefault();
          this.openLightbox(this.currentIndex);
        });
      }

      // 2. Zoom button opens lightbox
      if (this.zoomTrigger) {
        this.zoomTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.openLightbox(this.currentIndex);
        });
      }

      // 3. Carousel Next/Prev buttons on page
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.goToSlide(this.currentIndex - 1);
        });
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.goToSlide(this.currentIndex + 1);
        });
      }

      // 3b. Hero image arrows (overlay arrows on the main portrait card)
      const heroPrevArrow = document.getElementById('HeroPrevArrow');
      const heroNextArrow = document.getElementById('HeroNextArrow');
      if (heroPrevArrow) {
        heroPrevArrow.addEventListener('click', (e) => {
          e.stopPropagation(); // Don't open lightbox
          e.preventDefault();
          this.goToSlide(this.currentIndex - 1);
        });
      }
      if (heroNextArrow) {
        heroNextArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.goToSlide(this.currentIndex + 1);
        });
      }

      // 4. Dot navigation
      this.dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          this.goToSlide(idx);
        });
      });

      // 5. Thumbnail dock buttons & Swatch cards
      this.thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', (e) => {
          e.preventDefault();
          const targetIdx = thumb.dataset.thumbIndex !== undefined ? parseInt(thumb.dataset.thumbIndex, 10) : idx;
          this.goToSlide(targetIdx);

          const colorTitle = thumb.dataset.colorTitle;
          const selectedColorLabel = document.getElementById('SelectedColorLabel');
          if (selectedColorLabel && colorTitle) {
            selectedColorLabel.textContent = colorTitle;
          }

          // If legacy single image viewport exists, switch image src
          const mediaUrl = thumb.dataset.mediaUrl;
          const mainImg = document.getElementById('ProductMainImage');
          if (mediaUrl && mainImg) {
            mainImg.src = mediaUrl;
            mainImg.removeAttribute('srcset');
          }
        });
      });

      // 6. Scroll tracking on mobile carousel to update counter and dots
      if (this.galleryGrid) {
        let scrollTimeout;
        this.galleryGrid.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const scrollLeft = this.galleryGrid.scrollLeft;
            const cardWidth = this.cards[0] ? this.cards[0].offsetWidth : window.innerWidth;
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.imagesList.length) {
              this.currentIndex = newIndex;
              this.updateCounter();
              this.updateActiveDot();
              this.thumbs.forEach((t, i) => {
                t.classList.toggle('active', i === newIndex);
              });
              if (this.thumbs[newIndex]) {
                this.thumbs[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }
          }, 60);
        }, { passive: true });
      }

      // 7. Lightbox controls
      if (this.lightboxClose) {
        this.lightboxClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeLightbox();
        });
      }
      if (this.lightboxOverlay) {
        this.lightboxOverlay.addEventListener('click', (e) => {
          if (this.zoomScale > 1) {
            this.resetZoom();
          } else {
            this.closeLightbox();
          }
        });
      }
      if (this.lightboxPrev) {
        this.lightboxPrev.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.lightboxStep(-1);
        });
      }
      if (this.lightboxNext) {
        this.lightboxNext.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.lightboxStep(1);
        });
      }

      // Zoom Toggle button (in top right of lightbox)
      if (this.lightboxZoomBtn) {
        this.lightboxZoomBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleZoom();
        });
      }

      // Fullscreen touch gestures: Pinch-to-zoom, Pan, and Swipe navigation
      if (this.lightboxImageWrap && this.lightboxImg) {
        // Double-tap zoom on active image
        this.lightboxImg.addEventListener('click', (e) => {
          const now = Date.now();
          if (now - this.lastTap < 320) {
            e.preventDefault();
            this.toggleZoom(e);
          }
          this.lastTap = now;
        });

        // Touch event handlers for mobile gestures
        this.lightboxImageWrap.addEventListener('touchstart', (e) => {
          if (e.touches.length === 2) {
            // Pinch to zoom start
            this.initialDistance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            this.initialScale = this.zoomScale;
          } else if (e.touches.length === 1) {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            if (this.zoomScale > 1) {
              this.isDragging = true;
              this.dragStartX = e.touches[0].clientX - this.panX;
              this.dragStartY = e.touches[0].clientY - this.panY;
              this.lightboxImg.classList.add('is-dragging');
            }
          }
        }, { passive: false });

        this.lightboxImageWrap.addEventListener('touchmove', (e) => {
          if (e.touches.length === 2 && this.initialDistance > 0) {
            e.preventDefault();
            const currentDist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            const scaleFactor = currentDist / this.initialDistance;
            const newScale = Math.min(Math.max(this.initialScale * scaleFactor, 1), 4);
            this.setZoom(newScale, this.panX, this.panY);
          } else if (e.touches.length === 1 && this.isDragging && this.zoomScale > 1) {
            e.preventDefault();
            this.panX = e.touches[0].clientX - this.dragStartX;
            this.panY = e.touches[0].clientY - this.dragStartY;
            this.applyZoomTransform();
          }
        }, { passive: false });

        this.lightboxImageWrap.addEventListener('touchend', (e) => {
          if (this.isDragging) {
            this.isDragging = false;
            if (this.lightboxImg) this.lightboxImg.classList.remove('is-dragging');
          }

          // If single finger swipe left/right while unzoomed
          if (this.zoomScale === 1 && e.changedTouches && e.changedTouches.length === 1) {
            const diffX = e.changedTouches[0].clientX - this.touchStartX;
            const diffY = e.changedTouches[0].clientY - this.touchStartY;
            if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
              if (diffX < 0) {
                this.lightboxStep(1); // Swipe left -> Next photo
              } else {
                this.lightboxStep(-1); // Swipe right -> Previous photo
              }
            }
          }
        });

        // Desktop mouse drag to pan when zoomed
        this.lightboxImageWrap.addEventListener('mousedown', (e) => {
          if (this.zoomScale > 1 && e.button === 0) {
            e.preventDefault();
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
            this.lightboxImg.classList.add('is-dragging');
          }
        });

        window.addEventListener('mousemove', (e) => {
          if (this.isDragging && this.zoomScale > 1) {
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.applyZoomTransform();
          }
        });

        window.addEventListener('mouseup', () => {
          if (this.isDragging) {
            this.isDragging = false;
            if (this.lightboxImg) this.lightboxImg.classList.remove('is-dragging');
          }
        });
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.lightbox || !this.lightbox.classList.contains('is-open')) return;
        if (e.key === 'ArrowLeft') this.lightboxStep(-1);
        else if (e.key === 'ArrowRight') this.lightboxStep(1);
        else if (e.key === 'Escape') this.closeLightbox();
      });
    }

    goToSlide(index) {
      const total = this.imagesList.length;
      if (total === 0) return;
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;

      this.currentIndex = index;
      this.updateCounter();
      this.updateActiveDot();

      // On desktop: update the hero card image to reflect current selection
      // so the arrows visually navigate through images within the hero portrait
      const heroCard = document.querySelector('.gallery-item-card.is-hero-item');
      const heroImg = heroCard ? heroCard.querySelector('.gallery-editorial-img') : null;
      const targetUrl = this.imagesList[index] ? (this.imagesList[index].thumbUrl || this.imagesList[index].fullUrl) : null;
      if (heroImg && targetUrl) {
        heroImg.src = targetUrl;
        heroImg.removeAttribute('srcset');
      }

      // Also support legacy main product image (#ProductMainImage)
      const legacyMainImg = document.getElementById('ProductMainImage');
      if (legacyMainImg && targetUrl) {
        legacyMainImg.src = targetUrl;
        legacyMainImg.removeAttribute('srcset');
      }

      // Also highlight the active card in the grid
      this.cards.forEach((c, i) => c.classList.toggle('active', i === index));

      // Scroll card into view smoothly (mobile carousel)
      if (this.cards[index] && window.innerWidth <= 860) {
        this.cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      // Highlight active thumb
      this.thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === index);
      });
      if (this.thumbs[index] && window.innerWidth <= 860) {
        this.thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    updateCounter() {
      const total = this.imagesList.length || 1;
      const displayIndex = (this.currentIndex + 1);
      if (this.counterPill) {
        this.counterPill.textContent = `${displayIndex} / ${total}`;
      }
      if (this.lightboxCounter) {
        this.lightboxCounter.textContent = `${displayIndex} / ${total}`;
      }

      // Update sleek horizontal slider progress bar
      const progressIndicator = document.getElementById('GalleryProgressIndicator');
      if (progressIndicator) {
        progressIndicator.style.width = `${100 / total}%`;
        progressIndicator.style.transform = `translateX(${this.currentIndex * 100}%)`;
      }

      // Update selected color label if present
      const selectedColorLabel = document.getElementById('SelectedColorLabel');
      if (selectedColorLabel && this.imagesList[this.currentIndex] && this.imagesList[this.currentIndex].alt) {
        selectedColorLabel.textContent = this.imagesList[this.currentIndex].alt;
      }
    }

    updateActiveDot() {
      this.dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }

    /* ── FULLSCREEN LIGHTBOX MODAL & ZOOM ENGINE ── */
    openLightbox(index) {
      if (!this.lightbox || this.imagesList.length === 0) return;

      // Ensure lightbox is attached to document.body to break free from any stacking contexts
      if (this.lightbox.parentElement !== document.body) {
        document.body.appendChild(this.lightbox);
      }

      const total = this.imagesList.length;
      if (index < 0) index = 0;
      if (index >= total) index = total - 1;

      this.currentIndex = index;
      this.resetZoom();
      this.renderLightboxThumbs();
      this.setLightboxImage(this.currentIndex);

      this.lightbox.classList.add('is-open');
      this.lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
      if (!this.lightbox) return;
      this.resetZoom();
      this.lightbox.classList.remove('is-open');
      this.lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.goToSlide(this.currentIndex);
    }

    lightboxStep(delta) {
      const total = this.imagesList.length;
      if (total <= 1) return;
      let nextIdx = this.currentIndex + delta;
      if (nextIdx < 0) nextIdx = total - 1;
      if (nextIdx >= total) nextIdx = 0;
      this.currentIndex = nextIdx;
      this.resetZoom();
      this.setLightboxImage(this.currentIndex);
    }

    setZoom(scale, x = 0, y = 0) {
      this.zoomScale = Math.min(Math.max(scale, 1), 4);
      if (this.zoomScale === 1) {
        this.panX = 0;
        this.panY = 0;
      } else {
        this.panX = x;
        this.panY = y;
      }
      this.applyZoomTransform();
    }

    toggleZoom(e) {
      if (this.zoomScale <= 1.05) {
        this.setZoom(2.5, 0, 0);
      } else if (this.zoomScale < 3.2) {
        this.setZoom(3.5, 0, 0);
      } else {
        this.resetZoom();
      }
    }

    resetZoom() {
      this.zoomScale = 1;
      this.panX = 0;
      this.panY = 0;
      this.isDragging = false;
      this.applyZoomTransform();
    }

    applyZoomTransform() {
      if (!this.lightboxImg) return;
      if (this.zoomScale > 1) {
        this.lightboxImg.classList.add('is-zoomed');
        this.lightboxImg.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
      } else {
        this.lightboxImg.classList.remove('is-zoomed');
        this.lightboxImg.style.transform = 'translate(0px, 0px) scale(1)';
      }
      if (this.zoomLevelText) {
        const rounded = Math.round(this.zoomScale * 10) / 10;
        this.zoomLevelText.textContent = `${rounded}x`;
      }
    }

    setLightboxImage(index) {
      const item = this.imagesList[index];
      if (!item || !this.lightboxImg) return;

      this.resetZoom();
      this.lightboxImg.style.opacity = '0.35';
      setTimeout(() => {
        this.lightboxImg.src = item.fullUrl;
        this.lightboxImg.alt = item.alt || 'Product image';
        this.lightboxImg.style.opacity = '1';
        this.resetZoom();
      }, 80);

      this.updateCounter();

      // Highlight active thumbnail in lightbox strip
      if (this.lightboxThumbsStrip) {
        const thumbButtons = this.lightboxThumbsStrip.querySelectorAll('.lightbox-thumb-item');
        thumbButtons.forEach((btn, i) => {
          btn.classList.toggle('active', i === index);
        });
      }
    }

    renderLightboxThumbs() {
      if (!this.lightboxThumbsStrip) return;
      this.lightboxThumbsStrip.innerHTML = '';
      if (this.imagesList.length <= 1) return;

      this.imagesList.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `lightbox-thumb-item${idx === this.currentIndex ? ' active' : ''}`;
        btn.setAttribute('aria-label', `View photo ${idx + 1}`);
        const img = document.createElement('img');
        img.src = item.thumbUrl;
        img.alt = `Thumbnail ${idx + 1}`;
        btn.appendChild(img);

        btn.addEventListener('click', () => {
          this.currentIndex = idx;
          this.setLightboxImage(idx);
        });

        this.lightboxThumbsStrip.appendChild(btn);
      });
    }

    /* ── BLUORNG CARD TABS ── */
    initTabs() {
      this.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.tabTarget;
          this.tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const tabPanes = document.querySelectorAll('.tab-pane');
          tabPanes.forEach(pane => {
            if (pane.id === targetId) {
              pane.removeAttribute('hidden');
              pane.classList.add('active');
            } else {
              pane.setAttribute('hidden', '');
              pane.classList.remove('active');
            }
          });
        });
      });
    }

    /* ── SIZE GUIDE MODAL ── */
    initSizeGuide() {
      if (this.sizeGuideBtn && this.sizeGuideModal) {
        this.sizeGuideBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.sizeGuideModal.classList.add('is-open');
          this.sizeGuideModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        });

        const closeGuide = () => {
          this.sizeGuideModal.classList.remove('is-open');
          this.sizeGuideModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        };

        if (this.sizeGuideClose) this.sizeGuideClose.addEventListener('click', closeGuide);
        if (this.sizeGuideBackdrop) this.sizeGuideBackdrop.addEventListener('click', closeGuide);
      }
    }

    /* ── WISHLIST BOOKMARK ── */
    initBookmark() {
      if (!this.bookmarkBtn) return;
      const productTitle = document.querySelector('.card-product-title, .product-page-title');
      const key = 'laceyaan_saved_' + (productTitle ? productTitle.textContent.trim().toLowerCase().replace(/\s+/g, '-') : 'product');

      if (localStorage.getItem(key) === 'true') {
        this.bookmarkBtn.classList.add('is-bookmarked');
      }

      this.bookmarkBtn.addEventListener('click', () => {
        const isSaved = this.bookmarkBtn.classList.toggle('is-bookmarked');
        localStorage.setItem(key, isSaved ? 'true' : 'false');
      });
    }

    /* ── EXTERNAL VARIANT SWITCHER COMPATIBILITY ── */
    setImage(url) {
      if (!url) return;
      const cleanUrl = url.split('?')[0];

      // Find matching card index
      let matchIdx = -1;
      this.imagesList.forEach((item, idx) => {
        if (item.fullUrl.split('?')[0] === cleanUrl || item.thumbUrl.split('?')[0] === cleanUrl) {
          matchIdx = idx;
        }
      });

      if (matchIdx !== -1) {
        this.goToSlide(matchIdx);
      } else {
        const mainImg = document.getElementById('ProductMainImage');
        if (mainImg) {
          mainImg.src = url;
          mainImg.removeAttribute('srcset');
        }
      }
    }
  }


  /* ==========================================================================
     8c. Mobile Sticky Add-to-Bag Controller (PDP)
     ========================================================================== */
  class MobileStickyBuyBar {
    constructor() {
      this.bar = document.getElementById('mobile-sticky-buy-bar');
      if (!this.bar) return;

      this.mainBtn = document.querySelector('.main-product-section .btn-add-to-cart, .main-product-section [data-add-to-cart-button], .main-product-section form[action*="/cart/add"] button[type="submit"]');
      this.stickyBtn = document.getElementById('StickyAddToCartBtn');
      this.priceEl = document.getElementById('StickyBarPrice');

      this.init();
    }

    init() {
      if (this.mainBtn) {
        window.addEventListener('scroll', () => {
          const rect = this.mainBtn.getBoundingClientRect();
          if (rect.bottom < 0) {
            this.bar.classList.add('is-visible');
            this.bar.setAttribute('aria-hidden', 'false');
          } else {
            this.bar.classList.remove('is-visible');
            this.bar.setAttribute('aria-hidden', 'true');
          }
        }, { passive: true });
      }

      if (this.stickyBtn) {
        this.stickyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.mainBtn && !this.mainBtn.disabled) {
            this.mainBtn.click();
          } else {
            const form = document.querySelector('form[action*="/cart/add"]');
            if (form) {
              const submitEvt = new Event('submit', { cancelable: true, bubbles: true });
              form.dispatchEvent(submitEvt);
            }
          }
        });
      }
    }
  }

  /* ==========================================================================
     9. Accordions (FAQ & Spec Sheets)
     ========================================================================== */
  class Accordion {
    constructor() {
      this.accordions = document.querySelectorAll('[data-accordion]');
      this.accordions.forEach(acc => {
        const triggers = acc.querySelectorAll('[data-accordion-trigger]');
        triggers.forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('[data-accordion-item]');
            const isOpen = item.classList.contains('is-open');

            // Close siblings if single mode
            if (acc.dataset.accordion === 'single') {
              acc.querySelectorAll('[data-accordion-item]').forEach(i => i.classList.remove('is-open'));
            }

            item.classList.toggle('is-open', !isOpen);
            trigger.setAttribute('aria-expanded', !isOpen);
          });
        });
      });
    }
  }

  /* ==========================================================================
     10. Easter Egg Secret Modal & "DONT CLICK HERE" Action
     ========================================================================== */
  class EasterEggModal {
    constructor() {
      this.modal = document.getElementById('EasterEggModal');
      this.trigger = document.getElementById('DontClickHereBtn');
      this.codePill = document.getElementById('SecretCodePill');
      this.copyHint = document.getElementById('SecretCopyHint');

      if (!this.modal || !this.trigger) return;
      this.init();
    }

    init() {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });

      this.modal.querySelectorAll('[data-secret-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.modal.hasAttribute('hidden')) {
          this.close();
        }
      });

      if (this.codePill) {
        this.codePill.addEventListener('click', () => this.copyCode());
      }
    }

    open() {
      this.modal.removeAttribute('hidden');
      document.body.classList.add('overflow-hidden');
    }

    close() {
      this.modal.setAttribute('hidden', '');
      document.body.classList.remove('overflow-hidden');
    }

    async copyCode() {
      const code = this.codePill.dataset.code || 'LACEYAAN10';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = code;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        if (this.copyHint) {
          const original = this.copyHint.textContent;
          this.copyHint.textContent = `✓ COPIED ${code} TO CLIPBOARD!`;
          this.copyHint.style.color = '#10B981';
          setTimeout(() => {
            this.copyHint.textContent = original;
            this.copyHint.style.color = '';
          }, 3500);
        }

        Utils.showToast(`Secret code ${code} copied to clipboard! 10% OFF unlocked.`, 'success');
      } catch (err) {
        Utils.showToast(`Code: ${code}`, 'info');
      }
    }
  }

  /* ==========================================================================
     11. Studio Exploration Portals & Interactive Modals
     ========================================================================== */
  class PortalModals {
    constructor() {
      this.backdrop = document.getElementById('portal-modal-backdrop');
      this.calcModal = document.getElementById('portal-calculator-modal');
      this.lookbookModal = document.getElementById('portal-lookbook-modal');
      this.storyModal = document.getElementById('portal-story-modal');
      this.activeModal = null;

      // Sizing Matrix for Interactive Calculator Modal
      this.calcMatrix = {
        4: {
          standard: { inches: '36"', cm: '90 cm', text: 'Tailored for 4-eyelet silhouettes and low-profile oxfords. Delivers neat, compact bow loops that sit cleanly on the vamp without dragging.' },
          loose: { inches: '32"', cm: '80 cm', text: 'Ultra-clean untied drape for 4-eyelet pairs. Aglets hang naturally with zero slack.' }
        },
        5: {
          standard: { inches: '45"', cm: '114 cm', text: 'Classic specification for 5-eyelet silhouettes (Air Force 1 Low, Stan Smith). Provides a balanced, symmetrical bow.' },
          loose: { inches: '36"', cm: '90 cm', text: 'Relaxed streetwear drape for 5-eyelet kicks. Tips exit top eyelets with effortless hanging drape.' }
        },
        6: {
          standard: { inches: '54"', cm: '137 cm', text: 'The gold standard length for 6-eyelet retro court shoes, Dunk Lows, and Jordan 1 Lows. Guaranteed proportional bow knot.' },
          loose: { inches: '45"', cm: '114 cm', text: 'The collector-preferred street hang for 6-eyelet silhouettes with prominent aglet display.' }
        },
        7: {
          standard: { inches: '63"', cm: '160 cm', text: 'Precision fit for 7-eyelet mid-tops, Converse Chuck 70s, and Air Jordan 1 Mids laced through the collar.' },
          loose: { inches: '54"', cm: '137 cm', text: 'Unhindered drape for 7-eyelet sneakers leaving the top eyelet open for casual styling.' }
        },
        8: {
          standard: { inches: '72"', cm: '182 cm', text: 'Definitive length for 8-eyelet high-tops (Air Jordan 1 High OG, Forum High) and 6-inch workwear heritage boots.' },
          loose: { inches: '63"', cm: '160 cm', text: 'Iconic high-top street drape with laces resting loose through the collar.' }
        },
        9: {
          standard: { inches: '72"', cm: '182 cm', text: 'Built for tall boots and 9-eyelet extended collars. Ample length for traditional secure wrap-and-tie.' },
          loose: { inches: '63"', cm: '160 cm', text: 'Casual hanging drape on tall boots and high-cut designer silhouettes.' }
        }
      };

      this.currentSilhouette = 'low-top';
      this.currentEyelets = 6;
      this.currentDrape = 'standard';

      this.init();
    }

    init() {
      // 1. Listen for clicks on [data-portal-action] triggers
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-portal-action]');
        if (!trigger) return;

        const action = trigger.getAttribute('data-portal-action');
        if (!action) return;

        // Card 1: Calculator Modal
        if (action === 'calculator') {
          e.preventDefault();
          this.openModal(this.calcModal);
          return;
        }

        // Card 2: Lookbook Modal
        if (action === 'lookbook') {
          e.preventDefault();
          this.openModal(this.lookbookModal);
          return;
        }

        // Card 3: Transformation Studio Split Slider
        if (action === 'before-after') {
          const targetSection = document.getElementById('before-after') || 
                                document.querySelector('.before-after-section') || 
                                document.querySelector('.comparison-wrapper');
          if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetSection.style.transition = 'box-shadow 0.4s ease';
            targetSection.style.boxShadow = '0 0 0 3px #C5A880';
            setTimeout(() => {
              targetSection.style.boxShadow = '';
            }, 1800);
            return;
          }
        }

        // Card 4: Brand Story Modal
        if (action === 'story') {
          e.preventDefault();
          this.openModal(this.storyModal);
          return;
        }
      });

      // 2. Modal Close triggers
      document.querySelectorAll('[data-portal-modal-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeAll();
        });
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.closeAll();
        }
      });

      // 3. Calculator interactive controls
      this.initCalculator();
    }

    openModal(modal) {
      if (!modal) return;
      this.closeAll();

      if (this.backdrop) {
        this.backdrop.removeAttribute('hidden');
        void this.backdrop.offsetWidth;
        this.backdrop.classList.add('is-active');
      }

      modal.removeAttribute('hidden');
      void modal.offsetWidth;
      modal.classList.add('is-active');
      this.activeModal = modal;
      document.body.classList.add('overflow-hidden');
    }

    closeAll() {
      if (this.backdrop) {
        this.backdrop.classList.remove('is-active');
        setTimeout(() => {
          if (!this.activeModal && this.backdrop) {
            this.backdrop.setAttribute('hidden', '');
          }
        }, 300);
      }

      [this.calcModal, this.lookbookModal, this.storyModal].forEach(modal => {
        if (modal) {
          modal.classList.remove('is-active');
          setTimeout(() => {
            if (this.activeModal !== modal) {
              modal.setAttribute('hidden', '');
            }
          }, 300);
        }
      });

      this.activeModal = null;
      document.body.classList.remove('overflow-hidden');
    }

    initCalculator() {
      if (!this.calcModal) return;

      const silhouetteBtns = this.calcModal.querySelectorAll('#modal-silhouette-options .silhouette-pill');
      const eyeletBtns = this.calcModal.querySelectorAll('#modal-eyelet-options .eyelet-btn');
      const drapeBtns = this.calcModal.querySelectorAll('#modal-drape-options .drape-choice-btn');

      // Silhouette selection
      silhouetteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          silhouetteBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentSilhouette = btn.dataset.silhouette || 'low-top';

          // Auto-suggest eyelet count based on footwear silhouette
          const suggestedEyelets = parseInt(btn.dataset.baseEyelets, 10);
          if (suggestedEyelets) {
            eyeletBtns.forEach(b => {
              if (parseInt(b.dataset.eyelets, 10) === suggestedEyelets) {
                eyeletBtns.forEach(eb => eb.classList.remove('active'));
                b.classList.add('active');
                this.currentEyelets = suggestedEyelets;
              }
            });
          }

          this.updateCalculation();
        });
      });

      // Eyelet selection
      eyeletBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          eyeletBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentEyelets = parseInt(btn.dataset.eyelets, 10) || 6;
          this.updateCalculation();
        });
      });

      // Drape selection
      drapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          drapeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentDrape = btn.dataset.drape || 'standard';
          this.updateCalculation();
        });
      });

      this.updateCalculation();
    }

    updateCalculation() {
      if (!this.calcModal) return;

      const resultInches = this.calcModal.querySelector('#modal-result-inches');
      const resultMetric = this.calcModal.querySelector('#modal-result-metric');
      const resultReasoning = this.calcModal.querySelector('#modal-result-reasoning');
      const resultShopBtn = this.calcModal.querySelector('#modal-result-shop-btn');

      const eyeletData = this.calcMatrix[this.currentEyelets] || this.calcMatrix[6];
      const result = eyeletData[this.currentDrape] || eyeletData.standard;

      if (resultInches) resultInches.textContent = result.inches;
      if (resultMetric) resultMetric.textContent = `(${result.cm})`;
      if (resultReasoning) resultReasoning.textContent = result.text;

      if (resultShopBtn) {
        resultShopBtn.href = `/collections/all`;
        const spanEl = resultShopBtn.querySelector('span');
        if (spanEl) {
          spanEl.textContent = `Shop ${result.inches} Laces Collection`;
        }
      }
    }
  }

  /* ==========================================================================
     12. Animated Background Shoelace Engine (Dual-Strand Fluid Atelier Physics)
     ========================================================================== */
  class BackgroundLace {
    constructor() {
      this.container = document.getElementById('laceyaan-background-lace');
      this.canvas = document.getElementById('background-lace-canvas');
      if (!this.container || !this.canvas) return;
      try {
        if (window.getComputedStyle(this.container).display === 'none' || window.getComputedStyle(this.canvas).display === 'none') {
          return;
        }
      } catch (e) {}

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      if (!this.ctx) return;

      // Theme configuration & color tokens
      this.colorPrimary = this.container.dataset.colorPrimary || '#C5A880';
      this.colorSecondary = this.container.dataset.colorSecondary || '#FAF9F5';
      this.colorShadow = this.container.dataset.colorShadow || 'rgba(20, 19, 17, 0.16)';

      // Physics & Motion State
      this.width = 0;
      this.height = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.scrollY = window.scrollY || 0;
      this.targetScrollY = this.scrollY;
      this.scrollVelocity = 0;
      this.smoothedVelocity = 0;
      this.time = 0;
      this.rafId = null;
      this.isPaused = false;

      // Mouse Proximity Interaction
      this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

      // Node Systems for Dual Strands
      this.primaryPoints = [];
      this.secondaryPoints = [];

      this.init();
    }

    init() {
      this.handleResize();
      this.initNodes();

      // Bind event listeners with passive flags
      this.onScroll = this.onScroll.bind(this);
      this.onResize = this.debounce(this.handleResize.bind(this), 100);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onVisibilityChange = this.onVisibilityChange.bind(this);

      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener('mousemove', this.onMouseMove, { passive: true });
      document.addEventListener('visibilitychange', this.onVisibilityChange);

      this.animate(0);
    }

    debounce(fn, delay) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);

      this.initNodes();
    }

    initNodes() {
      // Primary Master Strand Nodes (Grand sweeping diagonal S-curves)
      this.primaryPoints = [];
      const primaryCount = 14;
      const primarySpan = this.height * 2.8;
      const primaryStepY = primarySpan / (primaryCount - 1);
      const primaryPattern = [0.06, 0.35, 0.88, 0.65, 0.16, 0.46, 0.94, 0.60, 0.10, 0.70, 0.88, 0.38, 0.14, 0.76];

      for (let i = 0; i < primaryCount; i++) {
        const baseFracX = primaryPattern[i % primaryPattern.length];
        const baseX = baseFracX * this.width;
        const baseY = -this.height * 0.45 + i * primaryStepY;

        this.primaryPoints.push({
          baseFracX,
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          phase: i * 0.62,
          frequency: 0.0014 + (i % 3) * 0.0003,
          amplitudeX: Math.min(this.width * 0.075, 65),
          amplitudeY: 22,
          waveExcitation: 0
        });
      }

      // Secondary Companion Strand Nodes (Delicate counter-weaving strand)
      this.secondaryPoints = [];
      const secondaryCount = 11;
      const secondarySpan = this.height * 2.8;
      const secondaryStepY = secondarySpan / (secondaryCount - 1);
      const secondaryPattern = [0.30, 0.72, 0.40, 0.12, 0.68, 0.90, 0.32, 0.18, 0.58, 0.82, 0.42];

      for (let i = 0; i < secondaryCount; i++) {
        const baseFracX = secondaryPattern[i % secondaryPattern.length];
        const baseX = baseFracX * this.width;
        const baseY = -this.height * 0.4 + i * secondaryStepY;

        this.secondaryPoints.push({
          baseFracX,
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          phase: (i * 0.75) + Math.PI / 3,
          frequency: 0.0016 + (i % 2) * 0.0004,
          amplitudeX: Math.min(this.width * 0.06, 50),
          amplitudeY: 18,
          waveExcitation: 0
        });
      }
    }

    onScroll() {
      this.targetScrollY = window.scrollY || window.pageYOffset || 0;
    }

    onMouseMove(e) {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;
    }

    onVisibilityChange() {
      this.isPaused = document.hidden;
      if (!this.isPaused && !this.rafId) {
        this.animate(performance.now());
      }
    }

    updatePhysics(timestamp) {
      this.time = timestamp;

      // Smooth scroll interpolation (Lerp with spring drag)
      const prevScroll = this.scrollY;
      const scrollDelta = this.targetScrollY - this.scrollY;
      this.scrollY += scrollDelta * 0.065;
      this.scrollVelocity = this.targetScrollY - prevScroll;
      this.smoothedVelocity += (this.scrollVelocity - this.smoothedVelocity) * 0.12;

      // Mouse smooth interpolation
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

      const docHeight = Math.max(1, document.documentElement.scrollHeight - this.height);
      const scrollProgress = Math.min(Math.max(this.scrollY / docHeight, 0), 1);

      // Parallax vertical progression
      const parallaxFactor = this.height * 1.35;
      const totalVerticalOffset = -(scrollProgress * parallaxFactor);

      // Update primary strand nodes
      this.updateNodeList(this.primaryPoints, totalVerticalOffset, 1.0);

      // Update secondary companion strand nodes (slight parallax delay)
      this.updateNodeList(this.secondaryPoints, totalVerticalOffset * 0.92, 0.75);
    }

    updateNodeList(points, verticalOffset, influenceMultiplier) {
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.baseX = p.baseFracX * this.width;

        // Wave excitation & Tokyo drift lateral ribbon physics when scrolling
        const driftVelocity = this.smoothedVelocity * 0.22 * influenceMultiplier;
        const driftWave = Math.sin(i * 0.48 - this.time * 0.0042 + (driftVelocity * 0.02));
        const velocityEffect = driftVelocity * driftWave;
        p.waveExcitation += (velocityEffect - p.waveExcitation) * 0.14;

        // Idle harmonic breathing oscillation
        let breathingX = 0;
        let breathingY = 0;
        if (!this.isReducedMotion) {
          breathingX = Math.sin(this.time * p.frequency + p.phase) * p.amplitudeX;
          breathingY = Math.cos(this.time * (p.frequency * 0.85) + p.phase) * p.amplitudeY;
        }

        // Mouse proximity magnetic deflection
        let mouseDisplaceX = 0;
        let mouseDisplaceY = 0;
        if (this.mouse.active && !this.isReducedMotion) {
          const dx = p.x - this.mouse.x;
          const dy = (p.y + verticalOffset) - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;
          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * (28 * influenceMultiplier);
            mouseDisplaceX = (dx / dist) * force;
            mouseDisplaceY = (dy / dist) * force;
          }
        }

        // Calculate final target coordinates
        const targetX = p.baseX + breathingX + p.waveExcitation + mouseDisplaceX;
        const targetY = p.baseY + verticalOffset + breathingY + mouseDisplaceY;

        // Spring dampening
        p.x += (targetX - p.x) * 0.12;
        p.y += (targetY - p.y) * 0.12;
      }
    }

    getSplineSegments(pts) {
      const len = pts.length;
      if (len < 3) return [];

      const interpolated = [];
      for (let i = 0; i < len - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i < len - 2 ? pts[i + 2] : p2;

        // Catmull-Rom to Cubic Bézier control points
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        interpolated.push({
          start: { x: p1.x, y: p1.y },
          cp1: { x: cp1x, y: cp1y },
          cp2: { x: cp2x, y: cp2y },
          end: { x: p2.x, y: p2.y }
        });
      }
      return interpolated;
    }

    drawPath(segments, ctx, offsetX = 0, offsetY = 0) {
      if (!segments.length) return;
      ctx.beginPath();
      ctx.moveTo(segments[0].start.x + offsetX, segments[0].start.y + offsetY);
      for (let i = 0; i < segments.length; i++) {
        const s = segments[i];
        ctx.bezierCurveTo(
          s.cp1.x + offsetX, s.cp1.y + offsetY,
          s.cp2.x + offsetX, s.cp2.y + offsetY,
          s.end.x + offsetX, s.end.y + offsetY
        );
      }
    }

    drawAglet(ctx, x, y, angle, scale = 1, isLeading = true) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const agletLen = 32 * scale;
      const agletRadius = 4.5 * scale;

      // Aglet Soft Drop Shadow
      ctx.save();
      ctx.fillStyle = 'rgba(20, 19, 17, 0.22)';
      ctx.beginPath();
      ctx.ellipse(agletLen / 2 + 2, 4, agletLen / 2, agletRadius * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Solid Milled Brass Metallic Cylinder
      const metalGrad = ctx.createLinearGradient(0, -agletRadius, 0, agletRadius);
      metalGrad.addColorStop(0.0, '#7A6242');
      metalGrad.addColorStop(0.2, '#C5A880');
      metalGrad.addColorStop(0.42, '#FFF8EE');
      metalGrad.addColorStop(0.72, '#C5A880');
      metalGrad.addColorStop(1.0, '#5A462E');

      ctx.fillStyle = metalGrad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, -agletRadius, agletLen, agletRadius * 2, [1, agletRadius, agletRadius, 1]);
      } else {
        ctx.rect(0, -agletRadius, agletLen, agletRadius * 2);
      }
      ctx.fill();

      // Aglet Milled Rings / Crimp Grooves (Signature LACEYAAN Detail)
      ctx.strokeStyle = 'rgba(55, 42, 24, 0.55)';
      ctx.lineWidth = 1.1 * scale;
      [5, 11, 20].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(offset * scale, -agletRadius + 0.5);
        ctx.lineTo(offset * scale, agletRadius - 0.5);
        ctx.stroke();

        // High specular metallic highlight next to crimp
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.moveTo((offset + 0.7) * scale, -agletRadius + 0.7);
        ctx.lineTo((offset + 0.7) * scale, agletRadius - 0.7);
        ctx.stroke();
      });

      // Hollow Aglet Metal Tip End
      ctx.fillStyle = '#261C12';
      ctx.beginPath();
      ctx.ellipse(agletLen, 0, 2 * scale, agletRadius * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic Shimmer Star Glint on Brass Aglet (Cycles with time)
      const glintPulse = Math.sin(this.time * 0.0032 + (isLeading ? 0 : Math.PI)) * 0.5 + 0.5;
      if (glintPulse > 0.25) {
        ctx.save();
        ctx.translate(agletLen * 0.55, -agletRadius * 0.35);
        ctx.rotate(this.time * 0.0012);
        ctx.fillStyle = `rgba(255, 250, 235, ${glintPulse * 0.9})`;
        
        // 4-point star flare
        const flareSize = 5.2 * scale * glintPulse;
        ctx.beginPath();
        ctx.moveTo(0, -flareSize);
        ctx.lineTo(flareSize * 0.22, -flareSize * 0.22);
        ctx.lineTo(flareSize, 0);
        ctx.lineTo(flareSize * 0.22, flareSize * 0.22);
        ctx.lineTo(0, flareSize);
        ctx.lineTo(-flareSize * 0.22, flareSize * 0.22);
        ctx.lineTo(-flareSize, 0);
        ctx.lineTo(-flareSize * 0.22, -flareSize * 0.22);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    drawWovenStitches(ctx, segments, laceWidth) {
      if (!segments.length) return;

      const stitchHalfWidth = laceWidth * 0.38;
      ctx.lineWidth = 1.25;
      ctx.lineCap = 'round';

      let sampleCounter = 0;
      for (let sIdx = 0; sIdx < segments.length; sIdx++) {
        const seg = segments[sIdx];
        const steps = 14;

        for (let step = 0; step <= steps; step++) {
          sampleCounter++;
          if (sampleCounter % 2 !== 0) continue;

          const t = step / steps;
          const mt = 1 - t;

          // Compute position along Cubic Bézier curve
          const x = mt * mt * mt * seg.start.x +
                    3 * mt * mt * t * seg.cp1.x +
                    3 * mt * t * t * seg.cp2.x +
                    t * t * t * seg.end.x;

          const y = mt * mt * mt * seg.start.y +
                    3 * mt * t * t * seg.cp1.y +
                    3 * mt * t * t * seg.cp2.y +
                    t * t * t * seg.end.y;

          // Compute Tangent Vector (Derivative)
          const dx = 3 * mt * mt * (seg.cp1.x - seg.start.x) +
                     6 * mt * t * (seg.cp2.x - seg.cp1.x) +
                     3 * t * t * (seg.end.x - seg.cp2.x);

          const dy = 3 * mt * mt * (seg.cp1.y - seg.start.y) +
                     6 * mt * t * (seg.cp2.y - seg.cp1.y) +
                     3 * t * t * (seg.end.y - seg.cp2.y);

          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 0.001) continue;

          // Normal Vector perpendicular to tangent
          const nx = -dy / len;
          const ny = dx / len;

          // Alternating chevron/braided stitch angle
          const isLeft = (sampleCounter / 2) % 2 === 0;
          const stitchColor = isLeft ? 'rgba(255, 252, 245, 0.42)' : 'rgba(65, 50, 34, 0.25)';
          const tiltFactor = isLeft ? 0.6 : -0.6;

          const startX = x - nx * stitchHalfWidth + (dx / len) * (tiltFactor * 2.2);
          const startY = y - ny * stitchHalfWidth + (dy / len) * (tiltFactor * 2.2);
          const endX = x + nx * stitchHalfWidth - (dx / len) * (tiltFactor * 2.2);
          const endY = y + ny * stitchHalfWidth - (dy / len) * (tiltFactor * 2.2);

          ctx.strokeStyle = stitchColor;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      const isMobile = this.width < 768;

      // -------------------------------------------------------------
      // 1. Render Secondary Ethereal Ribbon Strand (Background depth)
      // -------------------------------------------------------------
      const secondarySegments = this.getSplineSegments(this.secondaryPoints);
      if (secondarySegments.length) {
        const secLaceWidth = isMobile ? 3.8 : 5.8;

        // Secondary ambient glow
        ctx.save();
        ctx.strokeStyle = 'rgba(197, 168, 128, 0.12)';
        ctx.lineWidth = secLaceWidth + 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        this.drawPath(secondarySegments, ctx, 0, 0);
        ctx.stroke();
        ctx.restore();

        // Secondary strand body
        ctx.save();
        const secGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
        secGrad.addColorStop(0.0, 'rgba(197, 168, 128, 0.35)');
        secGrad.addColorStop(0.5, 'rgba(250, 249, 245, 0.55)');
        secGrad.addColorStop(1.0, 'rgba(163, 135, 96, 0.35)');

        ctx.strokeStyle = secGrad;
        ctx.lineWidth = secLaceWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        this.drawPath(secondarySegments, ctx, 0, 0);
        ctx.stroke();
        ctx.restore();

        // Secondary aglet cap
        const lastSec = secondarySegments[secondarySegments.length - 1];
        if (lastSec) {
          const dx = lastSec.end.x - lastSec.cp2.x;
          const dy = lastSec.end.y - lastSec.cp2.y;
          const angle = Math.atan2(dy, dx);
          this.drawAglet(ctx, lastSec.end.x, lastSec.end.y, angle, isMobile ? 0.6 : 0.8, true);
        }
      }

      // -------------------------------------------------------------
      // 2. Render Primary Atelier Shoelace Strand
      // -------------------------------------------------------------
      const primarySegments = this.getSplineSegments(this.primaryPoints);
      if (!primarySegments.length) return;

      const laceWidth = isMobile ? 7.5 : 11;
      const agletScale = isMobile ? 0.95 : 1.25;

      // Pass 1: Soft Ambient Drop Shadow for Photorealistic Depth
      ctx.save();
      ctx.strokeStyle = this.colorShadow;
      ctx.lineWidth = laceWidth + (isMobile ? 5 : 8);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      this.drawPath(primarySegments, ctx, 4, 10);
      ctx.stroke();
      ctx.restore();

      // Pass 2: Warm Gold Ambient Glow / Halo
      ctx.save();
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.18)';
      ctx.lineWidth = laceWidth + (isMobile ? 8 : 14);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      this.drawPath(primarySegments, ctx, 0, 0);
      ctx.stroke();
      ctx.restore();

      // Pass 3: Main Shoelace Tubular Woven Core
      ctx.save();
      const mainGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
      mainGrad.addColorStop(0.0, '#C5A880'); // Atelier Gold
      mainGrad.addColorStop(0.2, '#FAF9F5'); // Japanese Combed Cotton Specular
      mainGrad.addColorStop(0.45, '#A38760'); // Dark Gold Weave
      mainGrad.addColorStop(0.7, '#FFF8EE'); // Champagne Sheen
      mainGrad.addColorStop(1.0, '#8C704B'); // Rich Bronze Core

      ctx.strokeStyle = mainGrad;
      ctx.lineWidth = laceWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      this.drawPath(primarySegments, ctx, 0, 0);
      ctx.stroke();

      // Pass 4: Micro-Braided Stitch Texture
      this.drawWovenStitches(ctx, primarySegments, laceWidth);
      ctx.restore();

      // Pass 5: Solid Milled Brass Aglet Caps at Endpoints
      const firstSeg = primarySegments[0];
      const lastSeg = primarySegments[primarySegments.length - 1];

      // Leading Aglet (at end of spline)
      if (lastSeg) {
        const dx = lastSeg.end.x - lastSeg.cp2.x;
        const dy = lastSeg.end.y - lastSeg.cp2.y;
        const angle = Math.atan2(dy, dx);
        this.drawAglet(ctx, lastSeg.end.x, lastSeg.end.y, angle, agletScale, true);
      }

      // Trailing Aglet (at start of spline)
      if (firstSeg) {
        const dx = firstSeg.start.x - firstSeg.cp1.x;
        const dy = firstSeg.start.y - firstSeg.cp1.y;
        const angle = Math.atan2(dy, dx);
        this.drawAglet(ctx, firstSeg.start.x, firstSeg.start.y, angle, agletScale, false);
      }
    }

    animate(timestamp) {
      if (this.isPaused) return;

      this.updatePhysics(timestamp);
      this.render();

      this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  /* ==========================================================================
     Hero Video Showcase (Highlights of Drop 01)
     ========================================================================== */
  class HeroVideoShowcase {
    constructor() {
      this.video = document.getElementById('hero-bg-video') || document.getElementById('drop01-hero-video');
      this.soundBtn = document.getElementById('hero-sound-toggle') || document.getElementById('drop01-sound-toggle');
      this.playBtn = document.getElementById('drop01-play-toggle');
      this.soundLabel = document.getElementById('hero-sound-label') || document.getElementById('sound-btn-label');
      this.iconSoundOff = this.soundBtn ? this.soundBtn.querySelector('.icon-sound-off') : null;
      this.iconSoundOn = this.soundBtn ? this.soundBtn.querySelector('.icon-sound-on') : null;
      this.iconPlay = this.playBtn ? this.playBtn.querySelector('.icon-play') : null;
      this.iconPause = this.playBtn ? this.playBtn.querySelector('.icon-pause') : null;
      this.userPaused = false;

      if (!this.video) return;

      this.init();
    }

    init() {
      // Autoplay muted by default for browser compliance
      this.video.muted = true;
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }

      // Sound Toggle
      if (this.soundBtn) {
        this.soundBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleSound();
        });
      }

      // Play/Pause Toggle
      if (this.playBtn) {
        this.playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.togglePlay();
        });
      }

      // Direct click on video frame
      this.video.addEventListener('click', () => {
        this.togglePlay();
      });

      // Video state tracking
      this.video.addEventListener('play', () => {
        this.updatePlayState(true);
      });
      this.video.addEventListener('pause', () => {
        this.updatePlayState(false);
      });

      // Smart Intersection Observer for battery & performance
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (this.video.paused && !this.userPaused) {
                this.video.play().catch(() => {});
              }
            } else {
              if (!this.video.paused) {
                this.video.pause();
              }
            }
          });
        }, { threshold: 0.15 });

        this.observer.observe(this.video);
      }
    }

    toggleSound() {
      this.video.muted = !this.video.muted;
      if (!this.video.muted) {
        this.video.volume = 1.0;
        if (this.video.paused) {
          this.video.play().catch(() => {});
        }
      }
      this.updateSoundState(!this.video.muted);
    }

    updateSoundState(isSoundOn) {
      if (this.iconSoundOff && this.iconSoundOn) {
        this.iconSoundOff.style.display = isSoundOn ? 'none' : 'block';
        this.iconSoundOn.style.display = isSoundOn ? 'block' : 'none';
      }
      if (this.soundLabel) {
        this.soundLabel.textContent = isSoundOn ? 'AUDIO [ON]' : 'SOUND';
      }
      if (this.soundBtn) {
        this.soundBtn.classList.toggle('is-active', isSoundOn);
      }
    }

    togglePlay() {
      if (this.video.paused) {
        this.userPaused = false;
        this.video.play().catch(() => {});
      } else {
        this.userPaused = true;
        this.video.pause();
      }
    }

    updatePlayState(isPlaying) {
      if (this.iconPause && this.iconPlay) {
        this.iconPause.style.display = isPlaying ? 'block' : 'none';
        this.iconPlay.style.display = isPlaying ? 'none' : 'block';
      }
      if (this.playBtn) {
        this.playBtn.setAttribute('title', isPlaying ? 'Pause Video' : 'Play Video');
        this.playBtn.setAttribute('aria-label', isPlaying ? 'Pause Video' : 'Play Video');
      }
    }
  }

  /* ==========================================================================
     Cart Page Controller (AJAX Quantities, Line Removals & Live Summary)
     ========================================================================== */
  class CartPage {
    constructor() {
      this.cartSection = document.querySelector('.main-cart-section');
      if (!this.cartSection) return;

      this.tbody = document.getElementById('cart-page-tbody');
      this.baseSubtotalEl = document.getElementById('cart-page-base-subtotal');
      this.finalTotalEl = document.getElementById('cart-page-final-total');
      this.form = document.getElementById('cart-page-form');

      this.initEvents();
    }

    initEvents() {
      if (!this.cartSection) return;

      this.cartSection.addEventListener('click', async (e) => {
        // Remove item
        const removeBtn = e.target.closest('[data-cart-page-remove]');
        if (removeBtn) {
          e.preventDefault();
          const key = removeBtn.dataset.itemKey;
          const line = removeBtn.dataset.itemLine;
          await this.updateItem(key || line, 0, removeBtn.closest('.cart-page-row'));
          return;
        }

        // Qty +/-
        const qtyBtn = e.target.closest('[data-cart-page-qty]');
        if (qtyBtn) {
          e.preventDefault();
          const action = qtyBtn.dataset.cartPageQty;
          const key = qtyBtn.dataset.itemKey;
          const line = qtyBtn.dataset.itemLine;
          const row = qtyBtn.closest('.cart-page-row');
          const input = row ? row.querySelector('[data-cart-page-qty-input]') : null;
          let currentQty = input ? parseInt(input.value, 10) : parseInt(qtyBtn.dataset.itemQty, 10);
          if (isNaN(currentQty)) currentQty = 1;

          const newQty = action === 'plus' ? currentQty + 1 : Math.max(0, currentQty - 1);
          await this.updateItem(key || line, newQty, row);
        }
      });

      // Direct numeric input change
      this.cartSection.addEventListener('change', async (e) => {
        const input = e.target.closest('[data-cart-page-qty-input]');
        if (input) {
          const key = input.dataset.itemKey;
          const line = input.dataset.itemLine;
          const row = input.closest('.cart-page-row');
          const newQty = Math.max(0, parseInt(input.value, 10) || 0);
          await this.updateItem(key || line, newQty, row);
        }
      });
    }

    async updateItem(identifier, quantity, rowEl) {
      if (rowEl) {
        rowEl.style.opacity = '0.35';
        rowEl.style.pointerEvents = 'none';
        rowEl.style.transition = 'opacity 0.25s ease';
      }

      try {
        const payload = (typeof identifier === 'string' && identifier.length > 5)
          ? { id: identifier, quantity: parseInt(quantity, 10) }
          : { line: parseInt(identifier, 10), quantity: parseInt(quantity, 10) };

        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Could not update cart item');
        const cart = await res.json();

        // If drawer is open or available, refresh it too
        if (window.Laceyaan.cartDrawer) {
          window.Laceyaan.cartDrawer.render(cart);
        }

        // Render updated cart page
        this.render(cart);
        Utils.showToast(quantity === 0 ? 'Item removed from bag' : 'Quantity updated', 'info');
      } catch (err) {
        console.error('Cart update error:', err);
        Utils.showToast('Could not update cart. Please try again.', 'error');
        if (rowEl) {
          rowEl.style.opacity = '1';
          rowEl.style.pointerEvents = '';
        }
      }
    }

    render(cart) {
      // Only the /cart page has this section; the drawer calls render() from every page
      if (!this.cartSection) return;

      if (cart.item_count === 0) {
        // If cart is now empty, reload to display empty state
        window.location.reload();
        return;
      }

      // Update Subtotal and Total
      if (this.baseSubtotalEl) {
        this.baseSubtotalEl.dataset.basePrice = cart.total_price;
        this.baseSubtotalEl.textContent = Utils.formatMoney(cart.total_price);
      }

      // Sync Delivery Manager if present
      if (window.Laceyaan.deliveryManager) {
        window.Laceyaan.deliveryManager.updatePricesForCart(cart.total_price);
      } else if (this.finalTotalEl) {
        this.finalTotalEl.textContent = Utils.formatMoney(cart.total_price);
      }

      // Update rows
      if (this.tbody) {
        const currentRows = this.tbody.querySelectorAll('.cart-page-row');
        currentRows.forEach(row => {
          const key = row.dataset.key;
          const matchingItem = cart.items.find(it => it.key === key);
          if (!matchingItem) {
            row.style.height = `${row.offsetHeight}px`;
            row.style.overflow = 'hidden';
            row.style.transition = 'all 0.35s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(20px)';
            setTimeout(() => row.remove(), 350);
          } else {
            row.style.opacity = '1';
            row.style.pointerEvents = '';
            const qtyInput = row.querySelector('[data-cart-page-qty-input]');
            if (qtyInput) qtyInput.value = matchingItem.quantity;
            const totalEl = row.querySelector('.item-line-total');
            if (totalEl) totalEl.textContent = Utils.formatMoney(matchingItem.final_line_price);
          }
        });
      }

      // Update free shipping bar on cart page if present
      const shippingBar = this.cartSection.querySelector('.shipping-progress-fill');
      const shippingText = this.cartSection.querySelector('.shipping-progress-text');
      const progressContainer = this.cartSection.querySelector('.shipping-progress-container');
      if (shippingBar && shippingText && progressContainer) {
        const threshold = parseFloat(progressContainer.dataset.threshold || 149900);
        const remaining = threshold - cart.total_price;
        const progress = Math.min(100, (cart.total_price / threshold) * 100);
        shippingBar.style.width = `${progress}%`;
        if (remaining <= 0) {
          shippingText.innerHTML = '<div class="shipping-unlocked"><span>⚡</span> <span>Complimentary Express Shipping Unlocked!</span></div>';
        } else {
          shippingText.innerHTML = `Add <strong>${Utils.formatMoney(remaining)}</strong> more for Complimentary Express Shipping`;
        }
      }

      // Update header count bubbles
      document.querySelectorAll('.bag-count-bubble, [data-cart-count]').forEach(bubble => {
        bubble.textContent = cart.item_count;
        bubble.style.display = cart.item_count > 0 ? 'inline-flex' : 'none';
      });
    }
  }

  /* ==========================================================================
     Pincode Delivery Estimator ("Before 20 December")
     ========================================================================== */
  class PincodeChecker {
    constructor() {
      this.STORAGE_KEY = 'laceyaan_delivery_pincode';
      this.TARGET_DATE_TEXT = 'Before 20 December';
      this.init();
    }

    init() {
      const savedCode = localStorage.getItem(this.STORAGE_KEY);
      const widgets = document.querySelectorAll('[data-pincode-widget]');
      if (!widgets.length) return;

      widgets.forEach(widget => {
        this.bindWidget(widget, savedCode);
      });
    }

    bindWidget(widget, savedCode) {
      const form = widget.querySelector('[data-pincode-form]');
      const input = widget.querySelector('[data-pincode-input]');
      const submitBtn = widget.querySelector('[data-pincode-submit]');
      const resultBox = widget.querySelector('[data-pincode-result]');
      const displayEl = widget.querySelector('[data-pincode-display]');
      const changeBtn = widget.querySelector('[data-pincode-change]');
      const errorBox = widget.querySelector('[data-pincode-error]');

      if (savedCode && this.isValidPincode(savedCode)) {
        this.showSuccess(widget, savedCode);
      }

      const handleSubmit = () => {
        if (!input) return;
        const code = input.value.trim();
        if (this.isValidPincode(code)) {
          this.saveAndBroadcast(code);
          if (errorBox) errorBox.style.display = 'none';
        } else {
          if (errorBox) errorBox.style.display = 'block';
          if (resultBox) resultBox.style.display = 'none';
        }
      };

      if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          handleSubmit();
        });
      }

      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        });
        // Auto-check when exactly 6 digits are typed
        input.addEventListener('input', (e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
          e.target.value = val;
          if (val.length === 6) {
            handleSubmit();
          }
        });
      }

      if (changeBtn) {
        changeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (form) form.style.display = 'block';
          if (resultBox) resultBox.style.display = 'none';
          if (input) {
            input.value = '';
            input.focus();
          }
        });
      }
    }

    isValidPincode(val) {
      return typeof val === 'string' && /^[1-9][0-9]{5}$/.test(val.trim());
    }

    saveAndBroadcast(code) {
      localStorage.setItem(this.STORAGE_KEY, code);

      // Update all widgets on the page
      document.querySelectorAll('[data-pincode-widget]').forEach(w => {
        this.showSuccess(w, code);
      });

      // Update cart attributes in Shopify so it persists in the order
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          attributes: {
            'Delivery Pincode': code,
            'Guaranteed Delivery': this.TARGET_DATE_TEXT
          }
        })
      }).catch(err => console.debug('Cart attribute update:', err));
    }

    showSuccess(widget, code) {
      const form = widget.querySelector('[data-pincode-form]');
      const resultBox = widget.querySelector('[data-pincode-result]');
      const displayEl = widget.querySelector('[data-pincode-display]');
      const errorBox = widget.querySelector('[data-pincode-error]');

      if (form) form.style.display = 'none';
      if (errorBox) errorBox.style.display = 'none';
      if (resultBox) resultBox.style.display = 'block';
      if (displayEl) displayEl.textContent = code;

      // Collapsed drawer row: surface the result without needing to expand it
      const summaryEl = widget.querySelector('[data-pincode-summary]');
      if (summaryEl) {
        const shortDate = this.TARGET_DATE_TEXT.replace(/([A-Za-z]{3})[a-z]+$/, '$1');
        summaryEl.textContent = `${code} · ${shortDate}`;
        summaryEl.classList.add('is-checked');
      }
    }
  }

  /* ==========================================================================
     THEME-ALIGNED VISUAL MICRO-INTERACTIONS
     - DecryptedText (Streetwear tech-scramble character reveal on hover)
     ========================================================================== */
  class ReactBitsEnhanceSuite {
    constructor() {
      this.initDecryptedText();
    }

    initDecryptedText() {
      const glyphs = '✦01XLACE#/&_';
      const targets = document.querySelectorAll(
        '.badge-gold, .vault-master-badge, .studio-brand-tag, [data-decrypt]'
      );

      targets.forEach(el => {
        if (el.dataset.rbDecrypt) return;
        el.dataset.rbDecrypt = 'true';
        const originalText = el.textContent.trim();
        if (!originalText) return;

        el.addEventListener('mouseenter', () => {
          if (el.dataset.decrypting === 'true') return;
          el.dataset.decrypting = 'true';

          let step = 0;
          const totalSteps = originalText.length * 2;
          const timer = setInterval(() => {
            el.textContent = originalText
              .split('')
              .map((char, idx) => {
                if (char === ' ' || char === '✦') return char;
                if (idx < step / 2) return originalText[idx];
                return glyphs[Math.floor(Math.random() * glyphs.length)];
              })
              .join('');

            step++;
            if (step >= totalSteps) {
              clearInterval(timer);
              el.textContent = originalText;
              el.dataset.decrypting = 'false';
            }
          }, 28);
        });
      });
    }
  }

  /* ==========================================================================
     GSAP LUXURY ANIMATION & SCROLLTRIGGER ENGINE
     Cinematic scroll reveals, staggered catalog entrances, and fluid micro-motion
     strictly harmonized with the luxury streetwear atelier aesthetic.
     ========================================================================== */
  class GsapMotionEngine {
    constructor() {
      if (typeof window.gsap === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.gsap = window.gsap;
      if (typeof window.ScrollTrigger !== 'undefined') {
        this.gsap.registerPlugin(window.ScrollTrigger);
      }

      // Safe non-destructive animations: NEVER hide catalog products, titles, or prices with opacity: 0
      this.initStatCounters();
      this.refresh();

      window.addEventListener('load', () => this.refresh(), { passive: true });
    }

    refresh() {
      if (typeof window.ScrollTrigger !== 'undefined') {
        try {
          window.ScrollTrigger.refresh();
        } catch (e) {}
      }
    }

    initStatCounters() {
      if (!window.ScrollTrigger) return;

      const statElements = document.querySelectorAll('.stat-number, .spec-metric .metric-val');
      statElements.forEach(el => {
        const text = el.textContent.trim();
        const cleanNumber = text.replace(/[^0-9.]/g, '');
        if (!cleanNumber) return;
        const targetValue = parseFloat(cleanNumber);
        if (isNaN(targetValue) || targetValue <= 0) return;

        const hasComma = text.includes(',');
        const isDecimal = cleanNumber.includes('.');
        const prefix = text.match(/^[^\d]+/)?.[0] || '';
        const suffix = text.match(/[^\d.]+$/)?.[0] || '';

        const obj = { val: 0 };
        this.gsap.to(obj, {
          val: targetValue,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true
          },
          onUpdate: () => {
            let formatted;
            if (isDecimal) {
              formatted = obj.val.toFixed(1);
            } else {
              const rounded = Math.round(obj.val);
              formatted = hasComma ? rounded.toLocaleString() : rounded.toString();
            }
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
          onComplete: () => {
            el.textContent = text;
          }
        });
      });
    }
  }

  /* ==========================================================================
     DOM Ready & Shopify Theme Editor Events Initialization
     ========================================================================== */
  function initAll() {
    new AnnouncementBar();
    new Header();
    window.Laceyaan.cartDrawer = new CartDrawer();
    window.Laceyaan.cartPage = new CartPage();
    window.Laceyaan.pincodeChecker = new PincodeChecker();
    window.Laceyaan.deliveryManager = new DeliveryManager();
    new PredictiveSearch();
    new BeforeAfterSlider();
    new LengthCalculator();
    window.Laceyaan.portalModals = new PortalModals();
    new ProductVariantSelector();
    window.Laceyaan.quickViewModal = new QuickViewModal();
    window.Laceyaan.productGallery = new ProductGalleryController();
    window.Laceyaan.productStudio = window.Laceyaan.productGallery;
    new Accordion();
    new EasterEggModal();
    new HeroVideoShowcase();
    new MobileStickyBuyBar();

    // Visual Micro-Interactions & GSAP Motion Engine
    window.Laceyaan.reactBits = new ReactBitsEnhanceSuite();
    window.Laceyaan.gsapEngine = new GsapMotionEngine();
    window.Laceyaan.cartPage = new CartPage();
    if (window.Laceyaan.pincodeChecker) {
      window.Laceyaan.pincodeChecker.init();
    } else {
      window.Laceyaan.pincodeChecker = new PincodeChecker();
    }

    // Initialize Animated Background Shoelace Engine only if visible
    const bgContainer = document.getElementById('laceyaan-background-lace');
    if (bgContainer && window.getComputedStyle(bgContainer).display !== 'none') {
      if (window.Laceyaan.backgroundLace) {
        window.Laceyaan.backgroundLace.destroy();
      }
      window.Laceyaan.backgroundLace = new BackgroundLace();
    }
    // Remove Orange Line Sale Badge on Mobile View
    function removeMobileSaleBadges() {
      if (window.innerWidth <= 860) {
        document.querySelectorAll('.badge-sale, .sale-badge, [data-save-badge]').forEach(el => el.remove());
        document.querySelectorAll('div, span, p, aside, a').forEach(el => {
          if (el.children.length <= 1 && /^\s*SAVE\s*\d+%/i.test(el.textContent.trim())) {
            el.remove();
          }
        });
      }
    }
    removeMobileSaleBadges();
    window.addEventListener('resize', removeMobileSaleBadges);
    if (typeof MutationObserver !== 'undefined') {
      try {
        new MutationObserver(removeMobileSaleBadges).observe(document.documentElement, { childList: true, subtree: true });
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Shopify Theme Editor dynamic section reload support
  document.addEventListener('shopify:section:load', () => {
    new BeforeAfterSlider();
    new LengthCalculator();
    window.Laceyaan.portalModals = new PortalModals();
    new ProductVariantSelector();
    new Accordion();
    new AnnouncementBar();
    new EasterEggModal();
    new HeroVideoShowcase();
    window.Laceyaan.productGallery = new ProductGalleryController();
    window.Laceyaan.productStudio = window.Laceyaan.productGallery;
    new MobileStickyBuyBar();
    window.Laceyaan.cartPage = new CartPage();
    if (window.Laceyaan.pincodeChecker) {
      window.Laceyaan.pincodeChecker.init();
    } else {
      window.Laceyaan.pincodeChecker = new PincodeChecker();
    }
    if (window.Laceyaan.deliveryManager) {
      window.Laceyaan.deliveryManager.init();
    } else {
      window.Laceyaan.deliveryManager = new DeliveryManager();
    }

    if (!window.Laceyaan.backgroundLace) {
      window.Laceyaan.backgroundLace = new BackgroundLace();
    }

    // Refresh animations for dynamically loaded section
    window.Laceyaan.reactBits = new ReactBitsEnhanceSuite();
    if (window.Laceyaan.gsapEngine) {
      window.Laceyaan.gsapEngine.refresh();
    } else {
      window.Laceyaan.gsapEngine = new GsapMotionEngine();
    }
  });

})();

