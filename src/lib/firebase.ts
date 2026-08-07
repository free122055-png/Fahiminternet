import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

setLogLevel('silent');

export { firebaseConfig };

// Initialize the default website Firebase app
const defaultApp = getApps().find(a => a.name === 'default-app') || initializeApp(firebaseConfig, 'default-app');
export const defaultDb = initializeFirestore(defaultApp, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

// Check if Software Mode is enabled and configure
let systemMode = 'website';
let activeConfig: any = firebaseConfig;

if (typeof window !== 'undefined') {
  const cachedMode = localStorage.getItem('systemMode');
  const cachedConfigStr = localStorage.getItem('softwareFirebaseConfig');
  
  if (cachedMode === 'software' && cachedConfigStr) {
    try {
      const parsedConfig = JSON.parse(cachedConfigStr);
      if (parsedConfig && parsedConfig.apiKey && parsedConfig.projectId) {
        systemMode = 'software';
        activeConfig = {
          apiKey: parsedConfig.apiKey,
          authDomain: parsedConfig.authDomain || `${parsedConfig.projectId}.firebaseapp.com`,
          projectId: parsedConfig.projectId,
          storageBucket: parsedConfig.storageBucket || `${parsedConfig.projectId}.appspot.com`,
          messagingSenderId: parsedConfig.messagingSenderId || '',
          appId: parsedConfig.appId || '',
          firestoreDatabaseId: parsedConfig.databaseId || '(default)'
        };
      }
    } catch (e) {
      console.error('Failed to parse cached software firebase config:', e);
    }
  }
}

// Initialize active Firebase App
const appName = systemMode === 'software' ? 'software-app' : '[DEFAULT]';
const app = getApps().find(a => a.name === appName) || initializeApp(activeConfig, appName);
export const auth = getAuth(app);

// Explicitly set persistence for mobile browsers/apps 
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, activeConfig.firestoreDatabaseId);

// Enable offline persistence (disabled by default to prevent multi-tab/iframe locking issues in AI Studio preview environments)
/*
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
}
*/

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client appears to be offline or config is invalid.");
    }
  }
}

testConnection();
