var Global = {};

Global.poolReset = false;
Global.conReQueryLocal = false;
Global.DBsecondLock = false;

const util = require("util");

//-------------MYSQL---------------------
var mysql = require("mysql");

var pool;
function crPool(){
    if(pool){
        pool = null;
    }
    pool = mysql.createPool({
        //waitForConnections:false,
        connectionLimit : 20,
        host     : 'localhost',
        user     : 'root',
        password : '123',
        database : 'flow_nb'
    });
}
crPool();//Первичная инициация pool
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
    regConSQLLocal();
});

client.on('error', function (err) {
    process.send({"mb_error":true});
    console.log("ERROR MODBUS");
    sqlCloseLocal();
});

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

            //отдаем клиенту
            process.send({"plc_fe":true, "val":Global.buffer_valmin, "dt":Global.buffer_dtmin});
            process.send({"plc_fe":true, "val":Global.buffer_valmax,"dt":Global.buffer_dtmax});
            //пишем в БД
            DBWriter(Global.buffer_valmin,Global.buffer_dtmin);
            DBWriter(Global.buffer_valmax,Global.buffer_dtmax);
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


function resetPool(){
    if(!Global.sqlResetQuery){
        Global.sqlResetQuery = true;
        if(pool){
            console.log("pool established, reset success");
            pool.end(function(err){
                if(!err){
                    console.log("pool end without error");
                    crPool();
                    regConSQLLocal();
                }else{
                    console.log("pool end with ERROR");
                    console.log("ERROR:"+util.inspect(err,{colors:true}));
                }
                Global.sqlResetQuery = false;
            });
        }else{
            console.log("pool not established, create new pool");
            crPool();
            regConSQLLocal();
            Global.sqlResetQuery = false;
        }
    }
}
function sqlCloseLocal(){
    if(Global.connection){
        Global.connection.release();
        Global.connection = null;
    }
    if(Global.schedullerTube){
        clearInterval(Global.schedullerTube);
        console.log("interval clear reset");
    }
}

setTimeout(function () {
    process.disconnect();
},5000);

process.on("disconnect",function () {
   process.exit(0);
});
function DBWriter(data,nowdt){
    var tmpQ = "";
    if(data){

        var tmpDate = new Date(nowdt[0]);
        var tmpSeconds = tmpDate.getSeconds();
        var tmpMinutes = tmpDate.getMinutes();

        for(var elem in data){//перебор 4 труб
            var tmpTube = Number(elem)+1;

            if(Global.connection){
                tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+data[elem]+','+nowdt[elem]+')';

                Global.connection.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        process.send({"mysql_error":true});
                        regConSQLLocal();
                    }else{
                        //console.log("Data RT saved in DB successuful");
                    }
                });

                if(tmpSeconds==0 && tmpMinutes == 0 && !Global.DBsecondLock){//Пишем в часовой (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+data[elem]+','+nowdt[elem]+')';
                    Global.connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert Local:"+util.inspect(err,{colors:true}));
                            process.send({"mysql_error":true});
                        }else{
                            //console.log("Data Local Hourly saved in DB successuful");
                        }
                    });
                }
                if(tmpSeconds==0 && !Global.DBsecondLock){//Пишем в минутный (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+data[elem]+','+nowdt[elem]+')';
                    //console.log("Data RT Minutly saved in DB successuful on tube PLANNED"+tmpTube);
                    Global.connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert Local:"+util.inspect(err,{colors:true}));
                            process.send({"mysql_error":true});
                        }else{
                            //console.log("Data Local Minutly saved in DB successuful");
                        }
                    });
                }

            }else{
                console.log("error SQL connection LOCAL not found");
                //создаем новый коннект
                regConSQLLocal();
            }
        }
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
