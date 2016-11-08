<?php
require_once "../db.php";

$q = "SELECT * FROM `rt_widget` WHERE `id`=(SELECT MAX(`id`) FROM `rt_widget`);";

$result = $mysql->query($q);
$row = $result->fetch_assoc();
echo json_encode($row);