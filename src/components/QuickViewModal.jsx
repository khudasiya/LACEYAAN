import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Check, ChevronRight } from 'lucide-react';
import './QuickViewModal.css';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.primaryImage);
  const [selectedSwatch, setSelectedSwatch] = useState(product.swatches[0]);
  const [selectedLength, setSelectedLength] = useState(product.defaultLength);
  const [selectedAglet, setSelectedAglet] = useState(product.agletFinishes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAdd = () => {
    onAddToCart({
      product,
      selectedLength,
      selectedSwatch,
      selectedAglet,
      quantity
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="quickview-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          {/* Left: Product Media Gallery */}
          <div className="quickview-media">
            <div className="main-image-frame">
              <img src={activeImage} alt={product.title} className="quickview-main-img" />
              {product.badge && (
                <span className="badge badge-gold quickview-badge">{product.badge}</span>
              )}
            </div>

            <div className="thumbnail-row">
              <button 
                className={`thumb-btn ${activeImage === product.primaryImage ? 'active' : ''}`}
                onClick={() => setActiveImage(product.primaryImage)}
              >
                <img src={product.primaryImage} alt="Flat lay" />
              </button>
              <button 
                className={`thumb-btn ${activeImage === product.hoverImage ? 'active' : ''}`}
                onClick={() => setActiveImage(product.hoverImage)}
              >
                <img src={product.hoverImage} alt="On sneaker" />
              </button>
            </div>
          </div>

          {/* Right: Product Configuration & Buy Actions */}
          <div className="quickview-details">
            <div className="quickview-header">
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#C5A880" color="#C5A880" />
                  ))}
                </div>
                <span className="rating-count">{product.rating} ({product.reviewsCount} reviews)</span>
              </div>

              <h2 className="quickview-title">{product.title}</h2>
              <p className="quickview-subtitle">{product.subtitle}</p>

              <div className="quickview-price-row">
                <span className="quickview-price">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="quickview-compare">₹{product.compareAtPrice}</span>
                )}
                {product.compareAtPrice > product.price && (
                  <span className="badge badge-sale">
                    Save ₹{product.compareAtPrice - product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Urgency Stock Bar */}
            {product.stockLeft && (
              <div className="stock-urgency-bar">
                <span className="stock-dot" />
                <span>⚡ High Demand: Only <strong>{product.stockLeft} pairs</strong> remaining in stock.</span>
              </div>
            )}

            {/* Swatch Color Selector */}
            <div className="option-group">
              <div className="option-label">
                <span>Color Shade:</span>
                <strong>{selectedSwatch.name}</strong>
              </div>
              <div className="swatch-pills">
                {product.swatches.map((swatch) => (
                  <button
                    key={swatch.name}
                    className={`swatch-pill ${selectedSwatch.name === swatch.name ? 'active' : ''} ${!swatch.inStock ? 'disabled' : ''}`}
                    onClick={() => swatch.inStock && setSelectedSwatch(swatch)}
                    disabled={!swatch.inStock}
                  >
                    <span className="swatch-dot" style={{ backgroundColor: swatch.hex }} />
                    <span>{swatch.name}</span>
                    {!swatch.inStock && <span className="sold-out-tag">(Sold Out)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selector */}
            <div className="option-group">
              <div className="option-label">
                <span>Length:</span>
                <strong>{selectedLength}</strong>
              </div>
              <div className="length-pills">
                {product.availableLengths.map((len) => (
                  <button
                    key={len}
                    className={`len-pill ${selectedLength === len ? 'active' : ''}`}
                    onClick={() => setSelectedLength(len)}
                  >
                    <span>{len}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aglet Finish Selector */}
            {product.agletFinishes && product.agletFinishes.length > 0 && (
              <div className="option-group">
                <div className="option-label">
                  <span>Aglet Finish (Solid Milled Metal):</span>
                  <strong>{selectedAglet.name}</strong>
                </div>
                <div className="aglet-pills">
                  {product.agletFinishes.map((aglet) => (
                    <button
                      key={aglet.id}
                      className={`aglet-pill ${selectedAglet.id === aglet.id ? 'active' : ''}`}
                      onClick={() => setSelectedAglet(aglet)}
                    >
                      <span className="aglet-metal-sample" style={{ backgroundColor: aglet.color }} />
                      <span>{aglet.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add To Bag */}
            <div className="quickview-actions">
              <div className="quantity-stepper">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>

              <button 
                className={`btn-primary quickview-add-btn ${addedAnimation ? 'added' : ''}`}
                onClick={handleAdd}
              >
                {addedAnimation ? (
                  <>
                    <Check size={18} />
                    <span>Added To Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag — ₹{product.price * quantity}</span>
                  </>
                )}
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="quickview-perks">
              <div className="perk-item">
                <Truck size={15} />
                <span>Free express shipping across India over ₹1,499</span>
              </div>
              <div className="perk-item">
                <RefreshCw size={15} />
                <span>30-Day Guaranteed Fit free exchange</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={15} />
                <span>Solid brass aglets guarantee (never crack)</span>
              </div>
            </div>

            {/* Collapsible Info Tabs */}
            <div className="quickview-tabs">
              <div className="tab-headers">
                <button 
                  className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specs')}
                >
                  Specifications
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'fit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fit')}
                >
                  Silhouette Guide
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping & Returns
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'specs' && (
                  <ul className="quickview-feature-list">
                    {product.features ? product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    )) : (
                      <li>100% Japanese shuttle weave cotton with solid metal hardware.</li>
                    )}
                  </ul>
                )}
                {activeTab === 'fit' && (
                  <p className="tab-text">
                    For <strong>Chelsea & Leather Boots / High-Tops</strong>, select 63"–72". 
                    For <strong>Everyday Casual Sneakers</strong>, select 54" (or 45" for untied drape). 
                    For <strong>Sport, Running & Retro Court Shoes</strong>, select 45".
                    For <strong>Office & Formal Dress Shoes</strong>, select 36".
                  </p>
                )}
                {activeTab === 'shipping' && (
                  <p className="tab-text">
                    Orders placed before 2:00 PM IST ship same business day from our India & Global fulfillment hubs. 
                    Express shipping across India arrives in 2-3 business days. Free returns and length exchanges within 30 days.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
