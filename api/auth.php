<?php
// Файл: api/auth.php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// Получаем действие из запроса (login, logout, check)
$action = $_GET['action'] ?? '';

if ($action === 'login') {
    // Получаем JSON данные из тела запроса
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'error' => 'Введите email и пароль']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name, email, password_hash, role FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Успешная авторизация, сохраняем данные в сессию
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['user_name'] = $user['name'];

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Неверный email или пароль']);
        }
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Ошибка базы данных']);
    }
    exit;
}

if ($action === 'check') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'role' => $_SESSION['user_role']
            ]
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

// Если действие не найдено
echo json_encode(['error' => 'Invalid action']);
?>
