const route = require('express').Router();
const auth = require('../../middleware/auth');
const dbrecord = require('../../middleware/dbrecord');
const rest = require('../../config/rest');

const Mdl = require('./models');

route

    .post('/get/customer',auth.isLoginAPI,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'customer',
        ];
        let result = await Mdl.getAllCustomer(); // database result
        if(!result.status) await rest.error('',result.message,res);
        rest.success(dbrecord.manyRecord(result.data,fieldToShow),'sukses',res);
    })

    .post('/get/district',auth.isLoginAPI,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'district',
        ];
        let result = await Mdl.getAllDistrict(); // database result
        if(!result.status) await rest.error('',result.message,res);
        rest.success(dbrecord.manyRecord(result.data,fieldToShow),'sukses',res);
    })

    .post('/get/spv',auth.isLoginAPI,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'fse_spv',
            'fse_fsm'
        ];
        let result = await Mdl.getAllSpv(); // database result
        if(!result.status) await rest.error('',result.message,res);
        rest.success(dbrecord.manyRecord(result.data,fieldToShow),'sukses',res);
    })

    .post('/get/list',auth.isLoginDTTbl,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'id',
            'business_partner',
            'customer',
            'serial_number',
            'machine_id',
            'machine_type',
            'model_type',
            'service_center',
            'type_sp',
            'location_name',
            'address',
            'city',
            'province',
            'island',
            'postal_code',
            'warranty_start',
            'warranty_end',
            'service_provider',
            'flm',
            'pm_freq_per_year',
            'pm_period',
            'contract_status',
            'machine_status',
            'district',
            'fsm',
            'sect',
            'fss_supervisor',
            'fs_engineer',
            'fse_code',
            'district_code',
            'grade',
            'fsl',
            'csm',
            'note',
            'atm'

        ];
        
        const rb = req.body;
        let param ={};
        if(rb.customer) param.customer = rb.customer;
        if(rb.district) param.district = rb.district;
        if(rb.fse_spv) param.fss_supervisor = rb.fse_spv;
        
        let result = await Mdl.getAllAtm(param);
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(dbrecord.manyRecord(result.data,fieldToShow),res);
    }) 

    .post('/atm/detail',auth.isLoginAPI,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        const fieldToShow = [
            'business_partner',
            'customer',
            'serial_number',
            'machine_id',
            'machine_type',
            'model_type',
            'service_center',
            'type_sp',
            'location_name',
            'address',
            'city',
            'province',
            'island',
            'postal_code',
            'warranty_start',
            'warranty_end',
            'service_provider',
            'flm',
            'pm_freq_per_year',
            'pm_period',
            'contract_status',
            'machine_status',
            'district',
            'fsm',
            'sect',
            'fss_supervisor',
            'fs_engineer',
            'fse_code',
            'district_code',
            'grade',
            'fsl',
            'csm',
            'note',
            'atm'

        ];
        let param = {};
        let cust = "";
        const rb = req.body;
        if(rb.ids) param.uid = rb.ids;
        
        let result = await Mdl.getAtm(rb.ids);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(dbrecord.oneRecord(result.data[0],fieldToShow),'sukses',res);
    }) 

    .post('/atm/insert',auth.isLoginAPI,async(req,res,next)=>{

    }) 

    .post('/update',auth.isLoginAPI,async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        var rb = req.body;
        let ids = rb.ids;
        let data = {
            business_partner : rb.business_partner,
            customer : rb.customer,
            serial_number : rb.serial_number,
            machine_id : rb.machine_id,
            machine_type : rb.machine_type,
            model_type : rb.model_type,
            service_center : rb.service_center,
            type_sp : rb.type_sp,
            location_name : rb.location_name,
            address : rb.address,
            city : rb.city,
            province : rb.province,
            island : rb.island,
            postal_code : rb.postal_code,
            warranty_start : rb.warranty_start,
            warranty_end : rb.warranty_end,
            service_provider : rb.service_provider,
            flm : rb.flm,
            pm_freq_per_year : rb.pm_freq_per_year,
            pm_period : rb.pm_period,
            contract_status : rb.contract_status,
            machine_status : rb.machine_status,
            district : rb.district,
            fsm : rb.fsm,
            sect : rb.sect,
            fss_supervisor : rb.fss_supervisor,
            fs_engineer : rb.fs_engineer,
            fse_code : rb.fse_code,
            district_code : rb.district_code,
            grade : rb.grade,
            fsl : rb.fsl,
            csm : rb.csm,
            note : rb.note,
            atm : rb.atm
        }
        let result = await Mdl.updateAtm(rb.ids,data);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'Success',res);
    }) 

    .post('/atm/delete',auth.isLoginAPI,async(req,res,next)=>{

    }) 
;

module.exports = route;