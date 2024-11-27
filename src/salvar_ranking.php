<?php
include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario']; 
    $modo_jogo = $_POST['modo_jogo'];
    $tempo = $_POST['tempo'];
    $tamanho_tabuleiro = $_POST['tamanho_tabuleiro'];

    if (empty($usuario) || empty($modo_jogo) || empty($tempo) || empty($tamanho_tabuleiro)) {
        echo "<script>";
        echo "alert('Dados incompletos!'); window.location.href='ranking.html'";
        echo "</script>";
        exit;
    }

   
    $usuarioCheck = $conn->query("SELECT id FROM usuarios WHERE usuario = '$usuario'");

    if ($usuarioCheck->num_rows === 0) {
        echo "<script>";
        echo "alert('O usuário $usuario não foi encontrado'); window.location.href='ranking.html'";
        echo "</script>";
        exit;
    }
    
    $usuarioRow = $usuarioCheck->fetch_assoc();
    $usuario_id = $usuarioRow['id'];

   
    $sql = "INSERT INTO ranking (usuario_id, modo_jogo, tempo, tamanho_tabuleiro) 
            VALUES ('$usuario_id', '$modo_jogo', '$tempo', '$tamanho_tabuleiro')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>";
        echo "alert('Registro salvo com sucesso!'); window.location.href='ranking.html'";
        echo "</script>";
    } 
    else {
        echo "Erro ao salvar o ranking: " . $conn->error;
    }
}
?>
