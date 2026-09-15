/**
 * LACEYAAN — Coming Soon Theme JavaScript
 * Handles VIP early access validation, dedicated glow lace toggle, and storefront password modal.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. DEDICATED GLOW LACE TOGGLE (Lace only, not website)
     ========================================================================== */
  const laceGlowBtn = document.getElementById('lyLaceGlowBtn');
  const glowCircleFrame = document.getElementById('lyGlowCircleFrame');
  const glowNode = document.getElementById('lyGlowNode');

  if (laceGlowBtn && glowCircleFrame) {
    laceGlowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isGlowing = glowCircleFrame.classList.toggle('is-glowing');
      if (glowNode) glowNode.classList.toggle('is-glowing', isGlowing);
      laceGlowBtn.classList.toggle('is-active', isGlowing);
      laceGlowBtn.setAttribute('aria-pressed', isGlowing ? 'true' : 'false');

      const label = laceGlowBtn.querySelector('.ly-glow-btn-label');
      if (label) {
        label.textContent = isGlowing ? 'GLOWING (TAP TO DIM)' : 'ACTIVATE GLOW';
      }
    });
  }

  /* ==========================================================================
     2. STORE ACCESS PASSWORD MODAL
     ========================================================================== */
  const passTrigger = document.getElementById('lyPasswordTrigger');
  const passModal = document.getElementById('lyPasswordModal');
  const passClose = document.getElementById('lyPasswordClose');
  const passOverlay = document.getElementById('lyPasswordOverlay');

  if (passTrigger && passModal) {
    passTrigger.addEventListener('click', () => {
      passModal.classList.add('is-open');
      passModal.setAttribute('aria-hidden', 'false');
      const passInput = passModal.querySelector('input[type="password"]');
      if (passInput) setTimeout(() => passInput.focus(), 100);
    });
  }
  if (passClose && passModal) {
    passClose.addEventListener('click', () => {
      passModal.classList.remove('is-open');
      passModal.setAttribute('aria-hidden', 'true');
    });
  }
  if (passOverlay && passModal) {
    passOverlay.addEventListener('click', () => {
      passModal.classList.remove('is-open');
      passModal.setAttribute('aria-hidden', 'true');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && passModal && passModal.classList.contains('is-open')) {
      passModal.classList.remove('is-open');
      passModal.setAttribute('aria-hidden', 'true');
    }
  });

  /* ==========================================================================
     3. SINGLE-ACTIVE INTERACTIVE LACE PALETTE (DESKTOP HOVER & MOBILE TAP)
     ========================================================================== */
  const staggerItems = document.querySelectorAll('.ly-stagger-item');
  let activeLaceId = null;
  let mouseLeaveTimeout = null;
  let lastTouchTimestamp = 0;

  // Track physical touch events to completely suppress simulated mouseenter/mouseleave on mobile
  window.addEventListener('touchstart', () => {
    lastTouchTimestamp = Date.now();
  }, { passive: true });

  function setActiveLace(laceId) {
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout);
      mouseLeaveTimeout = null;
    }
    activeLaceId = laceId;
    staggerItems.forEach((item) => {
      const isMatch = laceId !== null && item.dataset.laceId === laceId;
      item.classList.toggle('is-expanded', isMatch);
      item.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
    });
  }

  function clearActiveLace(delayMs = 0) {
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout);
      mouseLeaveTimeout = null;
    }
    if (delayMs > 0) {
      mouseLeaveTimeout = setTimeout(() => {
        setActiveLace(null);
      }, delayMs);
    } else {
      setActiveLace(null);
    }
  }

  staggerItems.forEach((item) => {
    const laceId = item.dataset.laceId;

    // Desktop hover: only execute if real mouse pointer (never on phone tap emulation)
    item.addEventListener('mouseenter', (e) => {
      // If a physical touch occurred within the last 700ms, ignore simulated hover
      if (Date.now() - lastTouchTimestamp < 700) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;

      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout);
        mouseLeaveTimeout = null;
      }
      setActiveLace(laceId);
    });

    // Desktop hover leave: only execute for genuine mouse pointer
    item.addEventListener('mouseleave', (e) => {
      if (Date.now() - lastTouchTimestamp < 700) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      clearActiveLace(100);
    });

    // Smartphone Tap & Desktop Click: guaranteed 1-click expansion
    item.addEventListener('click', (e) => {
      // Ignore clicks originating on the dedicated glow button
      if (e.target.closest('#lyLaceGlowBtn')) return;

      if (activeLaceId === laceId) {
        // Tapping the already expanded lace collapses it back to compact
        clearActiveLace(0);
      } else {
        // Tapping a lace immediately expands it in ONE click and closes any other
        setActiveLace(laceId);
      }
    });

    // Keyboard Accessibility (Enter/Space to toggle, Escape to close)
    item.addEventListener('keydown', (e) => {
      if (e.target.closest('#lyLaceGlowBtn')) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeLaceId === laceId) {
          clearActiveLace(0);
        } else {
          setActiveLace(laceId);
        }
      } else if (e.key === 'Escape') {
        clearActiveLace(0);
      }
    });

    // Focus state (keyboard tab navigation ONLY)
    item.addEventListener('focus', () => {
      if (Date.now() - lastTouchTimestamp < 700) return;
      setActiveLace(laceId);
    });
  });

  // Tapping or clicking anywhere outside collapses back to compact circular state
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ly-stagger-item')) {
      clearActiveLace(0);
    }
  });

  // Preload full studio photographs so they render instantaneously on first mobile tap
  const fullStageImages = document.querySelectorAll('.ly-stage-full');
  fullStageImages.forEach((img) => {
    if (img.src) {
      const pImg = new Image();
      pImg.src = img.src;
    }
  });

});
