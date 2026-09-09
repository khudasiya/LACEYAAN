import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import './LookbookHotspots.css';

export default function LookbookHotspots({ onQuickView, onAddToCart }) {
  const [activeHotspotId, setActiveHotspotId] = useState(1);

  const hotspots = [
    {
      id: 1,
      x: 58, // percentage from left
      y: 54, // percentage from top
      productId: 'chunky-rope-natural-ecru',
      title: '10mm Chunky Rope Laces',
      shade: 'Natural Ecru',
      length: '45"',
      price: 899,
      image: '/images/product-rope.jpg',
      note: 'Styled loose on terrace retro trainer'
    },
    {
      id: 2,
      x: 69,
      y: 56,
      productId: 'solid-metal-aglet-custom-kit',
      title: 'Solid Brass Custom Aglets',
      shade: '24K Mirror Gold',
      length: 'Pack of 4',
      price: 799,
      image: '/images/product-aglets.jpg',
      note: 'CNC-engraved lace tips'
    },
    {
      id: 3,
      x: 32,
      y: 46,
      productId: 'vintage-aged-cotton-flat',
      title: 'Vintage Sun-Faded Flat Laces',
      shade: 'Butter Cream',
      length: '54"',
      price: 799,
      image: '/images/product-vintage.jpg',
      note: 'Left shoe custom accent swap'
    }
  ];

  const activeHotspot = hotspots.find(h => h.id === activeHotspotId) || hotspots[0];
  const relatedProduct = PRODUCTS.find(p => p.id === activeHotspot.productId);

  return (
    <section id="lookbook" className="lookbook-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="badge badge-gold">Shoppable Editorial</span>
          <h2 className="editorial-heading">Shop The On-Street Look</h2>
          <p className="section-subtitle">
            Click any interactive marker to inspect the exact weave, shade, and solid metal aglet 
            hardware styled in this lookbook shoot.
          </p>
        </div>

        <div className="lookbook-wrapper">
          {/* Main Hotspot Photo Frame */}
          <div className="lookbook-photo-frame">
            <img 
              src="/images/lookbook.jpg" 
              alt="Editorial Streetwear Sneaker Lookbook" 
              className="lookbook-photo"
              loading="lazy"
            />

            {/* Hotspot Dots */}
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                className={`hotspot-marker ${activeHotspotId === spot.id ? 'active' : ''}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onClick={() => setActiveHotspotId(spot.id)}
                aria-label={`View ${spot.title}`}
              >
                <div className="hotspot-pulse" />
                <div className="hotspot-core">
                  <Plus size={12} className="plus-icon" />
                </div>
              </button>
            ))}

            {/* Floating Popover on Photo (Desktop) */}
            {activeHotspot && (
              <div 
                className="hotspot-popover"
                style={{ 
                  left: `${Math.min(activeHotspot.x + 4, 65)}%`, 
                  top: `${Math.max(activeHotspot.y - 12, 10)}%` 
                }}
              >
                <div className="popover-close" onClick={() => setActiveHotspotId(null)}>
                  <X size={14} />
                </div>

                <div className="popover-media">
                  <img src={activeHotspot.image} alt={activeHotspot.title} />
                </div>

                <div className="popover-details">
                  <span className="popover-shade">{activeHotspot.shade} • {activeHotspot.length}</span>
                  <h4 className="popover-title">{activeHotspot.title}</h4>
                  <div className="popover-price">₹{activeHotspot.price}</div>
                  <div className="popover-note">{activeHotspot.note}</div>

                  <div className="popover-actions">
                    <button 
                      className="btn-primary btn-sm"
                      onClick={() => {
                        if (relatedProduct) {
                          onAddToCart({
                            product: relatedProduct,
                            selectedLength: activeHotspot.length,
                            selectedSwatch: relatedProduct.swatches[0],
                            selectedAglet: relatedProduct.agletFinishes[0]
                          });
                        }
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>Quick Add</span>
                    </button>

                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        if (relatedProduct) onQuickView(relatedProduct);
                      }}
                    >
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Editorial Feature & Story */}
          <div className="lookbook-aside">
            <span className="badge badge-dark">Volume 04 • The Cobblestone Shoot</span>
            <h3 className="lookbook-aside-title">Parisian Terrace Styling</h3>
            <p className="lookbook-aside-text">
              We paired our 10mm triple-braided ecru rope laces with brushed 24K solid gold screw tips 
              on an off-white vintage terrace silhouette. The result is a sculptural drape that holds 
              its tension effortlessly across cobblestone walks and long commutes.
            </p>

            <div className="lookbook-hotspots-nav">
              <span className="nav-title">Featured in this look:</span>
              <div className="hotspot-nav-list">
                {hotspots.map((spot) => (
                  <div 
                    key={spot.id}
                    className={`nav-item-card ${activeHotspotId === spot.id ? 'active' : ''}`}
                    onClick={() => setActiveHotspotId(spot.id)}
                  >
                    <img src={spot.image} alt={spot.title} />
                    <div className="nav-item-meta">
                      <span className="item-title">{spot.title}</span>
                      <span className="item-price">₹{spot.price} • {spot.shade}</span>
                    </div>
                    <ArrowRight size={14} className="nav-item-arrow" />
                  </div>
                ))}
              </div>
            </div>

            {/* Instagram Community Callout */}
            <div className="lookbook-instagram-callout">
              <div className="callout-header">
                <InstagramIcon size={16} className="insta-callout-icon" />
                <span className="callout-title">Editorial Feature Community</span>
              </div>
              <p className="callout-text">
                Tag <strong>@laceyaan_</strong> on Instagram wearing your custom silhouette upgrade to be featured in Volume 05.
              </p>
              <a 
                href="https://www.instagram.com/laceyaan_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="insta-community-btn"
                title="Follow laceyaan_ on Instagram"
              >
                <InstagramIcon size={14} />
                <span>Follow @laceyaan_</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
