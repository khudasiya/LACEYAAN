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
     3. 3D CARD MAGNETIC TILT PHYSICS
     ========================================================================== */
  const cards = document.querySelectorAll('.ly-specimen-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });

  /* ==========================================================================
     4. SPECIMEN INSPECTION MODAL
     ========================================================================== */
  const inspectButtons = document.querySelectorAll('.ly-btn-inspect');
  const inspectModal = document.getElementById('lyInspectModal');
  const inspectOverlay = document.getElementById('lyInspectOverlay');
  const inspectClose = document.getElementById('lyInspectClose');
  const inspectContent = document.getElementById('lyInspectContent');

  const specimenDatabase = {
    "01": {
      id: "SPECIMEN #01",
      name: "JAGUAR ARCHIVE",
      category: "JACQUARD FLAT WEAVE",
      image: "lace-jaguar.jpg",
      aglet: "18K Gold PVD Stainless Steel with Laser-Etched 'LACEYAAN'",
      weave: "16-Strand High-Density Animalier Jacquard",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "Inspired by bespoke luxury streetwear, featuring a dense textured leopard weave that resists fraying and snagging. Finished with solid weighted gold aglets."
    },
    "02": {
      id: "SPECIMEN #02",
      name: "BLUSH PLAIN PINK",
      category: "100% COMBED COTTON",
      image: "lace-pink.jpg",
      aglet: "Polished Rose Gold Brass with Laser-Etched 'LACEYAAN'",
      weave: "Heavyweight Flat Cotton Herringbone",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "An ethereal blush pink profile created with triple-carded long-staple combed cotton for supreme softness and effortless lacing drape."
    },
    "03": {
      id: "SPECIMEN #03",
      name: "PURE MATTE BLACK",
      category: "JAPANESE WAXED FINISH",
      image: "lace-black.jpg",
      aglet: "Matte Obsidian Gunmetal with Precision Knurled Collar",
      weave: "Paraffin Dip-Waxed Cotton Weave",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "Deep triple-dyed matte noir treated with natural micro-crystalline wax for a structured hold, subtle sheen, and water-repellent durability."
    },
    "04": {
      id: "SPECIMEN #04",
      name: "CRISP OPTIC WHITE",
      category: "HERITAGE SNEAKER WEAVE",
      image: "lace-white.jpg",
      aglet: "Mirror-Polished Chrome with Micro-Laser Markings",
      weave: "High-Density Organic Cotton Flat Braid",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "The ultimate clean sneaker upgrade. Pure optic white threads engineered to hold firm tension and knot symmetry on heritage basketball silhouettes."
    },
    "05": {
      id: "SPECIMEN #05",
      name: "ESPRESSO PLAIN BROWN",
      category: "VINTAGE LEATHERETTE BRAID",
      image: "lace-brown.jpg",
      aglet: "Antiqued Brushed Brass with Serial Mark",
      weave: "Artisan Hand-Burnished Waxed Weave",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "A rich mocha espresso tone that pairs naturally with vintage and heritage leather sneakers. Burnished to develop a distinctive patina over time."
    },
    "06": {
      id: "SPECIMEN #06",
      name: "MIL-SPEC FOREST GREEN",
      category: "TACTICAL NYLON WEAVE",
      image: "lace-green.jpg",
      aglet: "Matte Forest Green Cerakote Finish",
      weave: "Ultra High-Tensile Weatherproof Ripstop Jacquard",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "Engineered for uncompromising resilience. Ripstop woven architecture dipped in military olive cerakote hardware that will never chip."
    },
    "07": {
      id: "SPECIMEN #07",
      name: "CANARY STREETWEAR YELLOW",
      category: "HIGH-CONTRAST POP",
      image: "lace-yellow.jpg",
      aglet: "Hard Anodized Jet Black Aluminum (Laser-Etched)",
      weave: "Textured Double-Braid High Visibility Core",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "A high-octane statement lace designed to create instant contrast against black, grey, or white sneakers. Vibrant pigment locked in at the fiber level."
    },
    "08": {
      id: "SPECIMEN #08",
      name: "GLOW IN THE DARK",
      category: "PHOTOLUMINESCENT TECH",
      image: "lace-glow.jpg",
      aglet: "Stealth Gunmetal Laser-Etched Aglet",
      weave: "Strontium Aluminate Night-Illuminated Core",
      length: "120cm & 140cm Standard Eyelet Fit",
      desc: "Absorbs ambient sunlight and indoor fluorescent energy to discharge a radiant electric cyan-green phosphorescent aura in low-light environments."
    }
  };

  function openInspector(targetId) {
    const data = specimenDatabase[targetId];
    if (!data || !inspectModal || !inspectContent) return;

    // Get asset base URL path
    const sampleImg = document.querySelector(`.ly-specimen-card[data-specimen="${targetId}"] .ly-specimen-img`);
    const imgSrc = sampleImg ? sampleImg.getAttribute('src') : '';

    inspectContent.innerHTML = `
      <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
        <div style="width: 220px; aspect-ratio: 1/1; border-radius: 8px; overflow: hidden; border: 1px solid var(--ly-border-medium); background: #000; flex-shrink: 0;">
          <img src="${imgSrc}" alt="${data.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex: 1; min-width: 260px;">
          <span style="font-family: var(--ly-font-mono); font-size: 0.72rem; color: var(--ly-gold); letter-spacing: 0.18em;">${data.id} // ${data.category}</span>
          <h3 style="font-family: var(--ly-font-display); font-size: 1.6rem; color: #fff; margin: 4px 0 12px; letter-spacing: 0.1em;">${data.name}</h3>
          <p style="font-size: 0.88rem; color: var(--ly-text-secondary); line-height: 1.6; margin-bottom: 16px;">${data.desc}</p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--ly-border-light); padding: 12px; border-radius: 6px; font-family: var(--ly-font-mono); font-size: 0.74rem; display: flex; flex-direction: column; gap: 6px;">
            <div><strong style="color: var(--ly-text-muted);">AGLET:</strong> <span style="color: #fff;">${data.aglet}</span></div>
            <div><strong style="color: var(--ly-text-muted);">WEAVE:</strong> <span style="color: #fff;">${data.weave}</span></div>
            <div><strong style="color: var(--ly-text-muted);">FIT:</strong> <span style="color: #fff;">${data.length}</span></div>
          </div>
          <div style="margin-top: 18px;">
            <span style="display: inline-block; font-family: var(--ly-font-mono); font-size: 0.7rem; color: var(--ly-gold); border: 1px solid var(--ly-gold); padding: 5px 12px; border-radius: 4px;">NON-PURCHASABLE SPECIMEN &bull; OFFICIAL LAUNCH SOON</span>
          </div>
        </div>
      </div>
    `;

    inspectModal.classList.add('is-open');
    inspectModal.setAttribute('aria-hidden', 'false');
  }

  function closeInspector() {
    if (inspectModal) {
      inspectModal.classList.remove('is-open');
      inspectModal.setAttribute('aria-hidden', 'true');
    }
  }

  inspectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      openInspector(targetId);
    });
  });

  if (inspectClose) inspectClose.addEventListener('click', closeInspector);
  if (inspectOverlay) inspectOverlay.addEventListener('click', closeInspector);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeInspector();
      if (passModal) passModal.classList.remove('is-open');
    }
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

