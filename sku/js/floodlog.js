class FloodLog{
    constructor(el){
        if(el){
            this.Log = $(el);
            if(!this.Log[0])throw new Error("DOM элемент FloodLog не найден");
        }else{
            throw new Error("Нет DOM элемента в конструкторе FloodLog");
        }
        this.showed = false;
    }
    openLog(){
        this.Log.show();
    }
    closeLog(){
        this.Log.hide();
    }
    write2log(data){
        //если закрыт открываем
        if(!this.showed)this.openLog();
        
        //заполняем таблицу
        this.Log.find("table").append(`<tr class="flood">
                                            <td>${data.uid}</td>
                                            <td>${data.time}</td>
                                            <td>${data.timeOffset}</td>
                                            <td>${data.fromNB}</td>
                                            <td>${data.fromP}</td>
                                            <td>${data.offset}</td>
                                        </tr>`);
    }
    clearLog(){
        this.Log.find("tr.flood").remove();
        this.closeLog();
    }
}

export default FloodLog;