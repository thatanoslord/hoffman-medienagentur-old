<?php
header('Content-Type: application/json');

// 1. Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 2. Simple rate limit: max 10 checks per minute per visitor
session_start();
$now = time();
$_SESSION['hits'] = array_filter($_SESSION['hits'] ?? [], fn($t) => $t > $now - 60);
if (count($_SESSION['hits']) >= 10) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests, please wait a minute']);
    exit;
}
$_SESSION['hits'][] = $now;

// 3. Validate the domain
$input  = json_decode(file_get_contents('php://input'), true);
$domain = strtolower(trim($input['domain'] ?? ''));
if (!preg_match('/^(?!-)[a-z0-9-]{1,63}(?<!-)\.[a-z]{2,24}$/', $domain)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid domain']);
    exit;
}
[$name, $tld] = explode('.', $domain, 2);

// 4. Read the token from .env (stored ABOVE public_html)
$env   = parse_ini_file(__DIR__ . '/../../.env');
$token = $env['HOSTINGER_API_TOKEN'] ?? '';
if ($token === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Something went wrong']);
    exit;
}

// 5. Ask Hostinger
$ch = curl_init('https://developers.hostinger.com/api/domains/v1/availability');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS     => json_encode([
        'domain' => $name,
        'tlds'   => [$tld],
    ]),
]);
$response = curl_exec($ch);
$status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $status !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'Something went wrong']);
    exit;
}

// 6. Return only available / unavailable
$data      = json_decode($response, true);
$available = $data[0]['is_available'] ?? false;
echo json_encode(['available' => (bool) $available]);