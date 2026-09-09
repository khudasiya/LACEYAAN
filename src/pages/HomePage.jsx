import React from 'react';
import Hero from '../components/Hero';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import BestSellers from '../components/BestSellers';
import DesignLabShowcase from '../components/DesignLabShowcase';
import HomePortals from '../components/HomePortals';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';

export default function HomePage({
  onQuickView,
  onAddToCart,
  onNavigatePage,
  onSelectCategory
}) {
  return (
    <div className="page-home">
      {/* Editorial Hero Banner */}
      <Hero
        onShopClick={() => onNavigatePage('shop')}
        onCalculatorClick={() => onNavigatePage('length-guide')}
      />

      {/* Before & After Interactive Transformation Slider (Immediately after Hero) */}
      <BeforeAfterSlider
        onQuickBuyProduct={(product) => {
          if (onAddToCart) {
            onAddToCart({
              product,
              selectedLength: '54"',
              selectedSwatch: product.swatches ? product.swatches[0] : null,
              selectedAglet: product.agletFinishes ? product.agletFinishes[0] : null
            });
          }
        }}
      />

      {/* Best Sellers Showcase (Kept on Home page as requested) */}
      <BestSellers
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        onNavigatePage={onNavigatePage}
        onSelectCategory={onSelectCategory}
      />

      {/* ALCE Design Lab S'25 Limited Edition Spotlight */}
      <DesignLabShowcase
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
      />

      {/* Studio Exploration Portals to other dedicated pages */}
      <HomePortals
        onNavigatePage={onNavigatePage}
      />

      {/* Press Coverage & Collector Reviews */}
      <Reviews />

      {/* Frequently Asked Questions */}
      <FAQ />
    </div>
  );
}
