const conn = require('../../config/dbconnect');

let Mdl = {
    getAllCustomer: async()=>{
        try{
            let sql = "SELECT * FROM t_customer WHERE is_deleted = 'N'";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getAllDistrict: async()=>{
        try{
            let sql = "SELECT * FROM t_district";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getAllSpv: async()=>{
        try{
            let sql = "SELECT * FROM t_spv";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getAllAtm :async(param)=>{
        try{
            let sqlParam = [];
            let sqlplus = "";
            let i = 1;
            if(Object.keys(param).length > 0 && param.constructor === Object){
                for(let a in param){
                    sqlplus += (i==1?"WHERE ":" AND ") + a + " = ? ";
                    sqlParam.push(param[a]);
                    i++;
                }
                let sql = "SELECT * FROM t_atm " +sqlplus;
                let res = await conn.query(sql,sqlParam);
                return {
                    status : true,
                    data : res[0]
                };
            }
            
            return {
                status : true,
                data : {}
            };
        }catch(err){
            return {
                status : false,
                data: {},
                message: err.message
            };
        }
    },

    getAtm :async(id)=>{
        try{
            console.log(id);
            let sql = "SELECT * FROM t_atm WHERE id = ?";
            let res = await conn.query(sql,[id]);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    updateAtm:async(id,data)=>{  
        let x = [];
        let v = "";
        let ix = 0;
        for(var i in data){
            v += ((ix!=0)?", ":" ") + i +" = ? " ;
            x.push(data[i]);
            ix++;
        }
        x.push(id);
        try{
            let sql = "UPDATE t_atm SET " + v + " WHERE id = ? ";
            let res = await conn.query(sql,x);
            
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },
};

module.exports = Mdl;