<?php
require 'config.php';
session_start(); 


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario']; 
    $senha = $_POST['senha']; 

    try {
        $sql = "SELECT * FROM usuarios WHERE usuario = :usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':usuario' => $usuario]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

       
        if ($user) {
            
            if (password_verify($senha, $user['senha'])) {
                $_SESSION['usuario'] = $user['usuario'];
                header('Location: game.html'); 
                exit();
            } else {
                echo "<script>";
                echo "alert('Senha inválida!');  window.location.href='login.html'";
                echo "</script>";;
            }
        } else {
            echo "<script>";
            echo "alert('Usuário não encontrado!');  window.location.href='login.html'";
            echo "</script>";
        }
    } catch (PDOException $e) {
        die("Erro ao autenticar: " . $e->getMessage());
    }
}
?>
