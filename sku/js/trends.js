$(document).ready(function(){
    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Arial', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '16px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };
// Apply the theme
    Highcharts.setOptions(Highcharts.theme);
    var G_Setting = {
        global:{
            getTimezoneOffset:function () {
                var offset = new Date().getTimezoneOffset();
                return offset;
        }}
    };
    Highcharts.setOptions(G_Setting);
    Global.trend1Container = document.getElementById("rt_trend1");
    Global.trend2Container = document.getElementById("rt_trend2");
    Global.trend3Container = document.getElementById("rt_trend3");
    Global.trend4Container = document.getElementById("rt_trend4");
    Global.mainTrendContainer = document.getElementById("arj_trend");
    var Trend_rt_setting1 = {
        credits:{enabled:false},
        chart: {
            animation:false,
            height:250,
            renderTo:Global.trend1Container,            
        },
        title: {
            text: 'Труба 1'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            ordinal:false,
        },
        yAxis: {
            //min:0,
            //max:16,
            minRange:.5,
            title: {
                text: 'Давление'
            },
        },
        plotOptions: {
            series: {
                threshold:40
            },
            spline:{
                marker:{
                    enabled:false
                },
            },
        },
        series:[{
            type: 'spline',
            name: 'Нефтебаза',
            //data:[0,3,4,3,12,15,2],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"orange"
        },{
            type: 'spline',
            name: 'Причал',
            //data:[0,5,2,7,1,4,7],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"cyan"
        }]
    };
    var Trend_rt_setting2 = {
        credits:{enabled:false},
        chart: {
            animation:false,
            height:250,
            renderTo:Global.trend2Container,            
        },
        title: {
            text: 'Труба 2'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            ordinal:false,
        },
        yAxis: {
            //min:0,
            //max:16,
            minRange:.5,
            title: {
                text: 'Давление'
            },
        },
        plotOptions: {
            series: {
                threshold:40
            },
            spline:{
                marker:{
                    enabled:false
                },
            },
        },
        series:[{
            type: 'spline',
            name: 'Нефтебаза',
            //data:[0,3,4,3,12,15,2],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"orange"
        },{
            type: 'spline',
            name: 'Причал',
            //data:[0,5,2,7,1,4,7],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"cyan"
        }]
    };
    var Trend_rt_setting3 = {
        credits:{enabled:false},
        chart: {
            animation:false,
            height:250,
            renderTo:Global.trend3Container,            
        },
        title: {
            text: 'Труба 3'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            ordinal:false,
        },
        yAxis: {
            //min:0,
            //max:16,
            minRange:.5,
            title: {
                text: 'Давление'
            },
        },
        plotOptions: {
            series: {
                threshold:40
            },
            spline:{
                marker:{
                    enabled:false
                },
            },
        },
        series:[{
            type: 'spline',
            name: 'Нефтебаза',
            //data:[0,3,4,3,12,15,2],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"orange"
        },{
            type: 'spline',
            name: 'Причал',
            //data:[0,5,2,7,1,4,7],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"cyan"
        }]
    };
    var Trend_rt_setting4 = {
        credits:{enabled:false},
        chart: {
            animation:false,
            height:250,
            renderTo:Global.trend4Container,            
        },
        title: {
            text: 'Труба 4'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            ordinal:false,
        },
        yAxis: {
            //min:0,
            //max:16,
            minRange:.5,
            title: {
                text: 'Давление'
            },
        },
        plotOptions: {
            series: {
                threshold:40
            },
            spline:{
                marker:{
                    enabled:false
                },
            },
        },
        series:[{
            type: 'spline',
            name: 'Нефтебаза',
            //data:[0,3,4,3,12,15,2],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"orange"
        },{
            type: 'spline',
            name: 'Причал',
            //data:[0,5,2,7,1,4,7],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"cyan"
        }]
    };
    var Trend_arj_setting = {
        credits:{enabled:false},
        chart: {
            //height:250,
            renderTo:Global.mainTrendContainer,  
            zoomType:"x"
        },
        boost: {
            useGPUTranslations: true
        },
        title: {
            //enabled:false,
            text: ''
        },
        scrollbar:{
            enabled:false,
            //liveRedraw:false
        },
        navigator:{
            //adaptToUpdatedData:false,
            enabled:false,
            height:10
        },
        rangeSelector:{
            
            buttons:[{
                type:"hour",
                count:1,
                text:"1ч"
            },{
                type:"hour",
                count:3,
                text:"3ч"
            },{
                type:"hour",
                count:8,
                text:"8ч"
            },{
                type:"hour",
                count:12,
                text:"12ч"
            },{
                type:"day",
                count:1,
                text:"1д"
            },{
                type:"week",
                count:1,
                text:"7д"
            },{
                type:"all",
                text:"Все"
            }],
            selected:1,
            inputEnabled: false
        },
        legend: {
            enabled: true
        },
        xAxis: {
            id:"timeline",
            type: 'datetime',
            ordinal:false,
            events:{
                afterSetExtremes:function(e){
                    trendDetail(e);
                    let interval = e.max-e.min;
                    if(interval < 365*24*3600*1000){
                        //снимаем лок с кнопки калькуляции
                        if($("#btn_intToggleArj").hasClass("active")){
                            //при условии что включем DS в режиме архива
                            $("#btn_calc_auto").removeClass("disabled");
                        }
                    }else {
                        $("#btn_calc_auto").addClass("disabled");
                    }
                    // console.log(e);
                }
            }
        },
        yAxis: {
            title: {
                text: 'Давление'
            },
            softMin:0.005,
            softMax:0.01
        },
        plotOptions: {
            series: {
                threshold:40,
                allowPointSelect:true
            },
            line:{
                marker:{
                    enabled:false
                },
            },
            scatter: {
                marker: {
                    symbol:"circle",
                    radius: 10,
                }
            }
        },
        series:[{
            id:'nbtrend',
            type: 'line',
            name: 'Нефтебаза',
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"orange",
            point:{
                events:{
                    select:function(point){
                        console.log("Point NB selected");
                        console.log(point);
                        //------------------
                        $(".pointNButc").text(point.target.x);
                        $(".pointNBval").text(point.target.y+" кг/м2");
                        Global.manPointNB = true;
                        if(Global.manPointNB && Global.manPointP){
                            $("#btn_calc").removeClass("disabled");
                        }
                    }
                }
            }
        },{
            id:'ptrend',
            type: 'line',
            name: 'Причал',
            tooltip: {
                valueDecimals: 2,
                valueSuffix:' кг/см2'
            },
            color:"cyan",
            point:{
                events:{
                    select:function(point){
                        console.log("Point Prichal selected");
                        console.log(point);
                        //------------------
                        $(".pointPutc").text(point.target.x);
                        $(".pointPval").text(point.target.y+" кг/м2");
                        Global.manPointP = true;
                        if(Global.manPointNB && Global.manPointP){
                            $("#btn_calc").removeClass("disabled");
                        }
                    }
                }
            }
        },{
            id:'flood',
            point:{
                events:{
                    click:function (e) {
                        e.stopPropagation();
                        console.log("point:",this);
                        calcPoint(this.flood);
                    }
                }
            },
            type: 'scatter',
            color: 'rgba(223, 83, 83, .5)',
            name:'Протечки'
        },{
            id:'floodp',
            type: 'scatter',
            color: 'cyan',
            linkedTo:'ptrend',
            
        },{
            id:'floodnb',
            type: 'scatter',
            color: 'orange',
            linkedTo:'nbtrend'
        }]
    };
    Global.Trend1 = new Highcharts.Chart(Trend_rt_setting1);
    Global.Trend2 = new Highcharts.Chart(Trend_rt_setting2);
    Global.Trend3 = new Highcharts.Chart(Trend_rt_setting3);
    Global.Trend4 = new Highcharts.Chart(Trend_rt_setting4);
    Global.MainTrend = new Highcharts.StockChart(Trend_arj_setting);
    $(document).on("keydown",function (e) {
        // console.log("key down:",e);
        if(e.keyCode == 37 && !e.ctrlKey){//Left No ctrl
            var request = {trigger:"keydown",back:true,ctrl:false};
            trendDetail(request);
        }
        if(e.keyCode == 37 && e.ctrlKey){//Left with ctrl
            var request = {trigger:"keydown",back:true,ctrl:true};
            trendDetail(request);
        }
        if(e.keyCode == 39 && !e.ctrlKey){//Right No ctrl
            var request = {trigger:"keydown",front:true,ctrl:false};
            trendDetail(request);
        }
        if(e.keyCode == 39 && e.ctrlKey){//Right with ctrl
            var request = {trigger:"keydown",front:true,ctrl:true};
            trendDetail(request);
        }
        if(e.keyCode == 40){//Down key for out zoom
            var request = {trigger:"keydown",down:true,ctrl:false};
            trendDetail(request);
        }
    });
    $("#arj_trend").on("contextmenu",function (e) {
        e.preventDefault();
        var request = {trigger:"keydown",down:true,ctrl:false};
        trendDetail(request);
    });
});
