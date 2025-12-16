<?php
require __DIR__ . '/inc/init.php';
logout();
header('Location: /admin/login.php');
exit;
