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
        } else if (handle && window.Laceyaan.quickViewModal) {
          window.Laceyaan.quickViewModal.open(handle);
        } else {
          window.location.href = '/collections/all';
        }
      });

      // Standalone BUY NOW Buttons (Direct Checkout)
      document.addEventListener('click', async (e) => {
        const buyBtn = e.target.closest('[data-buy-now]');
        if (!buyBtn) return;

        e.preventDefault();
        const variantId = buyBtn.dataset.variantId;
        const handle = buyBtn.dataset.productHandle;

        if (variantId) {
          const originalText = buyBtn.innerHTML;
          buyBtn.disabled = true;
          buyBtn.innerHTML = '<span>CHECKING OUT...</span>';
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
            buyBtn.disabled = false;
            buyBtn.innerHTML = originalText;
          }
        } else if (handle && window.Laceyaan.quickViewModal) {
          window.Laceyaan.quickViewModal.open(handle);
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
        const available = plusBtn.dataset.available === 'true';
        const hasVariants = plusBtn.dataset.hasVariants === 'true';
        const isPrototype = plusBtn.dataset.isPrototype === 'true';

        // If prototype, multi-variant, or unavailable -> open Quick View Modal for full options/voting
        if (isPrototype || hasVariants || !available || !variantId) {
          if (handle && window.Laceyaan.quickViewModal) {
            window.Laceyaan.quickViewModal.open(handle, plusBtn);
          } else if (handle) {
            window.location.href = `/products/${handle}`;
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
          if (handle && window.Laceyaan.quickViewModal) {
            window.Laceyaan.quickViewModal.open(handle, plusBtn);
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
            this.changeQuantity(line, 0);
          } else if (action === 'plus') {
            this.changeQuantity(line, currentQty + 1);
          } else if (action === 'minus') {
            this.changeQuantity(line, Math.max(0, currentQty - 1));
          }
        });

        this.itemsContainer.addEventListener('change', (e) => {
          if (e.target.matches('[data-cart-quantity-input]')) {
            const line = parseInt(e.target.dataset.itemLine, 10);
            const qty = parseInt(e.target.value, 10);
            if (!isNaN(qty)) this.changeQuantity(line, qty);
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

    async changeQuantity(line, quantity) {
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line, quantity })
        });
        const cart = await res.json();
        this.render(cart);
      } catch (err) {
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
        return;
      }

      if (this.emptyState) this.emptyState.style.display = 'none';
      if (this.filledState) this.filledState.style.display = 'block';
      if (this.itemsContainer) this.itemsContainer.style.display = 'block';

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
                  <button type="button" class="cart-item-remove" data-cart-item-action="remove" data-item-line="${line}" aria-label="Remove item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                ${optionsHtml}
                <div class="cart-item-footer">
                  <div class="cart-qty-control">
                    <button type="button" class="qty-btn" data-cart-item-action="minus" data-item-line="${line}" data-item-qty="${item.quantity}">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" data-cart-quantity-input data-item-line="${line}">
                    <button type="button" class="qty-btn" data-cart-item-action="plus" data-item-line="${line}" data-item-qty="${item.quantity}">+</button>
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
        input.addEventListener('change', () => this.onOptionChange());
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

      // Update Availability & Button
      if (this.submitBtn) {
        if (variant.available) {
          this.submitBtn.disabled = false;
          this.submitBtn.innerHTML = '<span>ACQUIRE PAIR &bull; ADD TO BAG</span>';
        } else {
          this.submitBtn.disabled = true;
          this.submitBtn.textContent = 'SOLD OUT';
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
      // Open modal on click of product card media, title, plus button, or explicit trigger
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-studio-modal], [data-quick-view-trigger], .quick-view-btn, .product-card-editorial .media-link, .product-card-editorial .card-title a, [data-action-plus]');
        if (!trigger) return;

        // Respect keyboard shortcuts or new-tab clicks (Cmd/Ctrl/Middle click)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        // Skip if user interacted with card sub-elements like bookmark or voting buttons
        if (e.target.closest('.card-bookmark-btn') || e.target.closest('.card-interest-pills-row')) return;

        e.preventDefault();
        e.stopPropagation();

        const handle = trigger.dataset.productHandle || 
                       trigger.getAttribute('data-quick-view-trigger') || 
                       trigger.closest('[data-product-handle]')?.dataset.productHandle;

        if (handle) this.open(handle, trigger);
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
            tags: ['register-interest'],
            description: 'Bespoke weave silhouette in active development. Register your interest below to vote for production or receive restock notification.'
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
      const video = document.getElementById('StudioModalVideo');
      if (video) video.pause();
    }

    setStudioMode(mode) {
      const viewport = document.getElementById('StudioModalViewport');
      const videoBox = document.getElementById('StudioModalVideoBox');
      const stillsBox = document.getElementById('StudioModalStillsBox');
      const video = document.getElementById('StudioModalVideo');
      const shadow = document.getElementById('StudioModalShadow');
      const buttons = this.modal.querySelectorAll('[data-studio-view]');

      buttons.forEach(b => b.classList.toggle('active', b.dataset.studioView === mode));

      if (mode === '360') {
        if (viewport) viewport.classList.remove('is-glow-mode');
        if (videoBox) videoBox.style.display = 'block';
        if (stillsBox) stillsBox.style.display = 'none';
        if (shadow) shadow.style.display = 'block';
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else if (mode === 'glow') {
        if (viewport) viewport.classList.add('is-glow-mode');
        if (videoBox) videoBox.style.display = 'block';
        if (stillsBox) stillsBox.style.display = 'none';
        if (shadow) shadow.style.display = 'block';
        if (video) {
          video.currentTime = 5.8; // jump to glowing 3M lace sequence
          video.play().catch(() => {});
        }
      } else if (mode === 'stills') {
        if (viewport) viewport.classList.remove('is-glow-mode');
        if (videoBox) videoBox.style.display = 'none';
        if (stillsBox) stillsBox.style.display = 'flex';
        if (shadow) shadow.style.display = 'none';
        if (video) video.pause();
      }
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
      const isRegisterInterest = isSoldOut || tagsStr.includes('interest') || tagsStr.includes('register') || tagsStr.includes('prototype') || (card && card.classList.contains('product-card-interest'));

      // Community voting stats
      const votingEngine = window.Laceyaan && window.Laceyaan.interestVoting;
      const countData = (votingEngine && votingEngine.counts && votingEngine.counts[product.handle]) || { interested: 0, not_interested: 0 };
      const userVote = (votingEngine && votingEngine.userVotes && votingEngine.userVotes[product.handle]) || null;
      const totalVotes = (countData.interested || 0) + (countData.not_interested || 0);
      const demandPercent = totalVotes > 0 ? Math.round(((countData.interested || 0) / totalVotes) * 100) : 100;

      const comparePrice = firstVariant.compare_at_price > firstVariant.price 
        ? `<s class="price-was" style="margin-left: 0.5rem; color: #8C8880; font-size: 0.9em; text-decoration: line-through;">${Utils.formatMoney(firstVariant.compare_at_price)}</s>` 
        : '';

      const featuredImg = product.featured_image || (product.images && product.images[0]) || '';
      const studioVideoUrl = this.modal.getAttribute('data-studio-video-url') || 'assets/drop-01-highlights.mp4';
      const studioVideoAlt = this.modal.getAttribute('data-studio-video-alt') || 'assets/WhatsApp Video 2026-10-04 at 9.36.32 PM.mp4';

      this.content.innerHTML = `
        <div class="studio-modal-grid">
          <!-- Left Column: 3D Floating Sneaker Video Stage -->
          <div class="studio-viewport-col">
            <div class="studio-viewport" id="StudioModalViewport">
              <!-- 3D Sneaker Video -->
              <div class="studio-video-box active" id="StudioModalVideoBox">
                <video 
                  class="studio-sneaker-video" 
                  id="StudioModalVideo" 
                  autoplay 
                  loop 
                  muted 
                  playsinline 
                  preload="auto"
                  poster="${featuredImg}"
                >
                  <source src="${studioVideoUrl}" type="video/mp4">
                  <source src="${studioVideoAlt}" type="video/mp4">
                </video>
                <div class="studio-floor-shadow" id="StudioModalShadow"></div>
              </div>

              <!-- Still Image Box (Toggled on stills mode) -->
              <div class="studio-stills-box" id="StudioModalStillsBox" style="display: none;">
                <img src="${featuredImg}" alt="${product.title}" class="studio-stills-img" width="550" height="550" loading="eager">
              </div>

              <!-- Studio Mode Switcher Toolbar -->
              <div class="studio-controls-bar">
                <button type="button" class="studio-tab-btn active" data-studio-view="360" aria-label="360 Rotation View">
                  <span class="tab-icon">↻</span>
                  <span>360° 3D</span>
                </button>
                <button type="button" class="studio-tab-btn" data-studio-view="glow" aria-label="Glow In Dark Mode">
                  <span class="tab-icon">✦</span>
                  <span>GLOW LAB</span>
                </button>
                <button type="button" class="studio-tab-btn" data-studio-view="stills" aria-label="Product Stills View">
                  <span class="tab-icon">📷</span>
                  <span>STILLS</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Product Intelligence & Buying / Voting Panel -->
          <div class="studio-details-col" data-product-handle="${product.handle}" data-product-title="${product.title}">
            <div class="studio-eyebrow-row">
              <span class="studio-craft-badge">LACEYAAN ATELIER // DROP 01</span>
              ${isRegisterInterest 
                ? `<span class="badge badge-gold">CONCEPT ARCHIVE // VOTING OPEN</span>` 
                : `<span class="badge badge-dark">IN STOCK</span>`
              }
            </div>

            <h2 class="studio-product-title">${product.title}</h2>

            <div class="studio-price-block">
              ${!isRegisterInterest ? `
                <span class="price-now">${Utils.formatMoney(firstVariant.price)}</span>
                ${comparePrice}
                ${firstVariant.compare_at_price > firstVariant.price ? `<span class="badge badge-sale">SAVE ${Math.round((firstVariant.compare_at_price - firstVariant.price) * 100 / firstVariant.compare_at_price)}%</span>` : ''}
              ` : `
                <span class="price-prototype">CONCEPT PROTOTYPE &bull; NOT FOR PURCHASE</span>
              `}
            </div>

            <div class="studio-desc-text">
              ${product.description ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 260) + '...' : 'Atelier slow-crafted shoelaces engineered with solid CNC milled brass hardware, bespoke aglets, and precision Japanese shuttle weaves.'}
            </div>

            ${isRegisterInterest ? `
              <!-- Community Demand Voting Engine -->
              <div class="quick-view-interest-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em; font-weight: 700; color: var(--accent-gold-dark); text-transform: uppercase;">COMMUNITY DEMAND SCORE</span>
                  <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; color: #141311;" data-demand-percent>${demandPercent}%</span>
                </div>
                <div style="width: 100%; height: 6px; background: rgba(0, 0, 0, 0.08); border-radius: 999px; overflow: hidden; margin-bottom: 1rem;">
                  <div style="width: ${demandPercent}%; height: 100%; background: linear-gradient(90deg, #A38760, #C5A880); transition: width 0.4s ease;" data-demand-fill></div>
                </div>

                <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.85rem;">
                  Cast your vote below. Community demand directly determines which prototypes enter full artisan production:
                </div>

                <div class="card-actions card-interest-actions" style="display: flex; gap: 0.65rem; margin-bottom: 1rem;">
                  <button type="button" class="btn-interest-pill btn-interest-yes ${userVote === 'interested' ? 'is-active' : ''}" data-vote-btn="interested" data-product-handle="${product.handle}" style="flex: 1; padding: 0.75rem 1rem;">
                    <span class="vote-icon">▲</span>
                    <span class="vote-label">INTERESTED</span>
                    <span class="vote-count-badge" data-count="interested">${countData.interested || 0}</span>
                  </button>
                  <button type="button" class="btn-interest-pill btn-interest-no ${userVote === 'not_interested' ? 'is-active' : ''}" data-vote-btn="not_interested" data-product-handle="${product.handle}" style="flex: 1; padding: 0.75rem 1rem;">
                    <span class="vote-icon">▼</span>
                    <span class="vote-label">NOT INTERESTED</span>
                    <span class="vote-count-badge" data-count="not_interested">${countData.not_interested || 0}</span>
                  </button>
                </div>

                <form class="modal-notify-form" onsubmit="window.Laceyaan.handleEarlyAccessNotify(event, '${product.handle}')" style="display: flex; gap: 0.5rem; margin-top: 0.85rem;">
                  <input type="email" name="email" placeholder="Enter email for VIP production drop alerts" required style="flex: 1; padding: 0.65rem 0.85rem; font-size: 0.8rem; border: 1px solid rgba(20,19,17,0.18); border-radius: 6px; background: #FAF9F5; color: #141311;">
                  <button type="submit" class="btn-primary" style="padding: 0.65rem 1.15rem; font-size: 0.75rem; white-space: nowrap;">
                    <span>NOTIFY ME</span>
                  </button>
                </form>
                <div class="modal-notify-success" style="display: none; color: #2B7A4B; font-size: 0.8rem; font-weight: 700; margin-top: 0.6rem;">
                  ✓ You are registered for the VIP allocation list!
                </div>
              </div>
            ` : `
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
            `}

            <div class="studio-full-page-link" style="margin-top: 1.35rem; padding-top: 1rem; border-top: 1px solid rgba(20,19,17,0.08); text-align: center;">
              <a href="/products/${product.handle}" class="link-view-full-page" style="font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.12em; color: #141311; text-transform: uppercase; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>View Full Atelier Spec Sheet</span>
                <span>[ &rarr; ]</span>
              </a>
            </div>
          </div>
        </div>
      `;

      // Update UI counts and active states inside modal
      if (votingEngine) {
        votingEngine.updateAllUI();
      }
    }
  }

  /* ==========================================================================
     8b. Main Product Detail Page 3D Studio Controller
     ========================================================================== */
  class ProductStudioController {
    constructor() {
      this.viewport = document.getElementById('ProductPageStudioViewport');
      if (!this.viewport) return;

      this.videoBox = document.getElementById('ProductPageVideoBox');
      this.stillsBox = document.getElementById('ProductPageStillsBox');
      this.video = document.getElementById('ProductPageStudioVideo');
      this.shadow = document.getElementById('ProductPageShadow');
      this.buttons = document.querySelectorAll('[data-product-mode]');

      this.bindEvents();
    }

    bindEvents() {
      this.buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const mode = btn.dataset.productMode;
          this.setMode(mode);
        });
      });

      // Gallery thumb buttons switch to stills
      document.querySelectorAll('.gallery-thumb-btn[data-media-url]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.setMode('stills');
        });
      });
    }

    setMode(mode) {
      this.buttons.forEach(b => b.classList.toggle('active', b.dataset.productMode === mode));

      if (mode === '360') {
        if (this.viewport) this.viewport.classList.remove('is-glow-mode');
        if (this.videoBox) this.videoBox.style.display = 'block';
        if (this.stillsBox) this.stillsBox.style.display = 'none';
        if (this.shadow) this.shadow.style.display = 'block';
        if (this.video) {
          this.video.currentTime = 0;
          this.video.play().catch(() => {});
        }
      } else if (mode === 'glow') {
        if (this.viewport) this.viewport.classList.add('is-glow-mode');
        if (this.videoBox) this.videoBox.style.display = 'block';
        if (this.stillsBox) this.stillsBox.style.display = 'none';
        if (this.shadow) this.shadow.style.display = 'block';
        if (this.video) {
          this.video.currentTime = 5.8; // jump to glowing 3M lace sequence
          this.video.play().catch(() => {});
        }
      } else if (mode === 'stills') {
        if (this.viewport) this.viewport.classList.remove('is-glow-mode');
        if (this.videoBox) this.videoBox.style.display = 'none';
        if (this.stillsBox) this.stillsBox.style.display = 'block';
        if (this.shadow) this.shadow.style.display = 'none';
        if (this.video) this.video.pause();
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
     Register Interest - Community Prototype Vault & Voting Engine
     ========================================================================== */
  class InterestVotingEngine {
    constructor() {
      this.storageKey = 'laceyaan_interest_counts_v1';
      this.userVotesKey = 'laceyaan_user_interest_votes_v1';
      this.webhookKey = 'laceyaan_interest_webhook_url';
      
      this.defaultSeeds = {
        'titanium-damier-jacquard': { title: 'Laser-Etched Titanium Damier', interested: 54, not_interested: 3 },
        'japanese-indigo-sashiko-rope': { title: 'Japanese Indigo Sashiko Rope', interested: 42, not_interested: 5 },
        'nocturnal-3m-aurora-reflective': { title: 'Nocturnal 3M Aurora Reflective', interested: 68, not_interested: 2 },
        'vintage-olive-canvas-shuttle': { title: 'Vintage Olive Canvas Shuttle Weave', interested: 39, not_interested: 4 }
      };

      this.counts = this.loadCounts();
      this.userVotes = this.loadUserVotes();

      this.init();
    }

    loadCounts() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          return Object.assign({}, this.defaultSeeds, JSON.parse(stored));
        }
      } catch (e) {}
      return Object.assign({}, this.defaultSeeds);
    }

    saveCounts() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.counts));
      } catch (e) {}
    }

    loadUserVotes() {
      try {
        const stored = localStorage.getItem(this.userVotesKey);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
      return {};
    }

    saveUserVotes() {
      try {
        localStorage.setItem(this.userVotesKey, JSON.stringify(this.userVotes));
      } catch (e) {}
    }

    init() {
      this.bindButtons();
      this.updateAllUI();
      this.initAdminModal();
      this.checkUrlForAdmin();
    }

    bindButtons() {
      // Delegate clicks for interest buttons (both on cards and product pages)
      document.addEventListener('click', (e) => {
        const voteBtn = e.target.closest('[data-vote-btn]');
        if (!voteBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const handle = voteBtn.getAttribute('data-product-handle');
        const voteType = voteBtn.getAttribute('data-vote-btn'); // 'interested' or 'not_interested'

        if (!handle || !voteType) return;

        this.castVote(handle, voteType);
      });
    }

    castVote(handle, voteType) {
      if (!this.counts[handle]) {
        const card = document.querySelector(`[data-product-handle="${handle}"]`);
        const title = card ? (card.getAttribute('data-product-title') || handle) : handle;
        this.counts[handle] = { title, interested: 0, not_interested: 0 };
      }

      const prevVote = this.userVotes[handle];

      if (prevVote === voteType) {
        // Toggle off
        this.counts[handle][voteType] = Math.max(0, this.counts[handle][voteType] - 1);
        delete this.userVotes[handle];
      } else {
        // Switching vote
        if (prevVote) {
          this.counts[handle][prevVote] = Math.max(0, this.counts[handle][prevVote] - 1);
        }
        this.counts[handle][voteType] = (this.counts[handle][voteType] || 0) + 1;
        this.userVotes[handle] = voteType;
        
        // Micro toast confirmation
        if (window.Laceyaan && window.Laceyaan.showToast) {
          const msg = voteType === 'interested' 
            ? `Your interest in ${this.counts[handle].title || 'this silhouette'} has been logged!` 
            : `Your feedback has been recorded.`;
          window.Laceyaan.showToast(msg);
        }

        // Send background beacon / webhook sync
        this.dispatchVoteBeacon(handle, voteType);
      }

      this.saveCounts();
      this.saveUserVotes();
      this.updateAllUI();
    }

    dispatchVoteBeacon(handle, voteType) {
      const payload = {
        event: 'register_interest_vote',
        product_handle: handle,
        product_title: (this.counts[handle] && this.counts[handle].title) || handle,
        vote: voteType,
        timestamp: new Date().toISOString()
      };

      try {
        const webhookUrl = localStorage.getItem(this.webhookKey);
        if (webhookUrl && webhookUrl.startsWith('http')) {
          fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }
      } catch (e) {}

      document.dispatchEvent(new CustomEvent('laceyaan:interest:voted', { detail: payload }));
    }

    updateAllUI() {
      // 1. Update Card buttons
      document.querySelectorAll('[data-product-handle]').forEach((container) => {
        const handle = container.getAttribute('data-product-handle');
        if (!handle) return;

        const productData = this.counts[handle] || { interested: 0, not_interested: 0 };
        const userVote = this.userVotes[handle];

        // Update count badges
        container.querySelectorAll('[data-count="interested"]').forEach((el) => {
          el.textContent = productData.interested || 0;
        });
        container.querySelectorAll('[data-count="not_interested"]').forEach((el) => {
          el.textContent = productData.not_interested || 0;
        });

        // Update active classes
        container.querySelectorAll('[data-vote-btn="interested"]').forEach((btn) => {
          btn.classList.toggle('is-active', userVote === 'interested');
        });
        container.querySelectorAll('[data-vote-btn="not_interested"]').forEach((btn) => {
          btn.classList.toggle('is-active', userVote === 'not_interested');
        });

        // Update product page demand meter if present
        const demandPercentEl = container.querySelector('[data-demand-percent]');
        const demandFillEl = container.querySelector('[data-demand-fill]');
        const totalVotesLabel = container.querySelector('[data-total-votes-label]');

        if (demandPercentEl || demandFillEl) {
          const total = (productData.interested || 0) + (productData.not_interested || 0);
          const percent = total > 0 ? Math.round(((productData.interested || 0) / total) * 100) : 100;
          if (demandPercentEl) demandPercentEl.textContent = `${percent}% APPROVAL`;
          if (demandFillEl) demandFillEl.style.width = `${percent}%`;
          if (totalVotesLabel) totalVotesLabel.textContent = `${total} Total Community Votes Cast`;
        }
      });

      // 2. Update Collection Header Summary Stats
      const totalConceptsEl = document.getElementById('stats-total-concepts');
      const totalVotesEl = document.getElementById('stats-total-votes');
      const topTrendingEl = document.getElementById('stats-top-trending');

      let grandTotalVotes = 0;
      let topScore = -1;
      let topTitle = '--';
      let totalProducts = Object.keys(this.counts).length;

      Object.entries(this.counts).forEach(([handle, data]) => {
        const votes = (data.interested || 0) + (data.not_interested || 0);
        grandTotalVotes += votes;
        if ((data.interested || 0) > topScore) {
          topScore = data.interested || 0;
          topTitle = data.title || handle;
        }
      });

      if (totalConceptsEl && !totalConceptsEl.getAttribute('data-server-set')) {
        totalConceptsEl.textContent = totalProducts;
      }
      if (totalVotesEl) totalVotesEl.textContent = grandTotalVotes;
      if (topTrendingEl) topTrendingEl.textContent = topTitle;
    }

    initAdminModal() {
      const openBtn = document.getElementById('open-interest-admin-btn');
      const modal = document.getElementById('interest-admin-modal');
      const closeBtn = document.getElementById('close-interest-admin-btn');
      const overlay = document.getElementById('close-interest-admin-overlay');
      const exportCsvBtn = document.getElementById('btn-export-interest-csv');
      const saveWebhookBtn = document.getElementById('btn-save-webhook');
      const webhookInput = document.getElementById('interest-webhook-input');
      const webhookNote = document.getElementById('webhook-saved-note');

      if (!modal) return;

      const openModal = () => {
        this.renderAdminTable();
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
      };

      const closeModal = () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      };

      if (openBtn) openBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (overlay) overlay.addEventListener('click', closeModal);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          closeModal();
        }
      });

      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
          this.exportCsv();
        });
      }

      if (webhookInput) {
        const saved = localStorage.getItem(this.webhookKey);
        if (saved) webhookInput.value = saved;
      }

      if (saveWebhookBtn && webhookInput) {
        saveWebhookBtn.addEventListener('click', () => {
          const val = webhookInput.value.trim();
          localStorage.setItem(this.webhookKey, val);
          if (webhookNote) {
            webhookNote.style.display = 'block';
            setTimeout(() => { webhookNote.style.display = 'none'; }, 3000);
          }
        });
      }
    }

    checkUrlForAdmin() {
      if (window.location.search.includes('admin=true') || window.location.search.includes('view=admin')) {
        setTimeout(() => {
          const openBtn = document.getElementById('open-interest-admin-btn');
          if (openBtn) openBtn.click();
        }, 500);
      }
    }

    renderAdminTable() {
      const tbody = document.getElementById('interest-admin-tbody');
      const totalProdEl = document.getElementById('admin-summary-total-products');
      const totalVotesEl = document.getElementById('admin-summary-total-votes');

      if (!tbody) return;

      tbody.innerHTML = '';
      let grandTotalVotes = 0;
      let countProducts = 0;

      Object.entries(this.counts).forEach(([handle, data]) => {
        countProducts++;
        const interested = data.interested || 0;
        const notInterested = data.not_interested || 0;
        const total = interested + notInterested;
        grandTotalVotes += total;
        const demand = total > 0 ? Math.round((interested / total) * 100) : 100;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${data.title || handle}</strong></td>
          <td><code>${handle}</code></td>
          <td style="text-align: center; color: var(--accent-gold); font-weight: 700;">${interested}</td>
          <td style="text-align: center; color: #888;">${notInterested}</td>
          <td style="text-align: center; font-weight: 700;">${total}</td>
          <td style="text-align: right; font-weight: 700; color: ${demand >= 75 ? '#4ade80' : 'var(--accent-gold)'};">${demand}%</td>
        `;
        tbody.appendChild(tr);
      });

      if (totalProdEl) totalProdEl.textContent = countProducts;
      if (totalVotesEl) totalVotesEl.textContent = grandTotalVotes;
    }

    exportCsv() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Product Title,Handle,Interested,Not Interested,Total Votes,Demand Approval %\r\n';

      Object.entries(this.counts).forEach(([handle, data]) => {
        const title = (data.title || handle).replace(/"/g, '""');
        const interested = data.interested || 0;
        const notInterested = data.not_interested || 0;
        const total = interested + notInterested;
        const demand = total > 0 ? Math.round((interested / total) * 100) : 100;

        csvContent += `"${title}","${handle}",${interested},${notInterested},${total},${demand}%\r\n`;
      });

      // Append VIP Email Leads Section if present
      try {
        const leads = JSON.parse(localStorage.getItem('laceyaan_interest_leads_v1') || '[]');
        if (leads.length > 0) {
          csvContent += '\r\n\r\nVIP Early-Access Email Leads\r\nEmail,Product Handle,Registration Date\r\n';
          leads.forEach(lead => {
            csvContent += `"${lead.email}","${lead.handle}","${lead.date}"\r\n`;
          });
        }
      } catch (err) {}

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `laceyaan_register_interest_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /* ==========================================================================
     Early Access VIP Notification Handler
     ========================================================================== */
  window.Laceyaan.handleEarlyAccessNotify = function(e, handle) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[name="email"], input[type="email"]');
    const email = input ? input.value.trim() : '';
    if (!email) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> SAVING...';
    }

    // Auto-cast positive vote if not already voted
    if (window.Laceyaan.interestVoting) {
      const curVote = window.Laceyaan.interestVoting.userVotes[handle];
      if (curVote !== 'interested') {
        window.Laceyaan.interestVoting.castVote(handle, 'interested');
      }
    }

    // Submit background customer registration
    const formData = new FormData();
    formData.append('form_type', 'customer');
    formData.append('utf8', '✓');
    formData.append('contact[email]', email);
    formData.append('contact[tags]', `interest-registered, prototype-${handle}`);
    
    fetch('/contact#contact_form', {
      method: 'POST',
      body: formData
    }).catch(() => {});

    // Save lead locally to admin modal records
    try {
      const leadsKey = 'laceyaan_interest_leads_v1';
      const leads = JSON.parse(localStorage.getItem(leadsKey) || '[]');
      leads.push({ email, handle, date: new Date().toISOString() });
      localStorage.setItem(leadsKey, JSON.stringify(leads));
    } catch (err) {}

    setTimeout(() => {
      form.style.display = 'none';
      const successMsg = form.parentElement.querySelector('.modal-notify-success');
      if (successMsg) successMsg.style.display = 'block';
      Utils.showToast(`VIP early-access logged for ${email}!`, 'success');
    }, 400);
  };

  /* ==========================================================================
     DOM Ready & Shopify Theme Editor Events Initialization
     ========================================================================== */
  function initAll() {
    new AnnouncementBar();
    new Header();
    window.Laceyaan.cartDrawer = new CartDrawer();
    window.Laceyaan.deliveryManager = new DeliveryManager();
    new PredictiveSearch();
    new BeforeAfterSlider();
    new LengthCalculator();
    window.Laceyaan.portalModals = new PortalModals();
    new ProductVariantSelector();
    window.Laceyaan.quickViewModal = new QuickViewModal();
    window.Laceyaan.productStudio = new ProductStudioController();
    new Accordion();
    new EasterEggModal();
    new HeroVideoShowcase();
    window.Laceyaan.interestVoting = new InterestVotingEngine();
    window.Laceyaan.productStudio = new ProductStudioController();
    new MobileStickyBuyBar();

    // Initialize Animated Background Shoelace Engine
    if (window.Laceyaan.backgroundLace) {
      window.Laceyaan.backgroundLace.destroy();
    }
    window.Laceyaan.backgroundLace = new BackgroundLace();
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
    window.Laceyaan.interestVoting = new InterestVotingEngine();
    window.Laceyaan.productStudio = new ProductStudioController();
    new MobileStickyBuyBar();
    if (window.Laceyaan.deliveryManager) {
      window.Laceyaan.deliveryManager.init();
    } else {
      window.Laceyaan.deliveryManager = new DeliveryManager();
    }

    if (!window.Laceyaan.backgroundLace) {
      window.Laceyaan.backgroundLace = new BackgroundLace();
    }
  });

})();

