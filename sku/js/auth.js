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
        $("#rt_trend1").hide(500);
    }
    else{
        $(".btn_rt1_t").addClass("active");
        Global.tube1T = true;
        $("#rt_trend1").show(500,function () {
            Global.Trend1.reflow();
        });
    }
    saveTubeT();
}
function rt2T(){
    if($(".btn_rt2_t").hasClass("active")){
        $(".btn_rt2_t").removeClass("active");
        Global.tube2T = false;
        $("#rt_trend2").hide(500);
    }
    else{
        $(".btn_rt2_t").addClass("active");
        $("#rt_trend2").show(500,function () {
            Global.Trend2.reflow();
            Global.tube2T = true;
        });
    }
    saveTubeT();
}
function rt3T(){
    if($(".btn_rt3_t").hasClass("active")){
        $(".btn_rt3_t").removeClass("active");
        Global.tube3T = false;
        $("#rt_trend3").hide(500);
    }
    else{
        $(".btn_rt3_t").addClass("active");
        $("#rt_trend3").show(500,function () {
            Global.Trend3.reflow();
            Global.tube3T = true;
        });
    }
    saveTubeT();
}
function rt4T(){
    if($(".btn_rt4_t").hasClass("active")){
        $(".btn_rt4_t").removeClass("active");
        Global.tube4T = false;
        $("#rt_trend4").hide(500);
    }
    else{
        $(".btn_rt4_t").addClass("active");
        $("#rt_trend4").show(500,function () {
            Global.Trend4.reflow();
            Global.tube4T = true;
        });
    }
    saveTubeT();
}
//------------------------------------------------
function refreshLog() {//поведение авторизации 
    if(Global.authkey){
        if(Global.jqready){
            $("#wrapper").removeClass("transparent");
            $("#panel_additional").removeClass("transparent");
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
                $("#panel_additional").addClass("transparent");
            },1000);
            $('.btnlogout').hide();
            $('.btnlogin').show();
        }
    }
}
function saveRTSettings() {//update RT trends
    if(Global.RTSettings.buffer && Global.RTSettings.vertRange){
        Global.RTbuffer = Global.RTSettings.buffer;
        var tmpOptions = {
            minRange:Global.RTSettings.vertRange
        };
        if(Global.Trend1 && Global.Trend2 && Global.Trend3 && Global.Trend4){
            Global.Trend1.yAxis[0].update(tmpOptions);
            Global.Trend2.yAxis[0].update(tmpOptions);
            Global.Trend3.yAxis[0].update(tmpOptions);
            Global.Trend4.yAxis[0].update(tmpOptions);
        }
        var settings4save = {
            RTbuffer:Global.RTSettings.buffer,
            RTVertRange:Global.RTSettings.vertRange
        };
        ls.saveSettings(settings4save);
    }
}
function saveIntSettings() {
    //console.log(Global.INTSettings);
    if(Global.RTI1 && Global.RTI2 && Global.RTI3 && Global.RTI4 && Global.RTI1p && Global.RTI2p && Global.RTI3p && Global.RTI4p && Global.ARJI && Global.ARJIp){
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
    }
}
function saveTubeT() {
    var tmpTubeConfig = {
        tube1t:Global.tube1T,
        tube2t:Global.tube2T,
        tube3t:Global.tube3T,
        tube4t:Global.tube4T,
    };
    ls.saveSettings(tmpTubeConfig);
}
function intToggleOnly() {
    if(!Global.IntToggleOnly){
        $('#btn_intToggleOnly').removeClass("active");
        $('#btn_intToggleOnly').removeClass("btn-danger");

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
        $('#btn_intToggleOnly').addClass("active");
        $('#btn_intToggleOnly').addClass("btn-danger");

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
}
function intArjToggle() {
    if(!Global.IntARJT){
        $("#btn_intToggleArj").removeClass("active");
        $("#btn_intToggleArj").removeClass("btn-danger");
        $("#btn_intToggleArj").text("Включить в Архиве");
    }else{
        $("#btn_intToggleArj").addClass("active");
        $("#btn_intToggleArj").addClass("btn-danger");
        $("#btn_intToggleArj").text("Отключить в Архиве");
    }
    trendDetail(false,true);
}
function intRTTToggle() {
    if(!Global.IntRTT){
        $("#btn_intToggleRTT").removeClass("active");
        $("#btn_intToggleRTT").removeClass("btn-danger");
        $("#btn_intToggleRTT").text("Включить в RT");
    }else{
        $("#btn_intToggleRTT").addClass("active");
        $("#btn_intToggleRTT").addClass("btn-danger");
        $("#btn_intToggleRTT").text("Отключить в RT");
    }
}