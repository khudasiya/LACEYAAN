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

    showToast(message, type = 'info') {
      let toastContainer = document.getElementById('laceyaan-toast');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'laceyaan-toast';
        toastContainer.className = 'laceyaan-toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `laceyaan-toast laceyaan-toast--${type}`;
      toast.innerHTML = `
        <span class="toast-indicator"></span>
        <span class="toast-message">${message}</span>
      `;
      toastContainer.appendChild(toast);

      setTimeout(() => toast.classList.add('is-visible'), 10);
      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
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
      this.header = document.querySelector('[data-header]');
      this.menuTrigger = document.querySelector('[data-mobile-menu-trigger]');
      this.menuDrawer = document.querySelector('[data-mobile-menu-drawer]');
      this.menuClose = document.querySelector('[data-mobile-menu-close]');
      this.menuOverlay = document.querySelector('[data-mobile-menu-overlay]');

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
        this.menuDrawer.classList.add('is-open');
        if (this.menuOverlay) this.menuOverlay.classList.add('is-open');
        document.body.classList.add('overflow-hidden');
      };

      const closeDrawer = () => {
        this.menuDrawer.classList.remove('is-open');
        if (this.menuOverlay) this.menuOverlay.classList.remove('is-open');
        document.body.classList.remove('overflow-hidden');
      };

      this.menuTrigger.addEventListener('click', openDrawer);
      if (this.menuClose) this.menuClose.addEventListener('click', closeDrawer);
      if (this.menuOverlay) this.menuOverlay.addEventListener('click', closeDrawer);

      // Accordion dropdowns in mobile menu
      const dropdownTriggers = this.menuDrawer.querySelectorAll('[data-dropdown-trigger]');
      dropdownTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const content = btn.nextElementSibling;
          if (content) {
            const isOpen = content.classList.contains('is-open');
            content.classList.toggle('is-open', !isOpen);
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
      this.closeBtn = this.drawer.querySelector('[data-cart-close]');
      this.openTriggers = document.querySelectorAll('[data-cart-drawer-trigger], [data-open-cart]');
      this.itemsContainer = this.drawer.querySelector('#cart-drawer-items');
      this.countElements = document.querySelectorAll('#cart-drawer-count, .cart-count-bubble, [data-cart-count]');
      this.subtotalElement = this.drawer.querySelector('#cart-drawer-subtotal');
      this.freeShippingBar = this.drawer.querySelector('#shipping-progress-fill');
      this.freeShippingText = this.drawer.querySelector('#shipping-progress-text');
      this.emptyState = this.drawer.querySelector('#cart-drawer-empty');
      this.filledState = this.drawer.querySelector('#cart-drawer-filled');

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
            Utils.showToast(`${item.title} added to your bag`, 'success');
            this.open();
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

    open() {
      this.drawer.classList.add('is-open');
      if (this.overlay) this.overlay.classList.add('is-open');
      document.body.classList.add('overflow-hidden');
      this.refresh();
    }

    close() {
      this.drawer.classList.remove('is-open');
      if (this.overlay) this.overlay.classList.remove('is-open');
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
        Utils.showToast(`${addedItem.title} added to your bag`, 'success');
        this.open();
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
        return;
      }

      if (this.emptyState) this.emptyState.style.display = 'none';
      if (this.filledState) this.filledState.style.display = 'flex';

      // Subtotal
      if (this.subtotalElement) {
        this.subtotalElement.textContent = Utils.formatMoney(cart.total_price);
      }

      // Free shipping threshold
      if (this.freeShippingBar && this.freeShippingText) {
        const remaining = this.threshold - cart.total_price;
        const progress = Math.min(100, (cart.total_price / this.threshold) * 100);
        this.freeShippingBar.style.width = `${progress}%`;

        if (remaining <= 0) {
          this.freeShippingText.innerHTML = 'You unlocked <strong>Complimentary Express Shipping</strong>!';
        } else {
          this.freeShippingText.innerHTML = `Add <strong>${Utils.formatMoney(remaining)}</strong> more for Complimentary Express Shipping`;
        }
      }

      // Render Items
      if (this.itemsContainer) {
        this.itemsContainer.innerHTML = cart.items.map((item, index) => {
          const line = index + 1;
          const options = item.options_with_values ? item.options_with_values.map(opt => `${opt.name}: ${opt.value}`).join(' · ') : '';

          return `
            <div class="cart-item-card" data-line="${line}">
              <div class="cart-item-image-wrapper">
                <img src="${item.featured_image ? item.featured_image.url : ''}" alt="${item.title}" class="cart-item-img" width="80" height="80" loading="lazy">
              </div>
              <div class="cart-item-content">
                <div class="cart-item-header">
                  <h4 class="cart-item-title"><a href="${item.url}">${item.product_title}</a></h4>
                  <button type="button" class="cart-item-remove" data-cart-item-action="remove" data-item-line="${line}" aria-label="Remove item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                ${options ? `<div class="cart-item-options">${options}</div>` : ''}
                <div class="cart-item-footer">
                  <div class="cart-qty-control">
                    <button type="button" class="qty-btn" data-cart-item-action="minus" data-item-line="${line}" data-item-qty="${item.quantity}">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" data-cart-quantity-input data-item-line="${line}">
                    <button type="button" class="qty-btn" data-cart-item-action="plus" data-item-line="${line}" data-item-qty="${item.quantity}">+</button>
                  </div>
                  <div class="cart-item-price">${Utils.formatMoney(item.final_line_price)}</div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  /* ==========================================================================
     4. Predictive Live Search Modal
     ========================================================================== */
  class PredictiveSearch {
    constructor() {
      this.modal = document.getElementById('search-modal');
      if (!this.modal) return;

      this.openTriggers = document.querySelectorAll('[data-open-search]');
      this.closeBtn = this.modal.querySelector('[data-search-close]');
      this.input = this.modal.querySelector('#search-modal-input');
      this.resultsContainer = this.modal.querySelector('#search-modal-results');
      this.overlay = this.modal.querySelector('.search-modal-backdrop');

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
        if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
          this.close();
        }
      });
    }

    open() {
      this.modal.classList.add('is-open');
      document.body.classList.add('overflow-hidden');
      if (this.input) {
        setTimeout(() => this.input.focus(), 150);
      }
    }

    close() {
      this.modal.classList.remove('is-open');
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
     8. Quick View Ajax Modal
     ========================================================================== */
  class QuickViewModal {
    constructor() {
      this.modal = document.getElementById('quick-view-modal');
      if (!this.modal) return;

      this.closeBtn = this.modal.querySelector('[data-modal-close]');
      this.content = this.modal.querySelector('#quick-view-content');
      this.backdrop = this.modal.querySelector('.modal-backdrop');

      this.bindEvents();
    }

    bindEvents() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-quick-view]');
        if (!trigger) return;
        e.preventDefault();
        const handle = trigger.dataset.productHandle;
        if (handle) this.open(handle);
      });

      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('is-open')) this.close();
      });
    }

    async open(handle) {
      this.modal.classList.add('is-open');
      document.body.classList.add('overflow-hidden');
      this.content.innerHTML = '<div class="quick-view-loading">Summoning Atelier Details...</div>';

      try {
        const res = await fetch(`/products/${handle}.js`);
        const product = await res.json();
        this.renderProduct(product);
      } catch (err) {
        this.content.innerHTML = '<div class="quick-view-error">Unable to load product preview.</div>';
      }
    }

    close() {
      this.modal.classList.remove('is-open');
      document.body.classList.remove('overflow-hidden');
    }

    renderProduct(product) {
      const firstVariant = product.variants[0];
      const hasVariants = product.variants.length > 1;

      this.content.innerHTML = `
        <div class="quick-view-grid">
          <div class="quick-view-gallery">
            <img src="${product.featured_image}" alt="${product.title}" class="quick-view-main-image" width="400" height="400">
          </div>
          <div class="quick-view-details">
            <span class="quick-view-eyebrow">LACEYAAN ATELIER</span>
            <h2 class="quick-view-title">${product.title}</h2>
            <div class="quick-view-price">${Utils.formatMoney(firstVariant.price)}</div>
            <div class="quick-view-desc">${product.description ? product.description.substring(0, 160) + '...' : ''}</div>

            <form action="/cart/add" method="post" class="quick-view-form">
              <input type="hidden" name="id" value="${firstVariant.id}">
              ${hasVariants ? `
                <div class="quick-view-variants">
                  <label class="variant-label">Select Variant</label>
                  <select class="variant-select" onchange="this.form.id.value = this.value">
                    ${product.variants.map(v => `<option value="${v.id}">${v.title} - ${Utils.formatMoney(v.price)}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
              <button type="submit" class="btn btn-primary btn-block quick-view-submit">
                <span>ACQUIRE PAIR &bull; ADD TO BAG</span>
              </button>
            </form>
            <a href="${product.url}" class="quick-view-full-link">View Full Editorial Dossier &rarr;</a>
          </div>
        </div>
      `;
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
     DOM Ready & Shopify Theme Editor Events Initialization
     ========================================================================== */
  function initAll() {
    new AnnouncementBar();
    new Header();
    window.Laceyaan.cartDrawer = new CartDrawer();
    new PredictiveSearch();
    new BeforeAfterSlider();
    new LengthCalculator();
    new ProductVariantSelector();
    new QuickViewModal();
    new Accordion();
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
    new ProductVariantSelector();
    new Accordion();
    new AnnouncementBar();
  });

})();
