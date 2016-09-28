function trendToggle(state,tube) {
    if(state){
        $("#tubecard").removeClass("transparent",function () {
            $("#arj_tube_num").text(tube);
            if(Global.MainTrend){
                Global.MainTrend.setTitle({text:"Анализ трубы "+tube});
            }
            //Global.trend.reflow();
            //Global.trend.series[0].setData([]);
            //Global.trend.series[1].setData([]);

            //Global.trend.series[0].setData(Global[user].trend);
            //Global.trend.series[1].setData(Global[user].flags);
        });
    }else {
        $("#tubecard").addClass("transparent",function () {
            

        });
    }
}
function loginToggle(state){
    if(state){
        $('.btnlogin').addClass('disabled active');
        $('#loginform').show(500);
    }
    else{
        $('.btnlogin').removeClass('disabled active');
        $('#loginform').hide(500);
    }
}
function resultToggle(state){
    if(state){
        $('#result').removeClass("transparent");
    }
    else{
        $('#result').addClass("transparent");
    }
}
function rtToggle(){
    if($(".btn_rt_toggle").hasClass("active")){
        $(".btn_rt_toggle").removeClass("active");
        Global.RTToggle = false;
    }
    else{
        $(".btn_rt_toggle").addClass("active");
        Global.RTToggle = true;
    }
}
//-----------------------------------------------------
function rt1T(){
    if($(".btn_rt1_t").hasClass("active")){
        $(".btn_rt1_t").removeClass("active");
        Global.tube1T = false;
    }
    else{
        $(".btn_rt1_t").addClass("active");
        Global.tube1T = true;
    }
}
function rt2T(){
    if($(".btn_rt2_t").hasClass("active")){
        $(".btn_rt2_t").removeClass("active");
        Global.tube2T = false;
    }
    else{
        $(".btn_rt2_t").addClass("active");
        Global.tube2T = true;
    }
}
function rt3T(){
    if($(".btn_rt3_t").hasClass("active")){
        $(".btn_rt3_t").removeClass("active");
        Global.tube3T = false;
    }
    else{
        $(".btn_rt3_t").addClass("active");
        Global.tube3T = true;
    }
}
function rt4T(){
    if($(".btn_rt4_t").hasClass("active")){
        $(".btn_rt4_t").removeClass("active");
        Global.tube4T = false;
    }
    else{
        $(".btn_rt4_t").addClass("active");
        Global.tube4T = true;
    }
}
//------------------------------------------------
function refreshLog() {//поведение авторизации 
    if(Global.authkey){
        if(Global.jqready){
            $("#wrapper").removeClass("transparent");
            $("#panel_sku").removeClass("transparent");
            $("#panel_rt").removeClass("transparent");
            setTimeout(function () {
                $("#panel").removeClass("transparent");
            },500);

            $('.btnlogout').show();
            $('.btnlogin').hide();
        }
    }else {
        if(Global.jqready){
            $("#tubecard").delay(2000).addClass("transparent");
            $('#result').addClass("transparent");
            setTimeout(function () {
                $("#panel").addClass("transparent");
                $("#panel_rt").addClass("transparent");
            },500);
            setTimeout(function () {
                $("#wrapper").addClass("transparent");
            },1000);
            $('.btnlogout').hide();
            $('.btnlogin').show();
        }
    }
}