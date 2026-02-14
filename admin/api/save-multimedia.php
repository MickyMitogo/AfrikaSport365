<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Method not allowed']);
    exit;
}
if (!verify_csrf($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Invalid CSRF']);
    exit;
}
$file = $cfg['data_dir'] . DIRECTORY_SEPARATOR . 'multimedia.json';
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Invalid JSON']);
    exit;
}
file_put_contents($file, json_encode($input, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
echo json_encode(['success'=>true]);
