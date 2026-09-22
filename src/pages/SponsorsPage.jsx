import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ExternalLink, Building2 } from 'lucide-react';

export const SponsorsPage = () => {
  const { heroConfig, sponsors, openImageModal } = useApp();

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* 頁面 Hero 標題區 */}
      <section className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div className="badge badge-pink" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={14} />
          {heroConfig.sponsorsPageBadge || '合作夥伴與贊助單位'}
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-title)', marginBottom: '1rem' }}>
          {heroConfig.sponsorsPageTitle || '感謝盛情贊助與支持夥伴'}
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.7' }}>
          {heroConfig.sponsorsPageSubtitle || '感謝以下各界優秀企業與團體贊助支持，攜手共創前沿數位體驗與創新視覺。'}
        </p>
      </section>

      {/* 贊助廠商列表 */}
      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {(!sponsors || sponsors.length === 0) ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Building2 size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-title)' }}>目前尚無贊助廠商資訊</h3>
            <p style={{ fontSize: '0.92rem' }}>管理者可至「管理者控制台 ➜ 頁面版面編輯 ➜ 贊助廠商」自由新增與維護。</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {sponsors.map((item) => {
              const handleOpenModal = () => {
                const img = item.avatarUrl || item.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
                openImageModal({
                  imageUrl: img,
                  title: item.name,
                  description: item.description,
                  category: item.category || '贊助夥伴',
                  tag: item.tag || '',
                  badges: item.badges || (item.badgesText ? item.badgesText.split(',').map(b => b.trim()).filter(Boolean) : []),
                  specResolution: item.specResolution || '',
                  specResponsive: item.specResponsive || '',
                  specTheme: item.specTheme || '',
                  specTitle: item.specTitle || '',
                  hideSpecs: item.hideSpecs || false,
                  highlights: item.highlights || [],
                  websiteUrl: item.websiteUrl || '',
                  actionBtnText: item.actionBtnText || (item.websiteUrl ? '造訪官方網站' : ''),
                  actionBtnLink: item.actionBtnLink || item.websiteUrl || '',
                  showActionBtn: item.showActionBtn !== undefined ? item.showActionBtn : true,
                  secondaryBtnText: item.secondaryBtnText || '',
                  secondaryBtnLink: item.secondaryBtnLink || ''
                });
              };

              return (
                <div 
                  key={item.id} 
                  className="glass-panel glass-panel-interactive" 
                  onClick={handleOpenModal}
                  style={{ 
                    padding: '2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-glass)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                      {/* 廠商頭像 / Logo 圖片 */}
                      <div 
                        style={{ 
                          width: '72px', 
                          height: '72px', 
                          borderRadius: '50%', 
                          overflow: 'hidden', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '2px solid var(--accent-pink)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.avatarUrl ? (
                          <img src={item.avatarUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Building2 size={32} color="var(--accent-pink)" />
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                          <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
                            {item.category || '贊助夥伴'}
                          </span>
                          {item.tag && <span className="badge badge-pink" style={{ fontSize: '0.78rem' }}>{item.tag}</span>}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-title)', lineHeight: '1.4' }}>
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                      {item.description}
                    </p>
                  </div>

                  {item.websiteUrl && (
                    <a 
                      href={item.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <ExternalLink size={14} /> 造訪官方網站
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
