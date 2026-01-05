<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');
$targetDir = __DIR__ . '/../../media/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit;
}
$allowedTypes = [
    'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/avif' => 'avif',
    'video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/ogg' => 'ogg'
];
$type = mime_content_type($_FILES['file']['tmp_name']);
if (!isset($allowedTypes[$type])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type']);
    exit;
}
$ext = $allowedTypes[$type];
$baseName = uniqid('media_', true) . '.' . $ext;
$targetFile = $targetDir . $baseName;
if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit;
}
$url = '/media/' . $baseName;
echo json_encode(['success' => true, 'url' => $url]);