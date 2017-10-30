$(function () {
    let domobj = $("#map");
    GML.load(function(google){
        // console.log("GML load",google);
        Global.map = new google.maps.Map(domobj[0], {
            center: {lat: 53.172579, lng: 48.560600},
            zoom: 14
        });
        //animation = new google.map.Animation.DROP;
        let marker1 = new google.maps.Marker({
            map:Global.map,
            position:{lat: 53.166572, lng: 48.560838},
            title:"Причал",
            animation:google.maps.Animation.DROP
        });
        let marker2 = new google.maps.Marker({
            map:Global.map,
            position:{lat: 53.178125, lng: 48.561003},
            title:"Нефтебаза",
            animation:google.maps.Animation.DROP
        });

        let circleAccuracy = new google.maps.Circle({
            map:Global.map,
            center:{lat: 53.172579, lng: 48.560600},
            radius:700,
            fillColor:"#009999",
            fillOpacity:0.2,
            strokeColor:"#004444",
            strokeOpacity:0.3,
            strokeWeight:2
        });
        Global.mapTube = new google.maps.Polyline({
            path:[{lat: 53.178125, lng: 48.561003},
                {lat: 53.177225, lng: 48.561979},
                {lat: 53.174862, lng: 48.563583},
                {lat: 53.174344, lng: 48.563915},
                {lat: 53.167138, lng: 48.563519},
                {lat: 53.166025, lng: 48.562784},
                {lat: 53.166572, lng: 48.560838}
            ],
            map:Global.map,
            strokeColor:"orange"
        });
        //console.log("Tube length: "+tube.getLength());
    });
});

