var Global = {};
Global.clients = [];
Global.LID = {
    tube1:0,
    tube2:0,
    tube3:0,
    tube4:0,
};
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
    socket.on("replica",function(cont){
        
        if(cont.tube1){
            for(var elem in cont.tube1){
                inserterDB(1,cont.tube1[elem]);
                console.log('row:'+elem+" id:"+cont.tube1[elem].id+" value:"+cont.tube1[elem].value+" time:"+cont.tube1[elem].datetime+" utc:"+cont.tube1[elem].utc);
                Global.LID.tube1 = cont.tube1[elem].id;
            }
            freener(Global.LID.tube1,1);
        }
        if(cont.tube2){
            for(var elem in cont.tube2){
                inserterDB(2,cont.tube2[elem]);
                console.log('row:'+elem+" id:"+cont.tube2[elem].id+" value:"+cont.tube2[elem].value+" time:"+cont.tube2[elem].datetime+" utc:"+cont.tube2[elem].utc);
                Global.LID.tube2 = cont.tube2[elem].id;
            }
            freener(Global.LID.tube2,2);
        }
        if(cont.tube3){
            for(var elem in cont.tube3){
                inserterDB(3,cont.tube3[elem]);
                console.log('row:'+elem+" id:"+cont.tube3[elem].id+" value:"+cont.tube3[elem].value+" time:"+cont.tube3[elem].datetime+" utc:"+cont.tube3[elem].utc);
                Global.LID.tube3 = cont.tube3[elem].id;
            }
            freener(Global.LID.tube3,3);
        }
        if(cont.tube4){
            for(var elem in cont.tube4){
                inserterDB(4,cont.tube4[elem]);
                console.log('row:'+elem+" id:"+cont.tube4[elem].id+" value:"+cont.tube4[elem].value+" time:"+cont.tube4[elem].datetime+" utc:"+cont.tube4[elem].utc);
                Global.LID.tube4 = cont.tube4[elem].id;
            }
            freener(Global.LID.tube4,4);
        }
    });
});

function freener(lid,tube){
    console.log("prepare to del id:"+lid+" on tube "+tube);
    debugger;
    io.sockets.emit("free",{"lid":lid,"tube":tube});
};
function inserterDB(tube,str){
    pool.getConnection(function(err,connection){
            if(!err){
                tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_dump` (`p_id`,`value`,`utc`) VALUES('+str.id+','+str.value+','+str.utc+')';
                connection.query(tmpQ,function(err){
                    if(!err){
                        console.log("all ok data inserted");
                    }else{
                        console.log(err);
                    }
                });
                if(str.min == 0){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_h` (`p_id`,`value`,`utc`) VALUES('+str.id+','+str.value+','+str.utc+')';
                    connection.query(tmpQ,function(err){
                        if(!err){
                            console.log("all ok data inserted");
                        }else{
                            console.log(err);
                        }
                    });
                }
                if(str.sec == 0){
                    tmpQ = 'INSERT IGNORE INTO `p_tube'+tube+'_m` (`p_id`,`value`,`utc`) VALUES('+str.id+','+str.value+','+str.utc+')';
                    connection.query(tmpQ,function(err){
                        if(!err){
                            console.log("all ok data inserted");
                        }else{
                            console.log(err);
                        }
                    });
                }
                connection.release();
            }else{
                console.log("pool SQL error");
            } 
        });
        
   
    
    
};