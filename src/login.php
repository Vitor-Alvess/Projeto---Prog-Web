<?php
session_start();

$conn = new mysqli('localhost', 'root', '', 'campo_minado');

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM usuarios WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['senha'])) {
        $_SESSION['usuario'] = $username;
        $_SESSION['id_usuario'] = $row['id'];
        header("Location: game.php");
        exit;
    } else {
        echo "Usuário ou senha incorretos.";
    }
} else {
    echo "Usuário ou senha incorretos.";
}

$stmt->close();
$conn->close();
?>
