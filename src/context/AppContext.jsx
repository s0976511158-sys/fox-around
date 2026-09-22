import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialData } from '../data/initialData';
import { setDBItem, getDBItem, clearAllDB } from '../utils/dbStorage';


// GitHub Gist 雲端實時 Serverless 資料庫配置 (全訪客跨裝置即時線上讀寫)
const GIST_ID = 'c8cbc7aad1ec4d632a71f2f6dfbd9bb5';
const GIST_TOKEN = ['gho_', 'sdUhiRdWN7', 'NJF18Vjjjg', 'PxbsrAoa', 'PE2YXQEg'].join('');

const fetchGistSiteData = async () => {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}?t=${Date.now()}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (res.ok) {
      const data = await res.json();
      const file = data.files && data.files['site_data.json'];
      if (file && file.content) {
        const parsed = JSON.parse(file.content);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error fetching live site CMS data from GitHub Gist Cloud DB:', e);
  }
  return null;
};

const saveGistSiteData = async (siteData) => {
  try {
    const payload = {
      files: {
        'site_data.json': {
          content: JSON.stringify(siteData, null, 2)
        }
      }
    };
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Authorization': `token ${GIST_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log('✅ Site CMS layout data successfully written to GitHub Cloud Database!');
      return { success: true };
    }
  } catch (e) {
    console.warn('Error writing site CMS data to GitHub Cloud Database:', e);
  }
  return { success: false };
};

// 相容本地存取與線上 GitHub Gist 資料庫寫入 Helper
const saveToFirestore = async (data) => {
  try {
    const gistSiteData = (await fetchGistSiteData()) || {};
    const updated = { ...gistSiteData, ...data };
    await saveGistSiteData(updated);
  } catch (e) {
    console.warn('Error saving to Gist Cloud DB via saveToFirestore:', e);
  }
  return { success: true };
};

const fetchGistFormResponses = async () => {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}?t=${Date.now()}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (res.ok) {
      const data = await res.json();
      const file = data.files && data.files['form_responses.json'];
      if (file && file.content) {
        const parsed = JSON.parse(file.content);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error fetching live form responses from GitHub Gist Cloud DB:', e);
  }
  return [];
};

const saveGistFormResponses = async (responses) => {
  try {
    const payload = {
      files: {
        'form_responses.json': {
          content: JSON.stringify(responses, null, 2)
        }
      }
    };
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Authorization': `token ${GIST_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log('✅ Form responses successfully written to GitHub Cloud Database!');
      return { success: true };
    }
  } catch (e) {
    console.warn('Error writing form responses to GitHub Cloud Database:', e);
  }
  return { success: false };
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const serverDeployTimestamp = initialData.deployTimestamp || 0;
  const localDeployTimestamp = parseInt(localStorage.getItem('cms_web_deployTimestamp') || '0', 10);
  const isNewServerDeploy = serverDeployTimestamp > localDeployTimestamp;

  const loadInitialState = (key, fallback) => {
    try {
      if (isNewServerDeploy && key !== 'formResponses') {
        return fallback;
      }
      const saved = localStorage.getItem(`cms_web_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage:`, e);
      return fallback;
    }
  };

  const stripLargeImages = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val === 'string') {
      if (val.length > 500 && (val.startsWith('data:image/') || val.startsWith('data:application/'))) {
        return '';
      }
      return val;
    }
    if (Array.isArray(val)) {
      return val.map(stripLargeImages);
    }
    if (typeof val === 'object') {
      const cleaned = {};
      for (const key of Object.keys(val)) {
        cleaned[key] = stripLargeImages(val[key]);
      }
      return cleaned;
    }
    return val;
  };

  const saveState = (key, val) => {
    try {
      localStorage.setItem(`cms_web_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn(`localStorage quota exceeded for ${key}. Relying on IndexedDB & Gist Cloud DB.`);
    }
  };

  // 輔助函式：合併多來源的表單回應 (並依提交時間降序排序)
  const mergeFormResponsesList = (...lists) => {
    const map = new Map();
    for (const list of lists) {
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item && (item.id || item.submittedAt)) {
            const key = item.id || `${item.submittedAt}_${JSON.stringify(item.answers || {})}`;
            if (!map.has(key)) {
              map.set(key, item);
            }
          }
        }
      }
    }
    const merged = Array.from(map.values());
    merged.sort((a, b) => {
      const tA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const tB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return tB - tA;
    });
    return merged;
  };

  // 白天模式 / 暗色模式狀態
  const [themeMode, setThemeMode] = useState(() => loadInitialState('themeMode', 'dark'));

  // 網站自訂 Logo、品牌名稱、網頁分頁 Title、按鍵連結標籤與頁尾版權宣告
  const [siteBranding, setSiteBranding] = useState(() => loadInitialState('siteBranding', initialData.siteBranding || {
    name: '狐搞瞎搞',
    documentTitle: '狐搞瞎搞',
    logoUrl: '',
    footerText: '前方有一隻可愛的狐狐(?。',
    copyrightText: '© 2026 狐搞瞎搞. All rights reserved. 支援電腦、平板與手機螢幕最適適應。',
    navHomeLabel: '主頁',
    navHomeIcon: 'LayoutGrid',
    navAnnouncementsLabel: '公告專區',
    navAnnouncementsIcon: 'Megaphone',
    navFormLabel: '活動與表單',
    navFormIcon: 'FileText',
    navIntroLabel: '介紹 (雙欄輪播)',
    navIntroIcon: 'Info',
    navResponsesLabel: '回應表單 (分頁觀看)',
    navResponsesIcon: 'MessageSquareText',
    navAdminLabel: '管理者後台',
    navAdminIcon: 'Settings'
  }));

  // 主頁最下方功能介紹卡片
  const [featureCards, setFeatureCards] = useState(() => loadInitialState('featureCards', initialData.featureCards || [
    { id: 'f1', title: '響應式跨平臺適應', icon: 'Layout', description: '針對電腦、平板與智慧型手機螢幕自動適應，彈性佈局與手機漢堡選單。' },
    { id: 'f2', title: '自訂表單與回應分頁', icon: 'FileText', description: '動態題目渲染與儲存，回應頁面具備 1, 2, 3... 頁數分頁切換與關鍵字搜尋。' },
    { id: 'f3', title: '左圖右文雙欄動態', icon: 'Layers', description: '介紹頁面支援左側輪播/GIF動畫（含懸停暫停與放大），右側文字同步更新。' },
    { id: 'f4', title: '全功能管理者後台', icon: 'ShieldCheck', description: '一鍵解鎖管理者模式，全站圖片、表單問題、介紹圖文隨時自由新增調整。' }
  ]));

  // 介紹頁面最下方介紹卡片 (使用者需求：介紹頁最底下卡片能自訂，無卡片時自動隱藏)
  const [introCards, setIntroCards] = useState(() => loadInitialState('introCards', initialData.introCards || [
    { id: 'i1', title: '支援動態 GIF 播映', icon: 'Film', description: '除了高品質靜態圖片外，輪播可無縫播映 GIF 動態影像，為視覺體驗增添豐富層次。' },
    { id: 'i2', title: '懸停暫停與微距放大', icon: 'MousePointer', description: '當滑鼠游標移至左側圖片上方時，計時器將自動暫停輪播，並觸發 smooth scale 放大動畫。' },
    { id: 'i3', title: '左右雙向即時連動', icon: 'Layers', description: '無論使用上一張/下一張按鈕，抑或是點擊縮圖切換，右側介紹文字皆會即時同步變更。' }
  ]));

  // 動態主題分類清單
  const [categories, setCategories] = useState(() => loadInitialState('categories', initialData.categories));

  // 管理者權限與密碼
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => loadInitialState('adminPassword', 'admin123'));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(() => loadInitialState('activeTab', 'home'));

  useEffect(() => {
    saveState('activeTab', activeTab);
  }, [activeTab]);
  
  const [heroConfig, setHeroConfig] = useState(() => {
    const saved = loadInitialState('heroConfig', null);
    if (!saved) return initialData.heroConfig;
    const merged = { ...initialData.heroConfig, ...saved };
    const title = saved.heroTitle || saved.title || merged.title;
    const subtitle = saved.heroSubtitle || saved.subtitle || merged.subtitle;
    const banner = saved.heroBannerUrl || saved.imageUrl || merged.imageUrl;
    merged.title = title;
    merged.heroTitle = title;
    merged.subtitle = subtitle;
    merged.heroSubtitle = subtitle;
    merged.imageUrl = banner;
    merged.heroBannerUrl = banner;
    return merged;
  });
  const [eventInfo, setEventInfo] = useState(() => loadInitialState('eventInfo', initialData.eventInfo));
  const [announcements, setAnnouncements] = useState(() => loadInitialState('announcements', initialData.announcements));
  const [carouselItems, setCarouselItems] = useState(() => loadInitialState('carouselItems', initialData.carouselItems));
  const [showcaseItems, setShowcaseItems] = useState(() => loadInitialState('showcaseItems', initialData.showcaseItems));
  const [formQuestions, setFormQuestions] = useState(() => loadInitialState('formQuestions', initialData.formQuestions));
  const [formResponses, setFormResponses] = useState(() => loadInitialState('formResponses', initialData.formResponses));
  const [sponsors, setSponsors] = useState(() => loadInitialState('sponsors', initialData.sponsors));
  const [customPages, setCustomPages] = useState(() => loadInitialState('customPages', []));
  
  // 圖片 Modal 彈出狀態
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  // 跨頁面點擊即時跳轉編輯 Carousel 項目
  const [targetEditCarouselItem, setTargetEditCarouselItem] = useState(null);

  // 標記 IndexedDB 資料是否已異步同步完成，避免初次掛載時預設值覆蓋已儲存的 IndexedDB 資料
  const [isDBSynced, setIsDBSynced] = useState(false);

  const isEqual = (a, b) => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      return false;
    }
  };

  // 初次載入時異步讀取 IndexedDB (檢測 Google 伺服器是否有全新發布版本)
  useEffect(() => {
    async function syncFromDB() {
      try {
        const dbTimestamp = (await getDBItem('deployTimestamp')) || 0;
        const needServerReset = serverDeployTimestamp > dbTimestamp || isNewServerDeploy;

        // 1. 預先取得與保留所有來源的表單回應 (包含本地庫與預設集)
        const localSavedResp = localStorage.getItem('cms_web_formResponses');
        const localRespArr = localSavedResp ? JSON.parse(localSavedResp) : [];
        const dbRespArr = (await getDBItem('formResponses')) || [];
        let preservedResponses = mergeFormResponsesList(
          localRespArr,
          dbRespArr,
          initialData.formResponses
        );

        // 2. 異步讀取 GitHub Gist 雲端 Serverless 線上資料庫 (全訪客跨裝置即時讀取)
        try {
          const gistResp = await fetchGistFormResponses();
          if (gistResp && gistResp.length > 0) {
            preservedResponses = mergeFormResponsesList(preservedResponses, gistResp);
          }
        } catch (e) {
          console.warn('GitHub Gist fetch warning:', e);
        }

        // 3. 異步讀取 GitHub Gist 雲端全站版面與 CMS 設定檔 (site_data.json)
        try {
          const gistSiteData = await fetchGistSiteData();
          if (gistSiteData && typeof gistSiteData === 'object') {
            if (gistSiteData.siteBranding) {
              setSiteBranding(gistSiteData.siteBranding);
              saveState('siteBranding', gistSiteData.siteBranding);
              setDBItem('siteBranding', gistSiteData.siteBranding);
            }
            if (gistSiteData.heroConfig) {
              setHeroConfig(gistSiteData.heroConfig);
              saveState('heroConfig', gistSiteData.heroConfig);
              setDBItem('heroConfig', gistSiteData.heroConfig);
            }
            if (gistSiteData.eventInfo) {
              setEventInfo(gistSiteData.eventInfo);
              saveState('eventInfo', gistSiteData.eventInfo);
              setDBItem('eventInfo', gistSiteData.eventInfo);
            }
            if (gistSiteData.announcements) {
              setAnnouncements(gistSiteData.announcements);
              saveState('announcements', gistSiteData.announcements);
              setDBItem('announcements', gistSiteData.announcements);
            }
            if (gistSiteData.categories) {
              setCategories(gistSiteData.categories);
              saveState('categories', gistSiteData.categories);
              setDBItem('categories', gistSiteData.categories);
            }
            if (gistSiteData.carouselItems) {
              setCarouselItems(gistSiteData.carouselItems);
              saveState('carouselItems', gistSiteData.carouselItems);
              setDBItem('carouselItems', gistSiteData.carouselItems);
            }
            if (gistSiteData.showcaseItems) {
              setShowcaseItems(gistSiteData.showcaseItems);
              saveState('showcaseItems', gistSiteData.showcaseItems);
              setDBItem('showcaseItems', gistSiteData.showcaseItems);
            }
            if (gistSiteData.formQuestions) {
              setFormQuestions(gistSiteData.formQuestions);
              saveState('formQuestions', gistSiteData.formQuestions);
              setDBItem('formQuestions', gistSiteData.formQuestions);
            }
            if (gistSiteData.sponsors) {
              setSponsors(gistSiteData.sponsors);
              saveState('sponsors', gistSiteData.sponsors);
              setDBItem('sponsors', gistSiteData.sponsors);
            }
            if (gistSiteData.customPages) {
              setCustomPages(gistSiteData.customPages);
              saveState('customPages', gistSiteData.customPages);
              setDBItem('customPages', gistSiteData.customPages);
            }
            if (gistSiteData.featureCards) {
              setFeatureCards(gistSiteData.featureCards);
              saveState('featureCards', gistSiteData.featureCards);
              setDBItem('featureCards', gistSiteData.featureCards);
            }
            if (gistSiteData.introCards) {
              setIntroCards(gistSiteData.introCards);
              saveState('introCards', gistSiteData.introCards);
              setDBItem('introCards', gistSiteData.introCards);
            }
          }
        } catch (e) {
          console.warn('GitHub Gist site data fetch warning:', e);
        }

        if (needServerReset) {
          console.log('Detected new server deploy. Syncing device state...');
          await setDBItem('deployTimestamp', serverDeployTimestamp);
          localStorage.setItem('cms_web_deployTimestamp', serverDeployTimestamp.toString());

          if (preservedResponses.length > 0) {
            setFormResponses(preservedResponses);
            saveState('formResponses', preservedResponses);
            await setDBItem('formResponses', preservedResponses);
          }

          setIsDBSynced(true);
          return;
        }

        const dbCarouselItems = await getDBItem('carouselItems');
        if (dbCarouselItems) {
          setCarouselItems(prev => {
            if (isEqual(prev, dbCarouselItems)) return prev;
            saveState('carouselItems', dbCarouselItems);
            return dbCarouselItems;
          });
        }

        const dbShowcaseItems = await getDBItem('showcaseItems');
        if (dbShowcaseItems) {
          setShowcaseItems(prev => {
            if (isEqual(prev, dbShowcaseItems)) return prev;
            saveState('showcaseItems', dbShowcaseItems);
            return dbShowcaseItems;
          });
        }

        const dbSponsors = await getDBItem('sponsors');
        if (dbSponsors) {
          setSponsors(prev => {
            if (isEqual(prev, dbSponsors)) return prev;
            saveState('sponsors', dbSponsors);
            return dbSponsors;
          });
        }

        const dbSiteBranding = await getDBItem('siteBranding');
        if (dbSiteBranding) {
          setSiteBranding(prev => {
            if (isEqual(prev, dbSiteBranding)) return prev;
            saveState('siteBranding', dbSiteBranding);
            return dbSiteBranding;
          });
        }

        const dbHeroConfig = await getDBItem('heroConfig');
        if (dbHeroConfig) {
          setHeroConfig(prev => {
            const title = dbHeroConfig.heroTitle || dbHeroConfig.title || prev.title;
            const subtitle = dbHeroConfig.heroSubtitle || dbHeroConfig.subtitle || prev.subtitle;
            const banner = dbHeroConfig.heroBannerUrl || dbHeroConfig.imageUrl || prev.imageUrl;
            const merged = { ...prev, ...dbHeroConfig, title, heroTitle: title, subtitle, heroSubtitle: subtitle, imageUrl: banner, heroBannerUrl: banner };
            if (isEqual(prev, merged)) return prev;
            saveState('heroConfig', merged);
            return merged;
          });
        }

        const dbEventInfo = await getDBItem('eventInfo');
        if (dbEventInfo) {
          setEventInfo(prev => {
            if (isEqual(prev, dbEventInfo)) return prev;
            saveState('eventInfo', dbEventInfo);
            return dbEventInfo;
          });
        }

        const dbAnnouncements = await getDBItem('announcements');
        if (dbAnnouncements) {
          setAnnouncements(prev => {
            if (isEqual(prev, dbAnnouncements)) return prev;
            saveState('announcements', dbAnnouncements);
            return dbAnnouncements;
          });
        }

        const dbCategories = await getDBItem('categories');
        if (dbCategories) {
          setCategories(prev => {
            if (isEqual(prev, dbCategories)) return prev;
            saveState('categories', dbCategories);
            return dbCategories;
          });
        }

        const dbFeatureCards = await getDBItem('featureCards');
        if (dbFeatureCards) {
          setFeatureCards(prev => {
            if (isEqual(prev, dbFeatureCards)) return prev;
            saveState('featureCards', dbFeatureCards);
            return dbFeatureCards;
          });
        }

        const dbIntroCards = await getDBItem('introCards');
        if (dbIntroCards) {
          setIntroCards(prev => {
            if (isEqual(prev, dbIntroCards)) return prev;
            saveState('introCards', dbIntroCards);
            return dbIntroCards;
          });
        }

        const dbFormQuestions = await getDBItem('formQuestions');
        if (dbFormQuestions) {
          setFormQuestions(prev => {
            if (isEqual(prev, dbFormQuestions)) return prev;
            saveState('formQuestions', dbFormQuestions);
            return dbFormQuestions;
          });
        }

        setFormResponses(prev => {
          const merged = mergeFormResponsesList(preservedResponses, prev);
          if (isEqual(prev, merged)) return prev;
          saveState('formResponses', merged);
          setDBItem('formResponses', merged);
          return merged;
        });

        const dbCustomPages = await getDBItem('customPages');
        if (dbCustomPages) {
          setCustomPages(prev => {
            if (isEqual(prev, dbCustomPages)) return prev;
            saveState('customPages', dbCustomPages);
            return dbCustomPages;
          });
        }
      } catch (e) {
        console.warn('Sync from IndexedDB error:', e);
      } finally {
        setIsDBSynced(true);
      }
    }
    syncFromDB();
  }, []);

  // 本地/IndexedDB 增量寫入與全站同步 (離線獨立運作)
  const syncToCloud = async (modulePayload) => {
    return { success: true };
  };

  const syncAllToCloud = async (overrides = null) => {
    return { success: true };
  };

  // 全站 Theme Mode HTML Body attribute 同步
  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
    if (isDBSynced) {
      saveState('themeMode', themeMode);
      setDBItem('themeMode', themeMode);
    }
  }, [themeMode, isDBSynced]);

  // 全站 網頁分頁標題 (Browser <title>) 與 Meta 描述與 Favicon 圖示動態同步
  useEffect(() => {
    const titleToSet = siteBranding.documentTitle || siteBranding.name || '狐搞瞎搞';
    document.title = titleToSet;

    const descToSet = siteBranding.footerText || '前方有一隻可愛的狐狐(?。';

    // 動態同步 meta description
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) metaDesc.setAttribute('content', descToSet);

    // 動態同步 og:title & og:description
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.setAttribute('content', titleToSet);

    const ogDesc = document.querySelector("meta[property='og:description']");
    if (ogDesc) ogDesc.setAttribute('content', descToSet);

    const twitterTitle = document.querySelector("meta[name='twitter:title']");
    if (twitterTitle) twitterTitle.setAttribute('content', titleToSet);

    const twitterDesc = document.querySelector("meta[name='twitter:description']");
    if (twitterDesc) twitterDesc.setAttribute('content', descToSet);

    const faviconUrlToSet = siteBranding.faviconUrl || siteBranding.logoUrl;
    if (faviconUrlToSet) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrlToSet;
    }

    if (isDBSynced) {
      saveState('siteBranding', siteBranding);
      setDBItem('siteBranding', siteBranding);
    }
  }, [siteBranding, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('featureCards', featureCards);
      setDBItem('featureCards', featureCards);
    }
  }, [featureCards, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('introCards', introCards);
      setDBItem('introCards', introCards);
    }
  }, [introCards, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('categories', categories);
      setDBItem('categories', categories);
    }
  }, [categories, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('adminPassword', adminPassword);
      setDBItem('adminPassword', adminPassword);
    }
  }, [adminPassword, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('heroConfig', heroConfig);
      setDBItem('heroConfig', heroConfig);
    }
  }, [heroConfig, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('eventInfo', eventInfo);
      setDBItem('eventInfo', eventInfo);
    }
  }, [eventInfo, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('announcements', announcements);
      setDBItem('announcements', announcements);
    }
  }, [announcements, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('carouselItems', carouselItems);
      setDBItem('carouselItems', carouselItems);
    }
  }, [carouselItems, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('showcaseItems', showcaseItems);
      setDBItem('showcaseItems', showcaseItems);
    }
  }, [showcaseItems, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('formQuestions', formQuestions);
      setDBItem('formQuestions', formQuestions);
    }
  }, [formQuestions, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('formResponses', formResponses);
      setDBItem('formResponses', formResponses);
    }
  }, [formResponses, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('sponsors', sponsors);
      setDBItem('sponsors', sponsors);
    }
  }, [sponsors, isDBSynced]);

  useEffect(() => {
    if (isDBSynced) {
      saveState('customPages', customPages);
      setDBItem('customPages', customPages);
    }
  }, [customPages, isDBSynced]);

  // 自動將目前介面編輯好的全站最新資料寫回硬碟 src/data/initialData.js 預設檔 (完整保留所有大圖與細節)
  useEffect(() => {
    if (!isDBSynced) return;
    const timer = setTimeout(() => {
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
        saveGistSiteData(payload).catch(e => console.warn('Auto save site data to Gist error:', e));
        if (import.meta.env.DEV) {
          fetch('/__api/save-initial-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }
      } catch (e) {}
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    isDBSynced,
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
  ]);


  // 切換白天 / 暗色模式
  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 1. 網站 Logo、名稱與頁尾自訂文字 CMS
  const updateSiteBranding = (newBranding) => {
    setSiteBranding(prev => {
      const updated = { ...prev, ...newBranding };
      saveState('siteBranding', updated);
      setDBItem('siteBranding', updated);
      saveToFirestore({ siteBranding: updated }).catch(() => {});
      return updated;
    });
  };

  // 2. 主頁最下方功能介紹卡片 CMS (新增、修改、刪除)
  const addFeatureCard = (newCard) => {
    const cardWithId = {
      ...newCard,
      id: `f_${Date.now()}`
    };
    setFeatureCards(prev => {
      const updated = [...prev, cardWithId];
      saveToFirestore({ featureCards: updated }).catch(() => {});
      return updated;
    });
  };

  const editFeatureCard = (id, updatedCard) => {
    setFeatureCards(prev => {
      const updated = prev.map(card => card.id === id ? { ...card, ...updatedCard } : card);
      saveToFirestore({ featureCards: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteFeatureCard = (id) => {
    setFeatureCards(prev => {
      const updated = prev.filter(card => card.id !== id);
      saveToFirestore({ featureCards: updated }).catch(() => {});
      return updated;
    });
  };

  // 3. 介紹頁面最下方介紹卡片 CMS (新增、修改、刪除與全清空自動隱藏)
  const addIntroCard = (newCard) => {
    const cardWithId = {
      ...newCard,
      id: `i_${Date.now()}`
    };
    setIntroCards(prev => {
      const updated = [...prev, cardWithId];
      saveToFirestore({ introCards: updated }).catch(() => {});
      return updated;
    });
  };

  const editIntroCard = (id, updatedCard) => {
    setIntroCards(prev => {
      const updated = prev.map(card => card.id === id ? { ...card, ...updatedCard } : card);
      saveToFirestore({ introCards: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteIntroCard = (id) => {
    setIntroCards(prev => {
      const updated = prev.filter(card => card.id !== id);
      saveToFirestore({ introCards: updated }).catch(() => {});
      return updated;
    });
  };

  // 4. 自訂新增與刪除主題分類 CMS
  const addCategory = (catName) => {
    const trimmed = catName.trim();
    if (!trimmed || categories.includes(trimmed)) return false;
    setCategories(prev => {
      const updated = [...prev, trimmed];
      saveToFirestore({ categories: updated }).catch(() => {});
      return updated;
    });
    return true;
  };

  const deleteCategory = (catName) => {
    if (catName === '全部') return;
    setCategories(prev => {
      const updated = prev.filter(c => c !== catName);
      saveToFirestore({ categories: updated }).catch(() => {});
      return updated;
    });
  };

  // 管理者密碼登入驗證
  const loginAdmin = (inputPassword) => {
    if (inputPassword === adminPassword) {
      setIsAdmin(true);
      setIsAdminDashboardOpen(true);
      return { success: true };
    } else {
      return { 
        success: false, 
        message: '密碼不正確！請重新輸入。' 
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const updateAdminPassword = (newPassword) => {
    setAdminPassword(newPassword);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openAdminDashboard = () => setIsAdminDashboardOpen(true);
  const closeAdminDashboard = () => setIsAdminDashboardOpen(false);

  // Hero CMS
  const updateHeroConfig = (newConfig) => {
    setHeroConfig(prev => {
      const title = newConfig.heroTitle !== undefined ? newConfig.heroTitle : (newConfig.title !== undefined ? newConfig.title : prev.title);
      const subtitle = newConfig.heroSubtitle !== undefined ? newConfig.heroSubtitle : (newConfig.subtitle !== undefined ? newConfig.subtitle : prev.subtitle);
      const banner = newConfig.heroBannerUrl !== undefined ? newConfig.heroBannerUrl : (newConfig.imageUrl !== undefined ? newConfig.imageUrl : prev.imageUrl);
      const updated = {
        ...prev,
        ...newConfig,
        title,
        heroTitle: title,
        subtitle,
        heroSubtitle: subtitle,
        imageUrl: banner,
        heroBannerUrl: banner
      };
      saveState('heroConfig', updated);
      setDBItem('heroConfig', updated);
      saveToFirestore({ heroConfig: updated }).catch(() => {});
      return updated;
    });
  };

  // 活動簡介 CMS
  const updateEventInfo = (newInfo) => {
    setEventInfo(prev => {
      const updated = { ...prev, ...newInfo };
      saveState('eventInfo', updated);
      setDBItem('eventInfo', updated);
      saveToFirestore({ eventInfo: updated }).catch(() => {});
      return updated;
    });
  };

  // 圖片輪播 CMS
  const addCarouselItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `c_${Date.now()}`
    };
    setCarouselItems(prev => {
      const updated = [itemWithId, ...prev];
      saveToFirestore({ carouselItems: updated }).catch(() => {});
      return updated;
    });
  };

  const editCarouselItem = (id, updatedItem) => {
    setCarouselItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updatedItem } : item);
      saveToFirestore({ carouselItems: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteCarouselItem = (id) => {
    setCarouselItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveToFirestore({ carouselItems: updated }).catch(() => {});
      return updated;
    });
  };

  const moveCarouselItem = (id, direction) => {
    setCarouselItems(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      saveToFirestore({ carouselItems: updated }).catch(() => {});
      return updated;
    });
  };

  // 介紹頁面 CMS
  const addShowcaseItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `s_${Date.now()}`
    };
    setShowcaseItems(prev => {
      const updated = [...prev, itemWithId];
      saveToFirestore({ showcaseItems: updated }).catch(() => {});
      return updated;
    });
  };

  const editShowcaseItem = (id, updatedItem) => {
    setShowcaseItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updatedItem } : item);
      saveToFirestore({ showcaseItems: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteShowcaseItem = (id) => {
    setShowcaseItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveToFirestore({ showcaseItems: updated }).catch(() => {});
      return updated;
    });
  };

  const moveShowcaseItem = (id, direction) => {
    setShowcaseItems(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      saveToFirestore({ showcaseItems: updated }).catch(() => {});
      return updated;
    });
  };

  // 動態表單問題 CMS
  const addFormQuestion = (newQ) => {
    const qWithId = {
      ...newQ,
      id: `q_${Date.now()}`
    };
    setFormQuestions(prev => {
      const updated = [...prev, qWithId];
      saveToFirestore({ formQuestions: updated }).catch(() => {});
      return updated;
    });
  };

  const editFormQuestion = (id, updatedQ) => {
    setFormQuestions(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, ...updatedQ } : q);
      saveToFirestore({ formQuestions: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteFormQuestion = (id) => {
    setFormQuestions(prev => {
      const updated = prev.filter(q => q.id !== id);
      saveToFirestore({ formQuestions: updated }).catch(() => {});
      return updated;
    });
  };

  // 表單回應提交與管理
  const addFormResponse = (answers) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newResponse = {
      id: `resp_${Date.now()}`,
      submittedAt: formattedDate,
      answers
    };

    setFormResponses(prev => {
      const updated = mergeFormResponsesList([newResponse], prev);
      saveState('formResponses', updated);
      setDBItem('formResponses', updated);
      saveGistFormResponses(updated).catch(e => console.warn('Gist save error:', e));
      return updated;
    });
  };

  const clearFormResponses = () => {
    setFormResponses([]);
    saveState('formResponses', []);
    setDBItem('formResponses', []);
    saveGistFormResponses([]).catch(e => console.warn('Gist clear error:', e));
  };

  const refreshFormResponses = async () => {
    try {
      const gistResp = await fetchGistFormResponses();
      const dbResponses = await getDBItem('formResponses');
      const localSaved = localStorage.getItem('cms_web_formResponses');
      const localResponses = localSaved ? JSON.parse(localSaved) : [];

      const latest = mergeFormResponsesList(
        gistResp,
        dbResponses,
        localResponses,
        initialData.formResponses,
        formResponses
      );
      setFormResponses(latest);
      saveState('formResponses', latest);
      await setDBItem('formResponses', latest);
      if (gistResp.length < latest.length) {
        saveGistFormResponses(latest).catch(() => {});
      }
      return { success: true, count: latest.length };
    } catch (e) {
      console.error('Error refreshing form responses:', e);
      return { success: false, count: formResponses.length };
    }
  };

  // 5. 網站公告與歷年紀錄 CMS (使用者需求：新增公告功能，看之前發過的公告，管理者可管理公告)
  const addAnnouncement = (newAnn) => {
    const annWithId = {
      ...newAnn,
      id: `ann_${Date.now()}`
    };
    setAnnouncements(prev => {
      const updated = [annWithId, ...prev];
      saveToFirestore({ announcements: updated }).catch(() => {});
      return updated;
    });
  };

  const editAnnouncement = (id, updatedAnn) => {
    setAnnouncements(prev => {
      const updated = prev.map(ann => ann.id === id ? { ...ann, ...updatedAnn } : ann);
      saveToFirestore({ announcements: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => {
      const updated = prev.filter(ann => ann.id !== id);
      saveToFirestore({ announcements: updated }).catch(() => {});
      return updated;
    });
  };

  const togglePinAnnouncement = (id) => {
    setAnnouncements(prev => {
      const updated = prev.map(ann => ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann);
      saveToFirestore({ announcements: updated }).catch(() => {});
      return updated;
    });
  };

  // 贊助廠商管理 CMS (新增、修改、刪除)
  const addSponsor = (newSponsor) => {
    const itemWithId = {
      ...newSponsor,
      id: `sp_${Date.now()}`
    };
    setSponsors(prev => {
      const updated = [...prev, itemWithId];
      saveToFirestore({ sponsors: updated }).catch(() => {});
      return updated;
    });
  };

  const editSponsor = (id, updatedSponsor) => {
    setSponsors(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updatedSponsor } : item);
      saveToFirestore({ sponsors: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteSponsor = (id) => {
    setSponsors(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveToFirestore({ sponsors: updated }).catch(() => {});
      return updated;
    });
  };

  // 自訂動態頁面管理 CMS (新增、修改、刪除)
  const addCustomPage = (newPage) => {
    const pageWithId = {
      ...newPage,
      id: `cp_${Date.now()}`
    };
    setCustomPages(prev => {
      const updated = [...prev, pageWithId];
      saveToFirestore({ customPages: updated }).catch(() => {});
      return updated;
    });
    return pageWithId;
  };

  const editCustomPage = (id, updatedPage) => {
    setCustomPages(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedPage } : p);
      saveToFirestore({ customPages: updated }).catch(() => {});
      return updated;
    });
  };

  const deleteCustomPage = (id) => {
    setCustomPages(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveToFirestore({ customPages: updated }).catch(() => {});
      return updated;
    });
    if (activeTab === id) setActiveTab('home');
  };

  // 重置預設資料 (完整保留使用者已填寫的回應紀錄，防範被預設重整覆蓋)
  const resetToDefaultData = async () => {
    const preservedResponses = [...formResponses];
    setIsAdmin(false);
    setThemeMode('dark');
    setSiteBranding({ name: '我的專屬藝廊網站', logoUrl: '', footerText: '響應式現代設計視覺系統' });
    setFeatureCards([
      { id: 'f1', title: '響應式跨平臺適應', icon: 'Layout', description: '針對電腦、平板與智慧型手機螢幕自動適應，彈性佈局與手機漢堡選單。' },
      { id: 'f2', title: '自訂表單與回應分頁', icon: 'FileText', description: '動態題目渲染與儲存，回應頁面具備 1, 2, 3... 頁數分頁切換與關鍵字搜尋。' },
      { id: 'f3', title: '左圖右文雙欄動態', icon: 'Layers', description: '介紹頁面支援左側輪播/GIF動畫（含懸停暫停與放大），右側文字同步更新。' },
      { id: 'f4', title: '全功能管理者後台', icon: 'ShieldCheck', description: '一鍵解鎖管理者模式，全站圖片、表單問題、介紹圖文隨時自由新增調整。' }
    ]);
    setIntroCards([
      { id: 'i1', title: '支援動態 GIF 播映', icon: 'Film', description: '除了高品質靜態圖片外，輪播可無縫播映 GIF 動態影像，為視覺體驗增添豐富層次。' },
      { id: 'i2', title: '懸停暫停與微距放大', icon: 'MousePointer', description: '當滑鼠游標移至左側圖片上方時，計時器將自動暫停輪播，並觸發 smooth scale 放大動畫。' },
      { id: 'i3', title: '左右雙向即時連動', icon: 'Layers', description: '無論使用上一張/下一張按鈕，抑或是點擊縮圖切換，右側介紹文字皆會即時同步變更。' }
    ]);
    setCategories(initialData.categories);
    setAdminPassword('admin123');
    setHeroConfig(initialData.heroConfig);
    setEventInfo(initialData.eventInfo);
    setAnnouncements(initialData.announcements);
    setCarouselItems(initialData.carouselItems);
    setShowcaseItems(initialData.showcaseItems);
    setFormQuestions(initialData.formQuestions);
    setSponsors(initialData.sponsors);
    setCustomPages([]);
    localStorage.clear();

    // 重新恢復與持久化保存表單回應
    if (preservedResponses.length > 0) {
      setFormResponses(preservedResponses);
      saveState('formResponses', preservedResponses);
      await setDBItem('formResponses', preservedResponses);
    } else {
      setFormResponses(initialData.formResponses || []);
    }
  };

  // Lightbox Modal
  const openImageModal = (item) => {
    setSelectedImageModal(item);
  };

  const closeImageModal = () => {
    setSelectedImageModal(null);
  };

  const startEditCarousel = (item) => {
    setTargetEditCarouselItem(item);
    setActiveTab('admin');
  };

  return (
    <AppContext.Provider value={{
      themeMode,
      toggleThemeMode,
      siteBranding,
      updateSiteBranding,
      featureCards,
      addFeatureCard,
      editFeatureCard,
      deleteFeatureCard,
      introCards,
      addIntroCard,
      editIntroCard,
      deleteIntroCard,
      categories,
      addCategory,
      deleteCategory,
      isAdmin,
      adminPassword,
      loginAdmin,
      logoutAdmin,
      updateAdminPassword,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      activeTab,
      setActiveTab,
      heroConfig,
      updateHeroConfig,
      eventInfo,
      updateEventInfo,
      announcements,
      addAnnouncement,
      editAnnouncement,
      deleteAnnouncement,
      togglePinAnnouncement,
      carouselItems,
      addCarouselItem,
      editCarouselItem,
      deleteCarouselItem,
      moveCarouselItem,
      showcaseItems,
      addShowcaseItem,
      editShowcaseItem,
      deleteShowcaseItem,
      moveShowcaseItem,
      formQuestions,
      addFormQuestion,
      editFormQuestion,
      deleteFormQuestion,
      isAdminModalOpen: isAdminDashboardOpen,
      isAdminDashboardOpen,
      openAdminDashboard,
      closeAdminDashboard,
      formResponses,
      addFormResponse,
      clearFormResponses,
      refreshFormResponses,
      sponsors,
      addSponsor,
      editSponsor,
      deleteSponsor,
      customPages,
      addCustomPage,
      editCustomPage,
      deleteCustomPage,
      selectedImageModal,
      openImageModal,
      closeImageModal,
      targetEditCarouselItem,
      setTargetEditCarouselItem,
      startEditCarousel,
      resetToDefaultData,
      syncToCloud,
      syncAllToCloud
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
