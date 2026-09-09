import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check, ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './DesignLabShowcase.css';

export default function DesignLabShowcase({ onQuickView, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('all');

  const labProducts = PRODUCTS.filter(p => p.category === 'design-lab');
  const vaultBox = labProducts.find(p => p.id === 'design-lab-4pack-capsule');
  const individualLaces = labProducts.filter(p => p.id !== 'design-lab-4pack-capsule');

  const laceStyles = [
    {
      id: 'wildcat-leopard-jacquard',
      name: 'Wildcat Leopard',
      pattern: 'Woven Jacquard Leopard',
      aglet: 'Matte Black Metal',
      price: '₹899',
      color: '#C29352',
      image: '/images/product-leopard.jpg'
    },
    {
      id: 'baroque-tapestry-crimson',
      name: 'Baroque Tapestry',
      pattern: 'Paisley Bandana Jacquard',
      aglet: 'White Ceramic Enamel',
      price: '₹949',
      color: '#8B1E28',
      image: '/images/product-paisley.jpg'
    },
    {
      id: 'tonal-olive-damier-camo',
      name: 'Olive Damier Camo',
      pattern: 'Geometric Micro-Damier',
      aglet: 'Tonal Olive Metal',
      price: '₹899',
      color: '#5A6348',
      image: '/images/product-olive.jpg'
    },
    {
      id: 'imperial-plum-waffle-weave',
      name: 'Imperial Plum Waffle',
      pattern: '3D Waffle Knit Herringbone',
      aglet: 'Tonal Plum Metal',
      price: '₹849',
      color: '#632B59',
      image: '/images/product-plum.jpg'
    }
  ];

  return (
    <section id="design-lab" className="design-lab-section section-padding">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="section-header text-center">
          <div className="design-lab-badge">
            <Sparkles size={13} />
            <span>ALCE DESIGN LAB // S'25 CAPSULE</span>
          </div>
          <h2 className="editorial-heading">Artisanal Jacquard & Tapestry Series</h2>
          <p className="section-subtitle">
            Beyond standard solids. Four high-density Jacquard loom tapestries featuring custom-coated 
            enamel aglets, presented in our signature textured collector's box.
          </p>
        </div>

        {/* Hero Showcase Grid */}
        <div className="lab-showcase-grid">
          {/* Main Authentic Product Photograph */}
          <div className="lab-media-card">
            <div className="lab-image-container">
              <img 
                src="/images/design-lab-collection.jpg" 
                alt="ALCE Design Lab S'25 Shoelaces Presentation Box" 
                className="lab-hero-photo"
              />
              <div className="lab-overlay-tag">
                <span className="vault-tag">ALCE DESIGN LAB • S'25 ARCHIVE</span>
                <span className="vault-edition">Limited to 500 Numbered Sets</span>
              </div>
            </div>

            {/* Quick 4-Pack Buy Bar */}
            {vaultBox && (
              <div className="vault-quick-bar">
                <div className="vault-info">
                  <h4>{vaultBox.title}</h4>
                  <span className="vault-save">Includes all 4 designer laces • Save ₹900</span>
                </div>
                <div className="vault-cta-group">
                  <div className="vault-price">
                    <span className="price-now">₹{vaultBox.price}</span>
                    <span className="price-was">₹{vaultBox.compareAtPrice}</span>
                  </div>
                  <button 
                    className="btn-gold btn-sm"
                    onClick={() => onAddToCart({
                      product: vaultBox,
                      selectedLength: '54"',
                      selectedSwatch: vaultBox.swatches[0],
                      selectedAglet: vaultBox.agletFinishes[0]
                    })}
                  >
                    <ShoppingBag size={14} />
                    <span>Get 4-Pack Vault</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4 Individual Laces Cards */}
          <div className="lab-details-col">
            <div className="lab-intro-box">
              <h3>The 4 Jacquard Silhouettes</h3>
              <p>
                Each lace in this capsule is woven on high-tension Jacquard shuttle looms rather than 
                printed, ensuring three-dimensional texture that never fades or wrinkles.
              </p>
            </div>

            <div className="individual-laces-grid">
              {individualLaces.map((product) => (
                <div key={product.id} className="lab-lace-card">
                  <div className="lace-card-thumb" onClick={() => onQuickView(product)}>
                    <img src={product.primaryImage} alt={product.title} />
                    <span className="badge badge-dark lace-badge">{product.badge}</span>
                  </div>

                  <div className="lace-card-meta">
                    <h4 className="lace-title" onClick={() => onQuickView(product)}>
                      {product.title.split('—')[0]}
                    </h4>
                    <span className="lace-subtitle">{product.subtitle.split('with')[0]}</span>
                    
                    <div className="lace-price-row">
                      <span className="lace-price">₹{product.price}</span>
                      {product.compareAtPrice && (
                        <span className="lace-compare">₹{product.compareAtPrice}</span>
                      )}
                    </div>

                    <div className="lace-card-buttons">
                      <button 
                        className="btn-primary btn-xs"
                        onClick={() => onAddToCart({
                          product,
                          selectedLength: '54"',
                          selectedSwatch: product.swatches[0],
                          selectedAglet: product.agletFinishes[0]
                        })}
                      >
                        <ShoppingBag size={13} />
                        <span>Add Pair</span>
                      </button>

                      <button 
                        className="btn-secondary btn-xs"
                        onClick={() => onQuickView(product)}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
