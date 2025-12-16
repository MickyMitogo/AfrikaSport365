<?php
require __DIR__ . '/inc/init.php';
if (is_logged_in()) { header('Location: /admin/dashboard.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = $_POST['username'] ?? '';
    $p = $_POST['password'] ?? '';
    if (login_attempt($u, $p, $cfg)) {
        header('Location: /admin/dashboard.php');
        exit;
    }
    $error = 'Invalid credentials';
}
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login • AfrikaSport365 Admin</title>
  <link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body class="login-body">
  <div class="login-card">
    <h1>Admin Login</h1>
    <?php if ($error): ?><div class="alert error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <form method="post" autocomplete="off">
      <label>Username<input name="username" required></label>
      <label>Password<input name="password" type="password" required></label>
      <button class="btn primary" type="submit">Sign In</button>
    </form>
    <p class="hint">Default user: admin • Change password in admin/config.php</p>
  </div>
</body>
</html>
