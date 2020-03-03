const route = require('express').Router();
const view = require('../../config/templating');
const auth = require('../../middleware/auth');

let _layout = {
    title : 'Management User',
    isAddForm : true,
}

route
    .get('/',auth.isLogin ,(req,res,next)=>{
        const _tabel_layout = {
            header : ['id','username','fullname']
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow('users/table',_layout,req,res);
    })
    .get('/add',auth.isLogin ,(req,res,next)=>{
        _layout.isAddForm = true;
        view.ViewShow('users/form',_layout,req,res);
    })
    .get('/edit/:ids',auth.isLogin ,(req,res,next)=>{
        const _edit_layout = {
            ids : req.params.ids
        };
        Object.assign(_layout,_edit_layout);
        _layout.isAddForm = false;
        view.ViewShow('users/form',_layout,req,res);
    })
;

module.exports = route;