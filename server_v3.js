var Global = {};
Global.RTsecondLock = false;
Global.freeLock = false;

Global.poolReset = false;
Global.conReQueryLocal = false;
Global.conReQueryRT = false;
Global.conReQueryReplica = false;

Global.clients = [];
Global.FEclients = [];
Global.ReplicationWorkers = [];

//RETRANSLATE ----------------------------
const fork = require("child_process").fork;

let plc_worker;

plcWorkerCreator();


function plcWorkerCreator() {
    plc_worker = fork("plccollector.js");
    plc_worker.on("message",function (msg) {
        if(msg.msg){
            console.log("plc_collector msg:",msg.msg);
        }
        if(msg.plc_fe){
            //FESender(msg.val,msg.dt,msg.pool);
            console.log("plc_FE val:"+util.inspect(msg.val,{"colors":true})+"dt:"+util.inspect(msg.dt,{"colors":true}));
        }

    });
    plc_worker.on("disconnect",function () {
        console.log("plc_collector disconnected");

    });
    plc_worker.on("exit",function (code,signal) {
        console.log("plc_collector exit code:",code," signal:",signal);
    });
    plc_worker.on("error",function (err) {
        console.log("что то пошло не так ...перезапуск сервиса");
        plcWorkerCreator();
    });
}

//----------------UTILS-------------------
const util = require("util");

//----------------SERVER TO FRONTEND------------------
/*
const socketServ = require('socket.io').listen(3000);

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
const io = require('socket.io').listen(3001);

io.on("connection",function(socket){
    Global.disconQ = false;

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

    //получение данных с причала в режиме РТ
    socket.on("RTSend",function(data){
        //передаем данные РТ в коллектор
        plc_worker.send({
            "rtsend":true,
            "data":data
        });
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
    //запрос репликации
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
    socket.on("empty_tube",function (data) {
        //data.tube - пустая труба
        if(data.tube){
            //deferred query for worker kill self after complete data replication
            Global.ReplicationWorkers[data.tube].send({"umayexit":true});
        }
    });
});


//чистим после репликации
function freener(lid,tube){
    console.log("prepare to del id:"+lid+" on tube "+tube);
    io.sockets.emit("free",{"lid":lid,"tube":tube});
}

//replica to DB
function inserterDB(tube,stack){
    if(!Global.ReplicationWorkers[tube]){
        //если нет workera то создаем и передаем туда стек репликации
        Global.ReplicationWorkers[tube] = fork("service_replicator.js");
        Global.ReplicationWorkers[tube].on("message",function (msg) {
            //freener
            if(msg.freener && msg.lid && msg.tube){
                freener(msg.lid,msg.tube);
            }

        });
        //exit
        Global.ReplicationWorkers[tube].on("exit",function (arg) {
            console.log("service_repclicator exited this:",this," arg:",arg);
            delete Global.ReplicationWorkers[Global.ReplicationWorkers.indexOf(this)];
        });
    }
    Global.ReplicationWorkers[tube].send({"stack_replica":true,"tube":tube,"stack":stack});
}

//RT to FE
function FESender(data,nowdt,pool){
    //nowdt = Number(nowdt);
    socketServ.emit("all_ok",{
        "tube1":[nowdt[0],Number(data[0])],
        "tube2":[nowdt[1],Number(data[1])],
        "tube3":[nowdt[2],Number(data[2])],
        "tube4":[nowdt[3],Number(data[3])]
    });
    var heap = process.memoryUsage();
    if(pool){
        heap.sqlcon = pool.allCon;
        heap.sqlfree = pool.freeCon;
    }else{
        heap.sqlcon = 0;
        heap.sqlfree = 0;
    }

    socketServ.emit("heap",heap);
}




