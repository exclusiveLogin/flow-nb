var Global = {};
Global.freeLock = false;
Global.clients = [];

Global.DbConInserter = undefined;
var mysql = require("mysql");

var pool  = mysql.createPool({
    connectionLimit : 5,
    host     : 'localhost',
    user     : 'root',
    password : '123',
    database : 'flow_nb'
});

var io = require('socket.io').listen(3001);

io.on("connection",function(socket){
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
    socket.on('disconnect',function(){
        var index = Global.clients.indexOf(socket);
        //console.log("bfd:"+Global.clients);
        if(index!=-1){
            Global.clients.splice(index,1);
        }
        //console.log("ad:"+Global.clients);
    });
    socket.on('free_free',function(){
        Global.freeLock = false;
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
function inserterDB(tube,stack){
    pool.getConnection(function(err,connection){
        if(!err){
            var tmp = 0;
            for(var elem in stack){
                console.log('row:'+elem+" id:"+stack[elem].id+" value:"+stack[elem].value+"time:"+stack[elem].datetime+" utc:"+stack[elem].utc);

                tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_dump` (`p_id`,`value`,`utc`) VALUES('+stack[elem].id+','+stack[elem].value+','+stack[elem].utc+')';
                //console.log(tmpQ);
                connection.query(tmpQ,function(err){
                    console.log("elem:"+elem+" from "+stack.length);
                    tmp++; 
                    console.log("tmp:"+tmp);
                    
                    if(!err){
                        if(tmp == stack.length){
                            console.log("yes elem:"+elem+" == "+stack.length);
                            io.sockets.emit("send_free",{});
                        }
                    }else{
                        console.log(err);
                    }
                });
                if(stack[elem].min == 0){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_h` (`p_id`,`value`,`utc`) VALUES('+stack[elem].id+','+stack[elem].value+','+stack[elem].utc+')';
                    //console.log(tmpQ);
                    connection.query(tmpQ,function(err){
                        if(!err){
                            //console.log("all ok data inserted");
                        }else{
                            console.log(err);
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
                        }
                    });
                }
            }
            if(!Global.freeLock){
                freener(stack[stack.length-1].id,tube);
                Global.freeLock = true;
            }
            connection.release();
        }else{
            console.log("pool SQL error");
        }
    });  
};