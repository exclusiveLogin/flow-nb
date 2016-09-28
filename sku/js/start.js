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
    
    $('#btn_intSetting').on("click",function(){
        $('#btn_intSetting').addClass("disabled");
        Global.INTSettings = {
            post:Number($('#int_postbuffer').val()),
            pre:Number($('#int_prebuffer').val())
        };
        console.log(Global.INTSettings);
        Global.RTI1.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI2.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI3.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI4.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        
        Global.RTI1p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI2p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI3p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.RTI4p.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        
        Global.ARJI.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
        Global.ARJIp.setFilter(Global.INTSettings.pre,Global.INTSettings.post);
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
    });
    
    $('.btn_int_close').on("click",function(){
        $('#integratorSetting').hide(500);
    });
    $('.btn_intset_toggle').on("click",function(){
        $('#integratorSetting').show(500);
    })
    
    
    
    
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