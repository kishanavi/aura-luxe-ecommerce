// components/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail({ products = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => (p._id === id || p.id === id));

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [previewImg, setPreviewImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const checkStockAvailability = (colorObj, size) => {
    if (!colorObj) return false;

    if (colorObj.sizes && !Array.isArray(colorObj.sizes) && typeof colorObj.sizes === 'object') {
      const sizeKey = Object.keys(colorObj.sizes).find(k => k.toUpperCase() === size.toUpperCase());
      if (sizeKey !== undefined) {
        return Number(colorObj.sizes[sizeKey]) > 0;
      }
    }

    if (Array.isArray(colorObj.sizes)) {
      const foundSize = colorObj.sizes.find(s => (s.size || s.name || '').toUpperCase() === size.toUpperCase());
      if (foundSize) {
        const qty = foundSize.stock ?? foundSize.quantity ?? foundSize.qty ?? 0;
        return Number(qty) > 0;
      }
    }

    if (Array.isArray(product?.variants)) {
      const variant = product.variants.find(
        v => (v.color === colorObj.colorName || v.colorName === colorObj.colorName) &&
             (v.size || '').toUpperCase() === size.toUpperCase()
      );
      if (variant) {
        const qty = variant.stock ?? variant.quantity ?? 0;
        return Number(qty) > 0;
      }
    }

    if (colorObj.stock !== undefined) return Number(colorObj.stock) > 0;
    if (colorObj.quantity !== undefined) return Number(colorObj.quantity) > 0;

    return true;
  };

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

  const isFullyOutOfStock = product ? getTotalProductStock(product) === 0 : false;

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      const currentColor = product.colors[selectedColorIdx];
      if (!checkStockAvailability(currentColor, selectedSize)) {
        const firstAvailableIdx = product.colors.findIndex(col => checkStockAvailability(col, selectedSize));
        if (firstAvailableIdx !== -1) {
          setSelectedColorIdx(firstAvailableIdx);
          setPreviewImg(product.colors[firstAvailableIdx].image || '');
        }
      }
    }
  }, [selectedSize, product]);

  useEffect(() => {
    if (product) {
      const initialImg = (product.colors && product.colors[0]?.image) || (product.images && product.images[0]) || product.image || '';
      setPreviewImg(initialImg);
    }
  }, [product]);

  if (!product) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '22px', color: '#1E1E1E', marginBottom: '10px' }}>Product Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: '10px 20px', backgroundColor: '#1E1E1E', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const colorsList = product.colors || [];
  const currentVariant = colorsList[selectedColorIdx] || colorsList[0] || {};
  const displayedImage = previewImg || currentVariant.image || (product.images && product.images[0]) || product.image || 'https://via.placeholder.com/500';

  const currentPosX = currentVariant.posX ?? 50;
  const currentPosY = currentVariant.posY ?? 0;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '45px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '30px', textTransform: 'capitalize' }}>
          Home / {product.category || 'Collection'} / {product.subCategory || 'Item'} / <span style={{ color: '#1E1E1E', fontWeight: '600' }}>{product.name}</span>
        </div>

        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* இடதுபக்க படம் - 3:4 Fixed Ratio Standard Frame (Customer View) */}
          <div style={{ flex: '1 1 450px', maxWidth: '480px' }}>
            <div 
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              style={{ 
                width: '100%',
                aspectRatio: '3 / 4',
                backgroundColor: '#FAF8F5', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                position: 'relative',
                cursor: 'zoom-in',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* எல்லா கலர் மற்றும் சைஸ்களிலும் ஸ்டாக் 0 என்றால் மட்டும் OUT OF STOCK பேட்ஜ் */}
              {isFullyOutOfStock && (
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  OUT OF STOCK
                </span>
              )}

              <img 
                src={displayedImage} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: `${currentPosX}% ${currentPosY}%`,
                  transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transition: isZoomed ? 'none' : 'transform 0.3s ease',
                  opacity: isFullyOutOfStock ? 0.7 : 1
                }} 
              />
            </div>

            {/* குட்டி போட்டோக்கள் (Thumbnails) */}
            {colorsList.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {colorsList.map((col, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setPreviewImg(col.image)}
                    onClick={() => {
                      setPreviewImg(col.image);
                      if (checkStockAvailability(col, selectedSize)) {
                        setSelectedColorIdx(idx);
                      }
                    }}
                    style={{
                      width: '75px',
                      height: '100px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: displayedImage === col.image ? '2px solid #1E1E1E' : '1px solid #EAE5DC',
                      cursor: 'pointer',
                      backgroundColor: '#FAF8F5',
                      transition: 'transform 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={col.image || displayedImage} 
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
          </div>
          
          {/* வலதுபக்க விவரங்கள் */}
          <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1E1E1E', marginBottom: '15px', letterSpacing: '-0.5px' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: '26px', fontWeight: '700', color: '#1E1E1E', marginBottom: '25px' }}>
              {product.isOnSale ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '18px', fontWeight: '400' }}>
                    LKR {product.price}
                  </span>
                  <span style={{ color: '#DC2626' }}>LKR {product.salePrice}</span>
                </div>
              ) : (
                <span>LKR {product.price}</span>
              )}
            </div>

            {/* சைஸ் தேர்வு பகுதி */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', color: '#1E1E1E', marginBottom: '10px' }}>
                Size: <span style={{ fontWeight: '400', textTransform: 'uppercase' }}>{selectedSize}</span>
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '48px',
                      height: '48px',
                      border: selectedSize === size ? '2px solid #1E1E1E' : '1px solid #D1CBD3',
                      backgroundColor: selectedSize === size ? '#1E1E1E' : '#FFF',
                      color: selectedSize === size ? '#FFF' : '#1E1E1E',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* கலர் தேர்வு பகுதி */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#1E1E1E' }}>
                Color: <span style={{ fontWeight: '400', textTransform: 'capitalize' }}>{currentVariant.colorName || 'Default'}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {colorsList.map((col, idx) => {
                  const isAvailable = checkStockAvailability(col, selectedSize);

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedColorIdx(idx);
                          setPreviewImg(col.image);
                        }
                      }}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: selectedColorIdx === idx && isAvailable ? '2px solid #1E1E1E' : '2px solid #EAE5DC',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        position: 'relative',
                        backgroundColor: '#FAF8F5',
                        transition: 'all 0.2s'
                      }}
                      title={col.colorName}
                    >
                      <img 
                        src={col.image || displayedImage} 
                        alt={col.colorName} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          objectPosition: `${col.posX ?? 50}% ${col.posY ?? 0}%`,
                          opacity: isAvailable ? 1 : 0.35,
                          filter: isAvailable ? 'none' : 'grayscale(60%)'
                        }} 
                      />
                      
                      {!isAvailable && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#DC2626', 
                          fontWeight: 'bold', 
                          fontSize: '18px', 
                          backgroundColor: 'rgba(255,255,255,0.45)' 
                        }}>
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* குவாண்டிட்டி மற்றும் Add to Cart */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', border: '1px solid #D1CBD3', borderRadius: '8px', overflow: 'hidden', height: '50px' }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  disabled={isFullyOutOfStock}
                  style={{ padding: '0 16px', border: 'none', background: '#F5F2EC', cursor: isFullyOutOfStock ? 'not-allowed' : 'pointer', fontSize: '18px', fontWeight: '600', color: '#000' }}
                >
                  -
                </button>
                <span style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '16px', color: '#000' }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q + 1)} 
                  disabled={isFullyOutOfStock}
                  style={{ padding: '0 16px', border: 'none', background: '#F5F2EC', cursor: isFullyOutOfStock ? 'not-allowed' : 'pointer', fontSize: '18px', fontWeight: '600', color: '#000' }}
                >
                  +
                </button>
              </div>

              <button 
                disabled={isFullyOutOfStock}
                style={{ 
                  flex: 1, 
                  height: '50px', 
                  backgroundColor: isFullyOutOfStock ? '#9CA3AF' : '#1E1E1E', 
                  color: '#FFF', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: isFullyOutOfStock ? 'not-allowed' : 'pointer', 
                  fontSize: '15px',
                  letterSpacing: '0.5px'
                }}
              >
                {isFullyOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>

              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: '#FFF', 
                  border: '1px solid #D1CBD3', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: isWishlisted ? '#DC2626' : '#1E1E1E'
                }}
                title="Add to Wishlist"
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <span 
                onClick={() => setIsSizeGuideOpen(true)}
                style={{ fontSize: '14px', color: '#1E1E1E', textDecoration: 'underline', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
              >
                📏 Size Guide
              </span>
            </div>

            <div style={{ padding: '15px 0', borderTop: '1px solid #EAE5DC', borderBottom: '1px solid #EAE5DC', marginBottom: '20px', fontSize: '13px', color: '#555', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📦 <strong>Free Shipping</strong> for Orders Above LKR 6,000</div>
              <div>⚡ Fast Delivery Right to Your Doorstep</div>
            </div>

            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              {product.description || "Crafted with precision and premium quality fabric, designed to give you both unmatched comfort and modern elegance for any occasion."}
            </p>

          </div>

        </div>

      </div>

      {isSizeGuideOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '12px', maxWidth: '600px', width: '90%', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#F5F2EC', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E1E1E' }}
            >
              ✕
            </button>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#1E1E1E' }}>Size Guide</h2>
            <div style={{ width: '100%', maxHeight: '450px', overflow: 'hidden', display: 'flex', justifyContent: 'center', backgroundColor: '#FAF8F5', borderRadius: '8px', padding: '10px' }}>
              <img 
                src={product.sizeGuideImage || 'https://via.placeholder.com/500x350?text=Size+Guide+Chart'} 
                alt="Size Guide" 
                style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain', borderRadius: '6px' }} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}