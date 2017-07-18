export default class LStore{
    saveSettings(objectToSave){
        Object.keys(objectToSave).map(function (element,idx) {
            if(window.localStorage){
                localStorage.setItem(element,objectToSave[element]);
                console.log("idx-"+idx+":"+element+":"+objectToSave[element]+" is saved");
            }else {
                showSysMsg("Ваш браузер не поддерживает сохранение настроек");
            }
        });
        //localStorage.setItem("username",user);
    }
    loadSettings() {
        Global.INTSettings = {};
        Global.RTSettings = {};
        if(localStorage.getItem("RTVertRange")!=null){
            var tmp = JSON.parse(localStorage.getItem("RTVertRange"));
            $('#rt_vertRange').val(tmp);
            $('#rt_vertRange_slider').slider({value:tmp});
            Global.RTSettings.vertRange = tmp;
        }
        if(localStorage.getItem("RTbuffer")!=null){
            var tmp = JSON.parse(localStorage.getItem("RTbuffer"));
            $('#rt_buffer').val(tmp);
            $('#rt_buffer_slider').slider({value:tmp});
            Global.RTSettings.buffer = tmp;
        }
        if(localStorage.getItem("ampFilterNB")!=null){
            var tmp = JSON.parse(localStorage.getItem("ampFilterNB"));
            $('#int_ampfilter_nb').val(tmp);
            $('#int_ampfilter_slider_nb').slider({value:tmp});
            Global.INTSettings.ampFilterNB = tmp;
        }
        if(localStorage.getItem("ampFilterP")!=null){
            var tmp = JSON.parse(localStorage.getItem("ampFilterP"));
            $('#int_ampfilter_p').val(tmp);
            $('#int_ampfilter_slider_p').slider({value:tmp});
            Global.INTSettings.ampFilterP = tmp;
        }
        if(localStorage.getItem("ampNB")!=null){
            var tmp = JSON.parse(localStorage.getItem("ampNB"));
            $('#int_ampliffer_nb').val(tmp);
            $('#int_amp_slider_nb').slider({value:tmp});
            Global.INTSettings.ampNB = tmp;
        }
        if(localStorage.getItem("ampP")!=null){
            var tmp = JSON.parse(localStorage.getItem("ampP"));
            $('#int_ampliffer_p').val(tmp);
            $('#int_amp_slider_p').slider({value:tmp});
            Global.INTSettings.ampP = tmp;
        }
        if(localStorage.getItem("post")!=null){
            var tmp = JSON.parse(localStorage.getItem("post"));
            $('#int_postbuffer').val(tmp);
            $('#int_post_slider').slider({value:tmp});
            Global.INTSettings.post = tmp;
        }
        if(localStorage.getItem("pre")!=null){
            var tmp = JSON.parse(localStorage.getItem("pre"));
            $('#int_prebuffer').val(tmp);
            $('#int_pre_slider').slider({value:tmp});
            Global.INTSettings.pre = tmp;
        }
        if(localStorage.getItem("tube1t")!=null){
            var tmp = JSON.parse(localStorage.getItem("tube1t"));
            if(tmp){
                $(".btn_rt1_t").addClass("active");
                $("#rt_trend1").show(500,function () {
                    Global.Trend1.reflow();
                });
            }else {
                $(".btn_rt1_t").removeClass("active");
                $("#rt_trend1").hide(0);
            }
            Global.tube1T = tmp;
        }
        if(localStorage.getItem("tube2t")!=null){
            var tmp = JSON.parse(localStorage.getItem("tube2t"));
            if(tmp){
                $(".btn_rt2_t").addClass("active");
                $("#rt_trend2").show(500,function () {
                    Global.Trend2.reflow();
                });
            }else {
                $(".btn_rt2_t").removeClass("active");
                $("#rt_trend2").hide(0);
            }
            Global.tube2T = tmp;
        }
        if(localStorage.getItem("tube3t")!=null){
            var tmp = JSON.parse(localStorage.getItem("tube3t"));
            if(tmp){
                $(".btn_rt3_t").addClass("active");
                $("#rt_trend3").show(500,function () {
                    Global.Trend3.reflow();
                });
            }else {
                $(".btn_rt3_t").removeClass("active");
                $("#rt_trend3").hide(0);
            }
            Global.tube3T = tmp;
        }
        if(localStorage.getItem("tube4t")!=null){
            var tmp = JSON.parse(localStorage.getItem("tube4t"));
            if(tmp){
                $(".btn_rt4_t").addClass("active");
                $("#rt_trend4").show(500,function () {
                    Global.Trend4.reflow();
                });
            }else {
                $(".btn_rt4_t").removeClass("active");
                $("#rt_trend4").hide(0);
            }
            Global.tube4T = tmp;
        }

        if(localStorage.getItem("INTTONLYBtn")!=null){
            var tmp = JSON.parse(localStorage.getItem("INTTONLYBtn"));
            Global.IntToggleOnly = tmp;
            intToggleOnly();
        }
        if(localStorage.getItem("INTARJBtn")!=null){
            var tmp = JSON.parse(localStorage.getItem("INTARJBtn"));
            Global.IntARJT = tmp;
            intArjToggle();
        }
        if(localStorage.getItem("INTRTTBtn")!=null){
            var tmp = JSON.parse(localStorage.getItem("INTRTTBtn"));
            Global.IntRTT = tmp;
            intRTTToggle();
        }

        if(Global.RTSettings.buffer && Global.RTSettings.vertRange){
            saveRTSettings();
        }
        if(Global.INTSettings.pre && Global.INTSettings.post && Global.INTSettings.ampNB && Global.INTSettings.ampP && Global.INTSettings.ampFilterNB && Global.INTSettings.ampFilterP){
            saveIntSettings();
        }
    }
}
