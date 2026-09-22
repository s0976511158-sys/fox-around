import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutGrid, Home, Sparkles, Megaphone, Bell, FileText, ClipboardList, 
  Info, Layers, Film, MessageSquareText, BarChart2, Star, Globe, Compass, 
  Shield, ShieldCheck, Zap, Heart, CheckSquare, Smile, Settings, Menu, X, LogOut, Sun, Moon, Award, MoreHorizontal, ChevronDown 
} from 'lucide-react';

export const getLucideIcon = (iconName, DefaultIcon, size = 18) => {
  switch (iconName) {
    case 'LayoutGrid': return <LayoutGrid size={size} />;
    case 'Home': return <Home size={size} />;
    case 'Sparkles': return <Sparkles size={size} />;
    case 'Megaphone': return <Megaphone size={size} />;
    case 'Bell': return <Bell size={size} />;
    case 'FileText': return <FileText size={size} />;
    case 'ClipboardList': return <ClipboardList size={size} />;
    case 'Info': return <Info size={size} />;
    case 'Layers': return <Layers size={size} />;
    case 'Film': return <Film size={size} />;
    case 'MessageSquareText': return <MessageSquareText size={size} />;
    case 'BarChart2': return <BarChart2 size={size} />;
    case 'Star': return <Star size={size} />;
    case 'Globe': return <Globe size={size} />;
    case 'Compass': return <Compass size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'ShieldCheck': return <ShieldCheck size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Heart': return <Heart size={size} />;
    case 'CheckSquare': return <CheckSquare size={size} />;
    case 'Smile': return <Smile size={size} />;
    case 'Settings': return <Settings size={size} />;
    case 'Award': return <Award size={size} />;
    default: return DefaultIcon ? <DefaultIcon size={size} /> : <Sparkles size={size} />;
  }
};

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAdmin, 
    logoutAdmin, 
    openLoginModal,
    openAdminDashboard,
    themeMode,
    toggleThemeMode,
    siteBranding,
    customPages = []
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef(null);
  
  // 隱藏 5 次點擊喚起管理者登入機制 (不顯示提示與 Hover 訊息)
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);

  const baseNavItems = [
    { id: 'home', label: siteBranding.navHomeLabel || '主頁', iconName: siteBranding.navHomeIcon || 'LayoutGrid', defaultIcon: LayoutGrid },
    { id: 'intro', label: siteBranding.navIntroLabel || '介紹 (雙欄輪播)', iconName: siteBranding.navIntroIcon || 'Info', defaultIcon: Info },
    { id: 'announcements', label: siteBranding.navAnnouncementsLabel || '公告專區', iconName: siteBranding.navAnnouncementsIcon || 'Megaphone', defaultIcon: Megaphone },
    { id: 'form', label: siteBranding.navFormLabel || '活動與表單', iconName: siteBranding.navFormIcon || 'FileText', defaultIcon: FileText },
    { id: 'responses', label: siteBranding.navResponsesLabel || '回應表單 (分頁觀看)', iconName: siteBranding.navResponsesIcon || 'MessageSquareText', defaultIcon: MessageSquareText },
    { id: 'sponsors', label: siteBranding.navSponsorsLabel || '贊助廠商', iconName: siteBranding.navSponsorsIcon || 'Award', defaultIcon: Award },
  ];

  const customNavItems = (customPages || []).map(cp => ({
    id: cp.id,
    label: cp.navLabel || cp.pageTitle || '自訂頁面',
    iconName: 'Sparkles',
    defaultIcon: Sparkles
  }));

  const allNavItems = [...baseNavItems, ...customNavItems];

  const [visibleCount, setVisibleCount] = useState(allNavItems.length);
  const navContainerRef = useRef(null);

  // 當全站選單數量改變時重置 visibleCount 為全體數量
  useEffect(() => {
    setVisibleCount(allNavItems.length);
  }, [allNavItems.length]);

  // 動態偵測導覽列項目是否擠到第二行 (Line-wrap / Overflow Detection)
  useEffect(() => {
    const checkOverflow = () => {
      const container = navContainerRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      if (children.length === 0) return;

      const firstTop = children[0].offsetTop;
      let wrapIndex = -1;

      for (let i = 0; i < children.length; i++) {
        // 如果該按鈕的 offsetTop 大於第一行高度，說明已被擠到第二行
        if (children[i].offsetTop > firstTop + 10) {
          wrapIndex = i;
          break;
        }
      }

      if (wrapIndex !== -1) {
        // 移到了第二行，將顯示數量設為 (wrapIndex - 1)，預留空間給「更多」按鈕
        const newCount = Math.max(1, wrapIndex - 1);
        if (newCount !== visibleCount) {
          setVisibleCount(newCount);
        }
      }
    };

    const handleResize = () => {
      setVisibleCount(allNavItems.length);
      setTimeout(checkOverflow, 40);
    };

    checkOverflow();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [allNavItems.length, visibleCount]);

  const visibleNavItems = allNavItems.slice(0, visibleCount);
  const moreNavItems = allNavItems.slice(visibleCount);
  const isMoreActive = moreNavItems.some(item => item.id === activeTab);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 頂部 Logo 點擊處理 (靜默連點 5 次解鎖管理者登入 Modal，登入後點擊直接開啟彈窗)
  const handleLogoClick = () => {
    handleNavClick('home');

    if (isAdmin) {
      openAdminDashboard();
      return;
    }

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      openLoginModal();
      setClickCount(0);
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);
    }
  };

  // 隱藏快捷鍵組合 (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (!isAdmin) {
          openLoginModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, openLoginModal]);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Name (支援自訂 Logo 圖片與品牌名稱，連點 5 次觸發管理者登入) */}
        <div 
          className="nav-brand" 
          onClick={handleLogoClick} 
          style={{ cursor: 'pointer', position: 'relative', userSelect: 'none' }}
          title={siteBranding.name || '首頁'}
        >
          {siteBranding.logoUrl ? (
            <img 
              src={siteBranding.logoUrl} 
              alt={siteBranding.name} 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '8px', 
                objectFit: 'contain',
                background: 'transparent'
              }} 
            />
          ) : (
            <div style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '10px', 
              background: 'var(--gradient-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
            }}>
              <LayoutGrid size={22} color="#fff" />
            </div>
          )}
          <span>{siteBranding.name || 'NEO CMS'}</span>
        </div>

        {/* Desktop Navigation Links (動態偵測折行與滿載) */}
        <nav 
          className="nav-links nav-links-desktop" 
          ref={navContainerRef}
          style={{ flexWrap: 'wrap', overflow: 'hidden', maxHeight: '44px', alignItems: 'center' }}
        >
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {getLucideIcon(item.iconName, item.defaultIcon, 18)}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* 更多 ⋯ 下拉選單 */}
          {moreNavItems.length > 0 && (
            <div ref={moreDropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className={`nav-item-btn ${isMoreActive ? 'active' : ''}`}
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <MoreHorizontal size={18} />
                <span>更多</span>
                <ChevronDown size={14} style={{ transform: moreDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="glass-panel animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    minWidth: '180px',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    zIndex: 100,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  {moreNavItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`nav-item-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem' }}
                      >
                        {getLucideIcon(item.iconName, item.defaultIcon, 16)}
                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <button
              className="nav-item-btn"
              onClick={openAdminDashboard}
              style={{ color: '#818cf8', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: '700' }}
            >
              {getLucideIcon(siteBranding.navAdminIcon, ShieldCheck, 18)}
              <span>{siteBranding.navAdminLabel || '開啟管理者控制台'}</span>
            </button>
          )}
        </nav>

        {/* 右側：白天/暗色模式切換按鈕 & 管理者狀態 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
          
          {/* 白天模式 / 暗色模式 切換按鈕 */}
          <button
            className="theme-toggle-btn"
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? '切換至白天模式' : '切換至暗色模式'}
            aria-label="切換主題模式"
          >
            {themeMode === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {isAdmin && (
            <div className="admin-header-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <button
                className="badge badge-emerald"
                onClick={openAdminDashboard}
                style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.65rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              >
                <ShieldCheck size={13} /> 管理者模式
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={logoutAdmin}
                title="登出管理者模式"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              >
                <LogOut size={13} /> 登出
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          {allNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNavClick(item.id)}
              >
                {getLucideIcon(item.iconName, item.defaultIcon, 20)}
                <span style={{ fontSize: '1.05rem' }}>{item.label}</span>
              </button>
            );
          })}

          <button
            className="nav-item-btn"
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => {
              toggleThemeMode();
              setMobileMenuOpen(false);
            }}
          >
            {themeMode === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
            <span style={{ fontSize: '1.05rem' }}>
              {themeMode === 'dark' ? '切換為白天明亮模式' : '切換為深色夜間模式'}
            </span>
          </button>

          {isAdmin && (
            <>
              <button
                className="nav-item-btn"
                style={{ width: '100%', justifyContent: 'flex-start', color: '#818cf8', fontWeight: '700' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdminDashboard();
                }}
              >
                <ShieldCheck size={20} />
                <span style={{ fontSize: '1.05rem' }}>開啟管理者控制台</span>
              </button>
              <button
                className="nav-item-btn"
                style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutAdmin();
                }}
              >
                <LogOut size={20} />
                <span style={{ fontSize: '1.05rem' }}>登出管理者模式</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
