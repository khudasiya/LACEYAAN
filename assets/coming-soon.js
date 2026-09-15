/**
 * LACEYAAN — Coming Soon Theme JavaScript
 * Dedicated functionality for private Coming Soon page:
 * - VIP early access validation & smooth UX
 * - Dedicated glow lace toggle (Strontium Phosphor)
 * - Storefront password modal trigger & auto-focus
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. DEDICATED GLOW LACE TOGGLE (Lace only, matching Screenshot 5)
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
        label.textContent = isGlowing ? 'GLOW ACTIVE' : 'ACTIVATE GLOW';
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
      if (passInput) setTimeout(() => passInput.focus(), 150);
    });
  }

  function closeModal() {
    if (passModal) {
      passModal.classList.remove('is-open');
      passModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (passClose) passClose.addEventListener('click', closeModal);
  if (passOverlay) passOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && passModal && passModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ==========================================================================
     3. SMOOTH ANCHOR SCROLL
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});
