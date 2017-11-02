class FlowCalculator{
    constructor(data_p,data_nb,integrator_p,integrator_nb,cb){
        this.integrator_p = {};
        this.integrator_nb = {};
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
            Object.assign(this.integrator_p, integrator_p);
        }else {
            throw new Error("Нет Дельта-сигма интегратора для потока причала");
        }
        if(integrator_nb){
            Object.assign(this.integrator_nb, integrator_nb);
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
                            if(this.prevValP)this.data_p[idx-1].value = this.prevValP;
                            peaks_splised_p.push(this.data_p[idx-1]);
                        }
                    }
                    this.prevValP = current_val;
                },this);

                //stream 2
                this.data_nb.map(function (elem,idx) {
                    let current_val=this.integrator_nb.Integrity(elem.value);
                    if(idx > this.integrator_nb.Buffer.length-1){
                        //фильтруем первые мат ошибки
                        if(this.checkMaxNB(current_val)){
                            //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                            if(this.prevValNB)this.data_nb[idx-1].value = this.prevValNB;
                            peaks_splised_nb.push(this.data_nb[idx-1]);
                        }
                    }
                    this.prevValNB = current_val;
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
        let tmpAbs = Math.abs(nextval);
        if(this.prevMaxP){
            //если новый пик и локер установлен то сбрасывает до следующего заднего фронта
            if(tmpAbs > this.prevMaxP)this.downlockP = false;
            if(tmpAbs <= this.prevMaxP){
                if(!this.downlockP){
                    //проверяем абс значения максимума
                    //любое падение воспринимается как достижение максимума
                    this.downlockP = true;
                    return true;
                }
            }
        }
        this.prevMaxP = tmpAbs;
        return false;
    }
    checkMaxNB(nextval){
        //проверка вверх и вниз
        let tmpAbs = Math.abs(nextval);
        if(this.prevMaxNB) {
            //если новый пик и локер установлен то сбрасывает до следующего заднего фронта
            if (tmpAbs > this.prevMaxNB) this.downlockNB = false;
            if (tmpAbs <= this.prevMaxNB) {
                if (!this.downlockNB) {
                    //проверяем абс значения максимума
                    //любое падение воспринимается как достижение максимума
                    this.downlockNB = true;
                    return true;
                }
            }
        }
        this.prevMaxNB = tmpAbs;
        return false;
    }

    checkAnswerPoints(stream1,stream2){
        if(stream1 && stream2){
            let result = [];

            for (let id in stream1){
                for(let idx in stream2){
                    if((stream2[idx].utc - stream1[id].utc > 0) && (stream2[idx].utc - stream1[id].utc < 1700)){
                        //проверка на полярность величины
                        if(stream1[id].value > 0 && stream2[idx].value > 0){
                            result.push([stream1[id],{ppts:stream1[id],nbpts:stream2[idx]}]);
                            break;
                        }
                        if(stream1[id].value < 0 && stream2[idx].value < 0){
                            result.push([stream1[id],{ppts:stream1[id],nbpts:stream2[idx]}]);
                            break;
                        }
                    }
                }
            }
            for (let id in stream2){
                for(let idx in stream1){
                    if((stream1[idx].utc - stream2[id].utc > 0) && (stream1[idx].utc - stream2[id].utc < 1700)){
                        if(stream2[id].value > 0 && stream1[idx].value > 0){
                            result.push([stream2[id],{ppts:stream1[idx],nbpts:stream2[id]}]);
                            break;
                        }
                        if(stream2[id].value < 0 && stream1[idx].value < 0){
                            result.push([stream2[id],{ppts:stream1[idx],nbpts:stream2[id]}]);
                            break;
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