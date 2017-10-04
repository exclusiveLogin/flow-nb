var Global = {};
Global.RTsecondLock = false;
Global.freeLock = false;

Global.poolReset = false;
Global.conReQueryLocal = false;
Global.conReQueryRT = false;
Global.conReQueryReplica = false;

Global.clients = [];
Global.FEclients = [];
Global.ReplicationWorkers = []; //репликаторы
Global.FEWorkers = []; // клиентские workers

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


//создаем несколько процессов для работы с socket io front end
let os = require("os");

let numOfFEWorkers = os.cpus().length;
console.log("CPU number:",util.inspect(numOfFEWorkers,{"colors":true}));

//for(var i=0;i<1;i++){
    let fe_worker = fork("feworker.js");
    fe_worker.on("message",function (msg) {
        if(msg.msg){
            console.log("fe_collector msg:",msg.msg);
        }
    });
    fe_worker.on("disconnect",function () {
        console.log("fe_collector disconnected");

    });
    fe_worker.on("exit",function (code,signal) {
        console.log("fe_collector exit with code:",code," and signal:",signal);
    });
    fe_worker.on("error",function (err) {
        console.log("feworker что то пошло не так err:",util.inspect(err,{"colors":true}));
    });
    //Global.FEWorkers[i] = fe_worker;
//}

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
            if(Global.ReplicationWorkers[data.tube]){
                console.log("port send empty DB on tube",data.tube);
                Global.ReplicationWorkers[data.tube].send({"umayexit":true});
            }

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
        Global.ReplicationWorkers[tube]["mytubeID"]=tube;
        Global.ReplicationWorkers[tube].on("message",function (msg) {
            //freener
            if(msg.freener && msg.lid && msg.tube){
                freener(msg.lid,msg.tube);
            }

        });
        //exit
        Global.ReplicationWorkers[tube].on("exit",function () {
            console.log("service_repclicator exited this:",this);
            delete Global.ReplicationWorkers[Global.ReplicationWorkers.indexOf(this)];
            console.log("TEST:",Global.ReplicationWorkers);
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




