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
        if(view){
            this.viewContainerId = view;
            this.viewContainer = $(view);
            this.btn = this.viewContainer.find("#btn_calc_auto");
            this.console_p = this.viewContainer.find(".streamlog .p");
            this.console_nb = this.viewContainer.find(".streamlog .nb");
            this.container_p = this.viewContainer.find(".streamcontainer .p");
            this.container_nb = this.viewContainer.find(".streamcontainer .nb");
            this.viewData = {};
            this.viewData.p = {};
            this.viewData.nb = {};
            this.viewData.p.calc_cur_step = this.container_p.find(".calc_cur_step");
            this.viewData.p.calc_cur_maxval = this.container_p.find(".calc_cur_maxval");
            this.viewData.p.calc_cur_utc = this.container_p.find(".calc_cur_utc");
            this.viewData.p.calc_peaks = this.container_p.find(".calc_peaks");
            this.viewData.p.calc_answer_peaks = this.container_p.find(".calc_answer_peaks");
            this.viewData.p.calc_all_steps = this.container_p.find(".calc_all_steps");
            this.viewData.p.calc_est_steps = this.container_p.find(".calc_est_steps");
            this.viewData.p.calc_idx = this.container_p.find(".calc_idx");
            this.viewData.p.calc_cur_delta = this.container_p.find(".calc_cur_delta");
            this.viewData.p.calc_tune = this.container_p.find(".calc_tune");

            this.viewData.nb.calc_cur_step = this.container_nb.find(".calc_cur_step");
            this.viewData.nb.calc_cur_maxval = this.container_nb.find(".calc_cur_maxval");
            this.viewData.nb.calc_cur_utc = this.container_nb.find(".calc_cur_utc");
            this.viewData.nb.calc_peaks = this.container_nb.find(".calc_peaks");
            this.viewData.nb.calc_answer_peaks = this.container_nb.find(".calc_answer_peaks");
            this.viewData.nb.calc_all_steps = this.container_nb.find(".calc_all_steps");
            this.viewData.nb.calc_est_steps = this.container_nb.find(".calc_est_steps");
            this.viewData.nb.calc_idx = this.container_nb.find(".calc_idx");
            this.viewData.nb.calc_cur_delta = this.container_nb.find(".calc_cur_delta");
            this.viewData.nb.calc_tune = this.container_nb.find(".calc_tune");

        }else {
            throw new Error("Нет подключения для выходного контейнера");
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
                //stream 1
                let peaks_p = this.data_p.map(function (elem,idx) {
                    let current_val=this.integrator_p.Integrity(elem.value);
                    if(idx > this.integrator_p.Buffer.length-1){
                        //фильтруем первые мат ошибки
                        if(this.checkMaxP(current_val)){
                            //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                            return this.data_p[idx-1];
                        }
                    }
                },this);

                //stream 2
                let peaks_nb = this.data_nb.map(function (elem,idx) {
                    let current_val=this.integrator_nb.Integrity(elem.value);
                    if(idx > this.integrator_nb.Buffer.length-1){
                        //фильтруем первые мат ошибки
                        if(this.checkMaxNB(current_val)){
                            //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                            return this.data_nb[idx-1];
                        }
                    }
                },this);

                let peaks_splised_p = [];
                let peaks_splised_nb = [];
                for(let check in peaks_p){
                    if (peaks_p[check] != undefined){
                        peaks_splised_p.push(peaks_p[check]);
                    }
                }
                for(let check in peaks_nb){
                    if (peaks_nb[check] != undefined){
                        peaks_splised_nb.push(peaks_nb[check]);
                    }
                }

                //готовим массивы
                let peaks_p_fine = [];
                let peaks_nb_fine = [];
                for(let peak in peaks_splised_p){
                    peaks_p_fine[peaks_splised_p[peak].utc] = peaks_splised_p[peak].value;
                }
                for(let peak in peaks_splised_nb){
                    peaks_nb_fine[peaks_splised_nb[peak].utc] = peaks_splised_nb[peak].value;
                }

                //отдаем для анализа
                if(this.callbackFunc)this.callbackFunc();//если есть колбек, выполняем
                let Calcresult = this.checkAnswerPoints(peaks_p_fine,peaks_nb_fine);
                //console
                //console.log("calc return:",Calcresult);
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
                    if((idx-id > 0) && (idx-id < 2000)){
                        result.push(id);
                    }
                }
            }
            for (let id in stream2){
                for(let idx in stream1){
                    if((idx-id > 0) && (idx-id < 2000)){
                        result.push(id);
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