// IndexedDB Local Storage utility for large video and audio file persistence

const DB_NAME = 'fahim_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaBlob(id: string, dataUrlOrBlob: string | Blob): Promise<void> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id, data: dataUrlOrBlob, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save media in IndexedDB:', err);
  }
}

export async function getMediaBlob(id: string): Promise<string | Blob | null> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not get media from IndexedDB:', err);
    return null;
  }
}

export async function getMediaUrl(id: string, fallbackUrl?: string, defaultFallback?: string): Promise<string> {
  const cached = await getMediaBlob(id);
  if (cached) {
    if (typeof cached === 'string') {
      if (!cached.startsWith('blob:')) {
        return cached;
      }
    }
    if (cached instanceof Blob) {
      try {
        return URL.createObjectURL(cached);
      } catch (e) {
        console.warn('Error creating object URL from Blob:', e);
      }
    }
  }

  // If fallbackUrl is a valid web URL, use it
  if (fallbackUrl && (fallbackUrl.startsWith('http://') || fallbackUrl.startsWith('https://'))) {
    return fallbackUrl;
  }

  return defaultFallback || (fallbackUrl && !fallbackUrl.startsWith('blob:') ? fallbackUrl : '');
}

export async function deleteMediaBlob(id: string): Promise<void> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete media in IndexedDB:', err);
  }
}
