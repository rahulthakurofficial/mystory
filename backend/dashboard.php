<?php
// dashboard.php - Dashboard API endpoints
include_once 'config.php';

$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'stats':
        // Get dashboard statistics
        $stats = [];
        
        // Total stories submitted
        $query = "SELECT COUNT(*) as total FROM company_profiles";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $stats['totalStories'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Approved stories
        $query = "SELECT COUNT(*) as total FROM company_profiles WHERE status = 'approved'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $stats['approvedStories'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total users
        $query = "SELECT COUNT(*) as total FROM users WHERE role = 'user'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $stats['totalUsers'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total categories
        $query = "SELECT COUNT(*) as total FROM categories WHERE status = 'active'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $stats['totalCategories'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Active deals
        $query = "SELECT COUNT(*) as total FROM deals WHERE status = 'active' AND expiry_date >= CURDATE()";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $stats['activeDeals'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        echo json_encode($stats);
        break;
        
    case 'submissions':
        // Get monthly submissions data
        $query = "SELECT 
                    MONTHNAME(created_at) as name, 
                    COUNT(*) as submissions 
                  FROM company_profiles 
                  WHERE YEAR(created_at) = YEAR(CURDATE())
                  GROUP BY MONTH(created_at), MONTHNAME(created_at)
                  ORDER BY MONTH(created_at)";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'stories':
        // Get submitted stories
        $query = "SELECT id, company_name as title, 'Author' as author, status 
                  FROM company_profiles 
                  ORDER BY created_at DESC 
                  LIMIT 10";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'deals':
        // Get deals
        $query = "SELECT id, title as deal, expiry_date as expiry FROM deals ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'users':
        // Get users
        $query = "SELECT id, name, email, phone FROM users WHERE role = 'user' ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'categories':
        // Get categories
        $query = "SELECT id, name FROM categories WHERE status = 'active' ORDER BY name";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'approve':
        // Approve a story
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? 0;
            
            $query = "UPDATE company_profiles SET status = 'approved' WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Story approved successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to approve story']);
            }
        }
        break;
        
    case 'reject':
        // Reject a story
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? 0;
            
            $query = "UPDATE company_profiles SET status = 'rejected' WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Story rejected successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to reject story']);
            }
        }
        break;
}
?>