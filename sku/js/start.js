Global.authkey=false;
Global.loginData={
    "login":"",
    "password":""
};
Global.bugFixEv = new Event("resize");

function tooltipHandler() {
    $("[data-tooltip]").mousemove(function (eventObject) {

        var data_tooltip = $(this).attr("data-tooltip");

        $("#tooltip").text(data_tooltip)
            .css({
                "top" : eventObject.pageY + 10,
                "left" : eventObject.pageX + 10
            })
            .show();

    }).mouseout(function () {

        $("#tooltip").hide()
            .text("")
            .css({
                "top" : 0,
                "left" : 0
            });
    });
};

document.addEventListener("DOMContentLoaded", function(){
    console.log("DOMContentLoaded");
    if(Global.IntegratorCon){
        console.log("Integrator connected success");
        Global.RTI1 = new Integrator();
        Global.RTI2 = new Integrator();
        Global.RTI3 = new Integrator();
        Global.RTI4 = new Integrator();

        Global.RTI1p = new Integrator();
        Global.RTI2p = new Integrator();
        Global.RTI3p = new Integrator();
        Global.RTI4p = new Integrator();

        Global.ARJI = new Integrator();
        Global.ARJIp = new Integrator();
    }else{
        console.log("Integrator connected ERROR");
    }
    //load settings from LS
    ls.loadSettings();
});


$(document).ready(function(){
    Global.jqready = true;

    Global.authkey = true;
    Global.loggedAs = "ssv";

    refreshLog();
    
    Global.FloodLog = new FL(".calcWrapper .calcLog");
    
    //JQUI - init
    <!--*****PreBuffer*****-->
    $('#int_pre_slider').slider({
        range:false,
        min:1,
        max:20,
        value:1,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#int_prebuffer').val(ui.value);
            $('#btn_intSetting').removeClass("disabled");
        },
        create:function(){
            $('#int_prebuffer').val("1");
        }
    });
    <!--*****PostBuffer*****-->
    $('#int_post_slider').slider({
        range:false,
        min:1,
        max:20,
        value:1,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#int_postbuffer').val(ui.value);
            $('#btn_intSetting').removeClass("disabled");
        },
        create:function(){
            $('#int_postbuffer').val("1");
        }
    });
    <!--*****AmplifferNB*****-->
    $('#int_amp_slider_nb').slider({
        range:false,
        min:1,
        max:200,
        value:1,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#int_ampliffer_nb').val(ui.value);
            $('#btn_intSetting').removeClass("disabled");
        },
        create:function(){
            $('#int_ampliffer_nb').val("1");
        }
    });
    <!--*****AmplifferP*****-->
    $('#int_amp_slider_p').slider({
        range:false,
        min:1,
        max:200,
        value:1,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#int_ampliffer_p').val(ui.value);
            $('#btn_intSetting').removeClass("disabled");
        },
        create:function(){
            $('#int_ampliffer_p').val("1");
        }
    });
    <!--*****AmpFilterNB*****-->
    $('#int_ampfilter_slider_nb').slider({
        range:false,
        min:0,
        max:2,
        step:0.01,
        value:0,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#int_ampfilter_nb').val(ui.value);
            $('#btn_intSetting').removeClass("disabled");
        },
        create:function(){
            $('#int_ampfilter_nb').val("0");
        }
    });
    <!--*****AmpFilterP*****-->
    $('#int_ampfilter_slider_p').slider({
        range:false,
        min:0,
        max:2,
        step:0.01,
        value:0,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#int_ampfilter_p').val(ui.value);
            $('#btn_intSetting').removeClass("disabled");
        },
        create:function(){
            $('#int_ampfilter_p').val("0");
        }
    });
    
    $('#rt_buffer_slider').slider({
        range:false,
        min:1,
        max:500,
        value:300,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#rt_buffer').val(ui.value);
            $('#btn_rtSetting').removeClass("disabled");
        },
        create:function(){
            $('#rt_buffer').val(300);
        }
    });
    
    $('#rt_vertRange_slider').slider({
        range:false,
        min:1,
        max:200,
        value:50,
        //orientation:"vertical",
        slide:function(event,ui){
            $('#rt_vertRange').val(ui.value/100);
            $('#btn_rtSetting').removeClass("disabled");
        },
        create:function(){
            $('#rt_vertRange').val(0.5);
        }
    });
    //-------------------------------------------
    
    $('#btn_intSetting').on("click",function(){
        $('#btn_intSetting').addClass("disabled");
        Global.INTSettings = {
            post:Number($('#int_postbuffer').val()),
            pre:Number($('#int_prebuffer').val()),
            ampNB:Number($('#int_ampliffer_nb').val()),
            ampP:Number($('#int_ampliffer_p').val()),
            ampFilterNB:Number($('#int_ampfilter_nb').val()),
            ampFilterP:Number($('#int_ampfilter_p').val())
        };
        //удаляем калькулятор если есть потому что настройки изменились
        if(Global.FlowCalc)Global.FlowCalc = null;
        saveIntSettings();
        ls.saveSettings(Global.INTSettings);
    });
    
    $('#btn_intToggleRT').on("click",function(){
        if($(this).hasClass("active")){
            Global.IntRTT = false;
        }else{
            Global.IntRTT = true;
        }
        var tmp = {
            INTRTTBtn:Global.IntRTT
        };
        ls.saveSettings(tmp);
        intRTTToggle();
    });
    $('#btn_intToggleArj').on("click",function(){
        if($(this).hasClass("active")){
            Global.IntARJT = false;
        }else{
            Global.IntARJT = true;
        }
        var tmp = {
            INTARJBtn:Global.IntARJT
        };
        ls.saveSettings(tmp);
        intArjToggle();
    });
    
    $('#btn_intToggleOnly').on("click",function(){
        if($(this).hasClass("active")){
            Global.IntToggleOnly = false;
        }else{
            Global.IntToggleOnly = true;
        }
        var tmp = {
            INTTONLYBtn:Global.IntToggleOnly
        };
        ls.saveSettings(tmp);
        intToggleOnly();
    });
    
    //-----------------Integrator-----------------
    $('.btn_int_close').on("click",function(){
        $('#integratorSetting').hide(500);
    });
    $('.btn_intset_toggle').on("click",function(){
        $('#integratorSetting').show(500);
    });
    //---------------RT setting--------------------
    $('.btn_rtSet_close').on("click",function(){
        $('#rtSetting').hide(500);
    });
    $('.btn_rtSet_open').on("click",function(){
        $('#rtSetting').show(500);
    });
    
    $('#btn_rtSetting').on("click",function(){
        $('#btn_rtSetting').addClass("disabled");
        Global.RTSettings = {
            buffer:Number($('#rt_buffer').val()),
            vertRange:Number($('#rt_vertRange').val())
        };
        saveRTSettings();
    });
    //------------
    
    $.ajaxSetup({
        cache:false
    });
    $('.btnlogin').on('click',function(){
        $(this).addClass('disabled active');
        $('#loginform').show(500);
    });
    $('.btn_rt_toggle').on('click',function(){
        rtToggle();
    });
    $('.btn_rt1_t').on('click',function(){
        rt1T();
    });
    $('.btn_rt2_t').on('click',function(){
        rt2T();
    });
    $('.btn_rt3_t').on('click',function(){
        rt3T();
    });
    $('.btn_rt4_t').on('click',function(){
        rt4T();
    });
    $('#btnloginenter').on('click',function(){
        Global.loginData.login = $('#loginName').val();
        Global.loginData.password = $('#passwordName').val();
        $.ajax({
            url:"/enter.php",
            dataType:"json",
            method:'GET',
            data:Global.loginData,
            success:function(data){
                if(data.auth)userEnter(data.login);
                loginToggle(0);
                if(data.msg){
                    var state = false;
                    if(data.auth){
                        state=true;
                    } 
                    showSysMsg(data.msg,state);
                }
                refreshLog();
            },
            error:function(){
                console.log("error to load auth ajax");
            }
        });
    });
    $('.btnlogincl').on('click',function(){
        $('.btnlogin').removeClass('disabled active');
        $('#loginform').hide(500);
    });
    $('.btnlogout').on('click',function(){
        Global.authkey = false;
        Global.loggedAs = "";
        showSysMsg("Вы успешно вышли из системы",true);
        refreshLog();
    });
    $('.btn-arj-tube').on('click',function(){
        var num = $(this).data("num");
        //console.log("btn_tube num = "+num);
        if(num){
            //stop calc and remove floods
            stopCalc();
            clearFloods();
            
            Global.currentTube = num;
            minMax(num);
            trendToggle(true,num);
        }
    });
    $('#btn_close_analize').on('click',function(){
        trendToggle(0);
    });
    $('#btn_close_result').on('click',function(){
        resultToggle(0);
    });
    $('#btn_calc').on('click',function(){
        resultToggle(1);
        var resultCalc = false;
        var calc = new Calculator();
        var pointNB = Number($(".pointNButc").text());
        var pointP = Number($(".pointPutc").text());
        if(pointNB && pointP){
            calc.setPoints(pointNB,pointP);
            resultCalc = calc.calc();
            if(resultCalc.error){
                $(".res_msg").text(resultCalc.errTxt);
            }else{
                $(".res_msg").text("Раcчет произведен успешно");
                $(".res_nb_val").text(resultCalc.fromNB);
                $(".res_pr_val").text(resultCalc.fromP);
                $(".res_center_val").text(resultCalc.rel);
            }
        }else{
            $(".res_msg").text("Не хватает данных для расчета");
        }
        
    });
    $("#btn_calc_auto").on("click",function () {
        //проверка на отключение
        if(!$(this).hasClass("disabled")){
            //clear first
            clearFloods();
            //получаем интервал
            let extremes = Global.MainTrend.get("timeline").getExtremes();
            extremes.trigger = "flowcalc";
            //console.log("flowcalc EXTREMES:",extremes);
            trendDetail(extremes);
            $(this).addClass("disabled");
            $("#btn_calc_auto_reset").removeClass("disabled");
            $(".fc_startinv.val").text(extremes.min);
            $(".fc_endinv.val").text(extremes.max);
        }
    });
    $("#btn_calc_auto_reset").on("click",function () {
        if(!$(this).hasClass("disabled")){
            stopCalc();
        }
    });
});
function clearFloods(){
    Global.MainTrend.series[2].setData([]);
    Global.MainTrend.get("floodnb").setData([]);
    Global.MainTrend.get("floodp").setData([]);
    Global.MainTrend.get("testnb").setData([]);
    Global.MainTrend.get("testp").setData([]);
    if(Global.FloodMarkers.length){
        Global.FloodMarkers.forEach(function (el) {
            el.setMap(null);
            el = null;
        });
        Global.FloodMarkers = [];
    }
    //clear FloodLog;
    Global.FloodLog.clearLog();
}
function stopCalc(){
    $("#btn_calc_auto_reset").addClass("disabled");
    if(Global.flowcalcTimerNext)clearTimeout(Global.flowcalcTimerNext);
}
function userEnter(user) {
    Global.authkey=true;
    Global.loggedAs = user;
}
function showSysMsg(msg,state) {
    if(state){
        $("#sysmsg").removeClass("sys_err");
        $("#sysmsg").addClass("sys_ok");
    }
    else {
        $("#sysmsg").removeClass("sys_ok");
        $("#sysmsg").addClass("sys_err");
    }
    //$("#sysmsg").show();
    $("#sysmsg").removeClass("myhide");
    $("#sysmsg_val").html(msg);
    setTimeout(hideSysMsg,20000);
    function hideSysMsg() {
        $("#sysmsg").addClass("myhide");
        
    }
    
}
function calcPoint(point){
    resultToggle(1);
    if(point.error){
        $(".res_msg").text(point.errTxt);
    }else{
        $(".res_msg").text("Рачет произведен успешно");
        $(".res_nb_val").text(point.fromNB);
        $(".res_pr_val").text(point.fromP);
        $(".res_center_val").text(point.rel);
    }
};