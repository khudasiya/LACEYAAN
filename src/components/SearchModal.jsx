import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './SearchModal.css';

export default function SearchModal({ isOpen, onClose, onQuickView }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const trendingTags = [
    'Sneakers 54"',
    'Chunky Ecru Rope',
    '3M Reflective',
    'Office Shoes 36"',
    'Chelsea Boots 72"',
    'Heritage Waxed Flat'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = query.trim() === '' 
    ? [] 
    : PRODUCTS.filter((p) => {
        const q = query.toLowerCase().trim();
        const terms = q.split(/\s+/).filter(Boolean);
        return terms.some(term => 
          p.title.toLowerCase().includes(term) ||
          p.categoryName.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.features && p.features.some(f => f.toLowerCase().includes(term))) ||
          p.swatches.some(s => s.name.toLowerCase().includes(term)) ||
          p.availableLengths.some(l => l.toLowerCase().includes(term))
        );
      });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      onQuickView(results[0]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <form className="search-input-header" onSubmit={handleSearchSubmit}>
          <Search size={22} className="search-main-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search laces, colors, footwear styles (e.g., Sneakers, Sport shoes, Chelsea boots, 10mm rope)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-main-input"
          />
          {query && (
            <button type="button" className="clear-query-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <button type="button" className="close-search-btn" onClick={onClose}>
            ESC
          </button>
        </form>

        {/* Quick Search Recommendations */}
        <div className="search-tags-row">
          <span className="tags-label">Trending Searches:</span>
          <div className="tags-list">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                className="search-tag-chip"
                onClick={() => setQuery(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Results */}
        <div className="search-results-pane">
          {query.trim() === '' ? (
            <div className="search-placeholder">
              <p>Type above or click a trending search to browse laceyaan's catalog.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="search-results-grid">
              {results.map((product) => (
                <div 
                  key={product.id} 
                  className="search-result-item"
                  onClick={() => {
                    onQuickView(product);
                    onClose();
                  }}
                >
                  <img src={product.primaryImage} alt={product.title} />
                  <div className="result-meta">
                    <span className="result-cat">{product.categoryName}</span>
                    <h4 className="result-title">{product.title}</h4>
                    <div className="result-price-row">
                      <span className="result-price">₹{product.price}</span>
                      <div className="stars">
                        <Star size={11} fill="#C5A880" color="#C5A880" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="result-arrow" />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-search-results">
              <p>No shoe laces found matching <strong>"{query}"</strong>.</p>
              <span>Try searching for "sail", "waxed", "brass", or "rope".</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
