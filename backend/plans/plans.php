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
    if (!isset($_SERVER['HTTP_X_USER_NAME'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No username provided']);
        exit;
    }

    $username = $_SERVER['HTTP_X_USER_NAME'];
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['location']) || 
        !isset($data['period']) || 
        !isset($data['period']['startDate']) || 
        !isset($data['period']['endDate']) || 
        !isset($data['travelPreferences']) ||
        !isset($data['dailyPlans'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $id = uniqid() . '-' . bin2hex(random_bytes(8));
    
    $location = $data['location'];
    $startDate = $data['period']['startDate'];
    $endDate = $data['period']['endDate'];
    $travelType = $data['travelPreferences']['travelType'] ?? 'solo';
    $transportationType = $data['travelPreferences']['transportationType'] ?? 'mixed';
    $travelMode = $data['travelPreferences']['travelMode'] ?? 'moderate';
    
    $planData = json_encode($data);
    
    $conn = getDbConnection();
    
    $stmt = $conn->prepare("INSERT INTO ct_plans (id, username, location, start_date, end_date, travel_type, transportation_type, travel_mode, plan_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $id, $username, $location, $startDate, $endDate, $travelType, $transportationType, $travelMode, $planData);
    
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save plan']);
        $conn->close();
        exit;
    }
    
    $conn->close();
    
    echo json_encode([
        'id' => $id,
        'message' => 'Plan successfully saved'
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
    
    if (isset($_GET['id'])) {
        $planId = $_GET['id'];
        
        $stmt = $conn->prepare("SELECT id, location, start_date, end_date, travel_type, transportation_type, travel_mode, plan_data, created_at FROM ct_plans WHERE id = ? AND username = ?");
        $stmt->bind_param("ss", $planId, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Plan not found']);
            $conn->close();
            exit;
        }
        
        $row = $result->fetch_assoc();
        
        $planData = json_decode($row['plan_data'], true);
        
        echo json_encode([
            'id' => $row['id'],
            'plan' => $planData
        ]);
    } else {
        $stmt = $conn->prepare("SELECT id, location, start_date, end_date, travel_type, transportation_type, travel_mode, created_at FROM ct_plans WHERE username = ? ORDER BY created_at DESC");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $plans = [];
        
        while ($row = $result->fetch_assoc()) {
            $plans[] = [
                'id' => $row['id'],
                'location' => $row['location'],
                'startDate' => $row['start_date'],
                'endDate' => $row['end_date'],
                'travelType' => $row['travel_type'],
                'transportationType' => $row['transportation_type'],
                'travelMode' => $row['travel_mode'],
                'createdAt' => $row['created_at']
            ];
        }
        
        echo json_encode($plans);
    }
    
    $conn->close();
}

else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_SERVER['HTTP_X_USER_NAME'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No username provided']);
        exit;
    }

    $username = $_SERVER['HTTP_X_USER_NAME'];
    
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No plan ID provided']);
        exit;
    }
    
    $planId = $_GET['id'];
    $conn = getDbConnection();
    
    $checkStmt = $conn->prepare("SELECT id FROM ct_plans WHERE id = ? AND username = ?");
    $checkStmt->bind_param("ss", $planId, $username);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Plan not found or not authorized']);
        $conn->close();
        exit;
    }
    
    $deleteStmt = $conn->prepare("DELETE FROM ct_plans WHERE id = ? AND username = ?");
    $deleteStmt->bind_param("ss", $planId, $username);
    
    if (!$deleteStmt->execute()) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete plan']);
        $conn->close();
        exit;
    }
    
    $conn->close();
    
    echo json_encode([
        'message' => 'Plan successfully deleted'
    ]);
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>