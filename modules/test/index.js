'use strict';

const route = require('express').Router();
const rest = require('../../config/rest');
const view = require('../../config/templating');

const conn = require('../../config/dbconnect');

const { isLogin } = require('../../middleware/auth');

const _layout = {
    title : 'Welcome to dashboard'
}

let Mdl = {
    checkDm : async(date1, date2)=>{
        try{
            let sql = "\
            SELECT \
                dm.atm_sn,\
                dm.ticket_crm ,\
                dm.open_ticket,\
                dm.fs_eta_start AS `work_start`,\
	            dm.fs_eta AS `work_finish`,\
                dm.created_date AS `time_created`,\
                dmsh.created_date AS `time_action`,\
                dmsh.status_action,\
                dmsh.created_by\
            FROM \
                dm_main dm\
                INNER JOIN dm_main_status_history dmsh ON dmsh.uid = dm.uid\
            WHERE \
                dm.created_date BETWEEN ? AND ?\
            ORDER BY dm.atm_sn, dmsh.created_date ASC\
            ";
            let res = await conn.query(sql,[date1,date2]);
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
    }
}


route
    .get('/', async (req,res,next)=>{
        let pce = {};
        let re = await Mdl.checkDm('2020-02-01','2020-02-05');
        if(!re.status) res.render(404);
        let rd = re.data;

        for(let i in rd){
            if(!pce[rd[i].atm_sn]) {
                pce[rd[i].atm_sn]={};
                pce[rd[i].atm_sn][rd[i].ticket_crm] = {
                    open_ticket: rd[i].open_ticket,
                    work_start: rd[i].work_start,
                    work_finish: rd[i].work_finish,
                    time_created : rd[i].time_created,
                    action_time : [
                        {
                            time_action : rd[i].time_action,
                            status_action : rd[i].status_action,
                            created_by : rd[i].created_by
                        }
                    ]

                }
                
            }else{
                if(!pce[rd[i].atm_sn][rd[i].ticket_crm]){
                    pce[rd[i].atm_sn][rd[i].ticket_crm] = {
                        open_ticket: rd[i].open_ticket,
                        work_start: rd[i].work_start,
                        work_finish: rd[i].work_finish,
                        time_created : rd[i].time_created,
                        action_time : [
                            {
                                time_action : rd[i].time_action,
                                status_action : rd[i].status_action,
                                created_by : rd[i].created_by
                            }
                        ]

                    }
                }else{
                    pce[rd[i].atm_sn][rd[i].ticket_crm].action_time.push(
                        {
                            time_action : rd[i].time_action,
                            status_action : rd[i].status_action,
                            created_by : rd[i].created_by
                        }
                    );
                    
                }
            }
            
        }

        let getDiffDate = (date1,date2)=>{
            let d1 = new Date(date1);
            let d2 = new Date(date2);
            console.log(date1)
            console.log(date2)
            console.log(d1)
            console.log(d2)
            console.log(d2.getTime()-d1.getTime())
            console.log("====================================")

            let difInTime = d2.getTime() - d1.getTime();
            let difInDays = difInTime /(1000*3600*24);

            return difInDays.toFixed(2);
        }

        let getDateTime = (date)=>{
            let d1 = new Date(date);
            return d1;
        }

        let as = {};
        for(let a1 in pce){
            if(!as[a1]){
                as[a1] = {};
                as[a1].action = [];
            }
            for(let a2 in pce[a1]){
                for(let a3 in pce[a1][a2].action_time){

                    let diffDate = 0;
                    let openDate;

                    if(!as[a1].mp){
                        as[a1].mp = 1;
                    }else{
                        as[a1].mp += 1;
                    }
                    console.log(a3);
                    console.log(pce[a1][a2].action_time[a3+1])

                    if(as[a1].mp == 1){
                        if(pce[a1][a2].open_ticket) diffDate = getDiffDate(pce[a1][a2].open_ticket,pce[a1][a2].action_time[a3].time_action);
                        openDate = (pce[a1][a2].open_ticket) ? pce[a1][a2].open_ticket:"";
                    }else{
                        if(pce[a1][a2].action_time[a3-1]) diffDate = getDiffDate(pce[a1][a2].action_time[a3-1].time_action,pce[a1][a2].action_time[a3].time_action)
                        openDate = (pce[a1][a2].action_time[a3-1]) ? pce[a1][a2].action_time[a3-1].time_action:"";
                    }


                    
                    as[a1].action.push({
                        diff : diffDate,
                        dateOpen : openDate,
                        dateDone : getDateTime(pce[a1][a2].action_time[a3].time_action),
                        user : (pce[a1][a2].action_time[a3+1] )?pce[a1][a2].action_time[a3+1].created_by:"",
                        action : pce[a1][a2].action_time[a3].status_action

                    });            
                }
            }
        }

        res.json(as)
    })
;

module.exports = route;
