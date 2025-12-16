<?php
function read_json_file(string $path): array {
    if (!file_exists($path)) return [];
    $raw = file_get_contents($path);
    if ($raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function atomic_write_json(string $path, array $data): bool {
    $tmp = $path . '.tmp';
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) return false;
    $bytes = file_put_contents($tmp, $json, LOCK_EX);
    if ($bytes === false) return false;
    return rename($tmp, $path);
}

function is_writable_file(string $path): bool {
    $dir = dirname($path);
    if (!is_dir($dir)) return false;
    if (file_exists($path)) return is_writable($path);
    return is_writable($dir);
}

function str_clean(?string $v, int $max = 500): string {
    if (!is_string($v)) return '';
    $v = trim($v);
    $v = strip_tags($v);
    if (strlen($v) > $max) $v = substr($v, 0, $max);
    return $v;
}

function int_clean($v, int $min = 0, int $max = 999): int {
    $i = filter_var($v, FILTER_VALIDATE_INT);
    if ($i === false) $i = 0;
    if ($i < $min) $i = $min;
    if ($i > $max) $i = $max;
    return $i;
}

function bool_clean($v): bool {
    return filter_var($v, FILTER_VALIDATE_BOOLEAN);
}
