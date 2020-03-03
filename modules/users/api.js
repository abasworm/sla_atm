const route = require('express').Router();
const auth = require('../../middleware/auth');
const Joi = require('@hapi/joi');
const rest = require('../../config/rest');
const bcrypt = require('bcryptjs');
const Users = require('./models/crud');


const JoiSchemaAdd = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required(),
	confpassword : Joi.string().min(6).max(20).required().valid(Joi.ref('password')),
    firstname : Joi.string().min(4).max(30).required(),
    lastname : Joi.string(),
    user_group : Joi.number().required()
};
const JoiSchemaEdit = {
	id : Joi.number().required(),
	username : Joi.string().min(6).max(20).required(),
	firstname : Joi.string().min(4).max(30).required(),
    lastname : Joi.string(),
    user_group : Joi.number().required()
};

route
    .get('/',auth.isLoginAPI , async (req,res,next)=>{
        let result = await Users.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/datatable',auth.isLoginDTTbl, async (req,res,next)=>{
        let result = await Users.select();
        if(!result.status) await rest.error('',result.message,res);
        rest.datatable(result.data,res);
    })
    .get('/:id',auth.isLoginAPI, async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.selectOne(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    })
    .post('/',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        
        //getdata
        let data = {
            username : req.body.username,
            password : req.body.password,
            confpassword : req.body.confpassword,
            firstname: req.body.firstname,
            lastname : req.body.lastname,
            user_group : req.body.user_group
        };

        //validating
        try{
            const joiError = await Joi.validate(data, JoiSchemaAdd);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }
        if(req.body.other_role) data.other_role = req.body.other_role;
        //password hash
        const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(req.body.password,salt);
        data.password = pwd;

        //insert user
        try{
            let result = await Users.insert(data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }

    })

    .put('/:id',auth.isLoginAPI, async (req,res,next)=>{
        if(!req.body || !req.params.id) return res.sendStatus(400);
        console.log(req.params.id);
        //getdata
        let data = {
            id : req.params.id,
            username : req.body.username,
            firstname: req.body.firstname,
            lastname : req.body.lastname,
            user_group : req.body.user_group
        };


        //password 
        if(req.body.password){
            JoiSchemaEdit.password = Joi.string().min(6).max(20).required();
            JoiSchemaEdit.confpassword = Joi.string().min(6).max(20).required().valid(Joi.ref('password'));
            data.password = req.body.password;
            data.confpassword = req.body.confpassword;
        }
        
        //validation
        try{
            const joiError = await Joi.validate(data, JoiSchemaEdit);
        }catch(err){
            const message = err.details[0].message;
			const value = err.details[0].path[0];
			return rest.error(value,message,res);
        }
        if(req.body.other_role) data.other_role = req.body.other_role;
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const pwd = await bcrypt.hash(req.body.password,salt);
            data.password = pwd;
        }

        //insert user
        try{
            let result = await Users.update(req.params.id,data);
            if(!result.status) await rest.error('',result.message,res);
            rest.success(result.data,'sukses',res);
        }catch(err){
            //console.log(err); 
            return rest.error(err,err.message,res);
        }
    })

    .delete('/:id',auth.isLoginAPI,async (req,res,next)=>{
        let id = req.params.id;
        let result = await Users.delete(id);
        if(!result.status) await rest.error('',result.message,res);
        rest.success(result.data,'sukses',res);
    });

module.exports = route;
