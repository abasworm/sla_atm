const rest = require('../config/rest');
module.exports = {
	isLogin: async (req,res,next) =>{
		try{
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			//console.log(req.session);
			if(username){
				// const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				//req.session.token = auth_token;

				next();
			}else{
				res.redirect('/login');
			}
		}catch(err){
			res
			.sendStatus(401);
		}
	},
	
	isLoginAPI: async (req,res,next) =>{
		try{
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			//console.log(req.session);
			if(username){
				// const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				//req.session.token = auth_token;

				next();
			}else{
				return rest.error('','Please Login To Process or Refresh',res);
			}
		}catch(err){
			res.sendStatus(401);
		}
	},
	
	isLoginDTTbl: async (req,res,next) =>{
		try{
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			//console.log(req.session);
			if(username){
				// const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				//req.session.token = auth_token;

				next();
			}else{
				rest.datatable(["Please Login or Refresh"],res);
			}
		}catch(err){
			res.sendStatus(401);
		}
    }
};