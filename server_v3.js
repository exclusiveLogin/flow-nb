var Global = {};
Global.RTsecondLock = false;
Global.DBStacksecondLock = false;
Global.freeLock = false;

Global.poolReset = false;
Global.conReQueryLocal = false;
Global.conReQueryRT = false;
Global.conReQueryReplica = false;

Global.clients = [];
Global.FEclients = [];

//RETRANSLATE ----------------------------
const fork = require("child_process").fork;

let plc_worker = fork("plccollector.js");

plc_worker.on("message",function (msg) {
   //

   if(msg.msg){
       console.log("plc_collector msg:",msg.msg);
   }
   if(msg.plc_fe){
       //FESender(msg.val,msg.dt);
       console.log("plc_FE val:"+msg.val+"dt:"+msg.dt);
   }

});
plc_worker.on("disconnect",function () {
    console.log("plc_collector disconnected");

});
plc_worker.on("exit",function () {
    console.log("plc_collector exit");
});

//----------------UTILS-------------------
const util = require("util");

//----------------SERVER------------------
var socketServ = require('socket.io').listen(3000);
/*
socketServ.on("connection",function(socket){
    console.log("client Front End connected");
    //console.log(util.inspect(socket,{colors:true}));
    //console.log(util.inspect(socket.handshake.headers['x-forwarded-for'],{colors:true}));
    //Global.FEclients.push(socket.conn.remoteAddress.substr(7));
    Global.FEclients.push(socket.handshake.headers['x-forwarded-for']);
    console.log(util.inspect(Global.FEclients,{colors:true}));
    socketServ.emit("clients", Global.FEclients);
    
    
    
    socket.on("arjLoad",function(data){
        localP = false;
        localNB = false;
        trendP = [];
        trendNB = [];
        dumpflag = false;
        console.log("ARJ LOAD started",data);
        if(data.min && data.max && data.tube){//проверка целостности 
            var tube = data.tube;
            var interval = data.max - data.min;
            var query_p = "SELECT * FROM `p_tube"+tube+"_h` ORDER BY `utc`";
            var query_nb = "SELECT * FROM `tube"+tube+"_h` ORDER BY `utc`";
            console.log("ARJ LOAD interval:",interval);
            console.log("interval:"+interval);
            if(interval>4*3600*24*1000){//если накопленные данные больше 12 часов но меньше 48
                query_p = "SELECT * FROM `p_tube"+tube+"_h` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                query_nb = "SELECT * FROM `tube"+tube+"_h` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                dumpflag = 0;
            }else if(interval>3600*6*1000 && interval<4*3600*24*1000){
                query_p = "SELECT * FROM `p_tube"+tube+"_m` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                query_nb = "SELECT * FROM `tube"+tube+"_m` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                dumpflag = 1;
            }else{
                query_p = "SELECT * FROM `p_tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                query_nb = "SELECT * FROM `tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                dumpflag = 2;
            }
            if(data.trendall){
                query_p = "SELECT * FROM `p_tube"+tube+"_h` ORDER BY `utc`";
                query_nb = "SELECT * FROM `tube"+tube+"_h` ORDER BY `utc`";
                dumpflag = 0;
            }
            //Поправить нахер этот бред
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
                    checkPoolArj("arj");
                    if(data.trendall){
                        var minP = trendP[0].utc;
                        var minNB = trendNB[0].utc;
                        var maxP = trendP[trendP.length-1].utc;
                        var maxNB = trendNB[trendNB.length-1].utc;
                        if(minP > minNB){
                            data.min = minNB;
                        }else {
                            data.min = minP;
                        }
                        if(maxP > maxNB){
                            data.max = maxP;
                        }else {
                            data.max = maxNB;
                        }
                        console.log("minmax  min:",data.min,"max:",data.max);
                    }
                    //socketServ.sockets.emit("arj_load_res",{trendP:trendP, trendNB:trendNB,min:data.min,max:data.max,dumpflag:dumpflag});
                    socket.emit("arj_load_res",{trendP:trendP, trendNB:trendNB,min:data.min,max:data.max,dumpflag:dumpflag});
                    localNB = false;
                    localP = false;
                    console.log("Arj send trendP:",trendP.length," series trendNB:",trendNB.length," series");
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
                //socketServ.sockets.emit("min_max_res",result);
                socket.emit("min_max_res",result);
                localMax = false;
                localMax2 = false;
                localMin = false;
                localMin2 = false;
            }
        }
            
        
    });
    socket.on("disconnect",function(){
        console.log("client Front End DISCONNECTED");
        var index = Global.FEclients.indexOf(socket.handshake.headers['x-forwarded-for']);
        if(index!=-1){
            Global.FEclients.splice(index,1);
        }
        socketServ.emit("clients", Global.FEclients);
        console.log(util.inspect(Global.FEclients,{colors:true}));
    });
});
*/




/*

//-----------------SERVER TO PRICHAL----------------------
Global.disconQ = false;

//шлем нахер подключенного хомячка за то что слишком дохуя хочет от сервера
function forceDisconCl(socket){
    if(!Global.disconQ){
        Global.disconQ = true;
        socket.emit("discon");
        socket.disconnect();
        console.log("disconnect emited");
        //Global.disconQ = false;
    }
}

//слушаем порт от причального терминала
var io = require('socket.io').listen(3001);

io.on("connection",function(socket){
    Global.disconQ = false;
    regConSQLRemote();

    //дичье подключилось ...
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
    //шлем сокетом на front чтоб суки не мучали базу своими запросами
    socket.on("RTSend",function(data){
        inserterRT(data.tubes,data.time);
    });

    //скатертью дорожка блять
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
        if(cont.tube1){
            inserterDB(1,cont.tube1);
        }
        if(cont.tube2){
            inserterDB(2,cont.tube2);
        }
        if(cont.tube3){          
            inserterDB(3,cont.tube3);
        }
        if(cont.tube4){           
            inserterDB(4,cont.tube4);
        }
    });
});
//чистим после репликации
function freener(lid,tube){
    console.log("prepare to del id:"+lid+" on tube "+tube);
    io.sockets.emit("free",{"lid":lid,"tube":tube});
}

//ебашим в БД прямо из сокета
function inserterRT(tubes,time){
    //console.log("data rcv RT:"+util.inspect(tubes,{colors:true}));
    var tmpDate = new Date(time[0]);
    var tmpSeconds = tmpDate.getSeconds();
    var tmpMinutes = tmpDate.getMinutes();
    for(var elem in tubes){//перебор 4 труб
        var tmpTube = Number(elem)+1;
        //console.log("second:"+tmpSeconds+" locker:"+util.inspect(Global.RTsecondLock,{colors:true}));
        //console.log("id:"+elem+" tube:"+tmpTube+" value:"+tubes[elem]+" utc:"+time);
        if(Global.connectionRT){            
            tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_dump` (`value`,`utc`) VALUES('+tubes[elem]+','+time[elem]+')';
            Global.connectionRT.query(tmpQ,function(err){
                if(err){
                    console.log("error SQL insert RT:"+util.inspect(err,{colors:true}));
                    socketServ.sockets.emit("mysql_error",{});
                }else{
                    //console.log("Data RT saved in DB successuful");
                }
            });
         
            
            if(tmpSeconds==0 && tmpMinutes == 0 && !Global.RTsecondLock){//Пишем в часовой (одну запись!!!!)
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_h` (`value`,`utc`) VALUES('+tubes[elem]+','+time[elem]+')';
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
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tmpTube+'_m` (`value`,`utc`) VALUES('+tubes[elem]+','+time[elem]+')';
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
            regConSQLRemote();
        }
    }
    if(tmpSeconds == 0 && !Global.RTsecondLock){//снятие защиты на запись дублирующих секунд
        Global.RTsecondLock = true;
    }
    if(tmpSeconds!=0 && Global.RTsecondLock){//снятие защиты на запись дублирующих секунд
        Global.RTsecondLock = false;
    }
}

//ебашим из репликации в БД
function inserterDB(tube,stack){
    pool.getConnection(function(err,connection){
        if(!err){
            var tmp = 0;
            for(var elem in stack){
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_dump` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                connection.query(tmpQ,function(err){
                    tmp++;
                    if(!err){
                        if(tmp >= stack.length){
                            console.log("stack full writed tmp:"+tmp);
                            setTimeout(function () {
                                freener(stack[stack.length-1].utc,tube);
                            },1000);
                            connection.release();
                        }
                    }else{
                        console.log(err);
                        connection.release();
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
            if(stack[elem].sec == 0 && !Global.DBStacksecondLock){//установка защиты на запись дублирующих секунд
                    Global.DBStacksecondLock = true;
                }
            if(stack[elem].sec != 0 && Global.DBStacksecondLock){//снятие защиты на запись дублирующих секунд
                    Global.DBStacksecondLock = false;
                }
        }else{
            console.log("pool SQL error");
            checkPool("error SQL InserterDB");
        }
    });  
    
}

//!**************************MODBUS CLIENT *******************************************

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


//----------------------------------

function FESender(data,nowdt){
    //nowdt = Number(nowdt);
    socketServ.emit("all_ok",{
        "tube1":[nowdt[0],Number(data[0])],
        "tube2":[nowdt[1],Number(data[1])],
        "tube3":[nowdt[2],Number(data[2])],
        "tube4":[nowdt[3],Number(data[3])]
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
}



*/
