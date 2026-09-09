import React from 'react';
import { Check, ShoppingBag, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ toast, onClose, onOpenCart }) {
  if (!toast) return null;

  return (
    <div className="toast-notification">
      <div className="toast-content">
        <div className="toast-icon">
          <Check size={16} />
        </div>
        <div className="toast-text">
          <span className="toast-title">{toast.title || 'Added to Bag'}</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      </div>

      <div className="toast-actions">
        {toast.showCartBtn && (
          <button className="toast-view-cart-btn" onClick={onOpenCart}>
            <ShoppingBag size={13} />
            <span>View Bag</span>
          </button>
        )}
        <button className="toast-close-btn" onClick={onClose} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
