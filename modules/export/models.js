const conn = require('../../config/dbconnect');


let Mdl = {
    getAllList : async(param,custom = "", custParam = [])=>{
        try{
            let paramRes = [];
            let sqlParam = [];
            let sqlplus = "";
            if(param){
                for(let a in param){
                    sqlplus += " AND " + a + " = ? ";
                    sqlParam.push(param[a]);
                }
            }
            paramRes = sqlParam.concat(custParam);
            
            let sql = "SELECT \
                            dm_main.*,\
                            t_spv.fse_spv_name,\
                            REPLACE(CAST(DATEDIFF(open_ticket,NOW()) AS CHAR(10)),'-','') AS aging \
                        FROM dm_main \
                        INNER JOIN t_spv ON t_spv.fse_spv = dm_main.atm_spv\
                        WHERE is_deleted = 'N' " +sqlplus + custom;
            console.log(sql);
            console.log(paramRes);
            
            let res = await conn.query(sql,paramRes);
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
    getSummaryList : async(param,custom = "", custParam = [],date,dateParam)=>{
        try{
            let paramRes = [];
            let sqlParam = [];
            let sqlplus = "";
            if(param){
                for(let a in param){
                    sqlplus += " AND " + a + " = ? ";
                    sqlParam.push(param[a]);
                }
            }
            paramRes = sqlParam.concat(dateParam,custParam);
            
            // let sql = "\
            // SELECT \
            //     dmsh.uid,\
            //     dm.open_ticket, \
            //     dm.created_date, \
            //     dm.fs_eta,\
            //     dm.atm_spv,\
            //     dm.atm_owner,\
            //     CAST(dmsh.created_date AS DATE) AS dates,\
            //     CASE \
            //         WHEN dmsh.status_action IS NULL AND (dmsh.`status` = 'PENDING PART' OR dmsh.`status` = 'PENDING ZULU') THEN 'PROCESSING LOGISTIC' \
            //         WHEN dmsh.status_action IS NULL THEN 'OPEN' \
            //         ELSE dmsh.status_action\
            //     END AS 'ACTION',\
            //     CASE\
            //         WHEN dmsh.`status` IS NULL AND (dmsh.created_by = 'logistik_jkt' OR dmsh.status_action ='PROCESSING LOGISTIC') THEN 'PENDING PART'\
            //         WHEN dmsh.`status` IS NULL AND dmsh.status_action = 'CLOSED' THEN 'CLOSED'\
            //         WHEN dmsh.`status` IS NULL AND dmsh.status_action = 'CANCELED' THEN 'CANCELED'\
            //         WHEN dmsh.`status` IS NULL OR dmsh.`status` = '' THEN 'NEW TICKET'\
            //         ELSE dmsh.`status`\
            //     END AS `status`,\
            //     CASE \
            //         WHEN dm.atm_owner REGEXP 'QI|^QUALITA' THEN 'QI'\
            //         WHEN dm.atm_owner REGEXP 'GTI|^GLOBAL' THEN 'GTI'\
            //         WHEN dm.atm_owner REGEXP 'ARK|AKO|^ARKANINDO' THEN 'AKO'\
            //         WHEN dm.atm_owner REGEXP 'CTI|^CITIUS' THEN 'CTI'\
            //         WHEN dm.atm_owner REGEXP '^DNI' THEN 'DNI'\
            //         WHEN dm.atm_owner REGEXP '^UG' THEN 'UG'\
		    //     END AS `owner`,\
            //     dmsh.created_by		\
            // FROM \
            //     (SELECT uid,created_date,`status`,status_action,created_by FROM dm_main_status_history GROUP BY uid,created_date,`status`,status_action,created_by  ) dmsh \
            // INNER JOIN \
            //     (\
            //         SELECT uid, open_ticket, created_date, fs_eta, atm_spv, atm_owner FROM dm_main WHERE  is_deleted = 'N' "+sqlplus + custom
            //     +") dm ON dm.uid = dmsh.uid\

            let sql = " SELECT \
                        dm.uid, \
                        dm.ticket_crm, \
                        dm.`status`, \
                        dm.status_ticket, \
                        dm.status_action AS `ACTION`, \
                        CAST(dm.open_ticket AS DATE) AS dates, \
                        t_spv.fse_spv_name, \
                        t_spv.fse_spv,\
                        CASE \
                            WHEN dm.atm_owner REGEXP 'QI|^QUALITA' THEN 'QI'\
                            WHEN dm.atm_owner REGEXP 'GTI|^GLOBAL' THEN 'GTI'\
                            WHEN dm.atm_owner REGEXP 'ARK|AKO|^ARKANINDO' THEN 'AKO'\
                            WHEN dm.atm_owner REGEXP 'CTI|^CITIUS' THEN 'CTI'\
                            WHEN dm.atm_owner REGEXP '^DNI' THEN 'DNI'\
                            WHEN dm.atm_owner REGEXP '^UG' THEN 'UG'\
                        END AS `owner`\
                    FROM dm_main dm \
                    INNER JOIN t_spv ON t_spv.fse_spv = dm.atm_spv\
                    WHERE is_deleted = 'N' "+sqlplus + custom
            + ((date)?date:"")+"";
             console.log(sql)
            // console.log(param)
            let res = await conn.query(sql,paramRes);
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
    }
};

module.exports = Mdl;