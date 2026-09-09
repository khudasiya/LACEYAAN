import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  Footprints, 
  MapPin, 
  Award, 
  ChevronRight, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Trash2,
  Edit3,
  Check,
  Phone,
  Mail
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose, onNavigatePage, onSelectLengthForShopping, onAddToCart, initialTab = 'orders' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'orders' | 'vault' | 'address' | 'membership'
  const [showTrackingDetails, setShowTrackingDetails] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Editable Saved Addresses state (persisted to localStorage)
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('laceyaan_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved addresses', e);
    }
    return [
      {
        id: 'primary',
        label: 'Primary Residence',
        isDefault: true,
        name: 'Arjun Sharma',
        line1: 'C-42, Shanti Path, Diplomatic Enclave',
        city: 'Chanakyapuri, New Delhi',
        state: 'Delhi',
        pincode: '110021',
        phone: '+91 98112 40912'
      },
      {
        id: 'work',
        label: 'Work Atelier',
        isDefault: false,
        name: 'Arjun Sharma (Studio)',
        line1: 'Plot 18, Okhla Industrial Area, Phase III',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110020',
        phone: '+91 98112 40912'
      }
    ];
  });

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('laceyaan_saved_addresses', JSON.stringify(addresses));
    } catch (e) {
      console.warn('Could not save addresses', e);
    }
  }, [addresses]);

  const handleStartEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setEditForm({ ...addr });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!editForm) return;
    setAddresses(prev => prev.map(a => a.id === editForm.id ? editForm : a));
    setEditingAddressId(null);
    setEditForm(null);
  };

  // Saved Footwear Sizing Profiles (persisted in localStorage)
  const [shoeProfiles, setShoeProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('laceyaan_shoe_profiles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load shoe profiles', e);
    }
    return [
      {
        id: 1,
        shoeName: 'Everyday Canvas & Leather Sneakers',
        category: 'Sneakers (Casual & Everyday)',
        eyelets: '6-7 Pairs',
        recommendedLength: '54"',
        preferredStyle: 'Untied Streetwear Hang (45")',
        preferredWeave: '8mm Flat Waxed (Vintage Sail)'
      },
      {
        id: 2,
        shoeName: 'Heritage Oxford Formal Dress Shoes',
        category: 'Office & Dress Shoes',
        eyelets: '5 Pairs',
        recommendedLength: '36"',
        preferredStyle: 'Standard Bow Knot (36")',
        preferredWeave: 'Glazed Full-Grain Italian Leather'
      },
      {
        id: 3,
        shoeName: 'High-Ankle Leather Chelsea Boots',
        category: 'Chelsea & Leather Boots',
        eyelets: '8 Pairs',
        recommendedLength: '63"',
        preferredStyle: 'Wrap-around Top Knot (63")',
        preferredWeave: 'Heavy Waxed Rawhide Canvas'
      }
    ];
  });

  // New Shoe Profile Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShoeName, setNewShoeName] = useState('');
  const [newCategory, setNewCategory] = useState('Sneakers (Casual & Everyday)');
  const [newEyelets, setNewEyelets] = useState('6-7 Pairs');
  const [newLength, setNewLength] = useState('54"');

  // Persist shoe profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('laceyaan_shoe_profiles', JSON.stringify(shoeProfiles));
    } catch (e) {
      console.warn('Could not save shoe profiles', e);
    }
  }, [shoeProfiles]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAddShoeProfile = (e) => {
    e.preventDefault();
    if (!newShoeName.trim()) return;

    const newProfile = {
      id: Date.now(),
      shoeName: newShoeName.trim(),
      category: newCategory,
      eyelets: newEyelets,
      recommendedLength: newLength,
      preferredStyle: 'Custom Fit',
      preferredWeave: '8mm Flat Waxed or 10mm Rope'
    };

    setShoeProfiles([newProfile, ...shoeProfiles]);
    setNewShoeName('');
    setShowAddForm(false);
  };

  const handleDeleteShoeProfile = (id) => {
    setShoeProfiles(shoeProfiles.filter(p => p.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button className="profile-close-btn" onClick={onClose} aria-label="Close Profile">
          <X size={20} />
        </button>

        {/* Profile Header Lockup */}
        <div className="profile-header-banner">
          <div className="profile-avatar-lockup">
            <div className="profile-avatar">
              <User size={26} />
              <span className="profile-status-dot" />
            </div>
            <div className="profile-user-info">
              <div className="profile-name-row">
                <h3 className="profile-user-name">Arjun Sharma</h3>
                <span className="profile-tier-badge">
                  <Sparkles size={12} />
                  <span>Atelier Gold</span>
                </span>
              </div>
              <p className="profile-user-email">arjun.sharma@example.in • Member since 2024</p>
            </div>
          </div>

          <div className="profile-stats-chips">
            <div className="profile-stat-chip">
              <span className="chip-label">Reward Points</span>
              <span className="chip-value">1,450 pts</span>
            </div>
            <div className="profile-stat-chip">
              <span className="chip-label">Saved Sizes</span>
              <span className="chip-value">{shoeProfiles.length} Pairs</span>
            </div>
            <div className="profile-stat-chip">
              <span className="chip-label">Fit Guarantee</span>
              <span className="chip-value active">Active</span>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="profile-tabs-bar">
          <button 
            className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={16} />
            <span>Order History (2)</span>
          </button>

          <button 
            className={`profile-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            <Footprints size={16} />
            <span>Footwear Sizing Vault ({shoeProfiles.length})</span>
          </button>

          <button 
            className={`profile-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <MapPin size={16} />
            <span>Saved Addresses</span>
          </button>

          <button 
            className={`profile-tab-btn ${activeTab === 'membership' ? 'active' : ''}`}
            onClick={() => setActiveTab('membership')}
          >
            <Award size={16} />
            <span>Privileges & Perks</span>
          </button>
        </div>

        {/* Tab 1: Orders & Tracking */}
        {activeTab === 'orders' && (
          <div className="profile-tab-content">
            <div className="tab-section-header">
              <div>
                <h4 className="tab-title">Recent Orders & Shipments</h4>
                <p className="tab-subtitle">Track your deliveries and reorder your favorite laces in 1 click.</p>
              </div>
            </div>

            {/* Active Shipment Card */}
            <div className="order-card active-order">
              <div className="order-card-header">
                <div className="order-meta-info">
                  <span className="order-id">Order #LC-94820</span>
                  <span className="order-date">Placed on September 08, 2026</span>
                </div>
                <div className="order-status-badge in-transit">
                  <Truck size={14} />
                  <span>Out for Delivery Today</span>
                </div>
              </div>

              <div className="tracking-timeline-bar">
                <div className="timeline-step completed">
                  <div className="step-circle"><CheckCircle2 size={12} /></div>
                  <span className="step-text">Confirmed</span>
                </div>
                <div className="timeline-line active" />
                <div className="timeline-step completed">
                  <div className="step-circle"><CheckCircle2 size={12} /></div>
                  <span className="step-text">Hand-Inspected</span>
                </div>
                <div className="timeline-line active" />
                <div className="timeline-step in-progress">
                  <div className="step-circle"><Clock size={12} /></div>
                  <span className="step-text">Out for Delivery</span>
                </div>
              </div>

              <div className="order-items-list">
                <div className="order-item-row">
                  <img src="/images/product-pure-white.jpg" alt="Pure White Waxed Flat" className="order-item-thumb" />
                  <div className="order-item-details">
                    <span className="order-item-name">Heritage Waxed Flat Laces — Pure Crisp White</span>
                    <span className="order-item-specs">Length: 54" • Polished Mirror Silver Aglets • Qty: 1</span>
                  </div>
                  <span className="order-item-price">₹699</span>
                </div>

                <div className="order-item-row">
                  <img src="/images/product-rope.jpg" alt="Chunky Ecru Rope" className="order-item-thumb" />
                  <div className="order-item-details">
                    <span className="order-item-name">Chunky Braided Rope Laces — Natural Ecru (10mm)</span>
                    <span className="order-item-specs">Length: 45" • 24K Gold Screw Aglets • Qty: 1</span>
                  </div>
                  <span className="order-item-price">₹899</span>
                </div>
              </div>

              <div className="order-card-footer">
                <div className="carrier-info">
                  <span>Courier: <strong>BlueDart Express</strong></span>
                  <span className="tracking-code">AWB: <strong>BLU892184910IN</strong></span>
                </div>
                <div className="order-actions">
                  <button 
                    className="btn-secondary btn-sm" 
                    onClick={() => setShowTrackingDetails(!showTrackingDetails)}
                  >
                    <span>{showTrackingDetails ? 'Hide Tracking' : 'Live Tracking'}</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>

              {showTrackingDetails && (
                <div className="live-tracking-panel animate-fade-in-up">
                  <div className="tracking-agent-box">
                    <div className="agent-info">
                      <Truck size={16} className="agent-icon" />
                      <div>
                        <strong>Assigned Courier Agent:</strong> Vikram Singh (+91 98711 02819)
                        <span>Expected Delivery Window: Today before 7:00 PM IST</span>
                      </div>
                    </div>
                  </div>

                  <div className="tracking-events-list">
                    <div className="tracking-event active">
                      <span className="event-dot green" />
                      <div className="event-meta">
                        <span className="event-time">Today, 09:40 AM</span>
                        <span className="event-desc">Out for delivery with BlueDart courier agent — New Delhi South Hub</span>
                      </div>
                    </div>
                    <div className="tracking-event">
                      <span className="event-dot" />
                      <div className="event-meta">
                        <span className="event-time">Today, 06:15 AM</span>
                        <span className="event-desc">Arrived at Okhla Central Sorting Facility</span>
                      </div>
                    </div>
                    <div className="tracking-event">
                      <span className="event-dot" />
                      <div className="event-meta">
                        <span className="event-time">Yesterday, 08:30 PM</span>
                        <span className="event-desc">Hand-inspected & dispatched from laceyaan Atelier Hub</span>
                      </div>
                    </div>
                    <div className="tracking-event">
                      <span className="event-dot" />
                      <div className="event-meta">
                        <span className="event-time">Yesterday, 02:10 PM</span>
                        <span className="event-desc">Order confirmed and custom brass aglets precision-fitted</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Past Delivered Order */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-meta-info">
                  <span className="order-id">Order #LC-88241</span>
                  <span className="order-date">Delivered on August 24, 2026</span>
                </div>
                <div className="order-status-badge delivered">
                  <CheckCircle2 size={14} />
                  <span>Delivered</span>
                </div>
              </div>

              <div className="order-items-list">
                <div className="order-item-row">
                  <img src="/images/product-waxed.jpg" alt="Heritage Flat Waxed" className="order-item-thumb" />
                  <div className="order-item-details">
                    <span className="order-item-name">Heritage Waxed Flat Laces — Vintage Sail</span>
                    <span className="order-item-specs">Length: 54" • Solid Brass Aglets • Qty: 1</span>
                  </div>
                  <span className="order-item-price">₹699</span>
                </div>
              </div>

              <div className="order-card-footer">
                <span className="order-total-paid">Total Paid: <strong>₹699</strong> (Complimentary Delivery)</span>
                <button 
                  className="btn-primary btn-sm"
                  onClick={() => {
                    const prod = PRODUCTS.find(p => p.id === 'heritage-waxed-flat-sail') || PRODUCTS[0];
                    if (onAddToCart) {
                      onAddToCart({
                        product: prod,
                        selectedLength: '54"',
                        selectedSwatch: prod.swatches[0],
                        selectedAglet: prod.agletFinishes[0],
                        quantity: 1
                      });
                    }
                    onClose();
                  }}
                >
                  <Package size={13} />
                  <span>Reorder Item (Add to Bag)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Footwear Sizing Vault */}
        {activeTab === 'vault' && (
          <div className="profile-tab-content">
            <div className="tab-section-header">
              <div>
                <h4 className="tab-title">My Footwear Sizing Vault</h4>
                <p className="tab-subtitle">
                  Save your shoe collection measurements so you always order the precise lace length without measuring again.
                </p>
              </div>
              <button 
                className="btn-gold btn-sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus size={15} />
                <span>{showAddForm ? 'Cancel' : 'Add Footwear Profile'}</span>
              </button>
            </div>

            {/* Add New Shoe Profile Drawer/Form */}
            {showAddForm && (
              <form className="add-shoe-form animate-fade-in-up" onSubmit={handleAddShoeProfile}>
                <h5 className="form-heading">Record New Footwear Profile</h5>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Footwear Name / Model</label>
                    <input 
                      type="text" 
                      placeholder="E.g., Daily White Court Low-Tops"
                      value={newShoeName}
                      onChange={(e) => setNewShoeName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                      <option value="Sneakers (Casual & Everyday)">Sneakers (Casual & Everyday)</option>
                      <option value="Sport & Running Shoes">Sport & Running Shoes</option>
                      <option value="Office & Dress Shoes">Office & Dress Shoes</option>
                      <option value="Chelsea & Leather Boots">Chelsea & Leather Boots</option>
                      <option value="Retro Court & Minimalist Shoes">Retro Court & Minimalist Shoes</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Eyelet Pairs</label>
                    <select value={newEyelets} onChange={(e) => setNewEyelets(e.target.value)}>
                      <option value="4-5 Pairs">4-5 Pairs (Dress / Low)</option>
                      <option value="5-6 Pairs">5-6 Pairs (Sport / Tennis)</option>
                      <option value="6-7 Pairs">6-7 Pairs (Standard Sneakers)</option>
                      <option value="8-9 Pairs">8-9 Pairs (High-Tops / Boots)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Preferred Shoelace Length</label>
                    <select value={newLength} onChange={(e) => setNewLength(e.target.value)}>
                      <option value="36&quot;">36" (91 cm)</option>
                      <option value="45&quot;">45" (114 cm)</option>
                      <option value="54&quot;">54" (137 cm)</option>
                      <option value="63&quot;">63" (160 cm)</option>
                      <option value="72&quot;">72" (182 cm)</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn-primary btn-sm">
                    <span>Save to My Sizing Vault</span>
                  </button>
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}

            {/* Saved Shoe Profiles Grid */}
            <div className="shoe-vault-grid">
              {shoeProfiles.map((shoe) => (
                <div key={shoe.id} className="shoe-vault-card">
                  <div className="vault-card-header">
                    <div className="vault-icon-frame">
                      <Footprints size={18} />
                    </div>
                    <span className="vault-eyelets-badge">{shoe.eyelets}</span>
                    <button 
                      className="vault-delete-btn"
                      onClick={() => handleDeleteShoeProfile(shoe.id)}
                      title="Remove profile"
                      aria-label="Remove footwear profile"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h5 className="vault-shoe-name">{shoe.shoeName}</h5>
                  <span className="vault-category-tag">{shoe.category}</span>

                  <div className="vault-specs-box">
                    <div className="vault-spec-row">
                      <span>Dialled Length:</span>
                      <strong>{shoe.recommendedLength}</strong>
                    </div>
                    <div className="vault-spec-row">
                      <span>Preferred Drape:</span>
                      <span>{shoe.preferredStyle}</span>
                    </div>
                    <div className="vault-spec-row">
                      <span>Ideal Weave:</span>
                      <span>{shoe.preferredWeave}</span>
                    </div>
                  </div>

                  <div className="vault-action-row">
                    <button 
                      className="btn-primary btn-sm w-full"
                      onClick={() => {
                        onClose();
                        onSelectLengthForShopping(shoe.recommendedLength);
                        onNavigatePage('shop');
                      }}
                    >
                      <span>Shop {shoe.recommendedLength} Laces for This Shoe</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'address' && (
          <div className="profile-tab-content">
            <div className="tab-section-header">
              <div>
                <h4 className="tab-title">Saved Shipping Addresses</h4>
                <p className="tab-subtitle">Manage domestic and international delivery locations for express checkout.</p>
              </div>
            </div>

            <div className="addresses-grid">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  className={`address-card ${addr.isDefault ? 'default-address' : ''}`}
                >
                  {editingAddressId === addr.id && editForm ? (
                    <form className="address-edit-form" onSubmit={handleSaveAddress}>
                      <div className="address-card-header">
                        <span className="address-type-pill">Editing {addr.label}</span>
                      </div>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Street Address</label>
                        <input
                          type="text"
                          value={editForm.line1}
                          onChange={(e) => setEditForm({ ...editForm, line1: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>City & PIN Code</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={editForm.city}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            value={editForm.pincode}
                            onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-actions-row" style={{ marginTop: '0.5rem' }}>
                        <button type="submit" className="btn-primary btn-sm">
                          <Check size={13} />
                          <span>Save Changes</span>
                        </button>
                        <button 
                          type="button" 
                          className="btn-secondary btn-sm" 
                          onClick={() => {
                            setEditingAddressId(null);
                            setEditForm(null);
                          }}
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="address-card-header">
                        <span className="address-type-pill">{addr.label}</span>
                        {addr.isDefault && <span className="default-badge">Default</span>}
                      </div>
                      <h5 className="address-name">{addr.name}</h5>
                      <p className="address-text">
                        {addr.line1}<br />
                        {addr.city}, {addr.state} — {addr.pincode}<br />
                        India
                      </p>
                      <span className="address-phone">Phone: {addr.phone}</span>

                      <div className="address-card-actions">
                        <button 
                          className="btn-secondary btn-sm" 
                          onClick={() => handleStartEditAddress(addr)}
                          title="Edit this shipping address"
                        >
                          <Edit3 size={13} />
                          <span>Edit Address</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Privileges & Perks */}
        {activeTab === 'membership' && (
          <div className="profile-tab-content">
            <div className="tab-section-header">
              <div>
                <h4 className="tab-title">laceyaan Atelier Club Privileges</h4>
                <p className="tab-subtitle">Exclusive collector privileges unlocked with your Atelier Gold status.</p>
              </div>
            </div>

            <div className="perks-grid">
              <div className="perk-card">
                <div className="perk-icon-frame">
                  <ShieldCheck size={22} className="perk-icon gold" />
                </div>
                <div className="perk-details">
                  <h5>30-Day Guaranteed Fit Policy</h5>
                  <p>Ordered the wrong length? Enjoy complimentary, free domestic size exchanges with zero questions asked.</p>
                </div>
              </div>

              <div className="perk-card">
                <div className="perk-icon-frame">
                  <Truck size={22} className="perk-icon gold" />
                </div>
                <div className="perk-details">
                  <h5>Priority Air Express Dispatch</h5>
                  <p>Orders ship before 2:00 PM IST same-day with priority handling from our New Delhi atelier hub.</p>
                </div>
              </div>

              <div className="perk-card">
                <div className="perk-icon-frame">
                  <Sparkles size={22} className="perk-icon gold" />
                </div>
                <div className="perk-details">
                  <h5>VIP Capsule Vault Access</h5>
                  <p>Early 48-hour access to limited seasonal Jacquard and Design Lab box releases before public launch.</p>
                </div>
              </div>

              <div className="perk-card">
                <div className="perk-icon-frame">
                  <Award size={22} className="perk-icon gold" />
                </div>
                <div className="perk-details">
                  <h5>Solid Brass Aglet Engraving</h5>
                  <p>Complimentary custom monogram laser engraving on orders of 3 or more lace pairs.</p>
                </div>
              </div>
            </div>

            {/* Direct Atelier Concierge Help Box */}
            <div className="profile-concierge-card">
              <div className="concierge-content">
                <Mail size={22} className="concierge-icon" />
                <div>
                  <h5>Direct Atelier Concierge & Grail Support</h5>
                  <p>Need bespoke custom length aglets or silhouette consultations? Reach our master weavers directly via Gmail at <strong>laceyaan@gmail.com</strong>.</p>
                </div>
              </div>
              <a href="mailto:laceyaan@gmail.com" className="btn-secondary btn-sm concierge-email-btn" title="Email laceyaan Atelier directly">
                <Mail size={14} />
                <span>laceyaan@gmail.com</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
