import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import ProfileModal from './components/ProfileModal';
import Toast from './components/Toast';

// Dedicated Separate Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import LengthGuidePage from './pages/LengthGuidePage';
import BeforeAfterPage from './pages/BeforeAfterPage';
import LookbookPage from './pages/LookbookPage';
import StoryPage from './pages/StoryPage';

import { PRODUCTS } from './data/products';

export default function App() {
  // Hash-based page router helper
  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
    if (['shop', 'collection'].includes(hash)) return 'shop';
    if (['length-guide', 'finder', 'calculator'].includes(hash)) return 'length-guide';
    if (['before-after', 'compare'].includes(hash)) return 'before-after';
    if (['lookbook'].includes(hash)) return 'lookbook';
    if (['story', 'about', 'craftsmanship'].includes(hash)) return 'story';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('laceyaan_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    // Default initial item
    return [
      {
        cartKey: `${PRODUCTS[0].id}-54"-S'25 4-Pack Vault-custom-lab`,
        id: PRODUCTS[0].id,
        title: PRODUCTS[0].title,
        price: PRODUCTS[0].price,
        image: PRODUCTS[0].primaryImage,
        selectedLength: '54"',
        selectedSwatch: PRODUCTS[0].swatches[0],
        selectedAglet: PRODUCTS[0].agletFinishes[0],
        quantity: 1
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState('orders');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterLength, setFilterLength] = useState(null);
  const [selectedSilhouette, setSelectedSilhouette] = useState(null);
  const [toast, setToast] = useState(null);

  const handleOpenProfile = (tab = 'orders') => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  };

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('laceyaan_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Listen to browser hash changes (Back/Forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigatePage = (pageName) => {
    setCurrentPage(pageName);
    if (pageName === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = pageName;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (title, message, showCartBtn = true) => {
    setToast({ title, message, showCartBtn });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Robust Add-to-Cart with automatic drawer opening
  const handleAddToCart = ({ product, selectedLength, selectedSwatch, selectedAglet, quantity = 1 }) => {
    const resolvedLength = selectedLength || product.defaultLength || (product.availableLengths ? product.availableLengths[0] : '54"');
    const resolvedSwatch = selectedSwatch || (product.swatches ? product.swatches[0] : { name: 'Standard' });
    const resolvedAglet = selectedAglet || (product.agletFinishes ? product.agletFinishes[0] : null);
    
    const cartKey = `${product.id}-${resolvedLength}-${resolvedSwatch.name}-${resolvedAglet ? resolvedAglet.id : 'none'}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartKey === cartKey || (item.id === product.id && item.selectedLength === resolvedLength && item.selectedSwatch?.name === resolvedSwatch.name));

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartKey,
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.primaryImage || product.image,
            selectedLength: resolvedLength,
            selectedSwatch: resolvedSwatch,
            selectedAglet: resolvedAglet,
            quantity
          }
        ];
      }
    });

    // Automatically slide out the Cart Drawer so user immediately sees their item
    setIsCartOpen(true);

    showToast(
      'Added to Bag',
      `${product.title} (${resolvedLength}) added to your bag.`
    );
  };

  // Quantity update handler (removes item when quantity reaches 0)
  const handleUpdateQuantity = (keyOrIndex, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(keyOrIndex);
    } else {
      setCartItems((prev) => {
        return prev.map((item, idx) => {
          if (item.cartKey === keyOrIndex || idx === keyOrIndex) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
      });
    }
  };

  // Remove single item handler
  const handleRemoveItem = (keyOrIndex) => {
    setCartItems((prev) => prev.filter((item, idx) => item.cartKey !== keyOrIndex && idx !== keyOrIndex));
    showToast('Removed Item', 'Item removed from your shopping bag.', false);
  };

  // Clear all items handler
  const handleClearCart = () => {
    setCartItems([]);
    showToast('Bag Cleared', 'All items have been removed from your shopping bag.', false);
  };

  // Add Upsell Handler
  const handleAddUpsell = (upsell) => {
    const upsellKey = `upsell-${upsell.id}`;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === upsell.id || item.cartKey === upsellKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartKey: upsellKey,
            id: upsell.id,
            title: upsell.title,
            price: upsell.price,
            image: upsell.image,
            selectedLength: 'Standard',
            selectedSwatch: { name: 'Standard' },
            quantity: 1
          }
        ];
      }
    });

    setIsCartOpen(true);
    showToast('Add-on Included', `${upsell.title} added to your bag.`);
  };

  const handleSelectLengthForShopping = (length) => {
    setFilterLength(length);
    setSelectedCategory('all');
    handleNavigatePage('shop');
    showToast('Length Filter Active', `Filtered collection to ${length} for your silhouette.`, false);
  };

  const handleQuickBuyProduct = (productId) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setQuickViewProduct(prod);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Broadcast Sticky Header with Multi-Page Navigation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={handleOpenProfile}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setFilterLength(null);
          handleNavigatePage('shop');
        }}
        onSelectSilhouette={(silhouetteId) => {
          setSelectedSilhouette(silhouetteId);
          handleNavigatePage('length-guide');
        }}
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
      />

      {/* Dynamic Page Views */}
      <main>
        {currentPage === 'home' && (
          <HomePage
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={handleAddToCart}
            onNavigatePage={handleNavigatePage}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigatePage('shop');
            }}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setFilterLength(null);
            }}
            filterLength={filterLength}
            onClearLengthFilter={() => setFilterLength(null)}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={handleAddToCart}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'length-guide' && (
          <LengthGuidePage
            initialSilhouetteId={selectedSilhouette}
            onSelectLengthForShopping={handleSelectLengthForShopping}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'before-after' && (
          <BeforeAfterPage
            onQuickBuyProduct={handleQuickBuyProduct}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'lookbook' && (
          <LookbookPage
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={handleAddToCart}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'story' && (
          <StoryPage
            onNavigatePage={handleNavigatePage}
          />
        )}
      </main>

      {/* Rich Multi-Column Footer with Page Navigation */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setFilterLength(null);
          handleNavigatePage('shop');
        }}
        onOpenProfile={handleOpenProfile}
        onNavigatePage={handleNavigatePage}
      />

      {/* Slide-out Cart Drawer with Add, Remove, and Quantity Controls */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddUpsell={handleAddUpsell}
        onClearCart={handleClearCart}
        onNavigatePage={handleNavigatePage}
      />

      {/* Quick View Product Modal */}
      <QuickViewModal
        key={quickViewProduct?.id}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      {/* Customer Profile & Footwear Sizing Vault Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        initialTab={profileTab}
        onClose={() => setIsProfileOpen(false)}
        onNavigatePage={handleNavigatePage}
        onSelectLengthForShopping={handleSelectLengthForShopping}
        onAddToCart={handleAddToCart}
      />

      {/* Micro-Notification Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onOpenCart={() => {
          setToast(null);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
