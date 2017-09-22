var Global = {};
Global.DBsecondLock = false;
const util = require("util");
const db_adapter = require("./db_adapter.js");

//--------------MODBUS-------------------

var modbus = require("jsmodbus");

var client = modbus.client.tcp.complete({
    'host'              : "10.210.30.213",
    'port'              : "502",
    'autoReconnect'     : true,
    'reconnectTimeout'  : 10000,
    'timeout'           : 5000,
    'unitId'            : 0
});

client.connect();

client.on('connect', function () {
    console.log("PLC connected");
    //запуск опроса PLC
    Global.schedullerTube = setInterval(function(){
        rcvTubes();
    },1000);
});

client.on('error', function (err) {
    process.send({"mb_error":true});
    console.log("ERROR MODBUS");
    if(Global.schedullerTube){
        clearInterval(Global.schedullerTube);
        console.log("interval clear reset");
    }
});
//Prebuffer rcvTubes
Global.buffer_tube1 = [];
Global.buffer_tube2 = [];
Global.buffer_tube3 = [];
Global.buffer_tube4 = [];

Global.buffer_valmin = [];
Global.buffer_valmax = [];
Global.buffer_dtmin = [];
Global.buffer_dtmax = [];

Global.bufferLen = 10;
Global.bufferStep = 0;
function rcvTubes(){
    client.readInputRegisters(15, 8).then(function (resp) {
        Global.bufferStep++;
        var nowdt = Date.now();
        var res = [];

        res[0] = WordToFloat(resp.register[1],resp.register[0]).toFixed(2); //tube1
        res[1] = WordToFloat(resp.register[3],resp.register[2]).toFixed(2); //tube2
        res[2] = WordToFloat(resp.register[5],resp.register[4]).toFixed(2); //tube3
        res[3] = WordToFloat(resp.register[7],resp.register[6]).toFixed(2); //tube4

        //console.log("1:"+res[0]+" 2:"+res[1]+" 3:"+res[2]+" 4:"+res[3]+" dt:"+nowdt+" heap = "+process.memoryUsage().heapUsed);


        if(Global.bufferStep == 1){
            //------------------------
            Global.buffer_valmax[0] = res[0];
            Global.buffer_valmax[1] = res[1];
            Global.buffer_valmax[2] = res[2];
            Global.buffer_valmax[3] = res[3];
            //------------------------
            Global.buffer_valmin[0] = res[0];
            Global.buffer_valmin[1] = res[1];
            Global.buffer_valmin[2] = res[2];
            Global.buffer_valmin[3] = res[3];
            //------------------------
            Global.buffer_dtmin[0] = nowdt;
            Global.buffer_dtmin[1] = nowdt;
            Global.buffer_dtmin[2] = nowdt;
            Global.buffer_dtmin[3] = nowdt;
            //------------------------
            Global.buffer_dtmax[0] = nowdt;
            Global.buffer_dtmax[1] = nowdt;
            Global.buffer_dtmax[2] = nowdt;
            Global.buffer_dtmax[3] = nowdt;
        }else{
            if(res[0]>Global.buffer_valmax[0]){
                Global.buffer_valmax[0] = res[0];
                Global.buffer_dtmax[0] = nowdt;
            }
            if(res[1]>Global.buffer_valmax[1]){
                Global.buffer_valmax[1] = res[1];
                Global.buffer_dtmax[1] = nowdt;
            }
            if(res[2]>Global.buffer_valmax[2]){
                Global.buffer_valmax[2] = res[2];
                Global.buffer_dtmax[2] = nowdt;
            }
            if(res[3]>Global.buffer_valmax[3]){
                Global.buffer_valmax[3] = res[3];
                Global.buffer_dtmax[3] = nowdt;
            }

            if(res[0]<Global.buffer_valmin[0]){
                Global.buffer_valmin[0] = res[0];
                Global.buffer_dtmin[0] = nowdt;
            }
            if(res[1]<Global.buffer_valmin[1]){
                Global.buffer_valmin[1] = res[1];
                Global.buffer_dtmin[1] = nowdt;
            }
            if(res[2]<Global.buffer_valmin[2]){
                Global.buffer_valmin[2] = res[2];
                Global.buffer_dtmin[2] = nowdt;
            }
            if(res[3]<Global.buffer_valmin[3]){
                Global.buffer_valmin[3] = res[3];
                Global.buffer_dtmin[3] = nowdt;
            }
        }
        if(Global.bufferStep >= Global.bufferLen){
            Global.bufferStep = 0;
            let pool = db_adapter.getStatusConnection();

            //отдаем клиенту
            process.send({"plc_fe":true, "val":Global.buffer_valmin, "dt":Global.buffer_dtmin,pool});
            process.send({"plc_fe":true, "val":Global.buffer_valmax, "dt":Global.buffer_dtmax,pool});
            //пишем в БД
            DBWriter(Global.buffer_valmin,Global.buffer_dtmin);
            DBWriter(Global.buffer_valmax,Global.buffer_dtmax);
            //console.log(util.inspect("max tubes:"+Global.buffer_valmax,{colors:true}));
            //console.log(util.inspect("min tubes:"+Global.buffer_valmin,{colors:true}));
        }

    }).fail(function(e){
        console.log(e);
        if(Global.schedullerTube){
            clearInterval(Global.schedullerTube);
            console.log("interval clear RCV TUBES");
        }
        process.send({"mb_error":true});
    });
}

//------XP
/*setTimeout(function () {
    process.disconnect();
},5000);*/
process.on("disconnect",function () {
   process.exit(0);
});

//-------
function DBWriter(data,nowdt){
    let tmpDate = new Date(nowdt[0]);
    let tmpSeconds = tmpDate.getSeconds();
    let tmpMinutes = tmpDate.getMinutes();
    var tmpQ = "";
    if(data){
        data.map(function (element,elem) {//перебор 4 труб
            let tmpTube = elem+1;

            db_adapter.getCON().then(function (connection) {
                tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+data[elem]+','+nowdt[elem]+')';
                console.log("min:",tmpMinutes," sec:",tmpSeconds);
                connection.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        process.send({"mysql_error":true,"err":"error SQL insert RT"});
                        db_adapter.getCON(null,null,true).then(function () {
                            console.log("SQL local con force replaced");
                        });
                    }
                    else console.log("data added in DB");
                });

                if(tmpSeconds==0 && tmpMinutes == 0 && !Global.DBsecondLock){//Пишем в часовой (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+data[elem]+','+nowdt[elem]+')';
                    connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert Local:"+util.inspect(err,{colors:true}));
                            process.send({"mysql_error":true,"err":"error SQL insert Local"});
                            db_adapter.getCON(null,null,true).then(function () {
                                console.log("SQL local con force replaced");
                            });
                        }else {
                            console.log("Hourly data added in DB");
                        }
                    });
                }
                if(tmpSeconds==0 && !Global.DBsecondLock){//Пишем в минутный (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+data[elem]+','+nowdt[elem]+')';
                    //console.log("Data RT Minutly saved in DB successuful on tube PLANNED"+tmpTube);
                    connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert Local:"+util.inspect(err,{colors:true}));
                            process.send({"mysql_error":true,"err":"error SQL insert minutes"});
                            db_adapter.getCON(null,null,true).then(function () {
                                console.log("SQL local con force replaced");
                            });
                        }else {
                            console.log("Minutely data added in DB");
                        }
                    });
                }
            },function () {//ошибка SQL
                process.send({"mysql_error":true,"err":"fatal error SQL pool"});
                console.log("fatal error SQL pool");
                db_adapter.getCON(null,null,true).then(function () {
                    console.log("SQL local con force replaced");
                });
            });
        },this);



        if(tmpSeconds == 0 && !Global.DBsecondLock){//установка защиты на запись дублирующих секунд
            Global.DBsecondLock = true;
        }
        if(tmpSeconds!=0 && Global.DBsecondLock){//снятие защиты на запись дублирующих секунд
            Global.DBsecondLock = false;
        }
    }else{
        console.log("No data");
    }
}
function WordToFloat( $Word1, $Word2 ) {
    /* Conversion selon presentation Standard IEEE 754
     /    seeeeeeeemmmmmmmmmmmmmmmmmmmmmmm
     /    31                             0
     /    s = sign bit, e = exponent, m = mantissa
     */
    var DBL_MAX = 99999999999999999;

    $src = ( ($Word1 & 0x0000FFFF) << 16) + (($Word2 & 0x0000FFFF) );

    $s = Boolean($src >> 31);
    $e = ($src & 0x7F800000) >> 23;
    $f = ($src & 0x007FFFFF);

    //var_dump($s);
    //echo "<br>";
    //var_dump($e);
    //echo "<br>";
    //var_dump($f);
    //echo "<br>";

    if ($e == 255 && $f != 0) {
        /* NaN - Not a number */
        $value = DBL_MAX;
    } else if ($e == 255 && $f == 0 && $s) {
        /* Negative infinity */
        $value = -DBL_MAX;
    } else if ($e == 255 && $f == 0 && !$s) {
        /* Positive infinity */
        $value = DBL_MAX;
    } else if ($e > 0 && $e < 255) {
        /* Normal number */
        $f += 0x00800000;
        if ($s) $f = -$f;
        $value = $f * Math.pow(2, $e - 127 - 23);
    } else if ($e == 0 && $f != 0) {
        /* Denormal number */
        if ($s) $f = -$f;
        $value = $f * Math.pow(2, $e - 126 - 23);
    } else if ($e == 0 && $f == 0 && $s) {
        /* Negative zero */
        $value = 0;
    } else if ($e == 0 && $f == 0 && !$s) {
        /* Positive zero */
        $value = 0;
    } else {
        /* Never happens */
    }

    return $value;
}