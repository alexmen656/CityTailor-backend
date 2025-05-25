<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['key']) || !isset($data['image']) || empty($data['key'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid input data'
    ]);
    exit;
}

$activityName = trim($data['key']);
$imageData = $data['image'];

$conn = getDbConnection();

$escapedActivityName = $conn->real_escape_string($activityName);
$escapedImageData = $conn->real_escape_string(json_encode($imageData));

$stmt = $conn->prepare("SELECT id FROM image_cache WHERE activity_name = ?");
$stmt->bind_param("s", $escapedActivityName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    
    $stmt = $conn->prepare("UPDATE image_cache SET image_data = ? WHERE activity_name = ?");
    $stmt->bind_param("ss", $escapedImageData, $escapedActivityName);
} else {
    
    $stmt = $conn->prepare("INSERT INTO image_cache (activity_name, image_data) VALUES (?, ?)");
    $stmt->bind_param("ss", $escapedActivityName, $escapedImageData);
}


if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Image cached successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to cache image: ' . $stmt->error
    ]);
}


$stmt->close();
$conn->close();
?>
