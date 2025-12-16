<?php
$cfg = require dirname(__DIR__) . '/config.php';

ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_httponly', '1');
session_name($cfg['session_name']);
session_set_cookie_params([
    'lifetime' => $cfg['session_lifetime'],
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
]);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id(true);
    $_SESSION['initiated'] = true;
}

require __DIR__ . '/utils.php';
require __DIR__ . '/auth.php';

header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer-when-downgrade');
