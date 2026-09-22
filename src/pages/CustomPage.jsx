import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, FileText, Layers, Film } from 'lucide-react';
import { FormPage } from './FormPage';
import { IntroShowcase } from './IntroShowcase';

export const CustomPage = ({ page }) => {
  const { carouselItems, openImageModal } = useApp();

  if (!page) return null;

  const {
    pageBadge,
    pageTitle,
    pageSubtitle,
    showTextModule,
    textContent,
    showIntroModule,
    showFormModule,
    showCarouselModule
  } = page;

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* 自訂頁面 Hero 標題頭部區 */}
      <section className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        {pageBadge && (
          <div className="badge badge-pink" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} />
            {pageBadge}
          </div>
        )}
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-title)', marginBottom: '1rem' }}>
          {pageTitle || '自訂頁面'}
        </h1>
        {pageSubtitle && (
          <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {pageSubtitle}
          </p>
        )}
      </section>

      {/* 1. 文字說明模塊 (Text Module) */}
      {showTextModule && textContent && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 3rem auto' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-pink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} />
              專頁詳細說明
            </h3>
            <div style={{ color: 'var(--text-main)', fontSize: '1.02rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {textContent}
            </div>
          </div>
        </section>
      )}

      {/* 2. 雙欄介紹模塊 (Intro Showcase Module) */}
      {showIntroModule && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-title)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Layers size={22} color="var(--accent-pink)" />
              雙欄互動介紹區塊
            </h3>
          </div>
          <IntroShowcase embedded={true} />
        </section>
      )}

      {/* 3. 圖片輪播模塊 (Carousel Module) */}
      {showCarouselModule && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 3rem auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-title)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Film size={22} color="var(--accent-cyan)" />
              視覺藝廊圖片輪播區塊
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {carouselItems?.map((item) => (
              <div 
                key={item.id} 
                className="glass-panel" 
                onClick={() => openImageModal(item)}
                style={{ cursor: 'pointer', padding: '1rem', transition: 'transform 0.3s ease' }}
              >
                <div style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-title)', marginBottom: '0.4rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 問卷表單模塊 (Form Module) */}
      {showFormModule && (
        <section style={{ marginBottom: '3rem' }}>
          <FormPage embedded={true} />
        </section>
      )}
    </div>
  );
};
