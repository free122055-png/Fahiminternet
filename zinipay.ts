import { auth } from './firebase';

/**
 * Initiates an automatic payment request with ZiNiPay.
 * Calls the secure backend proxy to protect the secret API key.
 */
export async function ziniPayCreatePayment(amount: number, customerName: string, customerEmail: string, customerPhone?: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('দয়া করে প্রথমে লগইন করুন');
  }
  
  const token = await currentUser.getIdToken(true);
  const response = await fetch('/api/zinipay/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount, customerName, customerEmail, customerPhone })
  });

  if (!response.ok) {
    let errMessage = 'পেমেন্ট গেটওয়ে সংযোগ ব্যর্থ হয়েছে';
    try {
      const errData = await response.json();
      if (errData.error && errData.details) {
        errMessage = `${errData.error}: ${errData.details}`;
      } else {
        errMessage = errData.error || errData.details || errMessage;
      }
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  return await response.json();
}

/**
 * Verifies an automatic payment using ZiNiPay's callback invoiceId.
 * Credits user's Firestore balance automatically upon successful confirmation.
 */
export async function ziniPayVerifyPayment(invoiceId: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('ইউজার লগইন সেশন পাওয়া যায়নি');
  }

  const token = await currentUser.getIdToken(true);
  const response = await fetch('/api/zinipay/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ invoiceId })
  });

  if (!response.ok) {
    let errMessage = 'পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে';
    try {
      const errData = await response.json();
      if (errData.error && errData.details) {
        errMessage = `${errData.error}: ${errData.details}`;
      } else {
        errMessage = errData.error || errData.details || errMessage;
      }
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  return await response.json();
}
