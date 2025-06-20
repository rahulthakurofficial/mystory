<?php
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only GET requests are allowed']);
    exit;
}


$servername = "localhost";
$username = "";
$password = "root";
$dbname = "mystory";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}


$search = isset($_GET['search']) ? trim($_GET['search']) : '';


if ($search !== '') {
    
    $stmt = $conn->prepare("SELECT * FROM companies WHERE companyName LIKE ?");
    $likeSearch = "%$search%";
    $stmt->bind_param("s", $likeSearch);
} else {
   
    $stmt = $conn->prepare("SELECT * FROM companies");
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to retrieve companies']);
    exit;
}

$result = $stmt->get_result();

$companies = [];
while ($row = $result->fetch_assoc()) {
   
    $row['categories'] = json_decode($row['categories'], true);
    $companies[] = $row;
}

echo json_encode(['success' => true, 'data' => $companies]);

$stmt->close();
$conn->close();
?>
