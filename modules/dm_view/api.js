const route = require('express').Router();
const auth = require('../../middleware/auth');
const dbrecord = require('../../middleware/dbrecord');

const rest = require('../../config/rest');

const Mdl = require('./models');
const MdlLogistic = require('../dm_logistic/models');
const MdlMain = require('../dm_main/models');


route

    //mendapatkan semua list dari dm_main
    .post('/get/dm/list',auth.isLoginDTTbl,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'uid',
            'ticket_crm',
            'ticket_zulu',
            'open_ticket',
            'aging',
            'status',
            'description',
            'notes',
            'atm_id',
            'atm_location',
            'atm_area',
            'atm_fsl',
            'atm_customer',
            'atm_province',
            'atm_city',
            'atm_district',
            'atm_sn',
            'atm_machine_type',
            'atm_owner',
            'created_by',
            'status_ticket',
            'status_action'
        ];
        let param = {};
        let custParam = [];
        let cust = "";
        const rb = req.body;
        if(rb.date_start){
            custParam.push(rb.date_start);
            cust += " AND (open_ticket BETWEEN ? "
            if(rb.date_end){
                custParam.push(rb.date_end);
                cust += " AND ? )";
            }else{
                custParam.push(rb.date_start);
                cust += " DATE_ADD(?,INTERVAL 1 DAY))";
            }
        }
        if(rb.status_part!='ALL' && rb.status_part) {
            custParam.push(rb.status_part);
            cust += " AND uid IN (SELECT DISTINCT(dpd.uid) FROM dm_part_detail dpd WHERE dpd.status = ? )";
        }
        cust += " AND status_action NOT IN('CANCELED','CLOSED')";
        cust += " ORDER BY (DATEDIFF(open_ticket,NOW())) ASC";

        if(rb.status_action) param.status_action = rb.status_action;
        if(rb.status) param.status = rb.status;
        if(rb.fse_spv) param.atm_spv = rb.fse_spv;
        let result = await MdlLogistic.getAllList(param,cust,custParam);
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(dbrecord.manyRecord(result.data,fieldToShow),res);
    })

module.exports = route;