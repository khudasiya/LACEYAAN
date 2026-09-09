import React, { useEffect } from 'react';
import PageHeaderBanner from '../components/PageHeaderBanner';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import './PageViews.css';

export default function BeforeAfterPage({ onQuickBuyProduct, onNavigatePage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const labSpecs = [
    {
      feature: 'Base Thread Material',
      factory: 'Cheap hollow synthetic polyester prone to wrinkling & fraying',
      laceyaan: '100% Japanese long-staple combed cotton with dense shuttle weave',
      winner: 'laceyaan'
    },
    {
      feature: 'Surface Finishing',
      factory: 'Unfinished dry synthetic (continually unties during walks)',
      laceyaan: 'Natural organic micro-beeswax immersion for permanent knot security',
      winner: 'laceyaan'
    },
    {
      feature: 'Aglet Hardware',
      factory: 'Thin heat-shrink plastic tubing (splits and cracks after 1-2 months)',
      laceyaan: 'Solid CNC-milled naval brass with laser-engraved monogram & micro-screws',
      winner: 'laceyaan'
    },
    {
      feature: 'Tension Cycle Lifespan',
      factory: 'Fails / pills after ~1,500 foot strikes and friction cycles',
      laceyaan: 'Tested & certified for 20,000+ continuous high-tension cycles',
      winner: 'laceyaan'
    }
  ];

  return (
    <div className="page-before-after">
      <PageHeaderBanner
        breadcrumbs={[{ label: 'Before & After Upgrade Studio' }]}
        badge="Material Science & Comparison"
        title="The Transformation Studio"
        subtitle="Stock factory polyester laces ruin 50% of an iconic sneaker's aesthetic potential. Drag the interactive split slider to see how substantial 10mm chunky rope laces elevate ordinary footwear."
        onNavigatePage={onNavigatePage}
      />

      <div className="before-after-content">
        <BeforeAfterSlider onQuickBuyProduct={onQuickBuyProduct} />

        {/* Material Science Lab Table */}
        <section className="material-lab-section section-padding">
          <div className="container">
            <div className="section-header text-center">
              <span className="badge badge-gold">Laboratory Comparison</span>
              <h2 className="editorial-heading">Stock Factory Laces vs. laceyaan</h2>
              <p className="section-subtitle">
                An objective side-by-side engineering breakdown of raw materials, aglet hardware, and knot retention.
              </p>
            </div>

            <div className="lab-table-container">
              <table className="lab-table">
                <thead>
                  <tr>
                    <th>Engineering Specification</th>
                    <th>Standard Factory Polyester</th>
                    <th>laceyaan Atelier Standard</th>
                  </tr>
                </thead>
                <tbody>
                  {labSpecs.map((row, i) => (
                    <tr key={i}>
                      <td className="spec-name"><strong>{row.feature}</strong></td>
                      <td className="factory-spec">{row.factory}</td>
                      <td className="laceyaan-spec">
                        <span className="advantage-pill">Superior</span>
                        {row.laceyaan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Callout */}
            <div className="lab-cta-box text-center">
              <h3>Ready to transform your sneaker rotation?</h3>
              <p>Explore all 18 styles or try our flagship 10mm chunky rope laces today.</p>
              <button 
                className="btn-primary"
                onClick={() => onNavigatePage('shop')}
              >
                <span>Shop The Collection</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
