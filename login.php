<?php
session_start();
include 'database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        $stmt = $pdo->prepare("SELECT * FROM administradores WHERE email = :email AND senha = :senha");
        $stmt->execute(['email' => $email, 'senha' => $senha]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            $_SESSION['admin_id'] = $admin['id'];
            header("Location: home.html");
            exit;
        } else {
            echo "<script>alert('Email ou senha incorretos');</script>";
            echo "<script>window.location.href = 'loginPage.html';</script>";
        }
    } else {
        echo "Método de requisição incorreto";
    }
} catch (Exception $e) {
    echo 'Erro: ' . $e->getMessage();
}
?>
