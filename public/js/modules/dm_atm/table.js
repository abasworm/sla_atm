
var table;

$(document).ready(function() {

    //ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
    });

    $('#btn_search').click((e)=>{table.ajax.reload();});

    init_table();

    x.ajax.getCustomer();
    x.ajax.getDistrict();
    x.ajax.getSpv();
});

var btn = {
    edit:(id)=>{window.location='/dm_atm/edit/'+id},
    delete:(id)=>{if(confirm('Yakin ingin hapus data? ')) x.ajax.deleteAtm(id)}
};

var x = {
    ajax:{
        getCustomer: ()=>{$.post('/api/dm_atm/get/customer',{},x.complete.getCustomer);},
        getDistrict: ()=>{$.post('/api/dm_atm/get/district',{},x.complete.getDistrict);},
        getSpv: ()=>{$.post('/api/dm_atm/get/spv',{},x.complete.getSpv);},
        deleteAtm:(id)=>{$.post('/api/dm_atm/delete',{id:id},x.complete.deleteAtm);}
    },

    complete:{
        getCustomer: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#customer').append("<option value='"+data[o].customer+"' > "+data[o].customer+" </option>");
            }
            table.ajax.reload();
        },
        getDistrict: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#district').append("<option value='"+data[o].district+"'> "+data[o].district+" </option>");
            }
        },
        getSpv: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#fse_spv').append("<option value='"+data[o].fse_spv+"'> "+data[o].fse_spv + " - FSM: " + data[o].fse_fsm+" </option>");
            }
        },
        deleteAtm:(res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            for(let o in data){
                $('#fse_spv').append("<option value='"+data[o].fse_spv+"'> "+data[o].fse_spv + " - FSM: " + data[o].fse_fsm+" </option>");
            }
        }
    },
    showError:(message)=>{
        $('#alertbox #message').html(message);
		$('#alertbox').show();
		return false;
    }
};

var init_table = ()=>{
    //datyatable
	var link = "/api/dm_atm/get/list";
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
        columnDefs: [{ 
            orderable: false,
            targets: [ 0 ]
        }],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        language: {
            search: '<span>Search:</span> _INPUT_',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        }
    });

    var field = []
    for(var a in _head){
        switch(a){
            case 'id':
                field.push({ "data":null ,"orderable":false, "searchable":false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html('<div class="btn-group">'
                            +'<a href="javascript:btn.edit(\''+oData.id+'\')" class="btn btn-sm btn-secondary bg-blue" style="margin-bottom:5px;""><i class="fa fa-eye"></i> </a>&nbsp;'
                            +'<a href="javascript:btn.delete(\''+oData.id+'\')" class="btn btn-sm bg-red style="margin-bottom:5px;""><i class="fa fa-trash"></i></a> '
                            +'</div>'
                        );
                    }
                })
                break;
            default: field.push({data:a});break;
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
                exportOptions: {
                    columns: ':visible:not(:first-child)',
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
                exportOptions: {
                    columns: ':visible:not(:first-child)',
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
                exportOptions: {
                    columns: ':visible:not(:first-child)',
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
                return $('#formx').serialize();
        	}
        },            
        "columns": field,

        order: [[ 0, "desc" ]],
        columnDefs: [{ 
            "width":"70px",
            orderable: false,
            targets: [ 0 ]
        }],
    });

    //untuk menambahkan fungsi pada setiap button yang ada
    $('#dt_table tbody').on('click', 'a', function () {
        var data = table.row($(this).parents('tr')).data();
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
};