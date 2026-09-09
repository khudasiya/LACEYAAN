import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import './BestSellers.css';

export default function BestSellers({ onQuickView, onAddToCart, onNavigatePage }) {
  const [activeTab, setActiveTab] = useState('all');

  // Curated best seller products
  const bestSellerIds = [
    'heritage-waxed-flat-sail',
    'pure-white-waxed-flat',
    'pure-black-waxed-flat',
    'chunky-rope-natural-ecru',
    'baroque-tapestry-crimson',
    'solid-metal-aglet-custom-kit'
  ];

  const bestSellerProducts = bestSellerIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean);

  const filteredProducts = activeTab === 'all' 
    ? bestSellerProducts 
    : bestSellerProducts.filter(p => p.category === activeTab);

  return (
    <section id="bestsellers" className="bestsellers-section section-padding">
      <div className="container">
        {/* Header */}
        <div className="section-header text-center">
          <div className="bestsellers-badge">
            <Flame size={14} className="badge-flame-icon" />
            <span>Curated Atelier Favorites</span>
          </div>
          <h2 className="editorial-heading">The Best Sellers</h2>
          <p className="section-subtitle">
            Our most requested weaves and finishes, trusted by sneaker collectors worldwide. 
            Proven drape, 100% combed beeswax cotton, and solid brass hardware.
          </p>

          {/* Quick Filter Tabs */}
          <div className="bestsellers-tabs">
            <button 
              className={`bestseller-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Best Sellers
            </button>
            <button 
              className={`bestseller-tab ${activeTab === 'waxed-flat' ? 'active' : ''}`}
              onClick={() => setActiveTab('waxed-flat')}
            >
              Waxed Flat Laces
            </button>
            <button 
              className={`bestseller-tab ${activeTab === 'chunky-rope' ? 'active' : ''}`}
              onClick={() => setActiveTab('chunky-rope')}
            >
              10mm Chunky Rope
            </button>
            <button 
              className={`bestseller-tab ${activeTab === 'hardware' ? 'active' : ''}`}
              onClick={() => setActiveTab('hardware')}
            >
              Solid Aglets
            </button>
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="bestsellers-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Explore Full Catalog Banner Callout */}
        <div className="catalog-callout-card">
          <div className="callout-left">
            <div className="callout-eyebrow">
              <Sparkles size={14} />
              <span>Explore The Full Collection</span>
            </div>
            <h3>Looking for specific silhouettes or lengths?</h3>
            <p>
              Browse all 18 artisanal styles including midnight velvet chenille, ballistic carbon aramid, 
              Italian calfskin leather, and the limited ALCE Design Lab capsules.
            </p>
          </div>
          <div className="callout-actions">
            <button 
              className="btn-primary"
              onClick={() => onNavigatePage('shop')}
            >
              <span>View Full Catalog (18 Styles)</span>
              <ArrowRight size={16} />
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigatePage('length-guide')}
            >
              <span>Length Calculator</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
