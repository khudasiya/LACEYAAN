import React from 'react';
import { Award, Compass, ShieldCheck, Sparkles, Hammer, Cpu } from 'lucide-react';
import './BrandStory.css';

export default function BrandStory() {
  const pillars = [
    {
      icon: <Award size={22} />,
      title: 'Japanese Shuttle Looms',
      subtitle: 'Slow Weave Heritage',
      description: 'Woven at 1/5th the speed of mass industrial looms. This imparts a dense, textured herringbone hand-feel that drapes with architectural weight.'
    },
    {
      icon: <Hammer size={22} />,
      title: 'Solid Naval Brass Aglets',
      subtitle: 'CNC-Milled Hardware',
      description: 'We abolished flimsy plastic tips. Each laceyaan aglet is machined from solid alloy brass, threaded to prevent fraying, and electroplated in 24K gold or gunmetal.'
    },
    {
      icon: <Sparkles size={22} />,
      title: 'Organic Beeswax Dip',
      subtitle: 'Tension & Weatherproofing',
      description: 'Treated in a proprietary natural beeswax emulsion that seals out street grime and ensures knots stay locked without loosening throughout your daily steps.'
    }
  ];

  return (
    <section id="story" className="brand-story-section section-padding">
      <div className="container">
        {/* Split Editorial Header */}
        <div className="story-split-grid">
          <div className="story-media">
            <img 
              src="/images/hero.jpg" 
              alt="laceyaan craftsmanship in Japanese cotton and brass" 
              className="story-img"
              loading="lazy"
            />
            <div className="story-media-badge">
              <span className="badge-year">EST. 2024</span>
              <span className="badge-text">Crafted for Icons</span>
            </div>
          </div>

          <div className="story-content">
            <span className="badge badge-gold">The laceyaan Philosophy</span>
            <h2 className="editorial-heading">
              Footwear designers obsess over silhouette. Why settle for disposable laces?
            </h2>
            <p className="story-lead">
              When iconic footwear is released, brands routinely cut corners on the most tactile element 
              of the entire shoe: the laces. Thin synthetic threads, cheap plastic aglets, and awkward 
              excess lengths dilute the designer’s original vision.
            </p>
            <p className="story-body">
              laceyaan was born to bridge this exact disparity. We apply the standards of bespoke 
              tailoring and luxury horology hardware to the humble shoelace. From 100% shuttle-woven 
              Japanese cotton to micro-screw solid metal aglets, every millimeter is calibrated for 
              balance, drape, and enduring resilience.
            </p>

            <div className="story-quote-box">
              <p className="quote-text">
                "The difference between a standard sneaker and a head-turner isn't the box it came in. 
                It's the precision of the details."
              </p>
              <span className="quote-author">— laceyaan Design Studio, India</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="pillars-grid">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="pillar-card">
              <div className="pillar-icon-box">
                {pillar.icon}
              </div>
              <span className="pillar-subtitle">{pillar.subtitle}</span>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-description">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
