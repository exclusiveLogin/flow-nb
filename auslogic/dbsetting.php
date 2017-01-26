<?php
/**
 * Created by PhpStorm.
 * User: SavinSV
 * Date: 26.01.17
 * Time: 9:15
 */
$logindb="root";
$passdb="123";
$dbhost="localhost";
$dbname="auslogic";
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    die('{"errors":true,"errormsg":"'.$mysql->connect_error.'"}');
}
$mysql->query("SET NAMES 'UTF8';");
