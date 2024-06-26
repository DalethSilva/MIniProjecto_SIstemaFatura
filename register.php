<?php
include 'database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        $stmt = $pdo->prepare("SELECT * FROM administradores WHERE email = :email");
        $stmt->execute(['email' => $email]);
        if ($stmt->rowCount() > 0) {
            echo "<script>alert('Email já registrado');</script>";
            echo "<script>window.location.href = 'loginPage.html';</script>";
        } else {
            $stmt = $pdo->prepare("INSERT INTO administradores (nome, email, senha) VALUES (:nome, :email, :senha)");
            $stmt->execute(['nome' => $nome, 'email' => $email, 'senha' => $senha]);

            echo "<script>alert('Registro bem-sucedido! Você pode fazer login agora.');</script>";
            echo "<script>window.location.href = 'loginPage.html';</script>";
        }
    } else {
        echo "Método de requisição incorreto";
    }
} catch (Exception $e) {
    echo 'Erro: ' . $e->getMessage();
}
?>
