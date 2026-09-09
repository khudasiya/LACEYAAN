import React, { useState, useEffect } from 'react';
import { FOOTWEAR_CATEGORIES } from '../data/products';
import { 
  Ruler, 
  Check, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  Footprints, 
  Zap, 
  Briefcase, 
  Compass, 
  CircleDot, 
  Crown,
  Layers
} from 'lucide-react';
import './LengthFinder.css';

// Helper to get category icon
const getCategoryIcon = (id) => {
  switch (id) {
    case 'casual-sneakers':
      return <Footprints size={20} />;
    case 'sport-shoes':
      return <Zap size={20} />;
    case 'office-shoes':
      return <Briefcase size={20} />;
    case 'chelsea-boots':
      return <Compass size={20} />;
    case 'retro-court':
      return <CircleDot size={20} />;
    case 'high-top-sneakers':
      return <Crown size={20} />;
    default:
      return <Layers size={20} />;
  }
};

export default function LengthFinder({ initialSilhouetteId, onSelectLengthForShopping }) {
  const [selectedFootwear, setSelectedFootwear] = useState(() => {
    if (initialSilhouetteId) {
      const match = FOOTWEAR_CATEGORIES.find(c => c.id === initialSilhouetteId);
      if (match) return match;
    }
    return FOOTWEAR_CATEGORIES[0];
  });
  const [lacingStyle, setLacingStyle] = useState('tied'); // 'tied' | 'loose'
  const [customEyelets, setCustomEyelets] = useState(null);

  useEffect(() => {
    if (initialSilhouetteId) {
      const match = FOOTWEAR_CATEGORIES.find(c => c.id === initialSilhouetteId);
      if (match) {
        setSelectedFootwear(match);
        setCustomEyelets(null);
      }
    }
  }, [initialSilhouetteId]);

  // Compute recommended length based on category & lacing style
  const calculateCustomLength = (eyelets, style) => {
    if (eyelets <= 4) return { inch: style === 'loose' ? '30"' : '36"', cm: style === 'loose' ? 76 : 91 };
    if (eyelets <= 6) return { inch: style === 'loose' ? '36"' : '45"', cm: style === 'loose' ? 91 : 114 };
    if (eyelets <= 7) return { inch: style === 'loose' ? '45"' : '54"', cm: style === 'loose' ? 114 : 137 };
    if (eyelets <= 8) return { inch: style === 'loose' ? '54"' : '63"', cm: style === 'loose' ? 137 : 160 };
    return { inch: style === 'loose' ? '63"' : '72"', cm: style === 'loose' ? 160 : 182 };
  };

  const currentResult = customEyelets !== null 
    ? calculateCustomLength(customEyelets, lacingStyle)
    : {
        inch: lacingStyle === 'loose' ? selectedFootwear.looseLength : selectedFootwear.recommendedLength,
        cm: lacingStyle === 'loose' ? selectedFootwear.lengthCm - 23 : selectedFootwear.lengthCm
      };

  return (
    <section id="finder" className="length-finder-section section-padding">
      <div className="container">
        <div className="section-header text-center animate-fade-in-up">
          <span className="badge badge-gold">Interactive Fit Tool</span>
          <h2 className="editorial-heading">Precision Shoelace Length Calculator</h2>
          <p className="section-subtitle">
            Find the exact centimeter and inch measurements tailored to your footwear type — 
            from casual sneakers and athletic sport shoes to formal dress footwear and leather boots.
          </p>
        </div>

        <div className="finder-grid">
          {/* Left Column: Footwear Type & Style Controls */}
          <div className="finder-controls-card animate-fade-in-up stagger-1">
            <div className="control-block">
              <label className="control-label">
                <span>1. Select Your Footwear Type</span>
                <span className="control-hint">Universal Fit by Design</span>
              </label>

              <div className="footwear-category-grid">
                {FOOTWEAR_CATEGORIES.map((item) => {
                  const isSelected = selectedFootwear.id === item.id && customEyelets === null;
                  return (
                    <button
                      key={item.id}
                      className={`footwear-cat-card ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedFootwear(item);
                        setCustomEyelets(null);
                      }}
                      type="button"
                    >
                      <div className="footwear-cat-header">
                        <div className="footwear-cat-icon">
                          {getCategoryIcon(item.id)}
                        </div>
                        <span className="footwear-cat-badge">{item.eyelets} Eyelets</span>
                      </div>
                      <div className="footwear-cat-info">
                        <h4 className="footwear-cat-title">{item.name}</h4>
                        <p className="footwear-cat-desc">{item.tagline}</p>
                      </div>
                      {isSelected && (
                        <div className="footwear-cat-check">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Eyelet Selector */}
            <div className="control-block">
              <label className="control-label">
                <span>Or Choose Exact Eyelet Pairs</span>
                <span className="control-hint">Per shoe side</span>
              </label>
              <div className="eyelet-pills">
                {[3, 4, 5, 6, 7, 8, 9].map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`eyelet-pill ${customEyelets === count ? 'active' : ''}`}
                    onClick={() => setCustomEyelets(count)}
                  >
                    <span>{count} Pairs</span>
                  </button>
                ))}
                {customEyelets !== null && (
                  <button 
                    type="button"
                    className="eyelet-reset-btn"
                    onClick={() => setCustomEyelets(null)}
                  >
                    Reset to Footwear Type
                  </button>
                )}
              </div>
            </div>

            {/* Lacing Style Preference */}
            <div className="control-block">
              <label className="control-label">
                <span>2. Preferred Lacing Aesthetic</span>
              </label>

              <div className="style-selector">
                <button
                  type="button"
                  className={`style-btn ${lacingStyle === 'tied' ? 'active' : ''}`}
                  onClick={() => setLacingStyle('tied')}
                >
                  <div className="style-btn-radio">
                    <span className="radio-dot" />
                  </div>
                  <div className="style-btn-text">
                    <div className="style-btn-title">Standard Bow / Knot</div>
                    <div className="style-btn-sub">Traditional tie with balanced 2.5–3" hanging loops</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`style-btn ${lacingStyle === 'loose' ? 'active' : ''}`}
                  onClick={() => setLacingStyle('loose')}
                >
                  <div className="style-btn-radio">
                    <span className="radio-dot" />
                  </div>
                  <div className="style-btn-text">
                    <div className="style-btn-title">Untied / Streetwear Hang</div>
                    <div className="style-btn-sub">Clean loose drape through top eyelets without tying</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Computed Result Display */}
          <div className="finder-result-card animate-fade-in-up stagger-2">
            <div className="result-card-inner">
              <div className="result-header">
                <div className="ruler-badge">
                  <Ruler size={18} />
                  <span>Calculated Recommendation</span>
                </div>
                <span className="guarantee-tag">100% Fit Guarantee</span>
              </div>

              <div className="result-main-number">
                <span className="length-inch">{currentResult.inch}</span>
                <span className="length-cm">({currentResult.cm} cm)</span>
              </div>

              <div className="result-meta-box">
                <div className="meta-row">
                  <span className="meta-label">Selected Footwear</span>
                  <span className="meta-value">
                    {customEyelets !== null ? `${customEyelets} Eyelet Pair Footwear` : selectedFootwear.name}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Lacing Style</span>
                  <span className="meta-value">
                    {lacingStyle === 'tied' ? 'Traditional Tied Bow' : 'Untied Streetwear Hang'}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Recommended Weave</span>
                  <span className="meta-value">
                    {customEyelets !== null ? '8mm Flat Waxed or 10mm Rope' : selectedFootwear.width}
                  </span>
                </div>
              </div>

              <p className="result-description">
                {customEyelets !== null
                  ? `For a ${customEyelets}-eyelet shoe with ${lacingStyle === 'tied' ? 'a standard knot' : 'an untied drape'}, a ${currentResult.inch} lace provides optimal drape without floor drag or tension strain.`
                  : selectedFootwear.description}
              </p>

              <div className="result-action">
                <button 
                  className="btn-primary w-full animate-hover-lift"
                  onClick={() => onSelectLengthForShopping(currentResult.inch)}
                >
                  <span>Shop {currentResult.inch} Laces</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="fit-promise-row">
                <Sparkles size={14} className="promise-icon" />
                <span>Wrong length? Enjoy free, no-questions-asked exchanges for 30 days across India.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
