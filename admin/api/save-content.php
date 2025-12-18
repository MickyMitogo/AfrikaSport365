<?php
/**
 * Save Content API
 * Handles saving content.json from the enhanced dashboard
 */

// Set JSON response header FIRST (before any authentication checks)
header('Content-Type: application/json');

require_once __DIR__ . '/../inc/init.php';

// Check authentication for API (return JSON, not redirect)
if (!is_logged_in()) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Authentication required'
    ]);
    exit;
}

// Verify CSRF token (return JSON error, not boolean)
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? $_POST['csrf_token'] ?? null;
if (!verify_csrf($csrfToken)) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid CSRF token'
    ]);
    exit;
}

try {
    // Get JSON payload
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    if (!isset($data['version'])) {
        $data['version'] = '1.0.0';
    }

    // Update timestamp
    $data['lastUpdated'] = date('c');

    // Path to content.json
    $contentFile = __DIR__ . '/../../data/content.json';

    // Backup existing file
    if (file_exists($contentFile)) {
        $backupFile = __DIR__ . '/../../data/backups/content_' . date('Y-m-d_H-i-s') . '.json';
        $backupDir = dirname($backupFile);
        
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }
        
        copy($contentFile, $backupFile);
    }

    // Encode JSON with pretty print
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if ($json === false) {
        throw new Exception('JSON encoding failed: ' . json_last_error_msg());
    }

    // Atomic write using temporary file
    $tempFile = $contentFile . '.tmp';
    $bytesWritten = file_put_contents($tempFile, $json, LOCK_EX);

    if ($bytesWritten === false) {
        throw new Exception('Failed to write temporary file');
    }

    // Rename temp file to actual file (atomic operation)
    if (!rename($tempFile, $contentFile)) {
        unlink($tempFile);
        throw new Exception('Failed to save content file');
    }

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Content saved successfully',
        'timestamp' => $data['lastUpdated'],
        'bytesWritten' => $bytesWritten
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
