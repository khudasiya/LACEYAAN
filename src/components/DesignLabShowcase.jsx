import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check, ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './DesignLabShowcase.css';

export default function DesignLabShowcase({ onQuickView, onAddToCart }) {
  const labProducts = PRODUCTS.filter(p => p.category === 'design-lab');
  const vaultBox = labProducts.find(p => p.id === 'design-lab-4pack-capsule');
  const grandVault = PRODUCTS.find(p => p.id === 'atelier-grand-master-vault');
  const individualLaces = labProducts.filter(p => 
    p.id !== 'design-lab-4pack-capsule' && p.id !== 'atelier-grand-master-vault'
  );

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
          {/* Main Authentic Product Photograph & Sticky Feature Card */}
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

            {/* Capsule Craft Highlights */}
            <div className="vault-perks-list">
              <div className="vault-perk-item">
                <Check size={14} className="perk-icon" />
                <span>4 High-Density Shuttle Looms: Leopard, Baroque, Damier & Plum</span>
              </div>
              <div className="vault-perk-item">
                <Check size={14} className="perk-icon" />
                <span>Individually coated aglets: Ceramic White, Matte Black, Olive & Plum</span>
              </div>
              <div className="vault-perk-item">
                <Check size={14} className="perk-icon" />
                <span>Embossed matte black archival collector magnetic box</span>
              </div>
            </div>
          </div>

          {/* 4 Individual Laces Cards (Symmetrical 2x2 Grid) */}
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

        {/* Grand Master Archive Vault Collector Banner */}
        {grandVault && (
          <div className="vault-master-banner">
            <div className="vault-master-thumb" onClick={() => onQuickView(grandVault)}>
              <img src={grandVault.primaryImage} alt={grandVault.title} />
              <span className="vault-master-badge">Ultimate 8-Piece Vault</span>
            </div>
            <div className="vault-master-content">
              <div className="vault-master-header">
                <div>
                  <span className="vault-tag">ATELIER MASTER COLLECTION // 8 ARCHIVAL WEAVES</span>
                  <h3 onClick={() => onQuickView(grandVault)}>{grandVault.title}</h3>
                </div>
                <div className="vault-master-pricing">
                  <span className="price-now">₹{grandVault.price}</span>
                  <span className="price-was">₹{grandVault.compareAtPrice}</span>
                </div>
              </div>
              <p className="vault-master-desc">{grandVault.description}</p>
              <div className="vault-master-perks">
                <div className="master-perk-pill">
                  <ShieldCheck size={14} />
                  <span>8 Complete Pairs (Silk, Waxed, Rope, 3M, Velvet, Jacquard)</span>
                </div>
                <div className="master-perk-pill">
                  <Check size={14} />
                  <span>16 CNC Solid Metal Aglet Kit (Gold, Silver, Gunmetal)</span>
                </div>
                <div className="master-perk-pill">
                  <Sparkles size={14} />
                  <span>Steel Threading Key & 80g Organic Beeswax Puck</span>
                </div>
              </div>
              <div className="vault-master-actions">
                <button 
                  className="btn-gold"
                  onClick={() => onAddToCart({
                    product: grandVault,
                    selectedLength: '54" (Universal Standard)',
                    selectedSwatch: grandVault.swatches[0],
                    selectedAglet: grandVault.agletFinishes[0]
                  })}
                >
                  <ShoppingBag size={16} />
                  <span>Secure The 8-Piece Archive Chest</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => onQuickView(grandVault)}
                >
                  <Eye size={16} />
                  <span>Inspect Vault Details</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
