<?php
require __DIR__ . '/inc/init.php';
if (is_logged_in()) { header('Location: /admin/dashboard.php'); }
else { header('Location: /admin/login.php'); }
exit;
