const route = require('express').Router();
const auth = require('../../middleware/auth');
const rest = require('../../config/rest');
const view = require('../../config/templating');
const Mdl = require('./models');
const MdlMain = require('../dm_main/models');
const Excel = require('exceljs')

let link = "export";
let _layout = {
    title : 'Report EXCEL',
    isAddForm : true,
    _link : link
};

var summaryList = async(data)=>{
    var rs = {};
    let rsSpv = await MdlMain.getFseSpv(); // database result
    if(!rsSpv.status) await rest.error('',rsSpv.message,res);
    let rsSts = await MdlMain.getAllStatus(); // database result
    if(!rsSts.status) await rest.error('',rsSts.message,res);
    let rsStsAc = await MdlMain.getAllStatusAction(); // database re0sult
    if(!rsStsAc.status) await rest.error('',rsStsAc.message,res);

    
    
    for(let a in data){

        if (!rs[data[a].dates]){
            let act = {};
            let stso = {};
            let stsc = {};
            let spvo = {}; 
            let spvc = {}; 

            let owno = {'GTI':0,'QI':0,'AKO':0,'UG':0,'CTI':0,'DNI':0};
            let ownc = {'GTI':0,'QI':0,'AKO':0,'UG':0,'CTI':0,'DNI':0};

            for(let b in rsSpv.data){
                spvc[rsSpv.data[b].fse_spv_name] = 0;
                spvo[rsSpv.data[b].fse_spv_name] = 0;
            }

            for(let c in rsSts.data){
                stso[rsSts.data[c].status] = 0; 
                stsc[rsSts.data[c].status] = 0; 
            }

            act['OPEN TICKET'] = 0; 
            for(let d in rsStsAc.data){
                let excld = ['CLOSED','CANCELED']
                if(!excld.includes(rsStsAc.data[d].status_action)) act[rsStsAc.data[d].status_action] = 0; 
            }
            act['PROCESSING CCC'] = 0; 
            act['CLOSED'] = 0;
            act['CANCELED'] = 0;
            

            rs[data[a].dates] =  {'action':act,'status_open': stso,'status_close': stsc,'spv_open':spvo,'spv_close':spvc,'owner_open':owno,'owner_close':ownc};
        }
        
        rs[data[a].dates]['action']['OPEN TICKET'] += 1;
        
        
        if(!rs[data[a].dates]['action'][data[a].ACTION] && data[a].ACTION == 'OPEN'){
            rs[data[a].dates]['action']['PROCESSING CCC'] += 1;
        }else if(!rs[data[a].dates]['action'][data[a].ACTION] && data[a].ACTION != 'OPEN'){
            rs[data[a].dates]['action'][data[a].ACTION] = 1;
        }else if(rs[data[a].dates]['action'][data[a].ACTION] && data[a].ACTION == 'OPEN'){
            rs[data[a].dates]['action']['PROCESSING CCC'] += 1;
        }else if(rs[data[a].dates]['action'][data[a].ACTION] && data[a].ACTION != 'OPEN'){
            rs[data[a].dates]['action'][data[a].ACTION] += 1;
        }

        let exclds = ['CLOSED','CANCELED'];
        if(!rs[data[a].dates]['status_open'][data[a].status] && !exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['status_open'][data[a].status] = 1;
            
        }else if(rs[data[a].dates]['status_open'][data[a].status] && !exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['status_open'][data[a].status] += 1;
            
        }else if(!rs[data[a].dates]['status_close'][data[a].status] && exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['status_close'][data[a].status] = 1;
           
        }else if(rs[data[a].dates]['status_close'][data[a].status] && exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['status_close'][data[a].status] += 1;
            
        }

        if(!rs[data[a].dates]['spv_open'][data[a].fse_spv_name] && !exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['spv_open'][data[a].fse_spv_name] = 1;
        }else if(rs[data[a].dates]['spv_open'][data[a].fse_spv_name] && !exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['spv_open'][data[a].fse_spv_name] += 1;
        }else if(!rs[data[a].dates]['spv_close'][data[a].fse_spv_name] && exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['spv_close'][data[a].fse_spv_name] = 1;
        }else if(rs[data[a].dates]['spv_close'][data[a].fse_spv_name] && exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['spv_close'][data[a].fse_spv_name] += 1;
        }


        // if(!rs[data[a].dates]['spv'][data[a].atm_spv]){
        //     rs[data[a].dates]['spv'][data[a].atm_spv] = 1;
        // }else{
        if(!rs[data[a].dates]['owner_open'][data[a].owner] && !exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['owner_open'][data[a].owner] = 1;
        }else if(rs[data[a].dates]['owner_open'][data[a].owner] && !exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['owner_open'][data[a].owner] += 1;
        }else if(!rs[data[a].dates]['owner_close'][data[a].owner] && exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['owner_close'][data[a].owner] += 1;
        }else if(rs[data[a].dates]['owner_close'][data[a].owner] && exclds.includes(data[a].ACTION)){
            rs[data[a].dates]['owner_close'][data[a].owner] += 1;
        }
        // }

        //console.log(data[a].dates)
        
    }
    return rs;
};

route
    .get('/',auth.isLogin,async(req,res,next)=>{
        const _tabel_layout = {
            tbls : {
                //'no':'NO',
                'uid':'UID',
                'ticket_crm':'TICKET CRM',
                'ticket_zulu':'TICKET ZULU',
                'open_ticket':'OPEN TICKET',
                'aging':'DURATION',
                'status':'STATUS',
                'status_ticket':'STATUS TICKET',
                'status_action':'PROGRESS ON',
                'description':'PROBLEM DESC',
                'notes':'NOTES',
                'atm_id':'ATM ID',
                'atm_sn':'ATM SN',
                'atm_machine_type':'MACHINE TYPE',
                'atm_location':'LOCATION',
                'atm_city':'CITY',
                'atm_province':'PROVINCE',
                'atm_area':'AREA',
                'atm_district':'DISTRICT',
                'atm_fsl':'FSL',
                'atm_customer':'CUSTOMER',
                'atm_owner':'PARTNER',
                'atm_spv':'SPV',
                'fs_eta_visit': 'ETA VISIT',
                'fs_eta':'WORK FINISHED',
                'fs_eta_start':'WORK STARTED',
                'fs_remarks':'REMARKS',
                //'fs_remarks_ebs':'REMARKS EBS',
                'fs_engineer_name':'ENGINEER NAME',
                'fs_engineer_number':'ENGINEER NUMBER',
                //'fs_engineer_phone' : 'ENGINEER PHONE NUMBER',
                'fs_eta_start':'MAINTENANCE START',
                'fs_email_request':'EMAIL REQUEST',
                'fs_status_atm':'STATUS ATM',
                //'cs_eta':'ETA WAITING SPK',
                //'cs_remarks':'REMARKS',
                'created_date':'CREATE DATE',
                'created_by':'CREATE BY',
                'modified_date':'MODIFIED DATE',
                'modified_by':'MODIFIED BY',
                //'is_deleted':'IS DELETED',
                //'deleted_date':'DELETED DATE',
                //'deleted_by':'DELETED BY',
                //'closed_date':'CLOSED DATE',
                //'closed_by':'CLOSED BY'
            },
            // header          : ['uid','atm_customer','ticket_crm','ticket_zulu','open_ticket','atm_id','atm_area','atm_owner','atm_location','atm_fsl','atm_district','atm_province','atm_spv','description','notes'],
            // header_table    : ['UID','Customer','Ticket CRM','Ticket ZULU','Open Ticket','ATM ID','AREA','PARTNER-MACHINE','Location','FSL','District','Province','SPV CODE','Problem Description','Notes']
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })
    .get('/report',auth.isLogin,async(req,res,next)=>{
        var workbook = new Excel.Workbook();
        workbook.creator = req.session.username;
        var worksheet = workbook.addWorksheet('Report All');
        var fileName = 'FileName.xlsx';

        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Ticket', key: 'ticket_crm', width: 32 },
            { header: 'Date', key: 'created_date', width: 10, outlineLevel: 1 }
        ];
        
        worksheet.addRow({id:'1', ticket_crm:'123456', created_date:new Date(1970,1,1)});
        //res.setHeader('Content-Disposition','attachment: filename=text.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        await workbook.xlsx.write(res);
        
        res.end();
    })

    .post('/list',auth.isLoginDTTbl,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        let data = {};
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
                cust += " AND DATE_ADD(?,INTERVAL 1 DAY))";
            }
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
            if(rb.status_part!='ALL' && rb.status_part) {
                custParam.push(rb.status_part);
                cust += " AND uid IN (SELECT DISTINCT(dpd.uid) FROM dm_part_detail dpd WHERE dpd.status = ? )"
            }
            cust += " ORDER BY (DATEDIFF(open_ticket,NOW())) ASC";
            if(rb.status) param.status = rb.status;
            if(rb.status_action) {
                param.status_action = rb.status_action;
            }
            let result = await Mdl.getAllList(param,cust,custParam);
            if(!result.status) await rest.error('',result.message,res);
            data = result.data;
        }
        
        rest.datatable(data,res);
    })

    .get('/summary',auth.isLogin,async(req,res,next)=>{
        view.ViewShow(link + '/summary',_layout,req,res);
    })

    .get('/tabel_sum/:par',auth.isLogin,async(req,res,next)=>{
        let data = {};
        let param = {};
        let custParam = [];
        let cust = "";
        const _tabel_layout = {
            tbls : {
                //'no':'NO',
                'uid':'AKSI',
                'ticket_crm':'TICKET CRM',
                'ticket_zulu':'TICKET ZULU',
                'open_ticket':'OPEN TICKET',
                'aging':'DURATION',
                'status':'STATUS',
                'status_ticket':'STATUS TICKET',
                'status_action':'PROGRESS ON',
                'description':'PROBLEM DESC',
                //'notes':'NOTES',
                'atm_id':'ATM ID',
                'atm_sn':'ATM SN',
                'atm_machine_type':'MACHINE TYPE',
                'atm_location':'LOCATION',
                'atm_city':'CITY',
                'atm_province':'PROVINCE',
                'atm_area':'AREA',
                'atm_district':'DISTRICT',
                'atm_fsl':'FSL',
                'atm_customer':'CUSTOMER',
                'atm_owner':'PARTNER',
                'atm_spv':'SPV CODE',
                'fse_spv_name': 'SPV NAME',
                'fs_eta_visit': 'ETA VISIT',
                'fs_eta':'WORK FINISHED',
                'fs_eta_start':'WORK STARTED',
                //'fs_remarks':'REMARKS',
                //'fs_remarks_ebs':'REMARKS EBS',
                'fs_engineer_name':'ENGINEER NAME',
                'fs_engineer_number':'ENGINEER NUMBER',
                //'fs_engineer_phone' : 'ENGINEER PHONE NUMBER',
                'fs_eta_start':'MAINTENANCE START',
                'fs_email_request':'EMAIL REQUEST',
                //'fs_status_atm':'STATUS ATM',
                //'cs_eta':'ETA WAITING SPK',
                //'cs_remarks':'REMARKS',
                //'created_date':'CREATE DATE',
                //'created_by':'CREATE BY',
                //'modified_date':'MODIFIED DATE',
                //'modified_by':'MODIFIED BY',
                //'is_deleted':'IS DELETED',
                //'deleted_date':'DELETED DATE',
                //'deleted_by':'DELETED BY',
                //'closed_date':'CLOSED DATE',
                //'closed_by':'CLOSED BY'
            },
            // header          : ['uid','atm_customer','ticket_crm','ticket_zulu','open_ticket','atm_id','atm_area','atm_owner','atm_location','atm_fsl','atm_district','atm_province','atm_spv','description','notes'],
            // header_table    : ['UID','Customer','Ticket CRM','Ticket ZULU','Open Ticket','ATM ID','AREA','PARTNER-MACHINE','Location','FSL','District','Province','SPV CODE','Problem Description','Notes']
        };
        Object.assign(_layout,_tabel_layout);


        var parameter = Buffer.from(req.params.par,'base64').toString('binary');
        console.log(parameter);
        var xparam = parameter.split('.');
        kp = [];
        vp = [];
        
        for(var i in xparam){
            if(i == 0){
                kp.push('open_ticket');
                vp.push( toDateString(xparam[i]) );
            }else if(i%2==1){
                kp.push(xparam[i]);
            }else if(i%2==0){
                vp.push(xparam[i]);
            }
        }

        if(kp[kp.length-1] == 'open_status'){
            if(vp[vp.length-1] == 1) cust += " AND status_action NOT IN ( 'CANCELED','CLOSED')";
            if(vp[vp.length-1] == 0) cust += " AND status_action IN ( 'CANCELED','CLOSED')";
            kp.pop();
            vp.pop();
        }

        for(var y in kp){
            if(y == 0){
                cust += ' AND (open_ticket BETWEEN ? AND DATE_ADD(?,INTERVAL 1 DAY)) ';
                custParam.push(vp[y],vp[y]);
            }else if(kp[y]=='owner'){

                switch(vp[y]){
                    case 'QI' : 
                        cust += " AND atm_owner REGEXP 'QI|^QUALITA' ";break;
                    case 'GTI' :
                        cust += " AND atm_owner REGEXP 'GTI|^GLOBAL' ";break;
                    case 'ARK' :
                        cust += " AND atm_owner REGEXP 'ARK|AKO|^ARKANINDO' ";break;
                    case 'CTI' :
                        cust += " AND atm_owner REGEXP 'CTI|^CITIUS' ";break;
                    case 'UG' :
                        cust += " AND atm_owner REGEXP 'UG|^UG' ";break;
                    case 'DNI' :
                        cust += " AND atm_owner REGEXP 'DNI|^DNI' ";break;
                }
                
                vp.splice( kp.indexOf('owner'), 1 );
                kp.splice( kp.indexOf('owner'), 1 );
            }else{
                param[kp[y]] = vp[y];
            }
        }        
        

        cust += " ORDER BY (DATEDIFF(open_ticket,NOW())) ASC";
        let result = await Mdl.getAllList(param,cust,custParam);
        if(!result.status) await rest.error('',result.message,res);
        data = result.data;
        let resx = '';
        for(let x in data){
            resx += '<tr>';
            for(let xr in _tabel_layout['tbls']){
                
                resx += '<td>' + data[x][xr] + '</td>';
            }
            resx += '</tr>'
        }
        _layout.resx = resx;

        view.ViewShow(link + '/table_sum',_layout,req,res);
    })

    .post('/list_summary',auth.isLoginAPI,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        let data = {};
        let param = {};
        let custParam = [];
        let dateParam = [];
        let cust = "";
        let date = "";
        const rb = req.body;
        if(rb.date_start){
            dateParam.push(rb.date_start);
            date += " AND (dm.open_ticket BETWEEN ? "
            if(rb.date_end){
                dateParam.push(rb.date_end);
                date += " AND ? )";
            }else{
                dateParam.push(rb.date_start);
                date += " AND DATE_ADD(?,INTERVAL 1 DAY))";
            }
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
            // if(rb.status_part!='ALL' && rb.status_part) {
            //     custParam.push(rb.status_part);
            //     cust += " AND uid IN (SELECT DISTINCT(dpd.uid) FROM dm_part_detail dpd WHERE dpd.status = ? )"
            // }
            //cust += " ORDER BY (DATEDIFF(open_ticket,NOW())) ASC";
            // if(rb.status) param.status = rb.status;
            // if(rb.status_action) {
            //     param.status_action = rb.status_action;
            // }
            if(rb.district) param.atm_district = rb.district;
            let result = await Mdl.getSummaryList(param,cust,custParam,date,dateParam);
            if(!result.status) await rest.error('',result.message,res);

            data = await summaryList(result.data);
        }
        rest.success(data,'OKE',res);
    })
    
;
function toDateString(s){
    var d = new Date(s);
    Number.prototype.padLeft = function(base,chr){
        var  len = (String(base || 10).length - String(this).length)+1;
        return len > 0? new Array(len).join(chr || '0')+this : this;
    }
    var dformat = [d.getFullYear(),(d.getMonth()+1).padLeft(),
        d.getDate().padLeft()].join('-')+
        ' ' +
      [ d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft()].join(':');
    return dformat;
}
module.exports = route;