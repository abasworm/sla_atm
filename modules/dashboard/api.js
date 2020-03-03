const route = require('express').Router();
const auth = require('../../middleware/auth');
const rest = require('../../config/rest');
const Mdl = require('./models');

const toDateString = (s)=>{
    var d = new Date(s);
    Number.prototype.padLeft = function(base,chr){
        var  len = (String(base || 10).length - String(this).length)+1;
        return len > 0? new Array(len).join(chr || '0')+this : this;
    }
    var dformat = [d.getFullYear(),(d.getMonth()+1).padLeft(),
        d.getDate().padLeft()].join('-');
    //     +' ' +
    //   [ d.getHours().padLeft(),
    //     d.getMinutes().padLeft(),
    //     d.getSeconds().padLeft()].join(':');
    return dformat;
} 

route
    .post('/get/customer',auth.isLoginAPI,async(req,res,next)=>{
        let result = await Mdl.getCustomer();
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;
        //console.log(rs);
        let a = [];
        for(var i in rs){
            a.push([rs[i]['atm_customer'],rs[i]['jumlah']]);
        }
        rest.success(a,'success',res);
    })
    .post('/get/range/days',auth.isLoginAPI,async(req,res,next)=>{
        let result = await Mdl.getRangeDays();
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;
        //console.log(rs);
        let a = [];
        for(var i in rs){
            a.push([rs[i]['formatd'],rs[i]['totalx']]);
        }
        rest.success(a,'success',res);
    })
    .post('/get/status/action',auth.isLoginAPI,async(req,res,next)=>{
        let result = await Mdl.getStatusAction();
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;
        //console.log(rs);
        let a = [];
        for(var i in rs){
            a.push([rs[i]['status_action'],rs[i]['jumlah']]);
        }
        rest.success(a,'success',res);
    })
    .post('/get/status/list',auth.isLoginAPI,async(req,res,next)=>{
        let result = await Mdl.getStatus();
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;
        //console.log(rs);
        let a = [];
        for(var i in rs){
            a.push([rs[i]['status'],rs[i]['jumlah']]);
        }
        rest.success(a,'success',res);
    })

    .post('/get/status/summary',auth.isLoginAPI,async(req,res,next)=>{  
        let result = await Mdl.getStatusSummary();
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;
        //console.log(rs);

        let a = {};
        for(var i in rs){
            console.log(rs[i]);
            if(!a[rs[i].dates]){
                a[rs[i].dates] ={};
            }
            if(!a[rs[i].dates][rs[i].status_action]){
                a[rs[i].dates][rs[i].status_action] ={};
            }
            a[rs[i].dates][rs[i].status_action] = rs[i].cact;
        }

        let result1 = await Mdl.getStatusSum();
        if(!result1.status) await rest.error('',result1.message,res);
        y = result1.data; // STATUS LIST

        let b = [];
        let fi = [];
        for(var cx in a){
            fi.push(toDateString(cx));
        }

        for(var d in y){
            let f = [y[d].status_action]
            for(var x in a){
                var c = (a[x][y[d].status_action])?a[x][y[d].status_action]:0;
                f.push(c);
            // let c = [a.x];
            // for(var d in y){
            //     if(a[x][y[d].status_action]) c.push
            }
            b.push(f);
        }
        var btx = {
            data : b,
            field: fi
        }
        rest.success(btx,'success',res);
    })

    .post('/get/open/today',auth.isLoginAPI,async(req,res,next)=>{
        cust = "";
        if(req.session.user_group == 7){
            let usern = req.session.username;
            
            let partner = usern.split('_')[0].toUpperCase();
            
            switch(partner){
                case 'QI' : 
                    cust += " AND atm_owner REGEXP 'QI|^QUALITA' ";break;
                case 'GTI' :
                    cust += " AND atm_owner REGEXP 'GTI|^GLOBAL' ";break;
                case 'ARK' :
                    cust += " AND atm_owner REGEXP 'ARK|AKO|^ARKANINDO' ";break;
                case 'CTI' :
                    cust += " AND atm_owner REGEXP 'CTI|^CITIUS' ";break;
            }
        }
        let result = await Mdl.getTodayOpenTicket(cust);
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;        
        rest.success(rs,'success',res);
    })
    .post('/get/open/all',auth.isLoginAPI,async(req,res,next)=>{
        cust = "";
        if(req.session.user_group == 7){
            let usern = req.session.username;
            
            let partner = usern.split('_')[0].toUpperCase();
            
            switch(partner){
                case 'QI' : 
                    cust += " AND atm_owner REGEXP 'QI|^QUALITA' ";break;
                case 'GTI' :
                    cust += " AND atm_owner REGEXP 'GTI|^GLOBAL' ";break;
                case 'ARK' :
                    cust += " AND atm_owner REGEXP 'ARK||AKO|^ARKANINDO' ";break;
                case 'CTI' :
                    cust += " AND atm_owner REGEXP 'CTI|^CITIUS' ";break;
            }
        }
        let result = await Mdl.getAllOpenTicket(cust);
        if(!result.status) await rest.error('',result.message,res);
        const rs = result.data;
        rest.success(rs,'success',res);
    });



module.exports = route;
