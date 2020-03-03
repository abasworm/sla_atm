const route = require('express').Router();
const view = require('../../config/templating');
const multer = require('multer');
const { isLogin } = require('../../middleware/auth');

let link = "import";
let _layout = {
    title : 'IMPORT EXCEL',
    isAddForm : true,
    _link : link
};

route
    .get('/',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            tableat : {
                uid : 'UID',
                ticket_crm : 'Ticket CRM',
                open_ticket: 'Open Ticket',
                atm_sn : 'ATM SN',
                atm_id : 'ATM ID',
                atm_location : 'Location',
                atm_machine_type : 'Machine',
                atm_customer : 'Customer',
                atm_vendor : 'Vendor',
                problem_clasification: 'Classification',
                problem_detail : 'Detail',
                problem_start : 'Problem Start',
                worktime_start : 'Work Start',
                worktime_end : 'Work End',
                worktime_operational : 'Operational ATM',
                activity : 'Activity',
                status : 'Status',
                action : 'Action',
                notes : 'Notes'
            },
            
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/form',_layout,req,res);
    })

    

module.exports = route;