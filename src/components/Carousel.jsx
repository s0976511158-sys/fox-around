import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Pause, ExternalLink, Sparkles, Film, Edit3 } from 'lucide-react';

export const Carousel = () => {
  const { carouselItems, categories, openImageModal, heroConfig, isAdmin, openLoginModal, startEditCarousel } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isOverArrow, setIsOverArrow] = useState(false);

  // 根據選擇的主題分類篩選項目
  const filteredItems = selectedCategory === '全部'
    ? carouselItems
    : carouselItems.filter(item => item.category === selectedCategory);

  // 切換分類時重置 index
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  // 自動輪播 (當滑鼠移上去 isHovered 時自動暫停)
  useEffect(() => {
    if (filteredItems.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredItems.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [filteredItems.length, isHovered]);

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>尚無輪播圖片，請至管理者頁面新增項目。</p>
      </div>
    );
  }

  const currentSlide = filteredItems[currentIndex] || filteredItems[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % filteredItems.length);
  };

  // 滑鼠移至上一張/下一張按鈕時不觸發播放 GIF 視覺效果 (使用者需求)
  const showGif = isHovered && !isOverArrow;

  return (
    <div style={{ marginTop: '2rem', marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
            <Sparkles size={22} color="var(--accent-primary)" style={{ display: 'inline', marginRight: '8px' }} />
            {heroConfig?.carouselSectionTitle || '互動視覺藝廊輪播'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {heroConfig?.carouselSectionSubtitle || '滑鼠移至圖片上方可暫停輪播，自動切換至 GIF 動畫並微距放大，點擊圖片開啟全尺寸詳細內容。'}
          </p>
        </div>

        {/* 主題分類按鈕 */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 輪播主體 (Hover 暫停、GIF動態切換與放大) */}
      <div 
        className="carousel-viewport"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsOverArrow(false);
        }}
        onClick={() => openImageModal(currentSlide)}
        style={{ position: 'relative' }}
      >
        {/* 滑鼠懸停暫停提示 Badge */}
        {isHovered && (
          <div className="pause-indicator">
            <Pause size={14} />
            <span>暫停輪播中 (點擊開啟詳細)</span>
          </div>
        )}

        {/* 編輯此輪播圖片按鈕 (僅管理者可見) */}
        {isAdmin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startEditCarousel(currentSlide);
            }}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 25,
              background: 'rgba(236, 72, 153, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'transform 0.2s, background 0.2s'
            }}
            title="編輯此輪播圖片與內容"
          >
            <Edit3 size={14} />
            <span>編輯圖片與內容</span>
          </button>
        )}

        {/* GIF 懸停動態提示 */}
        {currentSlide.gifUrl && (
          <div className="gif-badge">
            <Film size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {showGif ? '▶ GIF 動畫播映中' : '✨ 懸停移入切換 GIF'}
          </div>
        )}

        {/* 圖片展示 (Hover 移入圖片區域切換 GIF，移至上一張/下一張按鈕時自動不觸發 GIF) */}
        <img
          src={(showGif && currentSlide.gifUrl) ? currentSlide.gifUrl : (currentSlide.imageUrl || currentSlide.gifUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')}
          alt={currentSlide.title}
          className="carousel-slide-img"
          style={{
            transform: showGif ? 'scale(1.08)' : 'scale(1.0)',
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* 箭頭導覽 (移至按鈕上方不觸發顯示 GIF) */}
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

        {/* 下方標題與簡介 Overlay */}
        <div className="carousel-overlay">
          <div className="carousel-caption">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-indigo">{currentSlide.category}</span>
              {currentSlide.tag && <span className="badge badge-pink">{currentSlide.tag}</span>}
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', color: '#fff' }}>
              {currentSlide.title}
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {currentSlide.description}
            </p>
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '700' }}>
              <span>點擊查看完整介紹與細節</span>
              <ExternalLink size={14} />
            </div>
          </div>
        </div>

        {/* 頁碼 Dots 指示器 */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
