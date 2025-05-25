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

if (!isset($data['key']) || empty($data['key'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Key is required'
    ]);
    exit;
}

$activityName = trim($data['key']);

$conn = getDbConnection();

$stmt = $conn->prepare("SELECT image_data FROM image_cache WHERE activity_name = ?");
$stmt->bind_param("s", $activityName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    
    $row = $result->fetch_assoc();
    $imageData = json_decode($row['image_data'], true);
    
    echo json_encode([
        'success' => true,
        'image' => $imageData
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Image not found in cache'
    ]);
}

$stmt->close();
$conn->close();
?>
