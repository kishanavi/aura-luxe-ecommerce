// components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getFooterGridColumns = () => {
    if (isMobile) return 'repeat(2, minmax(0, 1fr))';
    if (isTablet) return 'repeat(2, minmax(0, 1fr))';
    return '1.35fr 1fr 1fr 1.35fr';
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer
      style={{
        backgroundColor: '#111111',
        color: '#CCCCCC',
        padding: isMobile ? '36px 16px 22px' : '56px 32px 28px',
        marginTop: isMobile ? '44px' : '72px',
        borderTop: '1px solid #222222',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: getFooterGridColumns(),
          columnGap: isMobile ? '18px' : '36px',
          rowGap: isMobile ? '26px' : '36px',
          marginBottom: isMobile ? '26px' : '38px',
        }}
      >
        {/* Brand & Support — மொபைலில் முழு அகலத்தில் */}
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <h3
            style={{
              color: '#FFFFFF',
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '800',
              marginTop: 0,
              marginBottom: isMobile ? '10px' : '14px',
              letterSpacing: '1.2px',
            }}
          >
            AURA LUXE
          </h3>
          <p
            style={{
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#999999',
              marginTop: 0,
              marginBottom: isMobile ? '12px' : '16px',
              maxWidth: '340px',
            }}
          >
            Your ultimate destination for premium fashion, trendy shirts, crop tops, and everyday wear.
          </p>
          <p style={{ fontSize: '13px', color: '#CCCCCC', margin: 0, lineHeight: '1.5' }}>
            <strong style={{ color: '#FFFFFF' }}>Customer Support:</strong>{' '}
            <span style={{ display: isMobile ? 'inline' : 'block', marginTop: isMobile ? 0 : '4px' }}>
              +94 (77) 321 1111
            </span>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '700',
              marginTop: 0,
              marginBottom: isMobile ? '12px' : '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}
          >
            Quick Links
          </h4>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '8px' : '10px',
              fontSize: '13px',
            }}
          >
            <li><Link to="/men" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Men Collection</Link></li>
            <li><Link to="/women" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Women Collection</Link></li>
            <li><Link to="/category/shirts" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Shirts</Link></li>
            <li><Link to="/category/crop-tops" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Crop Tops</Link></li>
            <li><Link to="/account" style={{ color: '#A3A3A3', textDecoration: 'none' }}>My Account</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '700',
              marginTop: 0,
              marginBottom: isMobile ? '12px' : '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}
          >
            Customer Care
          </h4>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '8px' : '10px',
              fontSize: '13px',
            }}
          >
            <li><span style={{ color: '#A3A3A3' }}>Local Delivery Info</span></li>
            <li><span style={{ color: '#A3A3A3' }}>Returns & Exchanges</span></li>
            <li><span style={{ color: '#A3A3A3' }}>Privacy Policy</span></li>
            <li><span style={{ color: '#A3A3A3' }}>Terms of Service</span></li>
          </ul>
        </div>

        {/* Stay Updated — மொபைலில் முழு அகலத்தில் */}
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '700',
              marginTop: 0,
              marginBottom: isMobile ? '10px' : '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}
          >
            Stay Updated
          </h4>
          <p
            style={{
              fontSize: '13px',
              color: '#999999',
              marginTop: 0,
              marginBottom: '12px',
              lineHeight: '1.5',
            }}
          >
            Subscribe to get special offers and updates.
          </p>
          <form
            onSubmit={handleSubscribe}
            style={{
              display: 'flex',
              flexDirection: isMobile && windowWidth < 380 ? 'column' : 'row',
              gap: '8px',
              width: '100%',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (subscribed) setSubscribed(false);
              }}
              placeholder="Enter your email"
              style={{
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid #333333',
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                fontSize: '13px',
                flex: 1,
                minWidth: 0,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#111111',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Join
            </button>
          </form>
          {subscribed && (
            <p style={{ fontSize: '12px', color: '#4ADE80', marginTop: '8px', marginBottom: 0 }}>
              Subscribed successfully!
            </p>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: isMobile ? '18px' : '24px',
          borderTop: '1px solid #222222',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '12px',
          color: '#777777',
        }}
      >
        <p style={{ margin: 0 }}>© 2026 AURA LUXE. All Rights Reserved.</p>
        <p style={{ margin: 0 }}>Designed for Fashion E-Commerce Web Application</p>
      </div>
    </footer>
  );
}