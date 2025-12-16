<?php require __DIR__ . '/inc/init.php'; require_login(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AfrikaSport365 Admin</title>
  <link rel="stylesheet" href="/admin/assets/admin.css">
  <meta name="csrf-token" content="<?= htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8') ?>">
</head>
<body>
  <header class="topbar">
    <div class="brand">AfrikaSport365 CMS</div>
    <nav class="topnav">
      <span class="user"><?= htmlspecialchars($_SESSION['admin_username'] ?? 'admin') ?></span>
      <a class="btn secondary" href="/admin/logout.php">Logout</a>
    </nav>
  </header>
  <main class="container">
