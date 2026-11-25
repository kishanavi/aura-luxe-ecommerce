import React, { useState, useEffect, useRef } from 'react';

export default function Account({ handleLogout, onOpenAuthModal }) {
  const [activeTab, setActiveTab] = useState('details'); // Defaults directly to Account details tab
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const messageTimeoutRef = useRef(null);
  const topRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      window.location.href = '/?auth=open';
      return;
    }
    fetchUserProfile(currentToken);
  }, []);

  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${authToken || token}` },
      });
      const data = await res.json();
      
      console.log("Backend Profile API Response:", data);

      if (res.ok) {
        const u = data.user || data.profile || data;
        setUserData(u);
        setProfileForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          name: u.name || '',
          email: u.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        if (res.status === 400 || res.status === 401) {
          localStorage.removeItem('token');
          if (onOpenAuthModal) onOpenAuthModal();
          window.location.href = '/';
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, text) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ type, text });

    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    let errors = {};

    const currentFirstName = profileForm.firstName || userData?.firstName || '';
    const currentLastName = profileForm.lastName || userData?.lastName || '';
    const currentName = profileForm.name || userData?.name || '';
    const currentEmail = profileForm.email || userData?.email || '';

    if (!currentFirstName.trim()) errors.firstName = 'First name is required.';
    if (!currentLastName.trim()) errors.lastName = 'Last name is required.';
    if (!currentName.trim()) errors.name = 'Display name is required.';
    
    if (!currentEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!currentEmail.includes('@') || !currentEmail.includes('.')) {
      errors.email = 'Please enter a valid email address.';
    }

    if (profileForm.newPassword && profileForm.newPassword.trim() !== '') {
      if (profileForm.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters long.';
      }
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        errors.confirmPassword = 'New passwords do not match.';
      }
      if (!profileForm.currentPassword) {
        errors.currentPassword = 'Current password is required.';
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      firstName: currentFirstName,
      lastName: currentLastName,
      name: currentName,
      email: currentEmail,
      currentPassword: profileForm.currentPassword,
      newPassword: profileForm.newPassword,
      confirmPassword: profileForm.confirmPassword,
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', 'Account details saved successfully!');
        setProfileForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setFormErrors({});
        fetchUserProfile();

        if (topRef.current) {
          topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        showNotification('error', data.message || 'Update failed!');
        if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      showNotification('error', 'Server error while updating profile.');
      if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', 'Address added successfully!');
        setShowAddressForm(false);
        setAddressForm({ label: 'Home', firstName: '', lastName: '', street: '', city: '', postalCode: '', phone: '', isDefault: false });
        fetchUserProfile();
        if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        showNotification('error', data.message || 'Failed to add address.');
      }
    } catch (err) {
      showNotification('error', 'Server error while adding address.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/address/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showNotification('success', 'Address removed!');
        fetchUserProfile();
        if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  if (loading) {
    return <div style={{ padding: '100px 40px', textAlign: 'center' }}>Loading account...</div>;
  }

  // Exact WooCommerce menu items matching reference screenshot (No downloads, no wishlist)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'details', label: 'Account details', icon: '👤' },
  ];

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #D1D1D1',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: '#1E1E1E',
  };

  const displayName = userData?.name || profileForm.name || 'User';

  return (
    <div 
      ref={topRef} 
      style={{ 
        width: '100%', 
        maxWidth: '100%', 
        margin: '0', 
        padding: isMobile ? '70px 16px 40px' : '40px 50px', // Balanced padding so right side stretches across fully
        fontFamily: 'sans-serif', 
        color: '#1E1E1E', 
        boxSizing: 'border-box', 
        backgroundColor: '#FFFFFF'
      }}
    >
      
      {/* Page Heading matching screenshot */}
      <h1 style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: '700', marginBottom: '36px', color: '#111' }}>
        My account
      </h1>

      {message.text && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
            color: message.type === 'success' ? '#2E7D32' : '#C62828',
            border: `1px solid ${message.type === 'success' ? '#A5D6A7' : '#EF9A9A'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Main Layout Container matching WooCommerce reference */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '50px', alignItems: 'flex-start', width: '100%', boxSizing: 'border-box' }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{ width: isMobile ? '100%' : '260px', flexShrink: '0', borderRight: isMobile ? 'none' : '1px solid #EAE5DC', paddingRight: isMobile ? '0' : '30px', boxSizing: 'border-box' }}>
          
          {/* User Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '18px', borderBottom: '1px solid #EAE5DC', marginBottom: '16px' }}>
            <div
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                backgroundColor: '#E0E0E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Hello,</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>{displayName}</div>
            </div>
          </div>

          {/* Navigation Menu with WooCommerce Active Border Indicator */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: '0' }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMessage({ type: '', text: '' });
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '14px 12px',
                    background: isActive ? '#FAFAFA' : 'transparent',
                    color: isActive ? '#111' : '#555',
                    border: 'none',
                    borderBottom: '1px solid #EAE5DC',
                    borderRight: isActive && !isMobile ? '3px solid #111' : 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: isMobile ? 'auto' : '100%',
                    flex: isMobile ? '1 1 45%' : 'unset',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                textAlign: 'left',
                padding: '14px 12px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #EAE5DC',
                fontSize: '14px',
                fontWeight: '400',
                color: '#C62828',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: isMobile ? 'auto' : '100%',
                flex: isMobile ? '1 1 45%' : 'unset',
              }}
            >
              <span style={{ fontSize: '15px' }}>🚪</span>
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT AREA - Full 100% Fluid Width across All Tabs without boxed cards */}
        <div style={{ flex: 1, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          
          {activeTab === 'dashboard' && (
            <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', background: '#FFFFFF', padding: '0', width: '100%', boxSizing: 'border-box' }}>
              <p style={{ marginTop: 0 }}>
                Hello <strong>{displayName}</strong> (not <strong>{displayName}</strong>?{' '}
                <span onClick={handleLogout} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600', color: '#C86D51' }}>
                  Log out
                </span>
                )
              </p>
              <p style={{ marginBottom: 0 }}>
                From your account dashboard you can view your{' '}
                <span onClick={() => setActiveTab('orders')} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}>
                  recent orders
                </span>
                , manage your{' '}
                <span onClick={() => setActiveTab('addresses')} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}>
                  shipping and billing addresses
                </span>
                , and edit your{' '}
                <span onClick={() => setActiveTab('details')} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}>
                  password and account details
                </span>
                .
              </p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <p style={{ margin: '0 0 20px 0', color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
                No order has been made yet. Once you purchase items from our collection, your order history will appear here.
              </p>
              <button
                onClick={() => { window.location.href = '/'; }}
                style={{ backgroundColor: '#1E1E1E', color: '#FFF', border: 'none', padding: '12px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', borderRadius: '4px' }}
              >
                BROWSE PRODUCTS
              </button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '16px', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
                <p style={{ margin: 0, fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
                  The following addresses will be available to choose from on the checkout page.
                </p>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{
                    backgroundColor: '#1E1E1E',
                    color: '#FFF',
                    border: 'none',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'center',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {showAddressForm ? 'Cancel' : '+ Add New Address'}
                </button>
              </div>

              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  style={{ border: '1px solid #D1D1D1', padding: isMobile ? '20px' : '30px', marginBottom: '24px', backgroundColor: '#FFFFFF', borderRadius: '6px', boxSizing: 'border-box', width: '100%' }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px', fontWeight: '700', color: '#111' }}>Add Shipping / Billing Address</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px', width: '100%' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>Address Label *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>First Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>Last Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>Street Address *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px', width: '100%' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '600' }}>Postal Code</label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', marginBottom: '24px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Set as default checkout address
                  </label>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#1E1E1E', color: '#FFF', border: 'none', padding: '14px 28px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', borderRadius: '4px', width: isMobile ? '100%' : 'auto' }}
                  >
                    SAVE ADDRESS
                  </button>
                </form>
              )}

              {userData?.addresses?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
                  {userData.addresses.map((addr) => (
                    <div key={addr._id} style={{ border: '1px solid #D1D1D1', padding: '24px', position: 'relative', borderRadius: '6px', backgroundColor: '#FFF', boxSizing: 'border-box', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <strong style={{ fontSize: '16px' }}>{addr.label}</strong>
                        {addr.isDefault && (
                          <span style={{ backgroundColor: '#1E1E1E', color: '#FFF', fontSize: '10px', padding: '4px 10px', borderRadius: '3px', fontWeight: '700' }}>
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#444' }}>
                        <div>{addr.firstName} {addr.lastName}</div>
                        <div>{addr.street}</div>
                        <div>{addr.city} {addr.postalCode}</div>
                        <div>Phone: {addr.phone}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        style={{ marginTop: '16px', background: 'none', border: 'none', color: '#C62828', fontSize: '12px', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: '600' }}
                      >
                        Remove address
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '15px', color: '#666', width: '100%', boxSizing: 'border-box' }}>
                  You have not set up any addresses yet. Click "+ Add New Address" above to add one.
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <form onSubmit={handleProfileUpdate} noValidate style={{ width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>First name *</label>
                    <input
                      type="text"
                      value={profileForm.firstName !== '' ? profileForm.firstName : (userData?.firstName || '')}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      style={inputStyle}
                    />
                    {formErrors.firstName && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.firstName}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Last name *</label>
                    <input
                      type="text"
                      value={profileForm.lastName !== '' ? profileForm.lastName : (userData?.lastName || '')}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      style={inputStyle}
                    />
                    {formErrors.lastName && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.lastName}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Display name *</label>
                  <input
                    type="text"
                    value={profileForm.name !== '' ? profileForm.name : (userData?.name || '')}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={inputStyle}
                  />
                  {formErrors.name && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                  <small style={{ display: 'block', marginTop: '6px', color: '#666', fontStyle: 'italic' }}>
                    This will be how your name will be displayed in the account section and in reviews
                  </small>
                </div>

                <div style={{ marginBottom: '36px', width: '100%', boxSizing: 'border-box' }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Email address *</label>
                  <input
                    type="text"
                    value={profileForm.email !== '' ? profileForm.email : (userData?.email || '')}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={inputStyle}
                  />
                  {formErrors.email && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.email}</span>}
                  <small style={{ display: 'block', marginTop: '6px', color: '#666', fontStyle: 'italic' }}>
                    This email address will be used to log in to your account.
                  </small>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', borderTop: '1px solid #EAE5DC', paddingTop: '24px' }}>Password change</h3>

                <div style={{ marginBottom: '20px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Current password (leave blank to leave unchanged)"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '45px' }}
                  />
                  <span onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', color: '#666' }}>
                    {showCurrentPassword ? '👁️‍🗨️' : '👁️'}
                  </span>
                  {formErrors.currentPassword && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.currentPassword}</span>}
                </div>

                <div style={{ marginBottom: '20px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New password (leave blank to leave unchanged)"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '45px' }}
                  />
                  <span onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', color: '#666' }}>
                    {showNewPassword ? '👁️‍🗨️' : '👁️'}
                  </span>
                  {formErrors.newPassword && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.newPassword}</span>}
                </div>

                <div style={{ marginBottom: '30px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '45px' }}
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', color: '#666' }}>
                    {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                  </span>
                  {formErrors.confirmPassword && <span style={{ color: '#C62828', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.confirmPassword}</span>}
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px 32px',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  SAVE CHANGES
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}