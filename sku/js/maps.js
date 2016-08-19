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
    map = new google.maps.Map(domobjjq[0], {
        center: {lat: 53.167097, lng: 48.477003},
        zoom: 10
    });
    //animation = new google.map.Animation.DROP;
    marker1 = new google.maps.Marker({
        map:map,
        position:{lat: 53.167097, lng: 48.477003},
        title:"Вас засекли здесь",
        animation:google.maps.Animation.DROP
    });
    marker2 = new google.maps.Marker({
        map:map,
        position:{lat: 53.177097, lng: 48.487003},
        title:"Вас засекли здесь",
        animation:google.maps.Animation.DROP
    });
    circleAccuracy = new google.maps.Circle({
        map:map,
        center:{lat: 53.167097, lng: 48.477003},
        radius:5000,
        fillColor:"#009999",
        fillOpacity:0.2,
        strokeColor:"#004444",
        strokeOpacity:0.3,
        strokeWeight:2
    });
}
