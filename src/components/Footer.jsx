import React, { useState } from 'react';
import { ArrowRight, Mail, Check, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import './Footer.css';

export default function Footer({ onSelectCategory, onNavigateSection, onNavigatePage, onOpenProfile }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 2500);
    }
  };

  return (
    <footer className="site-footer">
      {/* Footer Value Highlights Row */}
      <div className="footer-highlights-bar">
        <div className="container highlights-inner">
          <div className="highlight-item">
            <Truck size={18} />
            <div>
              <strong>Complimentary Shipping</strong>
              <span>On all domestic orders over ₹1,499</span>
            </div>
          </div>

          <div className="highlight-item">
            <RefreshCw size={18} />
            <div>
              <strong>30-Day Fit Guarantee</strong>
              <span>Wrong length? Exchange completely free</span>
            </div>
          </div>

          <div className="highlight-item">
            <ShieldCheck size={18} />
            <div>
              <strong>Solid Metal Hardware</strong>
              <span>CNC-machined brass will never split or peel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="container footer-main">
        <div className="footer-grid">
          {/* Col 1: Brand & Atelier */}
          <div className="footer-col brand-col">
            <div 
              className="footer-brand-lockup" 
              onClick={() => onNavigatePage && onNavigatePage('home')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/images/logo-icon-white.png" alt="Laceyaan Logo Mark" className="footer-logo-img" />
              <div className="footer-brand-text">
                <span className="footer-logo">LACEYAAN</span>
                <span className="footer-tagline">CRAFTED IN INDIA</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Precision shoelaces engineered in India. Bringing bespoke textile 
              craftsmanship, master Jacquard tapestry weaves, velvet chenille, and solid brass hardware to the world's 
              most celebrated sneaker silhouettes.
            </p>
            <div className="footer-locations">
              <span>India Design Lab • New Delhi Atelier</span>
              <span>Complimentary Domestic Express Shipping</span>
            </div>
            
            <div className="footer-direct-contact">
              <span className="contact-label">Official Inquiries & Contact:</span>
              <a href="mailto:laceyaan@gmail.com" className="footer-email-link" title="Send email to laceyaan">
                <Mail size={14} />
                <span>laceyaan@gmail.com</span>
              </a>
              <a 
                href="https://www.instagram.com/laceyaan_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-instagram-link" 
                title="Follow @laceyaan_ on Instagram"
              >
                <InstagramIcon size={14} />
                <span>Instagram: @laceyaan_</span>
              </a>
            </div>

            {/* Clickable Social Icon Button */}
            <div className="footer-social-icon-row">
              <span className="social-icon-label">Connect:</span>
              <a 
                href="https://www.instagram.com/laceyaan_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon-badge"
                title="Click Instagram Icon to visit @laceyaan_"
                aria-label="Follow laceyaan on Instagram"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Shop Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Shop Collections</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => { onSelectCategory('waxed-flat'); onNavigatePage && onNavigatePage('shop'); }}>
                  Heritage Waxed Flat (Sneakers & Lifestyle)
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('chunky-rope'); onNavigatePage && onNavigatePage('shop'); }}>
                  10mm Chunky Braided Rope (Sport & Casual)
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('velvet-couture'); onNavigatePage && onNavigatePage('shop'); }}>
                  Midnight Velvet Silk Chenille
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('reflective'); onNavigatePage && onNavigatePage('shop'); }}>
                  3M™ Nocturnal & Ballistic Carbon
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('vintage'); onNavigatePage && onNavigatePage('shop'); }}>
                  Vintage Sun-Faded & Ombré
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('luxury-leather'); onNavigatePage && onNavigatePage('shop'); }}>
                  Artisan Calfskin Leather
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('design-lab'); onNavigatePage && onNavigatePage('shop'); }}>
                  Design Lab & Grand Master Vaults
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance & Tools */}
          <div className="footer-col">
            <h4 className="footer-heading">Support & Studios</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => onNavigatePage && onNavigatePage('length-guide')}>
                  📏 Shoelace Length Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage && onNavigatePage('before-after')}>
                  🔄 Before & After Upgrade Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage && onNavigatePage('lookbook')}>
                  📸 Editorial Street Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage && onNavigatePage('story')}>
                  🧵 Atelier Story & Craftsmanship
                </button>
              </li>
              <li>
                <button onClick={() => onOpenProfile && onOpenProfile('orders')}>
                  👤 My Profile & Order History
                </button>
              </li>
              <li>
                <button onClick={() => onOpenProfile && onOpenProfile('vault')}>
                  📐 My Footwear Sizing Vault
                </button>
              </li>
              <li>
                <a href="mailto:laceyaan@gmail.com" className="footer-email-action-link" title="Direct Email Support">
                  ✉️ Concierge: laceyaan@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/laceyaan_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer-instagram-action-link" 
                  title="Follow @laceyaan_ on Instagram"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram: @laceyaan_</span>
                </a>
              </li>
              <li>
                <button onClick={() => {
                  if (onNavigatePage) onNavigatePage('home');
                  setTimeout(() => {
                    const el = document.getElementById('faq');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: VIP Club Newsletter & Gmail Box */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-heading">The laceyaan Club</h4>
            <p className="newsletter-copy">
              Subscribe for early access to limited weave drops, collector collaborations, and 
              receive <strong>10% off</strong> your first order.
            </p>

            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <div className="newsletter-input-wrap">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                  {newsletterSuccess ? <Check size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
              {newsletterSuccess && (
                <div className="newsletter-alert">
                  ✓ Welcome to the club! Use code <strong>SNEAKERHEAD10</strong> at checkout.
                </div>
              )}
            </form>

            {/* Dedicated Gmail / Atelier Support Box */}
            <div className="footer-gmail-card">
              <div className="gmail-card-header">
                <Mail size={14} className="gmail-card-icon" />
                <span className="gmail-card-title">Gmail & Bespoke Concierge</span>
              </div>
              <a href="mailto:laceyaan@gmail.com" className="gmail-card-link" title="Write to laceyaan@gmail.com">
                laceyaan@gmail.com
              </a>
              <span className="gmail-card-sub">Direct atelier response within 4 hours.</span>
            </div>

            {/* Instagram Follow Pill */}
            <div className="footer-instagram-banner">
              <div className="insta-banner-header">
                <a 
                  href="https://www.instagram.com/laceyaan_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="insta-icon-link-btn"
                  title="Click Instagram icon to visit @laceyaan_"
                  aria-label="Open Instagram @laceyaan_"
                >
                  <InstagramIcon size={16} className="insta-banner-icon" />
                </a>
                <span className="insta-banner-label">Follow On Instagram</span>
              </div>
              <a 
                href="https://www.instagram.com/laceyaan_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="insta-handle-link"
                title="Open Instagram @laceyaan_"
              >
                @laceyaan_ ↗
              </a>
              <span className="insta-banner-sub">Tag us for features & weekly Grail Swaps.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Instagram & Payment Badges */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2026 laceyaan Co. All rights reserved. Designed with the precision of the Broadcast aesthetic.</p>
          </div>

          <div className="footer-bottom-social-bar">
            <span className="social-pill-label">Follow Us:</span>
            <a 
              href="https://www.instagram.com/laceyaan_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill-btn"
              title="Click Instagram icon to open @laceyaan_"
              aria-label="Instagram @laceyaan_"
            >
              <InstagramIcon size={16} />
              <span>@laceyaan_</span>
            </a>
          </div>

          <div className="payment-badges-row">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">MC</span>
            <span className="payment-badge">AMEX</span>
            <span className="payment-badge">APPLE PAY</span>
            <span className="payment-badge">SHOP PAY</span>
            <span className="payment-badge">PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
