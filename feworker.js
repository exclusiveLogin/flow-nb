console.log("fe_worker pid:",process.pid);
let Global = {};
Global.clients = [];
Global.FEclients = [];
Global.feheap = [];

const util = require("util");
const db = require("./db_adapter");
const cluster = require('cluster'); // Only required if you want the worker id
const sticky = require('sticky-session');
const server = require("http").createServer();
const io = require('socket.io');
const socketServ = io.listen(server);

function DBQuery(connection,query) {
    if(connection && query){
        let pr = new Promise(function (resolve, reject) {
            connection.query(query,function(err,data){
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
        return pr;
    }
}

if(!sticky.listen(server,3000)){
    //Master SECTION
    console.log("sticky master запущен");
    process.on("message",function (msg) {//ретрансляция в fork
        if(msg){
            for(let worker in cluster.workers){
                cluster.workers[worker].process.send(msg);
            }
        }
    });
    //канал с форками
    cluster.on("message",function (worker,msg) {
        if(msg.heapworker){
            //console.log("hw:",msg,"worker:",worker.id);
            Global.feheap[worker.id] = msg.data;
            worker.process.send({"heap_refresh":true,"data":Global.feheap});
        }
    });
}else{
    //Slave SECTION
    console.log("sticky worker id:",cluster.worker.id);

    socketServ.on("connection",function(socket){
        console.log("client Front End connected");
        Global.FEclients.push(socket.handshake.headers['x-forwarded-for']);
        console.log(util.inspect(Global.FEclients,{colors:true}));
        socketServ.emit("clients", Global.FEclients);
        socket.on("arjLoad",function(data){
            let trendP = [];
            let trendNB = [];
            let dumpflag = false;
            console.log("ARJ LOAD started",data);
            if(data.min && data.max && data.tube){//проверка целостности
                var tube = data.tube;
                var interval = data.max - data.min;
                var query_p = "SELECT * FROM `p_tube"+tube+"_h` ORDER BY `utc`";
                var query_nb = "SELECT * FROM `tube"+tube+"_h` ORDER BY `utc`";
                if(interval>4*3600*24*1000){//если накопленные данные больше 4 суток
                    query_p = "SELECT * FROM `p_tube"+tube+"_h` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                    query_nb = "SELECT * FROM `tube"+tube+"_h` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                    dumpflag = 0;
                }else if(interval>3600*6*1000 && interval<4*3600*24*1000){//от суток до 4
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
                db.getFECON()
                    .then(function (connection) {
                        let tmp_p = DBQuery(connection,query_p).then(function (data) {
                            trendP = data;
                        });

                        let tmp_nb = DBQuery(connection,query_nb).then(function (data) {
                            trendNB = data;
                        });

                        Promise.all([tmp_nb, tmp_p])
                            .then(function () {
                                connection.release();
                                ret();
                            })
                            .catch(function () {
                                connection.release();
                                socketServ.emit("mysql_error",{});
                            });
                    })
                    .catch(function (err) {
                        console.log("error SQL pool err:",err);
                        socketServ.emit("mysql_error",{});
                    });

                function ret(){
                    console.log("check fe pool: ",util.inspect(db.checkPool("arj"),{"colors":true}));
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
                    socket.emit("arj_load_res",{trendP:trendP, trendNB:trendNB,min:data.min,max:data.max,dumpflag:dumpflag});
                    console.log("Arj send trendP:",trendP.length," series trendNB:",trendNB.length," series");
                }
            }

        });
        socket.on("flowcalc",function (data) {
            console.log("flowcalc server fired data:",util.inspect(data,{"colors":true}));
            let trendP = [];
            let trendNB = [];
            if(data.min && data.max && data.tube){//проверка целостности
                var tube = data.tube;
                let query_p = "SELECT * FROM `p_tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";
                let query_nb = "SELECT * FROM `tube"+tube+"_dump` WHERE `utc` BETWEEN "+data.min+" AND "+data.max+" ORDER BY `utc`";

                db.getFECON()
                    .then(function (connection) {
                        let tmp_p = DBQuery(connection,query_p).then(function (data) {
                            trendP = data;
                        });

                        let tmp_nb = DBQuery(connection,query_nb).then(function (data) {
                            trendNB = data;
                        });

                        Promise.all([tmp_nb, tmp_p])
                            .then(function () {
                                connection.release();
                                ret();
                            })
                            .catch(function () {
                                connection.release();
                                socketServ.emit("mysql_error",{});
                            });
                    })
                    .catch(function (err) {
                        console.log("error SQL pool err:",err);
                        socketServ.emit("mysql_error",{});
                    });

                function ret(){
                    console.log("flowcalc_data sended");
                    socket.emit("flowcalc_data",{trendP:trendP, trendNB:trendNB});
                }
            }
        });
        socket.on("min_max",function(data){
            let RcvMin,
                RcvMax,
                RcvMin2,
                RcvMax2;

            let result = {
                min:null,
                max:null,
                tube:0
            };
            console.log("min_max");

            //получаем коннект в базе FE ARJ труба 1
            db.getFECON().then(function (connection) {
                var query = "";
                query = "SELECT MIN(`utc`) AS `minimum` FROM `p_tube"+data.tube+"_dump`";
                let min1 = DBQuery(connection,query).then(function (data) {
                    if(data){
                        RcvMin = data[0].minimum;
                    }
                }).catch(function (err) {
                    return err;
                });

                query = "SELECT MAX(`utc`) AS `maximum` FROM `p_tube"+data.tube+"_dump`";
                let max1 = DBQuery(connection,query).then(function (data) {
                    if(data){
                        RcvMax = data[0].maximum;
                    }
                }).catch(function (err) {
                    return err;
                });

                query = "SELECT MIN(`utc`) AS `minimum` FROM `tube"+data.tube+"_dump`";
                let min2 = DBQuery(connection,query).then(function (data) {
                    if(data){
                        RcvMin2 = data[0].minimum;
                    }
                }).catch(function (err) {
                    return err;
                });

                query = "SELECT MAX(`utc`) AS `maximum` FROM `tube"+data.tube+"_dump`";
                let max2 = DBQuery(connection,query).then(function (data) {
                    if(data){
                        RcvMax2 = data[0].maximum;
                    }
                }).catch(function (err) {
                    return err;
                });

                Promise.all([min1,max1,min2,max2])
                    .then(function () {
                        //отчищаем коннектор
                        connection.release();

                        console.log("min1:"+RcvMin+" max1:"+RcvMax+" min2:"+RcvMin2+" max2:"+RcvMax2);

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
                        socket.emit("min_max_res",result);
                    })
                    .catch(function (err) {
                        console.log(err);
                        connection.release();
                })
            }).catch(function (err) {
                if(err){
                    console.log(err);
                }
            });
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


    //канал с Master
    cluster.worker.on("message",function (msg) {//ретрансляция на Front
        // IPC BUS
        //обновляем feheap
        if (msg.heap_refresh){
            Global.feheap = msg.data;
        }

        if (msg.heap && msg.data){
            //отправляем отчет о памяти Мастер
            cluster.worker.send({"heapworker":true,data:process.memoryUsage()});
            msg.data.feheap = Global.feheap;
            //console.log("feheap to FE...");
            socketServ.emit("heap",msg.data);
        }
        if (msg.all_ok && msg.data){
            socketServ.emit("all_ok",msg.data);
        }
        if(msg.mysql_error){
            socketServ.emit("mysql_error",msg.data);
        }
        if(msg.mb_error){
            socketServ.emit("mb_error",msg.data);
        }
    });
}