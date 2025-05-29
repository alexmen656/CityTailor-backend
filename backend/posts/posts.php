<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-User-Name');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function getDbConnection() {
    $conn = new mysqli('127.0.0.1', 'alex01d01', 'XL2fiPeVH3', 'alex01d01');
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['error' => 'Database connection failed']));
    }
    return $conn;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['location']) || !isset($data['caption']) || 
        !isset($data['images']) || !isset($data['timestamp'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $id = uniqid() . '-' . bin2hex(random_bytes(8));
    
    if (!isset($_SERVER['HTTP_X_USER_NAME'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No username provided']);
        exit;
    }
    
    $username = $_SERVER['HTTP_X_USER_NAME'];
    $imageUrls = [];
    $uploadDir = '../uploads/images/';
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    foreach ($data['images'] as $index => $base64Image) {
        if (strpos($base64Image, ',') !== false) {
            list(, $base64Image) = explode(',', $base64Image);
        }
        
        $imageData = base64_decode($base64Image);
        $filename = $id . '_' . $index . '.jpg';
        $filePath = $uploadDir . $filename;
        
        if (file_put_contents($filePath, $imageData)) {
            $imageUrls[] = '/uploads/images/' . $filename;
        }
    }
    
    $conn = getDbConnection();
    
    $stmt = $conn->prepare("INSERT INTO ct_posts (id, username, location, caption, timestamp) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $id, $username, $data['location'], $data['caption'], $data['timestamp']);
    
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save post']);
        $conn->close();
        exit;
    }
    
    foreach ($imageUrls as $url) {
        $imgStmt = $conn->prepare("INSERT INTO ct_post_images (post_id, image_url) VALUES (?, ?)");
        $imgStmt->bind_param("ss", $id, $url);
        $imgStmt->execute();
    }
    
    $conn->close();
    
    echo json_encode([
        'id' => $id,
        'username' => $username,
        'location' => $data['location'],
        'caption' => $data['caption'],
        'imageUrls' => $imageUrls,
        'timestamp' => $data['timestamp']
    ]);
}

else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SERVER['HTTP_X_USER_NAME'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No username provided']);
        exit;
    }
    
    $username = $_SERVER['HTTP_X_USER_NAME'];
    $conn = getDbConnection();
    
    $result = $conn->query("SELECT p.id, p.username, p.location, p.caption, p.timestamp,
                           (SELECT COUNT(*) FROM ct_post_likes WHERE post_id = p.id) as likes_count,
                           EXISTS(SELECT 1 FROM ct_post_likes WHERE post_id = p.id AND username = '$username') as user_has_liked
                           FROM ct_posts p 
                           ORDER BY p.timestamp DESC");
    
    $posts = [];
    
    while ($row = $result->fetch_assoc()) {
        $imgResult = $conn->query("SELECT image_url FROM ct_post_images WHERE post_id = '" . $row['id'] . "'");
        
        $imageUrls = [];
        while ($imgRow = $imgResult->fetch_assoc()) {
            $imageUrls[] = $imgRow['image_url'];
        }
        
        $posts[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'location' => $row['location'],
            'caption' => $row['caption'],
            'imageUrls' => $imageUrls,
            'timestamp' => $row['timestamp'],
            'likes' => (int)$row['likes_count'],
            'hasLiked' => (bool)$row['user_has_liked']
        ];
    }
    
    $conn->close();
    
    echo json_encode($posts);
}
else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>