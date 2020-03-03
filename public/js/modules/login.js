var username;
var password;
$(document).ready(function(e){
    username = $('#username');
    password = $('#password');
    $('#btn_login').on('click', function(e){
        $(this).attr('disabled',true);
        $(this).html('Verification..');
        signin();
    });

    $('#alertbox').hide();
    $('#closeAlert').on('click', function(e){
        $('#alertbox').hide();
    });
})

function signin(){
    $.post('/login/verify',{key:'abcdh',username:username.val(),password:password.val()},(res,ret)=>{
        if(!res.status){
            $('#alertbox #message').html(res.message);
            $('#alertbox').show();
            $('#btn_login').attr('disabled',false);
            $('#btn_login').html('Sign In');
        }else{
            window.location = '/dashboard';
        }
    });
}