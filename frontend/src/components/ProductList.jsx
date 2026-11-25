// components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductList({ category, products = [], sale }) {
  const { subcategory } = useParams();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ஃபில்டர் பேனலுக்குள் தற்காலிகமாக செலக்ட் செய்பவை (Draft state - பேக்ரவுண்டை மாற்றாது)
  const [draftMaxPrice, setDraftMaxPrice] = useState(25000);
  const [draftCategories, setDraftCategories] = useState([]);
  const [draftSubCategories, setDraftSubCategories] = useState([]);
  const [draftStatusFilters, setDraftStatusFilters] = useState([]);

  // 'Apply' கொடுத்த பிறகு பேஜில் செயல்படும் உண்மையான ஃபில்டர்கள் (Applied state)
  const minPrice = 0;
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(25000);
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedSubCategories, setAppliedSubCategories] = useState([]);
  const [appliedStatusFilters, setAppliedStatusFilters] = useState([]);

  // 'grid4' = 4-column grid, 'sideBySide2' = 2-column 3:4 photo + right-side centered details
  const [viewMode, setViewMode] = useState('grid4');

  const dropdownData = {
    'MEN': ['Denims', 'Gym Wear', 'Hoodies', 'Shirts', 'Shorts', 'T-Shirts', 'Trousers'],
    'WOMEN': ['Crop Tops', 'Denims', 'Dress', 'Frocks', 'Skirts', 'Blouse', 'Body Suit'],
    'SLIPPERS': ['Men Slippers', 'Women Slippers'],
    'ACCESSORIES': ['Belts', 'Caps', 'Perfumes', 'Hats', 'Wallets']
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Page/category மாறும்போது draft மற்றும் applied இரண்டையும் ரீசெட் செய்கிறது
  useEffect(() => {
    setDraftMaxPrice(25000);
    setDraftCategories([]);
    setDraftSubCategories([]);
    setDraftStatusFilters([]);

    setAppliedMaxPrice(25000);
    setAppliedCategories([]);
    setAppliedSubCategories([]);
    setAppliedStatusFilters([]);
  }, [category, subcategory, sale]);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const categoryDescriptions = {
    'Men': "Find the best men's clothing online in Sri Lanka at Aura Luxe. Our collection features stylish men's wear, including casual outfits and elegant full suits for any occasion. Shop with confidence, knowing your payments are secure, and enjoy fast delivery right to your doorstep. Elevate your style with our versatile selections designed for the modern man!",
    'Women': "Explore the latest women's fashion trends at Aura Luxe. Discover elegant dresses, stylish crop tops, and comfortable daily wear designed to elevate your wardrobe.",
    'Casual Wear': "Keep it comfortable yet stylish with our exclusive casual wear collection, perfect for your everyday outings and relaxed weekends.",
    'Accessories': "Complete your look with our premium collection of accessories, designed to add the perfect touch of style to any outfit.",
    'Slippers': "Step into comfort with our durable and trendy slippers, crafted for your everyday ease and casual strolls.",
    'New Arrivals': "Check out our freshest drops and latest styles straight from the design floor. Be the first to wear our newest additions.",
    'Sale': "Grab your favorite styles at unbeatable prices. Shop our exclusive sale collection before stocks run out!"
  };

  const getProductTotalStock = (prod) => {
    if (!prod) return 0;
    if (Array.isArray(prod.colors) && prod.colors.length > 0) {
      return prod.colors.reduce((total, col) => {
        if (col.sizes && !Array.isArray(col.sizes) && typeof col.sizes === 'object') {
          return total + Object.values(col.sizes).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
        }
        if (Array.isArray(col.sizes)) {
          return total + col.sizes.reduce((sum, s) => sum + (Number(s.stock ?? s.quantity ?? s.qty ?? 0) || 0), 0);
        }
        return total + (Number(col.stock ?? col.quantity ?? 0) || 0);
      }, 0);
    }
    if (Array.isArray(prod.variants) && prod.variants.length > 0) {
      return prod.variants.reduce((sum, v) => sum + (Number(v.stock ?? v.quantity ?? 0) || 0), 0);
    }
    return Number(prod.stock ?? prod.quantity ?? 0) || 0;
  };

  const basePageProducts = products.filter((p) => {
    if (category === 'New Arrivals') return p.isNewArrival === true;
    if (sale) return p.isOnSale === true;
    if (category) {
      return p.category && p.category.toLowerCase() === category.toLowerCase();
    }
    return true;
  });

  const availableFilterCategories = category && category !== 'New Arrivals'
    ? [category]
    : Object.keys(dropdownData);

  const getSubOptionsForCategory = (catName) => {
    const matchedKey = Object.keys(dropdownData).find(
      (k) => k.toLowerCase() === String(catName).toLowerCase()
    );
    const presetList = matchedKey ? dropdownData[matchedKey] : [];

    const productSubs = basePageProducts
      .filter((p) => p.category && p.category.toLowerCase() === String(catName).toLowerCase())
      .map((p) => p.subCategory)
      .filter(Boolean);

    const combined = [...presetList];
    productSubs.forEach((sub) => {
      const exists = combined.some((item) => item.toLowerCase() === String(sub).toLowerCase());
      if (!exists) combined.push(sub);
    });

    return combined;
  };

  // ஃபில்டர் பேனலைத் திறக்கும்போது, தற்போது அப்ளை ஆகியிருக்கும் மதிப்புகளை draft-ல் ஏற்றுகிறது
  const handleOpenFilter = () => {
    setDraftMaxPrice(appliedMaxPrice);
    setDraftCategories([...appliedCategories]);
    setDraftSubCategories([...appliedSubCategories]);
    setDraftStatusFilters([...appliedStatusFilters]);
    setIsFilterOpen(true);
  };

  const toggleDraftCategory = (cat) => {
    setDraftCategories(prev =>
      prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]
    );
  };

  const toggleDraftSubCategory = (subCat) => {
    setDraftSubCategories(prev =>
      prev.includes(subCat) ? prev.filter(item => item !== subCat) : [...prev, subCat]
    );
  };

  const toggleDraftStatus = (status) => {
    setDraftStatusFilters(prev =>
      prev.includes(status) ? prev.filter(item => item !== status) : [...prev, status]
    );
  };

  // Apply பட்டனை அழுத்திய பிறகுதான் பேஜில் ஃபில்டர் ஆகும் + பேனல் மூடும்
  const handleApplyFilters = () => {
    setAppliedMaxPrice(draftMaxPrice);
    setAppliedCategories([...draftCategories]);
    setAppliedSubCategories([...draftSubCategories]);
    setAppliedStatusFilters([...draftStatusFilters]);
    setIsFilterOpen(false);
  };

  // Reset கொடுத்தவுடன் எல்லாமே பழைய நார்மல் நிலைக்கு மாறி + பேனல் தானாக மூடிவிடும்
  const handleResetAndClose = () => {
    setDraftMaxPrice(25000);
    setDraftCategories([]);
    setDraftSubCategories([]);
    setDraftStatusFilters([]);

    setAppliedMaxPrice(25000);
    setAppliedCategories([]);
    setAppliedSubCategories([]);
    setAppliedStatusFilters([]);
    setSortBy('latest');

    setIsFilterOpen(false);
  };

  let filteredProducts = [...basePageProducts];

  if (subcategory) {
    filteredProducts = filteredProducts.filter(
      p => p.subCategory && p.subCategory.toLowerCase().replace(/\s+/g, '-') === subcategory.toLowerCase().replace(/\s+/g, '-')
    );
  }

  if (appliedCategories.length > 0 && !(category && category !== 'New Arrivals')) {
    filteredProducts = filteredProducts.filter(
      p => p.category && appliedCategories.some(c => c.toLowerCase() === p.category.toLowerCase())
    );
  }

  if (appliedSubCategories.length > 0) {
    filteredProducts = filteredProducts.filter(
      p => p.subCategory && appliedSubCategories.some(sc => sc.toLowerCase() === p.subCategory.toLowerCase())
    );
  }

  if (appliedStatusFilters.length > 0) {
    filteredProducts = filteredProducts.filter(p => {
      const totalStock = getProductTotalStock(p);
      const isOut = totalStock === 0;
      if (appliedStatusFilters.includes('in-stock') && !isOut) return true;
      if (appliedStatusFilters.includes('out-of-stock') && isOut) return true;
      return false;
    });
  }

  filteredProducts = filteredProducts.filter(p => {
    const activePrice = p.isOnSale && p.salePrice ? Number(p.salePrice) : Number(p.price);
    return activePrice >= minPrice && activePrice <= appliedMaxPrice;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => Number(a.salePrice || a.price) - Number(b.salePrice || b.price));
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => Number(b.salePrice || b.price) - Number(a.salePrice || a.price));
  } else if (sortBy === 'latest') {
    filteredProducts.reverse();
  }

  const currentCategoryName = subcategory ? `${subcategory}` : category || (sale ? 'Sale' : 'Collection');
  const descriptionText = categoryDescriptions[category] || "Discover our exclusive collection crafted with premium quality and modern styles.";

  const getGridTemplateColumns = () => {
    if (viewMode === 'sideBySide2') {
      return isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))';
    }
    if (isMobile) return 'repeat(2, minmax(0, 1fr))';
    if (isTablet) return 'repeat(3, minmax(0, 1fr))';
    return 'repeat(4, minmax(0, 1fr))';
  };

  return (
    <div style={{ padding: isMobile ? '20px 14px 45px' : '30px 40px 60px', maxWidth: '1360px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* தலைப்பு மற்றும் விளக்கம் */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '22px' : '35px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#1E1E1E', marginBottom: '12px', textTransform: 'capitalize', letterSpacing: '-0.5px' }}>
          {currentCategoryName}
        </h1>
        <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>
          {descriptionText}
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E2DDD5', margin: isMobile ? '18px 0' : '30px 0' }} />

    {/* Toolbar — Mobile/Tablet/Desktop Responsive */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '12px' : '16px',
          marginBottom: isMobile ? '20px' : '30px',
          paddingBottom: isMobile ? '12px' : '0',
          borderBottom: isMobile ? '1px solid #EFECE6' : 'none'
        }}
      >
        {/* Row 1 on Mobile: Results count + FILTER button */}
        <div
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            alignItems: 'center',
            gap: isMobile ? '10px' : '20px'
          }}
        >
          <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#444' }}>
            {filteredProducts.length > 0
              ? `Showing 1–${filteredProducts.length} of ${filteredProducts.length} results`
              : 'Showing 0 results'}
          </span>

          <button
            type="button"
            onClick={handleOpenFilter}
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              border: 'none',
              padding: isMobile ? '8px 14px' : '10px 18px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '2px',
              flexShrink: 0
            }}
          >
            <span>☰</span> FILTER
          </button>
        </div>

        {/* Row 2 on Mobile: Grid toggle icons + Sort dropdown */}
        <div
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            alignItems: 'center',
            gap: isMobile ? '12px' : '20px'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid4')}
              title="4-Column Grid View"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '17px',
                padding: '4px',
                color: viewMode === 'grid4' ? '#1E1E1E' : '#AAA'
              }}
            >
              ⊞
            </button>
            <button
              type="button"
              onClick={() => setViewMode('sideBySide2')}
              title="2-Column 3:4 Photo + Right Centered Details View"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '17px',
                padding: '4px',
                color: viewMode === 'sideBySide2' ? '#1E1E1E' : '#AAA'
              }}
            >
              ☰
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 10px',
              fontSize: isMobile ? '12px' : '14px',
              color: '#333',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #CCC',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: isMobile ? '170px' : 'none'
            }}
          >
            <option value="latest">Sort by latest</option>
            <option value="price-low">Sort by price: low to high</option>
            <option value="price-high">Sort by price: high to low</option>
          </select>
        </div>
      </div>

      {/* Filter Drawer */}
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isMobile ? '86vw' : '360px',
              maxWidth: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              padding: '24px',
              overflowY: 'auto',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAE5DC', paddingBottom: '14px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0B132B' }}>Filters</h2>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                style={{ background: '#F5F2EC', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontWeight: '700', color: '#1E1E1E' }}
              >
                ✕
              </button>
            </div>

            {/* Price Filter (Draft) */}
            <div>
              <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '800', color: '#0B132B' }}>Price</h3>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#1E1E1E', cursor: 'pointer', marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ border: '1px solid #9CA3AF', padding: '7px 10px', fontSize: '12px', fontWeight: '700', backgroundColor: '#111827', color: '#FFFFFF', borderRadius: '2px' }}>
                  LKR {minPrice.toLocaleString()}
                </div>
                <div style={{ border: '1px solid #9CA3AF', padding: '7px 10px', fontSize: '12px', fontWeight: '700', backgroundColor: '#111827', color: '#FFFFFF', borderRadius: '2px' }}>
                  LKR {draftMaxPrice.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Category & All Dropdown Items (Draft) */}
            {availableFilterCategories.length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '800', color: '#0B132B' }}>Category</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {availableFilterCategories.map((cat) => {
                    const isSinglePageCategory = Boolean(category && category !== 'New Arrivals');
                    const isChecked = isSinglePageCategory ? true : draftCategories.includes(cat);
                    const subItems = getSubOptionsForCategory(cat);

                    return (
                      <div key={cat}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1F2937',
                            cursor: isSinglePageCategory ? 'default' : 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isSinglePageCategory}
                            onChange={() => !isSinglePageCategory && toggleDraftCategory(cat)}
                            style={{ width: '16px', height: '16px', accentColor: '#1E1E1E' }}
                          />
                          <span>{cat}</span>
                        </label>

                        {subItems.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              marginTop: '10px',
                              marginLeft: '24px',
                              paddingLeft: '10px',
                              borderLeft: '1px solid #E5E7EB'
                            }}
                          >
                            {subItems.map((subCat) => (
                              <label
                                key={subCat}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '13px',
                                  color: '#374151',
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={draftSubCategories.includes(subCat)}
                                  onChange={() => toggleDraftSubCategory(subCat)}
                                  style={{ width: '15px', height: '15px', accentColor: '#1E1E1E' }}
                                />
                                <span>{subCat}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status Filter (Draft) */}
            <div>
              <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '800', color: '#0B132B' }}>Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1F2937', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={draftStatusFilters.includes('in-stock')}
                    onChange={() => toggleDraftStatus('in-stock')}
                    style={{ width: '16px', height: '16px', accentColor: '#1E1E1E' }}
                  />
                  <span>In stock</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1F2937', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={draftStatusFilters.includes('out-of-stock')}
                    onChange={() => toggleDraftStatus('out-of-stock')}
                    style={{ width: '16px', height: '16px', accentColor: '#1E1E1E' }}
                  />
                  <span>Out of stock</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #EAE5DC' }}>
              <button
                type="button"
                onClick={handleResetAndClose}
                style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: '700', backgroundColor: '#F5F2EC', color: '#1E1E1E', border: '1px solid #D1CBD3', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: '700', backgroundColor: '#1E1E1E', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAE5DC' }}>
          <p style={{ fontSize: '16px', margin: 0 }}>No products found matching your criteria.</p>
        </div>
      ) : viewMode === 'grid4' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: getGridTemplateColumns(),
            gap: isMobile ? '14px' : '28px'
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        /* 2-Column 3:4 Full Photo + Right-Side Vertically Centered Text */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: getGridTemplateColumns(),
            gap: isMobile ? '18px' : '32px'
          }}
        >
          {filteredProducts.map((product) => {
            const colorsList = product.colors || [];
            const firstColor = colorsList[0] || {};
            const imgSrc = firstColor.image || (product.images && product.images[0]) || product.image || 'https://via.placeholder.com/400';
            const totalStock = getProductTotalStock(product);
            const isOutOfStock = totalStock === 0;
            const basePrice = Number(product.price || 0);
            const activePrice = product.isOnSale && product.salePrice ? Number(product.salePrice) : basePrice;
            const installmentPrice = Math.round(activePrice / 3);

            return (
              <div
                key={product._id || product.id}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center',
                  gap: isMobile ? '12px' : '22px',
                  backgroundColor: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '6px'
                }}
              >
                {/* 3:4 Ratio Full View Photo Box */}
                <Link
                  to={`/product/${product._id || product.id}`}
                  style={{
                    position: 'relative',
                    width: isMobile ? '100%' : '210px',
                    aspectRatio: '3 / 4',
                    backgroundColor: '#F5F2EC',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px'
                  }}
                >
                  {isOutOfStock && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '800',
                        zIndex: 4,
                        borderRadius: '2px'
                      }}
                    >
                      OUT OF STOCK
                    </span>
                  )}
                  <img
                    src={imgSrc}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: `${firstColor.posX ?? 50}% ${firstColor.posY ?? 50}%`,
                      opacity: isOutOfStock ? 0.72 : 1
                    }}
                  />
                </Link>

                {/* Right-Side Vertically Centered Text Details */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Link
                    to={`/product/${product._id || product.id}`}
                    style={{ fontSize: '17px', fontWeight: '600', color: '#1E1E1E', textDecoration: 'none', lineHeight: '1.35' }}
                  >
                    {product.name}
                  </Link>

                  <div style={{ fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#666' }}>
                    {product.subCategory ? `${product.category} • ${product.subCategory}` : product.category}
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1E1E1E' }}>
                    {product.isOnSale && product.salePrice ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '13px', fontWeight: '400' }}>
                          LKR {basePrice.toLocaleString()}
                        </span>
                        <span style={{ color: '#DC2626' }}>LKR {activePrice.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span>LKR {basePrice.toLocaleString()}</span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: '#333', lineHeight: '1.5' }}>
                    3 X LKR {installmentPrice.toLocaleString()} or 4.5% Cashback with{' '}
                    <span style={{ backgroundColor: '#1E1E1E', color: '#FFF', padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '700' }}>
                      mintpay
                    </span>
                  </div>

                  <Link
                    to={`/product/${product._id || product.id}`}
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      padding: '10px 16px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.8px',
                      color: '#1E1E1E',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #1E1E1E',
                      textDecoration: 'none',
                      marginTop: '4px'
                    }}
                  >
                    SELECT OPTIONS
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}