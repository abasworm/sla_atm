const route = require('express').Router();
const Joi = require('@hapi/joi');
const rest = require('../../config/rest');
const bcrypt = require('bcryptjs');
const Login = require('./models/m_login');

const JoiSchemaLogin = {
	username : Joi.string().min(6).max(20).required(),
	password : Joi.string().min(6).max(20).required()
};

const _layout = {
    title : 'LOGIN FORM'
}

route
    .get('/', (req,res,next)=>{
        
        if(!req.session.username){
            res.render('adminlte/login',_layout);
        }else{
            res.redirect('/dashboard');
        }
    })
    .post('/verify', async(req,res,next)=>{
        if(!req.body) return res.sendStatus(400);
        
            let data = {
                username : req.body.username,
                password : req.body.password
            };
            try{
                let User = await Login.getUser(data.username);
                let verify = await bcrypt.compare(data.password,User.data.password);
                if(verify){
                    req.session.username = User.data.username;
                    req.session.fullname = User.data.lastname + ", " + User.data.firstname;
                    req.session.user_group = User.data.user_group;
                    req.session.other_role = (User.data.other_role)?User.data.other_role:"";
                    rest.success(true,'Success Login',res);
                }else{
                    rest.error(err,"Username / Password Salah",res);
                }
            }catch(err){
                return rest.error(err,"Username / Password Salah",res);
        }
        
    })
    .get('/exit',async(req,res,next)=>{
        try{
            await req.session.destroy();
            res.redirect('/login');
        }catch(err){
            return rest.error(err,"Can't Quit Session",res);
        }
        
    })
;

module.exports = route;