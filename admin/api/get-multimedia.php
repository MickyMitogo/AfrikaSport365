<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');
$file = $cfg['data_dir'] . DIRECTORY_SEPARATOR . 'multimedia.json';
if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}
$data = json_decode(file_get_contents($file), true);
echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
