<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); 
define('DB_PASS', ''); 
define('DB_NAME', 'citytailor_images');

function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    
    $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
    if ($conn->query($sql) === FALSE) {
        die("Error creating database: " . $conn->error);
    }
    
    $conn->select_db(DB_NAME);
    
    $sql = "CREATE TABLE IF NOT EXISTS image_cache (
        id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        activity_name VARCHAR(255) NOT NULL,
        image_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_activity (activity_name)
    )";
    
    if ($conn->query($sql) === FALSE) {
        die("Error creating table: " . $conn->error);
    }
    
    return $conn;
}
?>
