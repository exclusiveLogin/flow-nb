
var sqlConLocalQuery = false;
var sqlConRemoteQuery = false;
var sqlResetQuery = false;

const util = require("util");


//this is RT connection
var SQLconnection = false;
var SQLconnectionRT = false;

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
function getCON(arj,rt,force) {
    var lockLoop = false;
    //нужно вернуть промис с connection для операций с БД
    var getConnectionDB = new Promise(function (resolve, reject) {
        function resetPool(){
            if(!lockLoop){
                lockLoop = true;
                SQLconnection = null;
                SQLconnectionRT = null;
                if(pool){
                    console.log("pool established, reset success");
                    pool.end(function(err){
                        if(err){
                            console.log("ERROR:"+util.inspect(err,{colors:true}));
                        }
                        reconnectSQL();
                    });
                }else{
                    console.log("pool not established, create new pool");
                    reconnectSQL();
                }
                function reconnectSQL() {
                    crPool();
                    if(arj){
                        regConSQLArj();
                    }else {
                        if(rt){
                            regConSQLRemote();
                        }else {
                            regConSQLLocal();
                        }
                    }
                }
            }else {
                reject();
            }
        }
        function regConSQLLocal(){
            if(SQLconnection){
                SQLconnection.release();
                SQLconnection = null;
            }
            if(pool){
                pool.getConnection(function(err, connection) {
                    if(err){
                        console.log("pool LOCAL register error");
                        resetPool();
                    }else{
                        console.log("Register SQL local success");
                        SQLconnection = connection;
                        resolve(connection);
                    }
                });
            }else{
                console.log("pool not established");
                resetPool();
            }
        }
        function regConSQLRemote(){
            if(SQLconnectionRT){
                SQLconnectionRT.release();
                SQLconnectionRT = null;
            }
            if(pool){
                pool.getConnection(function(err, connection) {
                    if(err){
                        console.log("pool RT register error");
                        resetPool();
                    }else{
                        console.log("Register SQL local success");
                        SQLconnectionRT = connection;
                        resolve(connection);
                    }
                });
            }else{
                console.log("pool not established");
                resetPool();
            }
        }
        function regConSQLArj(){
            if(pool){
                pool.getConnection(function(err, connection) {
                    if(err){
                        console.log("pool Arj register error");
                        resetPool();
                    }else{
                        console.log("Register SQL Arj success");
                        resolve(connection);
                    }
                });
            }else{
                console.log("pool not established");
                resetPool();
            }
        }

        if(!pool)crPool();//Первичная инициация pool

        if(arj){
            regConSQLArj();
        }else {
            if(rt){
                if(SQLconnectionRT && !force){
                    resolve(SQLconnectionRT);
                }else {
                    regConSQLRemote();
                }
            }else {
                if(SQLconnection && !force){
                    resolve(SQLconnection);
                }else {
                    regConSQLLocal();
                }
            }
        }
    });
    return getConnectionDB;

}

