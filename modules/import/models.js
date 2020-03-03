const conn = require('../../config/dbconnect');
const table_name =  'dm_main';

let Mdl = {
    checkDm : async(id)=>{
        try{
            let sql = "SELECT count(*) jumlah FROM sl_main WHERE is_deleted = 'N' AND ticket_crm = ?";
            let res = await conn.query(sql,[id]);
            return {
                status : true,
                data : res[0][0].jumlah
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    insertTmp: async(data)=>{
        let x = [];
        let y = [];
        let v = "";
        let z = "";
        let ix = 0;
        for(var i in data){
            y.push(i);
            x.push(data[i]);
            
            v += (ix==0)?"?":',?'
            ix++;
        }
        z = y.join(',');
        try{
            let sql = "INSERT INTO sl_main_tmp("+ z +") VALUES("+v+")";
            console.log(x[6]);
            // console.table(x);
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

    deleteTmp: async()=>{
        try{
            let sql = "TRUNCATE TABLE sl_main_tmp";
            console.log(sql);
            
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

    getDataSL: async()=>{
        try{
            let sql = "SELECT * FROM sl_main_tmp";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                data: 0,
                message: err.message
            };
        }
    },

    transferTmp: async()=>{
        try{
            let sql = "INSERT IGNORE INTO sl_main(uid,ticket_crm,open_ticket,atm_sn,atm_id,description,atm_location,atm_machine_type,atm_customer,atm_vendor,problem_category,problem_clasification,problem_detail,problem_start,worktime_start,worktime_end,worktime_operational,activity,status,action,notes,created_by,created_date,deleted_by,deleted_date,is_deleted)\
                SELECT uid,ticket_crm,open_ticket,atm_sn,atm_id,description,atm_location,atm_machine_type,atm_customer,atm_vendor,problem_category,problem_clasification,problem_detail,problem_start,worktime_start,worktime_end,worktime_operational,activity,status,action,notes,created_by,created_date,deleted_by,deleted_date,is_deleted FROM sl_main_tmp";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                data: 0,
                message: err.message
            };
        }
    },

}

module.exports = Mdl;