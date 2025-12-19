<?php
require_once __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');

if (!verify_csrf($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid CSRF token']);
  exit;
}

$articlesFile = __DIR__ . '/../../data/articles.json';

if (!file_exists($articlesFile)) {
  http_response_code(404);
  echo json_encode(['error' => 'Articles file not found']);
  exit;
}

$data = json_decode(file_get_contents($articlesFile), true);

if (json_last_error() !== JSON_ERROR_NONE) {
  http_response_code(500);
  echo json_encode(['error' => 'Invalid JSON in articles file']);
  exit;
}

echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
