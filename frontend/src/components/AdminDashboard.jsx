import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('add-product'); // 'add-product' | 'products'
  const [editingProductData, setEditingProductData] = useState(null);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const handleSelectAddNew = () => {
    setEditingProductData(null);
    setActiveTab('add-product');
    setIsMobileMenuOpen(false);
  };

  const handleSelectProducts = () => {
    setActiveTab('products');
    setIsMobileMenuOpen(false);
  };

  const handleEditFromCatalog = (product) => {
    setEditingProductData(product);
    setActiveTab('add-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-layout">
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #F4F6F8;
          font-family: sans-serif;
          position: relative;
        }

        .admin-sidebar {
          width: 260px;
          background-color: #1E1E1E;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 40;
          transition: transform 0.25s ease;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .admin-header {
          background-color: #FFFFFF;
          padding: 16px 24px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 20;
          gap: 12px;
        }

        .admin-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-menu-btn {
          display: none;
          background-color: #1E1E1E;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          width: 38px;
          height: 38px;
          font-size: 18px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-backdrop {
          display: none;
        }

        .admin-content {
          padding: 24px;
        }

        .nav-item {
          padding: 12px 24px;
          color: #E5E7EB;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background-color 0.2s, color 0.2s;
          border-left: 4px solid transparent;
        }

        .nav-item:hover {
          background-color: #2A2A2A;
          color: #FFFFFF;
        }

        .nav-item.active {
          background-color: #333333;
          color: #FFFFFF;
          font-weight: 700;
          border-left: 4px solid #FFFFFF;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: inline-flex;
          }

          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            transform: translateX(-100%);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.25);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .mobile-backdrop.open {
            display: block;
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.45);
            z-index: 30;
          }

          .admin-header {
            padding: 14px 16px;
          }

          .admin-header h1 {
            font-size: 16px !important;
          }

          .admin-email-badge {
            font-size: 11px !important;
            padding: 5px 10px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 145px;
          }

          .admin-content {
            padding: 16px;
          }
        }
      `}</style>

      {/* Mobile Backdrop */}
      <div
        className={`mobile-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ================= SIDEBAR / MOBILE MENU DRAWER ================= */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
              Aura Luxe Admin
            </h2>
            <p style={{ fontSize: '11px', color: '#AAAAAA', margin: '4px 0 0 0' }}>Management Portal</p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            onClick={handleSelectAddNew}
            className={`nav-item ${activeTab === 'add-product' ? 'active' : ''}`}
          >
            <span>➕</span>
            <span>Add New Product</span>
          </div>

          <div
            onClick={handleSelectProducts}
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          >
            <span>📋</span>
            <span>Products</span>
          </div>
        </div>

        <div style={{ padding: '0 24px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: '#D32F2F',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px',
              borderRadius: '4px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'uppercase',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {activeTab === 'add-product' ? 'Add New Product' : 'Products Catalog'}
            </h1>
          </div>

          <span
            className="admin-email-badge"
            style={{
              fontSize: '13px',
              color: '#4B5563',
              backgroundColor: '#F3F4F6',
              padding: '6px 12px',
              borderRadius: '20px'
            }}
          >
            Admin: admin@auraluxe.com
          </span>
        </header>

        {/* Dashboard Dynamic Content */}
        <main className="admin-content">
          <AdminProducts
            activeTab={activeTab}
            editingProductData={editingProductData}
            onClearEditing={() => setEditingProductData(null)}
            onEditProduct={handleEditFromCatalog}
          />
        </main>
      </div>
    </div>
  );
}