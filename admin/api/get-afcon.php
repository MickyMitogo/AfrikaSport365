<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');

$afcon_file = __DIR__ . '/../../data/afcon.json';

if (!file_exists($afcon_file)) {
    // Return default structure
    $default = [
        'tournament' => [
            'name' => '',
            'subtitle' => '',
            'logo' => ''
        ],
        'standings' => [],
        'nextMatch' => [
            'teams' => '',
            'date' => '',
            'venue' => '',
            'time' => ''
        ],
        'topScorer' => [
            'name' => '',
            'stats' => '',
            'image' => ''
        ]
    ];
    echo json_encode($default, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

$content = @file_get_contents($afcon_file);
if ($content === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to read file']);
    exit;
}

$data = json_decode($content, true);
if ($data === null) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

