class FlowTest{
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
                        //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                        let tmpel = {};
                        Object.assign(tmpel,elem);
                        tmpel.value = current_val;
                        tmpel.x = Number(elem.utc);
                        tmpel.y = Number(current_val);
                        peaks_splised_p.push(tmpel);
                    }
                },this);

                //stream 2
                this.data_nb.map(function (elem,idx) {
                    let current_val=this.integrator_nb.Integrity(elem.value);
                    if(idx > this.integrator_nb.Buffer.length-1){
                        //фильтруем первые мат ошибки
                        //если максимальное то берем предыдушее значение и возвращаем в массив пиков
                        let tmpel = {};
                        Object.assign(tmpel,elem);
                        tmpel.value = current_val;
                        tmpel.x = Number(elem.utc);
                        tmpel.y = Number(current_val);
                        peaks_splised_nb.push(tmpel);
                    }
                },this);

                if(this.callbackFunc)this.callbackFunc();//если есть колбек, выполняем
                return [peaks_splised_p,peaks_splised_nb];
            }
        }

    }
}

export default FlowTest;