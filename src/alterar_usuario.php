<?php
include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario']; 
    $nome_completo = $_POST['nome_completo'];
    $email = $_POST['email']; 
    $telefone = $_POST['telefone']; 
    $senha_antiga = $_POST['senha_antiga']; 
    $senha_nova = $_POST['senha']; 

    
    if (empty($usuario) || empty($nome_completo) || empty($email) || empty($telefone) || empty($senha_antiga) || empty($senha_nova)) {
        echo "<script>alert('Erro: Todos os campos são obrigatórios!'); window.location.href='alter_login.html';</script>";
        exit;
    }

    $sql_check = "SELECT senha FROM usuarios WHERE usuario = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $usuario);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows === 0) {
        echo "<script>alert('Erro: Usuário não encontrado.'); window.location.href='alter_login.html';</script>";
        exit;
    }

    $row = $result_check->fetch_assoc();
    $senha_atual = $row['senha'];

  
    if (!password_verify($senha_antiga, $senha_atual)) {
        echo "<script>alert('Erro: A senha antiga está incorreta.'); window.location.href='alter_login.html';</script>";
        exit;
    }

    $senha_nova_hash = password_hash($senha_nova, PASSWORD_DEFAULT); 
    $sql_update = "UPDATE usuarios SET nome_completo = ?, email = ?, telefone = ?, senha = ? WHERE usuario = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("sssss", $nome_completo, $email, $telefone, $senha_nova_hash, $usuario);

    if ($stmt_update->execute()) {
        echo "<script>alert('Dados alterados com sucesso!'); window.location.href='alter_login.html';</script>";
    } else {
        echo "<script>alert('Erro ao atualizar os dados.'); window.location.href='alter_login.html';</script>";
    }
}
?>
