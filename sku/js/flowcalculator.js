class FlowCalculator{
    constructor(data_p,data_nb,integrator_p,integrator_nb,view,cb){
        if(data_p){
            this.data_p = data_p;
        }else {
            throw new Error("Нет входных данных Причала");
        }
        if(data_nb){
            this.data_nb = data_nb;
        }else {
            throw new Error("Нет входных данных Нефтебазы");
        }
        if(integrator_p){
            this.integrator_p = integrator_p;
        }else {
            throw new Error("Нет Дельта-сигма интегратора для потока причала");
        }
        if(integrator_nb){
            this.integrator_nb = integrator_nb;
        }else {
            throw new Error("Нет Дельта-сигма интегратора для потока нефтебазы");
        }
        if(cb) {
            this.callbackFunc = cb;
        }
        console.log("FlowCalc создан");
    }
    setDataStream(data_p,data_nb){
        if(data_p){
            this.data_p = data_p;
        }else {
            console.log("Нет входных данных Причала");
        }
        if(data_nb){
            this.data_nb = data_nb;
        }else {
            console.log("Нет входных данных Нефтебазы");
        }
    }
    calcFlow(data_p,data_nb,cb){
        if((this.data_p || data_p) && (this.data_nb || data_nb)){
            this.prevMaxP = false;
            this.prevMaxNB = false;
            //resetors
            if(data_p){
                this.data_p = data_p;
            }
            if(data_nb){
                this.data_nb = data_nb;
            }
            if(cb){
                this.callbackFunc = cb;
            }

            if(this.data_p && this.data_nb){
                let peaks_splised_p = [];
                let peaks_splised_nb = [];
                //stream 1
                this.data_p.map(function (elem,idx) {
                    let current_val=this.integrator_p.Integrity(elem.value);
                    if(idx > this.integrator_p.Buffer.length-1){
                        //фильтруем первые мат ошибки
                        if(this.checkMaxP(current_val)){
                            //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                            peaks_splised_p.push(this.data_p[idx-1]);
                        }
                    }
                },this);

                //stream 2
                this.data_nb.map(function (elem,idx) {
                    let current_val=this.integrator_nb.Integrity(elem.value);
                    if(idx > this.integrator_nb.Buffer.length-1){
                        //фильтруем первые мат ошибки
                        if(this.checkMaxNB(current_val)){
                            //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                            peaks_splised_nb.push(this.data_nb[idx-1]);
                        }
                    }
                },this);

                //отдаем для анализа
                let Calcresult = this.checkAnswerPoints(peaks_splised_p,peaks_splised_nb);
                if(this.callbackFunc)this.callbackFunc();//если есть колбек, выполняем
                return Calcresult;
            }
        }

    }

    checkMaxP(nextval){
        //проверка вверх и вниз
        if(this.prevMaxP){
            let tmpAbs = Math.abs(nextval);
            //если новый пик и локер установлен то сбрасывает до следующего заднего фронта
            if((tmpAbs > this.prevMaxP) && (this.downlockP))this.downlockP = false;
            if((tmpAbs < this.prevMaxP) && (!this.downlockP)){
                //проверяем абс значения максимума
                //любое падение воспринимается как достижение максимума
                this.prevMaxP = tmpAbs;
                this.downlockP = true;
                return true;
            }
        }else {
            //write init max
            this.prevMaxP = Math.abs(nextval);
        }
        return false;
    }
    checkMaxNB(nextval){
        //проверка вверх и вниз
        if(this.prevMaxNB){
            let tmpAbs = Math.abs(nextval);
            //если новый пик и локер установлен то сбрасывает до следующего заднего фронта
            if((tmpAbs > this.prevMaxNB) && (this.downlockNB))this.downlockNB = false;
            if((tmpAbs < this.prevMaxNB) && (!this.downlockNB)){
                //проверяем абс значения максимума
                //любое падение воспринимается как достижение максимума
                this.prevMaxNB = tmpAbs;
                this.downlockNB = true;
                return true;
            }
        }else {
            //write init max
            this.prevMaxNB = Math.abs(nextval);
        }
        return false;
    }

    checkAnswerPoints(stream1,stream2){
        if(stream1 && stream2){
            let result = [];

            for (let id in stream1){
                for(let idx in stream2){
                    if((stream2[idx].utc - stream1[id].utc > 0) && (stream2[idx].utc - stream1[id].utc < 2000)){
                        //проверка на полярность величины
                        if((stream1[id].value > 0 && stream2[idx].value > 0)||(stream1[id].value < 0 && stream2[idx].value < 0)){
                            result.push([stream1[id],{nbpts:stream1[id],ppts:stream2[idx]}]);
                        }
                    }
                }
            }
            for (let id in stream2){
                for(let idx in stream1){
                    if((stream1[idx].utc - stream2[id].utc > 0) && (stream1[idx].utc - stream2[id].utc < 2000)){
                        if((stream2[id].value > 0 && stream1[idx].value > 0)||(stream2[id].value < 0 && stream1[idx].value < 0)){
                            result.push([stream2[id],{nbpts:stream1[idx],ppts:stream2[id]}]);
                        }
                    }
                }
            }
            return result;
        }
    }
    setCallback(cb){
        if(cb){
            this.callbackFunc = cb;
        }else {
            this.callbackFunc = null;
        }
    }
}

export default FlowCalculator;