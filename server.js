var Global = {};
Global.RTsecondLock = false;
Global.DBsecondLock = false;
Global.DBStacksecondLock = false;
Global.freeLock = false;

Global.poolReset = false;
Global.conReQueryLocal = false;
Global.conReQueryRT = false;
Global.conReQueryReplica = false;

Global.clients = [];
Global.FEclients = [];
//----------------UTILS-------------------
const util = require("util");

//----------------SERVER------------------
var socketServ = require('socket.io').listen(3000);

socketServ.on("connection",function(socket){
    console.log("client Front End connected");
    //console.log(util.inspect(socket,{colors:true}));
    
    Global.FEclients.push(socket.conn.remoteAddress.substr(7));
    console.log(util.inspect(Global.FEclients,{colors:true}));
    socketServ.emit("clients", Global.FEclients);
    
    
    
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
                    console.log("ArjLoad Pool Prichal OK");
                    connection.query(query_p, function(err,data){
                        if(err){
                            socketServ.emit("mysql_error",{});
                            console.log("ARJLOAD error SQL query P");
                        }else{
                            //console.log(util.inspect(data,{colors:true}));
                            connection.release();
                            localP = true;
                            trendP = data;
                            ret();
                        }
                    });
                }else{
                    socketServ.emit("mysql_error",{}); 
                    console.log("error SQL pool");
                    resetArjPool();
                }
            });
            pool.getConnection(function(err,connection){
                if(!err){
                    console.log("ArjLoad Pool NB OK");
                    connection.query(query_nb, function(err,data){
                        if(err){
                            socketServ.emit("mysql_error",{});
                            console.log("ARJLOAD error SQL query NB");
                        }else{
                            //console.log(util.inspect(data,{colors:true}));
                            connection.release();
                            localNB = true;
                            trendNB = data;
                            ret();
                        }
                    });
                }else{
                    socketServ.emit("mysql_error",{}); 
                    console.log("error SQL pool");
                    resetArjPool();
                }
            });
                
            function ret(){
                if(localNB && localP){
                    //connection.release();
                    //console.log("ArjLoad connection released");
                    checkPoolArj("arj");
                    socketServ.sockets.emit("arj_load_res",{trendP:trendP, trendNB:trendNB,min:data.min,max:data.max});
                    localNB = false;
                    localP = false;
                    trendP = null;
                    trendNB = null;
                }
            }
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
        poolArj.getConnection(function(err,connection){
            if(err){
                console.error("error create Arj con");
                console.log(err);
                resetArjPool();
            }else{
                //--------------------------------1-----------------------------------------
                var query = "SELECT MIN(`utc`) AS `minimum` FROM `p_tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        connection.release();
                        console.log(util.inspect(data,{colors:true}));
                        RcvMin = data[0].minimum;
                        localMin = true;
                        ret();
                    }
                });
            }
        });
        
        poolArj.getConnection(function(err,connection){
            if(err){
                console.error("error create Arj con");
                console.log(err);
                resetArjPool();
            }else{
                //-------------------------------2-----------------------------------------
                var query = "SELECT MAX(`utc`) AS `maximum` FROM `p_tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        connection.release();
                        console.log(util.inspect(data,{colors:true}));
                        RcvMax = data[0].maximum;
                        localMax = true;
                        ret();
                    }
                });
            }
        });
        
        poolArj.getConnection(function(err,connection){
            if(err){
                console.error("error create Arj con");
                console.log(err);
                resetArjPool();
            }else{
                //--------------------------------3-----------------------------------------
                var query = "SELECT MIN(`utc`) AS `minimum` FROM `tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        connection.release();
                        console.log(util.inspect(data,{colors:true}));
                        RcvMin2 = data[0].minimum;
                        localMin2 = true;
                        ret();
                    }
                });
            }
        });
        
        poolArj.getConnection(function(err,connection){
            if(err){
                console.error("error create Arj con");
                console.log(err);
                resetArjPool();
            }else{
                //--------------------------------4-----------------------------------------
                var query = "SELECT MAX(`utc`) AS `maximum` FROM `tube"+data.tube+"_dump`";
                connection.query(query,function(err,data,row){
                    if(err){
                        socketServ.sockets.emit("mysql_error",{});
                        console.log("error SQL pool");
                    }else{
                        connection.release();
                        console.log(util.inspect(data,{colors:true}));
                        RcvMax2 = data[0].maximum;
                        localMax2 = true;
                        ret();
                    }
                });
            }
        });
        
        function ret(){
            if(localMax && localMin && localMax2 && localMin2){
                //connection.release();
                //console.log("MinMax connection released");
                checkPoolArj();

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
                
                if(RcvMin <= RcvMin2){
                    result.min = RcvMin;
                }else{
                    result.min = RcvMin2;
                }
                result.tube = data.tube;
                console.log(util.inspect(result,{colors:true}));
                //сюда пишем вывод значений для тренда
                socketServ.sockets.emit("min_max_res",result);
                localMax = false;
                localMax2 = false;
                localMin = false;
                localMin2 = false;
            }
        }
            
        
    });
    socket.on("disconnect",function(){
        console.log("client Front End DISCONNECTED");
        var index = Global.FEclients.indexOf(socket.conn.remoteAddress.substr(7));
        if(index!=-1){
            Global.FEclients.splice(index,1);
        }
        socketServ.emit("clients", Global.FEclients);
        console.log(util.inspect(Global.FEclients,{colors:true}));
    });
});

//----------------MYSQL------------------
var mysql = require("mysql");

var pool;
function crPool(){
    pool = mysql.createPool({
        waitForConnections:false,
        connectionLimit : 20,
        host     : 'localhost',
        user     : 'root',
        password : '123',
        database : 'flow_nb'
    }); 
}
crPool();//Первичная инициация pool

var poolArj;
function crPoolArj(){
    poolArj = mysql.createPool({
        waitForConnections:false,
        connectionLimit : 20,
        host     : 'localhost',
        user     : 'root',
        password : '123',
        database : 'flow_nb'
    }); 
}
crPool();//Первичная инициация pool
crPoolArj();//Первичная инициация pool

function checkArjCon(callback){
    if(Global.ArjConnection){
        if(callback){
            callback();
        }
    }else{
        poolArj.getConnection(function(err,connection){
            if(err){
                console.log("ARJ con not created");
            }else{
                Global.ArjConnection = connection;
                if(callback){
                    callback();
                }
            }
        });
    }
}



Global.sqlConRemoteQuery = false;
Global.sqlConLocalQuery = false;
Global.sqlResetQuery = false;
Global.sqlResetArjQuery = false;

var resetPool = function(){
    if(!Global.sqlResetQuery){
        Global.sqlResetQuery = true;
        if(pool){
            console.log("pool established, reset success");
            pool.end(function(err){//delete pool
                pool = null;
                if(!err){
                    console.log("pool end without error");
                    crPool();
                    regConSQLLocal();
                    regConSQLRemote();
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
            regConSQLRemote();
            Global.sqlResetQuery = false; 
        }
    }
}
var resetArjPool = function(){
    if(!Global.sqlResetArjQuery){
        Global.sqlResetArjQuery = true;
        if(poolArj){
            console.log("pool Arj established, reset success");
            poolArj.end(function(err){//delete pool
                poolArj = null;
                if(!err){
                    console.log("pool ARJ end without error");
                    crPoolArj();
                }else{
                    console.log("pool ARJ end with ERROR");
                    console.log("ERROR:"+util.inspect(err,{colors:true}));
                }
                Global.sqlResetArjQuery = false;
            });
        }else{
            console.log("pool Arj not established, create new pool");
            crPoolArj();
            Global.sqlResetArjQuery = false; 
        }
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
};
        
var checkPoolArj = function(str){
    if(poolArj){
        console.log(str+":");
        console.log("all con:"+util.inspect(poolArj._allConnections.length,{colors:true}));
        console.log("free con:"+util.inspect(poolArj._freeConnections.length,{colors:true}));
    }else{
        console.log("pool not defined");
    }
};


var regConSQLRemote = function(){
    if(!Global.sqlConRemoteQuery){
        Global.sqlConRemoteQuery = true;
        if(Global.connectionRT){
            Global.connectionRT.release();
            Global.connectionRT = null;
        }
        pool.getConnection(function(err, connection) {
            if(err){
                console.log("pool RT register error");
                resetPool();
            }else{
                socketServ.sockets.emit("all_ok",{});
                console.log("Register SQL local success");
                Global.connectionRT = connection;
                Global.sqlConRemoteQuery = false;
            }    
        });
    }
};
var regConSQLLocal = function(){
    if(!Global.sqlConLocalQuery){
        Global.sqlConLocalQuery = true;
        if(Global.connection){
            Global.connection.release();
            Global.connection = null;
        }
        if(Global.schedullerTube){
                clearInterval(Global.schedullerTube);
                console.log("interval clear reset");
        }
        pool.getConnection(function(err, connection) {
            if(err){
                console.log("pool LOCAL register error");
                resetPool();
            }else{
                socketServ.sockets.emit("all_ok",{});
                console.log("Register SQL local success");
                Global.connection = connection;
                Global.schedullerTube = setInterval(rcvTubes,1000);
                Global.sqlConLocalQuery = false;
            }    
        });
    }
};
var sqlCloseRemote = function(){
    if(Global.connectionRT){
        Global.connectionRT.release();
        Global.connectionRT = null;
    }
};
var sqlCloseLocal = function(){
    if(Global.connection){
        Global.connection.release();
        Global.connection = null;
    }
    if(Global.schedullerTube){
        clearInterval(Global.schedullerTube);
        console.log("interval clear reset");
    }
};
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
    regConSQLLocal();
});

client.on('error', function (err) {
    socketServ.sockets.emit("mb_error",{});
    console.log("ERROR MODBUS");
    sqlCloseLocal();
});
//-----------------SERVER TO PRICHAL----------------------
Global.disconQ = false;


function forceDisconCl(socket){
    if(!Global.disconQ){
        Global.disconQ = true;
        socket.emit("discon");
        socket.disconnect();
        console.log("disconnect emited");
        //Global.disconQ = false;
    }
}


var io = require('socket.io').listen(3001);

io.on("connection",function(socket){
    Global.disconQ = false;
    regConSQLRemote();
    
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
        forceDisconCl(socket);
        sqlCloseRemote();
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
                        console.log("Data RT Hourly saved in DB successuful");
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
                        console.log("Data RT Minutly saved in DB successuful on tube"+tmpTube);
                    }
                });
            }
        }else{
            console.log("error SQL connection RT not found");
            checkPool("error SQL inserter RT");
            regConSQLRemote();
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
                if(stack[elem].min == 0 && stack[elem].sec == 0 && !Global.DBStacksecondLock){
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
                if(stack[elem].sec == 0 && !Global.DBStacksecondLock){
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
            }
            if(stack[elem].sec == 0 && !Global.DBStacksecondLock){//снятие защиты на запись дублирующих секунд
                    Global.DBStacksecondLock = true;
                }
            if(stack[elem].sec != 0 && Global.DBStacksecondLock){//снятие защиты на запись дублирующих секунд
                    Global.DBStacksecondLock = false;
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
        console.log("1:"+res[0]+" 2:"+res[1]+" 3:"+res[2]+" 4:"+res[3]+" heap = "+process.memoryUsage().heapUsed);

        var nowdt = Date.now();
        FESender(res,nowdt);//отдаем клиенту  
        DBWriter(res,nowdt);//пишем в БД
        
    }).fail(function(e){
        console.log("MB fail");
        socketServ.emit("mb_error",{});
    });
};
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
            //console.log("second:"+tmpSeconds+" locker:"+util.inspect(Global.DBsecondLock,{colors:true}));
            //console.log("id:"+elem+" tube:"+tmpTube+" value:"+tubes[elem]+" utc:"+time);


            if(Global.connection){
                tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+data[elem]+','+nowdt+')';

                Global.connection.query(tmpQ,function(err){
                    if(err){
                        console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                        socketServ.sockets.emit("mysql_error",{});
                        regConSQLLocal();
                    }else{
                        //console.log("Data RT saved in DB successuful");
                    }
                });

                if(tmpSeconds==0 && tmpMinutes == 0 && !Global.DBsecondLock){//Пишем в часовой (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+data[elem]+','+nowdt+')';
                    Global.connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert Local:"+util.inspect(err,{colors:true}));
                            socketServ.sockets.emit("mysql_error",{});
                        }else{
                            console.log("Data Local Hourly saved in DB successuful");
                        }
                    });
                }
                if(tmpSeconds==0 && !Global.DBsecondLock){//Пишем в минутный (одну запись!!!!)
                    tmpQ = 'INSERT IGNORE INTO `tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+data[elem]+','+nowdt+')';
                    //console.log("Data RT Minutly saved in DB successuful on tube PLANNED"+tmpTube);
                    Global.connection.query(tmpQ,function(err){
                        if(err){
                            console.log("error SQL insert Local:"+util.inspect(err,{colors:true}));
                            socketServ.sockets.emit("mysql_error",{});
                        }else{
                            console.log("Data Local Minutly saved in DB successuful");
                        }
                    });
                }
                
            }else{
                console.log("error SQL connection LOCAL not found");
                checkPool("error SQL DBWriter")
                //создаем новый коннект
                regConSQLLocal();
            }
        }
        if(tmpSeconds == 0 && !Global.DBsecondLock){//снятие защиты на запись дублирующих секунд
            Global.DBsecondLock = true;
        }
        if(tmpSeconds!=0 && Global.DBsecondLock){//снятие защиты на запись дублирующих секунд
            Global.DBsecondLock = false;
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