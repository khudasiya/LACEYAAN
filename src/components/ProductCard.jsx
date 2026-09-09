import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) {
  const [activeSwatchIndex, setActiveSwatchIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedLength, setSelectedLength] = useState(product.defaultLength);

  const [localWishlisted, setLocalWishlisted] = useState(false);
  const isHeartActive = isWishlisted !== undefined ? isWishlisted : localWishlisted;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      setLocalWishlisted((prev) => !prev);
    }
  };

  const activeSwatch = product.swatches[activeSwatchIndex] || product.swatches[0];

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Media Wrapper */}
      <div className="product-media">
        {/* Badges */}
        <div className="product-badges">
          {product.badge && (
            <span className={`badge ${product.badge === 'Bestseller' ? 'badge-gold' : 'badge-dark'}`}>
              {product.badge}
            </span>
          )}
          {product.compareAtPrice > product.price && (
            <span className="badge badge-sale">
              Save ₹{Math.round(product.compareAtPrice - product.price)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className={`wishlist-btn ${isHeartActive ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isHeartActive ? '#E24A4A' : 'none'} color={isHeartActive ? '#E24A4A' : '#141311'} />
        </button>

        {/* Product Images with Dual-Image Hover Transition */}
        <div className="image-switch-wrapper" onClick={() => onQuickView(product)}>
          <img 
            src={product.primaryImage} 
            alt={product.title} 
            className={`product-img primary-img ${isHovered ? 'fade-out' : ''}`}
            loading="lazy"
          />
          <img 
            src={product.hoverImage} 
            alt={`${product.title} on sneaker`} 
            className={`product-img hover-img ${isHovered ? 'fade-in' : ''}`}
            loading="lazy"
          />
        </div>

        {/* Quick View / Quick Buy Overlays */}
        <div className="product-card-actions">
          <button 
            className="action-btn quick-view-btn"
            onClick={() => onQuickView(product)}
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
          <button 
            className="action-btn quick-buy-btn"
            onClick={() => onAddToCart({
              product,
              selectedLength,
              selectedSwatch: activeSwatch,
              selectedAglet: product.agletFinishes[0]
            })}
          >
            <ShoppingBag size={15} />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-info">
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill="#C5A880" 
                color="#C5A880" 
              />
            ))}
          </div>
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        <h3 className="product-title" onClick={() => onQuickView(product)}>
          {product.title}
        </h3>

        <div className="product-pricing">
          <span className="current-price">₹{product.price}</span>
          {product.compareAtPrice && (
            <span className="compare-price">₹{product.compareAtPrice}</span>
          )}
        </div>

        {/* Color Swatch Circles */}
        <div className="swatches-row">
          <div className="swatch-list">
            {product.swatches.map((swatch, idx) => (
              <button
                key={swatch.name}
                className={`swatch-circle ${activeSwatchIndex === idx ? 'active' : ''} ${!swatch.inStock ? 'out-of-stock' : ''}`}
                style={{ backgroundColor: swatch.hex }}
                onClick={() => setActiveSwatchIndex(idx)}
                title={`${swatch.name}${!swatch.inStock ? ' (Sold Out)' : ''}`}
              />
            ))}
          </div>
          <span className="active-swatch-label">{activeSwatch.name}</span>
        </div>

        {/* Length Quick Selector */}
        <div className="lengths-row">
          <span className="length-title">Sizes:</span>
          <div className="lengths-list">
            {product.availableLengths.map((len) => (
              <button
                key={len}
                className={`length-chip ${selectedLength === len ? 'active' : ''}`}
                onClick={() => setSelectedLength(len)}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
