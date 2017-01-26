<?php
require_once "cripto.php";
require_once "dbsetting.php";

if($_GET["tel"] && $_GET["email"] && filter_var($_GET["email"], FILTER_VALIDATE_EMAIL)){
    //prepare data for db
    $email = $_GET["email"];
    $tel = $_GET["tel"];
    $mdemail = strToHex(md5($email,"salt459495860"));
    $cript = strToHex(__encode($tel,$mdemail));

    $q = 'INSERT INTO `phones` (`phone`,`email`) VALUES ("'.$cript.'","'.$mdemail.'") ON DUPLICATE KEY UPDATE `phone` = "'.$cript.'";';
    //echo $q;
    if($mysql->query($q)){
        echo '{"status":200,"statusText":"Ваши данные успешно добавлены в БД"}';

    }else{
        echo '{"status":0,"statusText":"Ваши данные не добавлены в БД из за внутренней ошибки сервера"}';
    }

}elseif ($_GET["forgotemail"] && filter_var($_GET["forgotemail"], FILTER_VALIDATE_EMAIL)){

    echo "{";
    //prepare data for query
    $forgotemail = $_GET["forgotemail"];

    $mdforgotemail = strToHex(md5($forgotemail,"salt459495860"));

    $fq = 'SELECT `phone` FROM `phones` WHERE `email`= "'.$mdforgotemail.'";';
    $res = $mysql->query($fq);
    $row = $res->fetch_assoc();
    if($row){
        $cript = $row["phone"];
        $decodephone = __decode(hexToStr($cript),$mdforgotemail);
        $m = mail($forgotemail, "Your phone number", " Your mail:  $forgotemail \n Your phone: $decodephone \n");
        if($m){
            echo "\"status\": 200, \"statusText\":\"Письмо отправлено на адрес ".$forgotemail."\"";
        }else{
            echo "\"status\": 100, \"statusText\":\"Телефон найден ($decodephone) но письмо НЕ отправлено на адрес ".$forgotemail." из за ошибок сервера\"";
        }
    }else{
        echo "\"status\": 0, \"statusText\":\"Ваш адрес ".$forgotemail." не найден в нашей базе данных\"";
    }
    echo "}";
}