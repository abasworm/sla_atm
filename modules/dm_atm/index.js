const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');
let link = "dm_atm";
let _layout = {
    title : 'Management ATM',
    isAddForm : true,
    _link : link
}

route
    .get('/',isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            form :{
                'id':'Aksi',
                'business_partner' : 'Business Partner',
                'customer' : 'Customer',
                'serial_number' : 'Serial Number',
                'machine_id' : 'Machine Id',
                'machine_type': 'Machine Type',
                'model_type' : 'Model Type',
                'service_center': 'Service Center',
                'type_sp' : 'Type Sp',
                'location_name' : 'Location Name',
                'address' : 'Address',
                'city': 'City',
                'province' : 'Province',
                'island' : 'Island',
                'postal_code' : 'Postal Code',
                'warranty_start': 'Waranty Start',
                'warranty_end' : 'Waranty End',
                'service_provider' : 'Service Provider',
                'flm' : 'FLM',
                'pm_freq_per_year' : 'PM Freq Per Year',
                'pm_period': 'PM Period',
                'contract_status':'Contract Status',
                'machine_status' : 'Machine Status',
                'district' : 'District',
                'fsm': 'FSM',
                'sect' : 'Sect',
                'fss_supervisor' : 'FSS Supervisor',
                'fs_engineer' : 'FS Engineer',
                'fse_code': 'FSE Code',
                'district_code' : 'District',
                'grade' : 'Grade',
                'fsl' : 'FSL',
                'csm' : 'CSM',
                'note': 'NOTE',
                'atm' : 'ATM'
            }
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })
    
    .get('/edit/:uid',isLogin ,(req,res,next)=>{
        var uid = req.params.uid;
        const _tabel_layout = {
            ids : uid,
            form :{
                'business_partner' : 'Business Partner',
                'customer' : 'Customer',
                'serial_number' : 'Serial Number',
                'machine_id' : 'Machine Id',
                'machine_type': 'Machine Type',
                'model_type' : 'Model Type',
                'service_center': 'Service Center',
                'type_sp' : 'Type Sp',
                'location_name' : 'Location Name',
                'address' : 'Address',
                'city': 'City',
                'province' : 'Province',
                'island' : 'Island',
                'postal_code' : 'Postal Code',
                'warranty_start': 'Waranty Start',
                'warranty_end' : 'Waranty End',
                'service_provider' : 'Service Provider',
                'flm' : 'FLM',
                'pm_freq_per_year' : 'PM Freq Per Year',
                'pm_period': 'PM Period',
                'contract_status':'Contract Status',
                'machine_status' : 'Machine Status',
                'district' : 'District',
                'fsm': 'FSM',
                'sect' : 'Sect',
                'fss_supervisor' : 'FSS Supervisor',
                'fs_engineer' : 'FS Engineer',
                'fse_code': 'FSE Code',
                'district_code' : 'District',
                'grade' : 'Grade',
                'fsl' : 'FSL',
                'csm' : 'CSM',
                'note': 'NOTE',
                'atm' : 'ATM'
            }
        };
        Object.assign(_layout,_tabel_layout);
        _layout.isAddForm = false;
        view.ViewShow(link + '/form',_layout,req,res);
    })
    ;


module.exports = route;