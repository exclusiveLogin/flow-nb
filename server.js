var Global = {};
Global.RTsecondLock = false;
Global.DBsecondLock = false;
Global.freeLock = false;
Global.clients = [];
Global.poolReset = false;
Global.conReQueryLocal = false;
Global.conReQueryRT = false;
Global.conReQueryReplica = false;
//----------------UTILS-------------------
const util = require("util");

//----------------SERVER------------------
var socketServ = require('socket.io').listen(3000);

socketServ.on("connection",function(socket){
    console.log("client Front End connected");
    socket.on("arjLoad",function(data){
        localP = false;
        localNB = false;
        trendP = [];
        trendNB = [];
        console.log("ARJ LOAD started");
        if(data.min && data.max && data.tube){//проверка целостности 
            var tube = data.tube;
            var interval = data.max - data.min;
            console.log("interval:"+interval); 
            if(interval>3600*24*1000){//если накопленные данные больше суток
                var query_p = "SELECT * FROM `p_tube"+tube+"_m` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                var query_nb = "SELECT * FROM `tube"+tube+"_m` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
            }else{
                var query_p = "SELECT * FROM `p_tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                var query_nb = "SELECT * FROM `tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
            }
            pool.getConnection(function(err,connection){
                if(!err){
                    console.log("ArjLoad Pool OK");
                    connection.query(query_p, function(err,data){
                        if(err){
                            socketServ.emit("mysql_error",{});
                            console.log("ARJLOAD error SQL query P");
                        }else{
                            //console.log(util.inspect(data,{colors:true}));
                            localP = true;
                            trendP = data;
                            ret();
                        }
                    });
                    connection.query(query_nb, function(err,data){
                        if(err){
                            socketServ.emit("mysql_error",{});
                            console.log("ARJLOAD error SQL query NB");
                        }else{
                            //console.log(util.inspect(data,{colors:true}));
                            localNB = true;
                            trendNB = data;
                            ret();
                        }
                    });
                    function ret(){
                        if(localNB && localP){
                            connection.release();
                            console.log("ArjLoad connection released");
                            checkPool("arj");
                            socketServ.sockets.emit("arj_load_res",{trendP:trendP, trendNB:trendNB,min:data.min,max:data.max});
                            localNB = false;
                            localP = false;
                            trendP = null;
                            trendNB = null;
                        }
                    };
                }else{
                    socketServ.emit("mysql_error",{}); 
                    console.log("error SQL pool");
                }
            });
        }
    });
    socket.on("min_max",function(data){
        var RcvMin = null;
        var RcvMax = null;
        var RcvMin2 = null;
        var RcvMax2 = null;
        var localMin = false;
        var localMax = false;
        var localMin2 = false;
        var localMax2 = false;
        var result = {
            min:null,
            max:null
        }
        console.log("min_max");
        pool.getConnection(function(err,connection){
            if(!err){
                console.log("MinMax Pool OK");
                var query = "SELECT MIN(`utc`) AS `minimum` FROM `p_tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        console.log(util.inspect(data,{colors:true}));
                        RcvMin = data[0].minimum;
                        localMin = true;
                        ret();
                    }
                });
                var query = "SELECT MAX(`utc`) AS `maximum` FROM `p_tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        console.log(util.inspect(data,{colors:true}));
                        RcvMax = data[0].maximum;
                        localMax = true;
                        ret();
                    }
                });
                var query = "SELECT MIN(`utc`) AS `minimum` FROM `tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        console.log(util.inspect(data,{colors:true}));
                        RcvMin2 = data[0].minimum;
                        localMin2 = true;
                        ret();
                    }
                });
                var query = "SELECT MAX(`utc`) AS `maximum` FROM `tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        console.log(util.inspect(data,{colors:true}));
                        RcvMax2 = data[0].maximum;
                        localMax2 = true;
                        ret();
                    }
                });
                                      
                
                
                function ret(){
                    if(localMax && localMin && localMax2 && localMin2){
                        connection.release();
                        console.log("MinMax connection released");
                        
                        console.log("min:"+RcvMin+" max:"+RcvMax);
                        console.log("min:"+RcvMin2+" max:"+RcvMax2);
                        if(RcvMax >= RcvMax2){
                            result.max = RcvMax;
                        }else{
                            result.max = RcvMax2;
                        }
                        //обработка нуля min Interval
                        if(RcvMin == null && RcvMin2 == null){
                            socketServ.sockets.emit("min_null",{});
                            console.log("min_max null SQL error");
                        }else if(RcvMin == null){
                            RcvMin = RcvMin2;
                        }else{
                            RcvMin2 = RcvMin;
                        }
                        //------------------------------
                        
                        
                        if(RcvMin <= RcvMin2){
                            result.min = RcvMin;
                        }else{
                            result.min = RcvMin2;
                        }
                        result.tube = data.tube;
                        console.log(util.inspect(result));
                        //сюда пишем вывод значений для тренда
                        socketServ.sockets.emit("min_max_res",result);
                        localMax = false;
                        localMax2 = false;
                        localMin = false;
                        localMin2 = false;
                    }
                };
                
            }else{
                socketServ.sockets.emit("mysql_error",{});
                console.log("error SQL pool");
            }
        });
    });
});

//----------------MYSQL------------------
var mysql = require("mysql");

var pool  = mysql.createPool({
    waitForConnections:false,
    connectionLimit : 20,
    host     : 'localhost',
    user     : 'root',
    password : '123',
    database : 'flow_nb'
});

var resetPool = function(){
    if(pool){
        console.log("pool established, reset success");
    }else{
        console.log("pool not established, reset unsuccess");
    }
}
var checkPool = function(str){
    if(pool){
        console.log(str+":");
        console.log("all con:"+util.inspect(pool._allConnections.length,{colors:true}));
        console.log("free con:"+util.inspect(pool._freeConnections.length,{colors:true}));
    }else{
        console.log("pool not defined");
    }
}
//--------------MODBUS-------------------

var modbus = require("jsmodbus");

var client = modbus.client.tcp.complete({ 
        'host'              : "10.210.30.117", 
        'port'              : "502",
        'autoReconnect'     : true,
        'reconnectTimeout'  : 1000,
        'timeout'           : 500,
        'unitId'            : 0
    });


client.connect();

client.on('connect', function () {
    console.log("PLC connected");
    pool.getConnection(function(err, connection) {
        checkPool("PLC connected");
        if(err){
            socketServ.sockets.emit("mysql_error",{});
            console.log("error SQL pool");
        }else{
            socketServ.sockets.emit("all_ok",{});
            console.log("No error SQL {LOCAL} all ok");
            Global.connection = connection;
            Global.schedullerTube = setInterval(function(){
                rcvTubes();  
            },1000);
        }    
    });
});

client.on('error', function (err) {
    socketServ.sockets.emit("mb_error",{});
    console.log("ERROR MODBUS");
    //console.log(err);
    
    if(Global.connection){
        Global.connection.release();
        Global.connection=null;
    }
    if(Global.schedullerTube){
        clearInterval(Global.schedullerTube);
    }
});
//-----------------SERVER TO PRICHAL----------------------
Global.disconQ = false;


function forceDisconCl(){
    if(!Global.disconQ){
        socket.emit("discon");
        socket.disconnect();
        console.log("disconnect emited");
        Global.disconQ = true;
    }
}


var io = require('socket.io').listen(3001);

io.on("connection",function(socket){
    pool.getConnection(function(err, connection) {
        checkPool("io connection");
        if(err){
            socketServ.sockets.emit("mysql_error",{});
            console.log("error SQL pool");
        }else{
            socketServ.sockets.emit("all_ok",{});
            console.log("No error SQL {REMOTE RT} all ok");
            Global.connectionRT = connection;
        }    
    });
    
    console.log("Prichal connected");
    //socket.emit("msg",{data:"connection to server established"});
    socket.on('id',function(data){
          if(data.name){
              socket.opc = data.name;
              Global.clients.push(socket); 
              console.log("curent name:"+data.name);
              //console.log(Global.clients);
          }
    });
    socket.on("RTSend",function(data){
        inserterRT(data.tubes,data.time);
    });
    socket.on('disconnect',function(){
        //---------------pool free------------
        if(Global.connectionRT){
            Global.connectionRT.release();
            Global.connectionRT = null;
        }
        checkPool("prichal disconnect RT");
        //------------------------------------
        console.log("IO disconnected");
        var index = Global.clients.indexOf(socket);
        //console.log("bfd:"+Global.clients);
        if(index!=-1){
            Global.clients.splice(index,1);
        }
        //console.log("ad:"+Global.clients);
    });
    socket.on("replica",function(cont){
        
        Global.LID = {
            tube1:0,
            tube2:0,
            tube3:0,
            tube4:0,
        };
        var replNeed = false;
        if(cont.tube1){
            replNeed = true;
            inserterDB(1,cont.tube1);
        }
        if(cont.tube2){
            replNeed = true;
            inserterDB(2,cont.tube2);
        }
        if(cont.tube3){
            replNeed = true;            
            inserterDB(3,cont.tube3);
        }
        if(cont.tube4){
            replNeed = true;            
            inserterDB(4,cont.tube4);
        }
        if(replNeed){
            replQ();
            replNeed = false;
        }
    });
});
function replQ(){
    io.sockets.emit("replicateQ",{});
};
function freener(lid,tube){
    console.log("prepare to del id:"+lid+" on tube "+tube);
    io.sockets.emit("free",{"lid":lid,"tube":tube});
};
function inserterRT(tubes,time){
    console.log("data rcv RT:"+util.inspect(tubes,{colors:true}));
    var tmpDate = new Date(time);
    var tmpSeconds = tmpDate.getSeconds();
    var tmpMinutes = tmpDate.getMinutes();
    for(var elem in tubes){//перебор 4 труб
        var tmpTube = Number(elem)+1;
        //console.log("second:"+tmpSeconds+" locker:"+util.inspect(Global.RTsecondLock,{colors:true}));
        //console.log("id:"+elem+" tube:"+tmpTube+" value:"+tubes[elem]+" utc:"+time);
        if(Global.connectionRT){            
            tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+tubes[elem]+','+time+')';
            Global.connectionRT.query(tmpQ,function(err){
                if(err){
                    console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                    socketServ.sockets.emit("mysql_error",{});
                }else{
                    //console.log("Data RT saved in DB successuful");
                }
            });
         
            
            if(tmpSeconds==0 && tmpMinutes == 0 && !Global.RTsecondLock){//Пишем в часовой (одну запись!!!!)
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+tubes[elem]+','+time+')';
                Global.connectionRT.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        socketServ.sockets.emit("mysql_error",{});
                    }else{
                        //console.log("Data RT Hourly saved in DB successuful");
                    }
                });
            }
            
            if(tmpSeconds==0 && !Global.RTsecondLock){//Пишем в минутный (одну запись!!!!)
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+tubes[elem]+','+time+')';
                //console.log("Data RT Minutly saved in DB successuful on tube PLANNED"+tmpTube);
                Global.connectionRT.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        socketServ.sockets.emit("mysql_error",{});
                    }else{
                        //console.log("Data RT Minutly saved in DB successuful on tube"+tmpTube);
                    }
                });
            }
        }else{
            console.log("error SQL connection RT not found");
            checkPool("error SQL inserter RT");
        }
    }
    if(tmpSeconds == 0 && !Global.RTsecondLock){//снятие защиты на запись дублирующих секунд
                Global.RTsecondLock = true;
            }
    if(tmpSeconds!=0 && Global.RTsecondLock){//снятие защиты на запись дублирующих секунд
                Global.RTsecondLock = false;
            }
    
};

function inserterDB(tube,stack){
    pool.getConnection(function(err,connection){
        if(!err){
            var tmp = 0;
            for(var elem in stack){
                console.log('row:'+elem+" value:"+stack[elem].value+" utc:"+stack[elem].utc);

                tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_dump` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                //console.log(tmpQ);
                connection.query(tmpQ,function(err){
                    tmp++; 
                    //console.log("tmp:"+tmp);
                    if(!err){
                        if(tmp == stack.length){
                            //console.log("yes elem:"+elem+" == "+stack.length);
                            io.sockets.emit("send_free",{});
                        }
                    }else{
                        console.log(err);
                        io.sockets.emit("send_free",{});
                    }
                });
                if(stack[elem].min == 0 && stack[elem].sec == 0 && !Global.DBsecondLock){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_h` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                    connection.query(tmpQ,function(err){
                        if(!err){
                            //console.log("all ok data inserted");
                        }else{
                            console.log(err);
                            io.sockets.emit("send_free",{});
                        }
                    });
                }
                if(stack[elem].sec == 0 && !Global.DBsecondLock){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_m` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                    connection.query(tmpQ,function(err){
                        if(!err){
                            //console.log("all ok data inserted");
                        }else{
                            console.log(err);
                            io.sockets.emit("send_free",{});
                        }
                    });
                }
                if(stack[elem].sec == 0 && !Global.DBsecondLock){//снятие защиты на запись дублирующих секунд
                            Global.DBsecondLock = true;
                        }
                if(stack[elem].sec != 0 && Global.DBsecondLock){//снятие защиты на запись дублирующих секунд
                            Global.DBsecondLock = false;
                        }
                
            }
            freener(stack[stack.length-1].utc,tube);
            connection.release();
        }else{
            console.log("pool SQL error");
            checkPool("error SQL InserterDB");
        }
    });  
    
};


//**************************MODBUS CLIENT *******************************************

function rcvTubes(){
    client.readInputRegisters(15, 8).then(function (resp) {
        //console.log(resp);
        var res = [];
        res[0] = WordToFloat(resp.register[1],resp.register[0]).toFixed(2);
        res[1] = WordToFloat(resp.register[3],resp.register[2]).toFixed(2);
        res[2] = WordToFloat(resp.register[5],resp.register[4]).toFixed(2);
        res[3] = WordToFloat(resp.register[7],resp.register[6]).toFixed(2);
        //console.log("1:"+res[0]+" 2:"+res[1]+" 3:"+res[2]+" 4:"+res[3]+" heap = "+process.memoryUsage().heapUsed);
        //console.log(process.memoryUsage());

        var nowdt = Date.now();
        FESender(res,nowdt);//отдаем клиенту  
        DBWriter(res,nowdt);//пишем в БД
        /*
        if(process.memoryUsage().heapUsed>300000000){//Защита от переполнения стека
            Global.DBLock = true; 
        }else{
            if(!Global.DBLock){
                //DBWriter(res,nowdt);//пишем в БД
            }
            if(process.memoryUsage().heapUsed<30000000){
                    Global.DBLock =false;
            }
        }*/
    }).fail(function(e){
        if(Global.schedullerTube){
            clearInterval(Global.schedullerTube);
        }
        socketServ.emit("mb_error",{});
    });
};
//console.log("hello world");
//socketServ.sockets.emit("all_ok",{"tube1":[Number(nowdt),Number(tube1)]});
//----------------------------------
function DBWriter(data,nowdt){
    var tmpQ = "";
    if(data){
        //console.log("data full ok");
        //console.log("data rcv RT:"+util.inspect(data,{colors:true}));
        var tmpDate = new Date(nowdt);
        var tmpSeconds = tmpDate.getSeconds();
        var tmpMinutes = tmpDate.getMinutes();
        for(var elem in data){//перебор 4 труб
            var tmpTube = Number(elem)+1;
            //console.log("second:"+tmpSeconds+" locker:"+util.inspect(Global.RTsecondLock,{colors:true}));
            //console.log("id:"+elem+" tube:"+tmpTube+" value:"+tubes[elem]+" utc:"+time);


            if(Global.connection){   
                //console.log("connection ok");
                tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+data[elem]+','+nowdt+')';
                //console.log(tmpQ);

                Global.connection.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        socketServ.sockets.emit("mysql_error",{});
                    }else{
                        //console.log("Data RT saved in DB successuful");
                    }
                });


                if(tmpSeconds==0 && tmpMinutes == 0 && !Global.RTsecondLock){//Пишем в часовой (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+data[elem]+','+nowdt+')';
                    Global.connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                            socketServ.sockets.emit("mysql_error",{});
                        }else{
                            console.log("Data RT Hourly saved in DB successuful");
                        }
                    });
                    //Global.RTsecondLock = true;
                }
                if(tmpSeconds==0 && !Global.RTsecondLock){//Пишем в минутный (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+data[elem]+','+nowdt+')';
                    //console.log("Data RT Minutly saved in DB successuful on tube PLANNED"+tmpTube);
                    Global.connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                            socketServ.sockets.emit("mysql_error",{});
                        }else{
                            console.log("Data RT Minutly saved in DB successuful on tube"+tmpTube);
                        }
                    });

                    //Global.RTsecondLock = true;
                }
            }else{
                console.log("error SQL connection not found");
                checkPool("error SQL DBWriter")

            }
        }
    }else{
        console.log("No data");
    }
};
function FESender(data,nowdt){
    //nowdt = Number(nowdt);
    socketServ.emit("all_ok",{
        "tube1":[nowdt,Number(data[0])],
        "tube2":[nowdt,Number(data[1])],
        "tube3":[nowdt,Number(data[2])],
        "tube4":[nowdt,Number(data[3])]
    });
    var heap = process.memoryUsage();
    if(pool){
        heap.sqlcon = pool._allConnections.length;
        heap.sqlfree = pool._freeConnections.length;
    }else{
        heap.sqlcon = 0;
        heap.sqlfree = 0;
    }
    
    socketServ.emit("heap",heap);
};


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
	};