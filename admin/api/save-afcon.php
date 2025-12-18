<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (!verify_csrf($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
    exit;
}

$config_file = __DIR__ . '/../../data/config.json';

if (!is_writable($config_file)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'File not writable']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Read current config
$current = json_decode(file_get_contents($config_file), true);
if (!is_array($current)) {
    $current = [];
}

// Build afconSpotlight structure
$afconSpotlight = [];

// Basic info
$afconSpotlight['title'] = str_clean($input['afconSpotlight']['title'] ?? '', 200);
$afconSpotlight['subtitle'] = str_clean($input['afconSpotlight']['subtitle'] ?? '', 200);
$afconSpotlight['logo'] = str_clean($input['afconSpotlight']['logo'] ?? '', 300);

// Group standings
$afconSpotlight['group'] = [
    'title' => str_clean($input['afconSpotlight']['group']['title'] ?? '', 150),
    'teams' => []
];

if (!empty($input['afconSpotlight']['group']['teams']) && is_array($input['afconSpotlight']['group']['teams'])) {
    foreach ($input['afconSpotlight']['group']['teams'] as $team) {
        if (!is_array($team)) continue;
        
        $name = str_clean($team['name'] ?? '', 100);
        $points = str_clean($team['points'] ?? '', 20);
        
        if ($name !== '') {
            $afconSpotlight['group']['teams'][] = [
                'name' => $name,
                'points' => $points
            ];
        }
        
        if (count($afconSpotlight['group']['teams']) >= 4) break; // Max 4 teams
    }
}

// Next match
$afconSpotlight['nextMatch'] = [
    'home' => str_clean($input['afconSpotlight']['nextMatch']['home'] ?? '', 100),
    'away' => str_clean($input['afconSpotlight']['nextMatch']['away'] ?? '', 100),
    'date' => str_clean($input['afconSpotlight']['nextMatch']['date'] ?? '', 50),
    'venue' => str_clean($input['afconSpotlight']['nextMatch']['venue'] ?? '', 150),
    'time' => str_clean($input['afconSpotlight']['nextMatch']['time'] ?? '', 50)
];

// Top scorer
$afconSpotlight['topScorer'] = [
    'name' => str_clean($input['afconSpotlight']['topScorer']['name'] ?? '', 120),
    'goals' => str_clean($input['afconSpotlight']['topScorer']['goals'] ?? '', 150)
];

// CTA
$afconSpotlight['ctaText'] = str_clean($input['afconSpotlight']['ctaText'] ?? '', 100);
$afconSpotlight['ctaLink'] = str_clean($input['afconSpotlight']['ctaLink'] ?? '', 300);

// Update config with new afconSpotlight
$current['afconSpotlight'] = $afconSpotlight;

// Atomic write
$temp_file = $config_file . '.tmp.' . uniqid();
$json = json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($json === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'JSON encode failed']);
    exit;
}

if (file_put_contents($temp_file, $json, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Write failed']);
    exit;
}

if (!rename($temp_file, $config_file)) {
    @unlink($temp_file);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Rename failed']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'AFCON spotlight saved successfully']);

