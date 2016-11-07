<?php
$ini_path = "../temp/widget.ini";
$f_exist = file_exists($ini_path);
//require_once "db.php";

$temp_v = 888;
$t1 = 888;
$t2 = 888;

$f11 = 888;
$f12 = 888;
$f21 = 888;
$f22 = 888;

$p11 = 888;
$p12 = 888;
$p21 = 888;
$p22 = 888;


if($f_exist){
    $ini_arr = parse_ini_file($ini_path);
    
    var_dump($ini_arr);
    
    if(isset($ini_arr['temp0'])){
        $temp_v = (float)str_replace(",",".",$ini_arr['temp0']);
    }
    
    if(isset($ini_arr['T1'])){
        $t1 = (float)str_replace(",",".",$ini_arr['T1']);
    }
    
    if(isset($ini_arr['T2'])){
        $t2 = (float)str_replace(",",".",$ini_arr['T2']);
    }
    
    if(isset($ini_arr['F11'])){
        $f11 = (float)str_replace(",",".",$ini_arr['F11']);
    }
    if(isset($ini_arr['F12'])){
        $f12 = (float)str_replace(",",".",$ini_arr['F12']);
    }
    if(isset($ini_arr['F21'])){
        $f21 = (float)str_replace(",",".",$ini_arr['F21']);
    }
    if(isset($ini_arr['F22'])){
        $f22 = (float)str_replace(",",".",$ini_arr['F22']);
    }
    
    if(isset($ini_arr['P11'])){
        $p11 = (float)str_replace(",",".",$ini_arr['P11']);
    }
    if(isset($ini_arr['P12'])){
        $p12 = (float)str_replace(",",".",$ini_arr['P12']);
    }
    if(isset($ini_arr['P21'])){
        $p21 = (float)str_replace(",",".",$ini_arr['P21']);
    }
    if(isset($ini_arr['P22'])){
        $p22 = (float)str_replace(",",".",$ini_arr['P22']);
    }
    
}
echo "<br>tv:";
var_dump ($temp_v);
echo "<br>t1:";
var_dump ($t1);
echo "<br>t2:";
var_dump ($t2);
echo "<br>f11";
var_dump ($f11);
echo "<br>f12:";
var_dump ($f12);
echo "<br>f21:";
var_dump ($f21);
echo "<br>f22:";
var_dump ($f22);
echo "<br>p11:";
var_dump ($p11);
echo "<br>p12:";
var_dump ($p12);
echo "<br>p21:";
var_dump ($p21);
echo "<br>p22:";
var_dump ($p22);
