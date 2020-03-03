var table;
$(document).ready(function() {

    //ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

    //datyatable
	var link = "/api/users/datatable";
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
        

    //mendeklarasikan dan mendefinisikan data table
    table = $('#dt_table').DataTable({
        "scrollX":true,
        "processing": true,
        dom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>",
        destroy: true,
        stateSave: false,
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
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
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
                d.key = 'abcdh';

        	}
        },            
        "columns": [
            
            { "data":null ,"orderable":false, "searchable":false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<div class="btn-group">'
                        +'<a href="javascript:edit(\''+oData.id+'\')" class="btn btn-sm btn-warning"><i class="fa fa-edit"></i></a> '
                        +'<a href="javascript:del(\''+oData.id+'\')" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></a> '
                        +'</div>'
                    );
                }
            },
            {"data": "username"},
            {"data": "fullname"}
                
        ],

        order: [[ 0, "desc" ]],
        columnDefs: [{ 
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
});

function edit(id){
    document.location = '/users/edit/'+id;
}

function del(id){
    a = confirm('Are you sure want to delete ?');
    
    if(a){
        xhqr('/api/users/'+id,'DELETE',{key :'abcdh'},function(res,ret){
            if(!res.status){
                $('#alertbox #message').html(res.message);
                $('#alertbox').show();
            }else{
                table.ajax.reload();
            }
        });
    }
}