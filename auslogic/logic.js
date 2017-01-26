/**
 * Created by SavinSV on 26.01.17.
 */
$(document).ready(function () {
    $("#btnaddphone").on("click",function () {
        var phone = $("#phone").val();
        var email = $("#emailreg").val();
        if(phone && email){
            fetch("db.php?tel="+phone+"&email="+email).then(function (response) {
                if(response.ok)return response.json();
            },function (err) {
                console.error("Что то пошло не так");
                console.error(err);
            }).then(function (data) {
                if(data.statusText)alert(data.statusText);
            },function (err) {
                console.error("Что то пошло не так");
                console.error(err);
            });
        }
    });
    $("#btnretrievephone").on("click",function () {
        var emailforgot = $("#emailforgot").val();
        if(emailforgot){
            fetch("db.php?forgotemail="+emailforgot).then(function (response) {
                if(response.ok)return response.json();
            },function (err) {
                console.error("Что то пошло не так");
                console.error(err);
            }).then(function (data) {
                if(data.statusText)alert(data.statusText);
            },function (err) {
                console.error("Что то пошло не так");
                console.error(err);
            });
        }
    });
});