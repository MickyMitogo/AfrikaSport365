<?php
require __DIR__ . '/../inc/init.php';
require_login();
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method not allowed']); exit; }
if (!verify_csrf($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid CSRF']); exit; }

if (!is_writable_file($cfg['afcon_file'])) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'File not writable']); exit; }

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid JSON']); exit; }

$current = read_json_file($cfg['afcon_file']);
$out = $current;

$out['tournament']['name'] = str_clean($input['tournament']['name'] ?? ($current['tournament']['name'] ?? ''), 180);
$out['tournament']['fullName'] = str_clean($input['tournament']['fullName'] ?? ($current['tournament']['fullName'] ?? ''), 220);
$out['tournament']['host'] = str_clean($input['tournament']['host'] ?? ($current['tournament']['host'] ?? ''), 120);
$out['tournament']['dates'] = str_clean($input['tournament']['dates'] ?? ($current['tournament']['dates'] ?? ''), 180);
$out['tournament']['logo'] = str_clean($input['tournament']['logo'] ?? ($current['tournament']['logo'] ?? ''), 300);

$matches = [];
if (!empty($input['liveMatches']) && is_array($input['liveMatches'])) {
    foreach ($input['liveMatches'] as $m) {
        if (!is_array($m)) continue;
        $teamA = str_clean($m['teamA'] ?? '', 80);
        $teamB = str_clean($m['teamB'] ?? '', 80);
        if ($teamA === '' || $teamB === '') continue;
        $scoreA = int_clean($m['scoreA'] ?? 0, 0, 99);
        $scoreB = int_clean($m['scoreB'] ?? 0, 0, 99);
        $status = in_array($m['status'] ?? '', ['upcoming','live','finished'], true) ? $m['status'] : 'upcoming';
        $matches[] = [ 'teamA'=>$teamA, 'teamB'=>$teamB, 'scoreA'=>$scoreA, 'scoreB'=>$scoreB, 'status'=>$status ];
        if (count($matches) >= 100) break;
    }
}
if ($matches) $out['liveMatches'] = $matches; else if (!isset($out['liveMatches'])) $out['liveMatches'] = [];

$scorers = [];
if (!empty($input['topScorers']) && is_array($input['topScorers'])) {
    foreach ($input['topScorers'] as $p) {
        if (!is_array($p)) continue;
        $name = str_clean($p['name'] ?? '', 120);
        if ($name === '') continue;
        $goals = int_clean($p['goals'] ?? 0, 0, 99);
        $scorers[] = ['name'=>$name, 'goals'=>$goals];
        if (count($scorers) >= 100) break;
    }
}
if ($scorers) $out['topScorers'] = $scorers; else if (!isset($out['topScorers'])) $out['topScorers'] = [];

$ok = atomic_write_json($cfg['afcon_file'], $out);
if (!$ok) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Write failed']); exit; }
echo json_encode(['success'=>true]);
