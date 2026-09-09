import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import './ProductGrid.css';

export default function ProductGrid({ 
  selectedCategory, 
  onSelectCategory, 
  onQuickView, 
  onAddToCart,
  filterLength,
  onClearLengthFilter
}) {
  const [sortOption, setSortOption] = useState('featured');
  const [activeLengthFilter, setActiveLengthFilter] = useState(filterLength || 'all');
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    setActiveLengthFilter(filterLength || 'all');
  }, [filterLength]);

  const categories = [
    { id: 'all', name: 'All Laces (18)' },
    { id: 'design-lab', name: 'Collector Vaults ★' },
    { id: 'waxed-flat', name: 'Waxed Flat & Split' },
    { id: 'chunky-rope', name: '10mm Chunky Rope' },
    { id: 'velvet-couture', name: 'Velvet Silk Couture' },
    { id: 'reflective', name: '3M & Carbon Technical' },
    { id: 'vintage', name: 'Vintage & Ombré' },
    { id: 'luxury-leather', name: 'Calfskin Leather' },
    { id: 'hardware', name: 'Solid Metal Kits' }
  ];

  const lengths = ['all', '36"', '45"', '54"', '63"', '72"'];

  const toggleWishlist = (productId) => {
    setWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Length filter
      const lengthToMatch = filterLength || (activeLengthFilter !== 'all' ? activeLengthFilter : null);
      if (lengthToMatch && lengthToMatch !== 'all') {
        if (!product.availableLengths.includes(lengthToMatch) && !product.availableLengths.includes('Universal Fit (Pack of 4)')) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'bestseller') return b.reviewsCount - a.reviewsCount;
      return 0; // featured
    });
  }, [selectedCategory, activeLengthFilter, filterLength, sortOption]);

  return (
    <section id="collection" className="product-grid-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="badge badge-gold">Curated Collection</span>
          <h2 className="editorial-heading">Precision Laces & Hardware</h2>
          <p className="section-subtitle">
            Engineered weave densities, organic beeswax finishes, and CNC-machined metal aglets. 
            Crafted for the purist.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-wrapper">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sorting Toolbar */}
        <div className="toolbar-row">
          {/* Length Filter Pills */}
          <div className="length-filter-group">
            <span className="filter-group-label">Filter Length:</span>
            <div className="filter-pills">
              {lengths.map((len) => (
                <button
                  key={len}
                  className={`filter-pill ${activeLengthFilter === len ? 'active' : ''}`}
                  onClick={() => {
                    setActiveLengthFilter(len);
                    if (onClearLengthFilter) onClearLengthFilter();
                  }}
                >
                  {len === 'all' ? 'All Sizes' : len}
                </button>
              ))}
            </div>
            {filterLength && (
              <button className="clear-filter-btn" onClick={onClearLengthFilter}>
                Clear "{filterLength}" filter ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown & Product Count */}
          <div className="sort-group">
            <span className="products-count">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
            <div className="sort-select-wrapper">
              <ArrowUpDown size={14} className="sort-icon" />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="featured">Sort: Featured</option>
                <option value="bestseller">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={!!wishlist[product.id]}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="empty-grid-state">
            <p>No shoe laces found matching your selected length and category filters.</p>
            <button 
              className="btn-primary"
              onClick={() => {
                onSelectCategory('all');
                setActiveLengthFilter('all');
                if (onClearLengthFilter) onClearLengthFilter();
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
