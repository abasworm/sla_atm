const route = require('express').Router();
const { isLogin } = require('../../middleware/auth');
const view = require('../../config/templating');

const _layout = {
    title : 'Welcome to dashboard'
}

route
    .get('/',isLogin, (req,res,next)=>{
        view.ViewShow('dashboard',_layout,req,res);
    })
;

module.exports = route;
