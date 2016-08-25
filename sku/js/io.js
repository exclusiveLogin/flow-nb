
Global.socketToLH = undefined;
$(document).ready(function(){
    $('#status_node_nb').html('<h2 class="label label-lg label-warning">Попытка установить связь</h2>');
    $('#status_node_p').html('<h2 class="label label-lg label-warning">Попытка установить связь</h2>');
    Global.socketToNB = io('http://10.210.30.148:3000');
    Global.socketToP = io('http://10.210.30.150:3000');

    //-----------------CON OK-------------------------------
    Global.socketToNB.on("connect", function(){
        $('#status_node_nb').html('<h2 class="label label-lg label-success">Связь с узлом установлена</h2>');
    });
    Global.socketToP.on("connect", function(){
        $('#status_node_p').html('<h2 class="label label-lg label-success">Связь с узлом установлена</h2>');
    });
    
    
    Global.socketToNB.on("connect_error", function(){
        $('#status_node_nb').html('<h2 class="label label-lg label-danger">Ошибка связи с узлом</h2>');
        //$('#tube1_val').text("---");
        //$('#tube2_val').text("---");
        //$('#tube3_val').text("---");
        //$('#tube4_val').text("---");
        //$('#tube1_pr_val').css("width","0%");
        //$('#tube2_pr_val').css("width","0%");
        //$('#tube3_pr_val').css("width","0%");
        //$('#tube4_pr_val').css("width","0%");
    });
    Global.socketToP.on("connect_error", function(){
        $('#status_node_p').html('<h2 class="label label-lg label-danger">Ошибка связи с узлом</h2>');
    });
    
    
    Global.socketToNB.on("mb_error", function(){
        $('#status_node_nb').html('<h2 class="label label-lg label-danger">Ошибка Modbus протокола</h2>');
    });
    Global.socketToP.on("mb_error", function(){
        $('#status_node_p').html('<h2 class="label label-lg label-danger">Ошибка Modbus протокола</h2>');
    });
    Global.socketToNB.on("mb_ok", function(){
        $('#status_node_nb').html('<h2 class="label label-lg label-danger">Связь c PLC установлена</h2>');
    });
    Global.socketToP.on("mb_ok", function(){
        $('#status_node_p').html('<h2 class="label label-lg label-danger">Связь c PLC установлена</h2>');
    });
    Global.socketToNB.on("mqsql_error", function(){
        $('#status_node_nb').html('<h2 class="label label-lg label-danger">Ошибка Базы Данных</h2>');
    });
    Global.socketToP.on("mqsql_error", function(){
        $('#status_node_p').html('<h2 class="label label-lg label-danger">Ошибка Базы Данных</h2>');
    });
    //----------------DATA-----------------------------
    Global.socketToNB.on("all_ok", function(data){
        $('#status_node_nb').html('<h2 class="label label-lg label-success">Система работает</h2>');
        if(data){
            if(data.tube1){
                //$('#tube1_val').text(data.tube1[1]);
                //$('#tube1_pr_val').css("width",press2perc(data.tube1[1])+"%");
                
                if(Global.Trend1.series[0].xData.length<300){
                    Global.Trend1.series[0].addPoint(data.tube1,true,false,false);
                }else{
                    Global.Trend1.series[0].addPoint(data.tube1,true,true,false);
                } 
            }
            
            if(data.tube2){
                //$('#tube2_val').text(data.tube2[1]);
                //$('#tube2_pr_val').css("width",press2perc(data.tube2[1])+"%");
                
                if(Global.Trend2.series[0].xData.length<300){
                    Global.Trend2.series[0].addPoint(data.tube2,true,false,false);
                }else{
                    Global.Trend2.series[0].addPoint(data.tube2,true,true,false);
                }
            }
                
            if(data.tube3){
                //$('#tube3_val').text(data.tube3[1]);
                //$('#tube3_pr_val').css("width",press2perc(data.tube3[1])+"%");
                
                if(Global.Trend3.series[0].xData.length<300){
                    Global.Trend3.series[0].addPoint(data.tube3,true,false,false);
                }else{
                    Global.Trend3.series[0].addPoint(data.tube3,true,true,false);
                }
            }
                
            if(data.tube4){
                //$('#tube4_val').text(data.tube4[1]);
                //$('#tube4_pr_val').css("width",press2perc(data.tube4[1])+"%");
                
                if(Global.Trend4.series[0].xData.length<300){
                    Global.Trend4.series[0].addPoint(data.tube4,true,false,false);
                }else{
                    Global.Trend4.series[0].addPoint(data.tube4,true,true,false);
                }
            }
        }
    });
    Global.socketToP.on("all_ok", function(data){
        $('#panel').html('<h2 class="label label-lg label-success">Система работает</h2>');
        if(data){           
            if(data.tube1){
                //$('#tube1_val').text(data.tube1[1]);
                //$('#tube1_pr_val').css("width",press2perc(data.tube1[1])+"%");
                
                if(Global.Trend1.series[0].xData.length<300){
                    Global.Trend1.series[0].addPoint(data.tube1,true,false,false);
                }else{
                    Global.Trend1.series[0].addPoint(data.tube1,true,true,false);
                } 
            }
            
            if(data.tube2){
                //$('#tube2_val').text(data.tube2[1]);
                //$('#tube2_pr_val').css("width",press2perc(data.tube2[1])+"%");
                
                if(Global.Trend2.series[0].xData.length<300){
                    Global.Trend2.series[0].addPoint(data.tube2,true,false,false);
                }else{
                    Global.Trend2.series[0].addPoint(data.tube2,true,true,false);
                }
            }
                
            if(data.tube3){
                //$('#tube3_val').text(data.tube3[1]);
                //$('#tube3_pr_val').css("width",press2perc(data.tube3[1])+"%");
                
                if(Global.Trend3.series[0].xData.length<300){
                    Global.Trend3.series[0].addPoint(data.tube3,true,false,false);
                }else{
                    Global.Trend3.series[0].addPoint(data.tube3,true,true,false);
                }
            }
                
            if(data.tube4){
                //$('#tube4_val').text(data.tube4[1]);
                //$('#tube4_pr_val').css("width",press2perc(data.tube4[1])+"%");
                
                if(Global.Trend4.series[0].xData.length<300){
                    Global.Trend4.series[0].addPoint(data.tube4,true,false,false);
                }else{
                    Global.Trend4.series[0].addPoint(data.tube4,true,true,false);
                }
            }
        }
    });
});
function press2perc(val){
    var min = 0.0;
    var max = 16.0;
    var desc = max/100;
    var cur = val/desc;
    //console.log(cur);
    return cur;
}