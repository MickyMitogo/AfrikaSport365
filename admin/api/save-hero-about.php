<?php
header('Content-Type: application/json');
$dataFile = '../../data/hero-about.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if ($input) {
        file_put_contents($dataFile, $input);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "No data received"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
