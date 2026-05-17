<?php
session_start();

// --- CONFIGURATION ---
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}
$PASSWORD = defined('ADMIN_PASSWORD') ? ADMIN_PASSWORD : "Heights2026";
$DATA_FILE = "../data/posts.json";

// --- HELPER FUNCTIONS ---
function respond($data, $status = 200) {
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// --- AUTH CHECK ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_password'])) {
    if ($_POST['login_password'] === $PASSWORD) {
        $_SESSION['authenticated'] = true;
        respond(["message" => "Login successful"]);
    } else {
        respond(["message" => "Invalid password"], 401);
    }
}

// All other actions require authentication
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    respond(["message" => "Unauthorized"], 401);
}

// --- ACTIONS ---
$action = $_GET['action'] ?? '';

// 1. GET ALL POSTS
if ($action === 'list') {
    $content = file_get_contents($DATA_FILE);
    echo $content;
    exit;
}

// 2. SAVE POST (NEW OR EDIT)
if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_data = json_decode(file_get_contents($DATA_FILE), true);
    
    $post_id = isset($_POST['id']) && $_POST['id'] !== '' ? (int)$_POST['id'] : null;
    $gallery = isset($_POST['gallery']) ? json_decode($_POST['gallery'], true) : [];
    if (!is_array($gallery)) {
        $gallery = [];
    }

    $new_post = [
        "id" => $post_id !== null ? $post_id : time(),
        "title" => $_POST['title'],
        "excerpt" => $_POST['excerpt'],
        "author" => $_POST['author'],
        "date" => isset($_POST['date']) && $_POST['date'] !== '' ? $_POST['date'] : date("F d, Y"),
        "category" => $_POST['category'],
        "image" => $_POST['image'],
        "gallery" => $gallery,
        "content" => $_POST['content']
    ];

    if ($post_id !== null) {
        // Edit existing post
        $updated = false;
        foreach ($current_data as &$post) {
            if ((int)$post['id'] === $post_id) {
                $post = $new_post;
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            array_unshift($current_data, $new_post);
        }
    } else {
        // Add new post to beginning
        array_unshift($current_data, $new_post);
    }

    file_put_contents($DATA_FILE, json_encode($current_data, JSON_PRETTY_PRINT));
    respond(["message" => "Story saved successfully!"]);
}

// 4. UPLOAD IMAGE
if ($action === 'upload' && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image_file'])) {
    $file = $_FILES['image_file'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'png'])) {
        respond(["message" => "Invalid file type. Only JPG, PNG, WebP are allowed."], 400);
    }
    
    $upload_dir = "../images/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $filename = time() . "_" . preg_replace("/[^a-zA-Z0-9\\._-]/", "", basename($file['name']));
    $target_path = $upload_dir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        respond(["image_path" => "images/" . $filename]);
    } else {
        respond(["message" => "Failed to upload file."], 500);
    }
}

// 3. DELETE POST
if ($action === 'delete' && isset($_GET['id'])) {
    $id_to_delete = (int)$_GET['id'];
    $current_data = json_decode(file_get_contents($DATA_FILE), true);
    
    $new_data = array_filter($current_data, function($post) use ($id_to_delete) {
        return (int)$post['id'] !== $id_to_delete;
    });

    file_put_contents($DATA_FILE, json_encode(array_values($new_data), JSON_PRETTY_PRINT));
    respond(["message" => "Story deleted successfully!"]);
}

respond(["message" => "Invalid action"], 400);
?>
