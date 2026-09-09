import React, { useEffect } from 'react';
import PageHeaderBanner from '../components/PageHeaderBanner';
import LookbookHotspots from '../components/LookbookHotspots';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './PageViews.css';

export default function LookbookPage({ onQuickView, onAddToCart, onNavigatePage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stylingMoodboard = [
    {
      productId: 'chunky-rope-natural-ecru',
      title: 'Terrace Cobblestone Styling',
      silhouette: 'Retro Court & Minimalist Low-Tops',
      pairing: '10mm Chunky Braided Rope in Natural Ecru with 24K Gold Aglets',
      image: '/images/lookbook.jpg'
    },
    {
      productId: 'heritage-waxed-flat-sail',
      title: 'Monochrome Archival High-Top',
      silhouette: 'High-Top Leather Sneakers & Chelsea Lace-Ups',
      pairing: 'Heritage Waxed Flat in Vintage Sail & Pure White with Polished Silver',
      image: '/images/hero.jpg'
    },
    {
      productId: 'baroque-tapestry-crimson',
      title: 'Artisanal Tapestry Contrast',
      silhouette: 'Everyday Casual & Skate Sneakers',
      pairing: 'Baroque Bandana Jacquard with Pure White Ceramic Coated Aglets',
      image: '/images/product-paisley.jpg'
    }
  ];

  return (
    <div className="page-lookbook">
      <PageHeaderBanner
        breadcrumbs={[{ label: 'Editorial Street Lookbook' }]}
        badge="Volume 04 • The Parisian Terrace Shoot"
        title="Shoppable Street Lookbook"
        subtitle="Explore high-fashion streetwear pairings captured on location. Click interactive hotspot markers to inspect the exact weave texture, shade, and metal aglet finishes styled on each silhouette."
        onNavigatePage={onNavigatePage}
      />

      <div className="lookbook-page-content">
        <LookbookHotspots 
          onQuickView={onQuickView} 
          onAddToCart={onAddToCart} 
        />

        {/* Editorial Moodboard Section */}
        <section className="moodboard-section section-padding">
          <div className="container">
            <div className="section-header text-center">
              <span className="badge badge-gold">Styling Directive</span>
              <h2 className="editorial-heading">Curated On-Foot Pairings</h2>
              <p className="section-subtitle">
                How our design atelier pairs texture, weight, and solid brass hardware across contemporary sneaker silhouettes.
              </p>
            </div>

            <div className="moodboard-grid">
              {stylingMoodboard.map((item, i) => (
                <div key={i} className="moodboard-card">
                  <div className="moodboard-img-wrapper">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="moodboard-info">
                    <span className="moodboard-silhouette">{item.silhouette}</span>
                    <h3 className="moodboard-title">{item.title}</h3>
                    <p className="moodboard-pairing">{item.pairing}</p>
                    <button 
                      className="btn-text-gold"
                      onClick={() => {
                        const prod = PRODUCTS.find(p => p.id === item.productId);
                        if (prod && onQuickView) onQuickView(prod);
                        else onNavigatePage('shop');
                      }}
                    >
                      <span>Inspect & Shop Pair</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
