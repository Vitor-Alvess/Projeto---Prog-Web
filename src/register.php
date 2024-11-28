<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome_completo = $_POST['nome_completo'];
    $data_nascimento = $_POST['data_nascimento'];
    $cpf = preg_replace('/\D/', '', $_POST['cpf']); // Remove qualquer caractere não numérico do CPF
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];

    $sqlCheckUser = "SELECT * FROM usuarios WHERE usuario = :usuario OR cpf = :cpf OR email = :email";
    $stmt = $pdo->prepare($sqlCheckUser);
    $stmt->execute([
        ':usuario' => $usuario,
        ':cpf' => $cpf,
        ':email' => $email
    ]);
    $userExistente = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userExistente) {
        echo "Usuário, CPF ou e-mail já cadastrados!";
    } else {
        $senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

        $sqlInsert = "INSERT INTO usuarios (nome_completo, data_nascimento, cpf, telefone, email, usuario, senha) 
                      VALUES (:nome_completo, :data_nascimento, :cpf, :telefone, :email, :usuario, :senha)";
        $stmt = $pdo->prepare($sqlInsert);
        $stmt->execute([
            ':nome_completo' => $nome_completo,
            ':data_nascimento' => $data_nascimento,
            ':cpf' => $cpf,
            ':telefone' => $telefone,
            ':email' => $email,
            ':usuario' => $usuario,
            ':senha' => $senhaCriptografada
        ]);

        header("Location: login.html");
        exit();
    }
}
?>

