import React, { useEffect } from 'react';
import PageHeaderBanner from '../components/PageHeaderBanner';
import BrandStory from '../components/BrandStory';
import Reviews from '../components/Reviews';
import { ArrowRight, Award, Compass, ShieldCheck, Mail } from 'lucide-react';
import './PageViews.css';

export default function StoryPage({ onNavigatePage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="page-story">
      <PageHeaderBanner
        breadcrumbs={[{ label: 'The laceyaan Atelier Standard' }]}
        badge="Craftsmanship & Heritage"
        title="Engineered in India. Crafted for the World."
        subtitle="Bringing bespoke textile craftsmanship, vintage Japanese shuttle loom weaving, and solid CNC-milled brass hardware to the world's most celebrated footwear."
        onNavigatePage={onNavigatePage}
      />

      <div className="story-page-content">
        <BrandStory />
        <Reviews />

        {/* Bottom CTA */}
        <div className="container atelier-cta-container">
          <div className="atelier-final-card text-center">
            <h2>Experience The Atelier Difference</h2>
            <p>
              Join over 12,000 collectors worldwide who have elevated their grails with laceyaan. 
              Backed by our 30-Day Guaranteed Fit Policy and complimentary domestic shipping over ₹1,499.
            </p>
            <div className="atelier-cta-actions">
              <button 
                className="btn-primary"
                onClick={() => onNavigatePage('shop')}
              >
                <span>Explore The Collection (18 Styles)</span>
                <ArrowRight size={16} />
              </button>
              <a 
                href="mailto:laceyaan@gmail.com" 
                className="btn-secondary atelier-gmail-cta"
                title="Email laceyaan Atelier directly"
              >
                <Mail size={16} />
                <span>Atelier Gmail: laceyaan@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
