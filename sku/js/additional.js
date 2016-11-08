setInterval(addPreLoader,60000);

$(document).ready(function(){
    addPreLoader();
});

function addPreLoader(){
    Global.addTimer = setInterval(addBlink, 250);
    setTimeout(additionalLoader,500);
}

function additionalLoader(){
    $.ajax({
        url:"../../temp/additional.php",
        dataType:"json",
        method:'POST',
        cache:false,
        success:function(data){
            //температура
            if(data.temp_v){
                $("#add_tv_val").text(data.temp_v);
            }
            if(data.t1){
                $("#add_t1_val").text(data.t1);
            }
            if(data.t2){
                $("#add_t2_val").text(data.t2);
            }
            //расход
            if(data.f11){
                $("#add_f11_val").text(data.f11);
            }
            if(data.f12){
                $("#add_f12_val").text(data.f12);
            }
            if(data.f21){
                $("#add_f21_val").text(data.f21);
            }
            if(data.f22){
                $("#add_f22_val").text(data.f22);
            }
            //плотность
            if(data.p11){
                $("#add_p11_val").text(data.p11);
            }
            if(data.p12){
                $("#add_p12_val").text(data.p12);
            }
            if(data.p21){
                $("#add_p21_val").text(data.p21);
            }
            if(data.p22){
                $("#add_p22_val").text(data.p22);
            }
        },
        error:function(){
            console.log("Error load AJAX data");
        },
        complete:function(){
            clearInterval(Global.addTimer);
            if($("#panel_additional .val").hasClass("transparent")){
                $("#panel_additional .val").removeClass("transparent");
            }
        }
    });
}

function addBlink(){
    if($("#panel_additional .val").hasClass("transparent")){
        $("#panel_additional .val").removeClass("transparent");
    }else{
        $("#panel_additional .val").addClass("transparent");
    }
}


