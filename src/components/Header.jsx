import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, ChevronLeft, ChevronRight, Check, ArrowRight, User } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import './Header.css';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onOpenSearch, 
  onOpenProfile,
  onSelectCategory,
  onSelectSilhouette,
  onNavigateSection,
  currentPage = 'home',
  onNavigatePage
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const leaveTimeoutRef = useRef(null);

  const creativeQuotes = [
    { badge: 'UPGRADE', text: 'It is time to upgrade your shoes with laceyaan.' },
    { badge: 'COUPLE GOALS', text: 'Gift your girlfriend a matching pair of laces — if no matching shoes, why not matching laces?' },
    { badge: 'GRAIL RULE', text: "Don't let flimsy factory laces dilute a ₹20,000 sneaker silhouette." },
    { badge: 'STYLE DROP', text: 'Why buy a whole new sneaker when a bespoke lace swap changes the entire story?' },
    { badge: 'TWINNING', text: 'Twin with your favorite person: matching handcrafted luxury weaves.' },
    { badge: 'ATELIER CRAFT', text: 'Slow shuttle-loom Japanese cotton with solid CNC naval brass aglets.' },
    { badge: 'PRO TIP', text: 'Shoes speak volumes, but bespoke aglets show you know your craft.' },
    { badge: 'FREE SHIPPING', text: 'Complimentary express courier delivery across India on orders over ₹1,499.' },
    { badge: 'GUARANTEED FIT', text: '30-Day Guaranteed Fit Policy — Free size & length exchanges.' }
  ];

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAnnouncementPaused) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % creativeQuotes.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isAnnouncementPaused, creativeQuotes.length]);

  // Keep menu open when hovering between link and dropdown
  const handleOpenMenu = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleCloseMenu = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 320); // 320ms buffer prevents accidental closing when mouse travels
  };

  const handleToggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setMegaMenuOpen(prev => !prev);
  };

  const handleNav = (pageName) => {
    if (onNavigatePage) {
      onNavigatePage(pageName);
    } else if (onNavigateSection) {
      onNavigateSection(pageName);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.has-dropdown')) {
        setMegaMenuOpen(false);
      }
    };
    if (megaMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [megaMenuOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Announcement Bar */}
      <div 
        className="announcement-bar"
        onMouseEnter={() => setIsAnnouncementPaused(true)}
        onMouseLeave={() => setIsAnnouncementPaused(false)}
      >
        <div className="container announcement-inner">
          <div className="announcement-ticker">
            <button 
              className="announcement-nav-btn" 
              onClick={() => setAnnouncementIndex((prev) => (prev - 1 + creativeQuotes.length) % creativeQuotes.length)}
              aria-label="Previous quote"
              title="Previous statement"
            >
              <ChevronLeft size={13} />
            </button>
            <div className="announcement-slide" key={announcementIndex}>
              <span className="announcement-badge">{creativeQuotes[announcementIndex].badge}</span>
              <p className="announcement-text">{creativeQuotes[announcementIndex].text}</p>
            </div>
            <button 
              className="announcement-nav-btn" 
              onClick={() => setAnnouncementIndex((prev) => (prev + 1) % creativeQuotes.length)}
              aria-label="Next quote"
              title="Next statement"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="announcement-right">
            <button 
              className="announcement-link"
              onClick={() => handleNav('length-guide')}
            >
              Fit Guide
            </button>
            <div className="currency-selector" onClick={() => setCurrencyDropdown(!currencyDropdown)}>
              <span>{currency} ({currencySymbols[currency]})</span>
              <ChevronDown size={12} />
              {currencyDropdown && (
                <div className="currency-dropdown" onClick={(e) => e.stopPropagation()}>
                  {['INR', 'USD', 'EUR', 'GBP'].map((curr) => (
                    <button 
                      key={curr} 
                      className={`currency-opt ${currency === curr ? 'active' : ''}`}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyDropdown(false);
                      }}
                    >
                      <span>{curr} ({currencySymbols[curr]})</span>
                      {currency === curr && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="navbar">
        <div className="container navbar-inner">
          {/* Left Navigation Area */}
          <div className="navbar-left">
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop Left Navigation */}
            <nav className="desktop-nav left-nav">
              <div 
                className="nav-item has-dropdown"
                onMouseEnter={handleOpenMenu}
                onMouseLeave={handleCloseMenu}
              >
                <button 
                  className={`nav-link ${currentPage === 'shop' ? 'active-page' : ''}`}
                  onClick={() => {
                    handleNav('shop');
                    setMegaMenuOpen(false);
                  }}
                  aria-expanded={megaMenuOpen}
                >
                  <span>Shop Laces</span>
                  <span 
                    className="arrow-click-target" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMenu(e);
                    }}
                  >
                    <ChevronDown size={13} className={`dropdown-arrow ${megaMenuOpen ? 'open' : ''}`} />
                  </span>
                </button>

                {/* Broadcast-Style Mega Menu */}
                {megaMenuOpen && (
                  <div 
                    className="mega-menu"
                    onMouseEnter={handleOpenMenu}
                    onMouseLeave={handleCloseMenu}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="container mega-menu-inner">
                      <div className="mega-col">
                        <span className="mega-col-title">Shop by Footwear Type</span>
                        <ul className="mega-list">
                          <li>
                            <button onClick={() => { onSelectSilhouette('casual-sneakers'); handleNav('length-guide'); setMegaMenuOpen(false); }}>
                              Casual & Lifestyle Sneakers (54")
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectSilhouette('sport-shoes'); handleNav('length-guide'); setMegaMenuOpen(false); }}>
                              Sport & Running Shoes (45")
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectSilhouette('office-shoes'); handleNav('length-guide'); setMegaMenuOpen(false); }}>
                              Office & Dress Formal Shoes (36")
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectSilhouette('chelsea-boots'); handleNav('length-guide'); setMegaMenuOpen(false); }}>
                              Chelsea & Leather Boots (63"–72")
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectSilhouette('retro-court'); handleNav('length-guide'); setMegaMenuOpen(false); }}>
                              Retro Court & Minimalist Shoes (45")
                            </button>
                          </li>
                        </ul>
                      </div>

                      <div className="mega-col">
                        <span className="mega-col-title">Weave & Hardware</span>
                        <ul className="mega-list">
                          <li>
                            <button onClick={() => { onSelectCategory('design-lab'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              <strong style={{ color: 'var(--accent-gold-dark)' }}>★ Design Lab & Vault Capsules</strong>
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectCategory('waxed-flat'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              Heritage Waxed Flat & Split Duo
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectCategory('chunky-rope'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              10mm Chunky Braided Rope
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectCategory('velvet-couture'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              Midnight Velvet Silk Chenille
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectCategory('reflective'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              3M™ Reflective & Carbon Aramid
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectCategory('luxury-leather'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              Artisan Italian Calfskin Leather
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { onSelectCategory('hardware'); handleNav('shop'); setMegaMenuOpen(false); }}>
                              Solid Brass Aglet Screw Kits
                            </button>
                          </li>
                        </ul>
                      </div>

                      <div className="mega-col mega-featured">
                        <div className="featured-card">
                          <img src="/images/product-waxed.jpg" alt="Waxed Flat Laces" />
                          <div className="featured-meta">
                            <span className="badge badge-gold">Iconic Choice</span>
                            <h4>Heritage Waxed Flat</h4>
                            <p>The standard swap for iconic sneakers. Treated in natural beeswax.</p>
                            <button 
                              className="text-cta"
                              onClick={() => { onSelectCategory('waxed-flat'); handleNav('shop'); setMegaMenuOpen(false); }}
                            >
                              Explore Waxed <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mega-col mega-featured">
                        <div className="featured-card">
                          <img src="/images/product-rope.jpg" alt="Chunky Rope" />
                          <div className="featured-meta">
                            <span className="badge badge-dark">Trending Now</span>
                            <h4>10mm Chunky Rope</h4>
                            <p>Substantial volume and luxurious runway drape.</p>
                            <button 
                              className="text-cta"
                              onClick={() => { onSelectCategory('chunky-rope'); handleNav('shop'); setMegaMenuOpen(false); }}
                            >
                              Explore Rope <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                className={`nav-link ${currentPage === 'length-guide' ? 'active-page' : ''}`}
                onClick={() => handleNav('length-guide')}
              >
                Length Guide
              </button>

              <button 
                className={`nav-link ${currentPage === 'before-after' ? 'active-page' : ''}`}
                onClick={() => handleNav('before-after')}
              >
                Before & After
              </button>

              <button 
                className={`nav-link ${currentPage === 'lookbook' ? 'active-page' : ''}`}
                onClick={() => handleNav('lookbook')}
              >
                Lookbook
              </button>
            </nav>
          </div>

          {/* Central Luxury Logo Lockup with Braided Icon Mark */}
          <div className="navbar-brand">
            <a 
              href="#" 
              className="brand-logo" 
              onClick={(e) => { 
                e.preventDefault(); 
                handleNav('home'); 
              }}
              aria-label="Laceyaan Luxury Shoelaces"
            >
              <div className="brand-lockup">
                <img 
                  src="/images/logo-icon.png" 
                  alt="Laceyaan Logo Mark" 
                  className="brand-icon-mark" 
                />
                <span className="brand-name">LACEYAAN</span>
              </div>
              <span className="brand-tagline">CRAFTED IN INDIA</span>
            </a>
          </div>

          {/* Right Navigation & Utilities */}
          <div className="navbar-utilities">
            <a 
              href="https://www.instagram.com/laceyaan_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="util-btn insta-nav-btn"
              title="Follow @laceyaan_ on Instagram"
              aria-label="Instagram @laceyaan_"
            >
              <InstagramIcon size={18} />
            </a>

            <button 
              className="util-btn search-trigger"
              onClick={onOpenSearch}
              aria-label="Search catalog"
            >
              <Search size={18} />
              <span className="util-label">Search</span>
            </button>

            <button 
              className="util-btn profile-trigger"
              onClick={onOpenProfile}
              aria-label="My Account and Footwear Sizing Vault"
            >
              <User size={18} />
              <span className="util-label">Account</span>
            </button>

            <button 
              className="util-btn cart-trigger"
              onClick={onOpenCart}
              aria-label={`Cart with ${cartCount} items`}
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag size={19} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="util-label">Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-inner">
            <div className="mobile-drawer-head">
              <div className="brand-lockup">
                <img 
                  src="/images/logo-icon.png" 
                  alt="Laceyaan" 
                  className="brand-icon-mark drawer-logo-img" 
                />
                <span className="brand-name">LACEYAAN</span>
              </div>
              <button className="drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Account Quick Action */}
            <div 
              className="mobile-account-bar"
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
            >
              <div className="mobile-account-icon">
                <User size={18} />
              </div>
              <div className="mobile-account-info">
                <span className="mobile-account-name">Arjun Sharma (Atelier Gold)</span>
                <span className="mobile-account-sub">View Orders & Footwear Sizing Vault</span>
              </div>
              <ChevronRight size={16} className="mobile-account-arrow" />
            </div>

            <div className="mobile-menu-links">
              <button 
                className={`mobile-link ${currentPage === 'shop' ? 'active' : ''}`}
                onClick={() => { handleNav('shop'); setMobileMenuOpen(false); }}
              >
                Shop All Laces
              </button>
              <button 
                className="mobile-link"
                onClick={() => { onSelectCategory('waxed-flat'); handleNav('shop'); setMobileMenuOpen(false); }}
              >
                Heritage Waxed Flat
              </button>
              <button 
                className="mobile-link"
                onClick={() => { onSelectCategory('chunky-rope'); handleNav('shop'); setMobileMenuOpen(false); }}
              >
                10mm Chunky Braided Rope
              </button>
              <button 
                className="mobile-link"
                onClick={() => { onSelectCategory('velvet-couture'); handleNav('shop'); setMobileMenuOpen(false); }}
              >
                Midnight Velvet Silk Chenille
              </button>
              <button 
                className="mobile-link"
                onClick={() => { onSelectCategory('reflective'); handleNav('shop'); setMobileMenuOpen(false); }}
              >
                3M™ & Carbon Aramid Weave
              </button>
              <button 
                className="mobile-link"
                onClick={() => { onSelectCategory('hardware'); handleNav('shop'); setMobileMenuOpen(false); }}
              >
                Solid Metal Aglets Kit
              </button>
              <button 
                className={`mobile-link highlight ${currentPage === 'length-guide' ? 'active' : ''}`}
                onClick={() => { handleNav('length-guide'); setMobileMenuOpen(false); }}
              >
                📏 Shoelace Length Calculator
              </button>
              <button 
                className={`mobile-link ${currentPage === 'before-after' ? 'active' : ''}`}
                onClick={() => { handleNav('before-after'); setMobileMenuOpen(false); }}
              >
                Before vs. After Upgrade
              </button>
              <button 
                className={`mobile-link ${currentPage === 'lookbook' ? 'active' : ''}`}
                onClick={() => { handleNav('lookbook'); setMobileMenuOpen(false); }}
              >
                Editorial Lookbook
              </button>
              <button 
                className={`mobile-link ${currentPage === 'story' ? 'active' : ''}`}
                onClick={() => { handleNav('story'); setMobileMenuOpen(false); }}
              >
                The laceyaan Standard
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <p>Free standard domestic shipping across India on orders over ₹1,499.</p>
              <div className="mobile-drawer-contact">
                <span>Atelier Support / Gmail:</span>
                <a href="mailto:laceyaan@gmail.com" className="mobile-contact-email">
                  laceyaan@gmail.com
                </a>
              </div>
              <div className="mobile-drawer-social">
                <span>Follow On Instagram:</span>
                <a 
                  href="https://www.instagram.com/laceyaan_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mobile-social-email"
                  title="Open @laceyaan_ on Instagram"
                >
                  <InstagramIcon size={14} />
                  <span>@laceyaan_</span>
                </a>
              </div>
              <div className="mobile-currency">
                <span>Currency: <strong>{currency}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
