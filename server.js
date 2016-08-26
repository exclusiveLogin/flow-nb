var Global = {};
Global.freeLock = false;
Global.clients = [];
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
                var query_p = "SELECT * FROM `p_tube"+tube+"_m` WHERE `utc` BETWEEN "+data.min+" AND "+data.max;
                var query_nb = "SELECT * FROM `tube"+tube+"_m` WHERE `utc` BETWEEN "+data.min+" AND "+data.max;
            }else{
                var query_p = "SELECT * FROM `p_tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max;
                var query_nb = "SELECT * FROM `p_tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max;
            }
            pool.getConnection(function(err,connection){
                if(!err){
                    console.log("ArjLoad Pool OK");
                    connection.query(query_p, function(err,data){
                        if(err){
                            socketServ.sockets.emit("mysql_error",{});
                            console.log("ARJLOAD error SQL query P");
                        }else{
                            console.log(util.inspect(data,{colors:true}));
                            localP = true;
                            trendP = data;
                            ret();
                        }
                    });
                    connection.query(query_nb, function(err,data){
                        if(err){
                            socketServ.sockets.emit("mysql_error",{});
                            console.log("ARJLOAD error SQL query NB");
                        }else{
                            console.log(util.inspect(data,{colors:true}));
                            localNB = true;
                            trendNB = data;
                            ret();
                        }
                    });
                    function ret(){
                        if(localNB && localP){
                            connection.release();
                            console.log("ArjLoad connection released");
                            socketServ.sockets.emit("arj_load_res",{trendP:trendP, trendNB:trendNB});
                            localNB = false;
                            localP = false;
                        }
                    };
                }else{
                    socketServ.sockets.emit("mysql_error",{}); 
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
    connectionLimit : 5,
    host     : 'localhost',
    user     : 'root',
    password : '123',
    database : 'flow_nb'
});
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
        if(err){
            socketServ.sockets.emit("mysql_error",{});
            console.log("error SQL pool");
        }else{
            socketServ.sockets.emit("all_ok",{});
            console.log("No error SQL {LOCAL} all ok");
            Global.connection = connection;
            Global.schedullerTube = setInterval(function(){
                rcvTubes();  
                //console.log(process.memoryUsage().heapUsed);
            },500);
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

var io = require('socket.io').listen(3001);

io.on("connection",function(socket){
    pool.getConnection(function(err, connection) {
        if(err){
            socketServ.sockets.emit("mysql_error",{});
            console.log("error SQL pool");
        }else{
            socketServ.sockets.emit("all_ok",{});
            console.log("No error SQL {REMOTE RT} all ok");
            Global.connectionRT = connection;
        }    
    });
    
    console.log("IO connected");
    socket.emit("msg",{data:"connection to server established"});
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
        Global.connectionRT.release();
        Global.connectionRT = null;
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
        //console.log("id:"+elem+" tube:"+tmpTube+" value:"+tubes[elem]+" utc:"+time);
        

        if(Global.connectionRT){
            var secondLock = false;
            tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+tubes[elem]+','+time+')';
            
            Global.connectionRT.query(tmpQ,function(err){
                if(err){
                    console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                    socketServ.sockets.emit("mysql_error",{});
                }else{
                    //console.log("Data RT saved in DB successuful");
                }
            });
         
            
            if(tmpSeconds==0 && tmpMinutes == 0 && !secondLock){//Пишем в часовой (одну запись!!!!)
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+tubes[elem]+','+time+')';
                Global.connectionRT.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        socketServ.sockets.emit("mysql_error",{});
                    }else{
                        console.log("Data RT Hourly saved in DB successuful");
                    }
                });
                secondLock = true;
            }
            if(tmpSeconds==0 && !secondLock){//Пишем в минутный (одну запись!!!!)
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+tubes[elem]+','+time+')';
                
                Global.connectionRT.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        socketServ.sockets.emit("mysql_error",{});
                    }else{
                        console.log("Data RT Minutly saved in DB successuful");
                    }
                });
        
                secondLock = true;
            }
            if(tmpSeconds!=0){//снятие защиты на запись дублирующих секунд
                secondLock = false;
            }
        
        
        }else{
            console.log("error SQL connectionRT not found");
        }
        
        
    }
    
    
    
    //-
    
};

function inserterDB(tube,stack){
    pool.getConnection(function(err,connection){
        if(!err){
            var tmp = 0;
            for(var elem in stack){
                console.log('row:'+elem+" id:"+stack[elem].id+" value:"+stack[elem].value+"time:"+stack[elem].datetime+" utc:"+stack[elem].utc);

                tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_dump` (`p_id`,`value`,`utc`) VALUES('+stack[elem].id+','+stack[elem].value+','+stack[elem].utc+')';
                //console.log(tmpQ);
                connection.query(tmpQ,function(err){
                    //console.log("elem:"+elem+" from "+stack.length);
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
                if(stack[elem].min == 0 && stack[elem].sec == 0){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_h` (`p_id`,`value`,`utc`) VALUES('+stack[elem].id+','+stack[elem].value+','+stack[elem].utc+')';
                    //console.log(tmpQ);
                    connection.query(tmpQ,function(err){
                        if(!err){
                            //console.log("all ok data inserted");
                        }else{
                            console.log(err);
                            io.sockets.emit("send_free",{});
                        }
                    });
                }
                if(stack[elem].sec == 0){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_m` (`p_id`,`value`,`utc`) VALUES('+stack[elem].id+','+stack[elem].value+','+stack[elem].utc+')';
                    //console.log(tmpQ);
                    connection.query(tmpQ,function(err){
                        if(!err){
                            //console.log("all ok data inserted");
                        }else{
                            console.log(err);
                            io.sockets.emit("send_free",{});
                        }
                    });
                }
            }
            freener(stack[stack.length-1].id,tube);
            connection.release();
        }else{
            console.log("pool SQL error");
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
        console.log("1:"+res[0]+" 2:"+res[1]+" 3:"+res[2]+" 4:"+res[3]+" heap = "+process.memoryUsage().heapUsed);
        var nowdt = Date.now();
        FESender(res,nowdt);
        //DBWriter(res,nowdt);//temp
    }).fail(function(e){
        if(Global.schedullerTube){
            clearInterval(Global.schedullerTube);
        }
        socketServ.sockets.emit("mb_error",{});
    });
};
//console.log("hello world");
//socketServ.sockets.emit("all_ok",{"tube1":[Number(nowdt),Number(tube1)]});
//----------------------------------
function DBWriter(data,nowdt){
    var tmpQ = "";
    if(data!=undefined){
        if(data[0]!=undefined){
            tmpQ = "INSERT INTO `tube1_dump`(value,utc) VALUES("+data[0]+","+nowdt+")";
            Global.connection.query(tmpQ,function(err,data,row){
                //console.log(data);
                if(err){
                    console.log(err);
                    socketServ.sockets.emit("mysql_error",{});
                }
            });
        }
        if(data[1]!=undefined){
            tmpQ = "INSERT INTO `tube2_dump`(value,utc) VALUES("+data[1]+","+nowdt+")";
            Global.connection.query(tmpQ,function(err,data,row){
                //console.log(data);
                if(err){
                    console.log(err);
                    socketServ.sockets.emit("mysql_error",{});
                }
            });
        }
        if(data[2]!=undefined){
            tmpQ = "INSERT INTO `tube3_dump`(value,utc) VALUES("+data[2]+","+nowdt+")";
            Global.connection.query(tmpQ,function(err,data,row){
                //console.log(data);
                if(err){
                    console.log(err);
                    socketServ.sockets.emit("mysql_error",{});
                }
            });
        }
        if(data[3]!=undefined){
            tmpQ = "INSERT INTO `tube4_dump`(value,utc) VALUES("+data[3]+","+nowdt+")";
            Global.connection.query(tmpQ,function(err,data,row){
                //console.log(data);
                if(err){
                    console.log(err);
                    socketServ.sockets.emit("mysql_error",{});
                }
            });
        }
    }
};
function FESender(data,nowdt){
    //nowdt = Number(nowdt);
    socketServ.sockets.emit("all_ok",{
        "tube1":[nowdt,Number(data[0])],
        "tube2":[nowdt,Number(data[1])],
        "tube3":[nowdt,Number(data[2])],
        "tube4":[nowdt,Number(data[3])]
    });
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