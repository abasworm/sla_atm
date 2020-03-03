var table;
var isEditPart = false;
var idEditPart = 0;

$(document).ready(function(e){
    $('#alertbox').hide();
    $('#closeAlert').on('click',function(e){$('#alertbox').hide();});
    
    if($('input[name=ids]').val()){
        $('#uid').val($('input[name=ids]').val());
        x.ajax.editPost($('input[name=ids]').val());
	}

	$("#btn_update").click(()=>{
		x.ajax.update();
	});
	
	$("#btn_cancel").click(()=>{
		window.location='/dm_atm';
	})
});

var x = {
    ajax : {
		update:()=>{
			var a = $('#fmain').serializeArray();
            $.post('/api/dm_atm/update',a,x.complete.update);
		},
        editPost:(id)=>{
			var ar = {ids:id};
			$.post('/api/dm_atm/atm/detail',ar,x.complete.editPost);
		},
    },
    complete: {
		update:(res,ret)=>{
			if(!res.status) return x.showError(res.message);
			window.location = '/dm_atm';
		},
        editPost:(res,ret)=>{
			if(!res.status) return x.showError(res.message);
			var data = res.results;
           
			for(var i in data){
                console.log(data[i])
				$("#"+i).val(data[i]);
				// switch(dtsp[i]){
				// 	case 'open_ticket' : $('#open_ticket').val(data[dtsp[i]].replace(/T|Z/g," "));break;
				// 	case 'status' : case 'status_ticket' : case 'atm_customer':console.log(dtsp[i]); $("#"+dtsp[i]).val(data[dtsp[i]]).trigger('change');break;
				// 	case 'aging' : $('#duration').val(data[dtsp[i]]);break;
				// 	case 'description' : case 'notes': tinyMCE.get(dtsp[i]).setContent((data[dtsp[i]])?data[dtsp[i]]:"");break;
				// 	default : $("#"+dtsp[i]).val(data[dtsp[i]]);
				// } //end switch
			} //end for
		},
    },
    showError:(message)=>{
		$('#alertbox #message').html(message);
		$('#alertbox').show();
		return false;
	}
}
