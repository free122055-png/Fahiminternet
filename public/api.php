<?php
/**
 * Dynamic PHP Backend API Route Handler
 * Developed for easy cPanel hosting from Mobile/Web.
 * Routes all /api/* requests natively using standard PHP & curl.
 */

// ----------------------------------------------------
// 1. CORS Headers (Allow frontend to call from any origin)
// ----------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ----------------------------------------------------
// 2. Load Configurations & Helper Utilities
// ----------------------------------------------------
$configFile = __DIR__ . '/firebase-applet-config.json';
if (!file_exists($configFile)) {
    // Fallback look in parent directory in case of cPanel paths
    $configFile = dirname(__DIR__) . '/firebase-applet-config.json';
}

$firebaseConfig = [];
if (file_exists($configFile)) {
    $firebaseConfig = json_decode(file_get_contents($configFile), true);
}

$projectId = isset($firebaseConfig['projectId']) ? $firebaseConfig['projectId'] : 'gen-lang-client-0777100836';
$databaseId = isset($firebaseConfig['firestoreDatabaseId']) ? $firebaseConfig['firestoreDatabaseId'] : 'ai-studio-757f7418-7529-496f-99bd-ed8d45ad71f2';
$apiKey = isset($firebaseConfig['apiKey']) ? $firebaseConfig['apiKey'] : '';

// Service Account setup for Admin-level access from PHP
$serviceAccountFile = __DIR__ . '/firebase_service_account.json';
if (!file_exists($serviceAccountFile)) {
    $serviceAccountFile = dirname(__DIR__) . '/firebase_service_account.json';
}

// Helper to get Google OAuth2 Access Token using Service Account Key
function getGoogleAccessToken($saFile) {
    if (!file_exists($saFile)) {
        return null;
    }
    $sa = json_decode(file_get_contents($saFile), true);
    if (!$sa || !isset($sa['private_key']) || !isset($sa['client_email'])) {
        return null;
    }

    $header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
    $now = time();
    $payload = json_encode([
        'iss' => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase',
        'aud' => 'https://oauth2.googleapis.com/token',
        'exp' => $now + 3600,
        'iat' => $now
    ]);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = '';
    if (!openssl_sign($base64UrlHeader . "." . $base64UrlPayload, $signature, $sa['private_key'], 'SHA256')) {
        return null;
    }
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/token');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $jwt
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);

    $resData = json_decode($response, true);
    return isset($resData['access_token']) ? $resData['access_token'] : null;
}

// Extract Authorization token (Bearer JWT)
function getAuthorizationToken() {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        return trim($headers['Authorization']);
    }
    if (isset($headers['authorization'])) {
        return trim($headers['authorization']);
    }
    // Check $_SERVER fallback
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['HTTP_AUTHORIZATION']);
    }
    return null;
}

// Extract User UID from Firebase ID Token (Bearer token)
function getUidFromToken($authHeader) {
    if (!$authHeader || stripos($authHeader, 'Bearer ') !== 0) return null;
    $token = substr($authHeader, 7);
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    try {
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        return isset($payload['user_id']) ? $payload['user_id'] : (isset($payload['sub']) ? $payload['sub'] : null);
    } catch (Exception $e) {
        return null;
    }
}

// ----------------------------------------------------
// 3. Firestore Document Serialization Helpers (REST format converter)
// ----------------------------------------------------
function toFirestoreValue($val) {
    if (is_null($val)) return ['nullValue' => null];
    if (is_bool($val)) return ['booleanValue' => $val];
    if (is_int($val)) return ['integerValue' => (string)$val];
    if (is_float($val) || (is_numeric($val) && strpos($val, '.') !== false)) return ['doubleValue' => (double)$val];
    if (is_numeric($val) && strlen($val) < 15) return ['integerValue' => (string)$val];
    if (is_string($val)) return ['stringValue' => $val];
    if (is_array($val)) {
        if (array_keys($val) === range(0, count($val) - 1)) {
            $vals = [];
            foreach ($val as $v) {
                $vals[] = toFirestoreValue($v);
            }
            return ['arrayValue' => ['values' => $vals]];
        } else {
            $fields = [];
            foreach ($val as $k => $v) {
                $fields[$k] = toFirestoreValue($v);
            }
            return ['mapValue' => ['fields' => $fields]];
        }
    }
    return ['stringValue' => (string)$val];
}

function fromFirestoreValue($val) {
    if (!is_array($val)) return $val;
    if (isset($val['stringValue'])) return $val['stringValue'];
    if (isset($val['integerValue'])) return (int)$val['integerValue'];
    if (isset($val['doubleValue'])) return (double)$val['doubleValue'];
    if (isset($val['booleanValue'])) return (bool)$val['booleanValue'];
    if (isset($val['nullValue'])) return null;
    if (isset($val['arrayValue'])) {
        $arr = [];
        $vals = isset($val['arrayValue']['values']) ? $val['arrayValue']['values'] : [];
        foreach ($vals as $v) {
            $arr[] = fromFirestoreValue($v);
        }
        return $arr;
    }
    if (isset($val['mapValue'])) {
        $map = [];
        $fields = isset($val['mapValue']['fields']) ? $val['mapValue']['fields'] : [];
        foreach ($fields as $k => $v) {
            $map[$k] = fromFirestoreValue($v);
        }
        return $map;
    }
    if (isset($val['fields'])) {
        $map = [];
        foreach ($val['fields'] as $k => $v) {
            $map[$k] = fromFirestoreValue($v);
        }
        return $map;
    }
    return $val;
}

// Clean fields structure from Firestore REST Document API response
function parseFirestoreDoc($doc) {
    if (!$doc || !isset($doc['fields'])) return null;
    $data = [];
    foreach ($doc['fields'] as $k => $v) {
        $data[$k] = fromFirestoreValue($v);
    }
    return $data;
}

// ----------------------------------------------------
// 4. Firestore REST API Database Client Helper
// ----------------------------------------------------
class FirestoreREST {
    private $projectId;
    private $databaseId;
    private $authHeader;
    private $saFile;
    private $apiKey;

    public function __construct($projectId, $databaseId, $authHeader, $saFile, $apiKey) {
        $this->projectId = $projectId;
        $this->databaseId = $databaseId;
        $this->authHeader = $authHeader;
        $this->saFile = $saFile;
        $this->apiKey = $apiKey;
    }

    private function getHeaders() {
        $headers = ['Content-Type: application/json'];
        
        // 1. Try Admin Service Account OAuth Token
        $saToken = getGoogleAccessToken($this->saFile);
        if ($saToken) {
            $headers[] = 'Authorization: Bearer ' . $saToken;
            return $headers;
        }

        // 2. Fallback to forwarding User's ID token if passed from client
        if ($this->authHeader) {
            $headers[] = 'Authorization: ' . $this->authHeader;
            return $headers;
        }

        return $headers;
    }

    private function buildUrl($path) {
        $url = "https://firestore.googleapis.com/v1/projects/{$this->projectId}/databases/{$this->databaseId}/documents/{$path}";
        // Append API Key as URL parameter if no Service Account token or Authorization token is present
        $saToken = getGoogleAccessToken($this->saFile);
        if (!$saToken && !$this->authHeader && $this->apiKey) {
            $url .= "?key=" . $this->apiKey;
        }
        return $url;
    }

    public function get($path) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->buildUrl($path));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status === 200) {
            $data = json_decode($res, true);
            return parseFirestoreDoc($data);
        }
        return null;
    }

    public function set($path, $data) {
        $fields = [];
        foreach ($data as $k => $v) {
            $fields[$k] = toFirestoreValue($v);
        }
        $payload = json_encode(['fields' => $fields]);

        $ch = curl_init();
        // Use PATCH to act as set with merge support
        curl_setopt($ch, CURLOPT_URL, $this->buildUrl($path));
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $status === 200 || $status === 201;
    }

    public function createDocument($collectionPath, $data) {
        $fields = [];
        foreach ($data as $k => $v) {
            $fields[$k] = toFirestoreValue($v);
        }
        $payload = json_encode(['fields' => $fields]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->buildUrl($collectionPath));
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $status === 200 || $status === 201;
    }

    public function query($collection, $whereFields = []) {
        $url = "https://firestore.googleapis.com/v1/projects/{$this->projectId}/databases/{$this->databaseId}/documents:runQuery";
        $saToken = getGoogleAccessToken($this->saFile);
        if (!$saToken && !$this->authHeader && $this->apiKey) {
            $url .= "?key=" . $this->apiKey;
        }

        $filters = [];
        foreach ($whereFields as $f) {
            $filters[] = [
                'fieldFilter' => [
                    'field' => ['fieldPath' => $f['field']],
                    'op' => $f['op'],
                    'value' => toFirestoreValue($f['value'])
                ]
            ];
        }

        $query = [
            'structuredQuery' => [
                'from' => [['collectionId' => $collection]],
            ]
        ];

        if (count($filters) > 0) {
            if (count($filters) === 1) {
                $query['structuredQuery']['where'] = $filters[0];
            } else {
                $query['structuredQuery']['where'] = [
                    'compositeFilter' => [
                        'op' => 'AND',
                        'filters' => $filters
                    ]
                ];
            }
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($query));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        $results = json_decode($res, true);
        $documents = [];
        if (is_array($results)) {
            foreach ($results as $item) {
                if (isset($item['document'])) {
                    $docData = parseFirestoreDoc($item['document']);
                    if ($docData) {
                        $documents[] = $docData;
                    }
                }
            }
        }
        return $documents;
    }
}

// ----------------------------------------------------
// 5. Parse Incoming Request Payload
// ----------------------------------------------------
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!$input) {
    $input = $_POST;
}

$authHeader = getAuthorizationToken();
$userId = getUidFromToken($authHeader);
$db = new FirestoreREST($projectId, $databaseId, $authHeader, $serviceAccountFile, $apiKey);

// Helper to credit user balance securely
function creditUserBalance($db, $targetUserId, $amountToCredit, $invoiceId, $paymentMethod) {
    // 1. Fetch user profile
    $user = $db->get("users/{$targetUserId}");
    if (!$user) {
        return false;
    }

    $currentBalance = isset($user['balance']) ? floatval($user['balance']) : 0.0;
    $newBalance = $currentBalance + floatval($amountToCredit);

    // 2. Update user profile balance
    $user['balance'] = $newBalance;
    $db->set("users/{$targetUserId}", $user);

    // 3. Write Transaction Record
    $txId = 'TXN_' . strtoupper(bin2hex(random_bytes(6)));
    $transaction = [
        'id' => $txId,
        'userId' => $targetUserId,
        'amount' => floatval($amountToCredit),
        'type' => 'deposit',
        'status' => 'completed',
        'createdAt' => date('c'),
        'referenceCode' => $invoiceId,
        'method' => $paymentMethod,
        'senderNumber' => isset($user['phone']) ? $user['phone'] : '01700000000',
        'transactionId' => $invoiceId,
        'description' => "Wallet Recharge via {$paymentMethod}"
    ];
    $db->set("transactions/{$txId}", $transaction);

    // 4. Save notification log
    $notifId = 'NTF_' . strtoupper(bin2hex(random_bytes(6)));
    $notif = [
        'id' => $notifId,
        'userId' => $targetUserId,
        'title' => 'রিচার্জ সফল হয়েছে ⚡',
        'body' => "আপনার ওয়ালেটে ৳{$amountToCredit} সফলভাবে জমা হয়েছে। বর্তমান ব্যালেন্স: ৳{$newBalance}।",
        'sentAt' => date('c'),
        'type' => 'deposit',
        'read' => false
    ];
    $db->set("notifications/{$notifId}", $notif);

    return true;
}

// ----------------------------------------------------
// 6. Router & Endpoint Controllers
// ----------------------------------------------------
switch ($route) {

    // A. API Health Check
    case 'health':
        echo json_encode([
            'status' => 'ok',
            'timestamp' => date('c'),
            'engine' => 'cPanel Mobile-Friendly PHP Native Backend Router'
        ]);
        break;

    // B. ZiNiPay Automated Payment Gateway - Create Invoice
    case 'zinipay/create':
        // Allow guest checkout just like server.ts
        $finalUserId = $userId ? $userId : 'guest_' . time();

        $amount = isset($input['amount']) ? floatval($input['amount']) : 0;
        if ($amount <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid payment amount']);
            break;
        }

        $customerName = isset($input['customerName']) ? $input['customerName'] : 'User';
        $customerEmail = isset($input['customerEmail']) ? $input['customerEmail'] : '';
        $customerPhone = isset($input['customerPhone']) ? $input['customerPhone'] : '';

        if (empty($customerEmail) || strpos($customerEmail, '@') === false) {
            $customerEmail = "user_{$finalUserId}@fahiminternetbd.com";
        }
        if (empty($customerPhone) || strlen($customerPhone) < 10) {
            $customerPhone = '01700000000';
        }

        // Dynamically load active ZiNiPay config from Firestore Settings
        $zinipayApiKey = '6504f874e6643cbf66ccfddc919ed56aacfb88f02ecabc90';
        $zinipayDomain = '';

        $settings = $db->get("settings/site_config");
        if ($settings) {
            if (!empty($settings['zinipayApiKey'])) $zinipayApiKey = $settings['zinipayApiKey'];
            if (!empty($settings['ziniRegisteredDomain'])) $zinipayDomain = $settings['ziniRegisteredDomain'];
        }

        // Build Invoice ID & domain variants
        $invoiceId = 'ZINI' . time() . strtoupper(substr(uniqid(), -5));
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        $httpHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
        $serverName = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : '';

        $candidateDomains = [];
        
        // CRITICAL FIX: If using the default test API key, we MUST send success/cancel URLs with the registered domain 'fahiminternetbd.com'
        // Otherwise, ZiNiPay will load a blank payment page without showing bKash/Nagad/Rocket payment methods due to domain mismatch.
        if ($zinipayApiKey === '6504f874e6643cbf66ccfddc919ed56aacfb88f02ecabc90') {
            $candidateDomains[] = 'https://fahiminternetbd.com';
            $candidateDomains[] = 'https://www.fahiminternetbd.com';
        }

        if ($zinipayDomain) $candidateDomains[] = $zinipayDomain;
        if ($origin) $candidateDomains[] = $origin;
        if ($httpHost) {
            $candidateDomains[] = 'https://' . $httpHost;
            $candidateDomains[] = 'http://' . $httpHost;
        }
        if ($serverName) {
            $candidateDomains[] = 'https://' . $serverName;
            $candidateDomains[] = 'http://' . $serverName;
        }
        
        // Brand domain variations
        $brandDomains = [
            'https://fahiminternetbd.com',
            'https://www.fahiminternetbd.com',
            'https://fahiminternet.com',
            'https://www.fahiminternet.com',
            'https://fahim-internet.com',
            'https://www.fahim-internet.com',
            'https://fahiminternet.xyz',
            'https://fahim-internet.xyz',
            'https://fahiminternetbd.net',
            'https://fahiminternet.vercel.app',
            'https://fahim-internet.web.app',
            'https://daily-internet-offer-bd.web.app',
            'https://daily-internet-offer-bd.firebaseapp.com'
        ];
        $candidateDomains = array_merge($candidateDomains, $brandDomains);

        // Filter and generate https/http variants
        $uniqueDomains = [];
        foreach ($candidateDomains as $d) {
            if (!$d) continue;
            $clean = rtrim(trim($d), '/');
            if (strpos($clean, 'http') !== 0) $clean = 'https://' . $clean;
            $uniqueDomains[] = $clean;
            
            // Add www/non-www variant if applicable
            $parts = parse_url($clean);
            if (isset($parts['host'])) {
                $host = $parts['host'];
                if (substr($host, 0, 4) === 'www.') {
                    $nakedHost = substr($host, 4);
                    $uniqueDomains[] = $parts['scheme'] . '://' . $nakedHost . (isset($parts['path']) ? $parts['path'] : '');
                } else {
                    $uniqueDomains[] = $parts['scheme'] . '://www.' . $host . (isset($parts['path']) ? $parts['path'] : '');
                }
            }
        }
        $uniqueDomains = array_unique($uniqueDomains);

        $paymentUrl = '';
        $chosenInvoiceId = $invoiceId;
        $resultsLog = [];

        // Try candidate domains to hit ZiNiPay API sequentially
        foreach ($uniqueDomains as $domain) {
            $successUrl = "{$domain}/?zinistatus=success&invoiceId={$invoiceId}";
            $cancelUrl = "{$domain}/?zinistatus=cancel&invoiceId={$invoiceId}";

            $payload = [
                'amount' => $amount,
                'invoiceId' => $invoiceId,
                'invoice_id' => $invoiceId,
                'order_id' => $invoiceId,
                'successUrl' => $successUrl,
                'success_url' => $successUrl,
                'cancelUrl' => $cancelUrl,
                'cancel_url' => $cancelUrl,
                'customerName' => $customerName,
                'customer_name' => $customerName,
                'cus_name' => $customerName,
                'customerEmail' => $customerEmail,
                'customer_email' => $customerEmail,
                'cus_email' => $customerEmail,
                'customerPhone' => $customerPhone,
                'customer_phone' => $customerPhone,
                'cus_phone' => $customerPhone,
                'currency' => 'BDT',
                'desc' => 'Deposit to Wallet'
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.zinipay.com/v1/payment/create');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "zini-api-key: {$zinipayApiKey}",
                "Content-Type: application/json"
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $resultsLog[] = ['domain' => $domain, 'status' => $httpCode, 'response' => $response];

            if ($httpCode === 200 || $httpCode === 201) {
                $resData = json_decode($response, true);
                // Look for checkout URL in response key sets
                $keys = ['paymentUrl', 'payment_url', 'checkoutUrl', 'checkout_url', 'redirectUrl', 'redirect_url', 'url'];
                foreach ($keys as $k) {
                    if (isset($resData[$k]) && !empty($resData[$k]) && stripos($resData[$k], 'http') === 0) {
                        $paymentUrl = $resData[$k];
                        $chosenInvoiceId = $domainInvoiceId;
                        break 2;
                    }
                }
            }
        }

        if (!$paymentUrl) {
            http_response_code(400);
            echo json_encode([
                'error' => 'ZiNiPay payment creation failed',
                'details' => json_encode($resultsLog)
            ]);
            break;
        }

        // Save pending payment log to Firestore
        $db->set("processed_payments/{$chosenInvoiceId}", [
            'invoiceId' => $chosenInvoiceId,
            'userId' => $userId,
            'amount' => $amount,
            'status' => 'pending',
            'createdAt' => date('c'),
            'customerName' => $customerName,
            'customerEmail' => $customerEmail,
            'customerPhone' => $customerPhone
        ]);

        echo json_encode([
            'success' => true,
            'paymentUrl' => $paymentUrl,
            'invoiceId' => $chosenInvoiceId
        ]);
        break;

    // C. ZiNiPay - Verify Invoice Payment
    case 'zinipay/verify':
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        $invoiceId = isset($input['invoiceId']) ? trim($input['invoiceId']) : '';
        if (empty($invoiceId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing invoice ID']);
            break;
        }

        // Load active ZiNiPay configuration
        $zinipayApiKey = '6504f874e6643cbf66ccfddc919ed56aacfb88f02ecabc90';
        $settings = $db->get("settings/site_config");
        if ($settings && !empty($settings['zinipayApiKey'])) {
            $zinipayApiKey = $settings['zinipayApiKey'];
        }

        // Call verification API
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.zinipay.com/v1/payment/verify');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "zini-api-key: {$zinipayApiKey}",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['invoiceId' => $invoiceId]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 && $httpCode !== 201) {
            http_response_code($httpCode);
            echo json_encode(['error' => 'ZiNiPay verification failed', 'details' => $response]);
            break;
        }

        $resData = json_decode($response, true);
        
        $isSuccess = false;
        $statusKey = isset($resData['status']) ? strtolower($resData['status']) : '';
        if (in_array($statusKey, ['success', 'completed', 'paid'])) {
            $isSuccess = true;
        } elseif (isset($resData['data']) && is_array($resData['data'])) {
            $subStatus = isset($resData['data']['status']) ? strtolower($resData['data']['status']) : '';
            if (in_array($subStatus, ['success', 'completed', 'paid'])) {
                $isSuccess = true;
            }
        }

        if (!$isSuccess) {
            echo json_encode(['success' => false, 'status' => 'pending', 'message' => 'Payment not completed or pending']);
            break;
        }

        $amountPaid = 0.0;
        if (isset($resData['amount'])) $amountPaid = floatval($resData['amount']);
        elseif (isset($resData['data']['amount'])) $amountPaid = floatval($resData['data']['amount']);

        // Check if invoice already credited
        $pp = $db->get("processed_payments/{$invoiceId}");
        if ($pp && isset($pp['status']) && $pp['status'] === 'completed') {
            echo json_encode(['success' => true, 'status' => 'completed', 'verified' => true, 'amount' => $amountPaid]);
            break;
        }

        $targetUserId = ($pp && isset($pp['userId'])) ? $pp['userId'] : $userId;

        // Perform transaction logic and credit balance
        if ($amountPaid > 0) {
            $credited = creditUserBalance($db, $targetUserId, $amountPaid, $invoiceId, 'ZiNiPay');
            if ($credited) {
                // Update payment record to completed
                if ($pp) {
                    $pp['status'] = 'completed';
                    $pp['amountPaid'] = $amountPaid;
                    $db->set("processed_payments/{$invoiceId}", $pp);
                } else {
                    $db->set("processed_payments/{$invoiceId}", [
                        'invoiceId' => $invoiceId,
                        'userId' => $targetUserId,
                        'amount' => $amountPaid,
                        'status' => 'completed',
                        'createdAt' => date('c')
                    ]);
                }
                echo json_encode(['success' => true, 'status' => 'completed', 'verified' => true, 'amount' => $amountPaid]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to credit user balance']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid payment amount detected']);
        }
        break;

    // D. ZiNiPay Webhook Callback Handler
    case 'zinipay/webhook':
        // Webhook handles automatic payment logs & user credits asynchronously
        $invoiceId = isset($input['invoiceId']) ? trim($input['invoiceId']) : (isset($input['invoice_id']) ? trim($input['invoice_id']) : '');
        if (empty($invoiceId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing invoiceId']);
            break;
        }

        // Fetch payment record
        $pp = $db->get("processed_payments/{$invoiceId}");
        if ($pp && isset($pp['status']) && $pp['status'] === 'completed') {
            echo json_encode(['success' => true, 'status' => 'already_completed']);
            break;
        }

        $amountPaid = isset($input['amount']) ? floatval($input['amount']) : 0.0;
        if ($amountPaid <= 0 && isset($input['data']['amount'])) {
            $amountPaid = floatval($input['data']['amount']);
        }

        $targetUserId = ($pp && isset($pp['userId'])) ? $pp['userId'] : null;
        if (!$targetUserId) {
            http_response_code(400);
            echo json_encode(['error' => 'Pending payment record not found for invoice']);
            break;
        }

        $credited = creditUserBalance($db, $targetUserId, $amountPaid, $invoiceId, 'ZiNiPay');
        if ($credited) {
            if ($pp) {
                $pp['status'] = 'completed';
                $pp['amountPaid'] = $amountPaid;
                $db->set("processed_payments/{$invoiceId}", $pp);
            }
            echo json_encode(['success' => true, 'credited' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Balance crediting failure']);
        }
        break;

    // E. SMS Automated Verification Receiver (Personal Mobile Forwarding)
    case 'webhook/sms':
        $sender = isset($input['from']) ? $input['from'] : (isset($input['sender']) ? $input['sender'] : (isset($input['senderName']) ? $input['senderName'] : ''));
        $body = isset($input['body']) ? $input['body'] : (isset($input['message']) ? $input['message'] : (isset($input['text']) ? $input['text'] : ''));

        if (empty($body)) {
            http_response_code(400);
            echo json_encode(['error' => 'SMS body is empty']);
            break;
        }

        // Run SMS parser
        $text = trim($body);
        $senderLower = strtolower($sender);
        $trxId = '';
        $amount = 0.0;
        $senderNumber = '';
        $method = 'bkash';

        if (strpos($senderLower, 'bkash') !== false || stripos($text, 'bkash') !== false) {
            $method = 'bkash';
        } elseif (strpos($senderLower, 'nagad') !== false || stripos($text, 'nagad') !== false) {
            $method = 'nagad';
        } elseif (strpos($senderLower, 'rocket') !== false || stripos($text, 'rocket') !== false) {
            $method = 'rocket';
        }

        // Parse TrxID
        if (preg_match('/(?:TrxID|TxID|Txid|trxid|txid)\s*[:\s]*([A-Za-z0-9]+)/i', $text, $matches)) {
            $trxId = strtoupper(trim($matches[1]));
        }

        // Parse Amount
        if (preg_match('/(?:BDT|Tk|Tk\.|৳)\s*([0-9,]+(?:\.[0-9]+)?)/i', $text, $matches)) {
            $amount = floatval(str_replace(',', '', $matches[1]));
        } elseif (preg_match('/([0-9,]+(?:\.[0-9]+)?)\s*(?:BDT|Tk|Tk\.|৳)/i', $text, $matches)) {
            $amount = floatval(str_replace(',', '', $matches[1]));
        }

        // Parse sender phone
        if (preg_match('/(?:from|sender)\s*(01[3-9][0-9]{8})/i', $text, $matches)) {
            $senderNumber = trim($matches[1]);
        } elseif (preg_match('/(01[3-9][0-9]{8})/', $text, $matches)) {
            $senderNumber = trim($matches[1]);
        }

        // Save Raw SMS Log to Firestore
        $logId = 'LOG_' . strtoupper(bin2hex(random_bytes(6)));
        $db->set("raw_sms_log/{$logId}", [
            'sender' => $sender,
            'body' => $body,
            'receivedAt' => date('c'),
            'parsed' => (!empty($trxId) && $amount > 0)
        ]);

        if (empty($trxId) || $amount <= 0) {
            echo json_encode(['success' => true, 'parsed' => false, 'message' => 'Message logged, but could not identify transaction ID or amount']);
            break;
        }

        // Log received SMS payment to Firestore
        $smsRecord = [
            'id' => $trxId,
            'trxId' => $trxId,
            'sender' => $sender,
            'body' => $body,
            'amount' => $amount,
            'senderNumber' => $senderNumber,
            'method' => $method,
            'receivedAt' => date('c'),
            'status' => 'pending'
        ];
        $db->set("received_sms_payments/{$trxId}", $smsRecord);

        // Check if there is any pending manual deposit waiting for this Transaction ID
        $manualTxList = $db->query("transactions", [
            ['field' => 'transactionId', 'op' => 'EQUAL', 'value' => $trxId],
            ['field' => 'status', 'op' => 'EQUAL', 'value' => 'pending']
        ]);

        if (count($manualTxList) > 0) {
            $waitingTx = $manualTxList[0];
            $waitingTxId = $waitingTx['id'];
            $targetUserId = $waitingTx['userId'];
            $targetAmount = floatval($waitingTx['amount']);

            // Validate match
            if ($amount >= $targetAmount) {
                // Instantly credit user balance
                $credited = creditUserBalance($db, $targetUserId, $amount, $trxId, $method);
                if ($credited) {
                    // Update Transaction record
                    $waitingTx['status'] = 'completed';
                    $waitingTx['amount'] = $amount; // adjust to actual amount sent
                    $db->set("transactions/{$waitingTxId}", $waitingTx);

                    // Mark SMS payment as completed
                    $smsRecord['status'] = 'completed';
                    $smsRecord['matchedUserId'] = $targetUserId;
                    $db->set("received_sms_payments/{$trxId}", $smsRecord);

                    echo json_encode(['success' => true, 'matched' => true, 'credited' => true, 'trxId' => $trxId]);
                    break;
                }
            }
        }

        echo json_encode(['success' => true, 'parsed' => true, 'matched' => false, 'trxId' => $trxId]);
        break;

    // F. Manual Deposit Submit & Live Matching Engine
    case 'deposit/submit-manual':
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized: Invalid authentication token']);
            break;
        }

        $amount = isset($input['amount']) ? floatval($input['amount']) : 0.0;
        $transactionId = isset($input['transactionId']) ? strtoupper(trim($input['transactionId'])) : '';
        $senderNumber = isset($input['senderNumber']) ? trim($input['senderNumber']) : '';
        $method = isset($input['method']) ? strtolower($input['method']) : 'bkash';
        $screenshot = isset($input['screenshot']) ? $input['screenshot'] : '';

        if ($amount <= 0 || empty($senderNumber)) {
            http_response_code(400);
            echo json_encode(['error' => 'সঠিক পরিমাণ এবং স্যান্ডার মোবাইল নাম্বার দিন']);
            break;
        }

        if (empty($transactionId)) {
            $transactionId = 'WAIT_' . strtoupper(bin2hex(random_bytes(5)));
        }

        // Check if duplicate transaction ID
        $dups = $db->query("transactions", [
            ['field' => 'transactionId', 'op' => 'EQUAL', 'value' => $transactionId],
            ['field' => 'status', 'op' => 'EQUAL', 'value' => 'completed']
        ]);
        if (count($dups) > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'এই ট্রানজেকশন আইডিটি ইতোমধ্যে ব্যবহৃত হয়েছে!']);
            break;
        }

        // Check if matching SMS is already received in received_sms_payments
        $smsPayment = $db->get("received_sms_payments/{$transactionId}");
        
        $txId = 'TXN_' . strtoupper(bin2hex(random_bytes(6)));
        $depositRecord = [
            'id' => $txId,
            'userId' => $userId,
            'amount' => $amount,
            'type' => 'deposit',
            'status' => 'pending',
            'createdAt' => date('c'),
            'referenceCode' => $transactionId,
            'method' => $method,
            'senderNumber' => $senderNumber,
            'transactionId' => $transactionId,
            'screenshot' => $screenshot,
            'description' => "Manual Wallet Recharge via {$method}"
        ];

        // Match found! Instantly credit wallet balance
        if ($smsPayment && isset($smsPayment['status']) && $smsPayment['status'] === 'pending' && floatval($smsPayment['amount']) >= $amount) {
            $credited = creditUserBalance($db, $userId, floatval($smsPayment['amount']), $transactionId, $method);
            if ($credited) {
                $depositRecord['status'] = 'completed';
                $depositRecord['amount'] = floatval($smsPayment['amount']);
                $db->set("transactions/{$txId}", $depositRecord);

                // Mark SMS as matched
                $smsPayment['status'] = 'completed';
                $smsPayment['matchedUserId'] = $userId;
                $db->set("received_sms_payments/{$transactionId}", $smsPayment);

                echo json_encode(['success' => true, 'instantlyMatched' => true, 'amount' => floatval($smsPayment['amount'])]);
                break;
            }
        }

        // No matching SMS yet, store as pending for admin approval or future matching
        $db->set("transactions/{$txId}", $depositRecord);
        echo json_encode(['success' => true, 'instantlyMatched' => false, 'message' => 'রিচার্জ রিকোয়েস্ট পেন্ডিং অবস্থায় রয়েছে। ট্রানজেকশনটি ভেরিফাই করা হচ্ছে।']);
        break;

    // G. User Notify-Self (User Client Push Notifications)
    case 'user/notify-self':
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        $title = isset($input['title']) ? $input['title'] : '';
        $body = isset($input['body']) ? $input['body'] : '';
        $type = isset($input['type']) ? $input['type'] : 'general';

        if (empty($title) || empty($body)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing title or body']);
            break;
        }

        // Save notification to Firestore
        $notifId = 'NTF_' . strtoupper(bin2hex(random_bytes(6)));
        $db->set("notifications/{$notifId}", [
            'id' => $notifId,
            'userId' => $userId,
            'title' => $title,
            'body' => $body,
            'sentAt' => date('c'),
            'type' => $type,
            'read' => false
        ]);

        // Get OneSignal user registered subscription id to dispatch Web Push alerts
        $userProfile = $db->get("users/{$userId}");
        $onesignalId = null;
        if ($userProfile) {
            $onesignalId = isset($userProfile['onesignalId']) ? $userProfile['onesignalId'] : (isset($userProfile['onesignalSubscriptionId']) ? $userProfile['onesignalSubscriptionId'] : null);
        }

        if (!$onesignalId) {
            echo json_encode(['success' => true, 'message' => 'Notification saved to database', 'onesignalId' => null]);
            break;
        }

        // Load OneSignal credentials from Firestore settings
        $oneSignalAppId = '';
        $oneSignalApiKey = '';
        $osSettings = $db->get("settings/onesignal");
        if ($osSettings) {
            $oneSignalAppId = isset($osSettings['appId']) ? $osSettings['appId'] : '';
            $oneSignalApiKey = isset($osSettings['apiKey']) ? $osSettings['apiKey'] : '';
        }

        if (empty($oneSignalAppId) || empty($oneSignalApiKey)) {
            echo json_encode(['success' => true, 'warning' => 'OneSignal config not set in Admin Panel', 'onesignalId' => $onesignalId]);
            break;
        }

        // Push Alert JSON payload
        $osPayload = [
            'app_id' => $oneSignalAppId,
            'headings' => ['en' => $title, 'bn' => $title],
            'contents' => ['en' => $body, 'bn' => $body],
            'include_subscription_ids' => [$onesignalId],
            'include_player_ids' => [$onesignalId]
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://onesignal.com/api/v1/notifications');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json; charset=utf-8",
            "Authorization: Basic {$oneSignalApiKey}"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($osPayload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        echo json_encode(['success' => true, 'onesignalResult' => json_decode($res, true)]);
        break;

    // H. Admin Push Alert Broadcast
    case 'admin/push-broadcast':
        // Verify Admin status of calling token
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        $userProfile = $db->get("users/{$userId}");
        $role = isset($userProfile['role']) ? $userProfile['role'] : '';
        if ($role !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Admin permissions required']);
            break;
        }

        // Load OneSignal config
        $oneSignalAppId = '';
        $oneSignalApiKey = '';
        $osSettings = $db->get("settings/onesignal");
        if ($osSettings) {
            $oneSignalAppId = isset($osSettings['appId']) ? $osSettings['appId'] : '';
            $oneSignalApiKey = isset($osSettings['apiKey']) ? $osSettings['apiKey'] : '';
        }

        if (empty($oneSignalAppId) || empty($oneSignalApiKey)) {
            http_response_code(400);
            echo json_encode(['error' => 'OneSignal configurations are missing in Admin Panel']);
            break;
        }

        $title = isset($input['title']) ? $input['title'] : '';
        $body = isset($input['body']) ? $input['body'] : '';
        $imageUrl = isset($input['imageUrl']) ? $input['imageUrl'] : '';
        $targetUserId = isset($input['targetUserId']) ? $input['targetUserId'] : 'all';

        if (empty($title) || empty($body)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing title or body']);
            break;
        }

        $osPayload = [
            'app_id' => $oneSignalAppId,
            'headings' => ['en' => $title, 'bn' => $title],
            'contents' => ['en' => $body, 'bn' => $body],
        ];

        if (!empty($imageUrl)) {
            $osPayload['big_picture'] = $imageUrl;
            $osPayload['chrome_web_image'] = $imageUrl;
            $osPayload['ios_attachments'] = ['id' => $imageUrl];
        }

        $isTargeted = ($targetUserId && $targetUserId !== 'all' && !empty($targetUserId));

        if ($isTargeted) {
            // Send to a single user
            $targetProfile = $db->get("users/{$targetUserId}");
            if (!$targetProfile) {
                http_response_code(404);
                echo json_encode(['error' => 'Target user profile not found']);
                break;
            }

            $onesignalId = isset($targetProfile['onesignalId']) ? $targetProfile['onesignalId'] : (isset($targetProfile['onesignalSubscriptionId']) ? $targetProfile['onesignalSubscriptionId'] : null);
            
            // Save inside user notification center regardless
            $notifId = 'NTF_' . strtoupper(bin2hex(random_bytes(6)));
            $db->set("notifications/{$notifId}", [
                'id' => $notifId,
                'userId' => $targetUserId,
                'title' => $title,
                'body' => $body,
                'sentAt' => date('c'),
                'type' => 'general',
                'read' => false
            ]);

            if ($onesignalId) {
                $osPayload['include_subscription_ids'] = [$onesignalId];
                $osPayload['include_player_ids'] = [$onesignalId];
            } else {
                echo json_encode(['success' => true, 'warning' => 'OneSignal ID not registered, saved to notifications center']);
                break;
            }
        } else {
            // Broadcast to all users
            $osPayload['included_segments'] = ['All Users', 'Subscribed Users'];
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://onesignal.com/api/v1/notifications');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json; charset=utf-8",
            "Authorization: Basic {$oneSignalApiKey}"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($osPayload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        echo json_encode(['success' => true, 'onesignalResult' => json_decode($res, true)]);
        break;

    // I. AI Assistant - Offers recommendation & prediction generator
    case 'ai/recommend':
        $userUsage = isset($input['userUsage']) ? $input['userUsage'] : [];
        $activeOffers = isset($input['activeOffers']) ? $input['activeOffers'] : [];

        // Try load Gemini key
        $geminiApiKey = getenv('GEMINI_API_KEY');
        if (empty($geminiApiKey) && isset($_ENV['GEMINI_API_KEY'])) $geminiApiKey = $_ENV['GEMINI_API_KEY'];
        // Or check system settings
        if (empty($geminiApiKey)) {
            $settings = $db->get("settings/general");
            if ($settings && !empty($settings['geminiApiKey'])) {
                $geminiApiKey = $settings['geminiApiKey'];
            }
        }

        if (empty($geminiApiKey)) {
            // Standard Failsafe fallback
            $exhaustionDays = (isset($userUsage['dailyDataLimit']) && floatval($userUsage['dailyDataLimit']) > 0) ? ceil(1.5 / floatval($userUsage['dailyDataLimit'])) : 15;
            echo json_encode([
                'status' => 'fallback',
                'aiAnalysis' => "টার্মিনালে Gemini API কী কনফিগার করা নেই, তাই অফলাইন এলগরিদম দিয়ে আপনার ডাটা বিশ্লেষণ করা হয়েছে।",
                'predictions' => [
                    'exhaustionDays' => $exhaustionDays,
                    'nextRechargeDate' => date('d/m/Y', strtotime("+{$exhaustionDays} days")),
                    'status' => "সাশ্রয়ী ও ব্যালেন্সড ইন্টারনেট প্যাকেজ ব্যবহার করুন।"
                ],
                'userCategory' => "Heavy User",
                'fraudRisk' => "Minimal (Safe)",
                'savingsEstimate' => 50,
                'recommendedOfferIds' => count($activeOffers) > 0 ? array_slice(array_column($activeOffers, 'id'), 0, 3) : []
            ]);
            break;
        }

        $prompt = "You are a high-fidelity Mobile Networks AI Recommendation Engine in Bangladesh.\n" .
                  "Analyze the user's mobile data usage properties and the currently available active offers list.\n" .
                  "Generate a personalized analytics report in Bengali.\n\n" .
                  "User usage stats:\n" . json_encode($userUsage, JSON_PRETTY_PRINT) . "\n\n" .
                  "Active offers:\n" . json_encode($activeOffers, JSON_PRETTY_PRINT) . "\n\n" .
                  "Output a valid JSON object matching the following structure:\n" .
                  "{\n" .
                  "  \"userCategory\": \"Heavy User\" | \"Call User\" | \"Night User\" | \"Gaming User\",\n" .
                  "  \"aiAnalysis\": \"detailed Bengali prompt explaining their habits and suggestions\",\n" .
                  "  \"predictions\": {\n" .
                  "    \"exhaustionDays\": number,\n" .
                  "    \"nextRechargeDate\": \"DD/MM/YYYY text\",\n" .
                  "    \"status\": \"detailed Bengali status message\"\n" .
                  "  },\n" .
                  "  \"fraudRisk\": \"Safe\" | \"Suspicious\",\n" .
                  "  \"savingsEstimate\": number,\n" .
                  "  \"recommendedOfferIds\": [\"array of matching offer ids chosen from the activeOffers list\"]\n" .
                  "}\n\n" .
                  "Ensure the output contains strictly valid JSON, no markdown formatting, and no conversational filler outside of the JSON block.";

        $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$geminiApiKey}";
        $payload = [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.2
            ]
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $geminiUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        $resData = json_decode($res, true);
        if (isset($resData['candidates'][0]['content']['parts'][0]['text'])) {
            $textRes = trim($resData['candidates'][0]['content']['parts'][0]['text']);
            $parsed = json_decode($textRes, true);
            if ($parsed) {
                echo json_encode(array_merge(['status' => 'ok'], $parsed));
                break;
            }
        }

        // Final failsafe
        echo json_encode([
            'status' => 'ok',
            'userCategory' => 'Heavy User',
            'aiAnalysis' => 'আপনার নিয়মিত মোবাইল ব্যবহারে ডাটা কনজাম্পশন ভালো রয়েছে। আপনার জন্য আমাদের আকর্ষনীয় ও সাশ্রয়ী ইন্টারনেট প্যাকগুলো রিকমেন্ড করা হলো।',
            'predictions' => [
                'exhaustionDays' => 14,
                'nextRechargeDate' => date('d/m/Y', strtotime('+14 days')),
                'status' => 'নরমাল প্যাকেট অ্যাক্টিভ রয়েছে।'
            ],
            'fraudRisk' => 'Safe',
            'savingsEstimate' => 40,
            'recommendedOfferIds' => []
        ]);
        break;

    // J. AI Assistant - Interactive Chat Session
    case 'ai/chat':
        $message = isset($input['message']) ? $input['message'] : '';
        $history = isset($input['history']) ? $input['history'] : [];
        $userUsage = isset($input['userUsage']) ? $input['userUsage'] : [];
        $activeOffers = isset($input['activeOffers']) ? $input['activeOffers'] : [];

        // Load Gemini key
        $geminiApiKey = getenv('GEMINI_API_KEY');
        if (empty($geminiApiKey) && isset($_ENV['GEMINI_API_KEY'])) $geminiApiKey = $_ENV['GEMINI_API_KEY'];
        if (empty($geminiApiKey)) {
            $settings = $db->get("settings/general");
            if ($settings && !empty($settings['geminiApiKey'])) {
                $geminiApiKey = $settings['geminiApiKey'];
            }
        }

        if (empty($geminiApiKey)) {
            $botText = "আমি আপনার স্মার্ট অফার অ্যাসিস্ট্যান্ট। দুঃখিত, সিস্টেমে Gemini API কী কনফিগার করা নেই। তাই আমি আপনাকে লোকাল অফার লিস্ট সাজেস্ট করছি। \n\n";
            if (count($activeOffers) > 0) {
                $botText .= "আমাদের এখানে কিছু সেরা অফার আছে:\n";
                foreach (array_slice($activeOffers, 0, 3) as $o) {
                    $botText .= "⚡ **" . (isset($o['operator']) ? $o['operator'] : 'মোবাইল') . "** - " . (isset($o['title']) ? $o['title'] : '') . ": মাত্র **৳" . (isset($o['price']) ? $o['price'] : '') . "** (" . (isset($o['validity']) ? $o['validity'] : '') . ")\n";
                }
            } else {
                $botText .= "দয়া করে Plans পেইজে গিয়ে আমাদের সাশ্রয়ী ও আকর্ষনীয় প্যাকগুলো চেক করুন!";
            }
            echo json_encode(['text' => $botText]);
            break;
        }

        $systemInstruction = "You are the AI Smart Offer Assistant for 'FAHIM INTERNET' (fahim-internet).\n" .
                             "Your duty is to assist users in selecting the absolute best mobile internet, minute, or bundle packages in Bangladesh (available operators: GP, Robi, Airtel, Banglalink, Teletalk, Skitto).\n\n" .
                             "The user's usage profile and tracking details are:\n" . json_encode($userUsage, JSON_PRETTY_PRINT) . "\n\n" .
                             "Currently active offers available:\n" . json_encode($activeOffers, JSON_PRETTY_PRINT) . "\n\n" .
                             "Rules of Engagement:\n" .
                             "1. Conduct the chat primarily in warm, conversational, and helpful Bengali. Use relevant emojis (like ⚡, 📶, 🔴, 💰, 🎁).\n" .
                             "2. Answer queries intelligently. Recommend offers with price, data limits, and operator details.\n" .
                             "3. Mention real available active offers first. If no offers fit, suggest they build their exact customized pack using our built-in 'Custom Pack Builder'.\n" .
                             "4. Keep answers concise, beautiful, and structured with clean markdown.\n" .
                             "5. Always refer to yourself as Nexus AI Assistant.";

        $contentsList = [];
        foreach ($history as $h) {
            $contentsList[] = [
                'role' => ($h['role'] === 'user' ? 'user' : 'model'),
                'parts' => [['text' => $h['text']]]
            ];
        }
        $contentsList[] = [
            'role' => 'user',
            'parts' => [['text' => $message]]
        ];

        $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$geminiApiKey}";
        $payload = [
            'contents' => $contentsList,
            'systemInstruction' => [
                'parts' => [['text' => $systemInstruction]]
            ]
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $geminiUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        $resData = json_decode($res, true);
        $botText = '';
        if (isset($resData['candidates'][0]['content']['parts'][0]['text'])) {
            $botText = trim($resData['candidates'][0]['content']['parts'][0]['text']);
        }

        if (empty($botText)) {
            $botText = "দুঃখিত, আমি আপনার প্রশ্নের উত্তর এই মুহূর্তে প্রসেস করতে পারছি না। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
        }

        echo json_encode(['text' => $botText]);
        break;

    // K. Proxy for AlMaktaba SuperApp (Bypass SAMEORIGIN security blocks)
    case (preg_match('/^proxy-almaktaba(.*)/', $route, $m) ? true : false):
        $pathWithQuery = isset($m[1]) ? $m[1] : '';
        $targetUrl = 'https://ais-pre-wjgzvuciplxpsqtw2fcmqe-117943534727.asia-southeast1.run.app' . $pathWithQuery;

        $headers = [];
        foreach (getallheaders() as $key => $value) {
            $keyLower = strtolower($key);
            if (!in_array($keyLower, ['host', 'connection', 'referer', 'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site'])) {
                $headers[] = "{$key}: {$value}";
            }
        }
        $headers[] = 'Host: ais-pre-wjgzvuciplxpsqtw2fcmqe-117943534727.asia-southeast1.run.app';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $targetUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HEADER, true);

        if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
        }

        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $resHeaders = substr($response, 0, $headerSize);
        $resBody = substr($response, $headerSize);

        // Parse & dispatch headers
        foreach (explode("\r\n", $resHeaders) as $hdr) {
            if (empty($hdr)) continue;
            if (stripos($hdr, 'HTTP/') === 0) continue;
            
            $parts = explode(':', $hdr, 2);
            if (count($parts) === 2) {
                $k = strtolower(trim($parts[0]));
                if (!in_array($k, ['x-frame-options', 'content-security-policy', 'content-encoding', 'transfer-encoding', 'connection'])) {
                    header(trim($hdr));
                }
            }
        }

        // Explicitly allow embedding
        header('X-Frame-Options: ALLOWALL');
        header("Content-Security-Policy: frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        http_response_code($httpCode);

        // Handle HTML page base inject
        $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        if (stripos($contentType, 'text/html') !== false || stripos($targetUrl, '.html') !== false || empty($contentType)) {
            $baseTag = '<base href="https://ais-pre-wjgzvuciplxpsqtw2fcmqe-117943534727.asia-southeast1.run.app/">';
            if (stripos($resBody, '<head>') !== false) {
                $resBody = str_ireplace('<head>', "<head>{$baseTag}", $resBody);
            } else {
                $resBody = $baseTag . $resBody;
            }
        }

        echo $resBody;
        break;

    // L. Default error for unknown API endpoints
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'Endpoint not found',
            'route' => $route
        ]);
        break;
}
