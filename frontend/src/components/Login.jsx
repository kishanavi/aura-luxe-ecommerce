import React, { useState } from 'react';
import API from '../services/api';

export default function Login({ onLoginSuccess, onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Inline error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let isValid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!email.includes('@')) {
      setEmailError('Please include an "@" in the email address.');
      isValid = false;
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    }

    // Name validation for signup
    if (isSignup && !name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const payload = isSignup ? { name, email, password } : { email, password };
      const res = await API.post(endpoint, payload);

      localStorage.setItem('token', res.data.token);
      
      // --- ADDED FIX: Signup/Login aanavudane name & email-ah direct-ah localStorage-la save panna ---
      const userName = isSignup ? name : (res.data.user?.name || name);
      const userEmail = email;
      
      localStorage.setItem('user', JSON.stringify({
        name: userName,
        email: userEmail,
        ...(res.data.user || {})
      }));
      // ------------------------------------------------------------------------------------------------

      onLoginSuccess();
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          border: '1px solid #EFECE6',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F5F2EC',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            fontSize: '16px',
            color: '#555',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700', color: '#1E1E1E' }}>
            {isSignup ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>
            {isSignup ? 'Join us to unlock wishlist & seamless checkout' : 'Sign in to access your bag and orders'}
          </p>
        </div>

        {generalError && (
          <div style={{ backgroundColor: '#FDF2F2', color: '#C83E3E', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid #F8D7DA' }}>
            {generalError}
          </div>
        )}

        {/* noValidate prevents browser's default popup */}
        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #DCD7CE',
                  fontSize: '14px',
                  backgroundColor: '#FAF8F5',
                  color: '#1E1E1E',
                }}
              />
              {nameError && <span style={{ color: '#C83E3E', fontSize: '12px', display: 'block', marginTop: '4px' }}>{nameError}</span>}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
              Email Address
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #DCD7CE',
                fontSize: '14px',
                backgroundColor: '#FAF8F5',
                color: '#1E1E1E',
              }}
            />
            {emailError && <span style={{ color: '#C83E3E', fontSize: '12px', display: 'block', marginTop: '4px' }}>{emailError}</span>}
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 42px 11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #DCD7CE',
                  fontSize: '14px',
                  backgroundColor: '#FAF8F5',
                  color: '#1E1E1E',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <span style={{ color: '#C83E3E', fontSize: '12px', display: 'block', marginTop: '4px' }}>{passwordError}</span>}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#C86D51',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setNameError('');
              setEmailError('');
              setPasswordError('');
              setGeneralError('');
            }}
            style={{ color: '#C86D51', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}