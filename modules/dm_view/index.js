const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');

let link = "dm_view"
let _layout = {
    title : 'Monitoring View',
    isAddForm : true,
    _link : link
}

route
    .get('/',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            header : ['uid','status','status_action','ticket_crm','atm_id','atm_customer','atm_area','atm_owner','open_ticket','aging','status_ticket'],
            header_table : ['Aksi','Status','Processing ON','Ticket CRM','ID ATM','Customer','AREA','OWNER','Open Ticket','Duration','Status Ticket']
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })


module.exports = route;