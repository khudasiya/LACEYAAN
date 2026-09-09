import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/products';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';
import './FAQ.css';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section section-padding">
      <div className="container container-narrow">
        <div className="section-header text-center">
          <span className="badge badge-gold">Common Inquiries</span>
          <h2 className="editorial-heading">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about aglet sizing, shuttle weaves, maintenance, and fit guarantees.
          </p>
        </div>

        <div className="faq-accordion">
          {FAQ_ITEMS.map((item, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${openIndex === idx ? 'open' : ''}`}
            >
              <button 
                className="faq-question-btn"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={openIndex === idx}
              >
                <span className="faq-question-text">{item.question}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>

              {openIndex === idx && (
                <div className="faq-answer-pane">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Help Box */}
        <div className="faq-support-card">
          <div className="support-card-content">
            <HelpCircle size={24} className="support-icon" />
            <div>
              <h4>Have a custom sneaker silhouette or question?</h4>
              <p>Our India footwear specialists respond within 4 hours at <strong>laceyaan@gmail.com</strong>.</p>
            </div>
          </div>
          <a href="mailto:laceyaan@gmail.com" className="btn-secondary btn-sm faq-email-btn" title="Email laceyaan Atelier">
            <Mail size={14} />
            <span>laceyaan@gmail.com</span>
          </a>
        </div>
      </div>
    </section>
  );
}
