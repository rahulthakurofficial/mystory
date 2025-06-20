<?php 
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $host = "localhost";
    $username = "root";
    $password = "";
    $dbname = "mystory";
    
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    if (empty($search)) {
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Search term is required'
        ]);
        exit();
    }
    
    
    if (strlen($search) < 2) {
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Search term must be at least 2 characters'
        ]);
        exit();
    }
    
    $sql = "SELECT id, companyName FROM companies WHERE companyName LIKE ? ORDER BY companyName ASC LIMIT 10";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $searchTerm = "%" . $search . "%";
    $stmt->bind_param("s", $searchTerm);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $companies = [];
    
    while ($row = $result->fetch_assoc()) {
        $companies[] = [
            "id" => (int)$row["id"],
            "companyName" => htmlspecialchars($row["companyName"], ENT_QUOTES, 'UTF-8')
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $companies,
        'total' => count($companies),
        'search_term' => $search
    ]);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>