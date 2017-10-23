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
        if(sdsettings){
            this.deltasigmasettings = sdsettings;
        }else {
            throw new Error("Нет входных данных Дельта-сигма интегратора");
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
        }else {
            throw new Error("Нет подключения для выходного контейнера");
        }
        if(cb) {
            this.callbackFunc = cb;
        }
    }
}