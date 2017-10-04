console.log("Я родился)) pid:",process.pid);
let Global = {};
Global.clients = [];
Global.FEclients = [];
var cluster = require('cluster'); // Only required if you want the worker id
let sticky = require('sticky-session');
let server = require("http").createServer();
let io = require('socket.io');
let fe = io.listen(server);

if(!sticky.listen(server,3000)){
    console.log("sticky master");
}else{
    console.log("sticky worker");
    fe.on("connection", function () {
        console.log("FE con");
    });
}

//канал с CORE
process.on("message",function (msg) {

});

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
