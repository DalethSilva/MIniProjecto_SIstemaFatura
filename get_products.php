<?php
include 'database.php';

$stmt = $pdo->query("SELECT id, descricao, quantidade, preco FROM produtos");
$produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($produtos);
?>
