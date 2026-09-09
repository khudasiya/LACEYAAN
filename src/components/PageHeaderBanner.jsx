import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import './PageHeaderBanner.css';

export default function PageHeaderBanner({ 
  breadcrumbs = [], 
  title, 
  subtitle, 
  badge,
  onNavigatePage 
}) {
  return (
    <div className="page-header-banner">
      <div className="container">
        {/* Breadcrumbs Navigation */}
        <nav className="breadcrumbs-nav" aria-label="Breadcrumbs">
          <button 
            className="breadcrumb-link home-crumb"
            onClick={() => onNavigatePage('home')}
          >
            <Home size={13} />
            <span>Home</span>
          </button>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="breadcrumb-sep" />
              {crumb.page ? (
                <button 
                  className="breadcrumb-link"
                  onClick={() => onNavigatePage(crumb.page)}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title & Subtitle */}
        <div className="page-header-content">
          {badge && <span className="badge badge-gold page-header-badge">{badge}</span>}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
