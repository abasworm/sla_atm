var table;
$(document).ready(function() {

    //ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
    });
    
    $('.datepicker').datepicker({
        autoclose : true,
        format: 'yyyy-mm-dd'
    })

    $('#btn_search').click((e)=>{table.ajax.reload();});

    init_table();

    x.ajax.getStatusTicket();
    x.ajax.getStatusAction();
    x.ajax.getSpv();
        
    

    var option_part = ["WAITING INFO", "READY", "NOT READY","PART IN FSL"];
    for(let o in option_part){
        $('#status_part').append("<option value='"+option_part[o]+"'> "+option_part[o]+" </option>");
    }
    

    
});


var x = {
    ajax:{
        getStatusAction: ()=>{$.post('/api/dm_main/get/status/action',{},x.complete.getStatusAction);},
        getStatusTicket: ()=>{$.post('/api/dm_main/get/status',{},x.complete.getStatusTicket);},
        getSpv: ()=>{$.post('/api/dm_main/get/fse/spv',{},x.complete.getSpv);},
    },

    complete:{
        getStatusAction: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#status_action').append("<option value='"+data[o].status_action+"' > "+data[o].status_action+" </option>");
            }
        },
        getStatusTicket: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#status_ticket').append("<option value='"+data[o].status+"'> "+data[o].status+" </option>");
            }
        },
        getSpv: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#spv').append("<option value='"+data[o].fse_spv+"'> "+data[o].fse_spv + " - FSM: " + data[o].fse_fsm+" </option>");
            }
        },
        
    },
    showError:(message)=>{
        $('#alertbox #message').html(message);
		$('#alertbox').show();
		return false;
    }
};

function view(id){
    window.location = '/dm_main/view/'+id;
}
function process(id){   
    window.location = '/dm_fsm/process/'+id;
}

var init_table = ()=>{
    
    //datyatable
	var link = "/export/list";
	//membuat footer menjadi field input
    $('#dt_table tfoot th').each(function () {
        var title = $('#dt_table thead th').eq($(this).index()).text();
        if (title !== 'Aksi'){
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        }
    });
    $.extend( $.fn.dataTable.defaults, {
        searching: true,
        paginate: true,
        autoWidth: false,
        
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        language: {
            search: '<span>Search:</span> _INPUT_',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        }
    });

    var field = []
    var hs = _head;
    for(var a in hs){
        console.log(a);
        switch(a){
            case 'open_ticket': 
            field.push(
                {"data": 
                    function(row,type,val,meta){return (row.open_ticket)?toDateString(row.open_ticket):"-"}, 
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((oData.open_ticket)?toDateString(oData.open_ticket):"-");}
                }
            );break;
            case 'fs_eta' : 
                field.push(
                    {"data": 
                        function(row,type,val,meta){return (row.fs_eta)?toDateString(row.fs_eta):"-"}, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((oData.fs_eta)?toDateString(oData.fs_eta):"-");}
                    }
                );break;
            case 'fs_eta_start': 
                field.push(
                    {"data": 
                        function(row,type,val,meta){return (row.fs_eta_start)?toDateString(row.fs_eta_start):"-"}, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((oData.fs_eta_start)?toDateString(oData.fs_eta_start):"-");}
                    }
                );break;
            case 'fs_eta_visit':
                field.push(
                    {"data": 
                        function(row,type,val,meta){return (row.fs_eta_visit)?toDateString(row.fs_eta_visit):"-"}, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((oData.fs_eta_visit)?toDateString(oData.fs_eta_visit):"-");}
                    }
                );break;
            
            case 'no':;break;
            default:field.push({data:a});break;
        }
    }

    //mendeklarasikan dan mendefinisikan data table
    table = $('#dt_table').DataTable({
        scrollX: true,
        "processing": true,
        dom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>",
        destroy: true,
        stateSave: false,
        autoWidth: true,
        deferRender: true,
        processing: true,
        buttons: [
            {
                extend: 'copy',
                text: '<i class="fa fa-copy"></i> Copy',
                titleAttr: 'Copy',
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
                exportOptions: {
                    columns: ':visible:not(:last-child)',
                    modifier: {
                        page: 'current'
                    }
                },
                footer:false
            }, 
            {
                extend: 'excel',
                text: '<i class="fa fa-file-excel"></i> Excel',
                titleAttr: 'Excel',
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
                exportOptions: {
                    // columns: ':visible:not(:first-child)',
                    modifier: {
                        page: 'current'
                    }
                },
                footer:false
            },
            {
                extend: 'pdf',
                text: '<i class="fa fa-document"></i> PDF',
                titleAttr: 'PDF',
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
                exportOptions: {
                    // columns: ':visible:not(:first-child)',
                    modifier: {
                        page: 'current'
                    }
                },
                footer:false
            }, 
            {
                extend: 'excel',
                text: '<i class="fa fa-file-excel"></i> Excel All Page',
                titleAttr: 'Excel All Page',
                exportOptions: {
                    columns: ':visible:not(:first-child)'
                },
                footer:false
            }
        ],
        "ajax": {
        	headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            dataType: 'JSON',
            contentType:"application/json",
        	url : link,
        	type: "POST",
        	data : function(d){
                d.key = 'abcdh';
                d.date_start = $('#date_start').val();
                d.date_end = $('#date_end').val();
                d.status_part = $('#status_part').val();
                d.status_action = $('#status_action').val();
                d.status = $('#status_ticket').val();
                d.fse_spv = $('#spv').val();
        	}
        },            
        "columns": field,

        order: [[ 1, "desc" ]],
        columnDefs: [{ 
            "width":"70px",
            orderable: false,
            targets: [ 0 ]
        }],
    });

    //untuk menambahkan fungsi pada setiap button yang ada
    $('#dt_table tbody').on('click', 'a', function () {
        var data = table.row($(this).parents('tr')).data();
            //            alert( data[id] +"'ID : "+ data[id] );
        console.log($(this).parents('tr'));
    });

    //membuat fungsi untuk search pada setiap kolom input yang tersedia
    table.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that
                .search(this.value)
                .draw();
            }
        });
    });
    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
};