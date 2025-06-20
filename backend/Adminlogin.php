<?php
function sendCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json");
}
sendCorsHeaders();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connect to database
$host = "localhost";
$username = "root";
$password = "";
$db = "mystory";

$conn = new mysqli($host, $username, $password, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get POST data safely
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Debug: Log what we received
error_log("Received data: " . print_r($data, true));

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "message" => "Invalid request data",
        "debug" => [
            "received_data" => $data,
            "has_email" => isset($data['email']),
            "has_password" => isset($data['password'])
        ]
    ]);
    exit();
}

$email = trim($data['email']);
$pass = trim($data['password']);

// Debug: Log the credentials we're checking
error_log("Looking for email: " . $email);

// Check if any admins exist at all
$countResult = $conn->query("SELECT COUNT(*) as count FROM admins");
$countRow = $countResult->fetch_assoc();
error_log("Total admins in database: " . $countRow['count']);

// Prepare and execute statement
$stmt = $conn->prepare("SELECT id, email, password FROM admins WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    error_log("Found admin: " . $row['email'] . " with password: " . $row['password']);
    
    // Compare passwords (both plain text and hashed)
    if ($pass === $row['password']) {
        echo json_encode(["success" => true, "message" => "Login successful"]);
    } else if (password_verify($pass, $row['password'])) {
        echo json_encode(["success" => true, "message" => "Login successful"]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid credentials",
            "debug" => [
                "email_found" => true,
                "provided_password" => $pass,
                "stored_password" => $row['password'],
                "passwords_match" => ($pass === $row['password'])
            ]
        ]);
    }
} else {
    http_response_code(401);
    echo json_encode([
        "success" => false, 
        "message" => "Invalid credentials",
        "debug" => [
            "email_found" => false,
            "searched_email" => $email,
            "total_admins" => $countRow['count']
        ]
    ]);
}

$stmt->close();
$conn->close();
?>