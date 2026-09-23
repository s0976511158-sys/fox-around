import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Pause, Film, CheckCircle2, ArrowRight, Sparkles, Tag, Filter } from 'lucide-react';

export const ShowcaseSlider = () => {
  const { showcaseItems, categories, setActiveTab, heroConfig, customPages = [] } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isOverArrow, setIsOverArrow] = useState(false);
  const [hoveredThumbId, setHoveredThumbId] = useState(null);
  const thumbStripRef = useRef(null);

  // ⚡ 圖片與 GIF 高速背景預載入機制 (優先預載入 WebP 動畫，存入瀏覽器快取達成 0 毫秒極速顯示)
  useEffect(() => {
    if (!showcaseItems || showcaseItems.length === 0) return;
    showcaseItems.forEach(item => {
      if (item.imageUrl) {
        const img = new Image();
        img.src = item.imageUrl;
      }
      if (item.gifUrl) {
        const webp = new Image();
        webp.src = item.gifUrl.endsWith('.gif') ? item.gifUrl.replace(/\.gif$/i, '.webp') : item.gifUrl;
        const gif = new Image();
        gif.src = item.gifUrl;
      }
    });
  }, [showcaseItems]);

  // 根據選擇的主題分類過濾項目
  const filteredItems = showcaseItems.filter(item => {
    if (selectedCategory === '全部') return true;
    return item.category === selectedCategory;
  });

  // 分類切換時，自動將播放順序歸零
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  // 🎞️ 當輪播索引改變時，小圖列自動平滑滾動跟隨至當前項目 (如果回第1張則滾動歸零)
  useEffect(() => {
    const container = thumbStripRef.current;
    if (!container) return;

    if (currentIndex === 0) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (container.children && container.children[currentIndex]) {
      const activeThumb = container.children[currentIndex];
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [currentIndex]);

  // 自動輪播 (Hover 暫停)
  useEffect(() => {
    if (!filteredItems || filteredItems.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredItems.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [filteredItems, isHovered]);

  if (!showcaseItems || showcaseItems.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>目前無介紹展示項目，請至管理者頁面新增。</p>
      </div>
    );
  }

  const currentItem = filteredItems[currentIndex] || filteredItems[0];

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (filteredItems.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (filteredItems.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % filteredItems.length);
  };

  // 滑鼠移至上一張/下一張按鈕時不觸發播放 GIF 視覺效果 (使用者需求)
  const showGif = isHovered && !isOverArrow;

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
      
      {/* 🏷️ 主題分類篩選標籤列 (使用者需求：選擇不同主題看不同的介紹雙欄展示) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-title)', whiteSpace: 'nowrap' }}>
          <Tag size={16} color="var(--accent-pink)" />
          <span>介紹主題分類：</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === '全部' 
              ? showcaseItems.length 
              : showcaseItems.filter(i => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: '9999px',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? '700' : '500',
                  boxShadow: isSelected ? '0 0 15px rgba(236, 72, 153, 0.3)' : 'none'
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Filter size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-title)', marginBottom: '0.5rem' }}>
            主題「{selectedCategory}」目前尚無介紹展示項目
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            您可以切換其他主題標籤觀看，或至管理者頁面為此主題新增介紹項目。
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCategory('全部')}>
            顯示全部主題項目
          </button>
        </div>
      ) : (
        <div className="showcase-grid">
          {/* 左側：圖片/GIF 輪播區塊 (含 Prev/Next 按鈕、Hover 暫停與放大) */}
          <div className="showcase-media-column">
            <div 
              className="showcase-media-container"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsOverArrow(false);
              }}
            >
              {/* 左側動態輪播圖片/GIF (Hover 移入圖片區域時切換為 GIF 放大) */}
              <img
                src={(showGif && currentItem.gifUrl) ? currentItem.gifUrl : (currentItem.imageUrl || currentItem.gifUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop')}
                alt={currentItem.title}
                className="showcase-media-img"
                decoding="async"
                style={{
                  transform: showGif ? 'scale(1.08)' : 'scale(1.0)',
                  transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              />

              {/* 上一張 / 下一張 切換按鈕 */}
              {filteredItems.length > 1 && (
                <>
                  <button 
                    className="carousel-arrow carousel-arrow-left" 
                    onClick={handlePrev} 
                    onMouseEnter={(e) => { e.stopPropagation(); setIsOverArrow(true); }}
                    onMouseLeave={(e) => { e.stopPropagation(); setIsOverArrow(false); }}
                    aria-label="上一張"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    className="carousel-arrow carousel-arrow-right" 
                    onClick={handleNext} 
                    onMouseEnter={(e) => { e.stopPropagation(); setIsOverArrow(true); }}
                    onMouseLeave={(e) => { e.stopPropagation(); setIsOverArrow(false); }}
                    aria-label="下一張"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Dots */}
              {filteredItems.length > 1 && (
                <div 
                  className="carousel-dots"
                  onMouseEnter={(e) => { e.stopPropagation(); setIsOverArrow(true); }}
                  onMouseLeave={(e) => { e.stopPropagation(); setIsOverArrow(false); }}
                >
                  {filteredItems.map((_, idx) => (
                    <button
                      key={idx}
                      className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 左下角縮圖快速切換列 (自動滾動定位，無視覺滾軸) */}
            <div className="showcase-thumbnail-strip" ref={thumbStripRef}>
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  onMouseEnter={() => setHoveredThumbId(item.id)}
                  onMouseLeave={() => setHoveredThumbId(null)}
                  className={`showcase-thumb-item ${currentIndex === idx ? 'active' : ''}`}
                >
                  <img 
                    src={(hoveredThumbId === item.id && item.gifUrl) ? item.gifUrl : (item.imageUrl || item.gifUrl)} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 右側：相關介紹文字與亮點 (與左側輪播完全同步) */}
          <div className="showcase-info-panel animate-fade-in" key={currentItem.id}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span className="badge badge-indigo">{currentItem.category || '精選主題'}</span>
              </div>

              <h2 className="showcase-item-title">
                {currentItem.title}
              </h2>

              {currentItem.subtitle && (
                <p style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '1rem' }}>
                  {currentItem.subtitle}
                </p>
              )}

              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {currentItem.description}
              </p>
            </div>

            {/* 亮點列表 */}
            {currentItem.highlights && currentItem.highlights.length > 0 && (
              <div className="event-inner-box" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--text-title)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="var(--accent-pink)" />
                  主要特色與規格說明
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentItem.highlights.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 按鈕行動觸發 (使用者需求：自定義要不要出現與文字連結編輯) */}
            {(() => {
              const shouldShowBtn = currentItem?.showCtaBtn !== undefined
                ? currentItem.showCtaBtn
                : (heroConfig?.showcaseShowCta !== false);

              const btnText = currentItem?.ctaBtnText || currentItem?.ctaText || heroConfig?.showcaseCtaText || '前往填寫評分表單';
              const btnLink = currentItem?.ctaBtnLink || currentItem?.ctaLink || heroConfig?.showcaseCtaLink || 'form';

              const handleButtonClick = () => {
                if (!btnLink) {
                  setActiveTab('form');
                  return;
                }
                if (btnLink.startsWith('http://') || btnLink.startsWith('https://')) {
                  window.open(btnLink, '_blank');
                } else {
                  setActiveTab(btnLink);
                }
              };

              if (!shouldShowBtn) return null;

              return (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                  <button className="btn btn-primary" onClick={handleButtonClick}>
                    {btnText}
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
