<?php
require_once "path.php";

$settings_file = $path_settings."settings.ini";

$file_exist = file_exists($settings_file);

//echo "ex:".$file_exist;

if($file_exist){
    $ini_arr = parse_ini_file($settings_file);
    
    $socket_p = '';
    $socket_nb = '';
    
    //var_dump($ini_arr);
    
    if(isset($ini_arr["server_p"])){
        $socket_p = $ini_arr["server_p"];
    }
    if(isset($ini_arr["server_nb"])){
        $socket_nb = $ini_arr["server_nb"];
    }
    
    if($socket_p && $socket_nb){
        echo '{"socket_p":"'.$socket_p.'","socket_nb":"'.$socket_nb.'"}';
    }
}