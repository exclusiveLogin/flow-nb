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
});


$(document).ready(function(){
    Global.jqready = true;

    Global.authkey = true;
    Global.loggedAs = "ssv";

    refreshLog();
    
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
        //console.log(Global.INTSettings);
        Global.RTI1.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI2.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI3.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI4.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        
        Global.RTI1p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI2p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI3p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI4p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);

        Global.RTI1.setAmp(Global.INTSettings.ampNB);
        Global.RTI2.setAmp(Global.INTSettings.ampNB);
        Global.RTI3.setAmp(Global.INTSettings.ampNB);
        Global.RTI4.setAmp(Global.INTSettings.ampNB);

        Global.RTI1p.setAmp(Global.INTSettings.ampP);
        Global.RTI2p.setAmp(Global.INTSettings.ampP);
        Global.RTI3p.setAmp(Global.INTSettings.ampP);
        Global.RTI4p.setAmp(Global.INTSettings.ampP);

        Global.RTI1.ampFilter = Global.INTSettings.ampFilterNB;
        Global.RTI2.ampFilter = Global.INTSettings.ampFilterNB;
        Global.RTI3.ampFilter = Global.INTSettings.ampFilterNB;
        Global.RTI4.ampFilter = Global.INTSettings.ampFilterNB;

        Global.RTI1p.ampFilter = Global.INTSettings.ampFilterP;
        Global.RTI2p.ampFilter = Global.INTSettings.ampFilterP;
        Global.RTI3p.ampFilter = Global.INTSettings.ampFilterP;
        Global.RTI4p.ampFilter = Global.INTSettings.ampFilterP;
        
        Global.ARJI.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.ARJIp.setFilter(Global.INTSettings.pre,Global.INTSettings.post);

        Global.ARJI.setAmp(Global.INTSettings.ampNB);
        Global.ARJIp.setAmp(Global.INTSettings.ampP);

        Global.ARJI.ampFilter = Global.INTSettings.ampFilterNB;
        Global.ARJIp.ampFilter = Global.INTSettings.ampFilterP;
    });
    
    $('#btn_intToggleRT').on("click",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).removeClass("btn-danger");
            $(this).text("Включить в RT");
            Global.IntRTT = false;
        }else{
            $(this).addClass("active");
            $(this).addClass("btn-danger");
            $(this).text("Отключить в RT");
            Global.IntRTT = true;
        }
    });
    $('#btn_intToggleArj').on("click",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).removeClass("btn-danger");
            $(this).text("Включить в Архиве");
            Global.IntARJT = false;
        }else{
            $(this).addClass("active");
            $(this).addClass("btn-danger");
            $(this).text("Отключить в Архиве");
            Global.IntARJT = true;
        }
        trendDetail(false,true);
    });
    
    $('#btn_intToggleOnly').on("click",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).removeClass("btn-danger");
            
            Global.RTI1.integrityOnly = false;
            Global.RTI2.integrityOnly = false;
            Global.RTI3.integrityOnly = false;
            Global.RTI4.integrityOnly = false;
            
            Global.RTI1p.integrityOnly = false;
            Global.RTI2p.integrityOnly = false;
            Global.RTI3p.integrityOnly = false;
            Global.RTI4p.integrityOnly = false;
            
            Global.ARJI.integrityOnly = false;
            Global.ARJIp.integrityOnly = false;
        }else{
            $(this).addClass("active");
            $(this).addClass("btn-danger");
            
            Global.RTI1.integrityOnly = true;
            Global.RTI2.integrityOnly = true;
            Global.RTI3.integrityOnly = true;
            Global.RTI4.integrityOnly = true;
            
            Global.RTI1p.integrityOnly = true;
            Global.RTI2p.integrityOnly = true;
            Global.RTI3p.integrityOnly = true;
            Global.RTI4p.integrityOnly = true;
            
            Global.ARJI.integrityOnly = true;
            Global.ARJIp.integrityOnly = true;
        }
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
                $(".res_msg").text("Рачет произведен успешно");
                $(".res_nb_val").text(resultCalc.fromNB);
                $(".res_pr_val").text(resultCalc.fromP);
                $(".res_center_val").text(resultCalc.rel);
            }
        }else{
            $(".res_msg").text("Не хватает данных для расчета");
        }
        
    });
});
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