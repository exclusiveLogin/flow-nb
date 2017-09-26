let  Global = {};
Global.DBStacksecondLock = false;
Global.busy = true;
//DB
const db_adapter = require("./db_adapter.js");
const util = require("util");


//events form master process
process.on("message",function (msg) {
    if(msg.stack_replica){//если команда на репликацию
        console.log("получен стек для трубы:",msg.tube);
        let tube = msg.tube;
        let stack = msg.stack;

        db_adapter.getCON(true).then(function (connection) {//получаем коннект к БД
            let queryPromises = [];
        
            stack.map(function (el, elem) {//пробегаемся по массиву стека для репликации
                //добавляем к стеку промисов новое задание
                queryPromises.push(new Promise(function (queryDone, reject) {
                    let tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_dump` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                    connection.query(tmpQ,function(err){
                        if(err){
                            console.log(err);
                            reject(err);
                        }else{
                            if(!Global.DBStacksecondLock && (stack[elem].min == 0 || stack[elem].sec == 0)){

                            }else {
                                if(elem==0){
                                    console.log("отработал первый промис трубы:",msg.tube);
                                }
                                queryDone();
                            }
                        }
                    });
                    if(stack[elem].min == 0 && stack[elem].sec == 0 && !Global.DBStacksecondLock){
                        tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_h` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                        connection.query(tmpQ,function(err){
                            if(err){
                                console.log(err);
                            }else {
                                queryDone();
                            }
                        });
                    }
                    if(stack[elem].sec == 0 && !Global.DBStacksecondLock){
                        tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_m` (`value`,`utc`) VALUES('+stack[elem].value+','+stack[elem].utc+')';
                        connection.query(tmpQ,function(err){
                            if(err){
                                console.log(err);
                            }else {
                                queryDone();
                            }
                        });
                    }

                    if(stack[elem].sec == 0 && !Global.DBStacksecondLock){//установка защиты на запись дублирующих секунд
                        Global.DBStacksecondLock = true;
                    }
                    if(stack[elem].sec != 0 && Global.DBStacksecondLock){//снятие защиты на запись дублирующих секунд
                        Global.DBStacksecondLock = false;
                    }
                }));
            },this);
            
            promiseSpliter(100);            
            
            //declarating splitter function
            function promiseSpliter(partian){
                let part = partian || 50;
                
                if(queryPromises.length){
                    //if(tube == 1)console.log(util.inspect(queryPromises,{"colors":true}));
                    Promise.all(queryPromises.splice(0,part)).then(function () {
                        console.log("завершены промисы для трубы:",msg.tube);

                        //start self recursively after success
                        if(queryPromises.length){
                            promiseSpliter();
                        }else{
                            console.log("all promises is completely");
                            
                            // завершена очередь для нашей трубы
                            // чистим с задержкой коннектор и отправляем фринеру команду
                            /*setTimeout(function () {
                                connection.release();
                                process.send({"freener":true,"lid":stack[stack.length-1].utc,"tube":tube});
                                Global.busy = false;
                            },1000);*/
                        }
                    },function (err) {
                        console.log("Replication stack ERROR:",err);
                        Global.busy = false;
                    });
                }
            } 
        },function (err) {
            console.log("Replicator pool error:",err," on tube ",msg.tube);
        });
    }
    if(msg.umayexit){
        setInterval(function () {
            if(!Global.busy)process.exit(0);
        },5000);
    }
});


