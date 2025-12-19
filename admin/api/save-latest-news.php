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

$latest_news_file = __DIR__ . '/../../data/latest-news.json';

if (!is_writable_file($latest_news_file)) {
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

// Validate hex color format
function validate_hex_color($color) {
    return preg_match('/^#[0-9A-Fa-f]{6}$/', $color);
}

// Build output structure
$output = ['latestNews' => []];

// Process latest news items
if (!empty($input['latestNews']) && is_array($input['latestNews'])) {
    foreach ($input['latestNews'] as $item) {
        if (!is_array($item)) continue;
        
        $title = str_clean($item['title'] ?? '', 200);
        if ($title === '') continue; // Skip if no title
        
        $categoryColor = str_clean($item['categoryColor'] ?? '', 7);
        if (!validate_hex_color($categoryColor)) {
            $categoryColor = '#2563eb'; // Default blue if invalid
        }
        
        $newsItem = [
            'id' => int_clean($item['id'] ?? 0, 1, 9999),
            'title' => $title,
            'excerpt' => str_clean($item['excerpt'] ?? '', 400),
            'image' => str_clean($item['image'] ?? '', 300),
            'imageAlt' => str_clean($item['imageAlt'] ?? '', 150),
            'category' => str_clean($item['category'] ?? '', 50),
            'categoryColor' => $categoryColor,
            'slug' => str_clean($item['slug'] ?? '', 200),
            'meta' => [
                'time' => str_clean($item['meta']['time'] ?? '', 50),
                'author' => str_clean($item['meta']['author'] ?? '', 100),
                'comments' => int_clean($item['meta']['comments'] ?? 0, 0, 9999)
            ],
            'featured' => bool_clean($item['featured'] ?? false),
            'order' => int_clean($item['order'] ?? 1, 1, 20)
        ];
        
        $output['latestNews'][] = $newsItem;
        
        if (count($output['latestNews']) >= 10) break; // Max 10 news items
    }
}

// Atomic write
$temp_file = $latest_news_file . '.tmp.' . uniqid();
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

if (!rename($temp_file, $latest_news_file)) {
    @unlink($temp_file);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Rename failed']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Latest news saved successfully']);
