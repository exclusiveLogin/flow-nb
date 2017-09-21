//-----------------Private Section-------------------

const util = require("util");
const mysql = require("mysql");

//this is connections
var SQLconnection = false;
var SQLconnectionRT = false;

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
var tmpPromiseRT = false;
var tmpPromiseLocal = false;


//--------------main functions export--------------------
module.exports = {
    "getCON":function getCON(arj,rt,force) {
        function getPromise(){
            var getConnectionDB = new Promise(function (resolve, reject) {
                var lockLoop = false;
                function resetPool(){
                    if(!lockLoop){
                        //если сюда попали значит уже не смогли получить от пула коннект
                        //нечего делать ...сбрасываем пул и все остальное , пересобираем. на все одна попытка

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
                        reject("Фатальная ошибка SQL pool");
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
                            console.log("отдаем сразу RT");
                            console.log("all con:"+util.inspect(pool._allConnections.length,{colors:true})+
                                "free con:"+util.inspect(pool._freeConnections.length,{colors:true}));
                            resolve(SQLconnectionRT);
                        }else {
                            regConSQLRemote();
                        }
                    }else {
                        if(SQLconnection && !force){
                            console.log("отдаем сразу LOCAL");
                            console.log("all con:"+util.inspect(pool._allConnections.length,{colors:true})+
                                "free con:"+util.inspect(pool._freeConnections.length,{colors:true}));
                            resolve(SQLconnection);
                        }else {
                            regConSQLLocal();
                        }
                    }
                }
            });
            return getConnectionDB;
        }
        //нужно вернуть промис с connection для операций с БД
        if(!arj){//если не архивный
            if(rt){//если нужен для записи данных причала
                if(tmpPromiseRT){
                    console.log("return exist Promise RT");
                    return tmpPromiseRT;
                }else {
                    console.log("get Promise RT");
                    let connection = getPromise();
                    connection.then(function () {
                        console.log("tmpPromiseRT завершен");
                        tmpPromiseRT = null;
                    },function () {
                        console.log("tmpPromiseRT завершен");
                        tmpPromiseRT = null;
                    });
                    tmpPromiseRT = connection;
                    return connection;
                }
            }else {//если нужен для записи данных НБ
                if(tmpPromiseLocal){
                    console.log("return exist Promise LOCAL");
                    return tmpPromiseLocal;
                }else {
                    console.log("get Promise Local");
                    let connection = getPromise();
                    connection.then(function () {
                        console.log("tmpPromiseLocal завершен");
                        tmpPromiseLocal = null;
                    },function () {
                        console.log("tmpPromiseLocal завершен");
                        tmpPromiseLocal = null;
                    });
                    tmpPromiseLocal = connection;

                    return connection;
                }
            }
        }else {
            console.log("get Promise ARJ");
            return getPromise();
        }
    },
    "sqlCloseLocal":function sqlCloseLocal(){
        if(SQLconnection){
            SQLconnection.release();
            SQLconnection = null;
        }
    },
    "sqlCloseRemote":function sqlCloseRemote(){
        if(SQLconnectionRT){
            SQLconnectionRT.release();
            SQLconnectionRT = null;
        }
    },
    "checkPool":function(str){
        if(pool){
            console.log(str+":");
            console.log("all con:"+util.inspect(pool._allConnections.length,{colors:true}));
            console.log("free con:"+util.inspect(pool._freeConnections.length,{colors:true}));
        }else{
            console.log("pool not defined");
        }
    }
};