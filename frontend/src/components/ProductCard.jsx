// components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const colorsList = product.colors || [];
  const currentColor = colorsList[selectedColorIdx] || colorsList[0] || {};
  
  const cardImage = currentColor.image || (product.images && product.images[0]) || product.image || 'https://via.placeholder.com/400';

  const currentPosX = currentColor.posX ?? 50;
  const currentPosY = currentColor.posY ?? 0;

  // எல்லா கலர்கள் மற்றும் எல்லா சைஸ்களிலும் மொத்த ஸ்டாக் எவ்வளவு என்று கணக்கிடும் ஃபங்ஷன்
  const getTotalProductStock = (prod) => {
    if (!prod) return 0;

    if (Array.isArray(prod.colors) && prod.colors.length > 0) {
      return prod.colors.reduce((total, col) => {
        if (col.sizes && !Array.isArray(col.sizes) && typeof col.sizes === 'object') {
          const sizeSum = Object.values(col.sizes).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
          return total + sizeSum;
        }
        if (Array.isArray(col.sizes)) {
          const sizeSum = col.sizes.reduce(
            (sum, s) => sum + (Number(s.stock ?? s.quantity ?? s.qty ?? 0) || 0),
            0
          );
          return total + sizeSum;
        }
        return total + (Number(col.stock ?? col.quantity ?? 0) || 0);
      }, 0);
    }

    if (Array.isArray(prod.variants) && prod.variants.length > 0) {
      return prod.variants.reduce((sum, v) => sum + (Number(v.stock ?? v.quantity ?? 0) || 0), 0);
    }

    return Number(prod.stock ?? prod.quantity ?? 0) || 0;
  };

  const isFullyOutOfStock = getTotalProductStock(product) === 0;

  const price = product.price || 0;
  const salePrice = product.salePrice || price;
  const installmentPrice = Math.round(salePrice / 3);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#FFFFFF', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      {/* 1. ப்ராடக்ட் இமேஜ் பகுதி */}
      <div style={{ position: 'relative', width: '100%', height: '380px', backgroundColor: '#F5F2EC', overflow: 'hidden' }}>
        {/* எல்லா கலர் மற்றும் சைஸ்களிலும் ஸ்டாக் 0 என்றால் மட்டும் OUT OF STOCK பேட்ஜ் */}
        {isFullyOutOfStock && (
          <span
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.5px',
              zIndex: 5,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            OUT OF STOCK
          </span>
        )}

        <Link to={`/product/${product._id || product.id}`}>
          <img 
            src={cardImage} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: `${currentPosX}% ${currentPosY}%`,
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              opacity: isFullyOutOfStock ? 0.7 : 1
            }} 
          />
        </Link>
      </div>

      {/* 2. விவரங்கள் மற்றும் SELECT OPTIONS பட்டன் பகுதி */}
      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* கலர் ஸ்வாட்சுகள் (Color Swatches) */}
        {colorsList.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2px' }}>
            {colorsList.map((col, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setSelectedColorIdx(idx)}
                onClick={() => setSelectedColorIdx(idx)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: selectedColorIdx === idx ? '2px solid #1E1E1E' : '1px solid #CCC',
                  cursor: 'pointer',
                  backgroundColor: '#EEE',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                title={col.colorName}
              >
                <img
                  src={col.image || cardImage}
                  alt={col.colorName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: `${col.posX ?? 50}% ${col.posY ?? 0}%`
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ப்ராடக்ட் பெயர் */}
        <Link 
          to={`/product/${product._id || product.id}`}
          style={{ fontSize: '14px', fontWeight: '500', color: '#1E1E1E', textDecoration: 'none', lineHeight: '1.4' }}
        >
          {product.name}
        </Link>

        {/* கேட்டகிரி */}
        <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.category}
        </div>

        {/* விலை */}
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#1E1E1E', margin: '2px 0' }}>
          {product.isOnSale ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '13px', fontWeight: '400' }}>
                LKR {product.price.toLocaleString()}
              </span>
              <span style={{ color: '#DC2626' }}>LKR {Number(product.salePrice).toLocaleString()}</span>
            </div>
          ) : (
            <span>LKR {Number(product.price).toLocaleString()}</span>
          )}
        </div>

        {/* இன்ஸ்டால்மென்ட் குறிப்பு */}
        <div style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span>Cash on Delivery or Online Payment</span>
        </div>

        {/* 3. SELECT OPTIONS பட்டன் */}
        <Link 
          to={`/product/${product._id || product.id}`}
          style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#1E1E1E',
            textAlign: 'center',
            padding: '11px 0',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            textDecoration: 'none',
            borderRadius: '4px',
            border: '1px solid #1E1E1E',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
            marginTop: '4px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E'; e.currentTarget.style.color = '#FFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#1E1E1E'; }}
        >
          SELECT OPTIONS
        </Link>

      </div>

    </div>
  );
}