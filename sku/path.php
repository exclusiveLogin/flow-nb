<?php
$check_prefix_lenght = strlen($_SERVER['CONTEXT_PREFIX']);
$check_prefix = $check_prefix_lenght>0;
$path_settings = "";

if($check_prefix){
	$path_settings = $_SERVER['CONTEXT_DOCUMENT_ROOT']."/temp/";
}else{

	$path_arr = explode("/",$_SERVER['REQUEST_URI']);
	$path_settings = $_SERVER['CONTEXT_DOCUMENT_ROOT']."/temp/";
}
//echo "temp path:".$path_settings."<br>";