<?php
header("Content-Type: application/json");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed']);
    exit;
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Validate required fields
$requiredFields = ['logoUrl', 'companyName', 'tagline', 'story', 'categories'];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing or empty field: $field"]);
        exit;
    }
}

// Database connection settings — replace these with your own
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mystory";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Prepare and bind to avoid SQL injection
$stmt = $conn->prepare("INSERT INTO companies (logoUrl, companyName, tagline, story, deals, categories) VALUES (?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    exit;
}

$logoUrl = $data['logoUrl'];
$companyName = $data['companyName'];
$tagline = $data['tagline'];
$story = $data['story'];
$deals = isset($data['deals']) ? $data['deals'] : '';
// Store categories as JSON string
$categories = json_encode($data['categories']);

$stmt->bind_param("ssssss", $logoUrl, $companyName, $tagline, $story, $deals, $categories);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Company profile added successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to add company profile']);
}

$stmt->close();
$conn->close();
?>
