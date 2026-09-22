import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab, isAdmin, siteBranding, customPages = [] } = useApp();

  return (
    <footer className="site-footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--text-title)' }}>
          <Sparkles size={18} color="var(--accent-pink)" />
          <span>{siteBranding.name || '我的專屬藝廊網站'} {siteBranding.footerText ? ` - ${siteBranding.footerText}` : ''}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {siteBranding.navHomeLabel || '主頁'}
          </button>
          <button onClick={() => setActiveTab('intro')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {siteBranding.navIntroLabel || '介紹 (雙欄輪播)'}
          </button>
          <button onClick={() => setActiveTab('announcements')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {siteBranding.navAnnouncementsLabel || '公告專區'}
          </button>
          <button onClick={() => setActiveTab('form')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {siteBranding.navFormLabel || '活動與表單'}
          </button>
          <button onClick={() => setActiveTab('responses')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {siteBranding.navResponsesLabel || '回應表單 (分頁觀看)'}
          </button>
          <button onClick={() => setActiveTab('sponsors')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {siteBranding.navSponsorsLabel || '贊助廠商'}
          </button>
          {customPages.map(cp => (
            <button key={cp.id} onClick={() => setActiveTab(cp.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {cp.navLabel || cp.pageTitle}
            </button>
          ))}
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer' }}>
              {siteBranding.navAdminLabel || '管理者後台'}
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', opacity: 0.8, color: 'var(--text-muted)', textAlign: 'center' }}>
          {siteBranding.copyrightText || `© 2026 ${siteBranding.name || '我的專屬網站'}. All rights reserved. 支援電腦、平板與手機螢幕最適適應。`}
        </p>
      </div>
    </footer>
  );
};
