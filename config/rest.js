'use strict';

const resp = {
    success : (values,message,res)=>{
        let data = {
            'status' : true,
            'message': message,
            'results' : values
        };
        return res.json(data);
    },
    datatable:(values,res)=>{
        let data = {data:values};
        return res.json(data);
    },
    failure : (values,message,res)=>{
        let data = {
            'status' : false,
            'message': message,
            'results' : values
        };
        return res.json(data);
    },
    error : (values,message,res)=>{
        let data = {
            'status' : false,
            'message': message,
            'results' : values
        };
        return res.json(data);
    },
    notfound : (res)=>{
        return res.sendStatus(404);
    },
}

module.exports = resp;