<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method not allowed']); exit; }
if (!verify_csrf($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid CSRF']); exit; }

if (!is_writable_file($cfg['config_file'])) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'File not writable']); exit; }

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid JSON']); exit; }

$current = read_json_file($cfg['config_file']);

$out = $current;
$out['siteInfo']['name'] = str_clean($input['siteInfo']['name'] ?? ($current['siteInfo']['name'] ?? ''), 120);
$out['siteInfo']['tagline'] = str_clean($input['siteInfo']['tagline'] ?? ($current['siteInfo']['tagline'] ?? ''), 200);
$out['siteInfo']['logo'] = str_clean($input['siteInfo']['logo'] ?? ($current['siteInfo']['logo'] ?? ''), 300);

$out['hero']['title'] = str_clean($input['hero']['title'] ?? ($current['hero']['title'] ?? ''), 180);
$out['hero']['excerpt'] = str_clean($input['hero']['excerpt'] ?? ($current['hero']['excerpt'] ?? ''), 600);
$out['hero']['backgroundImage'] = str_clean($input['hero']['backgroundImage'] ?? ($current['hero']['backgroundImage'] ?? ''), 300);
$out['hero']['cta']['label'] = str_clean($input['hero']['cta']['label'] ?? ($current['hero']['cta']['label'] ?? ''), 60);
$out['hero']['cta']['url'] = str_clean($input['hero']['cta']['url'] ?? ($current['hero']['cta']['url'] ?? ''), 300);

$breaking = [];
if (!empty($input['breakingNews']) && is_array($input['breakingNews'])) {
    foreach ($input['breakingNews'] as $item) {
        $t = str_clean($item ?? '', 160);
        if ($t !== '') $breaking[] = $t;
        if (count($breaking) >= 20) break;
    }
}
if ($breaking) $out['breakingNews'] = $breaking; else if (!isset($out['breakingNews'])) $out['breakingNews'] = [];

$ok = atomic_write_json($cfg['config_file'], $out);
if (!$ok) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Write failed']); exit; }
echo json_encode(['success'=>true]);
