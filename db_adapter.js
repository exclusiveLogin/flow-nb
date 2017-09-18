var Global = {};
Global.sqlConLocalQuery = false;
Global.sqlConRemoteQuery = false;
Global.sqlResetQuery = false;
Global.sqlResetArjQuery = false;

const util = require("util");


//this is RT connection
Global.connection = false;
Global.connectionRT = false;

var mysql = require("mysql");

var pool;
function crPool(){
    if(pool)pool = null;
    pool = mysql.createPool({
        //waitForConnections:false,
        connectionLimit : 20,
        host     : 'localhost',
        user     : 'root',
        password : '123',
        database : 'flow_nb'
    });
}
function checkPool(str){
    if(pool){
        console.log(str+":");
        console.log("all con:"+util.inspect(pool._allConnections.length,{colors:true}));
        console.log("free con:"+util.inspect(pool._freeConnections.length,{colors:true}));
    }else{
        console.log("pool not defined");
    }
}
function checkPoolArj(str){
    if(poolArj){
        console.log(str+":");
        console.log("all con:"+util.inspect(poolArj._allConnections.length,{colors:true}));
        console.log("free con:"+util.inspect(poolArj._freeConnections.length,{colors:true}));
    }else{
        console.log("pool not defined");
    }
}

//--------------main function--------------------
function getCON(arj,rt) {
    var getConnectionDB = new Promise(function (resolve, reject) {
        function resetPool(){
            if(!Global.sqlResetQuery){
                Global.sqlResetQuery = true;
                if(pool){
                    console.log("pool established, reset success");
                    pool.end(function(err){
                        if(!err){
                            console.log("pool end without error");
                            crPool();
                            regConSQLLocal();
                            regConSQLRemote();
                        }else{
                            console.log("pool end with ERROR");
                            console.log("ERROR:"+util.inspect(err,{colors:true}));
                            pool = null;
                            crPool();
                            regConSQLLocal();
                            regConSQLRemote();
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
        function resetArjPool(){
            if(!Global.sqlResetArjQuery){
                Global.sqlResetArjQuery = true;
                if(poolArj){
                    console.log("pool Arj established, reset success");
                    poolArj.end(function(err){//delete pool
                        poolArj = null;
                        if(!err){
                            console.log("pool ARJ end without error");
                        }else{
                            console.log("pool ARJ end with ERROR");
                            console.log("ERROR:"+util.inspect(err,{colors:true}));
                        }
                        crPoolArj();
                        Global.sqlResetArjQuery = false;
                    });
                }else{
                    console.log("pool Arj not established, create new pool");
                    crPoolArj();
                    Global.sqlResetArjQuery = false;
                }
            }
        }
        function regConSQLLocal(){
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
                if(pool){
                    pool.getConnection(function(err, connection) {
                        if(err){
                            console.log("pool LOCAL register error");
                            resetPool();
                        }else{
                            console.log("Register SQL local success");
                            Global.connection = connection;
                            Global.sqlConLocalQuery = false;
                        }
                    });
                }else{
                    console.log("pool not established");
                    resetPool();
                }

            }
        }
        function regConSQLRemote(){
            if(!Global.sqlConRemoteQuery){
                Global.sqlConRemoteQuery = true;
                if(Global.connectionRT){
                    Global.connectionRT.release();
                    Global.connectionRT = null;
                }
                if(pool){
                    pool.getConnection(function(err, connection) {
                        if(err){
                            console.log("pool RT register error");
                            resetPool();
                        }else{
                            //socketServ.sockets.emit("all_ok",{});
                            console.log("Register SQL local success");
                            Global.connectionRT = connection;
                            Global.sqlConRemoteQuery = false;
                        }
                    });
                }else{
                    console.log("pool not established");
                    resetPool();
                }
            }
        }

        if(!pool)crPool();//Первичная инициация pool

        if(arj){

        }else {
            if(rt){
                regConSQLRemote();
            }else {
                regConSQLLocal();
            }
        }
    });
    return getConnectionDB;

}

