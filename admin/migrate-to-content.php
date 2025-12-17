<?php
/**
 * ============================================================================
 * MIGRATION TOOL: config.json → content.json
 * ============================================================================
 * 
 * PURPOSE:
 * One-time migration to convert legacy config.json data into the new
 * unified content.json structure. This preserves your existing content
 * while transitioning to the new CMS system.
 * 
 * PROCESS:
 * 1. Reads existing config.json
 * 2. Reads current content.json template
 * 3. Merges config data into content structure
 * 4. Creates backups of both files
 * 5. Writes merged content.json
 * 
 * SAFE TO RUN MULTIPLE TIMES - Always creates backups before overwriting
 * ============================================================================
 */

// Security: Require authentication
require_once __DIR__ . '/inc/init.php';
require_login();

// Set content type
header('Content-Type: text/html; charset=utf-8');

// File paths
$configPath = __DIR__ . '/../data/config.json';
$contentPath = __DIR__ . '/../data/content.json';
$backupDir = __DIR__ . '/../data/backups';

// Ensure backup directory exists
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Handle migration request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'migrate') {
    try {
        // Read config.json
        if (!file_exists($configPath)) {
            throw new Exception('config.json no encontrado');
        }
        $configData = json_decode(file_get_contents($configPath), true);
        if (!$configData) {
            throw new Exception('Error al leer config.json');
        }

        // Read content.json template
        if (!file_exists($contentPath)) {
            throw new Exception('content.json no encontrado');
        }
        $contentData = json_decode(file_get_contents($contentPath), true);
        if (!$contentData) {
            throw new Exception('Error al leer content.json');
        }

        // Create backups with timestamp
        $timestamp = date('Y-m-d_H-i-s');
        $configBackup = $backupDir . '/config_before_migration_' . $timestamp . '.json';
        $contentBackup = $backupDir . '/content_before_migration_' . $timestamp . '.json';
        
        file_put_contents($configBackup, json_encode($configData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        file_put_contents($contentBackup, json_encode($contentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // MERGE PROCESS: Map config.json sections to content.json

        // 1. Site Info
        if (isset($configData['siteInfo'])) {
            $contentData['siteInfo'] = array_merge($contentData['siteInfo'], $configData['siteInfo']);
        }

        // 2. Hero Section
        if (isset($configData['hero'])) {
            $contentData['hero'] = array_merge($contentData['hero'], $configData['hero']);
        }

        // 3. Breaking News
        if (isset($configData['breakingNews']) && is_array($configData['breakingNews'])) {
            $contentData['breakingNews'] = $configData['breakingNews'];
        }

        // 4. About Section
        if (isset($configData['aboutSection'])) {
            $contentData['aboutSection'] = array_merge($contentData['aboutSection'], $configData['aboutSection']);
        }

        // 5. Navigation (if exists in config)
        if (isset($configData['navigation'])) {
            $contentData['navigation'] = array_merge($contentData['navigation'], $configData['navigation']);
        }

        // 6. Footer (if exists in config)
        if (isset($configData['footer'])) {
            $contentData['footer'] = array_merge($contentData['footer'], $configData['footer']);
        }

        // Update version and timestamp
        $contentData['version'] = '1.0';
        $contentData['lastUpdated'] = date('Y-m-d H:i:s');

        // Write merged content.json atomically (temp file + rename)
        $tempPath = $contentPath . '.tmp';
        $result = file_put_contents($tempPath, json_encode($contentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        if ($result === false) {
            throw new Exception('Error al escribir archivo temporal');
        }
        
        if (!rename($tempPath, $contentPath)) {
            throw new Exception('Error al actualizar content.json');
        }

        $success = true;
        $message = "✅ Migración completada exitosamente";
        $details = [
            'Secciones migradas' => 'siteInfo, hero, breakingNews, aboutSection, navigation, footer',
            'Backup config.json' => basename($configBackup),
            'Backup content.json' => basename($contentBackup),
            'Nuevo content.json' => 'Actualizado con datos de config.json'
        ];

    } catch (Exception $e) {
        $success = false;
        $message = "❌ Error durante la migración: " . $e->getMessage();
        $details = [];
    }
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Migración de Datos | AfrikaSport365 Admin</title>
    <link rel="stylesheet" href="css/admin.css">
    <style>
        .migration-container {
            max-width: 900px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .migration-header {
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        .migration-header h1 {
            color: #1e40af;
            font-size: 1.875rem;
            margin: 0 0 0.5rem 0;
        }
        .migration-header p {
            color: #6b7280;
            margin: 0;
        }
        .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }
        .info-box h3 {
            color: #1e40af;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
        }
        .info-box ul {
            margin: 0.5rem 0 0 1.5rem;
            color: #374151;
        }
        .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }
        .warning-box h3 {
            color: #92400e;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
        }
        .success-box {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }
        .success-box h3 {
            color: #065f46;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
        }
        .error-box {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }
        .error-box h3 {
            color: #991b1b;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        .details-table td {
            padding: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .details-table td:first-child {
            font-weight: 600;
            color: #374151;
            width: 40%;
        }
        .details-table td:last-child {
            color: #6b7280;
        }
        .btn-migrate {
            background: #3b82f6;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 6px;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
            width: 100%;
            margin-top: 1.5rem;
        }
        .btn-migrate:hover {
            background: #2563eb;
        }
        .btn-migrate:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
        .btn-back {
            display: inline-block;
            background: #6b7280;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 1rem;
            transition: background 0.3s;
        }
        .btn-back:hover {
            background: #4b5563;
        }
        .file-status {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin: 1.5rem 0;
        }
        .file-card {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 6px;
            border: 2px solid #e5e7eb;
        }
        .file-card.exists {
            border-color: #10b981;
        }
        .file-card.missing {
            border-color: #ef4444;
        }
        .file-card h4 {
            margin: 0 0 0.5rem 0;
            color: #374151;
        }
        .file-card .status {
            font-weight: 600;
        }
        .file-card.exists .status {
            color: #10b981;
        }
        .file-card.missing .status {
            color: #ef4444;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/inc/header.php'; ?>

    <div class="migration-container">
        <div class="migration-header">
            <h1>🔄 Herramienta de Migración de Datos</h1>
            <p>Convierte tu config.json existente al nuevo formato content.json unificado</p>
        </div>

        <?php if (isset($success)): ?>
            <?php if ($success): ?>
                <div class="success-box">
                    <h3><?php echo $message; ?></h3>
                    <table class="details-table">
                        <?php foreach ($details as $key => $value): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($key); ?></td>
                                <td><?php echo htmlspecialchars($value); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </table>
                    <p style="margin-top: 1rem; color: #065f46;">
                        <strong>Siguiente paso:</strong> Abre el dashboard-v2.php y verifica que todos los datos se cargaron correctamente.
                    </p>
                </div>
                <a href="dashboard-v2.php" class="btn-back">Ir al Dashboard V2</a>
            <?php else: ?>
                <div class="error-box">
                    <h3><?php echo $message; ?></h3>
                    <p style="margin-top: 0.5rem; color: #991b1b;">
                        Por favor, verifica que ambos archivos (config.json y content.json) existan y tengan permisos de lectura/escritura.
                    </p>
                </div>
            <?php endif; ?>
        <?php else: ?>
            <div class="info-box">
                <h3>📋 ¿Qué hace esta herramienta?</h3>
                <ul>
                    <li>Lee tu archivo <strong>config.json</strong> actual</li>
                    <li>Lee la estructura del nuevo <strong>content.json</strong></li>
                    <li>Fusiona los datos preservando todo el contenido existente</li>
                    <li>Crea backups automáticos antes de cualquier cambio</li>
                    <li>Actualiza <strong>content.json</strong> con los datos migrados</li>
                </ul>
            </div>

            <div class="warning-box">
                <h3>⚠️ Importante</h3>
                <ul>
                    <li>Esta herramienta NO elimina ni modifica <strong>config.json</strong></li>
                    <li>Se crean backups automáticos en <code>data/backups/</code></li>
                    <li>Es seguro ejecutarla múltiples veces</li>
                    <li>Los datos nuevos en content.json se preservarán (Latest News, Categories, Athletes, etc.)</li>
                </ul>
            </div>

            <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #374151;">Estado de los Archivos</h3>
            <div class="file-status">
                <div class="file-card <?php echo file_exists($configPath) ? 'exists' : 'missing'; ?>">
                    <h4>config.json</h4>
                    <p class="status">
                        <?php if (file_exists($configPath)): ?>
                            ✅ Encontrado
                        <?php else: ?>
                            ❌ No encontrado
                        <?php endif; ?>
                    </p>
                    <?php if (file_exists($configPath)): ?>
                        <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
                            Tamaño: <?php echo round(filesize($configPath) / 1024, 2); ?> KB<br>
                            Modificado: <?php echo date('Y-m-d H:i:s', filemtime($configPath)); ?>
                        </p>
                    <?php endif; ?>
                </div>

                <div class="file-card <?php echo file_exists($contentPath) ? 'exists' : 'missing'; ?>">
                    <h4>content.json</h4>
                    <p class="status">
                        <?php if (file_exists($contentPath)): ?>
                            ✅ Encontrado
                        <?php else: ?>
                            ❌ No encontrado
                        <?php endif; ?>
                    </p>
                    <?php if (file_exists($contentPath)): ?>
                        <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
                            Tamaño: <?php echo round(filesize($contentPath) / 1024, 2); ?> KB<br>
                            Modificado: <?php echo date('Y-m-d H:i:s', filemtime($contentPath)); ?>
                        </p>
                    <?php endif; ?>
                </div>
            </div>

            <form method="POST" onsubmit="return confirm('¿Estás seguro de que deseas iniciar la migración? Se crearán backups automáticos.');">
                <input type="hidden" name="action" value="migrate">
                <button type="submit" class="btn-migrate" <?php echo (!file_exists($configPath) || !file_exists($contentPath)) ? 'disabled' : ''; ?>>
                    🚀 Iniciar Migración
                </button>
            </form>

            <?php if (!file_exists($configPath) || !file_exists($contentPath)): ?>
                <p style="text-align: center; color: #ef4444; margin-top: 1rem; font-weight: 600;">
                    ⚠️ Faltan archivos requeridos. Por favor, verifica que config.json y content.json existan.
                </p>
            <?php endif; ?>

            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="dashboard.php" class="btn-back">Volver al Dashboard</a>
            </div>
        <?php endif; ?>
    </div>

    <?php include __DIR__ . '/inc/footer.php'; ?>
</body>
</html>
