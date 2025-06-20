<?php
// Set CORS headers FIRST - before any other output
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests for the actual signup
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Include config file and handle errors
if (!file_exists('config.php')) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Configuration file missing"]);
    exit();
}

include 'config.php';

// Check database connection
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

// Check if data was properly decoded
if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit();
}

$name = $data->full_name ?? '';
$email = $data->email ?? '';
$password = $data->password ?? '';

// Validate required fields
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Use prepared statements with error checking
$stmt = $conn->prepare("INSERT INTO userslogin (full_name, email, password) VALUES (?, ?, ?)");



if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Signup successful"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Signup failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>