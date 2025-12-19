<?php
require_once __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

if (!verify_csrf($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid CSRF token']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['articles']) || !is_array($input['articles'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid payload. Expected {articles: [...]}']);
  exit;
}

// Validate that all articles have required fields
foreach ($input['articles'] as $index => $article) {
  if (!isset($article['id']) || !isset($article['slug']) || !isset($article['title'])) {
    http_response_code(400);
    echo json_encode([
      'error' => "Article at index $index is missing required fields (id, slug, title)"
    ]);
    exit;
  }
}

// Check for duplicate IDs or slugs
$ids = array_column($input['articles'], 'id');
$slugs = array_column($input['articles'], 'slug');

if (count($ids) !== count(array_unique($ids))) {
  http_response_code(400);
  echo json_encode(['error' => 'Duplicate article IDs found']);
  exit;
}

if (count($slugs) !== count(array_unique($slugs))) {
  http_response_code(400);
  echo json_encode(['error' => 'Duplicate article slugs found']);
  exit;
}

$articlesFile = __DIR__ . '/../../data/articles.json';
$encoded = json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if (file_put_contents($articlesFile, $encoded) === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to write articles file']);
  exit;
}

echo json_encode(['success' => true, 'message' => 'Articles saved successfully']);
