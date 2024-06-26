<?php
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $clienteNome = $_POST['clienteNome'];
    $data = $_POST['data'];
    $itens = json_decode($_POST['itens'], true);
    $total = $_POST['total'];

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO faturas (cliente_nome, data, total) VALUES (:clienteNome, :data, :total)");
        $stmt->execute(['clienteNome' => $clienteNome, 'data' => $data, 'total' => $total]);
        $faturaId = $pdo->lastInsertId();

        foreach ($itens as $item) {
            $stmt = $pdo->prepare("INSERT INTO fatura_itens (fatura_id, produto_id, descricao, quantidade, preco_unitario, total) VALUES (:faturaId, :produtoId, :descricao, :quantidade, :precoUnitario, :total)");
            $stmt->execute([
                'faturaId' => $faturaId,
                'produtoId' => $item['product_id'],
                'descricao' => $item['descricao'],
                'quantidade' => $item['quantidade'],
                'precoUnitario' => $item['preco_unitario'],
                'total' => $item['total']
            ]);
        }

        $pdo->commit();
        echo "Fatura salva com sucesso!";
    } catch (Exception $e) {
        $pdo->rollBack();
        echo "Falha ao salvar a fatura: " . $e->getMessage();
    }
} else {
    echo "Método de requisição incorreto";
}
?>
