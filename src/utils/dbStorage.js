const DB_NAME = 'cms_web_db';
const STORE_NAME = 'cms_store';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        console.warn('IndexedDB open error:', event.target.error);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB error:', e);
      resolve(null);
    }
  });
  return dbPromise;
}

export async function setDBItem(key, value) {
  try {
    const db = await getDB();
    if (db) {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(value, key);
    }
  } catch (err) {
    console.warn(`IndexedDB setDBItem failed for ${key}:`, err);
  }

  // 同步嘗試存入 localStorage (完全靜默處理配額上限，不觸發 alert 彈窗)
  try {
    localStorage.setItem(`cms_web_${key}`, JSON.stringify(value));
  } catch (e) {
    // 靜默捕捉 QuotaExceededError
  }
}

export async function getDBItem(key) {
  try {
    const db = await getDB();
    if (db) {
      const val = await new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
        req.onerror = () => resolve(null);
      });
      if (val !== null) return val;
    }
  } catch (err) {
    console.warn(`IndexedDB getDBItem failed for ${key}:`, err);
  }

  // 降級讀取 localStorage
  try {
    const item = localStorage.getItem(`cms_web_${key}`);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

export async function clearAllDB() {
  try {
    const db = await getDB();
    if (db) {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    }
  } catch (e) {}
  try {
    localStorage.clear();
  } catch (e) {}
}
