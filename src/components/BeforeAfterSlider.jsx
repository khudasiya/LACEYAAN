import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeftRight, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider({ onQuickBuyProduct }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section id="before-after" className="before-after-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge badge-gold">The Visual Proof</span>
          <h2 className="editorial-heading">Factory Laces vs. laceyaan Craft</h2>
          <p className="section-subtitle">
            Drag the slider horizontally to reveal how a single lace swap completely transforms 
            standard footwear into an editorial runway custom.
          </p>
        </div>

        <div className="comparison-wrapper">
          {/* Main Interactive Comparison Frame */}
          <div 
            className="slider-container"
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
            }}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Background Layer) */}
            <img 
              src="/images/after.jpg" 
              alt="laceyaan 10mm Chunky Braided Rope Laces with Solid Brass Tips" 
              className="comparison-img after-img" 
              draggable={false}
            />

            {/* Before Image (Clipped Layer on Left) */}
            <div 
              className="before-layer"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img 
                src="/images/before.jpg" 
                alt="Cheap Factory Polyester White Laces" 
                className="comparison-img before-img" 
                draggable={false}
              />
            </div>

            {/* Draggable Divider Handle */}
            <div 
              className="slider-handle"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="handle-line" />
              <div className="handle-button" aria-label="Drag slider">
                <ArrowLeftRight size={16} />
              </div>
              <div className="handle-line" />
            </div>

            {/* Floating Context Labels */}
            <div className="label-pill label-before" style={{ opacity: sliderPosition < 15 ? 0 : 1 }}>
              <span className="pill-dot red" />
              <span>Standard Factory Laces</span>
            </div>

            <div className="label-pill label-after" style={{ opacity: sliderPosition > 85 ? 0 : 1 }}>
              <span className="pill-dot gold" />
              <span>laceyaan 10mm Rope + Brass Aglets</span>
            </div>
          </div>

          {/* Detailed Side-by-Side Contrast Panel */}
          <div className="comparison-details-card">
            <div className="details-header">
              <h3>The Difference in Every Dimension</h3>
              <p>Why over 12,000 collectors never keep factory laces on their footwear:</p>
            </div>

            <div className="comparison-matrix">
              <div className="matrix-col before-col">
                <span className="col-status">Factory Standard</span>
                <ul className="spec-list">
                  <li>✕ 100% cheap synthetic polyester</li>
                  <li>✕ Flimsy clear plastic aglets that crack</li>
                  <li>✕ Flat, lifeless silhouette with zero drape</li>
                  <li>✕ Comes untied repeatedly throughout the day</li>
                  <li>✕ Frays and curls after minimal wear</li>
                </ul>
              </div>

              <div className="matrix-col after-col">
                <span className="col-status highlight">laceyaan Upgrade</span>
                <ul className="spec-list">
                  <li><CheckCircle2 size={15} /> 100% Japanese long-staple combed cotton</li>
                  <li><CheckCircle2 size={15} /> Solid CNC-milled brass with laser engraving</li>
                  <li><CheckCircle2 size={15} /> Triple-weave volume & weighted architectural drape</li>
                  <li><CheckCircle2 size={15} /> Natural micro-beeswax infusion holds knots forever</li>
                  <li><CheckCircle2 size={15} /> 20,000 cycle tension durability promise</li>
                </ul>
              </div>
            </div>

            <div className="comparison-cta-row">
              <button 
                className="btn-gold"
                onClick={() => onQuickBuyProduct('chunky-rope-natural-ecru')}
              >
                <span>Upgrade This Look — ₹899</span>
                <ArrowRight size={16} />
              </button>
              <span className="delivery-note">⚡ Dispatches in 24 Hours • Free Exchanges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
