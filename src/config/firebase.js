import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, writeBatch, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  projectId: "fox-around",
  appId: "1:1002691177555:web:64c499796cba4181c52aa6",
  storageBucket: "fox-around.firebasestorage.app",
  apiKey: "AIzaSyDXVZwvfFHoqn6LufG0cMOR1OGo1xDoFpQ",
  authDomain: "fox-around.firebaseapp.com",
  messagingSenderId: "1002691177555",
  measurementId: "G-4L9P0NMEFF"
};

// 初始化 Firebase 應用與 Firestore / Storage 實例
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Document 引用
export const mainDataDocRef = doc(db, 'siteData', 'main');

// 上傳圖片至 Firebase Storage 並獲取全網通用 HTTPS 網址
export const uploadImageToFirebaseStorage = async (file) => {
  try {
    const ext = file.name ? file.name.split('.').pop() : 'jpg';
    const filename = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    let errMsg = error.message;
    if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('bucket') || errMsg.includes('disabled')) {
      errMsg = 'Firebase Storage 尚未開啟。請前往控制台 (https://console.firebase.google.com/project/fox-around/storage) 點擊「開始使用」啟用即可！';
    }
    return { success: false, error: errMsg };
  }
};

// 智慧微型 Base64 壓縮工具 (嚴格保留 PNG 去背透明度與 GIF 動態，JPEG 自動極速優化)
const compressBase64Image = (base64Str, maxWidth = 800, quality = 0.65) => {
  if (typeof window === 'undefined' || typeof base64Str !== 'string') return Promise.resolve(base64Str);
  if (!base64Str.startsWith('data:image/') || base64Str.startsWith('data:image/gif') || base64Str.length < 100000) {
    return Promise.resolve(base64Str);
  }
  const isPng = base64Str.startsWith('data:image/png');
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
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

        if (isPng) {
          // 清除背景，完全保留 PNG 去背 Alpha 透明度 (Transparency)
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/png');
          resolve(compressed);
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        }
      } catch (e) {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
};

const optimizePayloadData = async (val) => {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    if (val.startsWith('data:image/') && val.length > 100000 && !val.startsWith('data:image/gif')) {
      return await compressBase64Image(val);
    }
    return val;
  }
  if (Array.isArray(val)) {
    const results = [];
    for (const item of val) {
      results.push(await optimizePayloadData(item));
    }
    return results;
  }
  if (typeof val === 'object') {
    const result = {};
    for (const key of Object.keys(val)) {
      result[key] = await optimizePayloadData(val[key]);
    }
    return result;
  }
  return val;
};

// 同步資料至 Cloud Firestore (採用單檔獨立 setDoc 與 350KB 字串 Chunking，澈底避免 10MB Batch 上限錯誤)
export const saveToFirestore = async (data) => {
  try {
    const modules = [
      'siteBranding', 'heroConfig', 'eventInfo', 'announcements',
      'categories', 'carouselItems', 'showcaseItems', 'formQuestions',
      'formResponses', 'sponsors', 'customPages', 'featureCards', 'introCards'
    ];

    const CHUNK_SIZE = 350000; // 每區塊限定 350,000 字元 (~350 KB)

    for (const key of modules) {
      if (data[key] !== undefined) {
        const optimizedVal = await optimizePayloadData(data[key]);
        const jsonStr = JSON.stringify(optimizedVal);
        const totalChunks = Math.ceil(jsonStr.length / CHUNK_SIZE) || 1;

        for (let i = 0; i < totalChunks; i++) {
          const chunkStr = jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          const docId = i === 0 ? key : `${key}_chunk_${i}`;
          const docRef = doc(db, 'siteData', docId);

          await setDoc(docRef, {
            moduleKey: key,
            chunkIndex: i,
            totalChunks: totalChunks,
            dataJsonPart: chunkStr,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        // 清理多餘的舊 chunk Documents
        for (let orphanIdx = totalChunks; orphanIdx < totalChunks + 10; orphanIdx++) {
          const orphanDocId = `${key}_chunk_${orphanIdx}`;
          const orphanDocRef = doc(db, 'siteData', orphanDocId);
          await deleteDoc(orphanDocRef).catch(() => {});
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    let errMsg = error.message;
    if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('disabled') || errMsg.includes('has not been used')) {
      errMsg = 'Firebase 專案尚未開啟 Cloud Firestore 資料庫。請點擊連結前往 Firebase 控制台 (https://console.firebase.google.com/project/fox-around/firestore) 點擊「建立資料庫」即可開啟！';
    }
    return { success: false, error: errMsg };
  }
};
