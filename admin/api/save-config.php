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

$out['hero']['badge'] = str_clean($input['hero']['badge'] ?? ($current['hero']['badge'] ?? ''), 100);
$out['hero']['title'] = str_clean($input['hero']['title'] ?? ($current['hero']['title'] ?? ''), 180);
$out['hero']['excerpt'] = str_clean($input['hero']['excerpt'] ?? ($current['hero']['excerpt'] ?? ''), 600);
$out['hero']['backgroundImage'] = str_clean($input['hero']['backgroundImage'] ?? ($current['hero']['backgroundImage'] ?? ''), 300);
$out['hero']['ctaText'] = str_clean($input['hero']['ctaText'] ?? ($current['hero']['ctaText'] ?? ''), 80);
$out['hero']['ctaLink'] = str_clean($input['hero']['ctaLink'] ?? ($current['hero']['ctaLink'] ?? ''), 300);
$out['hero']['meta']['date'] = str_clean($input['hero']['meta']['date'] ?? ($current['hero']['meta']['date'] ?? ''), 100);
$out['hero']['meta']['author'] = str_clean($input['hero']['meta']['author'] ?? ($current['hero']['meta']['author'] ?? ''), 100);
$out['hero']['meta']['readTime'] = str_clean($input['hero']['meta']['readTime'] ?? ($current['hero']['meta']['readTime'] ?? ''), 80);

$out['aboutSection']['icon'] = str_clean($input['aboutSection']['icon'] ?? ($current['aboutSection']['icon'] ?? ''), 10);
$out['aboutSection']['title'] = str_clean($input['aboutSection']['title'] ?? ($current['aboutSection']['title'] ?? ''), 150);
$out['aboutSection']['description'] = str_clean($input['aboutSection']['description'] ?? ($current['aboutSection']['description'] ?? ''), 1000);

$stats = [];
if (!empty($input['aboutSection']['stats']) && is_array($input['aboutSection']['stats'])) {
    foreach ($input['aboutSection']['stats'] as $idx => $stat) {
        if (!is_array($stat)) continue;
        $value = str_clean($stat['value'] ?? '', 50);
        $label = str_clean($stat['label'] ?? '', 100);
        if ($value !== '' && $label !== '') {
            $stats[] = ['value' => $value, 'label' => $label];
        }
        if (count($stats) >= 10) break;
    }
}
if ($stats) $out['aboutSection']['stats'] = $stats; else if (!isset($out['aboutSection']['stats'])) $out['aboutSection']['stats'] = [];

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
