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
$file = $cfg['data_dir'] . DIRECTORY_SEPARATOR . 'analisis-opinion.json';
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Invalid JSON']);
    exit;
}
// Validar: debe ser un array de objetos con titulo, resumen y autor
$items = array_filter($input, function($item) {
    return is_array($item)
        && isset($item['titulo'], $item['resumen'], $item['autor'])
        && $item['titulo'] !== ''
        && $item['resumen'] !== ''
        && $item['autor'] !== '';
});
if (!is_array($items)) $items = [];
if (!is_writable($file) && file_exists($file)) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'File not writable']);
    exit;
}
file_put_contents($file, json_encode(array_values($items), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
echo json_encode(['success'=>true]);
