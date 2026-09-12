/**
 * LACEYAAN — Coming Soon Theme JavaScript
 * Handles inline notify expansion, 3D card tilt, phosphor glow mode, and specimen modal inspection.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. INLINE NOTIFY MORPHING EXPANSION
     ========================================================================== */
  const notifyTriggerBtn = document.getElementById('lyNotifyTriggerBtn');
  const triggerWrapper = document.getElementById('lyTriggerWrapper');
  const formExpandedWrapper = document.getElementById('lyFormExpandedWrapper');
  const notifyBox = document.getElementById('lyNotifyBox');
  const emailInput = document.getElementById('lyEmailInput');
  const cancelBtn = document.getElementById('lyFormCancelBtn');

  if (notifyTriggerBtn && formExpandedWrapper && triggerWrapper) {
    notifyTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Animate out trigger wrapper
      triggerWrapper.style.opacity = '0';
      triggerWrapper.style.transform = 'translateY(-8px)';
      
      setTimeout(() => {
        triggerWrapper.style.display = 'none';
        formExpandedWrapper.style.display = 'block';
        if (notifyBox) notifyBox.classList.add('is-expanded');
        
        // Auto-focus email input for seamless user experience
        if (emailInput) {
          emailInput.focus();
        }
      }, 180);
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        formExpandedWrapper.style.display = 'none';
        triggerWrapper.style.display = 'flex';
        triggerWrapper.style.opacity = '1';
        triggerWrapper.style.transform = 'translateY(0)';
        if (notifyBox) notifyBox.classList.remove('is-expanded');
      });
    }
  }

  /* ==========================================================================
     2. NIGHT MODE / PHOSPHOR GLOW TOGGLE
     ========================================================================== */
  const topGlowBtn = document.getElementById('lyGlowToggle');
  const sectionGlowBtn = document.getElementById('lySectionGlowBtn');
  const glowSpecimen = document.querySelector('.ly-glow-specimen');

  function toggleGlowMode() {
    const isNowActive = document.body.classList.toggle('ly-glow-active');
    
    if (topGlowBtn) {
      topGlowBtn.classList.toggle('is-active', isNowActive);
      const label = topGlowBtn.querySelector('.ly-glow-toggle-label');
      if (label) label.textContent = isNowActive ? 'GLOW ACTIVE' : 'GLOW MODE';
    }

    if (sectionGlowBtn) {
      const label = sectionGlowBtn.querySelector('.ly-glow-btn-label');
      if (label) label.textContent = isNowActive ? 'DEACTIVATE GLOW' : 'SWITCH TO NIGHT GLOW';
    }

    // Scroll to the glow specimen if clicked from section button
    if (isNowActive && glowSpecimen) {
      glowSpecimen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (topGlowBtn) {
    topGlowBtn.addEventListener('click', toggleGlowMode);
  }
  if (sectionGlowBtn) {
    sectionGlowBtn.addEventListener('click', toggleGlowMode);
  }

  /* ==========================================================================
     3. SNEAK PEEK REEL INTERACTIVE SELECTION
     ========================================================================== */
  const peekItems = document.querySelectorAll('.ly-peek-item');
  const spotlightTitle = document.getElementById('lySpotlightTitle');
  const spotlightMeta = document.getElementById('lySpotlightMeta');

  peekItems.forEach(item => {
    function activateItem() {
      peekItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');

      const idx = item.getAttribute('data-index');
      const name = item.getAttribute('data-name');
      const aglet = item.getAttribute('data-aglet');
      const weave = item.getAttribute('data-weave');

      if (spotlightTitle) {
        spotlightTitle.textContent = `0${idx} // ${name}`;
      }
      if (spotlightMeta) {
        spotlightMeta.textContent = `${weave} Weave • ${aglet} Laser Aglet`;
      }
    }

    item.addEventListener('click', activateItem);
    item.addEventListener('mouseenter', activateItem);
  });


  /* ==========================================================================
     5. STORE ACCESS PASSWORD MODAL
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

