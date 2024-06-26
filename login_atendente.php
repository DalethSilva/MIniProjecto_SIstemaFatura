<?php
session_start();
include 'database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        $stmt = $pdo->prepare("SELECT * FROM atendentes WHERE email = :email AND senha = :senha");
        $stmt->execute(['email' => $email, 'senha' => $senha]);
        $atendente = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($atendente) {
            $_SESSION['atendente_id'] = $atendente['id'];
            header("Location: home.html");
            exit;
        } else {
            echo "<script>alert('Email ou senha incorretos');</script>";
            echo "<script>window.location.href = 'loginPage2.html';</script>";
        }
    } else {
        echo "Método de requisição incorreto";
    }
} catch (Exception $e) {
    echo 'Erro: ' . $e->getMessage();
}
?>
