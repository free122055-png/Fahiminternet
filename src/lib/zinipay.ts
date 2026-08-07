import { auth } from './firebase';

/**
 * ZiniPay Auto Payment Client Helper
 * Created fresh from scratch.
 */
export async function ziniPayCreatePayment(params: {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packId: string;
  packTitle: string;
  operator: string;
  division: string;
  rechargeType?: string;
  ziniRegisteredDomain?: string;
}) {
  const currentUser = auth.currentUser;
  let token = '';
  if (currentUser) {
    try {
      token = await currentUser.getIdToken(true);
    } catch {
      // ignore
    }
  }

  const response = await fetch('/api/zinipay/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(params)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'ZiniPay পেমেন্ট তৈরি করতে ব্যর্থ হয়েছে।');
  }

  return {
    success: true,
    paymentUrl: data.paymentUrl || data.url,
    invoiceId: data.invoiceId
  };
}

export async function ziniPayVerifyPayment(invoiceId: string) {
  const response = await fetch('/api/zinipay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoiceId })
  });

  const data = await response.json();
  return data;
}
