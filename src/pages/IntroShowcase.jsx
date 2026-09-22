import React from 'react';
import { useApp } from '../context/AppContext';
import { ShowcaseSlider } from '../components/ShowcaseSlider';
import { Info, Sparkles, Layers, Film, MousePointer, Star, CheckCircle } from 'lucide-react';

export const IntroShowcase = ({ embedded = false }) => {
  const { introCards, heroConfig } = useApp();

  // 動態圖示對照處理
  const getIntroIcon = (iconName, idx) => {
    switch (iconName) {
      case 'Film': return <Film size={22} color="var(--accent-pink)" />;
      case 'MousePointer': return <MousePointer size={22} color="var(--accent-cyan)" />;
      case 'Layers': return <Layers size={22} color="var(--accent-emerald)" />;
      case 'Sparkles': return <Sparkles size={22} color="var(--accent-primary)" />;
      default: return idx % 2 === 0 ? <Sparkles size={22} color="var(--accent-pink)" /> : <Star size={22} color="var(--accent-cyan)" />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* 頁面標題 */}
      {!embedded && (
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-pink" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={12} /> {heroConfig?.showcasePageBadge || '專題視覺與技術詳細介紹'}
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800' }}>
            {heroConfig?.showcasePageTitle || '雙欄同步互動輪播展示'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
            {heroConfig?.showcasePageSubtitle || '左側為主題輪播大圖與動態 GIF 展示區，支援滑鼠懸停暫停與微距放大；右側與輪播完全同步，展示當前項目的詳細規格與文字介紹。'}
          </p>
        </div>
      )}

      {/* 左圖右文雙欄輪播核心組件 */}
      <ShowcaseSlider />

      {/* 介紹頁面最下方卡片專區 (使用者需求：卡片皆可自訂；若無任何卡片時，整個區塊自動隱藏不顯示) */}
      {introCards && introCards.length > 0 && (
        <section style={{ marginTop: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', color: 'var(--text-title)' }}>
              {heroConfig?.showcaseSectionTitle || '專題技術與特色說明'}
            </h3>
            {heroConfig?.showcaseSectionSubtitle && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {heroConfig.showcaseSectionSubtitle}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {introCards.map((card, idx) => (
              <div key={card.id} className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  {getIntroIcon(card.icon, idx)}
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-title)' }}>{card.title}</h4>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
