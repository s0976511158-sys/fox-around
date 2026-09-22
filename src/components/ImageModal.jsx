import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Film, ArrowRight, ExternalLink, Edit3 } from 'lucide-react';

export const ImageModal = () => {
  const { selectedImageModal, closeImageModal, setActiveTab, isAdmin, startEditCarousel, heroConfig } = useApp();

  if (!selectedImageModal) return null;

  const handleEditItem = () => {
    const item = selectedImageModal;
    closeImageModal();
    if (isAdmin) {
      startEditCarousel(item);
    }
  };

  // 主要按鈕顯示判斷
  const showPrimaryBtn = selectedImageModal.showActionBtn !== false && (
    Boolean(selectedImageModal.actionBtnText) || 
    Boolean(selectedImageModal.actionBtnLink) || 
    Boolean(selectedImageModal.websiteUrl) || 
    Boolean(heroConfig?.modalActionBtnText) || 
    Boolean(heroConfig?.modalActionBtnLink)
  );

  const primaryBtnText = selectedImageModal.actionBtnText 
    || (selectedImageModal.websiteUrl ? '造訪官方網站' : '') 
    || heroConfig?.modalActionBtnText 
    || '前往介紹頁觀看雙欄動態';

  const primaryBtnLink = selectedImageModal.actionBtnLink 
    || selectedImageModal.websiteUrl 
    || heroConfig?.modalActionBtnLink 
    || 'intro';

  const isExternalPrimary = primaryBtnLink.startsWith('http://') || primaryBtnLink.startsWith('https://') || primaryBtnLink.startsWith('mailto:');

  const handlePrimaryClick = () => {
    closeImageModal();
    if (isExternalPrimary) {
      window.open(primaryBtnLink, '_blank', 'noopener,noreferrer');
    } else {
      setActiveTab(primaryBtnLink);
    }
  };

  // 次要按鈕顯示判斷
  const secondaryBtnText = selectedImageModal.secondaryBtnText || heroConfig?.modalSecondaryBtnText || '';
  const secondaryBtnLink = selectedImageModal.secondaryBtnLink || heroConfig?.modalSecondaryBtnLink || '';
  const showSecondaryBtn = Boolean(secondaryBtnText);
  const isExternalSecondary = secondaryBtnLink.startsWith('http://') || secondaryBtnLink.startsWith('https://') || secondaryBtnLink.startsWith('mailto:');

  const handleSecondaryClick = () => {
    closeImageModal();
    if (isExternalSecondary) {
      window.open(secondaryBtnLink, '_blank', 'noopener,noreferrer');
    } else if (secondaryBtnLink) {
      setActiveTab(secondaryBtnLink);
    }
  };

  const closeBtnText = heroConfig?.modalCloseBtnText || '關閉';

  return (
    <div className="modal-backdrop" onClick={closeImageModal}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeImageModal} aria-label="關閉視窗">
          <X size={20} />
        </button>

        {/* Modal 左側大圖 / GIF */}
        <div className="modal-img-wrapper">
          <img
            src={selectedImageModal.gifUrl || selectedImageModal.imageUrl}
            alt={selectedImageModal.title}
            className="modal-img"
          />
          {selectedImageModal.gifUrl && (
            <div className="gif-badge">
              <Film size={12} style={{ display: 'inline', marginRight: '4px' }} />
              動態 GIF
            </div>
          )}
        </div>

        {/* Modal 右側詳細內容 */}
        <div className="modal-body">
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {selectedImageModal.category && <span className="badge badge-indigo">{selectedImageModal.category}</span>}
              {selectedImageModal.tag && <span className="badge badge-pink">{selectedImageModal.tag}</span>}
              {selectedImageModal.badges?.map((b, i) => (
                <span key={i} className="badge badge-cyan">{b}</span>
              ))}
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-title)' }}>
              {selectedImageModal.title}
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {selectedImageModal.description}
            </p>

            {/* 展件技術亮點與視覺規格 (僅在管理者明確輸入內容時呈現) */}
            {!selectedImageModal.hideSpecs && (() => {
              const resText = selectedImageModal.specResolution || '';
              const respText = selectedImageModal.specResponsive || '';
              const themeText = selectedImageModal.specTheme || '';
              const customHighlights = selectedImageModal.highlights || [];

              const hasAnySpecs = Boolean(resText || respText || themeText || customHighlights.length > 0);

              if (!hasAnySpecs) return null;

              return (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} />
                    {selectedImageModal.specTitle || '展件技術亮點與視覺規格'}
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {resText && <li>解析度：{resText}</li>}
                    {respText && <li>響應式：{respText}</li>}
                    {themeText && <li>主題屬性：{themeText}</li>}
                    {customHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {showPrimaryBtn && (
              <button 
                type="button"
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={handlePrimaryClick}
              >
                {primaryBtnText}
                {isExternalPrimary ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
              </button>
            )}

            {showSecondaryBtn && (
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={handleSecondaryClick}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {secondaryBtnText}
                {isExternalSecondary && <ExternalLink size={14} />}
              </button>
            )}

            {isAdmin && (
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={handleEditItem}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--accent-pink)', color: 'var(--accent-pink)' }}
              >
                <Edit3 size={15} />
                編輯圖片與內容
              </button>
            )}

            <button type="button" className="btn btn-secondary" onClick={closeImageModal}>
              {closeBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
