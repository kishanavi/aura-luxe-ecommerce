// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Account from './components/Account';
import Home from './components/Home';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// 🔒 Protected Route Component for Admin Dashboard Security
const ProtectedAdminRoute = ({ element }) => {
  const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
  return isAdminAuthenticated ? element : <Navigate to="/admin/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 🗄️ Database Products State
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 🔄 Fetch Products from MongoDB Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/get');
        setAllProducts(res.data);
      } catch (err) {
        console.error('Error fetching products from database:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  // Page load aagum pothu URL-la ?auth=open irukka-nu paarthu login modal-ah open panrathu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'open') {
      setIsAuthModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ========================================================
1. ADMIN ROUTES (Strictly NO Navbar & NO Footer)
           ======================================================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* 🔒 Protected Admin Dashboard Route */}
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedAdminRoute element={<AdminDashboard />} />} 
        /> 


        {/* ========================================================
2. CUSTOMER / PUBLIC ROUTES (With Navbar & Footer)
           ======================================================== */}
        <Route
          path="/*"
          element={
            <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#FAF8F5', margin: 0, padding: 0, overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Customer Navbar */}
              <Navbar 
                isAuthenticated={isAuthenticated} 
                onOpenAuthModal={() => setIsAuthModalOpen(true)} 
                handleLogout={handleLogout} 
                onOpenProfile={() => { window.location.href = '/account'; }}
              />

              {/* Main Content Area */}
              <div style={{ flex: 1 }}>
                <Routes>
                  {/* Home Page Route */}
                  <Route 
                    path="/" 
                    element={
                      <div style={{ marginTop: '114px', width: '100%' }}>
                        <Home products={allProducts} />
                      </div>
                    } 
                  />

                  {/* New Arrivals */}
                  <Route path="/new-arrivals" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="New Arrivals" products={allProducts} /></div>} />

                  {/* Men Main & Subcategories */}
                  <Route path="/men" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Men" products={allProducts} /></div>} />
                  <Route path="/men/:subcategory" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Men" products={allProducts} /></div>} />

                  {/* Women Main & Subcategories */}
                  <Route path="/women" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Women" products={allProducts} /></div>} />
                  <Route path="/women/:subcategory" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Women" products={allProducts} /></div>} />

                  {/* Casual Wear */}
                  <Route path="/casual-wear" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Casual Wear" products={allProducts} /></div>} />

                  {/* Accessories & Subcategories */}
                  <Route path="/accessories" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Accessories" products={allProducts} /></div>} />
                  <Route path="/accessories/:subcategory" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Accessories" products={allProducts} /></div>} />

                  {/* Slippers & Subcategories */}
                  <Route path="/slippers" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Slippers" products={allProducts} /></div>} />
                  <Route path="/slippers/:subcategory" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList category="Slippers" products={allProducts} /></div>} />

                  {/* Other Links */}
                  <Route path="/vouchers" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><h2>Vouchers Page</h2></div>} />
                  <Route path="/sale" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><ProductList sale={true} products={allProducts} /></div>} />
                  <Route path="/wishlist" element={<div style={{ padding: '24px 40px', marginTop: '110px' }}><h2>My Wishlist</h2></div>} />

                  {/* Shirts & Crop Tops */}
                  <Route path="/category/shirts" element={<div style={{ marginTop: '114px' }}><ProductList category="Shirts" products={allProducts} /></div>} />
                  <Route path="/category/crop-tops" element={<div style={{ marginTop: '114px' }}><ProductList category="Crop Tops" products={allProducts} /></div>} />
                  
                  {/* Product Detail Route (Fixed to use allProducts) */}
                  <Route path="/product/:id" element={<div style={{ marginTop: '114px' }}><ProductDetail products={allProducts} /></div>} />

                  {/* Account Page Route */}
                  <Route 
                    path="/account" 
                    element={
                      <div style={{ width: '100%', marginTop: '110px' }}>
                        <Account handleLogout={handleLogout} />
                      </div>
                    } 
                  />
                </Routes>
              </div>

              {/* Customer Footer */}
              <Footer />

              {/* Popup Modal for Login / Signup */}
              {isAuthModalOpen && !isAuthenticated && (
                <Login 
                  onLoginSuccess={handleLoginSuccess} 
                  onClose={() => setIsAuthModalOpen(false)} 
                />
              )}

            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;