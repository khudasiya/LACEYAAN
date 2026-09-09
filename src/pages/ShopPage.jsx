import React, { useEffect } from 'react';
import PageHeaderBanner from '../components/PageHeaderBanner';
import ProductGrid from '../components/ProductGrid';

export default function ShopPage({
  selectedCategory,
  onSelectCategory,
  filterLength,
  onClearLengthFilter,
  onQuickView,
  onAddToCart,
  onNavigatePage
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="page-shop">
      <PageHeaderBanner
        breadcrumbs={[{ label: 'The Lace Collection' }]}
        badge="Complete Atelier Catalog"
        title="The Lace Collection"
        subtitle="18 bespoke weaves engineered for luxury silhouettes. Featuring 100% Japanese beeswax cottons, 10mm chunky ropes, midnight velvet, carbon aramid, and solid CNC-machined brass aglets."
        onNavigatePage={onNavigatePage}
      />

      <div className="shop-content-wrapper">
        <ProductGrid
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          filterLength={filterLength}
          onClearLengthFilter={onClearLengthFilter}
        />
      </div>
    </div>
  );
}
