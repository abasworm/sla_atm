const route = require('express').Router();
const auth = require('../../middleware/auth');
const dbrecord = require('../../middleware/dbrecord');

const uuidv4 = require('uuid/v4');
const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, './uploads');
    },
    filename: (req,file,cb)=>{
        var dnow = new Date();
        dnowf = String(dnow.getDate()).padStart(2,'0') + String(dnow.getMonth()).padStart(2,'0') + dnow.getFullYear();
        cb(null, file.fieldname + '-' + dnowf + '.xlsx');
    }
});
const upload = multer({storage: storage});

const Excel = require('exceljs');
const workbook = new Excel.Workbook();

const Mdl = require('./models');

const rest = require('../../config/rest');

const variables = {
    'ACTIVITY'  :'activity',
    'ID'        :'atm_id',
    'LOCATION'  :'atm_location',
    'PENGELOLA' :'atm_vendor',
    'START'     :'problem_start',
    'CLASIFICATION PROBLEM':'problem_clasification',
    'DETAIL'    :'problem_detail',
    'CATEGORY'  :'problem_category',
    'TIME IN'   :'worktime_start',
    'TIME OUT'  :'worktime_end',
    'STATUS'    :'status',
    'ACTION'    :'action'
}




route
    .post('/upload', auth.isLoginAPI, upload.single('images'), async (req,res,next)=>{
        
        console.log(req.file)
        await workbook.xlsx.readFile(".\\"+req.file.path);
        var worksheet = await workbook.getWorksheet('FIELD DATA');
        var i = 0;
        var field = ['NO'];
        var data = {};
        let result1 = await Mdl.deleteTmp();
        if(!result1.status) await rest.error('',result1.message,res);
        const check = (rv,rx)=>{
            return (rv)?(rv.formula?rv.result:rv):((rx)?rx:'');
        }
        worksheet.eachRow(async function(row, rowNumber) {
            var rv = row.values;
            if(i === 0){
                for(var a in rv){
                    //console.log(rv[a])
                    field.push(rv[a]);
                }
            // }else if(i<1){
            }else{
                var dts = {};
                for(var b in rv){
                    if(variables[field[b]]){
                        switch(field[b]){
                            case 'ACTION'         : dts['action'] = check(rv[b],'-'); break;
                            default         : dts[variables[field[b]]] = check(rv[b]); break;
                        }
                        dts['uid'] = uuidv4();
                        dts['created_by'] = req.session.username;
                        dts['notes'] = '-';
                        dts['description'] = '-';
                    }
                }
                data[rowNumber] = dts;
            }
            i++;
        });
        //res.json(data);
        for(let xx in data){
            let result2 = await Mdl.checkDm(data[xx].ticket_crm);
            if(!result2.status) await rest.error('',result2.message,res);
            if(result2.data == 0){
                let result = await Mdl.insertTmp(data[xx]);
                if(!result.status) {await rest.error('',result.message,res); return false;};
            }
        }
        rest.success(req.file,'Success',res);
    })

    .post('/list', auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'uid',
            'ticket_crm',
            'open_ticket',
            'atm_sn',
            'atm_id',
            'description',
            'atm_location',
            'atm_machine_type',
            'atm_customer',
            'atm_vendor',
            'problem_category',
            'problem_clasification',
            'problem_detail',
            'problem_start',
            'worktime_start',
            'worktime_end',
            'worktime_operational',
            'activity',
            'status',
            'action',
            'notes'
        ];
        let result = await Mdl.getDataSL();
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(dbrecord.manyRecord(result.data,fieldToShow),res);
    })

    .post('/transfer', auth.isLoginAPI, async (req,res,next)=>{
        let result = await Mdl.transferTmp();
        if(!result.status) await rest.error('',result.message,res);
        
        let result1 = await Mdl.deleteTmp();
        if(!result1.status) await rest.error('',result1.message,res);

        rest.success(result.data,'Success',res);
    })

    .post('/clear',auth.isLoginAPI, async (req,res,next)=>{
        let result = await Mdl.deleteTmp();
        if(!result.status) await rest.error('',result1.message,res);
        rest.success(result.data,'Success',res);
    })

module.exports=route;