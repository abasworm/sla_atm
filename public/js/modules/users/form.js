$(document).ready(function(e){
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/users/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			$('#username').val(res.results.username);
			$('#firstname').val(res.results.firstname);
			$('#lastname').val(res.results.lastname);
			$('#other_role').val(res.results.other_role);
			$('#user_group').val(res.results.user_group);
		}
	});
	}
});

function save(){
	jsData = {
		key : 'abcdh',
		username: $('#username').val(),
		password: $('#password').val(),
		confpassword: $('#confpassword').val(),
		firstname: $('#firstname').val(),
		lastname: $('#lastname').val(),
		other_role: $('#other_role').val(),
		user_group: $('#user_group').val()
	}
	xhqr('/api/users','POST',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/users'
		}
	});
}

function update(){
	jsData = {
		key : 'abcdh',
		username: $('#username').val(),
		password: $('#password').val(),
		confpassword: $('#confpassword').val(),
		firstname: $('#firstname').val(),
		lastname: $('#lastname').val(),
		other_role : $('#other_role').val(),
		user_group : $('#user_group').val()
	}
	xhqr('/api/users/'+$('input[name=ids]').val(),'PUT',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/users'
		}
	});
}