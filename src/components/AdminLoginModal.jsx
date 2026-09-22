import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Eye, EyeOff, X, ArrowRight, KeyRound } from 'lucide-react';

export const AdminLoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, loginAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = loginAdmin(password);
    if (result.success) {
      setPassword('');
      closeLoginModal();
    } else {
      setErrorMsg(result.message || '密碼錯誤，請重新輸入！');
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeLoginModal}>
      <div 
        className="glass-panel animate-fade-in" 
        style={{ 
          maxWidth: '440px', 
          width: '100%', 
          padding: '2.5rem 2rem', 
          position: 'relative',
          background: 'rgba(18, 25, 41, 0.95)',
          border: '1px solid var(--border-glass-bright)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <button className="modal-close-btn" onClick={closeLoginModal} aria-label="關閉">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)'
          }}>
            <Shield size={32} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-title)', fontWeight: '800' }}>
            管理者身份驗證
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            本區塊受安全密碼保護，請輸入管理者授權密碼解鎖全站 CMS 管理權限。
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.88rem', textAlign: 'center' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              <span>管理者授權密碼</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="請輸入管理者密碼..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                style={{ paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
            <KeyRound size={18} />
            確認解鎖管理者權限
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          🔒 安全機制啟用中 ｜ 驗證失敗將阻擋未授權存取
        </div>
      </div>
    </div>
  );
};
