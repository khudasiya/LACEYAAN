import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Check } from 'lucide-react';
import { CART_UPSELLS } from '../data/products';
import './CartDrawer.css';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddUpsell,
  onClearCart,
  onNavigatePage
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [cartNote, setCartNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 1499;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const applyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'SNEAKERHEAD10' || code === 'LACEYAAN10' || code === 'BROADCAST') {
      setDiscountPercent(10);
      setPromoSuccess('10% VIP discount applied!');
    } else if (code === 'FREESHIP') {
      setDiscountPercent(5);
      setPromoSuccess('Free shipping perk applied!');
    } else {
      setPromoError('Invalid code. Try "SNEAKERHEAD10"');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert(`🎉 Thank you for your order with laceyaan! Your order #LC-${Math.floor(10000 + Math.random() * 90000)} for ₹${total.toFixed(0)} has been placed successfully.`);
      setIsCheckingOut(false);
      onClearCart();
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} />
            <h3>Your Shopping Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</h3>
          </div>
          <div className="cart-header-actions">
            {cartItems.length > 0 && onClearCart && (
              <button className="cart-clear-btn" onClick={onClearCart} title="Clear all items">
                Clear All
              </button>
            )}
            <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Free Shipping Progress Bar */}
        <div className="free-shipping-bar">
          <div className="shipping-text">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span>🎉 <strong>Congratulations!</strong> You unlocked Free Express Shipping across India!</span>
            ) : (
              <span>
                Add <strong>₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)}</strong> more to unlock <strong>Free Shipping</strong>
              </span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div 
              className="shipping-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h4>Your bag is currently empty</h4>
              <p>Discover our precision Japanese weaves and elevate your sneakers today.</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  onClose();
                  if (onNavigatePage) onNavigatePage('shop');
                }}
              >
                <span>Browse Full Catalog</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, index) => {
                const itemKey = item.cartKey || `${item.id}-${index}`;
                return (
                  <div key={itemKey} className="cart-item">
                    <div className="cart-item-img">
                      <img src={item.image} alt={item.title} />
                    </div>

                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <h4 className="cart-item-title">{item.title}</h4>
                        <button 
                          className="cart-remove-btn"
                          onClick={() => onRemoveItem(item.cartKey || index)}
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="cart-item-variants">
                        <span>Shade: {item.selectedSwatch?.name || 'Default'}</span>
                        <span>Length: {item.selectedLength || 'Standard'}</span>
                        {item.selectedAglet && <span>Tips: {item.selectedAglet.name}</span>}
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-qty-control">
                          <button 
                            onClick={() => onUpdateQuantity(item.cartKey || index, item.quantity - 1)}
                            title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                            className="qty-btn"
                          >
                            {item.quantity === 1 ? <Trash2 size={11} className="qty-trash-icon" /> : '−'}
                          </button>
                          <span className="qty-display">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.cartKey || index, item.quantity + 1)}
                            title="Increase quantity"
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-price">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Broadcast Upsell Add-ons Carousel */}
              <div className="cart-upsells-section">
                <span className="upsells-title">Complete Your Shoe Care:</span>
                <div className="upsells-list">
                  {CART_UPSELLS.map((upsell) => {
                    const existingUpsell = cartItems.find(i => i.id === upsell.id);
                    return (
                      <div key={upsell.id} className="upsell-card">
                        <img src={upsell.image} alt={upsell.title} />
                        <div className="upsell-meta">
                          <span className="upsell-name">{upsell.title}</span>
                          <span className="upsell-price">₹{upsell.price}</span>
                        </div>
                        <button 
                          className={`upsell-add-btn ${existingUpsell ? 'added' : ''}`}
                          onClick={() => onAddUpsell(upsell)}
                        >
                          {existingUpsell ? (
                            <>
                              <Check size={13} />
                              <span>Added ({existingUpsell.quantity})</span>
                            </>
                          ) : (
                            <>
                              <Plus size={13} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Notes Accordion */}
              <div className="cart-note-box">
                <button 
                  className="cart-note-toggle"
                  onClick={() => setShowNote(!showNote)}
                >
                  <span>{showNote ? '— Hide order instructions' : '+ Add custom instructions / footwear style note'}</span>
                </button>
                {showNote && (
                  <textarea
                    className="cart-note-input"
                    rows="2"
                    placeholder="E.g., Please include sneaker or boot lacing guide"
                    value={cartNote}
                    onChange={(e) => setCartNote(e.target.value)}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Input */}
            <form className="promo-form" onSubmit={applyPromo}>
              <div className="promo-input-wrapper">
                <Tag size={14} className="promo-tag-icon" />
                <input
                  type="text"
                  placeholder="Promo code (try SNEAKERHEAD10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="promo-apply-btn">Apply</button>
              </div>
              {promoSuccess && <div className="promo-success">{promoSuccess}</div>}
              {promoError && <div className="promo-error">{promoError}</div>}
            </form>

            {/* Calculations Breakdown */}
            <div className="cart-summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="breakdown-row discount-row">
                  <span>VIP Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="breakdown-row">
                <span>Express Shipping</span>
                <span>{shippingCost === 0 ? <strong className="free-tag">FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              <div className="breakdown-row total-row">
                <span>Estimated Total</span>
                <span>₹{total.toFixed(0)} INR</span>
              </div>
            </div>

            {/* Main Checkout Button */}
            <button 
              className={`btn-primary w-full checkout-btn ${isCheckingOut ? 'loading' : ''}`}
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Checkout Now</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Express Checkout Simulation (Broadcast feature) */}
            <div className="express-checkout-row">
              <span className="express-label">Express Checkout:</span>
              <div className="express-buttons">
                <button 
                  type="button" 
                  className="express-pill shop-pay" 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                  title="Checkout with Shop Pay"
                >
                  Shop Pay
                </button>
                <button 
                  type="button" 
                  className="express-pill apple-pay" 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                  title="Checkout with Apple Pay"
                >
                   Pay
                </button>
                <button 
                  type="button" 
                  className="express-pill g-pay" 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                  title="Checkout with Google Pay"
                >
                  G Pay
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="cart-trust-row">
              <ShieldCheck size={14} />
              <span>256-Bit SSL Encrypted • 30-Day Guaranteed Fit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
