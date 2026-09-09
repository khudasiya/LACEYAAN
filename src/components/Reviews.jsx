import React from 'react';
import { PRESS_QUOTES, CUSTOMER_REVIEWS } from '../data/products';
import { Star, CheckCircle, Quote } from 'lucide-react';
import './Reviews.css';

export default function Reviews() {
  return (
    <section className="reviews-section section-padding">
      <div className="container">
        {/* Press Quotes Bar */}
        <div className="press-strip">
          <span className="press-label">As Acclaimed In:</span>
          <div className="press-logos">
            {PRESS_QUOTES.map((item, idx) => (
              <div key={idx} className="press-item">
                <span className="press-brand">{item.source}</span>
                <p className="press-quote">"{item.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Proof Header */}
        <div className="section-header text-center reviews-header">
          <span className="badge badge-gold">Verified Collectors</span>
          <h2 className="editorial-heading">Loved by 12,000+ Sneakerheads</h2>
          <div className="overall-score-pill">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#C5A880" color="#C5A880" />
              ))}
            </div>
            <span className="score-text"><strong>4.9 / 5.0</strong> based on 1,480+ verified reviews</span>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="reviews-grid">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-card-top">
                <div className="stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={13} fill="#C5A880" color="#C5A880" />
                  ))}
                </div>
                <span className="review-date">{rev.date}</span>
              </div>

              <h4 className="review-title">"{rev.title}"</h4>
              <p className="review-comment">{rev.comment}</p>

              <div className="review-footer">
                <div className="author-info">
                  <span className="author-name">{rev.name}</span>
                  <span className="author-location">{rev.location}</span>
                </div>
                <div className="verified-badge">
                  <CheckCircle size={13} />
                  <span>Verified Purchase</span>
                </div>
              </div>

              <div className="lace-installed-tag">
                <span>Installed on: <strong>{rev.sneaker}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
