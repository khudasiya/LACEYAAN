import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import './Hero.css';

export default function Hero({ onShopClick, onCalculatorClick }) {
  const tickerItems = [
    'SOLID CNC-MILLED BRASS AGLETS',
    'JAPANESE SHUTTLE-LOOM COTTON',
    '30-DAY GUARANTEED FIT PROMISE',
    'ORGANIC NATURAL BEESWAX INFUSION',
    'ENGINEERED FOR SNEAKERS, SPORT SHOES, FORMAL & BOOTS',
    'COMPLIMENTARY SHIPPING ACROSS INDIA OVER ₹1,499',
    '18 BESPOKE WEAVES & COLLECTOR VAULTS',
    '12,000+ PAIRS UPGRADED GLOBALLY'
  ];

  return (
    <section className="hero-section">
      <div className="hero-media-wrapper">
        <img 
          src="/images/hero.jpg" 
          alt="laceyaan luxury shoelaces on bespoke footwear" 
          className="hero-image"
          loading="eager"
        />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="container hero-content-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={13} className="hero-sparkle" />
            <span>The New Standard in Footwear Craft</span>
          </div>

          <h1 className="hero-title">
            Elevate Every Step. <br />
            <em>Precision Laces</em> for Every Style.
          </h1>

          <p className="hero-description">
            Factory laces were made to save margins. laceyaan laces are engineered to honor design.
            Hand-finished in solid brass and Japanese combed cotton to elevate your sneakers, sport shoes, formal wear, and boots.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onShopClick}>
              <span>Shop All Laces</span>
              <ArrowRight size={16} />
            </button>

            <button className="btn-secondary hero-btn-secondary" onClick={onCalculatorClick}>
              <Compass size={16} />
              <span>Find Your Length</span>
            </button>
          </div>

          {/* Quick Stat Highlights */}
          <div className="hero-stats">
            <div className="stat-pill">
              <span className="stat-value">3.8mm</span>
              <span className="stat-label">Universal Eyelet Fit</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-value">20,000</span>
              <span className="stat-label">Tension Cycle Durability</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-value">100%</span>
              <span className="stat-label">Solid Milled Metal Aglets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Continuous Ticker Bar */}
      <div className="hero-ticker">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-bullet">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
