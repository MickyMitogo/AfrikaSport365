<?php
return [
    'admin_username' => 'admin',
    // Default password: ChangeMe123! (change immediately in production)
    'admin_password_hash' => '$2y$10$QGQ7zY9bQWQ8H2pS9K0sneRjV0qQ0rJjU7E0cZK6lVtX6wX3QKXDa',
    'data_dir' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data',
    'config_file' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'config.json',
    'afcon_file' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'afcon-data.json',
    'session_name' => 'afrikasport_admin',
    'session_lifetime' => 7200,
];
