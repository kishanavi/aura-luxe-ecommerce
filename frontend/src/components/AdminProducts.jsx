// components/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminProducts({
  activeTab = 'add-product',
  editingProductData = null,
  onClearEditing = () => {},
  onEditProduct = () => {}
}) {
  const categories = ['MEN', 'WOMEN', 'CASUAL WEAR', 'ACCESSORIES', 'SLIPPERS'];

  const dropdownData = {
    'MEN': ['Denims', 'Gym Wear', 'Hoodies', 'Shirts', 'Shorts', 'T-Shirts', 'Trousers'],
    'WOMEN': ['Crop Tops', 'Denims', 'Dress', 'Frocks', 'Skirts', 'Blouse', 'Body Suit'],
    'SLIPPERS': ['Men Slippers', 'Women Slippers'],
    'ACCESSORIES': ['Belts', 'Caps', 'Perfumes', 'Hats', 'Wallets']
  };

  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [catalogSubTab, setCatalogSubTab] = useState('catalog'); // 'catalog' | 'out-of-stock'

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/get');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('MEN');
  const [subCategory, setSubCategory] = useState('Denims');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isOnSale, setIsOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);

  const [sizeGuideImage, setSizeGuideImage] = useState('');

  const [colorVariants, setColorVariants] = useState([
    { colorName: 'Black', image: '', posX: 50, posY: 0, sizes: { S: '', M: '', L: '', XL: '' } }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const resetFormFields = () => {
    setEditingId(null);
    setName('');
    setCategory('MEN');
    setSubCategory('Denims');
    setDescription('');
    setPrice('');
    setIsOnSale(false);
    setSalePrice('');
    setIsNewArrival(false);
    setSizeGuideImage('');
    setColorVariants([{ colorName: 'Black', image: '', posX: 50, posY: 0, sizes: { S: '', M: '', L: '', XL: '' } }]);
    setFormErrors({});
  };

  useEffect(() => {
    if (editingProductData) {
      setEditingId(editingProductData._id);
      setName(editingProductData.name || '');
      setCategory(editingProductData.category || 'MEN');
      if (dropdownData[editingProductData.category]) {
        setSubCategory(editingProductData.subCategory || dropdownData[editingProductData.category][0]);
      } else {
        setSubCategory('');
      }
      setDescription(editingProductData.description || '');
      setPrice(editingProductData.price ?? '');
      setIsOnSale(editingProductData.isOnSale || false);
      setSalePrice(editingProductData.salePrice || '');
      setIsNewArrival(editingProductData.isNewArrival || false);
      setSizeGuideImage(editingProductData.sizeGuideImage || '');
      setColorVariants(
        editingProductData.colors && editingProductData.colors.length > 0
          ? editingProductData.colors
          : [{ colorName: 'Black', image: '', posX: 50, posY: 0, sizes: { S: '', M: '', L: '', XL: '' } }]
      );
      setFormErrors({});
    } else if (!editingProductData && editingId) {
      resetFormFields();
    }
  }, [editingProductData]);

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    if (dropdownData[selectedCat]) {
      setSubCategory(dropdownData[selectedCat][0]);
    } else {
      setSubCategory('');
    }
  };

  const handleSizeGuideChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSizeGuideImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColorVariant = () => {
    setColorVariants([...colorVariants, { colorName: '', image: '', posX: 50, posY: 0, sizes: { S: '', M: '', L: '', XL: '' } }]);
  };

  const handleRemoveColorVariant = (index) => {
    if (colorVariants.length === 1) return;
    setColorVariants(colorVariants.filter((_, idx) => idx !== index));
  };

  const handleColorNameChange = (index, value) => {
    const updated = [...colorVariants];
    updated[index].colorName = value;
    setColorVariants(updated);
  };

  const handleColorSizeChange = (colorIndex, sizeKey, value) => {
    const updated = [...colorVariants];
    updated[colorIndex].sizes[sizeKey] = value;
    setColorVariants(updated);
  };

  const handleColorFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...colorVariants];
        updated[index].image = reader.result;
        updated[index].posX = 50;
        updated[index].posY = 0;
        setColorVariants(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePositionMove = (index, axis, value) => {
    const updated = [...colorVariants];
    if (axis === 'X') updated[index].posX = Number(value);
    if (axis === 'Y') updated[index].posY = Number(value);
    setColorVariants(updated);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!name.trim()) errors.name = 'Product name is required.';
    if (!price) errors.price = 'Regular price is required.';
    if (isOnSale && !salePrice) errors.salePrice = 'Sale price is required when item is on sale.';
    if (!description.trim()) errors.description = 'Description is required.';
    if (!sizeGuideImage) errors.sizeGuideImage = 'Size guide image is required.';

    colorVariants.forEach((cv, idx) => {
      if (!cv.colorName.trim()) {
        errors[`colorName_${idx}`] = 'Color name is required.';
      }
      if (!cv.image) {
        errors[`colorImage_${idx}`] = 'Color photo is required.';
      }
      
      const isAnySizeEmpty = cv.sizes.S === '' || cv.sizes.M === '' || cv.sizes.L === '' || cv.sizes.XL === '';
      if (isAnySizeEmpty) {
        errors[`colorStock_${idx}`] = 'Please fill all size quantities (enter 0 if out of stock).';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFormErrors({});

    const formattedColors = colorVariants.map(cv => ({
      colorName: cv.colorName,
      image: cv.image,
      posX: cv.posX ?? 50,
      posY: cv.posY ?? 0,
      sizes: {
        S: Number(cv.sizes.S) || 0,
        M: Number(cv.sizes.M) || 0,
        L: Number(cv.sizes.L) || 0,
        XL: Number(cv.sizes.XL) || 0,
      }
    }));

    const productData = {
      name,
      category,
      subCategory: dropdownData[category] ? subCategory : 'General',
      description,
      price: Number(price),
      isOnSale,
      salePrice: isOnSale ? Number(salePrice) : 0,
      isNewArrival,
      sizeGuideImage,
      colors: formattedColors
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/update/${editingId}`, productData);
        setSuccessMessage('Product updated successfully in Database!');
        onClearEditing();
      } else {
        await axios.post('http://localhost:5000/api/products/add', productData);
        setSuccessMessage('Product added successfully to Database!');
      }

      resetFormFields();
      fetchProducts();

      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);

    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Check backend connection.');
    }
  };

  const handleEdit = (e, p) => {
    e.stopPropagation();
    onEditProduct(p);
  };

  const confirmDelete = (e, p) => {
    e.stopPropagation();
    setProductToDelete(p);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${productToDelete._id}`);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  const toggleExpandProduct = (id) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const getTotalStock = (colorsArray) => {
    if (!colorsArray) return 0;
    return colorsArray.reduce((total, colorObj) => {
      const colorStock = Object.values(colorObj.sizes || {}).reduce((a, b) => a + Number(b || 0), 0);
      return total + colorStock;
    }, 0);
  };

  const checkIfStillNew = (createdAtString) => {
    if (!createdAtString) return false;
    const createdDate = new Date(createdAtString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  };

  // ஸ்டாக் உள்ளவை மட்டும் Products Catalog-ல் இருக்கும்; ஸ்டாக் 0 ஆனவை Out of Stock-ல் மட்டும் இருக்கும்
  const availableCatalogProducts = products.filter((p) => getTotalStock(p.colors) > 0);
  const outOfStockProducts = products.filter((p) => getTotalStock(p.colors) === 0);
  const displayedProducts = catalogSubTab === 'out-of-stock' ? outOfStockProducts : availableCatalogProducts;

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const sizeInputStyle = {
    width: '60px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
    outline: 'none'
  };

  const fileInputStyle = {
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer'
  };

  const errorTextStyle = {
    color: '#DC2626',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: '600'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ================= ADD / EDIT PRODUCT FORM VIEW ================= */}
      {activeTab === 'add-product' && (
        <>
          {/* SUCCESS BANNER ABOVE THE FORM */}
          {successMessage && (
            <div style={{ backgroundColor: '#D1FAE5', border: '1px solid #10B981', color: '#065F46', padding: '14px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <span>✅</span> {successMessage}
            </div>
          )}

          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)', marginBottom: '36px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: '#111827', borderBottom: '2px solid #F3F4F6', paddingBottom: '12px' }}>
              {editingId ? 'Edit Product Details' : 'Add New Clothing Product'}
            </h3>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* SECTION 1: Basic Information */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  1. Basic Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Product Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Classic Silk Shirt"
                      style={{ ...inputStyle, borderColor: formErrors.name ? '#DC2626' : '#D1D5DB' }}
                    />
                    {formErrors.name && <div style={errorTextStyle}>{formErrors.name}</div>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Category (Website Menu) *</label>
                    <select value={category} onChange={handleCategoryChange} style={inputStyle}>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Sub-Category (Dropdown)</label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      disabled={!dropdownData[category]}
                      style={{
                        ...inputStyle,
                        backgroundColor: !dropdownData[category] ? '#F3F4F6' : '#FFFFFF',
                        color: !dropdownData[category] ? '#9CA3AF' : '#000000',
                      }}
                    >
                      {dropdownData[category] ? (
                        dropdownData[category].map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))
                      ) : (
                        <option value="">No Sub-Category</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Description (Fabric, Fit, Care) *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Premium quality fabric, regular fit, machine wash cold."
                    rows="2"
                    style={{ ...inputStyle, borderColor: formErrors.description ? '#DC2626' : '#D1D5DB' }}
                  />
                  {formErrors.description && <div style={errorTextStyle}>{formErrors.description}</div>}
                </div>
              </div>

              {/* SECTION 2: Pricing & Status Tags */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  2. Pricing & Status Tags
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Regular Price (LKR) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="4500"
                      style={{ ...inputStyle, borderColor: formErrors.price ? '#DC2626' : '#D1D5DB' }}
                    />
                    {formErrors.price && <div style={errorTextStyle}>{formErrors.price}</div>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#111827' }}
                      />
                      New Arrival (Automatically expires after 2 months)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                      <input
                        type="checkbox"
                        checked={isOnSale}
                        onChange={(e) => setIsOnSale(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#111827' }}
                      />
                      On Sale (Display in Sale section with discount)
                    </label>

                    {isOnSale && (
                      <div style={{ marginTop: '6px', paddingLeft: '28px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#DC2626' }}>
                          Discounted Sale Price (LKR) *
                        </label>
                        <input
                          type="number"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          placeholder="e.g. 3800"
                          style={{ ...inputStyle, maxWidth: '250px', border: '1px solid #DC2626' }}
                        />
                        {formErrors.salePrice && <div style={errorTextStyle}>{formErrors.salePrice}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Size Guide Image Upload */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  3. Size Guide Image *
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSizeGuideChange}
                    style={fileInputStyle}
                  />
                  {sizeGuideImage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F3F4F6', padding: '6px 12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}>
                      <img
                        src={sizeGuideImage}
                        alt="Size Guide preview"
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#FFF' }}
                      />
                      <button
                        type="button"
                        onClick={() => setSizeGuideImage('')}
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                {formErrors.sizeGuideImage && <div style={errorTextStyle}>{formErrors.sizeGuideImage}</div>}
              </div>

              {/* SECTION 4 & 5: Color Variants & Fixed 3:4 Frame Position Adjuster */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>
                    4 & 5. Color-wise Photos, Fixed Frame Adjuster & Size Stock Management *
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddColorVariant}
                    style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}
                  >
                    + Add Another Color
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {colorVariants.map((colorVar, cIndex) => (
                    <div key={cIndex} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '380px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>Color Name *:</span>
                          <input
                            type="text"
                            value={colorVar.colorName}
                            onChange={(e) => handleColorNameChange(cIndex, e.target.value)}
                            placeholder="e.g. Maroon / Red"
                            style={{ ...inputStyle, padding: '8px 12px', borderColor: formErrors[`colorName_${cIndex}`] ? '#DC2626' : '#D1D5DB' }}
                          />
                        </div>
                        {colorVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColorVariant(cIndex)}
                            style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Remove Color
                          </button>
                        )}
                      </div>
                      {formErrors[`colorName_${cIndex}`] && <div style={errorTextStyle}>{formErrors[`colorName_${cIndex}`]}</div>}

                      {/* FIXED FRAME POSITION ADJUSTER */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '16px', marginTop: '12px', flexWrap: 'wrap', backgroundColor: '#FFF', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>Photo for this Color *:</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleColorFileChange(cIndex, e)}
                            style={fileInputStyle}
                          />

                          {colorVar.image && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', backgroundColor: '#F9FAFB', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#374151' }}>📱 Adjust Frame Position:</span>
                              
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>
                                  <span>Left</span>
                                  <span>Horizontal ({colorVar.posX || 50}%)</span>
                                  <span>Right</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={colorVar.posX ?? 50}
                                  onChange={(e) => handlePositionMove(cIndex, 'X', e.target.value)}
                                  style={{ width: '100%', accentColor: '#111827' }}
                                />
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>
                                  <span>Top</span>
                                  <span>Vertical ({colorVar.posY || 0}%)</span>
                                  <span>Bottom</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={colorVar.posY ?? 0}
                                  onChange={(e) => handlePositionMove(cIndex, 'Y', e.target.value)}
                                  style={{ width: '100%', accentColor: '#111827' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* LOCKED 3:4 FIXED FRAME PREVIEW */}
                        <div>
                          <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#374151' }}>
                            Locked 3:4 Frame Preview:
                          </span>
                          <div style={{ 
                            width: '120px', 
                            height: '160px', 
                            backgroundColor: '#FAF8F5', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            border: '2px solid #111827', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                          }}>
                            {colorVar.image ? (
                              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                                <img
                                  src={colorVar.image}
                                  alt="Locked Frame preview"
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                    objectPosition: `${colorVar.posX ?? 50}% ${colorVar.posY ?? 0}%`
                                  }}
                                />
                              </div>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', padding: '10px' }}>No Image</span>
                            )}
                          </div>
                          <span style={{ display: 'block', fontSize: '10px', color: '#059669', marginTop: '4px', fontWeight: '700', textAlign: 'center' }}>
                            ✓ 3:4 Fixed Ratio
                          </span>
                        </div>

                      </div>
                      {formErrors[`colorImage_${cIndex}`] && <div style={errorTextStyle}>{formErrors[`colorImage_${cIndex}`]}</div>}

                      {/* SIZE STOCK QUANTITY WITH AUTOMATIC OUT OF STOCK TAG */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#4B5563' }}>
                          Stock quantities for each size in <span style={{ color: '#2563EB' }}>{colorVar.colorName || 'this color'}</span> (0 is allowed) *:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                          {['S', 'M', 'L', 'XL'].map((size) => {
                            const rawVal = colorVar.sizes[size];
                            const isSizeZero = rawVal !== '' && Number(rawVal) === 0;
                            const isSizeLow = rawVal !== '' && Number(rawVal) > 0 && Number(rawVal) <= 5;

                            return (
                              <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: isSizeZero ? '1px solid #FCA5A5' : '1px solid #D1D5DB' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#374151' }}>{size}:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={rawVal}
                                    onChange={(e) => handleColorSizeChange(cIndex, size, e.target.value)}
                                    placeholder="0"
                                    style={sizeInputStyle}
                                  />
                                </div>
                                {isSizeZero && (
                                  <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', textAlign: 'center', marginTop: '2px' }}>
                                    Out of Stock
                                  </span>
                                )}
                                {isSizeLow && (
                                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', textAlign: 'center', marginTop: '2px' }}>
                                    Low Stock ({rawVal})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {formErrors[`colorStock_${cIndex}`] && <div style={errorTextStyle}>{formErrors[`colorStock_${cIndex}`]}</div>}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{ backgroundColor: '#111827', color: '#FFF', padding: '14px 28px', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                >
                  {editingId ? 'Update Product & Inventory' : 'Add Product to Database'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetFormFields();
                      onClearEditing();
                    }}
                    style={{ backgroundColor: '#E5E7EB', color: '#374151', padding: '14px 20px', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}

      {/* ================= DATABASE PRODUCTS CATALOG VIEW ================= */}
      {activeTab === 'products' && (
        <div>
          {/* TOP SWITCHER TABS: Products Catalog (Available) | Out of Stock */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setCatalogSubTab('catalog');
                setExpandedProductId(null);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: catalogSubTab === 'catalog' ? '2px solid #111827' : '1px solid #D1D5DB',
                backgroundColor: catalogSubTab === 'catalog' ? '#111827' : '#FFFFFF',
                color: catalogSubTab === 'catalog' ? '#FFFFFF' : '#374151',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: catalogSubTab === 'catalog' ? '0 2px 6px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              <span>Products Catalog</span>
              <span
                style={{
                  backgroundColor: catalogSubTab === 'catalog' ? '#374151' : '#F3F4F6',
                  color: catalogSubTab === 'catalog' ? '#FFFFFF' : '#111827',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}
              >
                {availableCatalogProducts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCatalogSubTab('out-of-stock');
                setExpandedProductId(null);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: catalogSubTab === 'out-of-stock' ? '2px solid #DC2626' : '1px solid #D1D5DB',
                backgroundColor: catalogSubTab === 'out-of-stock' ? '#DC2626' : '#FFFFFF',
                color: catalogSubTab === 'out-of-stock' ? '#FFFFFF' : '#991B1B',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: catalogSubTab === 'out-of-stock' ? '0 2px 6px rgba(220,38,38,0.2)' : 'none'
              }}
            >
              <span>Out of Stock</span>
              <span
                style={{
                  backgroundColor: catalogSubTab === 'out-of-stock' ? '#991B1B' : '#FEE2E2',
                  color: catalogSubTab === 'out-of-stock' ? '#FFFFFF' : '#991B1B',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}
              >
                {outOfStockProducts.length}
              </span>
            </button>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                {catalogSubTab === 'out-of-stock'
                  ? `Out of Stock Products (${displayedProducts.length})`
                  : `Products Catalog (${displayedProducts.length})`}
              </h3>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>Click any product row to view color-wise stock, edit or delete</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {displayedProducts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                  {catalogSubTab === 'out-of-stock'
                    ? 'No out-of-stock products found.'
                    : 'No available products found in Catalog.'}
                </div>
              ) : (
                displayedProducts.map((p) => {
                  const totalStock = getTotalStock(p.colors);
                  const isOutOfStock = totalStock === 0;
                  const isActuallyNew = p.isNewArrival && checkIfStillNew(p.createdAt);
                  const isExpanded = expandedProductId === p._id;
                  const firstColor = p.colors && p.colors.length > 0 ? p.colors[0] : null;
                  const firstImage = firstColor ? firstColor.image : 'https://via.placeholder.com/150';

                  return (
                    <div key={p._id} style={{ borderBottom: '1px solid #E5E7EB', transition: 'background-color 0.2s' }}>
                      
                      <div
                        onClick={() => toggleExpandProduct(p._id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '18px 24px',
                          gap: '20px',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? '#F8FAFC' : '#FFFFFF',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 2, minWidth: '220px' }}>
                          <div style={{ width: '45px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E7EB', backgroundColor: '#FAF8F5', flexShrink: 0 }}>
                            <img
                              src={firstImage}
                              alt={p.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                objectPosition: `${firstColor?.posX ?? 50}% ${firstColor?.posY ?? 0}%`
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{p.name}</span>
                              {isActuallyNew && (
                                <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>NEW</span>
                              )}
                              {p.isOnSale && (
                                <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>SALE</span>
                              )}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              {p.category} {p.subCategory && p.subCategory !== 'General' ? `> ${p.subCategory}` : ''} | Colors: {p.colors ? p.colors.length : 0}
                            </div>
                          </div>
                        </div>

                        <div style={{ flex: 1, textAlign: 'right', minWidth: '100px' }}>
                          {p.isOnSale ? (
                            <div>
                              <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '12px', marginRight: '8px' }}>
                                LKR {p.price}
                              </span>
                              <span style={{ fontWeight: '800', color: '#DC2626', fontSize: '15px' }}>LKR {p.salePrice}</span>
                            </div>
                          ) : (
                            <div style={{ fontWeight: '800', color: '#111827', fontSize: '15px' }}>LKR {p.price}</div>
                          )}
                        </div>

                        <div style={{ flex: 1, textAlign: 'center', minWidth: '120px' }}>
                          {isOutOfStock ? (
                            <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                              Out of Stock
                            </span>
                          ) : totalStock <= 5 ? (
                            <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                              Low Stock ({totalStock})
                            </span>
                          ) : (
                            <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                              In Stock ({totalStock})
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#4B5563' }}>
                          {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
                        </div>
                      </div>

                      {/* EXPANDED DETAILS PANEL */}
                      {isExpanded && (
                        <div style={{ padding: '20px 24px 24px 24px', backgroundColor: '#F9FAFB', borderTop: '1px dashed #E5E7EB' }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ flex: 1, minWidth: '280px' }}>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '12px', textTransform: 'uppercase' }}>
                                Color-wise & Size-wise Stock Breakdown
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                {p.colors && p.colors.map((col, idx) => (
                                  <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '45px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #D1D5DB', backgroundColor: '#FAF8F5', flexShrink: 0 }}>
                                      <img
                                        src={col.image}
                                        alt={col.colorName}
                                        style={{ 
                                          width: '100%', 
                                          height: '100%', 
                                          objectFit: 'cover', 
                                          objectPosition: `${col.posX ?? 50}% ${col.posY ?? 0}%`
                                        }}
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                                        🎨 {col.colorName}
                                      </div>
                                      <div style={{ fontSize: '11px', color: '#4B5563', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                        {['S', 'M', 'L', 'XL'].map((s) => (
                                          <div key={s}>
                                            {s}: <strong>{col.sizes?.[s] ?? 0}</strong>
                                            {Number(col.sizes?.[s] ?? 0) === 0 && (
                                              <span style={{ color: '#DC2626', fontWeight: '800', fontSize: '9px', marginLeft: '4px' }}>(Out)</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {p.sizeGuideImage && (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>
                                  Size Guide Chart
                                </div>
                                <img
                                  src={p.sizeGuideImage}
                                  alt="Size Guide"
                                  style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFF' }}
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '16px' }}>
                            <strong>Description:</strong> {p.description || 'No description provided.'}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                            <button
                              onClick={(e) => handleEdit(e, p)}
                              style={{ backgroundColor: '#111827', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                            >
                              Edit Product
                            </button>
                            <button
                              onClick={(e) => confirmDelete(e, p)}
                              style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                            >
                              Delete Product
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '28px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#111827' }}>Confirm Delete</h3>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong> from Database?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleDelete}
                style={{ flex: 1, backgroundColor: '#DC2626', color: '#FFF', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, backgroundColor: '#E5E7EB', color: '#374151', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}