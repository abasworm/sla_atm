const conn = require('../../config/dbconnect');

let Mdl = {

    getAllOpenTicket:async(cust)=>{
        try{
            let sql = "SELECT COUNT(dm.uid) jumlah FROM dm_main dm WHERE status_action NOT IN ('CANCELED','CLOSED') "+cust;
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0][0].jumlah
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getTodayOpenTicket:async(cust)=>{
        try{
            let sql = "SELECT COUNT(dm.uid) jumlah FROM dm_main dm WHERE status_action NOT IN ('CANCELED','CLOSED') AND (dm.created_date BETWEEN DATE_ADD(NOW(), INTERVAL -1 DAY) AND NOW()) " +cust;
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0][0].jumlah
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getCustomer:async()=>{
        try{
            let sql = "SELECT dm.atm_customer, COUNT(dm.atm_customer) jumlah FROM dm_main dm WHERE status_action NOT IN ('CANCELED','CLOSED') GROUP BY dm.atm_customer ORDER BY COUNT(dm.atm_customer) DESC";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getStatusAction:async()=>{
        try{
            let sql = "SELECT dm.status_action, COUNT(dm.status_action) jumlah FROM dm_main dm WHERE status_action NOT IN ('CANCELED','CLOSED') GROUP BY dm.status_action ORDER BY COUNT(dm.status_action) DESC";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },


    getStatusSummary:async()=>{
        try{
            let sql = "SELECT \
                    dms.status_action, \
                    count(status_action) cact, \
                    DATE(dms.created_date) dates \
                FROM dm_main_status_history dms \
                WHERE dms.created_date BETWEEN DATE_ADD(NOW(), INTERVAL -7 DAY) AND NOW() \
                GROUP BY DATE(dms.created_date), dms.status_action \
                HAVING status_action IS NOT NULL";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getRangeDays:async()=>{
        try{
            let sql = "\
                SELECT \
                    ok.formatd, \
                    SUM(ok.total) totalx \
                FROM \
                (\
                    SELECT \
                        COUNT(uid) total,\
                        DATEDIFF(dm.open_ticket,NOW()) AS aging,\
                        CASE \
                        WHEN DATEDIFF(dm.open_ticket,NOW()) > -1 THEN 'Less than 1 days'\
                        WHEN DATEDIFF(dm.open_ticket,NOW()) <= -1 AND DATEDIFF(dm.open_ticket,NOW()) > -3 THEN 'Greater than 1 and less than 3 days'\
                        WHEN DATEDIFF(dm.open_ticket,NOW()) <= -3 THEN 'Greater than 3 days'\
                        END AS formatd\
                    FROM dm_main AS dm WHERE dm.status_action NOT IN ('CLOSED', 'CANCELED')\
                    GROUP \
                        BY DATEDIFF(dm.open_ticket,NOW()),\
                        CASE \
                        WHEN DATEDIFF(dm.open_ticket,NOW()) > -1 THEN 'Less than 1 days'\
                        WHEN DATEDIFF(dm.open_ticket,NOW()) <= -1 AND DATEDIFF(dm.open_ticket,NOW()) > -3 THEN 'Greater than 1 and less than 3 days'\
                        WHEN DATEDIFF(dm.open_ticket,NOW()) <= -3 THEN 'Greater than 3 days'\
                        END\
                ) AS ok\
                GROUP BY ok.formatd\
                ORDER by SUM(ok.total) DESC";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getStatusSum:async()=>{
        try{
            let sql = "SELECT * FROM dm_status_action";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    getStatus:async()=>{
        try{
            let sql = "SELECT dm.status, COUNT(dm.status) jumlah FROM dm_main dm WHERE status_action NOT IN ('CANCELED','CLOSED') GROUP BY dm.status ORDER BY COUNT(dm.status) DESC";
            let res = await conn.query(sql);
            return {
                status : true,
                data : res[0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    }
    
}

module.exports = Mdl;
