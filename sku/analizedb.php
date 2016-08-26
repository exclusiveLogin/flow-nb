<?php
require_once "db.php";

if($_GET["mm"]){
    MinMax();
}

function MinMax(){
    $query = "SELECT MIN(`utc`) FROM `p_tube1_dump`";
    mysql->query();
    
};





?>