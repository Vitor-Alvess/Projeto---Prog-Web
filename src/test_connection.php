<?php
$host = 'localhost'; // Ou o host do seu servidor
$db = 'campo_minado'; // Substitua pelo nome do seu banco
$user = 'root'; // Substitua pelo usuário do banco
$pass = ''; // Substitua pela senha do usuário

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
} else {
    echo "Conexão bem-sucedida!";
}
?>
