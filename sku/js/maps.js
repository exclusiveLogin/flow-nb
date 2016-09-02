var domobj;
var domobjjq;
var map;
var marker;
var circleAccuracy;

$(document).ready(function () {
    domobj = document.getElementById('map');
    domobjjq = $("#map");
    InitMap();
});

function InitMap() {
    var map = new google.maps.Map(domobjjq[0], {
        center: {lat: 53.172579, lng: 48.560600},
        zoom: 13
    });
    //animation = new google.map.Animation.DROP;
    var marker1 = new google.maps.Marker({
        map:map,
        position:{lat: 53.166353, lng: 48.560643},
        title:"Причал",
        animation:google.maps.Animation.DROP
    });
    var marker2 = new google.maps.Marker({
        map:map,
        position:{lat: 53.179009, lng: 48.561373},
        title:"Нефтебаза",
        animation:google.maps.Animation.DROP
    });
    
    var circleAccuracy = new google.maps.Circle({
        map:map,
        center:{lat: 53.172579, lng: 48.560600},
        radius:700,
        fillColor:"#009999",
        fillOpacity:0.2,
        strokeColor:"#004444",
        strokeOpacity:0.3,
        strokeWeight:2
    });
    var tube = new google.maps.Polyline({
        path:[{lat: 53.166353, lng: 48.560643},{lat: 53.179009, lng: 48.561373}],
        map:map
    });
}
