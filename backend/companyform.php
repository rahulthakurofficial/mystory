<?php
// Show all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only POST requests allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Connect to DB
    $conn = new mysqli("localhost", "root", "", "mystory");
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Read input JSON
    $input = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    // Extract fields
    $logoUrl = trim($input['logoUrl'] ?? '');
    $companyName = trim($input['companyName'] ?? '');
    $tagline = trim($input['tagline'] ?? '');
    $story = trim($input['story'] ?? '');
    $deals = trim($input['deals'] ?? '');
    $categories = json_encode($input['categories'] ?? []);

    // Validation
    if (!$logoUrl || !$companyName || !$tagline || !$story) {
        throw new Exception("Missing required fields: logoUrl, companyName, tagline, and story are required");
    }

    // Insert into DB (excluding id field - it will auto-increment)
    $stmt = $conn->prepare("INSERT INTO companies (logoUrl, companyName, tagline, story, deals, categories) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssssss", $logoUrl, $companyName, $tagline, $story, $deals, $categories);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $insertedId = $conn->insert_id;
    $stmt->close();
    $conn->close();

    echo json_encode([
        'success' => true, 
        'message' => 'Company profile submitted successfully',
        'id' => $insertedId
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>