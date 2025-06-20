<?php 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = new mysqli("localhost", "root", "", "mystory");
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed");
    }
    
    $profileId = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if ($profileId) {
       
        $sql = "SELECT * FROM companies WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $profileId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
           
            $categories = json_decode($row['categories'], true) ?: [];
            
            $profile = [
                'id' => (int)$row['id'],
                'logo_url' => $row['logoUrl'],
                'company_name' => $row['companyName'], 
                'tagline' => $row['tagline'],
                'story' => $row['story'],
                'deals' => $row['deals'],
                'categories' => $categories
            ];
            
            echo json_encode([
                'success' => true,
                'data' => [$profile]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Profile not found'
            ]);
        }
        
        $stmt->close();
    } else {
       
        $sql = "SELECT * FROM companies ORDER BY id DESC LIMIT 10";
        $result = $conn->query($sql);
        
        $profiles = [];
        while ($row = $result->fetch_assoc()) {
            $categories = json_decode($row['categories'], true) ?: [];
            
            $profiles[] = [
                'id' => (int)$row['id'],
                'logo_url' => $row['logoUrl'],
                'company_name' => $row['companyName'],
                'tagline' => $row['tagline'], 
                'story' => $row['story'],
                'deals' => $row['deals'],
                'categories' => $categories
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $profiles
        ]);
    }
    
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>