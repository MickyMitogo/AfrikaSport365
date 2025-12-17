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
$out['tournament']['displayDates'] = str_clean($input['tournament']['displayDates'] ?? ($current['tournament']['displayDates'] ?? ''), 180);
$out['tournament']['logo'] = str_clean($input['tournament']['logo'] ?? ($current['tournament']['logo'] ?? ''), 300);

$matches = [];
if (!empty($input['liveMatches']) && is_array($input['liveMatches'])) {
    foreach ($input['liveMatches'] as $m) {
        if (!is_array($m)) continue;
        $homeTeamName = str_clean($m['homeTeam']['name'] ?? '', 80);
        $awayTeamName = str_clean($m['awayTeam']['name'] ?? '', 80);
        if ($homeTeamName === '' || $awayTeamName === '') continue;
        
        $match = [
            'id' => str_clean($m['id'] ?? '', 50),
            'status' => in_array($m['status'] ?? '', ['upcoming','live','finished'], true) ? $m['status'] : 'upcoming',
            'minute' => str_clean($m['minute'] ?? '', 20),
            'homeTeam' => [
                'name' => $homeTeamName,
                'flag' => str_clean($m['homeTeam']['flag'] ?? '', 300),
                'score' => isset($m['homeTeam']['score']) && $m['homeTeam']['score'] !== '' ? int_clean($m['homeTeam']['score'], 0, 99) : null
            ],
            'awayTeam' => [
                'name' => $awayTeamName,
                'flag' => str_clean($m['awayTeam']['flag'] ?? '', 300),
                'score' => isset($m['awayTeam']['score']) && $m['awayTeam']['score'] !== '' ? int_clean($m['awayTeam']['score'], 0, 99) : null
            ],
            'venue' => str_clean($m['venue'] ?? '', 150)
        ];
        
        // Preserve existing fields like commentary if present
        if (!empty($m['commentary']) && is_array($m['commentary'])) {
            $match['commentary'] = $m['commentary'];
        }
        
        $matches[] = $match;
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
        $scorers[] = [
            'rank' => int_clean($p['rank'] ?? 0, 0, 999),
            'name' => $name,
            'country' => str_clean($p['country'] ?? '', 80),
            'flag' => str_clean($p['flag'] ?? '', 300),
            'team' => str_clean($p['team'] ?? '', 120),
            'goals' => int_clean($p['goals'] ?? 0, 0, 99),
            'matches' => int_clean($p['matches'] ?? 0, 0, 99)
        ];
        if (count($scorers) >= 100) break;
    }
}
if ($scorers) $out['topScorers'] = $scorers; else if (!isset($out['topScorers'])) $out['topScorers'] = [];

$ok = atomic_write_json($cfg['afcon_file'], $out);
if (!$ok) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Write failed']); exit; }
echo json_encode(['success'=>true]);
