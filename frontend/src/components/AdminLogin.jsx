import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Predefined Strong Admin Credentials
  const ADMIN_EMAIL = 'admin@auraluxe.com';
  const ADMIN_PASSWORD = 'Admin@2026!Secure';

const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // sessionStorage-ஐப் பயன்படுத்தினால், டேப் அல்லது பிரௌசரை மூடியவுடன் ஆட்டோமேட்டிக்காக லாகின் துண்டிக்கப்பட்டுவிடும்
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Admin Email or Password. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh', // 80vh-க்கு பதிலாக 100vh கொடுக்கவும்
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #EAEAEA',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#1E1E1E', letterSpacing: '1px' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
            AURA LUXE Store Management Login
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              padding: '10px 14px',
              borderRadius: '4px',
              fontSize: '13px',
              marginBottom: '18px',
              border: '1px solid #FFCDD2',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', color: '#333' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@auraluxe.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #CCCCCC',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter strong password"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #CCCCCC',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: '14px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            Login to Dashboard
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#F9F9F9', borderRadius: '4px', fontSize: '12px', color: '#555', border: '1px dashed #DDD' }}>
          <strong>Demo Credentials:</strong><br />
          Email: <code>admin@auraluxe.com</code><br />
          Password: <code>Admin@2026!Secure</code>
        </div>
      </div>
    </div>
  );
}