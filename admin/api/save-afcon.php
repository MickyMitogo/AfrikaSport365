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

$afcon_file = __DIR__ . '/../../data/afcon.json';

if (!is_writable($afcon_file)) {
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

// Build output structure
$output = [];

// Tournament info
$output['tournament'] = [
    'name' => str_clean($input['tournament']['name'] ?? '', 200),
    'subtitle' => str_clean($input['tournament']['subtitle'] ?? '', 200),
    'logo' => str_clean($input['tournament']['logo'] ?? '', 300)
];

// Standings (repeatable)
$output['standings'] = [];
if (!empty($input['standings']) && is_array($input['standings'])) {
    foreach ($input['standings'] as $team) {
        if (!is_array($team)) continue;
        
        $name = str_clean($team['name'] ?? '', 100);
        if ($name === '') continue;
        
        $output['standings'][] = [
            'name' => $name,
            'points' => int_clean($team['points'] ?? 0, 0, 999)
        ];
        
        if (count($output['standings']) >= 20) break; // Max 20 teams
    }
}

// Next match
$output['nextMatch'] = [
    'teams' => str_clean($input['nextMatch']['teams'] ?? '', 200),
    'date' => str_clean($input['nextMatch']['date'] ?? '', 50),
    'venue' => str_clean($input['nextMatch']['venue'] ?? '', 150),
    'time' => str_clean($input['nextMatch']['time'] ?? '', 50)
];

// Top scorer
$output['topScorer'] = [
    'name' => str_clean($input['topScorer']['name'] ?? '', 120),
    'stats' => str_clean($input['topScorer']['stats'] ?? '', 150),
    'image' => str_clean($input['topScorer']['image'] ?? '', 300)
];

// Atomic write
$temp_file = $afcon_file . '.tmp.' . uniqid();
$json = json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

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

if (!rename($temp_file, $afcon_file)) {
    @unlink($temp_file);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Rename failed']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'AFCON data saved successfully']);

