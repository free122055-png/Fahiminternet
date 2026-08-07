async function testZini() {
  const apiKey = '6504f874e6643cbf66ccfddc919ed56aacfb88f02ecabc90';
  const domains = [
    'https://daily-internet-offer-bd.web.app',
    'https://daily-internet-offer-bd.firebaseapp.com',
    'https://fahiminternet.com',
    'https://www.fahiminternet.com',
    'https://fahiminternetbd.com',
    'https://www.fahiminternetbd.com'
  ];

  for (const domain of domains) {
    const successUrl = `${domain}/?zinistatus=success&invoiceId=TEST123456`;
    const cancelUrl = `${domain}/?zinistatus=cancel&invoiceId=TEST123456`;
    
    const payload = {
      amount: 20,
      invoice_id: 'TEST' + Date.now(),
      success_url: successUrl,
      cancel_url: cancelUrl,
      cus_name: 'Test Customer',
      cus_email: 'test@example.com',
      cus_phone: '01700000000',
      currency: 'BDT',
      desc: 'Test Pack'
    };

    try {
      const response = await fetch('https://api.zinipay.com/v1/payment/create', {
        method: 'POST',
        headers: {
          'zini-api-key': apiKey,
          'Content-Type': 'application/json',
          'Origin': domain,
          'Referer': `${domain}/`
        },
        body: JSON.stringify(payload)
      });
      const text = await response.text();
      console.log(`Domain: ${domain}`);
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${text.substring(0, 300)}`);
      console.log('--------------------------------------------------');
    } catch (err) {
      console.error(`Error for ${domain}:`, err.message);
    }
  }
}

testZini();
