import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({
  isAuthenticated,
  onOpenAuthModal,
  handleLogout,
  onOpenProfile,
  cartCount = 0,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [mobileExpanded, setMobileExpanded] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'NEW ARRIVALS', href: '/new-arrivals' },
    { name: 'MEN', href: '/men' },
    { name: 'WOMEN', href: '/women' },
    { name: 'CASUAL WEAR', href: '/casual-wear' },
    { name: 'ACCESSORIES', href: '/accessories' },
    { name: 'SLIPPERS', href: '/slippers' },
    { name: 'VOUCHERS', href: '/vouchers' },
    { name: '', href: '/sale', badge: 'SALE' },
    { name: 'ACCOUNT', href: '/account' },
    { name: 'WISHLIST', href: '/wishlist' },
  ];

  const dropdownData = {
    'MEN': ['Denims', 'Gym Wear', 'Hoodies', 'Shirts', 'Shorts', 'T-Shirts', 'Trousers'],
    'WOMEN': ['Crop Tops', 'Denims', 'Dress', 'Frocks', 'Skirts', 'Blouse', 'Body Suit'],
    'SLIPPERS': ['Men Slippers', 'Women Slippers'],
    'ACCESSORIES': ['Belts', 'Caps', 'Perfumes', 'Hats', 'Wallets']
  };

  const toggleMobileSub = (name) => {
    setMobileExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleNavClick = (e, link) => {
    if (link.name === 'ACCOUNT') {
      const token = localStorage.getItem('token');
      if (!token) {
        e.preventDefault();
        if (isMobile) setMobileMenuOpen(false);
        if (onOpenAuthModal) {
          onOpenAuthModal();
        }
        return;
      }
    }

    if (isMobile) {
      if (dropdownData[link.name]) {
        e.preventDefault();
        toggleMobileSub(link.name);
        return;
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, boxSizing: 'border-box' }}>
      
      {/* 1. TOP WHITE BAR */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'auto 1fr auto' : '1fr auto 1fr',
          alignItems: 'center',
          height: '68px',
          padding: isMobile ? '0 16px' : '0 40px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EAE5DC',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {isMobile ? (
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            <span style={{ width: '22px', height: '2px', backgroundColor: '#1E1E1E', display: 'block' }}></span>
            <span style={{ width: '22px', height: '2px', backgroundColor: '#1E1E1E', display: 'block' }}></span>
            <span style={{ width: '22px', height: '2px', backgroundColor: '#1E1E1E', display: 'block' }}></span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555555', whiteSpace: 'nowrap' }}>
            <span>Customer Service</span>
            <a href="tel:+94772818202" style={{ fontWeight: '700', color: '#1E1E1E', textDecoration: 'none' }}>
              +94 (77) 321 1111
            </a>
          </div>
        )}

        {/* BRAND LOGO */}
        <div
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            justifySelf: 'center',
            border: '1.5px solid #1E1E1E',
            padding: isMobile ? '4px 10px' : '6px 18px',
            letterSpacing: '2px',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? '15px' : '18px', fontWeight: '800', color: '#1E1E1E', fontFamily: 'serif' }}>
              AURA <span style={{ color: '#C86D51' }}>LUXE</span>
            </h2>
          </Link>
        </div>

        {/* RIGHT ICONS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: isMobile ? '16px' : '22px' }}>
          
          <button aria-label="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowDropdown(!showDropdown);
                } else {
                  onOpenAuthModal();
                }
              }}
              aria-label="User Account"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isAuthenticated ? '#C86D51' : 'none'}
                stroke={isAuthenticated ? '#C86D51' : '#1E1E1E'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {isAuthenticated && showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '36px',
                  right: 0,
                  width: '180px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EAE5DC',
                  borderRadius: '8px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  padding: '8px 0',
                  zIndex: 1100,
                }}
              >
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '13px', color: '#1E1E1E', cursor: 'pointer', fontWeight: '600' }}
                >
                  My Profile 
                </button>
                <div style={{ height: '1px', backgroundColor: '#EAE5DC', margin: '4px 0' }} />
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '13px', color: '#C86D51', cursor: 'pointer', fontWeight: '700' }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button aria-label="Shopping Cart" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: '800',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </span>
          </button>

        </div>
      </div>

      {/* 2. DESKTOP BLACK CATEGORY BAR WITH LINK */}
      {!isMobile && (
        <div
          style={{
            backgroundColor: '#0A0A0A',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px',
            height: '46px',
            padding: '0 20px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.8px',
            position: 'relative',
          }}
        >
          {navLinks.map((link, index) => {
            const hasDropdown = dropdownData[link.name];
            const subcategories = hasDropdown ? dropdownData[link.name] : [];

            return (
              <div
                key={index}
                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '100%',
                    fontWeight: '700',
                    letterSpacing: '0.8px',
                  }}
                >
                  {link.name === '' ? 'SALE' : link.name}
                  {hasDropdown && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px' }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                  {link.badge && (
                    <span
                      style={{
                        backgroundColor: '#E53935',
                        color: '#FFF',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '800',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>

                {/* Dropdown Box Perfectly Aligned */}
                {hasDropdown && activeDropdown === link.name && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '46px',
                      left: '0',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                      borderRadius: '0px 0px 8px 8px',
                      padding: '10px 0',
                      minWidth: '210px',
                      zIndex: 1300,
                      border: '1px solid #222222',
                    }}
                  >
                    {subcategories.map((sub, subIdx) => {
                      const subHref = `${link.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`;
                      return (
                        <Link
                          key={subIdx}
                          to={subHref}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: '#E0E0E0',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: '650',
                            letterSpacing: '0.5px',
                            transition: 'background 0.2s, color 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1A1A1A';
                            e.target.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#E0E0E0';
                          }}
                        >
                          {sub}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. MOBILE SLIDING DRAWER MENU */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1200,
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              padding: '20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {navLinks.map((link, index) => {
                  const hasDropdown = dropdownData[link.name];
                  const isExpanded = mobileExpanded[link.name];

                  return (
                    <div key={index}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Link
                          to={link.href}
                          onClick={(e) => handleNavClick(e, link)}
                          style={{
                            color: '#1E1E1E',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '700',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{link.name === '' ? 'SALE' : link.name}</span>
                          {hasDropdown && (
                            <span 
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                toggleMobileSub(link.name);
                              }}
                              style={{ fontSize: '16px', fontWeight: 'bold', padding: '0 8px', cursor: 'pointer' }}
                            >
                              {isExpanded ? '▼' : '›'}
                            </span>
                          )}
                        </Link>

                        {link.badge && (
                          <span
                            style={{
                              backgroundColor: '#E53935',
                              color: '#FFF',
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '800',
                              marginRight: '8px',
                            }}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>

                      {hasDropdown && isExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', marginTop: '8px', borderLeft: '2px solid #C86D51' }}>
                          {dropdownData[link.name].map((sub, subIdx) => {
                            const subHref = `${link.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`;
                            return (
                              <Link
                                key={subIdx}
                                to={subHref}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                  fontSize: '13px',
                                  color: '#555555',
                                  textDecoration: 'none',
                                  fontWeight: '600',
                                  padding: '4px 0',
                                }}
                              >
                                {sub}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #EAE5DC', paddingTop: '15px', fontSize: '12px', color: '#555' }}>
              <p style={{ margin: '0 0 5px 0' }}>Customer Service:</p>
              <a href="tel:+94772818202" style={{ fontWeight: '700', color: '#1E1E1E', textDecoration: 'none' }}>
                +94 (77) 281 8202
              </a>
            </div>
          </div>

          <div style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

    </header>
  );
}