<?php
include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tamanho_tabuleiro = $_GET['tamanho_tabuleiro'];

    $sql = "SELECT u.nome_completo AS nome, r.modo_jogo, r.tempo 
            FROM ranking r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            WHERE r.tamanho_tabuleiro = '$tamanho_tabuleiro'
            ORDER BY r.tempo ASC
            LIMIT 10";

    $result = $conn->query($sql);
    $ranking = [];

    while ($row = $result->fetch_assoc()) {
        $ranking[] = $row;
    }

    echo json_encode($ranking);
}
?>