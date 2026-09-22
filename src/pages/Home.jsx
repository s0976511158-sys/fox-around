import React from 'react';
import { useApp } from '../context/AppContext';
import { Carousel } from '../components/Carousel';
import { ImageModal } from '../components/ImageModal';
import { ArrowRight, Sparkles, Layout, ShieldCheck, Layers, FileText, Gift, Calendar, MapPin, Star, Sparkle, Clock } from 'lucide-react';

export const Home = () => {
  const { heroConfig, eventInfo, featureCards, setActiveTab, announcements } = useApp();

  const handleLinkClick = (targetLink) => {
    if (!targetLink) {
      setActiveTab('form');
      return;
    }
    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      window.open(targetLink, '_blank');
    } else {
      setActiveTab(targetLink);
    }
  };

  const heroOpacity = heroConfig.heroOverlayOpacity !== undefined ? Number(heroConfig.heroOverlayOpacity) : (heroConfig.opacity !== undefined ? Number(heroConfig.opacity) : 0.45);
  const featuredAnnouncement = announcements ? announcements.find(a => a.id === heroConfig.featuredAnnouncementId) : null;

  const now = new Date();
  const isTimeExpired = (eventInfo?.endDate && !isNaN(Date.parse(eventInfo.endDate)) && now > new Date(eventInfo.endDate)) ||
                        (eventInfo?.deadlineText && !isNaN(Date.parse(eventInfo.deadlineText)) && now > new Date(eventInfo.deadlineText));
  const isExpired = Boolean(eventInfo?.isExpired || isTimeExpired);

  // 圖示動態映射
  const getIcon = (iconName, idx) => {
    switch (iconName) {
      case 'Layout': return <Layout size={24} />;
      case 'FileText': return <FileText size={24} />;
      case 'Layers': return <Layers size={24} />;
      case 'ShieldCheck': return <ShieldCheck size={24} />;
      default: return idx % 2 === 0 ? <Sparkles size={24} /> : <Star size={24} />;
    }
  };

  const getAccentColor = (idx) => {
    const colors = ['#818cf8', '#f472b6', '#38bdf8', '#34d399', '#f59e0b'];
    return colors[idx % colors.length];
  };

  const heroBgUrl = heroConfig.heroBannerUrl || heroConfig.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop';

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Visual 區塊 */}
      <section className="hero-section">
        <img
          src={heroBgUrl}
          alt=""
          className="hero-bg-img"
          fetchpriority="high"
          decoding="async"
          style={{
            opacity: heroOpacity,
            filter: `brightness(${heroOpacity + 0.1}) contrast(1.15)`
          }}
        />
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-indigo">
              <Sparkles size={12} /> {heroConfig.heroBadge || heroConfig.badge || '狐搞瞎搞'}
            </span>
          </div>
          <h1 className="hero-title">
            {heroConfig.heroTitle || heroConfig.title}
          </h1>
          <p className="hero-subtitle">
            {heroConfig.heroSubtitle || heroConfig.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab(heroConfig.ctaLink || 'form')}>
              {heroConfig.ctaText || '立即參與體驗表單'}
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab(heroConfig.secondaryCtaLink || heroConfig.ctaSecondaryLink || 'intro')}>
              {heroConfig.ctaSecondaryText || heroConfig.secondaryCtaText || '觀看雙欄動態介紹'}
            </button>
          </div>
        </div>
      </section>

      {/* 2. 主頁精選區塊 (可選擇展示精選公告貼文、問卷調查說明，或設為隱藏) */}
      {heroConfig.homeFeaturedType && heroConfig.homeFeaturedType !== 'none' && (
        <section className="event-info-card" style={{ marginBottom: '3.5rem' }}>
          {heroConfig.homeFeaturedType === 'announcement' && featuredAnnouncement ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-pink">
                      {heroConfig.featuredAnnouncementBadge !== undefined ? heroConfig.featuredAnnouncementBadge : '重磅活動介紹'}
                    </span>
                    {(heroConfig.featuredAnnouncementSubBadge !== undefined ? heroConfig.featuredAnnouncementSubBadge : (featuredAnnouncement.category || '歡迎全體訪客參與')) && (
                      <span className="badge badge-indigo">
                        {heroConfig.featuredAnnouncementSubBadge !== undefined ? heroConfig.featuredAnnouncementSubBadge : (featuredAnnouncement.category || '歡迎全體訪客參與')}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-title)', fontWeight: '800' }}>{featuredAnnouncement.title}</h2>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={16} color="var(--accent-cyan)" /> 發布日期：{featuredAnnouncement.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} color="var(--accent-pink)" /> 發布者：{featuredAnnouncement.author || '管理者'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setActiveTab('announcements')}
                  >
                    {heroConfig.announcementsCtaText || '前往公告專區'}
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setActiveTab('form')}
                    style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)' }}
                  >
                    <FileText size={20} />
                    {heroConfig.eventCtaText || '前往填寫活動表單'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* 公告主視覺圖片 */}
              {featuredAnnouncement.imageUrl && (
                <div style={{ marginBottom: '1.25rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '350px' }}>
                  <img 
                    src={featuredAnnouncement.imageUrl} 
                    alt={featuredAnnouncement.title}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {/* 公告內文說明 */}
              <div className="event-inner-box" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.6rem', fontWeight: '700' }}>
                  精選公告內文說明
                </h4>
                <p className="event-purpose-text" style={{ fontSize: '0.98rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {featuredAnnouncement.content}
                </p>
              </div>

              {/* 獎勵與特色 */}
              <div className="reward-text-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: '600' }}>
                  <Gift size={20} color="#f59e0b" />
                  <span>{eventInfo.rewardText || '完成表單填寫即可獲得專屬回饋！'}</span>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('form')}
                >
                  馬上前往填寫問卷 →
                </button>
              </div>
            </div>
          ) : heroConfig.homeFeaturedType === 'survey' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {(heroConfig.featuredSurveyBadge !== undefined ? heroConfig.featuredSurveyBadge : (eventInfo.tag || '重磅活動介紹')) && (
                      <span className="badge badge-pink">
                        {heroConfig.featuredSurveyBadge !== undefined ? heroConfig.featuredSurveyBadge : (eventInfo.tag || '重磅活動介紹')}
                      </span>
                    )}
                    {(heroConfig.featuredSurveySubBadge !== undefined ? heroConfig.featuredSurveySubBadge : (eventInfo.subTag || '歡迎全體訪客參與')) && (
                      <span className="badge badge-cyan">
                        {heroConfig.featuredSurveySubBadge !== undefined ? heroConfig.featuredSurveySubBadge : (eventInfo.subTag || '歡迎全體訪客參與')}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.15rem, 3.8vw, 1.8rem)', color: 'var(--text-title)', fontWeight: '800', lineHeight: '1.45', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{eventInfo.title}</h2>
                  <div style={{ display: 'flex', gap: '0.4rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                      <Calendar size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} /> {eventInfo.dateText}
                    </span>
                    {(eventInfo.deadlineText || eventInfo.endDate) && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isExpired ? '#fca5a5' : 'var(--accent-pink)', fontWeight: '700', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                          <Clock size={16} style={{ flexShrink: 0 }} /> 截止時間：{eventInfo.deadlineText || eventInfo.endDate}
                        </span>
                        <span className={`badge ${isExpired ? 'badge-pink' : 'badge-emerald'}`} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', display: 'inline-block' }}>
                          {isExpired ? '已截止' : '進行中'}
                        </span>
                      </span>
                    )}
                    {eventInfo.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                        <MapPin size={16} color="var(--accent-pink)" style={{ flexShrink: 0 }} /> {eventInfo.location}
                      </span>
                    )}
                  </div>
                </div>

                {heroConfig.surveyBtn1Show !== false && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleLinkClick(heroConfig.surveyBtn1Link || 'form')}
                    style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)' }}
                  >
                    <FileText size={20} />
                    {heroConfig.surveyBtn1Text || heroConfig.eventCtaText || '前往填寫活動表單'}
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {/* 活動背景與填表目的詳細說明 (支援 Enter 換行) */}
              <div className="event-inner-box" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.6rem', fontWeight: '700' }}>
                  {eventInfo.purposeTitle || '🎯 活動背景與填表目的說明'}
                </h4>
                <p className="event-purpose-text" style={{ fontSize: '0.98rem', lineHeight: '1.75', marginBottom: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {eventInfo.purpose}
                </p>
                {eventInfo.description && (
                  <p className="event-desc-text" style={{ fontSize: '0.92rem', lineHeight: '1.65', whiteSpace: 'pre-wrap', wordBreak: 'break-word', borderTop: '1px dashed var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    {eventInfo.description}
                  </p>
                )}
              </div>

              {/* 獎勵與特色 */}
              <div className="reward-text-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: '600' }}>
                  <Gift size={20} color="#f59e0b" />
                  <span>{eventInfo.rewardText || '完成表單填寫即可獲得專屬回饋！'}</span>
                </div>
                {heroConfig.surveyBtn2Show !== false && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleLinkClick(heroConfig.surveyBtn2Link || 'form')}
                  >
                    {heroConfig.surveyBtn2Text || heroConfig.surveyRewardCtaText || '馬上前往填寫問卷 →'}
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* 3. 互動式圖片輪播組件 */}
      <Carousel />

      {/* Image Modal Lightbox */}
      <ImageModal />

      {/* 4. 網站最下方功能介紹 (使用者需求：無卡片時自動完全隱藏不留框痕) */}
      {featureCards && featureCards.length > 0 && (
        <section style={{ marginTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
              {heroConfig.featureSectionTitle || '網站核心特色功能'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {heroConfig.featureSectionSubtitle || '管理者可於後台自由新增、修改與刪除下列特色功能說明卡片'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {featureCards.map((card, idx) => {
              const accent = getAccentColor(idx);
              return (
                <div key={card.id} className="glass-panel glass-panel-interactive" style={{ padding: '2rem' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: `${accent}20`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '1.25rem', 
                    color: accent 
                  }}>
                    {getIcon(card.icon, idx)}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-title)' }}>
                    {card.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
