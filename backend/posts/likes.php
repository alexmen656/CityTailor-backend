<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-User-Name');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function getDbConnection() {
    $conn = new mysqli('127.0.0.1', 'alex01d01', 'XL2fiPeVH3', 'alex01d01');
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode([
            'success' => false,
            'message' => 'Database connection failed',
            'likes' => 0,
            'hasLiked' => false
        ]));
    }
    return $conn;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['postId'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing postId',
            'likes' => 0,
            'hasLiked' => false
        ]);
        exit;
    }

    if (!isset($_SERVER['HTTP_X_USER_NAME'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'No username provided',
            'likes' => 0,
            'hasLiked' => false
        ]);
        exit;
    }
    
    $postId = $data['postId'];
    $username = $_SERVER['HTTP_X_USER_NAME'];
    $conn = getDbConnection();
    
    $conn->begin_transaction();
    
    try {
        $checkPost = $conn->prepare("SELECT id FROM ct_posts WHERE id = ?");
        $checkPost->bind_param("s", $postId);
        $checkPost->execute();
        $postResult = $checkPost->get_result();
        
        if ($postResult->num_rows === 0) {
            throw new Exception("Post not found");
        }
        
        $checkLike = $conn->prepare("SELECT 1 FROM ct_post_likes WHERE post_id = ? AND username = ?");
        $checkLike->bind_param("ss", $postId, $username);
        $checkLike->execute();
        $likeExists = $checkLike->get_result()->num_rows > 0;
        
        if ($likeExists) {
            $unlikeStmt = $conn->prepare("DELETE FROM ct_post_likes WHERE post_id = ? AND username = ?");
            $unlikeStmt->bind_param("ss", $postId, $username);
            $unlikeStmt->execute();
            $message = "Post unliked successfully";
            $hasLiked = false;
        } else {
            $stmt = $conn->prepare("INSERT INTO ct_post_likes (post_id, username) VALUES (?, ?)");
            $stmt->bind_param("ss", $postId, $username);
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to like post");
            }
            $message = "Post liked successfully";
            $hasLiked = true;
        }
        
        $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM ct_post_likes WHERE post_id = ?");
        $countStmt->bind_param("s", $postId);
        $countStmt->execute();
        $result = $countStmt->get_result();
        $likes = $result->fetch_assoc()['total'];
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => $message,
            'likes' => (int)$likes,
            'hasLiked' => $hasLiked
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage(),
            'likes' => 0,
            'hasLiked' => false
        ]);
    }
    
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed',
        'likes' => 0,
        'hasLiked' => false
    ]);
}
?>
