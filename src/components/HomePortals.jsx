import React from 'react';
import { ArrowRight, Compass, Sliders, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import './HomePortals.css';

export default function HomePortals({ onNavigatePage }) {
  const portals = [
    {
      id: 'shop',
      tag: 'Catalog',
      title: 'Full Lace Collection',
      description: 'Browse all 18 styles across waxed flat cotton, 10mm chunky rope, midnight velvet, carbon aramid, and solid brass aglets.',
      image: '/images/product-waxed.jpg',
      cta: 'Explore All Laces',
      badge: '18 Styles'
    },
    {
      id: 'length-guide',
      tag: 'Fit Tool',
      title: 'Length Calculator',
      description: 'Interactive sizing for Sneakers, Sport Shoes, Office Wear, Chelsea Boots, and custom eyelet counts. Never guess length again.',
      image: '/images/after.jpg',
      cta: 'Calculate My Length',
      badge: 'Interactive'
    },
    {
      id: 'before-after',
      tag: 'Comparison',
      title: 'Before & After Studio',
      description: 'Interactive split drag slider. See how swapping flimsy factory polyester transforms sneaker silhouettes.',
      image: '/images/hero.jpg',
      cta: 'Try Split Slider',
      badge: 'Interactive'
    },
    {
      id: 'lookbook',
      tag: 'Editorial',
      title: 'Streetwear Lookbook',
      description: 'Volume 04 on Parisian terrace stone. Click shoppable hotspot markers to inspect weave and aglet styling.',
      image: '/images/lookbook.jpg',
      cta: 'View Lookbook',
      badge: 'Shoppable'
    }
  ];

  return (
    <section className="home-portals-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <div className="portals-badge">
            <Compass size={14} />
            <span>Discover The Atelier Experience</span>
          </div>
          <h2 className="editorial-heading">Explore Dedicated Studios</h2>
          <p className="section-subtitle">
            From our interactive fit calculator to on-street lookbooks and material transformation labs.
          </p>
        </div>

        <div className="portals-grid">
          {portals.map((portal) => (
            <div 
              key={portal.id} 
              className="portal-card"
              onClick={() => onNavigatePage(portal.id)}
            >
              <div className="portal-image-wrapper">
                <img src={portal.image} alt={portal.title} loading="lazy" />
                <div className="portal-image-overlay" />
                <span className="badge badge-dark portal-badge">{portal.badge}</span>
              </div>

              <div className="portal-content">
                <span className="portal-tag">{portal.tag}</span>
                <h3 className="portal-title">{portal.title}</h3>
                <p className="portal-desc">{portal.description}</p>
                <div className="portal-cta">
                  <span>{portal.cta}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
