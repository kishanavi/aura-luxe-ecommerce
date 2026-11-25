import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const communityScrollRef = useRef(null);

  // 3 Hero Banner Photos
  const slides = [
    {
      title: 'DRESS TO IMPRESS',
      subtitle: 'We have everything you need to dress your best.',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      ctaLink: '/new-arrivals',
    },
    {
      title: 'ELEVATE YOUR STYLE',
      subtitle: 'Discover the latest seasonal collection for Men & Women.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      ctaLink: '/men',
    },
    {
      title: 'TRENDING FASHION',
      subtitle: 'Explore exclusive shirts, crop tops, and everyday wear.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      ctaLink: '/women',
    },
  ];

  // Auto slide rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Categories requested: Men, Women, Shirts, Crop Tops
  const categories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', link: '/men' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', link: '/women' },
    { name: 'Shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', link: '/category/shirts' },
    { name: 'Crop Tops', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', link: '/category/crop-tops' },
  ];

  // Community customer photos featuring Crop Tops, Shirts, Frocks, T-Shirts
  const communityPhotos = [
    {
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80',
      title: 'Crop Top Collection',
    },
    {
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
      title: 'Casual Shirts',
    },
    {
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
      title: 'Trending Frock',
    },
    {
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80',
      title: 'Classic T-Shirt',
    },
    {
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
      title: 'Women Style',
    },
    {
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&q=80',
      title: 'Men Fashion',
    },
  ];

  const scrollCommunity = (direction) => {
    if (communityScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      communityScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden', backgroundColor: '#FFFFFF', color: '#1E1E1E' }}>
      
      {/* 1. ANNOUNCEMENT BAR */}
      <div
        style={{
          backgroundColor: '#111111',
          color: '#FFFFFF',
          textAlign: 'center',
          padding: '9px 16px',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.5px',
        }}
      >
        Local Delivery Free - Orders Over LKR 6,000
      </div>

      {/* 2. HERO SECTION (3 PHOTOS SLIDER WITH < AND > ARROWS) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '560px',
          backgroundColor: '#F4F4F4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 5%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Background Decorative Circle */}
        <div
          style={{
            position: 'absolute',
            right: '6%',
            bottom: '-50px',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            zIndex: 1,
          }}
        />

        {/* LEFT TEXT CONTENT */}
        <div style={{ zIndex: 2, maxWidth: '580px', padding: '40px 0' }}>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: '900',
              color: '#1A1A1A',
              margin: '0 0 14px 0',
              lineHeight: '1.05',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}
          >
            {slides[currentSlide].title}
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: '#555555',
              fontWeight: '400',
              margin: '0 0 24px 0',
              lineHeight: '1.4',
            }}
          >
            {slides[currentSlide].subtitle}
          </p>

          <div
            style={{
              width: '120px',
              height: '4px',
              backgroundColor: '#1E1E1E',
              marginBottom: '28px',
            }}
          />

          <Link
            to={slides[currentSlide].ctaLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: '13px 32px',
              fontSize: '13px',
              fontWeight: '750',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              borderRadius: '2px',
              transition: 'background 0.2s',
            }}
          >
            Shop Collection
          </Link>
        </div>

        {/* RIGHT BANNER IMAGE */}
        <div
          style={{
            zIndex: 2,
            height: '520px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <img
            src={slides[currentSlide].image}
            alt="Fashion Banner"
            style={{
              height: '92%',
              maxWidth: '500px',
              objectFit: 'cover',
              objectPosition: 'top',
              borderRadius: '8px 8px 0 0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
          />
        </div>

        {/* SLIDER ARROWS (< and >) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid #ddd',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid #ddd',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          ›
        </button>

        {/* DOT INDICATORS */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentSlide === index ? '#1E1E1E' : '#CCC',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>


      {/* 3. CATEGORIES SECTION (Men, Women, Shirts, Crop Tops) */}
      <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Shop By Category
          </h2>
          <p style={{ color: '#666', fontSize: '15px' }}>Explore Men, Women, Shirts & Crop Tops</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              style={{
                position: 'relative',
                height: '380px',
                borderRadius: '8px',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                display: 'block',
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {cat.name}
                </span>
                <span
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#1E1E1E',
                    padding: '8px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* 4. SKETCH CO COMMUNITY SECTION (Customer Style Gallery with Visible < > Arrows) */}
      <section style={{ maxWidth: '1200px', margin: '70px auto', padding: '0 20px', position: 'relative' }}>
        
        {/* Title with Lines */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '35px', gap: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#CCCCCC', maxWidth: '300px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', textTransform: 'uppercase', margin: 0, color: '#1E1E1E', textAlign: 'center' }}>
            AURA LUXE Community
          </h2>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#CCCCCC', maxWidth: '300px' }} />
        </div>

        {/* Community Slider Container with Padding for Arrows */}
        <div style={{ position: 'relative', padding: '0 50px' }}>
          
          {/* Left Arrow (Clearly Visible) */}
          <button
            onClick={() => scrollCommunity('left')}
            aria-label="Scroll Left"
            style={{
              position: 'absolute',
              left: '0px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              backgroundColor: '#FFFFFF',
              border: '1px solid #CCCCCC',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1E1E1E',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            ‹
          </button>

          {/* Scrolling Images Track */}
          <div
            ref={communityScrollRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              padding: '10px 0',
              width: '100%',
            }}
          >
            {communityPhotos.map((item, index) => (
              <div
                key={index}
                style={{
                  minWidth: '260px',
                  height: '380px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  position: 'relative',
                  backgroundColor: '#F9F9F9',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '14px 16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow (Clearly Visible) */}
          <button
            onClick={() => scrollCommunity('right')}
            aria-label="Scroll Right"
            style={{
              position: 'absolute',
              right: '0px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              backgroundColor: '#FFFFFF',
              border: '1px solid #CCCCCC',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1E1E1E',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            ›
          </button>

        </div>
      </section>


      {/* FLOATING SOCIAL ICONS BAR */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: '45%',
          transform: 'translateY(-50%)',
          backgroundColor: '#FFFFFF',
          boxShadow: '2px 2px 12px rgba(0,0,0,0.12)',
          borderRadius: '0 8px 8px 0',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          zIndex: 900,
        }}
      >
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: '#1E1E1E', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: '#1E1E1E', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" style={{ color: '#1E1E1E', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </a>
      </div>

      {/* FLOATING WHATSAPP CHAT WIDGET */}
      <a
        href="https://wa.me/94773211111"
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 950,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1E1E1E',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            border: '1px solid #EAEAEA',
          }}
        >
          Need Help? <strong>Chat with us</strong>
        </span>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
      </a>

    </div>
  );
}