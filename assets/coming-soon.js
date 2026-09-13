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
     3. INTERACTIVE UNCOILED LACES (SMARTPHONE TAP & CLICK-OUTSIDE DISMISS)
     ========================================================================== */
  const staggerItems = document.querySelectorAll('.ly-stagger-item');

  staggerItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // If user clicked the Glow button, allow dedicated glow action without interfering
      if (e.target.closest('#lyLaceGlowBtn')) return;

      const isCurrentlyExtended = item.classList.contains('is-extended');

      // Close all other laces so only one unfolds at a time
      staggerItems.forEach((other) => {
        if (other !== item) other.classList.remove('is-extended');
      });

      // Toggle current lace
      if (isCurrentlyExtended) {
        item.classList.remove('is-extended');
      } else {
        item.classList.add('is-extended');
      }
    });

    // Keyboard accessibility (Enter or Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('#lyLaceGlowBtn')) return;
        e.preventDefault();
        item.click();
      }
    });
  });

  // Tapping/clicking anywhere else on the screen retracts any extended lace back to normal
  const dismissLaces = (e) => {
    if (!e.target.closest('.ly-stagger-item')) {
      staggerItems.forEach((item) => item.classList.remove('is-extended'));
    }
  };

  document.addEventListener('click', dismissLaces);
  document.addEventListener('touchend', dismissLaces, { passive: true });

});
