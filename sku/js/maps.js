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

        /*let circleAccuracy = new google.maps.Circle({
            map:Global.map,
            center:{lat: 53.172579, lng: 48.560600},
            radius:700,
            fillColor:"#009999",
            fillOpacity:0.2,
            strokeColor:"#004444",
            strokeOpacity:0.3,
            strokeWeight:2
        });*/
        let pathTube = [
            {lat: 53.178125, lng: 48.561003},
            {lat: 53.177225, lng: 48.561979},
            {lat: 53.174862, lng: 48.563583},
            {lat: 53.174344, lng: 48.563915},

            {lat: 53.171692, lng: 48.565750},
            {lat: 53.171209, lng: 48.565664},

            {lat: 53.167138, lng: 48.563519},
            {lat: 53.166025, lng: 48.562784},
            {lat: 53.166572, lng: 48.560838}
        ];
        Global.mapTube = new google.maps.Polyline({
            path:pathTube,
            map:Global.map,
            strokeColor:"orange"
        });

        //Generating path

        let lastDist = null;
        let PathTubeAdditional = pathTube.map(function (elem,idx) {
            if(idx < pathTube.length-1){
                let LatLngPtStartPt = cords2LatLng(elem);
                let LatLngPtEndPt = cords2LatLng(pathTube[idx+1]);

                let distance = google.maps.geometry.spherical.computeDistanceBetween(LatLngPtStartPt,LatLngPtEndPt);
                let heading = google.maps.geometry.spherical.computeHeading(LatLngPtStartPt,LatLngPtEndPt);

                let fromDist= 0;
                if(idx){
                    fromDist = lastDist;
                }
                let toDist = fromDist + distance;
                lastDist = toDist;
                return {distance,heading,startPt:LatLngPtStartPt,endPt:LatLngPtEndPt,fromDist,toDist};
            }

            function cords2LatLng(cords) {
                return new google.maps.LatLng(cords);
            }
        });

        PathTubeAdditional.splice(PathTubeAdditional.length-1,1);
        Global.PathTubeAdditional = PathTubeAdditional;
        //console.log("Path: ",PathTubeAdditional);

        Global.CalcMapMarker = function(distance,uid){
            let targetPt = false;
            for(let path in Global.PathTubeAdditional){
                //сравниваем дистанцию
                if(distance > Global.PathTubeAdditional[path].fromDist && distance < Global.PathTubeAdditional[path].toDist){
                    targetPt = Global.PathTubeAdditional[path];
                    break;
                }
            }
            //заполняем последним сегментом если не нашли
            if(!targetPt)targetPt=Global.PathTubeAdditional[Global.PathTubeAdditional.length-1];

            //console.log("TP: ",targetPt);
            //создаем маркер
            let PointFlood = google.maps.geometry.spherical.computeOffset(targetPt.startPt,distance-targetPt.fromDist,targetPt.heading);
            //console.log("PF: ",PointFlood);

            let marker = new google.maps.Marker({
                id:uid,
                map:Global.map,
                position:PointFlood,
                title:"Протечка",
                animation:google.maps.Animation.DROP,
                icon:{
                    path:google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red',
                    fillOpacity: .2,
                    scale: 10,
                    strokeColor: 'white',
                    strokeWeight: .5
                }
            });
            //console.log("Marker: ",marker);

            return marker;
        };
    });
});

