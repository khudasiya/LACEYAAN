import React, { useEffect } from 'react';
import PageHeaderBanner from '../components/PageHeaderBanner';
import LengthFinder from '../components/LengthFinder';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import './PageViews.css';

export default function LengthGuidePage({ initialSilhouetteId, onSelectLengthForShopping, onNavigatePage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sizingChart = [
    { eyelets: '3 - 4 Pairs', lengthVal: '36"', tied: '36" (91cm)', loose: '30" - 36"', bestFor: 'Office & Dress Shoes, Oxfords, Derbies, Loafers' },
    { eyelets: '5 - 6 Pairs', lengthVal: '45"', tied: '45" (114cm)', loose: '36" - 45"', bestFor: 'Sport & Running Shoes, Retro Court Shoes, Tennis Kicks' },
    { eyelets: '6 - 7 Pairs', lengthVal: '54"', tied: '54" (137cm)', loose: '45" - 54"', bestFor: 'Everyday Casual Sneakers, Skate Shoes, Canvas Low-Tops' },
    { eyelets: '7 - 8 Pairs', lengthVal: '63"', tied: '63" (160cm)', loose: '54" - 63"', bestFor: 'Mid-Top Sneakers, Athletic Cross-Trainers, Outdoor Footwear' },
    { eyelets: '8 - 9 Pairs', lengthVal: '72"', tied: '72" (182cm)', loose: '63" - 72"', bestFor: 'Chelsea Lace-Ups, High-Ankle Leather Boots, Heavy Work Boots' }
  ];

  return (
    <div className="page-length-guide">
      <PageHeaderBanner
        breadcrumbs={[{ label: 'Shoelace Length Guide & Sizing' }]}
        badge="Interactive Fit Engine"
        title="Shoelace Length Calculator"
        subtitle="Never guess your size again. Calculate precise inch and centimeter measurements for Sneakers, Sport Shoes, Formal Footwear, Chelsea Boots, and custom eyelet counts."
        onNavigatePage={onNavigatePage}
      />

      <div className="length-guide-content">
        <LengthFinder 
          initialSilhouetteId={initialSilhouetteId}
          onSelectLengthForShopping={(length) => {
            onSelectLengthForShopping(length);
          }} 
        />

        {/* Master Sizing Matrix Table */}
        <section className="sizing-matrix-section section-padding">
          <div className="container">
            <div className="section-header text-center">
              <span className="badge badge-gold">Reference Chart</span>
              <h2 className="editorial-heading">Master Silhouette Sizing Matrix</h2>
              <p className="section-subtitle">
                Quick reference guide based on total eyelet pairs and preferred styling drape.
              </p>
            </div>

            <div className="matrix-table-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Eyelet Configuration</th>
                    <th>Standard Tied Bow</th>
                    <th>Untied / Loose Hang</th>
                    <th>Iconic Footwear Matches</th>
                    <th style={{ textAlign: 'right' }}>Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sizingChart.map((row, i) => (
                    <tr key={i}>
                      <td className="eyelet-cell"><strong>{row.eyelets}</strong></td>
                      <td className="tied-cell">{row.tied}</td>
                      <td className="loose-cell">{row.loose}</td>
                      <td className="shoes-cell">{row.bestFor}</td>
                      <td className="action-cell" style={{ textAlign: 'right' }}>
                        <button
                          className="btn-primary btn-xs matrix-shop-btn"
                          onClick={() => onSelectLengthForShopping(row.lengthVal)}
                          title={`Filter collection to ${row.lengthVal}`}
                        >
                          <span>Shop {row.lengthVal}</span>
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pro Styling Advice Box */}
            <div className="styling-pro-tips">
              <div className="tip-box">
                <h4><CheckCircle2 size={16} /> The Golden Rule of Footwear Draping</h4>
                <p>
                  If you prefer an untied streetwear hang over the tongue, always size down 
                  by one step (e.g., from 72" to 63" on high-ankle boots, or 54" to 45" on sneakers). 
                  This keeps the aglets suspended cleanly without dragging on the pavement.
                </p>
              </div>
              <div className="tip-box">
                <h4><HelpCircle size={16} /> 30-Day Guaranteed Fit Policy</h4>
                <p>
                  Worried about picking the wrong length? Every order includes complimentary 
                  free exchanges within 30 days. If the drape isn't 100% dialled in, we swap it free!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
