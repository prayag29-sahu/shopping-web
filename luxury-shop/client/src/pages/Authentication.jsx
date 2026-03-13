import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { GeneralContext } from '../context/GeneralContext';

const API = 'http://localhost:6001/api';

const styles = `
  .auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--bg);
  }
  .auth-visual {
    position: relative;
    overflow: hidden;
    background: var(--navy);
  }
  .auth-visual img {
    width: 100%; height: 100%;
    object-fit: cover; opacity: 0.5;
  }
  .auth-visual-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: flex-end;
    padding: 56px;
    background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%);
  }
  .auth-visual-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px; font-weight: 600;
    letter-spacing: 8px; color: #fff;
    margin-bottom: 12px;
  }
  .auth-visual-brand span { color: var(--gold); }
  .auth-visual-sub {
    font-size: 13px; color: rgba(255,255,255,0.6);
    letter-spacing: 1px; line-height: 1.7; max-width: 320px;
  }
  .auth-form-panel {
    display: flex; align-items: center; justify-content: center;
    padding: 48px 56px;
    background: #fff;
  }
  .auth-form-inner {
    width: 100%; max-width: 400px;
  }
  .auth-eyebrow {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px; display: block;
  }
  .auth-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px; font-weight: 400; color: var(--navy);
    margin-bottom: 6px; line-height: 1.1;
  }
  .auth-sub {
    font-size: 13px; color: var(--text-muted); margin-bottom: 36px;
  }
  .auth-field {
    position: relative; margin-bottom: 16px;
  }
  .auth-field-icon {
    position: absolute; left: 16px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted); font-size: 16px; pointer-events: none;
  }
  .auth-input {
    width: 100%; padding: 14px 16px 14px 46px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 13px; color: var(--text);
    background: var(--bg);
    outline: none; transition: var(--transition);
    font-family: 'Inter', sans-serif;
  }
  .auth-input:focus {
    border-color: var(--navy); background: #fff;
  }
  .auth-input::placeholder { color: var(--text-muted); }
  .auth-eye {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 16px; padding: 4px;
  }
  .auth-submit {
    width: 100%; margin-top: 8px; justify-content: center;
  }
  .auth-toggle {
    text-align: center; margin-top: 24px;
    font-size: 13px; color: var(--text-muted);
  }
  .auth-toggle button {
    background: none; border: none; cursor: pointer;
    color: var(--navy); font-weight: 600; text-decoration: underline;
    font-size: 13px; margin-left: 4px;
  }
  .auth-error {
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: var(--radius); padding: 12px 16px;
    font-size: 13px; color: #DC2626; margin-bottom: 16px;
  }
  .auth-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 24px 0; color: var(--text-muted); font-size: 12px;
  }
  .auth-divider::before, .auth-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-visual { display: none; }
    .auth-form-panel { padding: 40px 24px; }
  }
`;

const Authentication = () => {
  const navigate = useNavigate();
  const { setCartCount } = useContext(GeneralContext);
  const [isLogin, setIsLogin]     = useState(true);
  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const url  = isLogin ? `${API}/users/login` : `${API}/users/register`;
      const body = isLogin ? { email, password } : { username, email, password };
      const r    = await axios.post(url, body);
      const user = r.data;
      localStorage.setItem('userId',   user._id);
      localStorage.setItem('userType', user.usertype);
      localStorage.setItem('username', user.username || username);
      localStorage.setItem('userEmail',user.email);
      setCartCount(0);
      navigate(user.usertype === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const switchMode = () => { setIsLogin(v => !v); setError(''); };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        {/* Visual Panel */}
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85"
            alt="VELOUR fashion"
          />
          <div className="auth-visual-overlay">
            <div className="auth-visual-brand">VEL<span>O</span>UR</div>
            <p className="auth-visual-sub">
              Where refined taste meets effortless elegance.<br />
              Discover the season's most coveted pieces.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <span className="auth-eyebrow">{isLogin ? 'Welcome back' : 'Join VELOUR'}</span>
            <h1 className="auth-heading">{isLogin ? 'Sign in to\nyour account' : 'Create your\naccount'}</h1>
            <p className="auth-sub">
              {isLogin
                ? 'Access your orders, wishlist and exclusive member benefits.'
                : 'Enjoy free returns, early access to new collections and more.'}
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="auth-field">
                  <FiUser className="auth-field-icon" />
                  <input className="auth-input" type="text" placeholder="Full Name"
                    value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
              )}
              <div className="auth-field">
                <FiMail className="auth-field-icon" />
                <input className="auth-input" type="email" placeholder="Email address"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="auth-field">
                <FiLock className="auth-field-icon" />
                <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="Password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="auth-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button type="submit" className="btn-gold auth-submit" disabled={loading}>
                {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'} <FiArrowRight />
              </button>
            </form>

            <div className="auth-divider">or</div>

            {/* Demo Credentials */}
            <div style={{background:'var(--bg)',borderRadius:4,padding:'14px 16px',fontSize:'12px',color:'var(--text-muted)',lineHeight:1.8,marginBottom:'20px'}}>
              <strong style={{color:'var(--navy)',display:'block',marginBottom:4}}>Demo Accounts</strong>
              Admin: <strong>admin@velour.com</strong> / admin123<br />
              Customer: <strong>user@velour.com</strong> / user123
            </div>

            <div className="auth-toggle">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={switchMode}>{isLogin ? 'Create one' : 'Sign in'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
