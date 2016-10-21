function Integrator(){
    this.lastPoint = 0;
    this.filtered = true;
    this.integrityOnly = false;
    this.prefilterPoints = 1;
    this.postfilterPoints = 1;
    
    
    this.Buffer = [0,0];
    
    this.setFilter = function(pre, post){
        this.Buffer = [];
        //----------Post points------------
        for(var el=0; el<post; el++){
            this.Buffer.push(0);
        }
        //-----------Pre points------------
        for(var el=0; el<pre; el++){
            this.Buffer.push(0);
        }
        
        this.prefilterPoints = pre;
        this.postfilterPoints = post;
        
        if(pre || post){
            this.filtered = true;
        }else{
            this.filtered = false;
        }
    };
    
    this.Integrity = function(val){
        var ret;
        if(!this.filtered){
            ret = val - this.lastPoint;
            this.lastPoint = val;
            
        }else{
            this.Buffer.shift();
            this.Buffer.push(val);
            if(this.integrityOnly){
                var Interg = this.DFilter();
            }else{
                var Interg = this.Filter();
            }
        }
        return Interg;
    };
    
    this.Filter = function(){
        if(this.Buffer.length){
            var summPost = 0.0;
            var summPre = 0.0;
            for(var el = 0; el<this.Buffer.length; el++){
                if(el<this.postfilterPoints){
                    summPost += this.Buffer[el];
                }else{
                    summPre += this.Buffer[el];
                }
                
            }
            var avrPost = summPost/this.postfilterPoints;
            var avrPre = summPre/this.prefilterPoints;
            ret = avrPre - avrPost;
            return ret;
        }
    };
    this.DFilter = function(){
        if(this.Buffer.length){
            var summ = 0.0;
            for(var el = 0; el<this.Buffer.length; el++){
                summ += this.Buffer[el];
            }
            var avr = summ/this.Buffer.length;
            return avr;
        }
    };
};
Global.IntegratorCon = true;
