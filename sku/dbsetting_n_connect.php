<?php
$logindb="b33_11934654";
$passdb="request";
$dbhost="sql107.byethost33.com";
$dbname="b33_11934654_sku";

$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    die('{"errors":true,"errormsg":"error db":"'.$mysql->connect_error.'"}');
}
$mysql->query("SET NAMES 'UTF8';");