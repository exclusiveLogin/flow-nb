
Global.socketToLH = undefined;
Global.RTToggle = false;
Global.NB_Con = false;
Global.P_Con = false;

Global.tube1T = true;
Global.tube2T = true;
Global.tube3T = true;
Global.tube4T = true;

Global.statusNB = 0;
Global.statusP = 0;

$(document).ready(function(){
    $('#status_node_nb').html('<h2 class="label label-lg label-warning">Попытка установить связь</h2>');
    $('#status_node_p').html('<h2 class="label label-lg label-warning">Попытка установить связь</h2>');
    Global.socketToNB = io('http://10.210.30.211:3000');
    Global.socketToP = io('http://10.210.30.210:3000');

    //-----------------CON OK-------------------------------
    Global.socketToNB.on("connect", function(){
        var tmpstatus = 1;
        if(Global.statusNB != tmpstatus){
            $('#status_node_nb').html('<h2 class="label label-lg label-success">Связь с узлом установлена</h2>');
            Global.statusNB = 1;
        }
        Global.NB_Con = true;
    });
    Global.socketToP.on("connect", function(){
        var tmpstatus = 1;
        if(Global.statusP != tmpstatus){
            $('#status_node_p').html('<h2 class="label label-lg label-success">Связь с узлом установлена</h2>');
            Global.statusP = 1;
        }
        Global.P_Con = true;
    });
    
    
    Global.socketToNB.on("connect_error", function(){
        var tmpstatus = -1;
        if(Global.statusNB != tmpstatus){
            $('#status_node_nb').html('<h2 class="label label-lg label-danger">Ошибка связи с узлом</h2>');
            Global.statusNB = -1;
        }
        Global.NB_Con = false;
        
    });
    Global.socketToP.on("connect_error", function(){
        var tmpstatus = -1;
        if(Global.statusP != tmpstatus){
            $('#status_node_p').html('<h2 class="label label-lg label-danger">Ошибка связи с узлом</h2>');
            Global.statusP = -1;
        }
        Global.P_Con = false;
    });
    
    
    Global.socketToNB.on("mb_error", function(){
        var tmpstatus = -2;
        if(Global.statusNB != tmpstatus){
            $('#status_node_nb').html('<h2 class="label label-lg label-danger">Ошибка Modbus протокола</h2>');
            Global.statusNB = -2;
        }
    });
    Global.socketToP.on("mb_error", function(){
        var tmpstatus = -2;
        if(Global.statusP != tmpstatus){
            $('#status_node_p').html('<h2 class="label label-lg label-danger">Ошибка Modbus протокола</h2>');
            Global.statusP = -2;
        }
    });
    Global.socketToNB.on("mb_ok", function(){
        var tmpstatus = 2;
        if(Global.statusNB != tmpstatus){
            $('#status_node_nb').html('<h2 class="label label-lg label-danger">Связь c PLC установлена</h2>');
            Global.statusNB = 2;
        }
    });
    Global.socketToP.on("mb_ok", function(){
        var tmpstatus = 2;
        if(Global.statusP != tmpstatus){
            $('#status_node_p').html('<h2 class="label label-lg label-danger">Связь c PLC установлена</h2>');
            Global.statusP = 2;  
        }
    });
    Global.socketToNB.on("mqsql_error", function(){
        var tmpstatus = -3;
        if(Global.statusNB != tmpstatus){
            $('#status_node_nb').html('<h2 class="label label-lg label-danger">Ошибка Базы Данных</h2>');
            Global.statusNB = -3;
        }
    });
    Global.socketToP.on("mqsql_error", function(){
        var tmpstatus = -3;
        if(Global.statusP != tmpstatus){
            $('#status_node_p').html('<h2 class="label label-lg label-danger">Ошибка Базы Данных</h2>');
            Global.statusP = -3;
        }
    });
    Global.socketToNB.on("clients", function(clients){
        console.log(clients);
        //$('#clients_list').html('');
        $('.client_item').each(function(index, elem){
            $(this).removeClass("label-success").addClass("label-danger");
            /*
            $(elem).delay(index*500).addClass("transparent").delay(500).fadeOut(100,function(){
               $(this).remove(); 
            });*/
            //$(elem).delay(Number(index)*500).addClass("transparent");
            
            
            setTimeout(function(){
                $(elem).addClass("transparent").delay(1000).fadeOut(100,function(){
                   $(this).remove(); 
                });
            },Number(index)*100);
        });

        for(var ip in clients){
            setTimeout(function(){
                $('#clients_list').append('<h2 class="label label-lg label-success client_item">'+clients[ip]+'</h2>');
            },ip*100);
        }
        Global.clients = clients;
        if(Global.clients){
            setTimeout(function(){
                $('#clients_list').html('');
                for(var ip in clients){
                    $('#clients_list').append('<h2 class="label label-lg label-success client_item">'+clients[ip]+'</h2>');
                }
            },5000);
        }
    });
    //----------------DATA-----------------------------
    Global.socketToNB.on("all_ok", function(data){
        var tmpstatus = 4;
        if(Global.statusNB != tmpstatus){
            $('#status_node_nb').html('<h2 class="label label-lg label-success">Система работает</h2>');
            Global.statusNB = 4;
        }
        
        if(data && Global.RTToggle){
            /*if(Global.IntRTT){//Дельта-сигма RT
                data.tube1[1] = Global.RTI1.Integrity(data.tube1[1]);
                data.tube2[1] = Global.RTI2.Integrity(data.tube2[1]);
                data.tube3[1] = Global.RTI3.Integrity(data.tube3[1]);
                data.tube4[1] = Global.RTI4.Integrity(data.tube4[1]);
            }*/
            if(data.tube1 && Global.tube1T){
                if(Global.IntRTT){//Дельта-сигма RT
                    data.tube1[1] = Global.RTI1.Integrity(data.tube1[1]);
                }
                if(Global.Trend1.series[0].xData.length<Global.RTbuffer){
                    Global.Trend1.series[0].addPoint(data.tube1,true,false,false);
                }else{
                    Global.Trend1.series[0].addPoint(data.tube1,true,true,false);
                    var tmpDiff = Global.Trend1.series[0].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend1.series[0].removePoint(index,false);
                        }
                        Global.Trend1.redraw();
                    }
                } 
            }
            
            if(data.tube2 && Global.tube2T){
                if(Global.IntRTT){//Дельта-сигма RT
                    data.tube2[1] = Global.RTI2.Integrity(data.tube2[1]);
                }
                if(Global.Trend2.series[0].xData.length<Global.RTbuffer){
                    Global.Trend2.series[0].addPoint(data.tube2,true,false,false);
                }else{
                    Global.Trend2.series[0].addPoint(data.tube2,true,true,false);
                    var tmpDiff = Global.Trend2.series[0].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend2.series[0].removePoint(index,false);
                        }
                        Global.Trend2.redraw();
                    }
                }
            }
                
            if(data.tube3 && Global.tube3T){
                if(Global.IntRTT){//Дельта-сигма RT
                    data.tube3[1] = Global.RTI3.Integrity(data.tube3[1]);
                }
                if(Global.Trend3.series[0].xData.length<Global.RTbuffer){
                    Global.Trend3.series[0].addPoint(data.tube3,true,false,false);
                }else{
                    Global.Trend3.series[0].addPoint(data.tube3,true,true,false);
                    var tmpDiff = Global.Trend3.series[0].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend3.series[0].removePoint(index,false);
                        }
                        Global.Trend3.redraw();
                    }
                }
            }
                
            if(data.tube4 && Global.tube4T){
                if(Global.IntRTT){//Дельта-сигма RT
                    data.tube4[1] = Global.RTI4.Integrity(data.tube4[1]);
                }
                if(Global.Trend4.series[0].xData.length<Global.RTbuffer){
                    Global.Trend4.series[0].addPoint(data.tube4,true,false,false);
                }else{
                    Global.Trend4.series[0].addPoint(data.tube4,true,true,false);
                    var tmpDiff = Global.Trend4.series[0].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend4.series[0].removePoint(index,false);
                        }
                        Global.Trend4.redraw();
                    }
                }
            }
        }
    });
    Global.socketToP.on("all_ok", function(data){
        var tmpstatus = 4;
        if(Global.statusP != tmpstatus){
            $('#status_node_p').html('<h2 class="label label-lg label-success">Система работает</h2>');
            Global.statusP = 4;
        }
        
        if(data && Global.RTToggle){   
            /*if(Global.IntRTT){//Дельта-сигма RT
                data.tube1[1] = Global.RTI1p.Integrity(data.tube1[1]);
                data.tube2[1] = Global.RTI2p.Integrity(data.tube2[1]);
                data.tube3[1] = Global.RTI3p.Integrity(data.tube3[1]);
                data.tube4[1] = Global.RTI4p.Integrity(data.tube4[1]);
            }*/
            if(data.tube1 && Global.tube1T){
                if(Global.IntRTT){//Дельта-сигма RT LOC
                    data.tube1[1] = Global.RTI1p.Integrity(data.tube1[1]);
                }
                if(Global.Trend1.series[1].xData.length<Global.RTbuffer){
                    Global.Trend1.series[1].addPoint(data.tube1,true,false,false);
                }else{
                    Global.Trend1.series[1].addPoint(data.tube1,true,true,false);
                    var tmpDiff = Global.Trend1.series[1].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend1.series[1].removePoint(index,false);
                        }
                        Global.Trend1.redraw();
                    }
                } 
            }
        
            if(data.tube2 && Global.tube2T){
                if(Global.IntRTT){//Дельта-сигма RT LOC
                    data.tube2[1] = Global.RTI2p.Integrity(data.tube2[1]);
                }
                if(Global.Trend2.series[1].xData.length<Global.RTbuffer){
                    Global.Trend2.series[1].addPoint(data.tube2,true,false,false);
                }else{
                    Global.Trend2.series[1].addPoint(data.tube2,true,true,false);
                    var tmpDiff = Global.Trend2.series[1].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend2.series[1].removePoint(index,false);
                        }
                        Global.Trend2.redraw();
                    }
                }
            }
                
            if(data.tube3 && Global.tube3T){
                if(Global.IntRTT){//Дельта-сигма RT LOC
                    data.tube3[1] = Global.RTI3p.Integrity(data.tube3[1]);
                }
                if(Global.Trend3.series[1].xData.length<Global.RTbuffer){
                    Global.Trend3.series[1].addPoint(data.tube3,true,false,false);
                }else{
                    Global.Trend3.series[1].addPoint(data.tube3,true,true,false);
                    var tmpDiff = Global.Trend3.series[1].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend3.series[1].removePoint(index,false);
                        }
                        Global.Trend3.redraw();
                    }
                }
            }
                
            if(data.tube4 && Global.tube4T){
                if(Global.IntRTT){//Дельта-сигма RT LOC
                    data.tube4[1] = Global.RTI4p.Integrity(data.tube4[1]);
                }
                if(Global.Trend4.series[1].xData.length<Global.RTbuffer){
                    Global.Trend4.series[1].addPoint(data.tube4,true,false,false);
                }else{
                    Global.Trend4.series[1].addPoint(data.tube4,true,true,false);
                    var tmpDiff = Global.Trend4.series[1].xData.length - Global.RTbuffer;
                    //console.log("tube1-series0 разница:"+tmpDiff);
                    if(tmpDiff>0){
                        for(var index=0; index < tmpDiff; index++){
                            Global.Trend4.series[1].removePoint(index,false);
                        }
                        Global.Trend4.redraw();
                    }
                }
            }
        }
    });
    Global.socketToNB.on("min_null", function(data){
        $('#status_node_nb').html('<h2 class="label label-lg label-warning">Нет записей в БД</h2>');
    });
    Global.socketToNB.on("min_max_res", function(data){
        //$('#status_node_nb').html('<h2 class="label label-lg label-warning">Нет записей в БД</h2>');
        if(data.min){Global.minArjTrend = data.min;}
        if(data.max){Global.maxArjTrend = data.max;}
        console.log("max & min setted min:"+Global.minArjTrend+" max:"+Global.maxArjTrend);
        Global.MainTrend.series[0].setData([[data.min,0],[data.max,0]]);
        Global.socketToNB.emit("arjLoad",{min:Global.minArjTrend,max:Global.maxArjTrend, tube:data.tube});
        //console.log("arjLoad: sended");
    });
    Global.socketToNB.on("arj_first", function(data){
        //$('#status_node_nb').html('<h2 class="label label-lg label-warning">Нет записей в БД</h2>');
        //Global.MainTrend.series[0].setData([[data.min,0],[data.max,0]]);
    });
    Global.socketToNB.on("arj_load_res", function(data){
        //$('#status_node_nb').html('<h2 class="label label-lg label-warning">Нет записей в БД</h2>');
        Global.MainTrend_DataP = [];
        Global.MainTrend_DataNB = [];
        if(data.trendNB && data.trendP){
            for(var index in data.trendP){
                if(Global.IntARJT){
                    var tmpVal = Global.ARJI.Integrity(data.trendP[index].value);
                    Global.MainTrend_DataP.push([data.trendP[index].utc,tmpVal]);
                }else{
                    Global.MainTrend_DataP.push([data.trendP[index].utc,data.trendP[index].value]);
                }
            }
            for(var index in data.trendNB){
                if(Global.IntARJT){
                    var tmpVal = Global.ARJIp.Integrity(data.trendNB[index].value);
                    Global.MainTrend_DataNB.push([data.trendNB[index].utc,tmpVal]);
                }else{
                    Global.MainTrend_DataNB.push([data.trendNB[index].utc,data.trendNB[index].value]);
                }
            }
            console.log("data RCVED");
            
            Global.MainTrend.series[0].setData([]);
            Global.MainTrend.series[1].setData([]); 
            
            Global.MainTrend.series[0].setData(Global.MainTrend_DataNB);
            Global.MainTrend.series[1].setData(Global.MainTrend_DataP); 
            Global.MainTrend.series[0].addPoint([Global.minArjTrend-1,0]);
            var tmpMaxPval = 0;
            var tmpMaxNBval = 0;
            var tmpMinUTC = false;
            var tmpMaxUTC = false;
            
            if(data.min && data.max){
                tmpMinUTC = data.min;
                tmpMaxUTC = data.max;
            }else{
                tmpMinUTC = Global.minArjTrend;
                tmpMaxUTC = Global.maxArjTrend; 
            }
            
            
            if(Global.MainTrend_DataNB.length){
                tmpMaxNBval = Global.MainTrend_DataNB[Global.MainTrend_DataNB.length-1][1];
                
            }else{
                tmpMaxNBval = 0;
    
            }
            //----------------------------
            if(Global.MainTrend_DataP.length){
                tmpMaxPval = Global.MainTrend_DataP[Global.MainTrend_DataP.length-1][1];
            }else{
                tmpMaxPval = 0;
        
            }
            //------------------------------
            Global.MainTrend.series[0].addPoint([Global.maxArjTrend+1,tmpMaxNBval]);
            Global.MainTrend.series[1].addPoint([Global.minArjTrend-1,0]);
            Global.MainTrend.series[1].addPoint([Global.maxArjTrend+1,tmpMaxPval]);
            
            Global.MainTrend.xAxis[0].setExtremes(tmpMinUTC,tmpMaxUTC);
            
        }
    });
    
});
function trendDetail(e){
    if(e.min && e.max && Global.NB_Con && e.trigger){
        if(e.trigger == "rangeSelectorButton" || e.trigger == "zoom"){
            Global.socketToNB.emit("arjLoad",{min:e.min,max:e.max, tube:Global.currentTube});
        }
    }
}

function minMax(tube){
    if(Global.NB_Con){//если есть коннект с сервером формируем событие
           Global.socketToNB.emit("min_max",{tube:tube});
    }
};

function press2perc(val){
    var min = 0.0;
    var max = 16.0;
    var desc = max/100;
    var cur = val/desc;
    //console.log(cur);
    return cur;
}