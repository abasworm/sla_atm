module.exports = {
    ViewShow : async (view,data,req,res)=>{
        let datax = {
            _AppTitle : "OPTIMUS",
            _AppTitleSmall : "Optimus Service",
            _AppTitleAlias : "OPMS",
            _Copyright : "2019 DN, Admin LTE 3",
            _Version : "1.2.2",
            _UserName : req.session.fullname,
            _UserGroup : req.session.user_group,
            _UserRole : req.session.other_role,
            _uriPath : req.path
        };
        await Object.assign(datax,data);
        try{
            await res.render(view,datax);
        }catch(err){
            res.send(404);
        }
    }
};