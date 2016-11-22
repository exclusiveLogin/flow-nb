<?php
$ini_path = "../temp/widget.ini";
$f_exist = file_exists($ini_path);
require_once "../db.php";

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

$upd = "888";

if($f_exist){
    $ini_arr = parse_ini_file($ini_path);
    
    var_dump($ini_arr);
    
    if(isset($ini_arr['temp0'])){
        $temp_v = round((float)str_replace(",",".",$ini_arr['temp0']),1);
        $q = "UPDATE `rt_widget` SET  `temp_v` =".$temp_v.";";
        $mysql->query($q);
    }
    
    if(isset($ini_arr['T1'])){
        $t1 = round((float)str_replace(",",".",$ini_arr['T1']),1);
        $q = "UPDATE `rt_widget` SET  `t1` =".$t1.";";
        $mysql->query($q);
    }
    
    if(isset($ini_arr['T2'])){
        $t2 = round((float)str_replace(",",".",$ini_arr['T2']),1);
        $q = "UPDATE `rt_widget` SET  `t2` =".$t2.";";
        $mysql->query($q);
    }
    
    if(isset($ini_arr['F11'])){
        $f11 = round((float)str_replace(",",".",$ini_arr['F11']),1);
        $q = "UPDATE `rt_widget` SET  `f11` =".$f11.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['F12'])){
        $f12 = round((float)str_replace(",",".",$ini_arr['F12']),1);
        $q = "UPDATE `rt_widget` SET  `f12` =".$f12.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['F21'])){
        $f21 = round((float)str_replace(",",".",$ini_arr['F21']),1);
        $q = "UPDATE `rt_widget` SET  `f21` =".$f21.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['F22'])){
        $f22 = round((float)str_replace(",",".",$ini_arr['F22']),1);
        $q = "UPDATE `rt_widget` SET  `f22` =".$f22.";";
        $mysql->query($q);
    }
    
    if(isset($ini_arr['P11'])){
        $p11 = round((float)str_replace(",",".",$ini_arr['P11']),1);
        $q = "UPDATE `rt_widget` SET  `p11` =".$p11.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['P12'])){
        $p12 = round((float)str_replace(",",".",$ini_arr['P12']),1);
        $q = "UPDATE `rt_widget` SET  `p12` =".$p12.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['P21'])){
        $p21 = round((float)str_replace(",",".",$ini_arr['P21']),1);
        $q = "UPDATE `rt_widget` SET  `p21` =".$p21.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['P22'])){
        $p22 = round((float)str_replace(",",".",$ini_arr['P22']),1);
        $q = "UPDATE `rt_widget` SET  `p22` =".$p22.";";
        $mysql->query($q);
    }
    if(isset($ini_arr['upd'])){
	$upd = $ini_arr['upd'];
	$q = "UPDATE `rt_widget` SET `upd` = \"".$upd."\";";
	$mysql->query($q);
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
