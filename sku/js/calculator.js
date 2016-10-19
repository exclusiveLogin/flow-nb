Calculator = function(speed,distance){
    this.res = {
            error:true,
            errTxt:"что то пошло не так...",
            rel:null,
            fromNB:null,
            fromP:null
        };
    
    this.waveSpeed = speed | 1200;
    this.distance = distance | 1743;
    this.center = Number(Number(this.distance/2).toFixed(1));
    this.pointNB = null;
    this.pointP = null;
    this.utcDiff = null;
    this.baseFirst = undefined;
    this.setPoints = function(poiNB,poiP){
        if(poiNB){
            this.pointNB = poiNB;
        }else{
            this.res.error = true;
            this.res.errTxt = "Нет данных точки NB";
            return this.res;
        }
        if(poiP){
            this.pointP = poiP;
        }else{
            this.res.error = true;
            this.res.errTxt = "Нет данных точки P";
            return this.res;
        }
        if(this.pointNB >= this.pointP){
            this.baseFirst = false;
        }else{
            this.baseFirst = true;
        }
    };
    this.calc = function(){
        
        if(this.baseFirst == undefined){
            //ошибка
            this.res.error = true;
            this.res.errTxt = "Нет данных точки diff";
            return this.res;
        }else{
            //вычисляем
            if(this.pointNB && this.pointP){
                this.utcDiff = this.pointNB - this.pointP;
                this.res.rel = this.utcDiff/1000*this.waveSpeed;//from center
                this.res.firstNB = this.baseFirst;
                this.res.fromNB = (this.center + this.res.rel).toFixed(1);
                this.res.fromP = (this.distance - this.res.fromNB).toFixed(1);
                if((this.res.rel > this.center) || (this.res.rel < (0 - this.center))){
                    this.res.out = true;
                    this.res.error = true;
                    this.res.errTxt = "Место расчета выходит за пределы трубы";
                }else{
                    this.res.out = false;
                    this.res.error = false;
                    this.res.errTxt = "all ok";
                }
                return this.res;
            }else{
                this.res.error = true;
                this.res.errTxt = "Нет точки P или NB";
                return this.res;
            }
        }
    };
}