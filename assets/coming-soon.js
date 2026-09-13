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

});
