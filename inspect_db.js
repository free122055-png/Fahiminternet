import fs from 'fs';
import path from 'path';

async function testFetch() {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.log('firebase-applet-config.json not found!');
      return;
    }
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

    const dbId = firestoreDatabaseId || '(default)';
    
    // Fetch site_config
    const url1 = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/settings/site_config?key=${apiKey}`;
    const res1 = await fetch(url1);
    if (res1.ok) {
      const data = await res1.json();
      const fields = data.fields || {};
      console.log('--- SITE_CONFIG ---');
      console.log('ziniRegisteredDomain:', fields.ziniRegisteredDomain?.stringValue);
      console.log('zinipayApiKey:', fields.zinipayApiKey?.stringValue);
      console.log('zinipayDomain:', fields.zinipayDomain?.stringValue);
    } else {
      console.log('site_config error:', res1.status);
    }

    // Fetch general
    const url2 = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/settings/general?key=${apiKey}`;
    const res2 = await fetch(url2);
    if (res2.ok) {
      const data = await res2.json();
      const fields = data.fields || {};
      console.log('--- GENERAL ---');
      console.log('ziniRegisteredDomain:', fields.ziniRegisteredDomain?.stringValue);
      console.log('zinipayApiKey:', fields.zinipayApiKey?.stringValue);
      console.log('zinipayDomain:', fields.zinipayDomain?.stringValue);
    } else {
      console.log('general error:', res2.status);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testFetch();
