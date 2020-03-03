const showData = {
    oneRecord:(datax,dataToShow)=>{
        if(!datax)return [];
        var x = {};
        for(var k in datax){
            if(dataToShow.includes(k)){
                x[k] = datax[k];
            }
        }
        return x;
        
    },
    manyRecord:(datax,dataToShow)=>{
        if(datax.length ==0)return {};
        var data=[];
        for(var key in datax){
            var x = {};
            for(var k in datax[key]){
                if(dataToShow.includes(k)){
                    x[k] = datax[key][k];
                }
            }
            data.push(x);
            
        }
        return data;
    }
}

module.exports = showData;