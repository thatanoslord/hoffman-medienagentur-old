<?php
header('Content-Type: application/json');
session_start();

// Rate limit: max 60 requests per minute per visitor
// (one search = about 4 availability requests + 1 prices request)
$now = time();
$_SESSION['hits'] = array_filter($_SESSION['hits'] ?? [], fn($t) => $t > $now - 60);
if (count($_SESSION['hits']) >= 60) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests, please wait a minute']);
    exit;
}
$_SESSION['hits'][] = $now;

// Load the token from .env (server: above public_html; local test: project root)
$envFile = file_exists(__DIR__ . '/../../.env') ? __DIR__ . '/../../.env' : __DIR__ . '/../.env';
$env   = @parse_ini_file($envFile);
$token = $env['HOSTINGER_API_TOKEN'] ?? '';
if ($token === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Something went wrong']);
    exit;
}

function hostinger($path, $body = null, $token = '') {
    $ch = curl_init('https://developers.hostinger.com' . $path);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
            'Accept: application/json',
        ],
    ];
    if ($body !== null) {
        $opts[CURLOPT_POST]       = true;
        $opts[CURLOPT_POSTFIELDS] = json_encode($body);
    }
    curl_setopt_array($ch, $opts);
    $res    = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($res === false || $status !== 200) ? null : json_decode($res, true);
}

function fail($code = 502) {
    http_response_code($code);
    echo json_encode(['error' => 'Something went wrong']);
    exit;
}

$action = $_GET['action'] ?? '';

// ---- Availability ----
if ($action === 'availability' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $in   = json_decode(file_get_contents('php://input'), true);
    $name = strtolower(trim($in['domain'] ?? ''));
    $tlds = $in['tlds'] ?? [];

    if (!preg_match('/^(?!-)[a-z0-9-]{1,63}(?<!-)$/', $name)) fail(400);
    if (!is_array($tlds) || count($tlds) < 1 || count($tlds) > 15) fail(400);
    foreach ($tlds as $t) {
        if (!is_string($t) || !preg_match('/^[a-z0-9]{2,24}(\.[a-z0-9]{2,24})?$/', $t)) fail(400);
    }

    $data = hostinger('/api/domains/v1/availability',
        ['domain' => $name, 'tlds' => array_values($tlds), 'with_alternatives' => false], $token);
    if ($data === null) fail();

    // Send back only what the page needs
    $out = array_map(fn($d) => [
        'domain'       => $d['domain'] ?? '',
        'is_available' => (bool)($d['is_available'] ?? false),
    ], $data);
    echo json_encode($out);
    exit;
}

// ---- Prices (cached for 1 hour) ----
if ($action === 'prices' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $cache = sys_get_temp_dir() . '/hm_domain_prices.json';
    if (file_exists($cache) && filemtime($cache) > $now - 3600) {
        echo file_get_contents($cache);
        exit;
    }
    $data = hostinger('/api/billing/v1/catalog?category=DOMAIN', null, $token);
    if ($data === null) fail();
    $json = json_encode($data);
    @file_put_contents($cache, $json);
    echo $json;
    exit;
}

fail(400);