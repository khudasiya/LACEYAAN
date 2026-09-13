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
      const passInput = passModal.querySelector('input[type="password"]');
      if (passInput) setTimeout(() => passInput.focus(), 100);
    });
  }
  if (passClose && passModal) {
    passClose.addEventListener('click', () => {
      passModal.classList.remove('is-open');
    });
  }
  if (passOverlay && passModal) {
    passOverlay.addEventListener('click', () => {
      passModal.classList.remove('is-open');
    });
  }

  /* ==========================================================================
     3. SINGLE-ACTIVE INTERACTIVE LACE PALETTE (DESKTOP HOVER & MOBILE TAP)
     ========================================================================== */
  const staggerItems = document.querySelectorAll('.ly-stagger-item');
  let activeLaceId = null;
  let mouseLeaveTimeout = null;

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

    // Desktop hover: mouseenter unrolls the lace horizontally
    item.addEventListener('mouseenter', () => {
      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout);
        mouseLeaveTimeout = null;
      }
      setActiveLace(laceId);
    });

    // Desktop hover leave: with a gentle 100ms grace period to avoid flicker
    item.addEventListener('mouseleave', () => {
      clearActiveLace(100);
    });

    // Keyboard & Mobile Tap Interaction
    item.addEventListener('click', (e) => {
      // Ignore click if originating from dedicated glow button
      if (e.target.closest('#lyLaceGlowBtn')) return;

      if (activeLaceId === laceId) {
        // Tapping the currently open lace collapses it
        clearActiveLace(0);
      } else {
        // Tapping a closed lace expands it and closes any other
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

    // Focus state (keyboard tab navigation)
    item.addEventListener('focus', () => {
      setActiveLace(laceId);
    });
  });

  // Tapping or clicking anywhere outside collapses back to compact circular state
  const dismissLaces = (e) => {
    if (!e.target.closest('.ly-stagger-item')) {
      clearActiveLace(0);
    }
  };

  document.addEventListener('click', dismissLaces);
  document.addEventListener('touchend', dismissLaces, { passive: true });

});
