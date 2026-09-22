import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

import { Settings, Shield, Plus, Trash2, Edit3, Save, RotateCcw, Check, Sparkles, Image as ImageIcon, FileText, Layers, Info, KeyRound, Lock, Eye, EyeOff, LogOut, Tag, Globe, Upload, Link, Film, Sliders, Layout, Star, MousePointer, Filter, Megaphone, Pin, Clock, X, ArrowUp, ArrowDown, Award, Building2 } from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    isAdmin, 
    isAdminDashboardOpen,
    closeAdminDashboard,
    loginAdmin,
    logoutAdmin,
    adminPassword,
    updateAdminPassword,
    siteBranding = {},
    updateSiteBranding,
    featureCards = [],
    addFeatureCard,
    editFeatureCard,
    deleteFeatureCard,
    introCards = [],
    addIntroCard,
    editIntroCard,
    deleteIntroCard,
    categories = [],
    addCategory,
    deleteCategory,
    heroConfig = {}, 
    updateHeroConfig,
    eventInfo = {},
    updateEventInfo,
    announcements = [],
    addAnnouncement,
    editAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    carouselItems = [],
    addCarouselItem,
    editCarouselItem,
    deleteCarouselItem,
    moveCarouselItem,
    showcaseItems = [],
    addShowcaseItem,
    editShowcaseItem,
    deleteShowcaseItem,
    moveShowcaseItem,
    formQuestions = [],
    formResponses = [],
    addFormQuestion,
    editFormQuestion,
    deleteFormQuestion,
    sponsors = [],
    addSponsor,
    editSponsor,
    deleteSponsor,
    customPages = [],
    addCustomPage,
    editCustomPage,
    deleteCustomPage,
    targetEditCarouselItem,
    setTargetEditCarouselItem,
    resetToDefaultData,
    syncAllToCloud
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('page_unified_editor');
  const [selectedEditPage, setSelectedEditPage] = useState('home'); // 'home' | 'announcements' | 'intro' | 'form' | 'responses' | 'sponsors'
  const [homeSubTab, setHomeSubTab] = useState('hero'); // 'hero' | 'carousel' | 'cards' | 'announcements'
  const [formSubTab, setFormSubTab] = useState('settings'); // 'settings' | 'questions'
  const [mediaSubTab, setMediaSubTab] = useState('showcase'); // 'carousel' | 'showcase' | 'categories'
  const [showcaseCategoryFilter, setShowcaseCategoryFilter] = useState('全部');
  const [successMsg, setSuccessMsg] = useState('');

  // Google Firebase 一鍵同步發布狀態
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMsg, setDeployMsg] = useState('');

  const handleDeployFirebase = async () => {
    setIsDeploying(true);
    setDeployMsg('⚡ 正在執行極速增量雲端同步 (僅同步最新的圖文改動)... 請稍候...');
    try {
      const payload = {
        heroConfig,
        eventInfo,
        announcements,
        categories,
        carouselItems,
        showcaseItems,
        formQuestions,
        formResponses,
        sponsors,
        customPages,
        siteBranding,
        featureCards,
        introCards
      };

      // 1. 寫入 Google Cloud Firestore 雲端資料庫
      const cloudRes = await syncAllToCloud(payload);

      // 2. 嘗試在本機環境同時更新發布
      if (import.meta.env.DEV) {
        try {
          const res = await fetch('/__api/deploy-firebase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            await res.json();
          }
        } catch (err) {
          // 靜態 Hosting 環境忽略本機中間件 fetch
        }
      }

      if (cloudRes.success) {
        setDeployMsg('⚡ 恭喜！最新修改的資料已成功同步至 Google 雲端資料庫 (Cloud Firestore)！全站所有裝置已 0 秒即時同步！專屬網址：https://fox-around.web.app');
      } else {
        setDeployMsg(`❌ 雲端發布提示：${cloudRes.error || '請確認網路連線'}`);
      }
    } catch (e) {
      setDeployMsg(`❌ 發布請求錯誤: ${e.message}`);
    } finally {
      setIsDeploying(false);
    }
  };
  
  // 頁面內登入密碼狀態
  const [inputPassword, setInputPassword] = useState('');
  const [showInputPwd, setShowInputPwd] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 品牌名稱與 Logo Form State
  const [brandingForm, setBrandingForm] = useState(siteBranding || {});

  // 統一卡片管理 Form State (使用者需求：介紹卡片在同一個地方編輯，可選是主頁還是介紹的地方)
  const [unifiedCard, setUnifiedCard] = useState({
    title: '',
    location: 'home', // 'home' | 'intro'
    icon: 'Sparkles',
    description: ''
  });
  const [cardFilterLocation, setCardFilterLocation] = useState('all'); // 'all' | 'home' | 'intro'

  // 新增分類 Form State
  const [newCategoryName, setNewCategoryName] = useState('');

  // 修改密碼 Form 狀態
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Hero & Event Form State
  const [heroForm, setHeroForm] = useState(heroConfig || {});
  const [eventForm, setEventForm] = useState(eventInfo || {});

  // New Carousel Item Form State
  const [newCarousel, setNewCarousel] = useState({
    title: '',
    category: (categories && categories[1]) || '科技趨勢',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    gifUrl: '',
    description: '',
    tag: '最新上架',
    badges: ['熱門']
  });

  // New Showcase Item Form State
  const [newShowcase, setNewShowcase] = useState({
    title: '',
    subtitle: '',
    category: '前沿硬體',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    gifUrl: '',
    description: '',
    highlightsText: '支援 8K 畫質, 零延遲體驗'
  });

  // New Question Form State
  const [newQ, setNewQ] = useState({
    title: '',
    type: 'text',
    required: true,
    placeholder: '',
    optionsText: '選項 1, 選項 2, 選項 3',
    hideInResponses: false
  });

  // New Announcement Form State
  const [newAnn, setNewAnn] = useState({
    title: '',
    category: '系統公告',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    content: '',
    isPinned: false,
    author: '系統管理者'
  });

  // Sponsor Form State
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    category: '白金贊助商',
    avatarUrl: '',
    description: '',
    websiteUrl: '',
    tag: '',
    badgesText: '',
    specResolution: '',
    specResponsive: '',
    specTheme: '',
    hideSpecs: false
  });
  const [editingSponsor, setEditingSponsor] = useState(null);

  // Custom Page Form State
  const [newCustomPage, setNewCustomPage] = useState({
    navLabel: '',
    pageBadge: '',
    pageTitle: '',
    pageSubtitle: '',
    showTextModule: true,
    textContent: '',
    showIntroModule: false,
    showFormModule: false,
    showCarouselModule: false
  });
  const [editingCustomPage, setEditingCustomPage] = useState(null);

  // 編輯 Modal 狀態 (使用者需求：每個地方都能編輯，包含表單題目、圖片輪播、介紹展示、卡片與公告)
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [editingShowcase, setEditingShowcase] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // 平滑滾動至編輯表單區域，非強行跳轉至頁面最上方
  const scrollToEditForm = (elementId) => {
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
  };

  useEffect(() => {
    setBrandingForm(siteBranding || {});
  }, [siteBranding]);

  useEffect(() => {
    setHeroForm(heroConfig || {});
  }, [heroConfig]);

  useEffect(() => {
    setEventForm(eventInfo || {});
  }, [eventInfo]);

  // 當從前台或 Lightbox 點擊「編輯圖片」跳轉過來時，自動定位並喚起該項目的編輯表單
  useEffect(() => {
    if (targetEditCarouselItem) {
      setActiveAdminTab('page_unified_editor');
      setSelectedEditPage('home');
      setHomeSubTab('carousel');
      setEditingCarousel(targetEditCarouselItem);
      setTargetEditCarouselItem(null);
    }
  }, [targetEditCarouselItem, setTargetEditCarouselItem]);

  // 監聽各種編輯狀態變更，僅在切換或喚起新編輯項目 (ID 改變) 時滾動一次，避免打字時畫面跳轉
  useEffect(() => {
    if (editingCarousel?.id) scrollToEditForm('edit-form-carousel');
  }, [editingCarousel?.id]);

  useEffect(() => {
    if (editingCard?.id) scrollToEditForm('edit-form-card');
  }, [editingCard?.id]);

  useEffect(() => {
    if (editingShowcase?.id) scrollToEditForm('edit-form-showcase');
  }, [editingShowcase?.id]);

  useEffect(() => {
    if (editingQuestion?.id) scrollToEditForm('edit-form-question');
  }, [editingQuestion?.id]);

  useEffect(() => {
    if (editingSponsor?.id) scrollToEditForm('edit-form-sponsor');
  }, [editingSponsor?.id]);

  useEffect(() => {
    if (editingAnnouncement?.id) scrollToEditForm('edit-form-announcement');
  }, [editingAnnouncement?.id]);

  // 圖片彈窗按鈕連結選擇器 (支援選取現有頁面包含動態自訂頁面與輸入自訂外部網址)
  const renderLinkSelector = (label, value, onChange, placeholder = '例如：intro, form, sponsors 或 https://...') => {
    const knownPageValues = ['home', 'announcements', 'form', 'intro', 'responses', 'sponsors', ...(customPages || []).map(cp => cp.id)];
    const isKnownPage = knownPageValues.includes(value);

    return (
      <div className="form-group" style={{ marginBottom: 0 }}>
        {label && <label className="form-label" style={{ fontWeight: '600' }}>{label}</label>}
        <select
          className="form-control"
          value={isKnownPage ? (value || 'intro') : 'custom_url'}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'custom_url') {
              onChange(value && (value.startsWith('http://') || value.startsWith('https://')) ? value : 'https://');
            } else {
              onChange(val);
            }
          }}
          style={{ marginBottom: !isKnownPage ? '0.5rem' : 0 }}
        >
          <option value="intro">🎬 雙欄介紹頁 (Intro)</option>
          <option value="home">🏠 網站主頁 (Home)</option>
          <option value="form">📝 活動與問卷頁 (Form)</option>
          <option value="announcements">📢 公告專區 (Announcements)</option>
          <option value="responses">📊 問卷回應頁 (Responses)</option>
          <option value="sponsors">🏆 贊助廠商頁 (Sponsors)</option>
          {(customPages || []).map(cp => (
            <option key={cp.id} value={cp.id}>✨ {cp.navLabel || cp.pageTitle} (自訂頁面)</option>
          ))}
          <option value="custom_url">🔗 自訂外部網址 (https://...)</option>
        </select>

        {!isKnownPage && (
          <input
            type="text"
            className="form-control"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const handleSaveEditSponsor = (e) => {
    e.preventDefault();
    if (!editingSponsor || !editingSponsor.name) return;
    const badges = editingSponsor.badgesText !== undefined
      ? editingSponsor.badgesText.split(',').map(s => s.trim()).filter(Boolean)
      : (editingSponsor.badges || []);
    editSponsor(editingSponsor.id, {
      ...editingSponsor,
      badges
    });
    setEditingSponsor(null);
    showToast('⚡ 已儲存！已自動擷取【贊助廠商】進行局部雲端同步');
  };

  const handleAddCustomPage = (e) => {
    e.preventDefault();
    if (!newCustomPage.pageTitle) return;
    addCustomPage(newCustomPage);
    setNewCustomPage({
      navLabel: '',
      pageBadge: '',
      pageTitle: '',
      pageSubtitle: '',
      showTextModule: true,
      textContent: '',
      showIntroModule: false,
      showFormModule: false,
      showCarouselModule: false
    });
    showToast('✨ 建立成功！已自動擷取【自訂頁面】進行局部雲端同步');
  };

  const handleSaveEditCustomPage = (e) => {
    e.preventDefault();
    if (!editingCustomPage || !editingCustomPage.pageTitle) return;
    editCustomPage(editingCustomPage.id, editingCustomPage);
    setEditingCustomPage(null);
    showToast('⚡ 已儲存！已自動擷取【自訂頁面】進行局部雲端同步');
  };

  // 處理編輯 Carousel 保存 (包含彈窗小標籤與規格欄位)
  const handleSaveEditCarousel = (e) => {
    e.preventDefault();
    if (!editingCarousel || !editingCarousel.id) return;
    const badges = editingCarousel.badgesText !== undefined
      ? editingCarousel.badgesText.split(',').map(s => s.trim()).filter(Boolean)
      : (editingCarousel.badges || []);
    editCarouselItem(editingCarousel.id, {
      ...editingCarousel,
      badges
    });
    setEditingCarousel(null);
    showToast('⚡ 已儲存！已自動擷取【圖片輪播】進行局部雲端同步');
  };

  // 處理編輯 Showcase 保存
  const handleSaveEditShowcase = (e) => {
    e.preventDefault();
    if (!editingShowcase || !editingShowcase.id) return;
    const highlights = editingShowcase.highlightsText
      ? editingShowcase.highlightsText.split(',').map(s => s.trim()).filter(Boolean)
      : (editingShowcase.highlights || []);
    const badges = editingShowcase.badgesText !== undefined
      ? editingShowcase.badgesText.split(',').map(s => s.trim()).filter(Boolean)
      : (editingShowcase.badges || []);
    editShowcaseItem(editingShowcase.id, {
      ...editingShowcase,
      highlights,
      badges
    });
    setEditingShowcase(null);
    showToast('⚡ 已儲存！已自動擷取【介紹展示】進行局部雲端同步');
  };

  // 處理編輯 Question 保存
  const handleSaveEditQuestion = (e) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.id) return;
    let options = undefined;
    if (editingQuestion.type === 'radio' && editingQuestion.optionsText) {
      options = editingQuestion.optionsText.split(',').map(s => s.trim()).filter(Boolean);
    }
    editFormQuestion(editingQuestion.id, {
      ...editingQuestion,
      options
    });
    setEditingQuestion(null);
    showToast('⚡ 已儲存！已自動擷取【問卷題目】進行局部雲端同步');
  };

  // 處理編輯 Card 保存
  const handleSaveEditCard = (e) => {
    e.preventDefault();
    if (!editingCard || !editingCard.id) return;

    if (editingCard.originalLocation === editingCard.targetLocation) {
      if (editingCard.targetLocation === 'home') {
        editFeatureCard(editingCard.id, editingCard);
      } else {
        editIntroCard(editingCard.id, editingCard);
      }
    } else {
      if (editingCard.originalLocation === 'home') {
        deleteFeatureCard(editingCard.id);
        addIntroCard({
          title: editingCard.title,
          icon: editingCard.icon,
          description: editingCard.description
        });
      } else {
        deleteIntroCard(editingCard.id);
        addFeatureCard({
          title: editingCard.title,
          icon: editingCard.icon,
          description: editingCard.description
        });
      }
    }
    setEditingCard(null);
    showToast('⚡ 已儲存！已自動擷取【區塊卡片】進行局部雲端同步');
  };

  // 處理編輯 Announcement 保存
  const handleSaveEditAnnouncement = (e) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.id) return;
    editAnnouncement(editingAnnouncement.id, editingAnnouncement);
    setEditingAnnouncement(null);
    showToast('⚡ 已儲存！已自動擷取【網站公告】進行局部雲端同步');
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    addAnnouncement(newAnn);
    setNewAnn({
      title: '',
      category: '系統公告',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      content: '',
      isPinned: false,
      author: '系統管理者'
    });
    showToast('📢 公告已發布！已自動擷取【網站公告】進行局部雲端同步');
  };

  // 本地圖片 Canvas 高效微型壓縮工具函式 (確保 Base64 絕不超過伺服器上限)
  const compressImage = (file, maxWidth = 900, quality = 0.70) => {
    return new Promise((resolve, reject) => {
      // 檔案小於 100KB 直接讀取不重壓
      if (file.size <= 100 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      // 動態 GIF 檔案（不論檔案大小）絕不可經過 Canvas，因為 Canvas 轉繪會將多幀動態 GIF 變為單幀靜態照片！
      const isGif = file.type === 'image/gif' || (file.name && file.name.toLowerCase().endsWith('.gif'));
      if (isGif) {
        if (file.size > 2.5 * 1024 * 1024) {
          alert(`⚠️ 注意：您上傳的 GIF 動畫檔案容量較大 (${(file.size / (1024 * 1024)).toFixed(1)}MB)！若雲端同步失敗，請先將 GIF 壓縮至 2.5MB 以下，或直接貼上網路 GIF 網址。`);
        }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (file.type === 'image/png') {
            ctx.clearRect(0, 0, width, height);
          } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // 通用本地檔案上傳 (採用智慧 Canvas 超微壓縮，直接經由 GitHub 雲端資料庫即時同步)
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片或 GIF 格式的檔案 (JPG, PNG, GIF, WebP)');
      return;
    }

    try {
      showToast('⏳ 正在智慧優化壓縮圖片中...');
      const compressedDataUrl = await compressImage(file);
      callback(compressedDataUrl);
      showToast('⚡ 圖片已成功優化壓縮！儲存後將經由 GitHub 雲端資料庫跨裝置即時同步。');
    } catch (err) {
      console.error('圖片壓縮失敗，改用原圖讀取:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        callback(event.target.result);
        showToast('📁 已讀取本地圖片檔案！');
      };
      reader.readAsDataURL(file);
    }
  };

  // 處理內頁密碼登入
  const handlePageLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(inputPassword);
    if (res.success) {
      setInputPassword('');
      showToast('🔑 密碼驗證成功！管理者後台已解鎖。');
    } else {
      setLoginError(res.message);
    }
  };

  // 處理品牌與 Logo 儲存
  const handleSaveBranding = (e) => {
    e.preventDefault();
    updateSiteBranding(brandingForm);
    showToast('⚡ 已儲存！已自動擷取【品牌 Title 與 Logo】進行局部雲端同步');
  };

  // 處理統一卡片新增 (選擇主頁或介紹頁)
  const handleAddUnifiedCard = (e) => {
    e.preventDefault();
    if (!unifiedCard.title || !unifiedCard.description) return;

    if (unifiedCard.location === 'home') {
      addFeatureCard({
        title: unifiedCard.title,
        icon: unifiedCard.icon,
        description: unifiedCard.description
      });
      showToast('✨ 已新增！已自動擷取【主頁卡片】進行局部雲端同步');
    } else {
      addIntroCard({
        title: unifiedCard.title,
        icon: unifiedCard.icon,
        description: unifiedCard.description
      });
      showToast('✨ 已新增！已自動擷取【介紹頁卡片】進行局部雲端同步');
    }

    setUnifiedCard({ title: '', location: 'home', icon: 'Sparkles', description: '' });
  };

  // 處理新增主題分類
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const ok = addCategory(newCategoryName);
    if (ok) {
      setNewCategoryName('');
      showToast(`🏷️ 成功新增主題分類：「${newCategoryName.trim()}」並局部同步至雲端`);
    } else {
      alert('該分類名稱已存在或無效！');
    }
  };

  // 處理修改密碼
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdError('');
    if (!newPassword || newPassword.length < 4) {
      setPwdError('新密碼長度至少需 4 個字元');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('兩次輸入的新密碼不一致');
      return;
    }

    updateAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    showToast('🔒 管理者密碼已成功更新！');
  };

  // 處理 Hero 與 Event 儲存
  const handleSaveHeroEvent = (e) => {
    e.preventDefault();
    const hForm = heroForm || {};
    const hCfg = heroConfig || {};
    const updatedHero = {
      ...hForm,
      title: hForm.heroTitle !== undefined ? hForm.heroTitle : (hForm.title !== undefined ? hForm.title : hCfg.title),
      heroTitle: hForm.heroTitle !== undefined ? hForm.heroTitle : (hForm.title !== undefined ? hForm.title : hCfg.title),
      subtitle: hForm.heroSubtitle !== undefined ? hForm.heroSubtitle : (hForm.subtitle !== undefined ? hForm.subtitle : hCfg.subtitle),
      heroSubtitle: hForm.heroSubtitle !== undefined ? hForm.heroSubtitle : (hForm.subtitle !== undefined ? hForm.subtitle : hCfg.subtitle),
      imageUrl: hForm.heroBannerUrl !== undefined ? hForm.heroBannerUrl : (hForm.imageUrl !== undefined ? hForm.imageUrl : hCfg.imageUrl),
      heroBannerUrl: hForm.heroBannerUrl !== undefined ? hForm.heroBannerUrl : (hForm.imageUrl !== undefined ? hForm.imageUrl : hCfg.imageUrl),
      opacity: hForm.heroOverlayOpacity !== undefined ? hForm.heroOverlayOpacity : (hForm.opacity !== undefined ? hForm.opacity : (hCfg.opacity !== undefined ? hCfg.opacity : 0.45)),
      heroOverlayOpacity: hForm.heroOverlayOpacity !== undefined ? hForm.heroOverlayOpacity : (hForm.opacity !== undefined ? hForm.opacity : (hCfg.heroOverlayOpacity !== undefined ? hCfg.heroOverlayOpacity : 0.45))
    };
    setHeroForm(updatedHero);
    updateHeroConfig(updatedHero);
    updateEventInfo(eventForm || {});
    showToast('⚡ 已儲存！已自動擷取【主頁視覺與區塊文字】進行局部雲端同步');
  };

  // 新增 Carousel 項目
  const handleAddCarousel = (e) => {
    e.preventDefault();
    if (!newCarousel.title || !newCarousel.imageUrl) return;
    const badges = newCarousel.badgesText
      ? newCarousel.badgesText.split(',').map(s => s.trim()).filter(Boolean)
      : (newCarousel.badges || ['熱門']);
    addCarouselItem({
      ...newCarousel,
      badges
    });
    setNewCarousel({
      title: '',
      category: categories[1] || '科技趨勢',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      gifUrl: '',
      description: '',
      tag: '最新上架',
      badges: ['熱門'],
      badgesText: '熱門'
    });
    showToast('✅ 成功新增圖片輪播項目！');
  };

  // 新增 Showcase 項目
  const handleAddShowcase = (e) => {
    e.preventDefault();
    if (!newShowcase.title || !newShowcase.imageUrl) return;
    
    const highlights = newShowcase.highlightsText.split(',').map(s => s.trim()).filter(Boolean);

    addShowcaseItem({
      ...newShowcase,
      highlights
    });
    setNewShowcase({
      title: '',
      subtitle: '',
      category: '前沿硬體',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      gifUrl: '',
      description: '',
      highlightsText: '支援 8K 畫質, 零延遲體驗'
    });
    showToast('✅ 成功新增介紹頁面展示項目！');
  };



  // 新增表單題目
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQ.title) return;

    let options = [];
    if (newQ.type === 'radio') {
      options = newQ.optionsText.split(',').map(s => s.trim()).filter(Boolean);
    }

    addFormQuestion({
      title: newQ.title,
      type: newQ.type,
      required: newQ.required,
      placeholder: newQ.placeholder,
      options: options.length > 0 ? options : undefined,
      hideInResponses: newQ.hideInResponses || false
    });

    setNewQ({
      title: '',
      type: 'text',
      required: true,
      placeholder: '',
      optionsText: '選項 1, 選項 2, 選項 3',
      hideInResponses: false
    });
    showToast('✅ 成功新增動態表單題目！');
  };

  // 組合全站所有介紹卡片 (標記位置為 home 或 intro)
  const combinedCards = [
    ...(featureCards || []).map(c => ({ ...c, targetLocation: 'home' })),
    ...(introCards || []).map(c => ({ ...c, targetLocation: 'intro' }))
  ];

  const filteredCombinedCards = combinedCards.filter(c => {
    if (cardFilterLocation === 'all') return true;
    return c.targetLocation === cardFilterLocation;
  });

  // 彈窗未開啟時，絕對不渲染任何 HTML (避免出現在網頁底部)
  if (!isAdminDashboardOpen) return null;

  // 未驗證身份時彈出簡潔解鎖畫面
  if (!isAdmin) {
    return (
      <div className="modal-backdrop" onClick={closeAdminDashboard} style={{ zIndex: 9999, overflowY: 'auto', padding: '1.5rem 0' }}>
        <div 
          className="glass-panel animate-fade-in" 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            maxWidth: '500px', 
            width: '90%', 
            margin: '8vh auto',
            position: 'relative',
            background: 'rgba(11, 15, 25, 0.97)',
            border: '1.5px solid var(--border-glass-bright)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <button 
            className="modal-close-btn" 
            onClick={closeAdminDashboard} 
            aria-label="關閉"
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 100 }}
          >
            <X size={20} />
          </button>

          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 0 25px rgba(236, 72, 153, 0.3)' }}>
            <Lock size={32} />
          </div>

          <span className="badge badge-pink" style={{ marginBottom: '0.75rem', fontSize: '0.82rem' }}>
            🔒 管理者身份解鎖
          </span>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-title)', fontWeight: '800', marginBottom: '0.5rem' }}>
            管理者通行驗證
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
            請輸入管理者授權密碼以開啟後台管理控制面板。
          </p>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handlePageLogin} style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <label className="form-label">
                <span>管理者授權密碼</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showInputPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="請輸入密碼..."
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.8rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowInputPwd(!showInputPwd)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showInputPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>
              <KeyRound size={18} />
              確認解鎖管理者面板
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={closeAdminDashboard} style={{ zIndex: 9999, overflowY: 'auto', padding: '1.5rem 0' }}>
      <div 
        className="glass-panel animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1280px',
          width: '95%',
          margin: '0 auto',
          position: 'relative',
          padding: '2.5rem 2rem',
          background: 'rgba(11, 15, 25, 0.97)',
          border: '1.5px solid var(--border-glass-bright)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <button 
          className="modal-close-btn" 
          onClick={closeAdminDashboard} 
          aria-label="關閉管理者控制台"
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100 }}
        >
          <X size={22} />
        </button>

        {/* 頂部頁頭說明 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
              <Shield size={12} /> 🔐 管理者控制中心 (彈窗管理模式)
            </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800' }}>
            管理者專屬工作台 (Admin Console)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            專屬獨立管理區：左欄垂直導覽選單可滑動切換品牌標籤、最新與歷年公告發布、卡片集中管理等 8 大核心模組。
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={logoutAdmin}>
            <LogOut size={14} /> 退出管理者模式
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => {
            if (window.confirm('確定要將全站資料重置為預設範例資料嗎？')) {
              resetToDefaultData();
              showToast('已恢復預設範例資料');
            }
          }}>
            <RotateCcw size={14} /> 重置為預設種子資料
          </button>
        </div>
      </div>

      {/* Toast 提示訊息 */}
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', color: '#059669', padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: '600' }}>
          {successMsg}
        </div>
      )}

      {/* 🏢 使用者需求 2：管理者頁面改為左側垂直欄 (Sidebar Layout) 往下滑看更多 */}
      <div className="admin-layout-container">
        {/* 左側垂直選單欄 (Sidebar) */}
        <aside className="admin-sidebar glass-panel">
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            後台控制選單
          </div>
          <nav className="admin-sidebar-nav">
            <button 
              className={`admin-sidebar-btn ${activeAdminTab === 'page_unified_editor' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('page_unified_editor')}
              style={{ fontWeight: '700' }}
            >
              <Layout size={18} color="var(--accent-pink)" />
              <span>頁面版面編輯</span>
            </button>

            <button 
              className={`admin-sidebar-btn ${activeAdminTab === 'custom_pages' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('custom_pages')}
              style={{ fontWeight: '700' }}
            >
              <Sparkles size={18} color="var(--accent-cyan)" />
              <span>自訂頁面與選單管理</span>
            </button>

            <button 
              className={`admin-sidebar-btn ${activeAdminTab === 'branding_footer' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('branding_footer')}
            >
              <Globe size={18} />
              <span>網頁基本設定</span>
            </button>

            <button 
              className={`admin-sidebar-btn ${activeAdminTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('announcements')}
            >
              <Megaphone size={18} />
              <span>公告發布與歷史消息</span>
            </button>

            <button 
              className={`admin-sidebar-btn ${activeAdminTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('security')}
            >
              <KeyRound size={18} />
              <span>密碼權限與安全設定</span>
            </button>
          </nav>
        </aside>

        <main style={{ minWidth: 0 }}>
          
          {/* TAB 0: 全站頁面版面與詳細文字統一編輯中心 (使用者需求：所有頁面編輯統整在一起，可以選要編輯哪個頁面的版面與詳細文字) */}
          {activeAdminTab === 'page_unified_editor' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* 🎯 頁面選擇卡片列 */}
              <div className="glass-panel" style={{ padding: '2rem', border: '2px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.05)', boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span className="badge badge-cyan" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <Sparkles size={14} /> ⚡ 雲端極速局部同步已整合至每一次儲存
                    </span>
                    <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-title)' }}>
                      管理者控制中心
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.3rem', maxWidth: '750px', lineHeight: '1.6' }}>
                      💡 <b>無需額外點擊全站同步按鈕！</b> 當您在底下任何區塊點擊「儲存 / 發布 / 新增」時，系統皆會<b>自動將最新修改同步至本地儲存</b>，完全不會影響其他內容。
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid rgba(16, 185, 129, 0.4)', padding: '0.75rem 1.4rem', borderRadius: 'var(--radius-full)', color: '#10b981', fontWeight: '800', fontSize: '0.92rem', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)' }}>
                    <Check size={20} /> 本地儲存即時連動中
                  </div>
                </div>

                {deployMsg && (
                  <div style={{
                    padding: '1rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: deployMsg.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: deployMsg.includes('✅') ? '2px solid var(--accent-emerald)' : '2px solid #ef4444',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.98rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}>
                    {deployMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedEditPage('home')}
                    style={{
                      padding: '1.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEditPage === 'home' ? '2.5px solid var(--accent-pink)' : '1px solid var(--border-glass)',
                      background: selectedEditPage === 'home' ? 'rgba(236, 72, 153, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedEditPage === 'home' ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      transform: selectedEditPage === 'home' ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedEditPage === 'home' ? '0 0 20px rgba(236, 72, 153, 0.3)' : 'none'
                    }}
                  >
                    <Globe size={28} color={selectedEditPage === 'home' ? 'var(--accent-pink)' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>🏠 網站主頁</span>
                    <span style={{ fontSize: '0.78rem', color: selectedEditPage === 'home' ? '#fbcfe8' : 'var(--text-muted)' }}>Hero 視覺 / 活動 / 區塊標題</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEditPage('announcements')}
                    style={{
                      padding: '1.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEditPage === 'announcements' ? '2.5px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                      background: selectedEditPage === 'announcements' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedEditPage === 'announcements' ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      transform: selectedEditPage === 'announcements' ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedEditPage === 'announcements' ? '0 0 20px rgba(56, 189, 248, 0.3)' : 'none'
                    }}
                  >
                    <Megaphone size={28} color={selectedEditPage === 'announcements' ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>📢 公告專區</span>
                    <span style={{ fontSize: '0.78rem', color: selectedEditPage === 'announcements' ? '#bae6fd' : 'var(--text-muted)' }}>頁頭文字 / 新發布 / 歷史紀錄</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEditPage('intro')}
                    style={{
                      padding: '1.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEditPage === 'intro' ? '2.5px solid var(--accent-pink)' : '1px solid var(--border-glass)',
                      background: selectedEditPage === 'intro' ? 'rgba(236, 72, 153, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedEditPage === 'intro' ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      transform: selectedEditPage === 'intro' ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedEditPage === 'intro' ? '0 0 20px rgba(236, 72, 153, 0.3)' : 'none'
                    }}
                  >
                    <Film size={28} color={selectedEditPage === 'intro' ? 'var(--accent-pink)' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>🎬 雙欄介紹頁</span>
                    <span style={{ fontSize: '0.78rem', color: selectedEditPage === 'intro' ? '#fbcfe8' : 'var(--text-muted)' }}>標籤與標題 / 雙欄動態展示</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEditPage('form')}
                    style={{
                      padding: '1.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEditPage === 'form' ? '2.5px solid var(--accent-emerald)' : '1px solid var(--border-glass)',
                      background: selectedEditPage === 'form' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedEditPage === 'form' ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      transform: selectedEditPage === 'form' ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedEditPage === 'form' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  >
                    <FileText size={28} color={selectedEditPage === 'form' ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>📝 活動與問卷頁</span>
                    <span style={{ fontSize: '0.78rem', color: selectedEditPage === 'form' ? '#a7f3d0' : 'var(--text-muted)' }}>頁頭說明 / 活動目的 / 題目設定</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEditPage('responses')}
                    style={{
                      padding: '1.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEditPage === 'responses' ? '2.5px solid #818cf8' : '1px solid var(--border-glass)',
                      background: selectedEditPage === 'responses' ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedEditPage === 'responses' ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      transform: selectedEditPage === 'responses' ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedEditPage === 'responses' ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none'
                    }}
                  >
                    <Layers size={28} color={selectedEditPage === 'responses' ? '#818cf8' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>問卷回應頁</span>
                    <span style={{ fontSize: '0.78rem', color: selectedEditPage === 'responses' ? '#c7d2fe' : 'var(--text-muted)' }}>標題與說明 / 數據控制</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEditPage('sponsors')}
                    style={{
                      padding: '1.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEditPage === 'sponsors' ? '2.5px solid var(--accent-amber)' : '1px solid var(--border-glass)',
                      background: selectedEditPage === 'sponsors' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedEditPage === 'sponsors' ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      transform: selectedEditPage === 'sponsors' ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedEditPage === 'sponsors' ? '0 0 20px rgba(245, 158, 11, 0.4)' : 'none'
                    }}
                  >
                    <Award size={28} color={selectedEditPage === 'sponsors' ? '#fbbf24' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>贊助廠商頁</span>
                    <span style={{ fontSize: '0.78rem', color: selectedEditPage === 'sponsors' ? '#fde68a' : 'var(--text-muted)' }}>頁頭標題 / 廠商頭像與簡介</span>
                  </button>
                </div>
              </div>

              {/* 1️⃣ 編輯【網站主頁】面板 */}
              {selectedEditPage === 'home' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* 主頁內容編輯 Sub-Tabs */}
                  <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.04)' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-title)', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Globe size={16} color="var(--accent-pink)" />
                      主頁內容編輯區塊選單：
                    </span>
                    <button 
                      type="button"
                      className={`btn btn-sm ${homeSubTab === 'hero' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setHomeSubTab('hero')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      🏠 Hero 視覺與區塊標題
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${homeSubTab === 'carousel' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setHomeSubTab('carousel')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      🖼️ 圖片輪播藝廊編輯
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${homeSubTab === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setHomeSubTab('cards')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      ✨ 特色與技術卡片編輯
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${homeSubTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setHomeSubTab('announcements')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      📌 主頁精選公告展區
                    </button>
                  </div>

                  {/* 1. Hero 視覺與文字區塊 */}
                  {homeSubTab === 'hero' && (
                    <form onSubmit={handleSaveHeroEvent} className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe color="var(--accent-pink)" size={22} />
                        🏠 網站主頁：Hero 視覺、背景圖案、遮罩透明度與區塊標題
                      </h3>

                      <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                          🏷️ 主頁 Hero 頂部標籤文字
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={heroForm.heroBadge || ''}
                          onChange={(e) => setHeroForm({ ...heroForm, heroBadge: e.target.value })}
                          placeholder="例如：2026 全方位動態 CMS 平台"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">🏠 主頁 Hero 大標題</label>
                        <input
                          type="text"
                          className="form-control"
                          value={heroForm.heroTitle !== undefined ? heroForm.heroTitle : (heroForm.title || '')}
                          onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value, title: e.target.value })}
                          placeholder="例如：開啟您的極致響應式內容管理體驗"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">📝 主頁 Hero 副標題與說明文字</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={heroForm.heroSubtitle !== undefined ? heroForm.heroSubtitle : (heroForm.subtitle || '')}
                          onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value, subtitle: e.target.value })}
                          placeholder="例如：輕鬆自訂最新活動內容..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">🖼️ 主頁 Hero 背景圖片網址 (選填)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                            <Upload size={16} /> 📁 上傳電腦中的 Hero 背景圖片
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, (url) => setHeroForm({ ...heroForm, heroBannerUrl: url, imageUrl: url }))}
                            />
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={heroForm.heroBannerUrl !== undefined ? heroForm.heroBannerUrl : (heroForm.imageUrl || '')}
                            onChange={(e) => setHeroForm({ ...heroForm, heroBannerUrl: e.target.value, imageUrl: e.target.value })}
                            placeholder="例如：https://images.unsplash.com/..."
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">🌫️ 背景暗化遮罩透明度 (0 ~ 1.0)</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={heroForm.heroOverlayOpacity !== undefined ? heroForm.heroOverlayOpacity : (heroForm.opacity !== undefined ? heroForm.opacity : 0.45)}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setHeroForm({ ...heroForm, heroOverlayOpacity: val, opacity: val });
                          }}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          當前暗化數值：{heroForm.heroOverlayOpacity !== undefined ? heroForm.heroOverlayOpacity : (heroForm.opacity !== undefined ? heroForm.opacity : 0.45)}
                        </span>
                      </div>

                      {/* 🔘 自訂按鈕文字與跳轉連結 */}
                      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1.5px solid var(--accent-indigo)', background: 'rgba(99, 102, 241, 0.03)' }}>
                        <h4 style={{ color: 'var(--text-title)', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MousePointer size={18} color="var(--accent-indigo)" />
                          🔘 主頁 Hero 按鈕文字與跳轉頁面自訂
                        </h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-indigo)' }}>
                              主要按鈕 (按鈕一) 顯示文字
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={heroForm.ctaText !== undefined ? heroForm.ctaText : '立即參與體驗表單'}
                              onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                              placeholder="例如：立即參與體驗表單"
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">主要按鈕 (按鈕一) 點擊跳轉頁面</label>
                            <select
                              className="form-control"
                              value={heroForm.ctaLink || 'form'}
                              onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
                            >
                              <option value="home">🏠 網站主頁 (Home)</option>
                              <option value="form">📝 活動與問卷頁 (Form)</option>
                              <option value="intro">🎬 雙欄介紹頁 (Intro)</option>
                              <option value="announcements">📢 公告專區 (Announcements)</option>
                              <option value="responses">📊 問卷回應頁 (Responses)</option>
                              <option value="sponsors">🏆 贊助廠商頁 (Sponsors)</option>
                              {customPages.map(cp => (
                                <option key={cp.id} value={cp.id}>✨ {cp.navLabel || cp.pageTitle} (自訂頁面)</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>
                              次要按鈕 (按鈕二) 顯示文字
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={heroForm.ctaSecondaryText !== undefined ? heroForm.ctaSecondaryText : (heroForm.secondaryCtaText || '觀看雙欄動態介紹')}
                              onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value, secondaryCtaText: e.target.value })}
                              placeholder="例如：觀看雙欄動態介紹"
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">次要按鈕 (按鈕二) 點擊跳轉頁面</label>
                            <select
                              className="form-control"
                              value={heroForm.secondaryCtaLink || heroForm.ctaSecondaryLink || 'intro'}
                              onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLink: e.target.value, ctaSecondaryLink: e.target.value })}
                            >
                              <option value="home">🏠 網站主頁 (Home)</option>
                              <option value="intro">🎬 雙欄介紹頁 (Intro)</option>
                              <option value="form">📝 活動與問卷頁 (Form)</option>
                              <option value="announcements">📢 公告專區 (Announcements)</option>
                              <option value="responses">📊 問卷回應頁 (Responses)</option>
                              <option value="sponsors">🏆 贊助廠商頁 (Sponsors)</option>
                              {customPages.map(cp => (
                                <option key={cp.id} value={cp.id}>✨ {cp.navLabel || cp.pageTitle} (自訂頁面)</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                              圖片彈出視窗主要按鈕 (Modal 按鈕) 顯示文字
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={heroForm.modalActionBtnText !== undefined ? heroForm.modalActionBtnText : '前往介紹頁觀看雙欄動態'}
                              onChange={(e) => setHeroForm({ ...heroForm, modalActionBtnText: e.target.value })}
                              placeholder="例如：前往介紹頁觀看雙欄動態"
                            />
                          </div>

                          {renderLinkSelector(
                            '圖片彈出視窗主要按鈕 點擊跳轉頁面 / 網址',
                            heroForm.modalActionBtnLink || 'intro',
                            (val) => setHeroForm({ ...heroForm, modalActionBtnLink: val })
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>
                              圖片彈出視窗次要按鈕 顯示文字 (選填)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={heroForm.modalSecondaryBtnText || ''}
                              onChange={(e) => setHeroForm({ ...heroForm, modalSecondaryBtnText: e.target.value })}
                              placeholder="例如：下載簡報 / 索取資料"
                            />
                          </div>

                          {renderLinkSelector(
                            '圖片彈出視窗次要按鈕 跳轉頁面 / 網址',
                            heroForm.modalSecondaryBtnLink || '',
                            (val) => setHeroForm({ ...heroForm, modalSecondaryBtnLink: val })
                          )}
                        </div>

                        <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: '700' }}>
                            圖片彈出視窗【關閉】按鈕自訂文字
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={heroForm.modalCloseBtnText || '關閉'}
                            onChange={(e) => setHeroForm({ ...heroForm, modalCloseBtnText: e.target.value })}
                            placeholder="例如：關閉"
                          />
                        </div>
                      </div>


                      <button type="submit" className="btn btn-primary">
                        <Save size={18} /> 儲存主頁視覺與區塊文字設定
                      </button>
                    </form>
                  )}

                  {/* 2. 圖片輪播藝廊編輯 (整合進網站主頁版面編輯) */}
                  {homeSubTab === 'carousel' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {/* 自訂「互動視覺藝廊輪播」大標題與說明文字區塊 */}
                      <div className="glass-panel" style={{ padding: '2rem', border: '1.5px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.03)' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Sparkles color="var(--accent-cyan)" size={20} />
                          自訂「互動視覺藝廊輪播」大標題與說明文字
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>輪播區塊大標題</label>
                            <input
                              type="text"
                              className="form-control"
                              value={heroForm.carouselSectionTitle !== undefined ? heroForm.carouselSectionTitle : '互動視覺藝廊輪播'}
                              onChange={(e) => setHeroForm({ ...heroForm, carouselSectionTitle: e.target.value })}
                              placeholder="例如：互動視覺藝廊輪播"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>輪播區塊副標題 / 提示說明</label>
                            <input
                              type="text"
                              className="form-control"
                              value={heroForm.carouselSectionSubtitle !== undefined ? heroForm.carouselSectionSubtitle : '滑鼠移至圖片上方可暫停輪播，自動切換至 GIF 動畫並微距放大，點擊圖片開啟全尺寸詳細內容。'}
                              onChange={(e) => setHeroForm({ ...heroForm, carouselSectionSubtitle: e.target.value })}
                              placeholder="例如：滑鼠移至圖片上方可暫停輪播..."
                            />
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            updateHeroConfig(heroForm);
                            showToast('✨ 已成功更新「互動視覺藝廊輪播」標題與說明文字！');
                          }}
                        >
                          <Save size={16} /> 儲存輪播區塊標題文字設定
                        </button>
                      </div>

                      {/* 編輯 / 新增 輪播 */}
                      {editingCarousel ? (
                        <div id="edit-form-carousel" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.04)', boxShadow: '0 0 35px rgba(56, 189, 248, 0.15)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <span className="badge badge-cyan" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                                ✏️ 輪播項目編輯中
                              </span>
                              <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                                編輯輪播圖片項目：「{editingCarousel.title}」
                              </h3>
                            </div>
                            <button className="btn btn-secondary" onClick={() => setEditingCarousel(null)}>
                              <RotateCcw size={16} /> 關閉編輯並返回
                            </button>
                          </div>

                          <form onSubmit={handleSaveEditCarousel}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                                    🖼️ 展示圖片實時高解析預覽
                                  </label>
                                  <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000', position: 'relative' }}>
                                    {editingCarousel.imageUrl ? (
                                      <img src={editingCarousel.imageUrl} alt="圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>無圖片</div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>
                                    🎞️ GIF 動畫懸停實時播映預覽 (選填)
                                  </label>
                                  <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000', position: 'relative' }}>
                                    {editingCarousel.gifUrl ? (
                                      <img src={editingCarousel.gifUrl} alt="GIF預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>未設定 GIF 動畫 (懸停時顯示原靜態主圖)</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group">
                                  <label className="form-label">項目標題</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingCarousel.title || ''}
                                    onChange={(e) => setEditingCarousel({ ...editingCarousel, title: e.target.value })}
                                    required
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">選擇主題分類 (藍紫色小標籤)</label>
                                  <select
                                    className="form-control"
                                    value={editingCarousel.category || ''}
                                    onChange={(e) => setEditingCarousel({ ...editingCarousel, category: e.target.value })}
                                  >
                                    {categories.filter(c => c !== '全部').map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="form-group">
                                  <label className="form-label">🏷️ 彈窗主標籤 (粉紅小標籤，例如：最新上架 / 賽博朋克)</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="例如：最新上架"
                                    value={editingCarousel.tag || ''}
                                    onChange={(e) => setEditingCarousel({ ...editingCarousel, tag: e.target.value })}
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">🏷️ 彈窗副標籤清單 (青色小標籤，逗點分隔，例如：熱門展件, 4K超高清)</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="例如：熱門展件, 4K超高清, 獨家"
                                    value={editingCarousel.badgesText !== undefined ? editingCarousel.badgesText : (editingCarousel.badges || []).join(', ')}
                                    onChange={(e) => setEditingCarousel({ ...editingCarousel, badgesText: e.target.value })}
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">展示圖片檔 (從電腦更換 或 輸入網址)</label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                      <Upload size={16} /> 📁 從電腦選擇新圖片檔案
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(e, (url) => setEditingCarousel({ ...editingCarousel, imageUrl: url }))}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="https://..."
                                      value={editingCarousel.imageUrl || ''}
                                      onChange={(e) => setEditingCarousel({ ...editingCarousel, imageUrl: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="form-group">
                                  <label className="form-label">GIF 動畫圖檔 (選填，移入懸停時播放)</label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                      <Film size={16} /> 📁 從電腦選擇新 GIF 動畫檔案
                                      <input
                                        type="file"
                                        accept="image/gif"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(e, (url) => setEditingCarousel({ ...editingCarousel, gifUrl: url }))}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="GIF 網址 (Giphy)"
                                      value={editingCarousel.gifUrl || ''}
                                      onChange={(e) => setEditingCarousel({ ...editingCarousel, gifUrl: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <div className="form-group">
                                 <div style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-indigo)', marginTop: '0.75rem' }}>
                                   <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-indigo)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                     <MousePointer size={16} />
                                     🔘 圖片彈窗按鈕自訂 (自訂按鈕文字與跳轉連結)
                                   </label>
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <input
                                        type="checkbox"
                                        id={`showActionBtn_${editingCarousel.id}`}
                                        checked={editingCarousel.showActionBtn !== false}
                                        onChange={(e) => setEditingCarousel({ ...editingCarousel, showActionBtn: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
                                      />
                                      <label htmlFor={`showActionBtn_${editingCarousel.id}`} style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                                        顯示彈窗主要按鈕 (預設開啟)
                                      </label>
                                    </div>

                                    {editingCarousel.showActionBtn !== false && (
                                      <>
                                        <div>
                                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>主要按鈕顯示文字 (留白則使用全站預設)：</span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={editingCarousel.actionBtnText || ''}
                                            onChange={(e) => setEditingCarousel({ ...editingCarousel, actionBtnText: e.target.value })}
                                            placeholder="例如：前往介紹頁觀看雙欄動態、造訪官網..."
                                          />
                                        </div>

                                        <div>
                                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>主要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                          {renderLinkSelector(
                                            '',
                                            editingCarousel.actionBtnLink || 'intro',
                                            (val) => setEditingCarousel({ ...editingCarousel, actionBtnLink: val })
                                          )}
                                        </div>
                                      </>
                                    )}

                                    <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-glass)' }}>
                                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>次要按鈕顯示文字 (選填)：</span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={editingCarousel.secondaryBtnText || ''}
                                        onChange={(e) => setEditingCarousel({ ...editingCarousel, secondaryBtnText: e.target.value })}
                                        placeholder="例如：下載圖片 / 索取資料"
                                      />
                                    </div>

                                    {editingCarousel.secondaryBtnText && (
                                      <div>
                                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>次要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                        {renderLinkSelector(
                                          '',
                                          editingCarousel.secondaryBtnLink || '',
                                          (val) => setEditingCarousel({ ...editingCarousel, secondaryBtnLink: val })
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                                {/* 展件技術亮點與視覺規格自訂／移除區塊 */}
                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)' }}>
                                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={16} />
                                    展件技術亮點與視覺規格 (彈窗顯示內容設定)
                                  </label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                      <input
                                        type="checkbox"
                                        id={`hideSpecs_${editingCarousel.id}`}
                                        checked={editingCarousel.hideSpecs || false}
                                        onChange={(e) => setEditingCarousel({ ...editingCarousel, hideSpecs: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
                                      />
                                      <label htmlFor={`hideSpecs_${editingCarousel.id}`} style={{ color: 'var(--accent-pink)', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>
                                        🔒 隱藏/完全移除圖片彈窗中的【展件技術亮點與視覺規格】區塊
                                      </label>
                                    </div>

                                    {!editingCarousel.hideSpecs && (
                                      <>
                                        <div>
                                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>1. 解析度規格 (可自由修改或清空留白不顯示)：</span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={editingCarousel.specResolution !== undefined ? editingCarousel.specResolution : '超高解析畫質 (4K HDR 深度漸層)'}
                                            onChange={(e) => setEditingCarousel({ ...editingCarousel, specResolution: e.target.value })}
                                            placeholder="例如：超高解析畫質 (4K HDR 深度漸層)"
                                          />
                                        </div>

                                        <div>
                                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>2. 響應式說明 (可自由修改或清空留白不顯示)：</span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={editingCarousel.specResponsive !== undefined ? editingCarousel.specResponsive : '支援全螢幕與手勢縮放互動'}
                                            onChange={(e) => setEditingCarousel({ ...editingCarousel, specResponsive: e.target.value })}
                                            placeholder="例如：支援全螢幕與手勢縮放互動"
                                          />
                                        </div>

                                        <div>
                                          <div>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>3. 主題屬性標籤 (例如：我的英雄學院 精選展示)：</span>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={editingCarousel.specTheme !== undefined ? editingCarousel.specTheme : (editingCarousel.category ? `${editingCarousel.category} 精選展示` : '精選展示')}
                                              onChange={(e) => setEditingCarousel({ ...editingCarousel, specTheme: e.target.value })}
                                              placeholder="例如：我的英雄學院 精選展示"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                  <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                                    <Save size={18} /> 儲存修改內容
                                  </button>
                                  <button type="button" className="btn btn-secondary" onClick={() => setEditingCarousel(null)}>
                                    取消
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <form onSubmit={handleAddCarousel} className="glass-panel" style={{ padding: '2rem' }}>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} color="var(--accent-cyan)" /> 新增主頁圖片輪播項目
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                            <div className="form-group">
                              <label className="form-label">項目標題</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：賽博朋克光影"
                                value={newCarousel.title}
                                onChange={(e) => setNewCarousel({ ...newCarousel, title: e.target.value })}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">選擇主題分類 (藍紫色小標籤)</label>
                              <select
                                className="form-control"
                                value={newCarousel.category}
                                onChange={(e) => setNewCarousel({ ...newCarousel, category: e.target.value })}
                              >
                                {categories.filter(c => c !== '全部').map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">🏷️ 彈窗主標籤 (粉紅小標籤，例如：最新上架)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：最新上架"
                                value={newCarousel.tag || ''}
                                onChange={(e) => setNewCarousel({ ...newCarousel, tag: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">🏷️ 彈窗副標籤清單 (青色小標籤，逗點分隔)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：熱門展件, 4K超高清"
                                value={newCarousel.badgesText !== undefined ? newCarousel.badgesText : (newCarousel.badges || []).join(', ')}
                                onChange={(e) => setNewCarousel({ ...newCarousel, badgesText: e.target.value })}
                              />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                              <label className="form-label">上傳圖片 (電腦選擇檔案 或 貼上網址)</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                    <Upload size={16} /> 📁 從電腦選擇圖片檔案 (JPG / PNG / GIF)
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleFileUpload(e, (url) => setNewCarousel({ ...newCarousel, imageUrl: url }))}
                                    />
                                  </label>
                                </div>

                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="或貼上圖片網址 (https://...)"
                                  value={newCarousel.imageUrl}
                                  onChange={(e) => setNewCarousel({ ...newCarousel, imageUrl: e.target.value })}
                                  required
                                />

                                {newCarousel.imageUrl && (
                                  <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '120px', width: '200px', border: '1px solid var(--border-glass)', position: 'relative' }}>
                                    <img src={newCarousel.imageUrl} alt="圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>輪播圖片預覽</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                              <label className="form-label">GIF 動畫檔案 (選填，可上傳電腦 GIF 檔)</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                  <Film size={16} /> 📁 從電腦選擇 GIF 動畫檔案
                                  <input
                                    type="file"
                                    accept="image/gif"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, (url) => setNewCarousel({ ...newCarousel, gifUrl: url }))}
                                  />
                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="或貼上 GIF 動畫網址 (Giphy GIF URL)"
                                  value={newCarousel.gifUrl}
                                  onChange={(e) => setNewCarousel({ ...newCarousel, gifUrl: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">詳細說明文字 (點擊後 Modal 顯示)</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="輸入圖片的背景或藝術介紹..."
                              value={newCarousel.description}
                              onChange={(e) => setNewCarousel({ ...newCarousel, description: e.target.value })}
                            />
                          </div>

                          {/* 展件技術亮點與視覺規格自訂／移除區塊 (新增項目) */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)', marginBottom: '1.25rem' }}>
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Sparkles size={16} />
                              展件技術亮點與視覺規格 (彈窗顯示內容設定，選填)
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <input
                                  type="checkbox"
                                  id="hideSpecs_new"
                                  checked={newCarousel.hideSpecs || false}
                                  onChange={(e) => setNewCarousel({ ...newCarousel, hideSpecs: e.target.checked })}
                                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
                                />
                                <label htmlFor="hideSpecs_new" style={{ color: 'var(--accent-pink)', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>
                                  🔒 隱藏/完全移除圖片彈窗中的【展件技術亮點與視覺規格】區塊
                                </label>
                              </div>

                              {!newCarousel.hideSpecs && (
                                <>
                                  <div>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>1. 解析度規格 (選填，清空留白即不顯示)：</span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newCarousel.specResolution !== undefined ? newCarousel.specResolution : '超高解析畫質 (4K HDR 深度漸層)'}
                                      onChange={(e) => setNewCarousel({ ...newCarousel, specResolution: e.target.value })}
                                      placeholder="例如：超高解析畫質 (4K HDR 深度漸層)"
                                    />
                                  </div>

                                  <div>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>2. 響應式說明 (選填，清空留白即不顯示)：</span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newCarousel.specResponsive !== undefined ? newCarousel.specResponsive : '支援全螢幕與手勢縮放互動'}
                                      onChange={(e) => setNewCarousel({ ...newCarousel, specResponsive: e.target.value })}
                                      placeholder="例如：支援全螢幕與手勢縮放互動"
                                    />
                                  </div>

                                  <div>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>3. 主題屬性標籤 (例如：我的英雄學院 精選展示)：</span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newCarousel.specTheme !== undefined ? newCarousel.specTheme : '精選展示'}
                                      onChange={(e) => setNewCarousel({ ...newCarousel, specTheme: e.target.value })}
                                      placeholder="例如：我的英雄學院 精選展示"
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            {/* 彈窗按鈕自訂區塊 (新增項目) */}
                            <div style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-indigo)', marginTop: '0.75rem' }}>
                              <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-indigo)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MousePointer size={16} />
                                🔘 圖片彈窗按鈕自訂 (自訂按鈕文字與跳轉連結)
                              </label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <input
                                    type="checkbox"
                                    id="showActionBtn_new"
                                    checked={newCarousel.showActionBtn !== false}
                                    onChange={(e) => setNewCarousel({ ...newCarousel, showActionBtn: e.target.checked })}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
                                  />
                                  <label htmlFor="showActionBtn_new" style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                                    顯示彈窗主要按鈕 (預設開啟)
                                  </label>
                                </div>

                                {newCarousel.showActionBtn !== false && (
                                  <>
                                    <div>
                                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>主要按鈕顯示文字 (留白則使用全站預設)：</span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={newCarousel.actionBtnText || ''}
                                        onChange={(e) => setNewCarousel({ ...newCarousel, actionBtnText: e.target.value })}
                                        placeholder="例如：前往介紹頁觀看雙欄動態、造訪官網..."
                                      />
                                    </div>

                                    <div>
                                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>主要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                      {renderLinkSelector(
                                        '',
                                        newCarousel.actionBtnLink || 'intro',
                                        (val) => setNewCarousel({ ...newCarousel, actionBtnLink: val })
                                      )}
                                    </div>
                                  </>
                                )}

                                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-glass)' }}>
                                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>次要按鈕顯示文字 (選填)：</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={newCarousel.secondaryBtnText || ''}
                                    onChange={(e) => setNewCarousel({ ...newCarousel, secondaryBtnText: e.target.value })}
                                    placeholder="例如：下載圖片 / 索取資料"
                                  />
                                </div>

                                {newCarousel.secondaryBtnText && (
                                  <div>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>次要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                    {renderLinkSelector(
                                      '',
                                      newCarousel.secondaryBtnLink || '',
                                      (val) => setNewCarousel({ ...newCarousel, secondaryBtnLink: val })
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <button type="submit" className="btn btn-primary">
                            <Plus size={18} /> 新增此輪播項目
                          </button>
                        </form>
                      )}

                      {/* 現有輪播列表 */}
                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                          現有輪播圖清單 (管理者可即時編輯、刪除或檢視)
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                          {carouselItems.map((item, idx) => (
                            <div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: item.id === editingCarousel?.id ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)' }}>
                              <div style={{ position: 'relative' }}>
                                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                                  #{idx + 1} 順序
                                </span>
                              </div>
                              <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                                  <span className="badge badge-indigo">{item.category}</span>
                                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      disabled={idx === 0}
                                      onClick={() => {
                                        moveCarouselItem(item.id, 'up');
                                        showToast('⬆️ 已向前調整順序');
                                      }}
                                      title="向前移動排序"
                                      style={{ padding: '0.3rem 0.5rem', opacity: idx === 0 ? 0.4 : 1 }}
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      disabled={idx === carouselItems.length - 1}
                                      onClick={() => {
                                        moveCarouselItem(item.id, 'down');
                                        showToast('⬇️ 已向後調整順序');
                                      }}
                                      title="向後移動排序"
                                      style={{ padding: '0.3rem 0.5rem', opacity: idx === carouselItems.length - 1 ? 0.4 : 1 }}
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                    <button 
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => {
                                        setEditingCarousel({ ...item });
                                        window.scrollTo({ top: 120, behavior: 'smooth' });
                                      }}
                                      style={{ padding: '0.3rem 0.6rem' }}
                                    >
                                      <Edit3 size={14} /> 編輯
                                    </button>
                                    <button 
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        if (window.confirm(`確定要刪除「${item.title}」嗎？`)) {
                                          deleteCarouselItem(item.id);
                                          showToast('已刪除輪播項目');
                                        }
                                      }}
                                      style={{ padding: '0.3rem 0.6rem' }}
                                    >
                                      <Trash2 size={14} /> 刪除
                                    </button>
                                  </div>
                                </div>
                                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: '0.4rem' }}>{item.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. 特色與技術卡片編輯 (整合進網站主頁版面編輯) */}
                  {homeSubTab === 'cards' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {editingCard ? (
                        <div id="edit-form-card" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-indigo)', background: 'rgba(99, 102, 241, 0.04)', boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <span className="badge badge-indigo" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                                ✏️ 卡片內容編輯中
                              </span>
                              <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                                編輯介紹卡片：「{editingCard.title}」
                              </h3>
                            </div>
                            <button className="btn btn-secondary" onClick={() => setEditingCard(null)}>
                              <RotateCcw size={16} /> 關閉編輯並返回
                            </button>
                          </div>

                          <form onSubmit={handleSaveEditCard} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                              <div className="form-group">
                                <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                                  📍 展示位置 (可隨時切換)
                                </label>
                                <select
                                  className="form-control"
                                  value={editingCard.targetLocation || 'home'}
                                  onChange={(e) => setEditingCard({ ...editingCard, targetLocation: e.target.value })}
                                  style={{ border: '1px solid var(--accent-pink)', fontWeight: '700' }}
                                >
                                  <option value="home">主頁 (Home Page 最下方功能介紹)</option>
                                  <option value="intro">介紹頁 (Intro Page 最下方特色卡片)</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="form-label">卡片標題</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editingCard.title || ''}
                                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">圖示風格</label>
                                <select
                                  className="form-control"
                                  value={editingCard.icon || 'Sparkles'}
                                  onChange={(e) => setEditingCard({ ...editingCard, icon: e.target.value })}
                                >
                                  <option value="Sparkles">星星閃爍圖示 (Sparkles)</option>
                                  <option value="Layout">版面圖示 (Layout)</option>
                                  <option value="FileText">表單圖示 (FileText)</option>
                                  <option value="Layers">圖層雙欄圖示 (Layers)</option>
                                  <option value="ShieldCheck">安全盾牌圖示 (ShieldCheck)</option>
                                  <option value="Film">GIF 動畫圖示 (Film)</option>
                                  <option value="MousePointer">游標懸停圖示 (MousePointer)</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">卡片詳細說明內容</label>
                              <textarea
                                className="form-control"
                                rows={4}
                                value={editingCard.description || ''}
                                onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                                required
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                                <Save size={18} /> 儲存卡片修改內容
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={() => setEditingCard(null)}>
                                取消
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <form onSubmit={handleAddUnifiedCard} className="glass-panel" style={{ padding: '2.5rem' }}>
                          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={22} color="var(--accent-primary)" />
                            新增特色/技術卡片 (選擇展示位置：主頁 或 介紹頁)
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                                📍 選擇卡片展示位置
                              </label>
                              <select
                                className="form-control"
                                value={unifiedCard.location}
                                onChange={(e) => setUnifiedCard({ ...unifiedCard, location: e.target.value })}
                                style={{ border: '1px solid var(--accent-pink)', fontWeight: '700' }}
                              >
                                <option value="home">主頁 (Home Page 最下方功能介紹)</option>
                                <option value="intro">介紹頁 (Intro Page 最下方特色卡片)</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">卡片標題</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：智慧即時互動"
                                value={unifiedCard.title}
                                onChange={(e) => setUnifiedCard({ ...unifiedCard, title: e.target.value })}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">圖示風格</label>
                              <select
                                className="form-control"
                                value={unifiedCard.icon}
                                onChange={(e) => setUnifiedCard({ ...unifiedCard, icon: e.target.value })}
                              >
                                <option value="Sparkles">星星閃爍圖示 (Sparkles)</option>
                                <option value="Layout">版面圖示 (Layout)</option>
                                <option value="FileText">表單圖示 (FileText)</option>
                                <option value="Layers">圖層雙欄圖示 (Layers)</option>
                                <option value="ShieldCheck">安全盾牌圖示 (ShieldCheck)</option>
                                <option value="Film">GIF 動畫圖示 (Film)</option>
                                <option value="MousePointer">游標懸停圖示 (MousePointer)</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">卡片詳細說明內容</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="輸入詳細介紹說明文字..."
                              value={unifiedCard.description}
                              onChange={(e) => setUnifiedCard({ ...unifiedCard, description: e.target.value })}
                              required
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            <Plus size={18} /> 新增此卡片至{unifiedCard.location === 'home' ? '【主頁】' : '【介紹頁】'}
                          </button>
                        </form>
                      )}

                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)' }}>
                            全站特色/技術卡片清單 (共 {combinedCards.length} 張)
                          </h3>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Filter size={16} color="var(--text-muted)" />
                            <button 
                              className={`btn btn-sm ${cardFilterLocation === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setCardFilterLocation('all')}
                            >
                              全部 ({combinedCards.length})
                            </button>
                            <button 
                              className={`btn btn-sm ${cardFilterLocation === 'home' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setCardFilterLocation('home')}
                            >
                              主頁 ({featureCards.length})
                            </button>
                            <button 
                              className={`btn btn-sm ${cardFilterLocation === 'intro' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setCardFilterLocation('intro')}
                            >
                              介紹頁 ({introCards.length})
                            </button>
                          </div>
                        </div>

                        {filteredCombinedCards.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            目前此位置無卡片。（註：若介紹頁卡片清單清空，介紹頁最下方區塊將會自動隱藏不顯示）
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filteredCombinedCards.map((card) => (
                              <div key={card.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span className={`badge ${card.targetLocation === 'home' ? 'badge-indigo' : 'badge-pink'}`}>
                                      {card.targetLocation === 'home' ? '📍 主頁卡片' : '📍 介紹頁卡片'}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                      <button 
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => {
                                          setEditingCard({ ...card, targetLocation: card.targetLocation, originalLocation: card.targetLocation });
                                        }}
                                      >
                                        <Edit3 size={14} /> 編輯
                                      </button>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                          if (window.confirm(`確定要刪除「${card.title}」卡片嗎？`)) {
                                            if (card.targetLocation === 'home') {
                                              deleteFeatureCard(card.id);
                                            } else {
                                              deleteIntroCard(card.id);
                                            }
                                            showToast('已刪除該卡片');
                                          }
                                        }}
                                      >
                                        <Trash2 size={14} /> 刪除
                                      </button>
                                    </div>
                                  </div>
                                  <h4 style={{ color: 'var(--text-title)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{card.title}</h4>
                                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{card.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. 主頁精選與問卷區塊展示設定 */}
                  {homeSubTab === 'announcements' && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.04)' }}>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Megaphone color="var(--accent-pink)" size={22} />
                        主頁精選與問卷展示設定
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                        設定主頁 Hero 視覺下方顯示的內容類型。您可以選擇隱藏、展示活動問卷說明卡片，或挑選精選公告貼文。
                      </p>

                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>
                          主頁精選區塊展示模式
                        </label>
                        <select
                          className="form-control"
                          style={{ border: '1.5px solid var(--accent-pink)', fontWeight: '600' }}
                          value={heroForm.homeFeaturedType || 'none'}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = { ...heroForm, homeFeaturedType: val };
                            setHeroForm(updated);
                            updateHeroConfig(updated);
                            showToast('已更新主頁精選區塊展示模式！');
                          }}
                        >
                          <option value="none">不顯示 (隱藏主頁 Hero 下方展示區塊)</option>
                          <option value="survey">展示活動與問卷說明卡片 (問卷調查)</option>
                          <option value="announcement">展示精選公告貼文</option>
                        </select>
                      </div>

                      {heroForm.homeFeaturedType === 'announcement' && (
                        <div className="animate-fade-in" style={{ background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                          <label className="form-label" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                            選擇要展示於主頁的精選公告貼文
                          </label>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                              className="form-control"
                              style={{ flex: '1', minWidth: '280px', fontWeight: '600' }}
                              value={heroForm.featuredAnnouncementId || ''}
                              onChange={(e) => {
                                const newId = e.target.value;
                                const updated = { ...heroForm, featuredAnnouncementId: newId };
                                setHeroForm(updated);
                                updateHeroConfig(updated);
                                showToast(newId ? '已設定精選公告放至主頁！' : '已取消主頁精選公告展示');
                              }}
                            >
                              <option value="">-- (請選擇公告貼文) --</option>
                              {announcements.map(ann => (
                                <option key={ann.id} value={ann.id}>
                                  {ann.isPinned ? '[置頂] ' : ''}[{ann.category}] {ann.title} ({ann.date})
                                </option>
                              ))}
                            </select>

                            {heroForm.featuredAnnouncementId && (
                              <button 
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  const updated = { ...heroForm, featuredAnnouncementId: '' };
                                  setHeroForm(updated);
                                  updateHeroConfig(updated);
                                  showToast('已取消主頁精選公告展示');
                                }}
                              >
                                <X size={14} /> 取消精選
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {heroForm.homeFeaturedType && heroForm.homeFeaturedType !== 'none' && (
                        <div className="animate-fade-in" style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-glass)' }}>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Tag size={16} /> 🏷️ 精選區塊頂部顯示標籤自訂 (粉色標籤與靛藍/藍色標籤)
                          </h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            可自由編輯主頁此卡片頂部的兩組標籤文字（例如：「重磅活動介紹」、「歡迎全體訪客參與」）。
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--accent-pink)' }}>
                                🏷️ 第一標籤文字 (粉色標籤)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  heroForm.homeFeaturedType === 'announcement'
                                    ? (heroForm.featuredAnnouncementBadge !== undefined ? heroForm.featuredAnnouncementBadge : '重磅活動介紹')
                                    : (heroForm.featuredSurveyBadge !== undefined ? heroForm.featuredSurveyBadge : (eventForm.tag !== undefined ? eventForm.tag : '重磅活動介紹'))
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (heroForm.homeFeaturedType === 'announcement') {
                                    const updated = { ...heroForm, featuredAnnouncementBadge: val };
                                    setHeroForm(updated);
                                    updateHeroConfig(updated);
                                  } else {
                                    const updatedHero = { ...heroForm, featuredSurveyBadge: val };
                                    const updatedEvent = { ...eventForm, tag: val };
                                    setHeroForm(updatedHero);
                                    setEventForm(updatedEvent);
                                    updateHeroConfig(updatedHero);
                                    updateEventInfo(updatedEvent);
                                  }
                                }}
                                placeholder="例如：重磅活動介紹"
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                                🏷️ 第二標籤文字 (靛藍/藍色標籤)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  heroForm.homeFeaturedType === 'announcement'
                                    ? (heroForm.featuredAnnouncementSubBadge !== undefined ? heroForm.featuredAnnouncementSubBadge : '歡迎全體訪客參與')
                                    : (heroForm.featuredSurveySubBadge !== undefined ? heroForm.featuredSurveySubBadge : (eventForm.subTag !== undefined ? eventForm.subTag : '歡迎全體訪客參與'))
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (heroForm.homeFeaturedType === 'announcement') {
                                    const updated = { ...heroForm, featuredAnnouncementSubBadge: val };
                                    setHeroForm(updated);
                                    updateHeroConfig(updated);
                                  } else {
                                    const updatedHero = { ...heroForm, featuredSurveySubBadge: val };
                                    const updatedEvent = { ...eventForm, subTag: val };
                                    setHeroForm(updatedHero);
                                    setEventForm(updatedEvent);
                                    updateHeroConfig(updatedHero);
                                    updateEventInfo(updatedEvent);
                                  }
                                }}
                                placeholder="例如：歡迎全體訪客參與"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              type="button" 
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                updateHeroConfig(heroForm);
                                updateEventInfo(eventForm);
                                showToast('✅ 精選展示區塊標籤已成功儲存並更新至前台主頁！');
                              }}
                            >
                              <Save size={14} /> 儲存標籤文字設定
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 問卷展示兩組前往按鈕自訂設定 (按鈕文字與連結選擇) */}
                      {heroForm.homeFeaturedType === 'survey' && (
                        <div className="animate-fade-in" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-glass)' }}>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-pink)', marginBottom: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <FileText size={18} /> 🔘 問卷展示兩組前往按鈕自訂設定 (按鈕文字與連結選擇)
                          </h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                            問卷展示卡片包含右上角主要前往按鈕與右下角禮品獎勵前往按鈕。您可以個別設定按鈕文字，並選擇跳轉至現有網站頁面或外部網址。
                          </p>

                          {/* 按鈕 1：右上角主要前往按鈕 */}
                          <div style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <span style={{ fontWeight: '700', color: 'var(--accent-pink)', fontSize: '0.95rem' }}>
                                📍 按鈕 1：右上角主要前往按鈕 (Main Action Button)
                              </span>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                <input
                                  type="checkbox"
                                  checked={heroForm.surveyBtn1Show !== false}
                                  onChange={(e) => {
                                    const updated = { ...heroForm, surveyBtn1Show: e.target.checked };
                                    setHeroForm(updated);
                                    updateHeroConfig(updated);
                                  }}
                                  style={{ accentColor: 'var(--accent-pink)', width: '16px', height: '16px' }}
                                />
                                顯示按鈕 1
                              </label>
                            </div>

                            {heroForm.surveyBtn1Show !== false && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                <div>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>按鈕 1 顯示文字</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={heroForm.surveyBtn1Text !== undefined ? heroForm.surveyBtn1Text : (heroForm.eventCtaText || '前往填寫活動表單')}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = { ...heroForm, surveyBtn1Text: val, eventCtaText: val };
                                      setHeroForm(updated);
                                    }}
                                    placeholder="例如：前往填寫活動表單"
                                  />
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>連結類型</label>
                                  <select
                                    className="form-control"
                                    value={(heroForm.surveyBtn1Link || 'form').startsWith('http') ? 'external' : 'internal'}
                                    onChange={(e) => {
                                      const isExt = e.target.value === 'external';
                                      const updated = { ...heroForm, surveyBtn1Link: isExt ? 'https://' : 'form' };
                                      setHeroForm(updated);
                                    }}
                                  >
                                    <option value="internal">🔗 現有網站頁面</option>
                                    <option value="external">🌐 外部網站連結 (URL)</option>
                                  </select>
                                </div>

                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>
                                    {(heroForm.surveyBtn1Link || 'form').startsWith('http') ? '外部網址 (包含 https://)' : '選擇目標頁面'}
                                  </label>
                                  {(heroForm.surveyBtn1Link || 'form').startsWith('http') ? (
                                    <input
                                      type="url"
                                      className="form-control"
                                      placeholder="https://example.com"
                                      value={heroForm.surveyBtn1Link || 'https://'}
                                      onChange={(e) => {
                                        const updated = { ...heroForm, surveyBtn1Link: e.target.value };
                                        setHeroForm(updated);
                                      }}
                                    />
                                  ) : (
                                    <select
                                      className="form-control"
                                      value={heroForm.surveyBtn1Link || 'form'}
                                      onChange={(e) => {
                                        const updated = { ...heroForm, surveyBtn1Link: e.target.value };
                                        setHeroForm(updated);
                                      }}
                                    >
                                      <option value="form">📝 活動與表單 (form)</option>
                                      <option value="home">🏠 主頁 (home)</option>
                                      <option value="announcements">📢 公告專區 (announcements)</option>
                                      <option value="intro">🎬 雙欄介紹 (intro)</option>
                                      <option value="responses">💬 回應表單 (responses)</option>
                                      <option value="sponsors">🏢 贊助廠商 (sponsors)</option>
                                      <option value="admin">⚙️ 管理者後台 (admin)</option>
                                      {customPages.map(cp => (
                                        <option key={cp.id} value={cp.id}>📄 自訂頁面：{cp.title} ({cp.id})</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 按鈕 2：右下角獎勵前往按鈕 */}
                          <div style={{ padding: '1.25rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                                📍 按鈕 2：右下角獎勵/次要前往按鈕 (Reward Action Button)
                              </span>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                <input
                                  type="checkbox"
                                  checked={heroForm.surveyBtn2Show !== false}
                                  onChange={(e) => {
                                    const updated = { ...heroForm, surveyBtn2Show: e.target.checked };
                                    setHeroForm(updated);
                                    updateHeroConfig(updated);
                                  }}
                                  style={{ accentColor: 'var(--accent-cyan)', width: '16px', height: '16px' }}
                                />
                                顯示按鈕 2
                              </label>
                            </div>

                            {heroForm.surveyBtn2Show !== false && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                <div>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>按鈕 2 顯示文字</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={heroForm.surveyBtn2Text !== undefined ? heroForm.surveyBtn2Text : (heroForm.surveyRewardCtaText || '馬上前往填寫問卷 →')}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = { ...heroForm, surveyBtn2Text: val, surveyRewardCtaText: val };
                                      setHeroForm(updated);
                                    }}
                                    placeholder="例如：馬上前往填寫問卷 →"
                                  />
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>連結類型</label>
                                  <select
                                    className="form-control"
                                    value={(heroForm.surveyBtn2Link || 'form').startsWith('http') ? 'external' : 'internal'}
                                    onChange={(e) => {
                                      const isExt = e.target.value === 'external';
                                      const updated = { ...heroForm, surveyBtn2Link: isExt ? 'https://' : 'form' };
                                      setHeroForm(updated);
                                    }}
                                  >
                                    <option value="internal">🔗 現有網站頁面</option>
                                    <option value="external">🌐 外部網站連結 (URL)</option>
                                  </select>
                                </div>

                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>
                                    {(heroForm.surveyBtn2Link || 'form').startsWith('http') ? '外部網址 (包含 https://)' : '選擇目標頁面'}
                                  </label>
                                  {(heroForm.surveyBtn2Link || 'form').startsWith('http') ? (
                                    <input
                                      type="url"
                                      className="form-control"
                                      placeholder="https://example.com"
                                      value={heroForm.surveyBtn2Link || 'https://'}
                                      onChange={(e) => {
                                        const updated = { ...heroForm, surveyBtn2Link: e.target.value };
                                        setHeroForm(updated);
                                      }}
                                    />
                                  ) : (
                                    <select
                                      className="form-control"
                                      value={heroForm.surveyBtn2Link || 'form'}
                                      onChange={(e) => {
                                        const updated = { ...heroForm, surveyBtn2Link: e.target.value };
                                        setHeroForm(updated);
                                      }}
                                    >
                                      <option value="form">📝 活動與表單 (form)</option>
                                      <option value="home">🏠 主頁 (home)</option>
                                      <option value="announcements">📢 公告專區 (announcements)</option>
                                      <option value="intro">🎬 雙欄介紹 (intro)</option>
                                      <option value="responses">💬 回應表單 (responses)</option>
                                      <option value="sponsors">🏢 贊助廠商 (sponsors)</option>
                                      <option value="admin">⚙️ 管理者後台 (admin)</option>
                                      {customPages.map(cp => (
                                        <option key={cp.id} value={cp.id}>📄 自訂頁面：{cp.title} ({cp.id})</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              type="button" 
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                updateHeroConfig(heroForm);
                                updateEventInfo(eventForm);
                                showToast('✅ 問卷展示按鈕與標籤設定已成功儲存！');
                              }}
                            >
                              <Save size={14} /> 儲存按鈕與標籤設定
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* 2️⃣ 編輯【公告專區】面板 */}
              {selectedEditPage === 'announcements' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <form onSubmit={handleSaveHeroEvent} className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Megaphone color="var(--accent-cyan)" size={22} />
                      📢 公告專區：頁頭標籤、大標題與說明文字自訂
                    </h3>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                        🏷️ 頂部小標籤文字
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.announcementsPageBadge !== undefined ? heroForm.announcementsPageBadge : '最新消息與公告'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPageBadge: e.target.value })}
                        placeholder="例如：最新消息與公告"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">公告專區大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.announcementsPageTitle !== undefined ? heroForm.announcementsPageTitle : '平台最新公告與專屬消息'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPageTitle: e.target.value })}
                        placeholder="例如：平台最新公告與專屬消息"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">公告專區副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={heroForm.announcementsPageSubtitle !== undefined ? heroForm.announcementsPageSubtitle : '掌控全站最新動態、功能更新與重磅通知。'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPageSubtitle: e.target.value })}
                        placeholder="例如：掌控全站最新動態..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                        📌 置頂公告區塊標題
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.announcementsPinnedTitle !== undefined ? heroForm.announcementsPinnedTitle : '置頂重要公告'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPinnedTitle: e.target.value })}
                        placeholder="例如：置頂重要公告"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
                        📜 歷年公告歷史紀錄標題
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.announcementsHistoryTitle !== undefined ? heroForm.announcementsHistoryTitle : '歷年公告歷史紀錄'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsHistoryTitle: e.target.value })}
                        placeholder="例如：歷年公告歷史紀錄"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <Save size={18} /> 儲存公告專區頁面文字設定
                    </button>
                  </form>
                </div>
              )}

              {/* 3️⃣ 編輯【雙欄介紹頁】面板 */}
              {selectedEditPage === 'intro' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* 頁面內容編輯 Sub-Tabs */}
                  <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.04)' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-title)', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Film size={16} color="var(--accent-pink)" />
                      介紹頁內容編輯選單：
                    </span>
                    <button 
                      type="button"
                      className={`btn btn-sm ${mediaSubTab === 'showcase' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setMediaSubTab('showcase')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      <Film size={16} /> 🎬 雙欄動態展示編輯
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${mediaSubTab === 'intro_cards' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setMediaSubTab('intro_cards')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      <Layers size={16} /> 特色與技術卡片編輯
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${mediaSubTab === 'header_text' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setMediaSubTab('header_text')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      <Edit3 size={16} /> 頁頭標題與說明文字編輯
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${mediaSubTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setMediaSubTab('categories')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      <Tag size={16} /> 主題分類管理 (新增/刪除主題)
                    </button>
                  </div>

                  {/* 頁頭標題與說明文字編輯 */}
                  {mediaSubTab === 'header_text' && (
                    <form onSubmit={handleSaveHeroEvent} className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Film color="var(--accent-pink)" size={22} />
                        🎬 雙欄介紹頁：頁頭標籤、大標題與說明文字自訂
                      </h3>

                      <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                          🏷️ 頂部小標籤文字
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={heroForm.showcasePageBadge !== undefined ? heroForm.showcasePageBadge : '專題視覺與技術詳細介紹'}
                          onChange={(e) => setHeroForm({ ...heroForm, showcasePageBadge: e.target.value })}
                          placeholder="例如：專題視覺與技術詳細介紹"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">雙欄介紹大標題</label>
                        <input
                          type="text"
                          className="form-control"
                          value={heroForm.showcasePageTitle !== undefined ? heroForm.showcasePageTitle : '雙欄同步互動輪播展示'}
                          onChange={(e) => setHeroForm({ ...heroForm, showcasePageTitle: e.target.value })}
                          placeholder="例如：雙欄同步互動輪播展示"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">雙欄介紹副標題與說明文字</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={heroForm.showcasePageSubtitle !== undefined ? heroForm.showcasePageSubtitle : '左側為主題輪播大圖與動態 GIF 展示區，支援滑鼠懸停暫停與微距放大；右側與輪播完全同步，展示當前項目的詳細規格與文字介紹。'}
                          onChange={(e) => setHeroForm({ ...heroForm, showcasePageSubtitle: e.target.value })}
                          placeholder="例如：左側為主題輪播大圖..."
                        />
                      </div>

                      <div className="form-group" style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                        <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={heroForm.showcaseShowCta !== false}
                            onChange={(e) => setHeroForm({ ...heroForm, showcaseShowCta: e.target.checked })}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                          />
                          預設顯示雙欄介紹頁行動按鈕 (CTA Button)
                        </label>

                        {heroForm.showcaseShowCta !== false && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '0.85rem' }}>
                            <div>
                              <label className="form-label" style={{ fontSize: '0.88rem' }}>全域預設按鈕顯示文字</label>
                              <input
                                type="text"
                                className="form-control"
                                value={heroForm.showcaseCtaText !== undefined ? heroForm.showcaseCtaText : '前往填寫評分表單'}
                                onChange={(e) => setHeroForm({ ...heroForm, showcaseCtaText: e.target.value })}
                                placeholder="例如：前往填寫評分表單"
                              />
                            </div>
                            <div>
                              <label className="form-label" style={{ fontSize: '0.88rem' }}>全域預設按鈕跳轉目標 (分頁 ID 或網址)</label>
                              <input
                                type="text"
                                className="form-control"
                                value={heroForm.showcaseCtaLink !== undefined ? heroForm.showcaseCtaLink : 'form'}
                                onChange={(e) => setHeroForm({ ...heroForm, showcaseCtaLink: e.target.value })}
                                placeholder="例如：form / home / announcements / https://..."
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <button type="submit" className="btn btn-primary">
                        <Save size={18} /> 儲存雙欄介紹頁面文字設定
                      </button>
                    </form>
                  )}

                  {/* 主題分類管理 */}
                  {mediaSubTab === 'categories' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div className="glass-panel" style={{ padding: '2rem', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.03)' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Tag color="var(--accent-pink)" size={20} />
                          🏷️ 介紹主題分類管理 (新增與刪除主題)
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                          建立不同的主題分類後，前台【介紹頁雙欄展示】將提供主題標籤列。點擊不同主題即可切換觀看該主題專屬的介紹內容。
                        </p>

                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="輸入新主題分類名稱 (例如：全息影像、AI 晶片)..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            style={{ flex: '1', minWidth: '240px' }}
                            required
                          />
                          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.65rem 1.25rem' }}>
                            <Plus size={16} /> 新增此主題分類
                          </button>
                        </form>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                          {categories.map((cat) => (
                            <div 
                              key={cat} 
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                padding: '0.4rem 0.9rem', 
                                background: 'rgba(255, 255, 255, 0.06)', 
                                border: '1px solid var(--border-glass-bright)', 
                                borderRadius: '9999px',
                                fontSize: '0.85rem'
                              }}
                            >
                              <span style={{ fontWeight: '600', color: 'var(--text-title)' }}>{cat}</span>
                              {cat !== '全部' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`確定要刪除「${cat}」主題分類嗎？`)) {
                                      deleteCategory(cat);
                                      showToast(`已刪除「${cat}」主題分類`);
                                    }
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  title="刪除此主題"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 介紹頁特色與技術卡片編輯 */}
                  {mediaSubTab === 'intro_cards' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!unifiedCard.title) return;
                          addIntroCard({
                            title: unifiedCard.title,
                            icon: unifiedCard.icon,
                            description: unifiedCard.description
                          });
                          setUnifiedCard({ title: '', location: 'intro', icon: 'Sparkles', description: '' });
                          showToast('已成功新增卡片至【介紹頁】！');
                        }} 
                        className="glass-panel" 
                        style={{ padding: '2rem', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.03)' }}
                      >
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Plus color="var(--accent-pink)" size={20} />
                          新增介紹頁特色卡片
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <div className="form-group">
                            <label className="form-label">卡片標題</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="例如：全息雙欄互動藝廊"
                              value={unifiedCard.title}
                              onChange={(e) => setUnifiedCard({ ...unifiedCard, title: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">圖示風格</label>
                            <select
                              className="form-control"
                              value={unifiedCard.icon}
                              onChange={(e) => setUnifiedCard({ ...unifiedCard, icon: e.target.value })}
                            >
                              <option value="Sparkles">Sparkles 星星圖示</option>
                              <option value="Layout">Layout 版面圖示</option>
                              <option value="FileText">FileText 表單圖示</option>
                              <option value="Layers">Layers 圖層圖示</option>
                              <option value="ShieldCheck">ShieldCheck 安全圖示</option>
                              <option value="Film">Film GIF圖示</option>
                              <option value="MousePointer">MousePointer 游標圖示</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">卡片詳細說明內容</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="輸入詳細介紹說明文字..."
                            value={unifiedCard.description}
                            onChange={(e) => setUnifiedCard({ ...unifiedCard, description: e.target.value })}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          <Plus size={18} /> 新增至介紹頁特色卡片
                        </button>
                      </form>

                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                          介紹頁特色卡片清單 (共 {introCards.length} 張)
                        </h3>
                        {introCards.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            目前介紹頁無卡片。（註：清空時介紹頁最下方區塊將會自動隱藏）
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {introCards.map((card) => (
                              <div key={card.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span className="badge badge-pink">📍 介紹頁卡片</span>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        if (window.confirm(`確定要刪除「${card.title}」卡片嗎？`)) {
                                          deleteIntroCard(card.id);
                                          showToast('已刪除該介紹頁卡片');
                                        }
                                      }}
                                    >
                                      <Trash2 size={14} /> 刪除
                                    </button>
                                  </div>
                                  <h4 style={{ color: 'var(--text-title)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{card.title}</h4>
                                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{card.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 雙欄動態展示項目編輯 (新增、修改、刪除) */}
                  {mediaSubTab === 'showcase' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {editingShowcase ? (
                        <div id="edit-form-showcase" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.04)', boxShadow: '0 0 35px rgba(236, 72, 153, 0.15)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <span className="badge badge-pink" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                                ✏️ 介紹項目編輯中
                              </span>
                              <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                                編輯介紹頁雙欄展示項目：「{editingShowcase.title}」
                              </h3>
                            </div>
                            <button className="btn btn-secondary" onClick={() => setEditingShowcase(null)}>
                              <RotateCcw size={16} /> 關閉編輯並返回
                            </button>
                          </div>

                          <form onSubmit={handleSaveEditShowcase}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                                    🖼️ 展示圖片實時高解析預覽
                                  </label>
                                  <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000', position: 'relative' }}>
                                    {editingShowcase.imageUrl ? (
                                      <img src={editingShowcase.imageUrl} alt="圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>無圖片</div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>
                                    🎞️ GIF 動畫懸停實時播映預覽 (選填)
                                  </label>
                                  <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000', position: 'relative' }}>
                                    {editingShowcase.gifUrl ? (
                                      <img src={editingShowcase.gifUrl} alt="GIF預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>未設定 GIF 動畫 (懸停時顯示原靜態主圖)</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group">
                                  <label className="form-label">標題</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingShowcase.title || ''}
                                    onChange={(e) => setEditingShowcase({ ...editingShowcase, title: e.target.value })}
                                    required
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">選擇所屬主題分類</label>
                                  <select
                                    className="form-control"
                                    value={editingShowcase.category || categories[1] || '前沿硬體'}
                                    onChange={(e) => setEditingShowcase({ ...editingShowcase, category: e.target.value })}
                                  >
                                    {categories.filter(c => c !== '全部').map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="form-group">
                                  <label className="form-label">副標題</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingShowcase.subtitle || ''}
                                    onChange={(e) => setEditingShowcase({ ...editingShowcase, subtitle: e.target.value })}
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">展示圖片檔 (從電腦更換 或 輸入網址)</label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                      <Upload size={16} /> 📁 從電腦選擇圖片檔案
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(e, (url) => setEditingShowcase({ ...editingShowcase, imageUrl: url }))}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="https://..."
                                      value={editingShowcase.imageUrl || ''}
                                      onChange={(e) => setEditingShowcase({ ...editingShowcase, imageUrl: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="form-group">
                                  <label className="form-label">GIF 動畫檔 (選填，懸停移入播放)</label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                      <Film size={16} /> 📁 從電腦選擇新 GIF 檔
                                      <input
                                        type="file"
                                        accept="image/gif"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(e, (url) => setEditingShowcase({ ...editingShowcase, gifUrl: url }))}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Giphy GIF URL"
                                      value={editingShowcase.gifUrl || ''}
                                      onChange={(e) => setEditingShowcase({ ...editingShowcase, gifUrl: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <div className="form-group">
                                  <label className="form-label">特色亮點 (請以逗號分隔多項規格說明)</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="例如：支援 8K 畫質, 零延遲體驗, 節能 40%"
                                    value={editingShowcase.highlightsText || ''}
                                    onChange={(e) => setEditingShowcase({ ...editingShowcase, highlightsText: e.target.value })}
                                  />
                                </div>

                                <div className="form-group">
                                 <div className="form-group">
                                   <label className="form-label">右側詳細介紹說明</label>
                                   <textarea
                                     className="form-control"
                                     rows={3}
                                     value={editingShowcase.description || ''}
                                     onChange={(e) => setEditingShowcase({ ...editingShowcase, description: e.target.value })}
                                   />
                                 </div>

                                 {/* 行動按鈕自訂 (使用者需求：選擇是否需要按鈕、現有頁面下拉選單或外部連結) */}
                                 <div className="form-group" style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                                   <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                     <Sparkles size={18} color="var(--accent-pink)" />
                                     🔘 行動按鈕 (CTA Button) 自訂設定
                                   </label>

                                   <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-title)' }}>
                                       <input
                                         type="radio"
                                         name={`cta_show_${editingShowcase.id}`}
                                         checked={editingShowcase.showCtaBtn !== false}
                                         onChange={() => setEditingShowcase({ ...editingShowcase, showCtaBtn: true })}
                                         style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                                       />
                                       🟢 需要顯示按鈕
                                     </label>
                                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-title)' }}>
                                       <input
                                         type="radio"
                                         name={`cta_show_${editingShowcase.id}`}
                                         checked={editingShowcase.showCtaBtn === false}
                                         onChange={() => setEditingShowcase({ ...editingShowcase, showCtaBtn: false })}
                                         style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                                       />
                                       ⚪ 隱藏/不需要按鈕
                                     </label>
                                   </div>

                                   {editingShowcase.showCtaBtn !== false && (
                                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                                       <div>
                                         <label className="form-label" style={{ fontSize: '0.85rem' }}>按鈕顯示文字</label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           placeholder="例如：前往填寫評分表單"
                                           value={editingShowcase.ctaBtnText !== undefined ? editingShowcase.ctaBtnText : (editingShowcase.ctaText || '前往填寫評分表單')}
                                           onChange={(e) => setEditingShowcase({ ...editingShowcase, ctaBtnText: e.target.value, ctaText: e.target.value })}
                                         />
                                       </div>

                                       <div>
                                         <label className="form-label" style={{ fontSize: '0.85rem' }}>連結類型</label>
                                         <select
                                           className="form-control"
                                           value={(editingShowcase.ctaBtnLink || editingShowcase.ctaLink || '').startsWith('http') ? 'external' : 'internal'}
                                           onChange={(e) => {
                                             const isExt = e.target.value === 'external';
                                             setEditingShowcase({
                                               ...editingShowcase,
                                               ctaBtnLink: isExt ? 'https://' : 'form',
                                               ctaLink: isExt ? 'https://' : 'form'
                                             });
                                           }}
                                         >
                                           <option value="internal">🔗 現有網站頁面</option>
                                           <option value="external">🌐 外部網站連結 (URL)</option>
                                         </select>
                                       </div>

                                       <div style={{ gridColumn: '1 / -1' }}>
                                         <label className="form-label" style={{ fontSize: '0.85rem' }}>
                                           {(editingShowcase.ctaBtnLink || editingShowcase.ctaLink || '').startsWith('http') ? '外部網址 (包含 https://)' : '選擇目標頁面'}
                                         </label>
                                         {(editingShowcase.ctaBtnLink || editingShowcase.ctaLink || '').startsWith('http') ? (
                                           <input
                                             type="url"
                                             className="form-control"
                                             placeholder="https://example.com"
                                             value={editingShowcase.ctaBtnLink || editingShowcase.ctaLink || 'https://'}
                                             onChange={(e) => setEditingShowcase({ ...editingShowcase, ctaBtnLink: e.target.value, ctaLink: e.target.value })}
                                           />
                                         ) : (
                                           <select
                                             className="form-control"
                                             value={editingShowcase.ctaBtnLink || editingShowcase.ctaLink || 'form'}
                                             onChange={(e) => setEditingShowcase({ ...editingShowcase, ctaBtnLink: e.target.value, ctaLink: e.target.value })}
                                           >
                                             <option value="form">📝 活動與表單 (form)</option>
                                             <option value="home">🏠 主頁 (home)</option>
                                             <option value="announcements">📢 公告專區 (announcements)</option>
                                             <option value="intro">🎬 雙欄介紹 (intro)</option>
                                             <option value="responses">💬 回應表單 (responses)</option>
                                             <option value="sponsors">🏢 贊助廠商 (sponsors)</option>
                                             <option value="admin">⚙️ 管理者後台 (admin)</option>
                                             {customPages.map(cp => (
                                               <option key={cp.id} value={cp.id}>📄 自訂頁面：{cp.title} ({cp.id})</option>
                                             ))}
                                           </select>
                                         )}
                                       </div>
                                     </div>
                                   )}
                                 </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                  <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                                    <Save size={18} /> 儲存修改內容
                                  </button>
                                  <button type="button" className="btn btn-secondary" onClick={() => setEditingShowcase(null)}>
                                    取消
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <form onSubmit={handleAddShowcase} className="glass-panel" style={{ padding: '2rem' }}>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} color="var(--accent-pink)" /> 新增介紹頁面雙欄展示項目
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                            <div className="form-group">
                              <label className="form-label">標題</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：全息投影系統"
                                value={newShowcase.title}
                                onChange={(e) => setNewShowcase({ ...newShowcase, title: e.target.value })}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">選擇所屬主題分類</label>
                              <select
                                className="form-control"
                                value={newShowcase.category}
                                onChange={(e) => setNewShowcase({ ...newShowcase, category: e.target.value })}
                              >
                                {categories.filter(c => c !== '全部').map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">副標題</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：突破傳統螢幕限制"
                                value={newShowcase.subtitle}
                                onChange={(e) => setNewShowcase({ ...newShowcase, subtitle: e.target.value })}
                              />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                              <label className="form-label">左側展示圖片 (支援電腦上傳與網址)</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                  <Upload size={16} /> 📁 從電腦選擇圖片檔案
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, (url) => setNewShowcase({ ...newShowcase, imageUrl: url }))}
                                  />
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="或貼上圖片網址 (https://...)"
                                  value={newShowcase.imageUrl}
                                  onChange={(e) => setNewShowcase({ ...newShowcase, imageUrl: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                              <label className="form-label">左側 GIF 動畫檔案 (選填)</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                                  <Film size={16} /> 📁 從電腦選擇 GIF 檔
                                  <input
                                    type="file"
                                    accept="image/gif"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, (url) => setNewShowcase({ ...newShowcase, gifUrl: url }))}
                                  />
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Giphy GIF URL"
                                  value={newShowcase.gifUrl}
                                  onChange={(e) => setNewShowcase({ ...newShowcase, gifUrl: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">規格特色亮點 (請以逗點分隔)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="例如：支援 8K 畫質, 零延遲手勢識別, 耗能降低 40%"
                              value={newShowcase.highlightsText}
                              onChange={(e) => setNewShowcase({ ...newShowcase, highlightsText: e.target.value })}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">右側詳細介紹說明</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="輸入詳細文字介紹..."
                              value={newShowcase.description}
                              onChange={(e) => setNewShowcase({ ...newShowcase, description: e.target.value })}
                            />
                          </div>

                          {/* 行動按鈕自訂 (使用者需求：選擇是否需要按鈕、現有頁面下拉選單或外部連結) */}
                          <div className="form-group" style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                            <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Sparkles size={18} color="var(--accent-pink)" />
                              🔘 行動按鈕 (CTA Button) 自訂設定
                            </label>

                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-title)' }}>
                                <input
                                  type="radio"
                                  name="new_cta_show"
                                  checked={newShowcase.showCtaBtn !== false}
                                  onChange={() => setNewShowcase({ ...newShowcase, showCtaBtn: true })}
                                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                                />
                                🟢 需要顯示按鈕
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-title)' }}>
                                <input
                                  type="radio"
                                  name="new_cta_show"
                                  checked={newShowcase.showCtaBtn === false}
                                  onChange={() => setNewShowcase({ ...newShowcase, showCtaBtn: false })}
                                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                                />
                                ⚪ 隱藏/不需要按鈕
                              </label>
                            </div>

                            {newShowcase.showCtaBtn !== false && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                                <div>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>按鈕顯示文字</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="例如：前往填寫評分表單"
                                    value={newShowcase.ctaBtnText || '前往填寫評分表單'}
                                    onChange={(e) => setNewShowcase({ ...newShowcase, ctaBtnText: e.target.value, ctaText: e.target.value })}
                                  />
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>連結類型</label>
                                  <select
                                    className="form-control"
                                    value={(newShowcase.ctaBtnLink || newShowcase.ctaLink || '').startsWith('http') ? 'external' : 'internal'}
                                    onChange={(e) => {
                                      const isExt = e.target.value === 'external';
                                      setNewShowcase({
                                        ...newShowcase,
                                        ctaBtnLink: isExt ? 'https://' : 'form',
                                        ctaLink: isExt ? 'https://' : 'form'
                                      });
                                    }}
                                  >
                                    <option value="internal">🔗 現有網站頁面</option>
                                    <option value="external">🌐 外部網站連結 (URL)</option>
                                  </select>
                                </div>

                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label" style={{ fontSize: '0.85rem' }}>
                                    {(newShowcase.ctaBtnLink || newShowcase.ctaLink || '').startsWith('http') ? '外部網址 (包含 https://)' : '選擇目標頁面'}
                                  </label>
                                  {(newShowcase.ctaBtnLink || newShowcase.ctaLink || '').startsWith('http') ? (
                                    <input
                                      type="url"
                                      className="form-control"
                                      placeholder="https://example.com"
                                      value={newShowcase.ctaBtnLink || newShowcase.ctaLink || 'https://'}
                                      onChange={(e) => setNewShowcase({ ...newShowcase, ctaBtnLink: e.target.value, ctaLink: e.target.value })}
                                    />
                                  ) : (
                                    <select
                                      className="form-control"
                                      value={newShowcase.ctaBtnLink || newShowcase.ctaLink || 'form'}
                                      onChange={(e) => setNewShowcase({ ...newShowcase, ctaBtnLink: e.target.value, ctaLink: e.target.value })}
                                    >
                                      <option value="form">📝 活動與表單 (form)</option>
                                      <option value="home">🏠 主頁 (home)</option>
                                      <option value="announcements">📢 公告專區 (announcements)</option>
                                      <option value="intro">🎬 雙欄介紹 (intro)</option>
                                      <option value="responses">💬 回應表單 (responses)</option>
                                      <option value="sponsors">🏢 贊助廠商 (sponsors)</option>
                                      <option value="admin">⚙️ 管理者後台 (admin)</option>
                                      {customPages.map(cp => (
                                        <option key={cp.id} value={cp.id}>📄 自訂頁面：{cp.title} ({cp.id})</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <button type="submit" className="btn btn-primary">
                            <Plus size={18} /> 新增此介紹項目
                          </button>
                        </form>
                      )}

                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)' }}>
                            現有介紹頁雙欄項目清單
                          </h3>

                          {/* 依主題切換篩選 */}
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>依主題過濾：</span>
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                className={`btn btn-xs ${showcaseCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setShowcaseCategoryFilter(cat)}
                                style={{ padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {showcaseItems
                            .filter(item => showcaseCategoryFilter === '全部' || item.category === showcaseCategoryFilter)
                            .map((item, idx) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: item.id === editingShowcase?.id ? '2px solid var(--accent-pink)' : '1px solid var(--border-glass)', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="badge badge-indigo" style={{ fontWeight: '700', fontSize: '0.85rem' }}>
                                  #{idx + 1} 順序
                                </span>
                                <span className="badge badge-pink" style={{ fontWeight: '700', fontSize: '0.82rem' }}>
                                  {item.category || '未分類'}
                                </span>
                                <img src={item.imageUrl} alt={item.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                <div>
                                  <h4 style={{ color: 'var(--text-title)', fontSize: '1.05rem' }}>{item.title}</h4>
                                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.subtitle || item.description}</p>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    moveShowcaseItem(item.id, 'up');
                                    showToast('⬆️ 已向上調整順序');
                                  }}
                                  title="向上移動排序"
                                  style={{ padding: '0.35rem 0.55rem', opacity: idx === 0 ? 0.4 : 1 }}
                                >
                                  <ArrowUp size={14} /> 上移
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  disabled={idx === showcaseItems.length - 1}
                                  onClick={() => {
                                    moveShowcaseItem(item.id, 'down');
                                    showToast('⬇️ 已向下調整順序');
                                  }}
                                  title="向下移動排序"
                                  style={{ padding: '0.35rem 0.55rem', opacity: idx === showcaseItems.length - 1 ? 0.4 : 1 }}
                                >
                                  <ArrowDown size={14} /> 下移
                                </button>
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => {
                                    setEditingShowcase({ 
                                      ...item, 
                                      highlightsText: (item.highlights || []).join(', ') 
                                    });
                                  }}
                                >
                                  <Edit3 size={14} /> 編輯
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    if (window.confirm(`確定要刪除「${item.title}」嗎？`)) {
                                      deleteShowcaseItem(item.id);
                                      showToast('已刪除介紹項目');
                                    }
                                  }}
                                >
                                  <Trash2 size={14} /> 刪除
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4️⃣ 編輯【活動與問卷頁】面板 */}
              {selectedEditPage === 'form' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* 活動與問卷頁編輯 Sub-Tabs */}
                  <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', border: '1.5px solid var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.04)' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-title)', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} color="var(--accent-emerald)" />
                      活動與問卷編輯選單：
                    </span>
                    <button 
                      type="button"
                      className={`btn btn-sm ${formSubTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setFormSubTab('settings')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      📝 活動限制與問卷時間選擇
                    </button>
                    <button 
                      type="button"
                      className={`btn btn-sm ${formSubTab === 'questions' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setFormSubTab('questions')}
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                    >
                      📋 自訂問卷題目編輯
                    </button>
                  </div>

                  {/* 1. 活動簡介、標題與時間選擇設定 */}
                  {formSubTab === 'settings' && (
                    <form onSubmit={handleSaveHeroEvent} className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText color="var(--accent-emerald)" size={22} />
                        📝 活動與問卷頁：頁頭標籤、大標題、時間選擇與截止提示字元
                      </h3>

                      <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                          🏷️ 頂部小標籤文字
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={heroForm.formPageBadge !== undefined ? heroForm.formPageBadge : '響應式動態問卷表單'}
                          onChange={(e) => setHeroForm({ ...heroForm, formPageBadge: e.target.value })}
                          placeholder="例如：響應式動態問卷表單"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">活動頁面大標題</label>
                        <input
                          type="text"
                          className="form-control"
                          value={heroForm.formPageTitle !== undefined ? heroForm.formPageTitle : '線上體驗回饋與動態表單'}
                          onChange={(e) => setHeroForm({ ...heroForm, formPageTitle: e.target.value })}
                          placeholder="例如：線上體驗回饋與動態表單"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">活動頁面副標題與說明文字</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={heroForm.formPageSubtitle !== undefined ? heroForm.formPageSubtitle : '請參考上方活動目的說明並填寫以下問卷，您的建議將幫助我們持續優化體驗。'}
                          onChange={(e) => setHeroForm({ ...heroForm, formPageSubtitle: e.target.value })}
                          placeholder="例如：請參考上方活動目的說明..."
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>
                            🔘 前往活動問卷按鈕顯示文字
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={heroForm.eventCtaText !== undefined ? heroForm.eventCtaText : '前往填寫活動表單'}
                            onChange={(e) => setHeroForm({ ...heroForm, eventCtaText: e.target.value })}
                            placeholder="例如：前往填寫活動表單"
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>
                            🔘 表單底部提交按鈕顯示文字
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={heroForm.formSubmitBtnText !== undefined ? heroForm.formSubmitBtnText : '送出問卷表單內容'}
                            onChange={(e) => setHeroForm({ ...heroForm, formSubmitBtnText: e.target.value })}
                            placeholder="例如：送出問卷表單內容"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">📌 活動名稱標題</label>
                        <input
                          type="text"
                          className="form-control"
                          value={eventForm.title || ''}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          placeholder="例如：2026 數位未來體驗設計高峰會與藝廊問卷調查"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">📍 活動地點 / 展覽場地說明 (選填，若留空前台將自動隱藏不顯示)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={eventForm.location !== undefined ? eventForm.location : ''}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          placeholder="例如：線上雲端展覽廳 & 台北數位藝術中心 (若留空前台會自動隱藏)"
                        />
                      </div>

                      {/* 📅 活動時間選擇器 (Datetimelocal Picker - 自動產生時間區間說明) */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                            活動開始時間與日期 (選單選擇)
                          </label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={eventForm.startDate || ''}
                            onChange={(e) => {
                              const sVal = e.target.value;
                              const eVal = eventForm.endDate || '';
                              const sFormatted = sVal ? sVal.replace('T', ' ') : '';
                              const eFormatted = eVal ? eVal.replace('T', ' ') : '';
                              let computedDateText = eventForm.dateText;
                              if (sFormatted && eFormatted) {
                                computedDateText = `${sFormatted} 至 ${eFormatted}`;
                              } else if (sFormatted) {
                                computedDateText = `從 ${sFormatted} 起`;
                              }
                              setEventForm({ 
                                ...eventForm, 
                                startDate: sVal,
                                dateText: computedDateText
                              });
                            }}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>
                            活動截止時間與日期 (選單選擇)
                          </label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={eventForm.endDate || ''}
                            onChange={(e) => {
                              const eVal = e.target.value;
                              const sVal = eventForm.startDate || '';
                              const sFormatted = sVal ? sVal.replace('T', ' ') : '';
                              const eFormatted = eVal ? eVal.replace('T', ' ') : '';
                              let computedDateText = eventForm.dateText;
                              if (sFormatted && eFormatted) {
                                computedDateText = `${sFormatted} 至 ${eFormatted}`;
                              } else if (eFormatted) {
                                computedDateText = `截至 ${eFormatted}`;
                              }
                              setEventForm({ 
                                ...eventForm, 
                                endDate: eVal,
                                deadlineText: eFormatted,
                                dateText: computedDateText
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">顯示於前台的活動時間說明文字 (會隨時間選擇自動更新，亦可手動微調)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={eventForm.dateText || ''}
                          onChange={(e) => setEventForm({ ...eventForm, dateText: e.target.value })}
                          placeholder="例如：2026-10-15 09:00 至 2026-10-20 18:00"
                        />
                      </div>

                      {/* 🔒 活動截止顯示提示字元與強制定制 */}
                      <div className="form-group" style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="checkbox"
                            id="checkIsExpiredForce"
                            checked={eventForm.isExpired || false}
                            onChange={(e) => setEventForm({ ...eventForm, isExpired: e.target.checked })}
                            style={{ width: '20px', height: '20px', accentColor: '#ef4444', cursor: 'pointer' }}
                          />
                          <label htmlFor="checkIsExpiredForce" style={{ color: '#ef4444', fontWeight: '800', fontSize: '1.02rem', cursor: 'pointer' }}>
                            🔒 強制設為【活動與問卷已截止】狀態 (關閉問卷填寫)
                          </label>
                        </div>

                        <div>
                          <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700', marginBottom: '0.4rem' }}>
                            ⚠️ 活動截止後前台顯示的自訂提示字元 (Notice Text)
                          </label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={eventForm.expiredNotice !== undefined ? eventForm.expiredNotice : '⚠️ 本次活動問卷填寫已正式截止！感謝廣大訪客熱情參與，敬請期待下一波重磅活動。'}
                            onChange={(e) => setEventForm({ ...eventForm, expiredNotice: e.target.value })}
                            placeholder="例如：⚠️ 本次活動問卷填寫已正式截止！"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                          📌 活動背景與填表目的【區塊標題】(包含 Emoji 標題，例如：🎯 🎯 活動背景與填表目的說明)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={eventForm.purposeTitle !== undefined ? eventForm.purposeTitle : '🎯 活動背景與填表目的說明'}
                          onChange={(e) => setEventForm({ ...eventForm, purposeTitle: e.target.value })}
                          placeholder="例如：🎯 🎯 活動背景與填表目的說明"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span>🎯 活動主題與填表目的說明內容 (支援 Enter 自由換行)</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>✨ 框框隨文字變多自動調整加大</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={Math.max(6, Math.min(30, (eventForm.purpose || '').split('\n').reduce((acc, line) => acc + Math.max(1, Math.ceil(line.length / 45)), 0)))}
                          style={{
                            minHeight: '180px',
                            lineHeight: '1.75',
                            resize: 'vertical',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit'
                          }}
                          value={eventForm.purpose || eventForm.eventPurpose || ''}
                          onChange={(e) => setEventForm({ ...eventForm, purpose: e.target.value, eventPurpose: e.target.value })}
                          placeholder="例如：感謝各位彈珠好手一直以來的熱情參與與支持...\n(在此輸入大段落說明與換行，前台將完整保留換行格式)"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700' }}>
                          📝 詳細活動補充說明內容 (選填，支援 Enter 自由換行)
                        </label>
                        <textarea
                          className="form-control"
                          rows={Math.max(4, Math.min(20, (eventForm.description || '').split('\n').reduce((acc, line) => acc + Math.max(1, Math.ceil(line.length / 45)), 0)))}
                          style={{
                            minHeight: '120px',
                            lineHeight: '1.65',
                            resize: 'vertical',
                            fontSize: '0.92rem',
                            fontFamily: 'inherit'
                          }}
                          value={eventForm.description || ''}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          placeholder="例如：本展覽匯集全球尖端設計師與生成式藝術家..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">🎁 填表獲獎/好禮說明標語</label>
                        <input
                          type="text"
                          className="form-control"
                          value={eventForm.rewardText || ''}
                          onChange={(e) => setEventForm({ ...eventForm, rewardText: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary">
                        <Save size={18} /> 儲存活動與問卷頁面截止時間與設定
                      </button>
                    </form>
                  )}

                  {/* 2. 自訂問卷題目編輯 (整合進活動與問卷頁版面編輯) */}
                  {formSubTab === 'questions' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {editingQuestion ? (
                        <div id="edit-form-question" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.04)', boxShadow: '0 0 35px rgba(16, 185, 129, 0.15)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <span className="badge badge-emerald" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                                ✏️ 題目內容編輯中
                              </span>
                              <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                                編輯自訂問卷題目：「{editingQuestion.title}」
                              </h3>
                            </div>
                            <button className="btn btn-secondary" onClick={() => setEditingQuestion(null)}>
                              <RotateCcw size={16} /> 關閉編輯並返回
                            </button>
                          </div>

                          <form onSubmit={handleSaveEditQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">問題名稱 / 題目內容</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editingQuestion.title || ''}
                                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">問題類型</label>
                                <select
                                  className="form-control"
                                  value={editingQuestion.type || 'text'}
                                  onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value })}
                                >
                                  <option value="text">單行短文字 (Text)</option>
                                  <option value="email">電子郵件 (Email)</option>
                                  <option value="textarea">多行長文字 (Textarea)</option>
                                  <option value="radio">單選題 (Radio)</option>
                                  <option value="rating">星級評分 (Rating 1-5)</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                                  💬 輸入框填寫提示詞 (Placeholder 提示字元)
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="例如：請輸入您的姓名..."
                                  value={editingQuestion.placeholder || ''}
                                  onChange={(e) => setEditingQuestion({ ...editingQuestion, placeholder: e.target.value })}
                                />
                              </div>

                              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', gridColumn: 'span 2' }}>
                                <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={editingQuestion.required || false}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, required: e.target.checked })}
                                    style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                                  />
                                  <span style={{ fontWeight: '600' }}>設定為必填項目</span>
                                </label>
                                <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={editingQuestion.hideInResponses || false}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, hideInResponses: e.target.checked })}
                                    style={{ accentColor: 'var(--accent-pink)', width: '18px', height: '18px' }}
                                  />
                                  <span style={{ fontWeight: '600', color: 'var(--accent-pink)' }}>🙈 不在回應數據頁面中展示此題答案 (hideInResponses)</span>
                                </label>
                              </div>
                            </div>

                            {editingQuestion.type === 'radio' && (
                              <div className="form-group">
                                <label className="form-label">單選題選項 (請用逗點分隔)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="例如：選項 A, 選項 B, 選項 C"
                                  value={editingQuestion.optionsText || ''}
                                  onChange={(e) => setEditingQuestion({ ...editingQuestion, optionsText: e.target.value })}
                                />
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                                <Save size={18} /> 儲存題目修改內容
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={() => setEditingQuestion(null)}>
                                取消
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <form onSubmit={handleAddQuestion} className="glass-panel" style={{ padding: '2rem' }}>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} color="var(--accent-emerald)" /> 新增自訂問卷題目
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                              <label className="form-label">問題名稱 / 題目內容</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：您最喜歡哪一類型的設計視覺？"
                                value={newQ.title}
                                onChange={(e) => setNewQ({ ...newQ, title: e.target.value })}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">問題類型</label>
                              <select
                                className="form-control"
                                value={newQ.type}
                                onChange={(e) => setNewQ({ ...newQ, type: e.target.value })}
                              >
                                <option value="text">單行短文字 (Text)</option>
                                <option value="email">電子郵件 (Email)</option>
                                <option value="textarea">多行長文字 (Textarea)</option>
                                <option value="radio">單選題 (Radio)</option>
                                <option value="rating">星級評分 (Rating 1-5)</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                                💬 輸入框填寫提示詞 (Placeholder 提示字元)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：請輸入您的姓名... 或 請分享您的看法..."
                                value={newQ.placeholder || ''}
                                onChange={(e) => setNewQ({ ...newQ, placeholder: e.target.value })}
                              />
                            </div>

                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', gridColumn: 'span 2' }}>
                              <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  checked={newQ.required}
                                  onChange={(e) => setNewQ({ ...newQ, required: e.target.checked })}
                                  style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                                />
                                <span style={{ fontWeight: '600' }}>設定為必填項目</span>
                              </label>
                              <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  checked={newQ.hideInResponses}
                                  onChange={(e) => setNewQ({ ...newQ, hideInResponses: e.target.checked })}
                                  style={{ accentColor: 'var(--accent-pink)', width: '18px', height: '18px' }}
                                />
                                <span style={{ fontWeight: '600', color: 'var(--accent-pink)' }}>🙈 不在回應數據頁面展示答案 (hideInResponses)</span>
                              </label>
                            </div>
                          </div>

                          {newQ.type === 'radio' && (
                            <div className="form-group">
                              <label className="form-label">單選題選項 (請用逗點分隔)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：選項 1, 選項 2, 選項 3"
                                value={newQ.optionsText}
                                onChange={(e) => setNewQ({ ...newQ, optionsText: e.target.value })}
                                required
                              />
                            </div>
                          )}

                          <button type="submit" className="btn btn-primary">
                            <Plus size={18} /> 新增此問卷題目
                          </button>
                        </form>
                      )}

                      <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                          現有自訂題目清單 (共 {formQuestions.length} 題)
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {formQuestions.map((q, idx) => (
                            <div key={q.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: q.id === editingQuestion?.id ? '2px solid var(--accent-emerald)' : '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                              <div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                  <span className="badge badge-emerald" style={{ fontWeight: '700', fontSize: '0.85rem' }}>
                                    第 {idx + 1} 題
                                  </span>
                                  <span className="badge badge-indigo">
                                    {q.type === 'text' ? '單行文字' : q.type === 'email' ? '電子郵件' : q.type === 'textarea' ? '長文字' : q.type === 'radio' ? '單選題' : '星級評分'}
                                  </span>
                                  {q.required && <span className="badge badge-pink">必填</span>}
                                  {q.hideInResponses && <span style={{ fontSize: '0.82rem', color: '#f43f5e', fontWeight: '700' }}>🙈 不顯示答案</span>}
                                </div>
                                <h4 style={{ color: 'var(--text-title)', fontSize: '1.1rem' }}>{q.title}</h4>
                                {q.type === 'radio' && q.options && (
                                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                    選項：{q.options.join(' / ')}
                                  </p>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => {
                                    setEditingQuestion({ 
                                      ...q, 
                                      optionsText: q.options ? q.options.join(', ') : ''
                                    });
                                  }}
                                >
                                  <Edit3 size={14} /> 編輯
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    if (window.confirm(`確定要刪除「${q.title}」這題嗎？`)) {
                                      deleteFormQuestion(q.id);
                                      showToast('已刪除該題目');
                                    }
                                  }}
                                >
                                  <Trash2 size={14} /> 刪除
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 5️⃣ 編輯【問卷回應頁】面板 */}
              {selectedEditPage === 'responses' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <form onSubmit={handleSaveHeroEvent} className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Layers color="var(--accent-indigo)" size={22} />
                      📊 問卷回應頁：頁頭標籤、大標題與說明文字編輯
                    </h3>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                        🏷️ 頂部小標籤文字
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.responsesPageBadge !== undefined ? heroForm.responsesPageBadge : '大家的回應與反饋'}
                        onChange={(e) => setHeroForm({ ...heroForm, responsesPageBadge: e.target.value })}
                        placeholder="例如：大家的回應與反饋"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">問卷回應頁大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.responsesPageTitle !== undefined ? heroForm.responsesPageTitle : '表單回應數據記錄'}
                        onChange={(e) => setHeroForm({ ...heroForm, responsesPageTitle: e.target.value })}
                        placeholder="例如：表單回應數據記錄"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">問卷回應頁副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={heroForm.responsesPageSubtitle !== undefined ? heroForm.responsesPageSubtitle : '查看訪客所提交的完整問卷資料。下方提供 1, 2, 3... 頁碼分頁切換與搜尋功能。'}
                        onChange={(e) => setHeroForm({ ...heroForm, responsesPageSubtitle: e.target.value })}
                        placeholder="例如：查看訪客所提交的完整問卷資料..."
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <Save size={18} /> 儲存問卷回應頁面文字設定
                    </button>
                  </form>
                </div>
              )}

              {/* 6️⃣ 編輯【贊助廠商頁】面板 */}
              {selectedEditPage === 'sponsors' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* 頁面標題與文字設定 */}
                  <form onSubmit={handleSaveHeroEvent} className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award color="var(--accent-amber)" size={22} />
                      贊助廠商頁：頁頭標籤、大標題與說明文字編輯
                    </h3>

                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                        頂部小標籤文字
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.sponsorsPageBadge !== undefined ? heroForm.sponsorsPageBadge : '合作夥伴與贊助單位'}
                        onChange={(e) => setHeroForm({ ...heroForm, sponsorsPageBadge: e.target.value })}
                        placeholder="例如：合作夥伴與贊助單位"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">贊助廠商頁大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.sponsorsPageTitle !== undefined ? heroForm.sponsorsPageTitle : '感謝盛情贊助與支持夥伴'}
                        onChange={(e) => setHeroForm({ ...heroForm, sponsorsPageTitle: e.target.value })}
                        placeholder="例如：感謝盛情贊助與支持夥伴"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">贊助廠商頁副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={heroForm.sponsorsPageSubtitle !== undefined ? heroForm.sponsorsPageSubtitle : '感謝以下各界優秀企業與團體贊助支持，攜手共創前沿數位體驗與創新視覺。'}
                        onChange={(e) => setHeroForm({ ...heroForm, sponsorsPageSubtitle: e.target.value })}
                        placeholder="例如：感謝以下各界優秀企業與團體贊助支持..."
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <Save size={18} /> 儲存贊助廠商頁面文字設定
                    </button>
                  </form>

                  {/* 編輯 / 新增 贊助廠商 */}
                  {editingSponsor ? (
                    <div id="edit-form-sponsor" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-amber)', background: 'rgba(245, 158, 11, 0.04)', boxShadow: '0 0 35px rgba(245, 158, 11, 0.15)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <span className="badge badge-amber" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                            編輯贊助廠商中
                          </span>
                          <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                            編輯贊助廠商：「{editingSponsor.name}」
                          </h3>
                        </div>
                        <button className="btn btn-secondary" onClick={() => setEditingSponsor(null)}>
                          <RotateCcw size={16} /> 關閉編輯並返回
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditSponsor}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700' }}>廠商 / 單位名稱</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editingSponsor.name}
                              onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700' }}>贊助層級 / 分類標籤</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editingSponsor.category || ''}
                              onChange={(e) => setEditingSponsor({ ...editingSponsor, category: e.target.value })}
                              placeholder="例如：白金贊助商、金牌贊助商、合作夥伴"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">廠商頭像 / Logo 圖片 (支援電腦檔案上傳與網址)</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                              <Upload size={16} /> 上傳電腦中的頭像/Logo 圖片
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, (url) => setEditingSponsor({ ...editingSponsor, avatarUrl: url }))}
                              />
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="或輸入圖片網址 (https://...)"
                              value={editingSponsor.avatarUrl || ''}
                              onChange={(e) => setEditingSponsor({ ...editingSponsor, avatarUrl: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">廠商簡介與詳細說明敘述</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={editingSponsor.description || ''}
                            onChange={(e) => setEditingSponsor({ ...editingSponsor, description: e.target.value })}
                            placeholder="請輸入廠商簡介與贊助說明文字..."
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">官方網站連結 (選填)</label>
                          <input
                            type="url"
                            className="form-control"
                            value={editingSponsor.websiteUrl || ''}
                            onChange={(e) => setEditingSponsor({ ...editingSponsor, websiteUrl: e.target.value })}
                            placeholder="例如：https://example.com"
                          />
                        </div>

                        {/* 🎯 圖片彈窗對應的自訂標籤與視覺規格 */}
                        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.03)' }}>
                          <h4 style={{ fontSize: '1rem', color: 'var(--accent-pink)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={16} /> 🖼️ 圖片彈窗對應標籤與自訂展件規格 (點擊彈窗時呈現)
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-pink)' }}>粉紅小標籤 (tag)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：精選贊助"
                                value={editingSponsor.tag || ''}
                                onChange={(e) => setEditingSponsor({ ...editingSponsor, tag: e.target.value })}
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>青色主題標籤 (用逗號隔開)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="例如：白金夥伴, 雲端運算"
                                value={editingSponsor.badgesText !== undefined ? editingSponsor.badgesText : (editingSponsor.badges ? editingSponsor.badges.join(', ') : '')}
                                onChange={(e) => setEditingSponsor({ ...editingSponsor, badgesText: e.target.value })}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.85rem' }}>解析度規格 (選填，如非必填可留空)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="留空則不顯示，例如：4K HDR 深度漸層"
                                value={editingSponsor.specResolution || ''}
                                onChange={(e) => setEditingSponsor({ ...editingSponsor, specResolution: e.target.value })}
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.85rem' }}>響應式說明 (選填，如非必填可留空)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="留空則不顯示，例如：支援全螢幕與手勢縮放"
                                value={editingSponsor.specResponsive || ''}
                                onChange={(e) => setEditingSponsor({ ...editingSponsor, specResponsive: e.target.value })}
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.85rem' }}>主題屬性說明 (選填，如非必填可留空)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="留空則不顯示，例如：精選展示"
                                value={editingSponsor.specTheme || ''}
                                onChange={(e) => setEditingSponsor({ ...editingSponsor, specTheme: e.target.value })}
                              />
                            </div>
                          </div>

                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(editingSponsor.hideSpecs)}
                              onChange={(e) => setEditingSponsor({ ...editingSponsor, hideSpecs: e.target.checked })}
                              style={{ accentColor: 'var(--accent-pink)' }}
                            />
                            隱藏彈窗內的「展件技術亮點與視覺規格」區塊
                          </label>

                          {/* 彈窗按鈕自訂區塊 (編輯贊助商) */}
                          <div style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-indigo)', marginTop: '0.75rem' }}>
                            <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-indigo)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <MousePointer size={16} />
                              🔘 圖片彈窗按鈕自訂 (自訂按鈕文字與跳轉連結)
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  id={`showActionBtn_sp_${editingSponsor.id}`}
                                  checked={editingSponsor.showActionBtn !== false}
                                  onChange={(e) => setEditingSponsor({ ...editingSponsor, showActionBtn: e.target.checked })}
                                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
                                />
                                <label htmlFor={`showActionBtn_sp_${editingSponsor.id}`} style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                                  顯示彈窗主要按鈕 (預設開啟)
                                </label>
                              </div>

                              {editingSponsor.showActionBtn !== false && (
                                <>
                                  <div>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>主要按鈕顯示文字 (留白則使用造訪官網或全站預設)：</span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editingSponsor.actionBtnText || ''}
                                      onChange={(e) => setEditingSponsor({ ...editingSponsor, actionBtnText: e.target.value })}
                                      placeholder="例如：造訪官方網站、查看贊助細節..."
                                    />
                                  </div>

                                  <div>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>主要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                    {renderLinkSelector(
                                      '',
                                      editingSponsor.actionBtnLink || (editingSponsor.websiteUrl || 'intro'),
                                      (val) => setEditingSponsor({ ...editingSponsor, actionBtnLink: val })
                                    )}
                                  </div>
                                </>
                              )}

                              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-glass)' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>次要按鈕顯示文字 (選填)：</span>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editingSponsor.secondaryBtnText || ''}
                                  onChange={(e) => setEditingSponsor({ ...editingSponsor, secondaryBtnText: e.target.value })}
                                  placeholder="例如：下載合作簡報 / 聯繫我們"
                                />
                              </div>

                              {editingSponsor.secondaryBtnText && (
                                <div>
                                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>次要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                  {renderLinkSelector(
                                    '',
                                    editingSponsor.secondaryBtnLink || '',
                                    (val) => setEditingSponsor({ ...editingSponsor, secondaryBtnLink: val })
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                          <Save size={18} /> 儲存贊助廠商變更
                        </button>
                      </form>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newSponsor.name) return;
                        const badges = newSponsor.badgesText
                          ? newSponsor.badgesText.split(',').map(s => s.trim()).filter(Boolean)
                          : [];
                        addSponsor({
                          ...newSponsor,
                          badges
                        });
                        setNewSponsor({
                          name: '',
                          category: '白金贊助商',
                          avatarUrl: '',
                          description: '',
                          websiteUrl: '',
                          tag: '',
                          badgesText: '',
                          specResolution: '',
                          specResponsive: '',
                          specTheme: '',
                          hideSpecs: false
                        });
                        showToast('✨ 已成功新增贊助廠商！');
                      }} 
                      className="glass-panel" 
                      style={{ padding: '2.5rem', border: '1.5px solid var(--accent-amber)', background: 'rgba(245, 158, 11, 0.03)' }}
                    >
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus color="var(--accent-amber)" size={22} />
                        新增贊助廠商 / 合作單位
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '700' }}>廠商 / 單位名稱</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="例如：賽博前沿科技 CyberFrontier Inc."
                            value={newSponsor.name}
                            onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '700' }}>贊助層級 / 分類標籤</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="例如：白金贊助商、金牌贊助商"
                            value={newSponsor.category}
                            onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">廠商頭像 / Logo 圖片 (支援電腦檔案上傳與網址)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                            <Upload size={16} /> 上傳電腦中的頭像/Logo 圖片
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, (url) => setNewSponsor({ ...newSponsor, avatarUrl: url }))}
                            />
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="或輸入圖片網址 (https://...)"
                            value={newSponsor.avatarUrl}
                            onChange={(e) => setNewSponsor({ ...newSponsor, avatarUrl: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">廠商簡介與文字敘述</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="請輸入廠商簡介與詳細介紹敘述..."
                          value={newSponsor.description}
                          onChange={(e) => setNewSponsor({ ...newSponsor, description: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">官方網站連結 (選填)</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="例如：https://example.com"
                          value={newSponsor.websiteUrl}
                          onChange={(e) => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
                        />
                      </div>

                      {/* 🎯 圖片彈窗對應的自訂標籤與視覺規格 */}
                      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.03)' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--accent-pink)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Sparkles size={16} /> 🖼️ 圖片彈窗對應標籤與自訂展件規格 (點擊彈窗時呈現)
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-pink)' }}>粉紅小標籤 (tag)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="例如：精選贊助"
                              value={newSponsor.tag}
                              onChange={(e) => setNewSponsor({ ...newSponsor, tag: e.target.value })}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>青色主題標籤 (用逗號隔開)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="例如：白金夥伴, 雲端運算"
                              value={newSponsor.badgesText}
                              onChange={(e) => setNewSponsor({ ...newSponsor, badgesText: e.target.value })}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>解析度規格 (選填，如非必填可留空)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="留空則不顯示"
                              value={newSponsor.specResolution}
                              onChange={(e) => setNewSponsor({ ...newSponsor, specResolution: e.target.value })}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>響應式說明 (選填，如非必填可留空)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="留空則不顯示"
                              value={newSponsor.specResponsive}
                              onChange={(e) => setNewSponsor({ ...newSponsor, specResponsive: e.target.value })}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>主題屬性說明 (選填，如非必填可留空)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="留空則不顯示"
                              value={newSponsor.specTheme}
                              onChange={(e) => setNewSponsor({ ...newSponsor, specTheme: e.target.value })}
                            />
                          </div>
                        </div>

                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(newSponsor.hideSpecs)}
                            onChange={(e) => setNewSponsor({ ...newSponsor, hideSpecs: e.target.checked })}
                            style={{ accentColor: 'var(--accent-pink)' }}
                          />
                          隱藏彈窗內的「展件技術亮點與視覺規格」區塊
                        </label>

                        {/* 彈窗按鈕自訂區塊 (新增贊助商) */}
                        <div style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-indigo)', marginTop: '0.75rem' }}>
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-indigo)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MousePointer size={16} />
                            🔘 圖片彈窗按鈕自訂 (自訂按鈕文字與跳轉連結)
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input
                                type="checkbox"
                                id="showActionBtn_sp_new"
                                checked={newSponsor.showActionBtn !== false}
                                onChange={(e) => setNewSponsor({ ...newSponsor, showActionBtn: e.target.checked })}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
                              />
                              <label htmlFor="showActionBtn_sp_new" style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                                顯示彈窗主要按鈕 (預設開啟)
                              </label>
                            </div>

                            {newSponsor.showActionBtn !== false && (
                              <>
                                <div>
                                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>主要按鈕顯示文字 (留白則使用造訪官網或全站預設)：</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={newSponsor.actionBtnText || ''}
                                    onChange={(e) => setNewSponsor({ ...newSponsor, actionBtnText: e.target.value })}
                                    placeholder="例如：造訪官方網站、查看贊助細節..."
                                  />
                                </div>

                                <div>
                                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>主要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                  {renderLinkSelector(
                                    '',
                                    newSponsor.actionBtnLink || (newSponsor.websiteUrl || 'intro'),
                                    (val) => setNewSponsor({ ...newSponsor, actionBtnLink: val })
                                  )}
                                </div>
                              </>
                            )}

                            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-glass)' }}>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>次要按鈕顯示文字 (選填)：</span>
                              <input
                                type="text"
                                className="form-control"
                                value={newSponsor.secondaryBtnText || ''}
                                onChange={(e) => setNewSponsor({ ...newSponsor, secondaryBtnText: e.target.value })}
                                placeholder="例如：下載合作簡報 / 聯繫我們"
                              />
                            </div>

                            {newSponsor.secondaryBtnText && (
                              <div>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>次要按鈕跳轉頁面 / 外部網址 (可選取目前現有頁面或自訂網址)：</span>
                                {renderLinkSelector(
                                  '',
                                  newSponsor.secondaryBtnLink || '',
                                  (val) => setNewSponsor({ ...newSponsor, secondaryBtnLink: val })
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        <Plus size={18} /> 新增此贊助廠商
                      </button>
                    </form>
                  )}

                  {/* 贊助廠商管理清單 */}
                  <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                      贊助廠商管理清單 (共 {sponsors.length} 家)
                    </h3>

                    {(!sponsors || sponsors.length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        目前尚無贊助廠商資料。請使用上方表單建立第一個贊助廠商。
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {sponsors.map((item) => (
                          <div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {item.avatarUrl ? (
                                      <img src={item.avatarUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <Building2 size={24} color="var(--accent-pink)" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="badge badge-amber" style={{ fontSize: '0.75rem', marginBottom: '0.2rem', display: 'inline-block' }}>
                                      {item.category || '贊助商'}
                                    </span>
                                    <h4 style={{ color: 'var(--text-title)', fontSize: '1.05rem', fontWeight: '700' }}>{item.name}</h4>
                                  </div>
                                </div>
                              </div>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                                {item.description}
                              </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setEditingSponsor(item);
                                  window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                              >
                                <Edit3 size={14} /> 編輯
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  if (window.confirm(`確定要刪除「${item.name}」贊助廠商嗎？`)) {
                                    deleteSponsor(item.id);
                                    showToast('已刪除該贊助廠商');
                                  }
                                }}
                              >
                                <Trash2 size={14} /> 刪除
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 自訂動態頁面與選單管理 Panel */}
          {activeAdminTab === 'custom_pages' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2.5rem', border: '1.5px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="badge badge-cyan" style={{ marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} /> ✨ 自訂動態頁面 CMS
                    </span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-title)' }}>
                      新增與管理自訂動態頁面 (組裝多重模組)
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.4rem' }}>
                      您可以自由建立無限個自訂頁面，指定導覽列/頁尾選單名稱、頁面標題與小標籤，並勾選組合多種內容模組（文字模組、雙欄模組、圖片輪播模組、問卷表單模組）。
                    </p>
                  </div>
                </div>

                {editingCustomPage ? (
                  <form onSubmit={handleSaveEditCustomPage} className="glass-panel" style={{ padding: '2rem', border: '2px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', fontWeight: '700' }}>
                        ✏️ 正在編輯自訂頁面：「{editingCustomPage.pageTitle || editingCustomPage.navLabel}」
                      </h3>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingCustomPage(null)}>
                        <RotateCcw size={14} /> 取消編輯
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                          📌 導覽列與頁尾選單名稱
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：關於我們 / 聯絡資訊"
                          value={editingCustomPage.navLabel || ''}
                          onChange={(e) => setEditingCustomPage({ ...editingCustomPage, navLabel: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>
                          🏷️ 頁面小標籤 (Badge)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：團隊簡介"
                          value={editingCustomPage.pageBadge || ''}
                          onChange={(e) => setEditingCustomPage({ ...editingCustomPage, pageBadge: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>
                          🏠 頁面大標題 (Title)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：歡迎來到我們的數位創新工作室"
                          value={editingCustomPage.pageTitle || ''}
                          onChange={(e) => setEditingCustomPage({ ...editingCustomPage, pageTitle: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">📝 頁面說明與副標題 (Subtitle)</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="例如：我們專注於打造前沿視覺體驗..."
                          value={editingCustomPage.pageSubtitle || ''}
                          onChange={(e) => setEditingCustomPage({ ...editingCustomPage, pageSubtitle: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* 模組選擇與配置區 */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={18} color="var(--accent-cyan)" />
                        🧩 選擇此頁面欲新增嵌入的內容模組：
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(editingCustomPage.showTextModule)}
                            onChange={(e) => setEditingCustomPage({ ...editingCustomPage, showTextModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-pink)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>📄 文字說明模塊</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(editingCustomPage.showIntroModule)}
                            onChange={(e) => setEditingCustomPage({ ...editingCustomPage, showIntroModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-cyan)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>🎬 雙欄互動模塊</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(editingCustomPage.showCarouselModule)}
                            onChange={(e) => setEditingCustomPage({ ...editingCustomPage, showCarouselModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-amber)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>🖼️ 圖片輪播藝廊模塊</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(editingCustomPage.showFormModule)}
                            onChange={(e) => setEditingCustomPage({ ...editingCustomPage, showFormModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-emerald)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>📝 問卷表單模塊</span>
                        </label>
                      </div>

                      {editingCustomPage.showTextModule && (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                            📄 自訂專頁文字內容 (支援 Enter 自由換行)
                          </label>
                          <textarea
                            className="form-control"
                            rows={5}
                            placeholder="請在此輸入頁面文字內容..."
                            value={editingCustomPage.textContent || ''}
                            onChange={(e) => setEditingCustomPage({ ...editingCustomPage, textContent: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">
                        <Save size={18} /> 儲存此頁面修改
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditingCustomPage(null)}>
                        取消
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddCustomPage} className="glass-panel" style={{ padding: '2rem', border: '1.5px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.03)' }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={20} color="var(--accent-cyan)" /> 建立全新自訂動態頁面
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                          📌 導覽列與頁尾選單顯示名稱
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：關於我們"
                          value={newCustomPage.navLabel}
                          onChange={(e) => setNewCustomPage({ ...newCustomPage, navLabel: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>
                          🏷️ 頁面頂部小標籤 (Badge)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：團隊介紹"
                          value={newCustomPage.pageBadge}
                          onChange={(e) => setNewCustomPage({ ...newCustomPage, pageBadge: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>
                          🏠 頁面大標題 (Title)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：攜手打造下一代網頁體驗"
                          value={newCustomPage.pageTitle}
                          onChange={(e) => setNewCustomPage({ ...newCustomPage, pageTitle: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">📝 頁面副標題與說明 (Subtitle)</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="例如：在此輸入關於此頁面的詳細背景說明..."
                          value={newCustomPage.pageSubtitle}
                          onChange={(e) => setNewCustomPage({ ...newCustomPage, pageSubtitle: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* 模組選擇 */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={18} color="var(--accent-cyan)" />
                        🧩 勾選此頁面欲新增嵌入的模組：
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={newCustomPage.showTextModule}
                            onChange={(e) => setNewCustomPage({ ...newCustomPage, showTextModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-pink)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>📄 文字說明模塊</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={newCustomPage.showIntroModule}
                            onChange={(e) => setNewCustomPage({ ...newCustomPage, showIntroModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-cyan)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>🎬 雙欄互動模塊</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={newCustomPage.showCarouselModule}
                            onChange={(e) => setNewCustomPage({ ...newCustomPage, showCarouselModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-amber)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>🖼️ 圖片輪播藝廊模塊</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                          <input
                            type="checkbox"
                            checked={newCustomPage.showFormModule}
                            onChange={(e) => setNewCustomPage({ ...newCustomPage, showFormModule: e.target.checked })}
                            style={{ accentColor: 'var(--accent-emerald)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>📝 問卷表單模塊</span>
                        </label>
                      </div>

                      {newCustomPage.showTextModule && (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                            📄 自訂專頁文字內容 (支援 Enter 自由換行)
                          </label>
                          <textarea
                            className="form-control"
                            rows={4}
                            placeholder="輸入此自訂頁面的詳細文字內容..."
                            value={newCustomPage.textContent}
                            onChange={(e) => setNewCustomPage({ ...newCustomPage, textContent: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <Plus size={18} /> 建立此自訂頁面
                    </button>
                  </form>
                )}

                {/* 已建立的自訂頁面清單 */}
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem' }}>
                    現有自訂頁面列表 (共 {customPages.length} 個自訂頁面)
                  </h3>

                  {(!customPages || customPages.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      目前尚未建立任何自訂頁面。請使用上方表單建立第一個動態頁面。
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                      {customPages.map((page) => (
                        <div key={page.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                              <span className="badge badge-cyan">{page.navLabel || '選單項目'}</span>
                              {page.pageBadge && <span className="badge badge-pink">{page.pageBadge}</span>}
                            </div>
                            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-title)', fontWeight: '700', marginBottom: '0.5rem' }}>
                              {page.pageTitle}
                            </h4>
                            {page.pageSubtitle && (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                                {page.pageSubtitle}
                              </p>
                            )}

                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                              {page.showTextModule && <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>📄 文字</span>}
                              {page.showIntroModule && <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>🎬 雙欄</span>}
                              {page.showCarouselModule && <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>🖼️ 輪播</span>}
                              {page.showFormModule && <span className="badge badge-pink" style={{ fontSize: '0.75rem' }}>📝 表單</span>}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setEditingCustomPage(page);
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                            >
                              <Edit3 size={14} /> 編輯
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (window.confirm(`確定要刪除「${page.navLabel || page.pageTitle}」自訂頁面嗎？`)) {
                                  deleteCustomPage(page.id);
                                  showToast('已成功刪除該自訂頁面');
                                }
                              }}
                            >
                              <Trash2 size={14} /> 刪除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: 自訂網站 Logo 圖示、品牌名稱與頁尾標語 */}
          {activeAdminTab === 'branding_footer' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <form onSubmit={handleSaveBranding} className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe color="var(--accent-primary)" size={22} />
                  全站 Title 網頁標題、導覽列 Logo/品牌與頁尾標語設定 (依視覺由上至下排列)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {/* 網頁最頂部：分頁標題 & Favicon 小圖示 (Browser Tab Title & Favicon Icon) */}
                  <div style={{ background: 'rgba(236, 72, 153, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏷️ 網頁最頂部分頁標題 (Browser Tab Title)
                      </label>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        自訂顯示於瀏覽器分頁標題列 (&lt;title&gt;) 的動態文字。
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：2026 全方位動態 CMS 平台 | 響應式雙模式藝廊"
                        value={brandingForm.documentTitle !== undefined ? brandingForm.documentTitle : ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, documentTitle: e.target.value })}
                      />
                    </div>

                    {/* 🌐 Favicon 分頁小圖示自訂 */}
                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                      <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🌐 網頁 Favicon 分頁小圖示 (Browser Tab Favicon Icon)
                      </label>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        自訂顯示於瀏覽器分頁左側的小圖示 Favicon（支援電腦圖片檔案上傳與網址；若未設定則自動使用 Logo 圖示）。
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                            <Upload size={16} /> 📁 上傳電腦中的 Favicon 圖示
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, (url) => setBrandingForm({ ...brandingForm, faviconUrl: url }))}
                            />
                          </label>
                          {brandingForm.faviconUrl && (
                            <button type="button" onClick={() => setBrandingForm({ ...brandingForm, faviconUrl: '' })} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}>
                              🗑️ 清除 Favicon (自動防護回退至 Logo 圖示)
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="或貼上 Favicon 圖片網址 (https://...)"
                          value={brandingForm.faviconUrl || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, faviconUrl: e.target.value })}
                        />

                        {(brandingForm.faviconUrl || brandingForm.logoUrl) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0, 0, 0, 0.2)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                            <img src={brandingForm.faviconUrl || brandingForm.logoUrl} alt="Favicon 預覽" style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              當前分頁 Favicon 預覽 ({brandingForm.faviconUrl ? '自訂 Favicon' : '自動使用 Logo'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 上方區域：頂部導覽列 (Logo 圖示 / 品牌名稱 / 選單連結) */}
                  <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <label className="form-label" style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🧩 頂部導覽列區域 (Logo 圖示、品牌名稱與選單按鍵)
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                      {/* Logo 圖示 / 圖片上傳區塊 */}
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>🖼️ 網站 Logo 圖示 (支援電腦圖片上傳 / 網址連結)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                              <Upload size={16} /> 📁 上傳電腦中的 Logo 圖片
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, (url) => setBrandingForm({ ...brandingForm, logoUrl: url }))}
                              />
                            </label>
                            {brandingForm.logoUrl && (
                              <button type="button" onClick={() => setBrandingForm({ ...brandingForm, logoUrl: '' })} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}>
                                🗑️ 清除/恢復預設圖示
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="或輸入/貼上 Logo 圖片網址 (https://...)"
                            value={brandingForm.logoUrl || ''}
                            onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                          />

                          {brandingForm.logoUrl && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0, 0, 0, 0.2)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                              <img src={brandingForm.logoUrl} alt="Logo 預覽" style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'transparent', borderRadius: '8px' }} />
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>即時預覽自訂 Logo 圖示</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 網站品牌顯示名稱 */}
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>🏷️ 網站品牌顯示名稱 (Header Brand Name)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：我的專屬藝廊網站"
                          value={brandingForm.name}
                          onChange={(e) => setBrandingForm({ ...brandingForm, name: e.target.value })}
                          required
                        />
                      </div>

                      {/* 🔗 導覽列與分頁 Icon 圖示 / 文字自訂 */}
                      <div className="form-group" style={{ gridColumn: 'span 2', background: 'rgba(0, 0, 0, 0.15)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                        <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Layers size={18} color="var(--accent-pink)" />
                          🔗 導覽列與分頁 Icon 圖示 & 文字名稱自訂 (Nav Page Icon & Label Editor)
                        </label>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          管理者可在此自由修訂頂部導覽列 6 大分頁（主頁、公告、表單、介紹、回應、後台）的「顯示名稱」與「專屬 Icon 圖示」。
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                          {/* 主頁分頁 */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                              🏠 主頁 (Home)
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                value={brandingForm.navHomeLabel || ''}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navHomeLabel: e.target.value })}
                                placeholder="主頁"
                              />
                              <select
                                className="form-control"
                                value={brandingForm.navHomeIcon || 'LayoutGrid'}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navHomeIcon: e.target.value })}
                              >
                                <option value="LayoutGrid">網格 (LayoutGrid)</option>
                                <option value="Home">房屋 (Home)</option>
                                <option value="Sparkles">星星 (Sparkles)</option>
                                <option value="Globe">地球 (Globe)</option>
                                <option value="Compass">指南針 (Compass)</option>
                                <option value="Zap">閃電 (Zap)</option>
                              </select>
                            </div>
                          </div>

                          {/* 公告專區分頁 */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                              📢 公告專區 (Announcements)
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                value={brandingForm.navAnnouncementsLabel || ''}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navAnnouncementsLabel: e.target.value })}
                                placeholder="公告專區"
                              />
                              <select
                                className="form-control"
                                value={brandingForm.navAnnouncementsIcon || 'Megaphone'}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navAnnouncementsIcon: e.target.value })}
                              >
                                <option value="Megaphone">擴音器 (Megaphone)</option>
                                <option value="Bell">鈴鐺 (Bell)</option>
                                <option value="Sparkles">星星 (Sparkles)</option>
                                <option value="Globe">地球 (Globe)</option>
                                <option value="Info">資訊 (Info)</option>
                              </select>
                            </div>
                          </div>

                          {/* 活動與表單分頁 */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                              📝 活動與表單 (Form)
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                value={brandingForm.navFormLabel || ''}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navFormLabel: e.target.value })}
                                placeholder="活動與表單"
                              />
                              <select
                                className="form-control"
                                value={brandingForm.navFormIcon || 'FileText'}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navFormIcon: e.target.value })}
                              >
                                <option value="FileText">表單 (FileText)</option>
                                <option value="ClipboardList">問卷清單 (ClipboardList)</option>
                                <option value="CheckSquare">勾選方塊 (CheckSquare)</option>
                                <option value="Star">星星 (Star)</option>
                                <option value="Heart">愛心 (Heart)</option>
                              </select>
                            </div>
                          </div>

                          {/* 雙欄介紹分頁 */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                              🎬 雙欄介紹 (Intro)
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                value={brandingForm.navIntroLabel || ''}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navIntroLabel: e.target.value })}
                                placeholder="介紹 (雙欄輪播)"
                              />
                              <select
                                className="form-control"
                                value={brandingForm.navIntroIcon || 'Info'}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navIntroIcon: e.target.value })}
                              >
                                <option value="Info">資訊 (Info)</option>
                                <option value="Film">影片/GIF (Film)</option>
                                <option value="Layers">圖層 (Layers)</option>
                                <option value="Sparkles">星星 (Sparkles)</option>
                                <option value="Smile">笑臉 (Smile)</option>
                              </select>
                            </div>
                          </div>

                          {/* 回應表單分頁 */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                              📊 回應表單 (Responses)
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                value={brandingForm.navResponsesLabel || ''}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navResponsesLabel: e.target.value })}
                                placeholder="回應表單 (分頁觀看)"
                              />
                              <select
                                className="form-control"
                                value={brandingForm.navResponsesIcon || 'MessageSquareText'}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navResponsesIcon: e.target.value })}
                              >
                                <option value="MessageSquareText">對話框 (MessageSquareText)</option>
                                <option value="BarChart2">圖表數據 (BarChart2)</option>
                                <option value="ClipboardList">問卷清單 (ClipboardList)</option>
                                <option value="CheckSquare">勾選 (CheckSquare)</option>
                              </select>
                            </div>
                          </div>

                          {/* 管理者後台分頁 */}
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                              ⚙️ 管理者後台 (Admin)
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                value={brandingForm.navAdminLabel || ''}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navAdminLabel: e.target.value })}
                                placeholder="管理者後台"
                              />
                              <select
                                className="form-control"
                                value={brandingForm.navAdminIcon || 'Settings'}
                                onChange={(e) => setBrandingForm({ ...brandingForm, navAdminIcon: e.target.value })}
                              >
                                <option value="Settings">齒輪設定 (Settings)</option>
                                <option value="Shield">盾牌 (Shield)</option>
                                <option value="ShieldCheck">安全盾牌 (ShieldCheck)</option>
                                <option value="Zap">閃電 (Zap)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 最下方區域：頁尾標語與版權宣告 (Footer Slogan & Copyright) */}
                  <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🔻 最下方區域：頁尾 (頁尾標語與版權宣告)
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">最下方頁尾標語文字 (Footer Slogan)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：響應式現代設計視覺系統"
                          value={brandingForm.footerText || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, footerText: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
                          ©️ 頁尾版權宣告文字 (Footer Copyright Text)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：© 2026 狐狐. All rights reserved. 支援電腦、平板與手機螢幕最適適應。"
                          value={brandingForm.copyrightText !== undefined ? brandingForm.copyrightText : ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, copyrightText: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                  <Save size={18} /> 儲存網站 Title、Logo 圖示、導覽列與頁尾設定
                </button>
              </form>

              {/* 全站各分頁頁頭大標題與說明文字自訂面板 */}
              <form onSubmit={handleSaveHeroEvent} className="glass-panel" style={{ padding: '2.5rem', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.03)' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles color="var(--accent-pink)" size={22} />
                  全站所有分頁頁頭大標題與說明文字自訂
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  管理者可在此自由修改全站各個分頁 (公告專區、雙欄介紹、活動與表單、問卷回應) 頂部展示的「標題」與「說明文字」。
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {/* 公告專區 */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Megaphone size={16} /> 公告專區頁面頁頭
                    </h4>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: '700' }}>頂部小標籤文字</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.announcementsPageBadge !== undefined ? heroForm.announcementsPageBadge : '網站最新與歷年公告紀錄專區'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPageBadge: e.target.value })}
                        placeholder="例如：網站最新與歷年公告紀錄專區"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.announcementsPageTitle !== undefined ? heroForm.announcementsPageTitle : '即時公告與歷史發布消息'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPageTitle: e.target.value })}
                        placeholder="例如：即時公告與歷史發布消息"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={heroForm.announcementsPageSubtitle !== undefined ? heroForm.announcementsPageSubtitle : '在此查看網站最新的活動通知、系統維護更新與歷年歷史發布公告。點擊任意公告卡片即可開啟整頁面文章閱讀。'}
                        onChange={(e) => setHeroForm({ ...heroForm, announcementsPageSubtitle: e.target.value })}
                        placeholder="例如：在此查看網站最新的活動通知..."
                      />
                    </div>
                  </div>

                  {/* 雙欄介紹頁 */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-pink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Film size={16} /> 雙欄介紹頁面頁頭
                    </h4>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: '700' }}>頂部小標籤文字</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.showcasePageBadge !== undefined ? heroForm.showcasePageBadge : '專題視覺與技術詳細介紹'}
                        onChange={(e) => setHeroForm({ ...heroForm, showcasePageBadge: e.target.value })}
                        placeholder="例如：專題視覺與技術詳細介紹"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.showcasePageTitle !== undefined ? heroForm.showcasePageTitle : '雙欄同步互動輪播展示'}
                        onChange={(e) => setHeroForm({ ...heroForm, showcasePageTitle: e.target.value })}
                        placeholder="例如：雙欄同步互動輪播展示"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={heroForm.showcasePageSubtitle !== undefined ? heroForm.showcasePageSubtitle : '左側為主題輪播大圖與動態 GIF 展示區，支援滑鼠懸停暫停與微距放大；右側與輪播完全同步，展示當前項目的詳細規格與文字介紹。'}
                        onChange={(e) => setHeroForm({ ...heroForm, showcasePageSubtitle: e.target.value })}
                        placeholder="例如：左側為主題輪播大圖..."
                      />
                    </div>
                  </div>

                  {/* 活動與表單頁 */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-emerald)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} /> 活動與互動問卷頁面頁頭
                    </h4>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: '700' }}>頂部小標籤文字</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.formPageBadge !== undefined ? heroForm.formPageBadge : '官方活動意見與問卷調查'}
                        onChange={(e) => setHeroForm({ ...heroForm, formPageBadge: e.target.value })}
                        placeholder="例如：官方活動意見與問卷調查"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.formPageTitle !== undefined ? heroForm.formPageTitle : '參與線上問卷調查'}
                        onChange={(e) => setHeroForm({ ...heroForm, formPageTitle: e.target.value })}
                        placeholder="例如：參與線上問卷調查"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={heroForm.formPageSubtitle !== undefined ? heroForm.formPageSubtitle : '請參考上方活動目的說明並填寫以下問卷，您的建議將幫助我們持續優化體驗。'}
                        onChange={(e) => setHeroForm({ ...heroForm, formPageSubtitle: e.target.value })}
                        placeholder="例如：請參考上方活動目的說明..."
                      />
                    </div>
                  </div>

                  {/* 問卷回應頁 */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-indigo)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Layers size={16} /> 問卷回應紀錄頁面頁頭
                    </h4>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: '700' }}>頂部小標籤文字</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.responsesPageBadge !== undefined ? heroForm.responsesPageBadge : '大家的回應與反饋'}
                        onChange={(e) => setHeroForm({ ...heroForm, responsesPageBadge: e.target.value })}
                        placeholder="例如：大家的回應與反饋"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面大標題</label>
                      <input
                        type="text"
                        className="form-control"
                        value={heroForm.responsesPageTitle !== undefined ? heroForm.responsesPageTitle : '表單回應數據記錄'}
                        onChange={(e) => setHeroForm({ ...heroForm, responsesPageTitle: e.target.value })}
                        placeholder="例如：表單回應數據記錄"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>頁面副標題與說明文字</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={heroForm.responsesPageSubtitle !== undefined ? heroForm.responsesPageSubtitle : '查看訪客所提交的完整問卷資料。下方提供 1, 2, 3... 頁碼分頁切換與搜尋功能。'}
                        onChange={(e) => setHeroForm({ ...heroForm, responsesPageSubtitle: e.target.value })}
                        placeholder="例如：查看訪客所提交的完整問卷資料..."
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  <Save size={18} /> 儲存全站所有分頁頁頭標題與說明設定
                </button>
              </form>
            </div>
          )}



          {/* TAB 2: 公告發布與歷史管理 (使用者需求：管理者那裡可以管理公告) */}
          {activeAdminTab === 'announcements' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* 🎯 主頁展示公告選擇設定區塊 */}
              <div className="glass-panel" style={{ padding: '2rem', border: '1.5px solid var(--accent-pink)', background: 'rgba(236, 72, 153, 0.04)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Megaphone color="var(--accent-pink)" size={20} />
                  🎯 編輯主頁活動：選擇公告貼文放至【主頁活動展區】
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  選擇一篇已發布的公告貼文，該公告將自動精選顯示於【網站主頁 Hero 下方活動區塊】。
                </p>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    className="form-control"
                    style={{ flex: '1', minWidth: '280px', border: '1px solid var(--accent-pink)', fontWeight: '600' }}
                    value={heroForm.featuredAnnouncementId || ''}
                    onChange={(e) => {
                      const newId = e.target.value;
                      const updated = { ...heroForm, featuredAnnouncementId: newId };
                      setHeroForm(updated);
                      updateHeroConfig(updated);
                      showToast(newId ? '🎯 已設定精選公告放至主頁！' : '已取消主頁精選公告展示');
                    }}
                  >
                    <option value="">-- (不選擇 / 隱藏主頁精選公告) --</option>
                    {announcements.map(ann => (
                      <option key={ann.id} value={ann.id}>
                        {ann.isPinned ? '📌 [置頂] ' : ''}[{ann.category}] {ann.title} ({ann.date})
                      </option>
                    ))}
                  </select>

                  {heroForm.featuredAnnouncementId && (
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const updated = { ...heroForm, featuredAnnouncementId: '' };
                        setHeroForm(updated);
                        updateHeroConfig(updated);
                        showToast('已取消主頁精選公告');
                      }}
                    >
                      <X size={14} /> 取消主頁精選
                    </button>
                  )}
                </div>
              </div>

              {/* 全寬大版面 頁面內編輯面板 vs 新增表單 */}
              {editingAnnouncement ? (
                <div id="edit-form-announcement" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.04)', boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span className="badge badge-indigo" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                        ✏️ 頁面全寬大版面編輯中
                      </span>
                      <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                        編輯網站公告消息：「{editingAnnouncement.title}」
                      </h3>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setEditingAnnouncement(null)}>
                      <RotateCcw size={16} /> 關閉編輯並返回
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">公告標題</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingAnnouncement.title || ''}
                          onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">公告分類</label>
                        <select
                          className="form-control"
                          value={editingAnnouncement.category || '系統公告'}
                          onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value })}
                        >
                          <option value="系統公告">系統公告</option>
                          <option value="活動快訊">活動快訊</option>
                          <option value="展覽公告">展覽公告</option>
                          <option value="歷史公告">歷史公告</option>
                          <option value="維護通知">維護通知</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">發布日期</label>
                        <input
                          type="date"
                          className="form-control"
                          value={editingAnnouncement.date || ''}
                          onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">發布單位 / 作者</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingAnnouncement.author || ''}
                          onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, author: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
                        <input
                          type="checkbox"
                          id="editPinnedCheckInPage"
                          checked={editingAnnouncement.isPinned || false}
                          onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, isPinned: e.target.checked })}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
                        />
                        <label htmlFor="editPinnedCheckInPage" style={{ color: 'var(--accent-pink)', fontWeight: '700', cursor: 'pointer' }}>
                          📌 設為【置頂公告】
                        </label>
                      </div>

                      {/* 公告主視覺圖片 */}
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">公告主視覺圖片 (選填，未設定時自動隱藏不顯示)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                              <Upload size={16} /> 📁 從電腦選擇主視覺圖片檔案
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, (url) => setEditingAnnouncement({ ...editingAnnouncement, imageUrl: url }))}
                              />
                            </label>
                            {editingAnnouncement.imageUrl && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => setEditingAnnouncement({ ...editingAnnouncement, imageUrl: '' })}
                              >
                                <Trash2 size={14} /> 移除主視覺圖片
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="或輸入/貼上主視覺圖片網址 (https://...)"
                            value={editingAnnouncement.imageUrl || ''}
                            onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, imageUrl: e.target.value })}
                          />
                          {editingAnnouncement.imageUrl && (
                            <div style={{ width: '220px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative' }}>
                              <img src={editingAnnouncement.imageUrl} alt="主視覺圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>主視覺預覽</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">詳細公告內文說明</label>
                      <textarea
                        className="form-control"
                        rows={5}
                        value={editingAnnouncement.content || ''}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                        <Save size={18} /> 儲存公告修改內容
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditingAnnouncement(null)}>
                        取消
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* 發布新公告 Form */
                <form onSubmit={handleAddAnnouncement} className="glass-panel" style={{ padding: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={22} color="var(--accent-primary)" />
                    發布網站新公告 / 歷史公告消息
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">公告標題</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：📢 2026 全方位動態 CMS 平台正式開放體驗"
                        value={newAnn.title}
                        onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">公告分類</label>
                      <select
                        className="form-control"
                        value={newAnn.category}
                        onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
                      >
                        <option value="系統公告">系統公告</option>
                        <option value="活動快訊">活動快訊</option>
                        <option value="展覽公告">展覽公告</option>
                        <option value="歷史公告">歷史公告</option>
                        <option value="維護通知">維護通知</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">發布日期</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newAnn.date}
                        onChange={(e) => setNewAnn({ ...newAnn, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">發布單位 / 作者</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：系統管理者"
                        value={newAnn.author}
                        onChange={(e) => setNewAnn({ ...newAnn, author: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
                      <input
                        type="checkbox"
                        id="isPinnedCheck"
                        checked={newAnn.isPinned}
                        onChange={(e) => setNewAnn({ ...newAnn, isPinned: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
                      />
                      <label htmlFor="isPinnedCheck" style={{ color: 'var(--accent-pink)', fontWeight: '700', cursor: 'pointer' }}>
                        📌 設為【置頂公告】 (優先於頂部展示)
                      </label>
                    </div>

                    {/* 公告主視覺圖片 */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">公告主視覺圖片 (選填，未設定時自動隱藏不顯示)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                            <Upload size={16} /> 📁 從電腦選擇主視覺圖片檔案
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, (url) => setNewAnn({ ...newAnn, imageUrl: url }))}
                            />
                          </label>
                          {newAnn.imageUrl && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setNewAnn({ ...newAnn, imageUrl: '' })}
                            >
                              <Trash2 size={14} /> 移除主視覺圖片
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="或輸入/貼上主視覺圖片網址 (https://...)"
                          value={newAnn.imageUrl || ''}
                          onChange={(e) => setNewAnn({ ...newAnn, imageUrl: e.target.value })}
                        />
                        {newAnn.imageUrl && (
                          <div style={{ width: '220px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative' }}>
                            <img src={newAnn.imageUrl} alt="主視覺圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>主視覺預覽</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">詳細公告內文說明</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="輸入詳細內文說明..."
                      value={newAnn.content}
                      onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Plus size={18} /> 發布此公告
                  </button>
                </form>
              )}

              {/* 公告列表管理 */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                  已發布公告紀錄清單 (共 {announcements.length} 則)
                </h3>

                {announcements.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    目前尚無公告，管理者可填寫上方表單進行發布。
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {announcements.map((ann) => (
                      <div 
                        key={ann.id} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '1.25rem 1.5rem',
                          borderRadius: 'var(--radius-md)',
                          border: ann.isPinned ? '1.5px solid var(--accent-pink)' : '1px solid var(--border-glass)',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ flex: '1', minWidth: '280px' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                            {ann.isPinned && (
                              <span className="badge badge-pink" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Pin size={12} /> 置頂
                              </span>
                            )}
                            <span className="badge badge-indigo">{ann.category}</span>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📅 {ann.date}</span>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>👤 {ann.author || '管理者'}</span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-title)', fontWeight: '700', marginBottom: '0.3rem' }}>
                            {ann.title}
                          </h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {ann.content}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingAnnouncement({ ...ann })}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                          >
                            <Edit3 size={14} /> 編輯
                          </button>
                          <button
                            className={`btn btn-sm ${ann.isPinned ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => {
                              togglePinAnnouncement(ann.id);
                              showToast(ann.isPinned ? '已取消置頂' : '📌 已設為置頂公告');
                            }}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                          >
                            <Pin size={14} /> {ann.isPinned ? '取消置頂' : '置頂'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm(`確定要刪除「${ann.title}」這則公告嗎？`)) {
                                deleteAnnouncement(ann.id);
                                showToast('已刪除該公告');
                              }
                            }}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                          >
                            <Trash2 size={14} /> 刪除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: 5. 特色與技術卡片編輯 */}
          {activeAdminTab === 'cards_edit' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* 全寬大版面 頁面內編輯面板 vs 新增表單 */}
              {editingCard ? (
                <div id="edit-form-card" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-indigo)', background: 'rgba(99, 102, 241, 0.04)', boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span className="badge badge-indigo" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                        ✏️ 頁面全寬大版面編輯中
                      </span>
                      <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                        編輯介紹卡片：「{editingCard.title}」
                      </h3>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setEditingCard(null)}>
                      <RotateCcw size={16} /> 關閉編輯並返回
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditCard} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                          📍 展示位置 (可隨時切換)
                        </label>
                        <select
                          className="form-control"
                          value={editingCard.targetLocation || 'home'}
                          onChange={(e) => setEditingCard({ ...editingCard, targetLocation: e.target.value })}
                          style={{ border: '1px solid var(--accent-pink)', fontWeight: '700' }}
                        >
                          <option value="home">主頁 (Home Page 最下方功能介紹)</option>
                          <option value="intro">介紹頁 (Intro Page 最下方特色卡片)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">卡片標題</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingCard.title || ''}
                          onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">圖示風格</label>
                        <select
                          className="form-control"
                          value={editingCard.icon || 'Sparkles'}
                          onChange={(e) => setEditingCard({ ...editingCard, icon: e.target.value })}
                        >
                          <option value="Sparkles">星星閃爍圖示 (Sparkles)</option>
                          <option value="Layout">版面圖示 (Layout)</option>
                          <option value="FileText">表單圖示 (FileText)</option>
                          <option value="Layers">圖層雙欄圖示 (Layers)</option>
                          <option value="ShieldCheck">安全盾牌圖示 (ShieldCheck)</option>
                          <option value="Film">GIF 動畫圖示 (Film)</option>
                          <option value="MousePointer">游標懸停圖示 (MousePointer)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">卡片詳細說明內容</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editingCard.description || ''}
                        onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                        <Save size={18} /> 儲存卡片修改內容
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditingCard(null)}>
                        取消
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* 新增卡片 Form */
                <form onSubmit={handleAddUnifiedCard} className="glass-panel" style={{ padding: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={22} color="var(--accent-primary)" />
                    新增介紹卡片 (自訂展示位置：主頁 或 介紹頁)
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {/* 🎯 展示位置選擇 (主頁 vs 介紹頁) */}
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>
                        📍 選擇卡片展示位置
                      </label>
                      <select
                        className="form-control"
                        value={unifiedCard.location}
                        onChange={(e) => setUnifiedCard({ ...unifiedCard, location: e.target.value })}
                        style={{ border: '1px solid var(--accent-pink)', fontWeight: '700' }}
                      >
                        <option value="home">主頁 (Home Page 最下方功能介紹)</option>
                        <option value="intro">介紹頁 (Intro Page 最下方特色卡片)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">卡片標題</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：智慧即時互動"
                        value={unifiedCard.title}
                        onChange={(e) => setUnifiedCard({ ...unifiedCard, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">圖示風格</label>
                      <select
                        className="form-control"
                        value={unifiedCard.icon}
                        onChange={(e) => setUnifiedCard({ ...unifiedCard, icon: e.target.value })}
                      >
                        <option value="Sparkles">星星閃爍圖示 (Sparkles)</option>
                        <option value="Layout">版面圖示 (Layout)</option>
                        <option value="FileText">表單圖示 (FileText)</option>
                        <option value="Layers">圖層雙欄圖示 (Layers)</option>
                        <option value="ShieldCheck">安全盾牌圖示 (ShieldCheck)</option>
                        <option value="Film">GIF 動畫圖示 (Film)</option>
                        <option value="MousePointer">游標懸停圖示 (MousePointer)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">卡片詳細說明內容</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="輸入詳細介紹說明文字..."
                      value={unifiedCard.description}
                      onChange={(e) => setUnifiedCard({ ...unifiedCard, description: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Plus size={18} /> 新增此卡片至{unifiedCard.location === 'home' ? '【主頁】' : '【介紹頁】'}
                  </button>
                </form>
              )}

              {/* 統一卡片列表與位置篩選 */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)' }}>
                    全站介紹卡片統一清單 (共 {combinedCards.length} 張)
                  </h3>

                  {/* 篩選標籤 */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <button 
                      className={`btn btn-sm ${cardFilterLocation === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setCardFilterLocation('all')}
                    >
                      全部 ({combinedCards.length})
                    </button>
                    <button 
                      className={`btn btn-sm ${cardFilterLocation === 'home' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setCardFilterLocation('home')}
                    >
                      主頁 ({featureCards.length})
                    </button>
                    <button 
                      className={`btn btn-sm ${cardFilterLocation === 'intro' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setCardFilterLocation('intro')}
                    >
                      介紹頁 ({introCards.length})
                    </button>
                  </div>
                </div>

                {filteredCombinedCards.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    目前此位置無卡片。（註：若介紹頁卡片清單清空，介紹頁最下方區塊將會自動隱藏不顯示）
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredCombinedCards.map((card, idx) => (
                      <div key={card.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span className={`badge ${card.targetLocation === 'home' ? 'badge-indigo' : 'badge-pink'}`}>
                              {card.targetLocation === 'home' ? '📍 主頁卡片' : '📍 介紹頁卡片'}
                            </span>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setEditingCard({ ...card, targetLocation: card.targetLocation, originalLocation: card.targetLocation });
                                  window.scrollTo({ top: 120, behavior: 'smooth' });
                                }}
                              >
                                <Edit3 size={14} /> 編輯
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  if (window.confirm(`確定要刪除「${card.title}」卡片嗎？`)) {
                                    if (card.targetLocation === 'home') {
                                      deleteFeatureCard(card.id);
                                    } else {
                                      deleteIntroCard(card.id);
                                    }
                                    showToast('已刪除該卡片');
                                  }
                                }}
                              >
                                <Trash2 size={14} /> 刪除
                              </button>
                            </div>
                          </div>
                          <h4 style={{ color: 'var(--text-title)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{card.title}</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}



          {/* TAB: 圖片輪播藝廊編輯 (主頁圖片輪播) */}
          {activeAdminTab === 'carousel_edit' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* 自訂「互動視覺藝廊輪播」標題與說明文字區塊 */}
              <div className="glass-panel" style={{ padding: '2rem', border: '1.5px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.03)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles color="var(--accent-cyan)" size={20} />
                  自訂「互動視覺藝廊輪播」大標題與說明文字 (Carousel Title & Subtitle)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>輪播區塊大標題</label>
                    <input
                      type="text"
                      className="form-control"
                      value={heroForm.carouselSectionTitle !== undefined ? heroForm.carouselSectionTitle : '互動視覺藝廊輪播'}
                      onChange={(e) => setHeroForm({ ...heroForm, carouselSectionTitle: e.target.value })}
                      placeholder="例如：互動視覺藝廊輪播"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>輪播區塊副標題 / 提示說明</label>
                    <input
                      type="text"
                      className="form-control"
                      value={heroForm.carouselSectionSubtitle !== undefined ? heroForm.carouselSectionSubtitle : '滑鼠移至圖片上方可暫停輪播，自動切換至 GIF 動畫並微距放大，點擊圖片開啟全尺寸詳細內容。'}
                      onChange={(e) => setHeroForm({ ...heroForm, carouselSectionSubtitle: e.target.value })}
                      placeholder="例如：滑鼠移至圖片上方可暫停輪播..."
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    updateHeroConfig(heroForm);
                    showToast('✨ 已成功更新「互動視覺藝廊輪播」標題與說明文字！');
                  }}
                >
                  <Save size={16} /> 儲存輪播區塊標題文字設定
                </button>
              </div>

              {/* 編輯 / 新增 輪播 */}
              {editingCarousel ? (
                <div id="edit-form-carousel" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.04)', boxShadow: '0 0 35px rgba(56, 189, 248, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span className="badge badge-cyan" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                        ✏️ 頁面全寬大版面編輯中
                      </span>
                      <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                        編輯輪播圖片項目：「{editingCarousel.title}」
                      </h3>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setEditingCarousel(null)}>
                      <RotateCcw size={16} /> 關閉編輯並返回
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditCarousel}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                            🖼️ 展示圖片實時高解析預覽
                          </label>
                          <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000', position: 'relative' }}>
                            {editingCarousel.imageUrl ? (
                              <img src={editingCarousel.imageUrl} alt="圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>無圖片</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>
                            🎞️ GIF 動畫懸停實時播映預覽 (選填)
                          </label>
                          <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000', position: 'relative' }}>
                            {editingCarousel.gifUrl ? (
                              <img src={editingCarousel.gifUrl} alt="GIF預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>未設定 GIF 動畫 (懸停時顯示原靜態主圖)</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">項目標題</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingCarousel.title || ''}
                            onChange={(e) => setEditingCarousel({ ...editingCarousel, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">選擇主題分類</label>
                          <select
                            className="form-control"
                            value={editingCarousel.category || ''}
                            onChange={(e) => setEditingCarousel({ ...editingCarousel, category: e.target.value })}
                          >
                            {categories.filter(c => c !== '全部').map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">展示圖片檔 (從電腦更換 或 輸入網址)</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                              <Upload size={16} /> 📁 從電腦選擇新圖片檔案
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, (url) => setEditingCarousel({ ...editingCarousel, imageUrl: url }))}
                              />
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="https://..."
                              value={editingCarousel.imageUrl || ''}
                              onChange={(e) => setEditingCarousel({ ...editingCarousel, imageUrl: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">GIF 動畫圖檔 (選填，移入懸停時播放)</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                              <Film size={16} /> 📁 從電腦選擇新 GIF 動畫檔案
                              <input
                                type="file"
                                accept="image/gif"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, (url) => setEditingCarousel({ ...editingCarousel, gifUrl: url }))}
                              />
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="GIF 網址 (Giphy)"
                              value={editingCarousel.gifUrl || ''}
                              onChange={(e) => setEditingCarousel({ ...editingCarousel, gifUrl: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">詳細說明文字</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={editingCarousel.description || ''}
                            onChange={(e) => setEditingCarousel({ ...editingCarousel, description: e.target.value })}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                            <Save size={18} /> 儲存修改內容
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={() => setEditingCarousel(null)}>
                            取消
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleAddCarousel} className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="var(--accent-cyan)" /> 新增主頁圖片輪播項目
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">項目標題</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：賽博朋克光影"
                        value={newCarousel.title}
                        onChange={(e) => setNewCarousel({ ...newCarousel, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">選擇主題分類</label>
                      <select
                        className="form-control"
                        value={newCarousel.category}
                        onChange={(e) => setNewCarousel({ ...newCarousel, category: e.target.value })}
                      >
                        {categories.filter(c => c !== '全部').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">上傳圖片 (電腦選擇檔案 或 貼上網址)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                            <Upload size={16} /> 📁 從電腦選擇圖片檔案 (JPG / PNG / GIF)
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, (url) => setNewCarousel({ ...newCarousel, imageUrl: url }))}
                            />
                          </label>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="或貼上圖片網址 (https://...)"
                          value={newCarousel.imageUrl}
                          onChange={(e) => setNewCarousel({ ...newCarousel, imageUrl: e.target.value })}
                          required
                        />

                        {newCarousel.imageUrl && (
                          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '120px', width: '200px', border: '1px solid var(--border-glass)', position: 'relative' }}>
                            <img src={newCarousel.imageUrl} alt="圖片預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>輪播圖片預覽</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">GIF 動畫檔案 (選填，可上傳電腦 GIF 檔)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                          <Film size={16} /> 📁 從電腦選擇 GIF 動畫檔案
                          <input
                            type="file"
                            accept="image/gif"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileUpload(e, (url) => setNewCarousel({ ...newCarousel, gifUrl: url }))}
                          />
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="或貼上 GIF 動畫網址 (Giphy GIF URL)"
                          value={newCarousel.gifUrl}
                          onChange={(e) => setNewCarousel({ ...newCarousel, gifUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">詳細說明文字 (點擊後 Modal 顯示)</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="輸入圖片的背景或藝術介紹..."
                      value={newCarousel.description}
                      onChange={(e) => setNewCarousel({ ...newCarousel, description: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Plus size={18} /> 新增此輪播項目
                  </button>
                </form>
              )}

              {/* 現有輪播列表 */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                  現有輪播圖清單 (管理者可即時編輯、刪除或檢視)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {carouselItems.map((item, idx) => (
                    <div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: item.id === editingCarousel?.id ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)' }}>
                      <div style={{ position: 'relative' }}>
                        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                          #{idx + 1} 順序
                        </span>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <span className="badge badge-indigo">{item.category}</span>
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              disabled={idx === 0}
                              onClick={() => {
                                moveCarouselItem(item.id, 'up');
                                showToast('⬆️ 已向前調整順序');
                              }}
                              title="向前移動排序"
                              style={{ padding: '0.3rem 0.5rem', opacity: idx === 0 ? 0.4 : 1 }}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              disabled={idx === carouselItems.length - 1}
                              onClick={() => {
                                moveCarouselItem(item.id, 'down');
                                showToast('⬇️ 已向後調整順序');
                              }}
                              title="向後移動排序"
                              style={{ padding: '0.3rem 0.5rem', opacity: idx === carouselItems.length - 1 ? 0.4 : 1 }}
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setEditingCarousel({ ...item });
                              }}
                              style={{ padding: '0.3rem 0.6rem' }}
                            >
                              <Edit3 size={14} /> 編輯
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (window.confirm(`確定要刪除「${item.title}」嗎？`)) {
                                  deleteCarouselItem(item.id);
                                  showToast('已刪除輪播項目');
                                }
                              }}
                              style={{ padding: '0.3rem 0.6rem' }}
                            >
                              <Trash2 size={14} /> 刪除
                            </button>
                          </div>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: '0.4rem' }}>{item.title}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: 自訂動態表單題目 CMS */}
          {activeAdminTab === 'form_questions' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* 全寬大版面 頁面內編輯面板 vs 新增表單 */}
              {editingQuestion ? (
                <div id="edit-form-question" className="glass-panel animate-fade-in" style={{ padding: '2.5rem', border: '2px solid var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.04)', boxShadow: '0 0 35px rgba(16, 185, 129, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-glass-bright)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                        ✏️ 頁面全寬大版面編輯中
                      </span>
                      <h3 style={{ fontSize: '1.65rem', color: 'var(--text-title)', fontWeight: '800' }}>
                        編輯自訂問卷題目：「{editingQuestion.title}」
                      </h3>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setEditingQuestion(null)}>
                      <RotateCcw size={16} /> 關閉編輯並返回
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">問題名稱 / 題目內容</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingQuestion.title || ''}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">問題類型</label>
                        <select
                          className="form-control"
                          value={editingQuestion.type || 'text'}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value })}
                        >
                          <option value="text">單行短文字 (Text)</option>
                          <option value="email">電子郵件 (Email)</option>
                          <option value="textarea">多行長文字 (Textarea)</option>
                          <option value="radio">單選題 (Radio)</option>
                          <option value="rating">星級評分 (Rating 1-5)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                          💬 輸入框填寫提示詞 (Placeholder 提示字元)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：請輸入您的姓名..."
                          value={editingQuestion.placeholder || ''}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, placeholder: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', gridColumn: 'span 2' }}>
                        <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={editingQuestion.required || false}
                            onChange={(e) => setEditingQuestion({ ...editingQuestion, required: e.target.checked })}
                            style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '600' }}>設定為必填項目</span>
                        </label>
                        <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={editingQuestion.hideInResponses || false}
                            onChange={(e) => setEditingQuestion({ ...editingQuestion, hideInResponses: e.target.checked })}
                            style={{ accentColor: 'var(--accent-pink)', width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '600', color: 'var(--accent-pink)' }}>🙈 不在回應數據頁面中展示此題答案 (hideInResponses)</span>
                        </label>
                      </div>
                    </div>

                    {editingQuestion.type === 'radio' && (
                      <div className="form-group">
                        <label className="form-label">單選題選項 (請用逗點分隔)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="例如：選項 A, 選項 B, 選項 C"
                          value={editingQuestion.optionsText || ''}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, optionsText: e.target.value })}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.02rem' }}>
                        <Save size={18} /> 儲存題目修改內容
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditingQuestion(null)}>
                        取消
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* 新增題目 Form */
                <form onSubmit={handleAddQuestion} className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="var(--accent-emerald)" /> 新增自訂問卷題目
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">問題名稱 / 題目內容</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：您最喜歡哪一類型的設計視覺？"
                        value={newQ.title}
                        onChange={(e) => setNewQ({ ...newQ, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">問題類型</label>
                      <select
                        className="form-control"
                        value={newQ.type}
                        onChange={(e) => setNewQ({ ...newQ, type: e.target.value })}
                      >
                        <option value="text">單行短文字 (Text)</option>
                        <option value="email">電子郵件 (Email)</option>
                        <option value="textarea">多行長文字 (Textarea)</option>
                        <option value="radio">單選題 (Radio)</option>
                        <option value="rating">星級評分 (Rating 1-5)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        💬 輸入框填寫提示詞 (Placeholder 提示字元)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：請輸入您的姓名... 或 請分享您的看法..."
                        value={newQ.placeholder || ''}
                        onChange={(e) => setNewQ({ ...newQ, placeholder: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', gridColumn: 'span 2' }}>
                      <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newQ.required}
                          onChange={(e) => setNewQ({ ...newQ, required: e.target.checked })}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <span>設定為必填項目</span>
                      </label>
                      <label className="option-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newQ.hideInResponses || false}
                          onChange={(e) => setNewQ({ ...newQ, hideInResponses: e.target.checked })}
                          style={{ accentColor: 'var(--accent-pink)', width: '18px', height: '18px' }}
                        />
                        <span style={{ color: 'var(--accent-pink)' }}>🙈 不在回應頁面展示答案 (hideInResponses)</span>
                      </label>
                    </div>
                  </div>

                  {newQ.type === 'radio' && (
                    <div className="form-group">
                      <label className="form-label">單選題選項 (請用逗點分隔)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如：選項 A, 選項 B, 選項 C"
                        value={newQ.optionsText}
                        onChange={(e) => setNewQ({ ...newQ, optionsText: e.target.value })}
                      />
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                    <Plus size={18} /> 新增這題問題至問卷
                  </button>
                </form>
              )}

              {/* 現有表單題目與刪除 */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-title)', marginBottom: '1.5rem' }}>
                  現有問卷題目清單 (共 {formQuestions.length} 題)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formQuestions.map((q, idx) => (
                    <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <span className="badge badge-indigo">Q{idx + 1}</span>
                          <span className="badge badge-cyan">{q.type}</span>
                          {q.required && <span className="badge badge-pink">必填</span>}
                          {q.hideInResponses && <span className="badge badge-secondary" style={{ color: 'var(--accent-pink)', borderColor: 'var(--accent-pink)' }}>🙈 回應隱藏</span>}
                        </div>
                        <h4 style={{ color: 'var(--text-title)', fontSize: '1.1rem' }}>{q.title}</h4>
                        {q.options && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                            選項：{q.options.join(' / ')}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingQuestion({ 
                              ...q, 
                              optionsText: (q.options || []).join(', ') 
                            });
                          }}
                        >
                          <Edit3 size={14} /> 編輯問題
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`確定要刪除「Q${idx + 1}. ${q.title}」嗎？`)) {
                              deleteFormQuestion(q.id);
                              showToast('已刪除問卷題目');
                            }
                          }}
                        >
                          <Trash2 size={14} /> 刪除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 密碼權限設定 */}
          {activeAdminTab === 'security' && (
            <form onSubmit={handleChangePassword} className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound color="var(--accent-pink)" size={22} />
                修改管理者登入密碼
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                為確保後台全站內容控制不被未授權人員隨意存取，您可以於此自訂新的管理者解鎖密碼。
              </p>

              {pwdError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                  ⚠️ {pwdError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">目前使用的管理者密碼</label>
                <input
                  type="text"
                  className="form-control"
                  value={adminPassword}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">設定新的管理者密碼</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="輸入新的管理者密碼..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">再輸入一次新密碼確認</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="再次輸入新密碼..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Save size={18} /> 儲存新密碼設定
              </button>
            </form>
          )}

        </main>
      </div>

      </div>
    </div>
  );
};
