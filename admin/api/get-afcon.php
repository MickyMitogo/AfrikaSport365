<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');

$config_file = __DIR__ . '/../../data/config.json';

if (!file_exists($config_file)) {
    // Return default structure
    $default = [
        'afconSpotlight' => [
            'title' => '',
            'subtitle' => '',
            'logo' => '',
            'group' => [
                'title' => '',
                'teams' => []
            ],
            'nextMatch' => [
                'home' => '',
                'away' => '',
                'date' => '',
                'venue' => '',
                'time' => ''
            ],
            'topScorer' => [
                'name' => '',
                'goals' => ''
            ],
            'ctaText' => '',
            'ctaLink' => ''
        ]
    ];
    echo json_encode($default, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

$content = @file_get_contents($config_file);
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

// Return only afconSpotlight section
if (isset($data['afconSpotlight'])) {
    echo json_encode(['afconSpotlight' => $data['afconSpotlight']], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} else {
    // Return default if not exists
    echo json_encode([
        'afconSpotlight' => [
            'title' => '',
            'subtitle' => '',
            'logo' => '',
            'group' => ['title' => '', 'teams' => []],
            'nextMatch' => ['home' => '', 'away' => '', 'date' => '', 'venue' => '', 'time' => ''],
            'topScorer' => ['name' => '', 'goals' => ''],
            'ctaText' => '',
            'ctaLink' => ''
        ]
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

