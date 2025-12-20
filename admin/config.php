<?php
return [
    'admin_username' => 'admin',
    // Default password: ChangeMe123! (change immediately in production)
    'admin_password_hash' => '$2y$10$UC1l1Xgwe2WBuJHOdUbV6.HcD3RNo99Z8fS50fGslOfFXPCNeRJ1O',
    'data_dir' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data',
    // 'config_file' removed: no longer used
    'afcon_file' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'afcon-data.json',
    'session_name' => 'afrikasport_admin',
    'session_lifetime' => 7200,
];
