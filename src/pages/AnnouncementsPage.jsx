import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, Pin, Calendar, User, Search, Filter, ChevronRight, X, Sparkles, Clock, BookOpen, Edit3, Save } from 'lucide-react';

export const AnnouncementsPage = () => {
  const { announcements, heroConfig, updateHeroConfig, isAdmin } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnn, setSelectedAnn] = useState(null);

  const [isEditingHistoryTitle, setIsEditingHistoryTitle] = useState(false);
  const [historyTitleInput, setHistoryTitleInput] = useState(heroConfig?.announcementsHistoryTitle || '歷年公告歷史紀錄');

  const [isEditingPinnedTitle, setIsEditingPinnedTitle] = useState(false);
  const [pinnedTitleInput, setPinnedTitleInput] = useState(heroConfig?.announcementsPinnedTitle || '置頂重要公告');

  // 取得不重複分類
  const categories = ['全部', ...Array.from(new Set(announcements.map(a => a.category).filter(Boolean)))];

  // 篩選公告
  const filteredAnnouncements = announcements.filter(ann => {
    const matchesCat = selectedCategory === '全部' || ann.category === selectedCategory;
    const matchesSearch = 
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // 置頂公告 vs 普通公告
  const pinnedList = filteredAnnouncements.filter(a => a.isPinned);
  const normalList = filteredAnnouncements.filter(a => !a.isPinned);

  // 若點選特定公告，則整頁面呈現該公告詳細文章內容 (Requirement 2: 公告內文是整頁面呈現)
  if (selectedAnn) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setSelectedAnn(null)}
          style={{ marginBottom: '1.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', padding: '0.6rem 1.25rem' }}
        >
          ← 返回公告列表清單
        </button>

        <article className="glass-panel" style={{ padding: '3rem 2.5rem', border: selectedAnn.isPinned ? '2px solid var(--accent-pink)' : '1px solid var(--border-glass-bright)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {selectedAnn.isPinned && (
              <span className="badge badge-pink" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem' }}>
                <Pin size={14} /> 置頂重要公告
              </span>
            )}
            <span className="badge badge-indigo" style={{ fontSize: '0.88rem' }}>{selectedAnn.category}</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-title)', marginBottom: '1.25rem', lineHeight: '1.35' }}>
            {selectedAnn.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.75rem', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--accent-cyan)" /> 發布日期：{selectedAnn.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--accent-emerald)" /> 發布單位：{selectedAnn.author || '管理者'}
            </span>
          </div>

          {/* 🖼️ 公告主視覺圖片 (未設定時自動隱藏不顯示) */}
          {selectedAnn.imageUrl && (
            <div style={{ width: '100%', maxHeight: '440px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--border-glass)' }}>
              <img src={selectedAnn.imageUrl} alt={selectedAnn.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ color: 'var(--text-main)', fontSize: '1.08rem', lineHeight: '1.9', whiteSpace: 'pre-line', marginBottom: '3rem' }}>
            {selectedAnn.content}
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              📢 訊息來源：{selectedAnn.author || '系統管理者'}
            </span>
            <button className="btn btn-primary" onClick={() => setSelectedAnn(null)}>
              ← 返回公告列表
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* 頁頭 Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Megaphone size={14} /> {heroConfig?.announcementsPageBadge || '網站最新與歷年公告紀錄專區'}
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-title)' }}>
          {heroConfig?.announcementsPageTitle || '即時公告與歷史發布消息'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '680px', margin: '0.5rem auto 0 auto', lineHeight: '1.6' }}>
          {heroConfig?.announcementsPageSubtitle || '在此查看網站最新的活動通知、系統維護更新與歷年歷史發布公告。點擊任意公告卡片即可開啟整頁面文章閱讀。'}
        </p>
      </div>

      {/* 搜尋欄位與分類標籤 */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* 搜尋框 */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="搜尋公告關鍵字或內文..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.8rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 分類篩選 Tab */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} color="var(--text-muted)" />
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📌 置頂公告區塊 (若有置頂項目) */}
      {pinnedList.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pin size={20} color="var(--accent-pink)" />
              {heroConfig?.announcementsPinnedTitle || '置頂重要公告'} (📌 Pinned Announcements)
            </h3>

            {isAdmin && (
              isEditingPinnedTitle ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: '220px', padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
                    value={pinnedTitleInput}
                    onChange={(e) => setPinnedTitleInput(e.target.value)}
                    placeholder="請輸入置頂區塊標題"
                    autoFocus
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    onClick={() => {
                      updateHeroConfig({ announcementsPinnedTitle: pinnedTitleInput });
                      setIsEditingPinnedTitle(false);
                    }}
                  >
                    <Save size={13} /> 儲存
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      setPinnedTitleInput(heroConfig?.announcementsPinnedTitle || '置頂重要公告');
                      setIsEditingPinnedTitle(false);
                    }}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', opacity: 0.85 }}
                  onClick={() => {
                    setPinnedTitleInput(heroConfig?.announcementsPinnedTitle || '置頂重要公告');
                    setIsEditingPinnedTitle(true);
                  }}
                  title="管理者編輯置頂公告區塊標題"
                >
                  <Edit3 size={13} /> 編輯標題
                </button>
              )
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {pinnedList.map(ann => (
              <div
                key={ann.id}
                className="glass-panel glass-panel-interactive"
                onClick={() => {
                  setSelectedAnn(ann);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '1.75rem',
                  border: '1.5px solid var(--accent-pink)',
                  boxShadow: '0 8px 30px rgba(236, 72, 153, 0.15)',
                  position: 'relative'
                }}
              >
                {/* 🖼️ 置頂公告主視覺圖片 (未設定時自動隱藏不顯示) */}
                {ann.imageUrl && (
                  <div style={{ width: '100%', height: '170px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border-glass)' }}>
                    <img src={ann.imageUrl} alt={ann.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                  <span className="badge badge-pink" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Pin size={12} /> 置頂公告
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} color="var(--accent-cyan)" /> {ann.date}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-title)', marginBottom: '0.6rem', lineHeight: '1.4' }}>
                  {ann.title}
                </h4>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ann.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-cyan)', fontSize: '0.88rem', fontWeight: '600' }}>
                  <span>發布單位：{ann.author || '管理者'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>閱讀整頁文章 <ChevronRight size={16} /></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 📜 歷年與全部公告清單 (使用者需求：看之前發過的公告) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--accent-cyan)" />
            {selectedCategory === '全部'
              ? (heroConfig?.announcementsHistoryTitle || '歷年公告歷史紀錄')
              : `【${selectedCategory}】${heroConfig?.announcementsHistoryTitle || '公告列表'}`} (共 {filteredAnnouncements.length} 則)
          </h3>

          {isAdmin && (
            isEditingHistoryTitle ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  style={{ width: '220px', padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
                  value={historyTitleInput}
                  onChange={(e) => setHistoryTitleInput(e.target.value)}
                  placeholder="請輸入區塊標題"
                  autoFocus
                />
                <button
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  onClick={() => {
                    updateHeroConfig({ announcementsHistoryTitle: historyTitleInput });
                    setIsEditingHistoryTitle(false);
                  }}
                >
                  <Save size={13} /> 儲存
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    setHistoryTitleInput(heroConfig?.announcementsHistoryTitle || '歷年公告歷史紀錄');
                    setIsEditingHistoryTitle(false);
                  }}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.55rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', opacity: 0.85 }}
                onClick={() => {
                  setHistoryTitleInput(heroConfig?.announcementsHistoryTitle || '歷年公告歷史紀錄');
                  setIsEditingHistoryTitle(true);
                }}
                title="管理者編輯歷史公告區塊標題"
              >
                <Edit3 size={13} /> 編輯標題
              </button>
            )
          )}
        </div>

        {filteredAnnouncements.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>
              查無符合「{searchTerm || selectedCategory}」條件的公告紀錄。
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {normalList.map(ann => (
              <div
                key={ann.id}
                className="glass-panel glass-panel-interactive"
                onClick={() => {
                  setSelectedAnn(ann);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1', minWidth: '280px' }}>
                  {/* 🖼️ 列表主視覺縮圖 (未設定時自動隱藏不顯示) */}
                  {ann.imageUrl && (
                    <img src={ann.imageUrl} alt={ann.title} style={{ width: '90px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, border: '1px solid var(--border-glass)' }} />
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-indigo">{ann.category}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} color="var(--accent-cyan)" /> {ann.date}
                      </span>
                      {ann.author && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={13} color="var(--accent-emerald)" /> {ann.author}
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--text-title)', fontWeight: '700', marginBottom: '0.3rem' }}>
                      {ann.title}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ann.content}
                    </p>
                  </div>
                </div>

                <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'center', padding: '0.5rem 1rem' }}>
                  閱讀整頁文章 <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
