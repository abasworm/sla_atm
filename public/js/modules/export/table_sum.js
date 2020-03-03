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
});

var init_table = ()=>{
    
	// //membuat footer menjadi field input
    // $('#dt_table tfoot th').each(function () {
    //     var title = $('#dt_table thead th').eq($(this).index()).text();
    //     if (title !== 'Aksi'){
    //         $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    //     }
    // });
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
        switch(a){
            case 'uid' : 
                field.push({ "width":"10%","data":'uid'  ,"orderable":false, "searchable":false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html('<div class="btn-group">'
                            +'<a href="javascript:view(\''+sData+'\')" class="btn btn-sm btn-secondary bg-blue" style="margin-bottom:5px;""><i class="fa fa-eye"></i> </a>&nbsp;'
                           
                            //+'<a href="javascript:del(\''+oData.uid+'\')" class="btn btn-sm bg-red style="margin-bottom:5px;""><i class="fa fa-trash"></i> HAPUS</a> '
                            +'</div>'
                        );
                    }
                });break;
            case 'open_ticket': 
                field.push(
                    {
                        "data": a, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((sData && sData != 'null')?toDateString(sData):"-");}
                    }
                );break;
            case 'fs_eta' : 
                field.push(
                    {
                        "data": a, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((sData && sData != 'null')?toDateString(sData):"-");}
                    }
                );break;
            case 'fs_eta_start': 
                field.push(
                    {
                        "data": a, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((sData && sData != 'null')?toDateString(sData):"-");}
                    }
                );break;
            case 'fs_eta_visit':
                field.push(
                    {
                        "data": a, 
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((sData && sData != 'null')?toDateString(sData):"-");}
                    }
                );break;
            
            default:field.push(
                {
                    "data": a, 
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {$(nTd).html((sData && sData != 'null')?sData:"-");}
                }
            );break;
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
        buttons: [
//             {
//                 extend: 'copy',
//                 text: '<i class="fa fa-copy"></i> Copy',
//                 titleAttr: 'Copy',
// //                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
//                 exportOptions: {
//                     columns: ':visible:not(:last-child)',
//                     modifier: {
//                         page: 'current'
//                     }
//                 },
//                 footer:false
//             }, 
//             {
//                 extend: 'excel',
//                 text: '<i class="fa fa-file-excel"></i> Excel',
//                 titleAttr: 'Excel',
// //                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
//                 exportOptions: {
//                     // columns: ':visible:not(:first-child)',
//                     modifier: {
//                         page: 'current'
//                     }
//                 },
//                 footer:false
//             },
//             {
//                 extend: 'pdf',
//                 text: '<i class="fa fa-document"></i> PDF',
//                 titleAttr: 'PDF',
// //                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
//                 exportOptions: {
//                     // columns: ':visible:not(:first-child)',
//                     modifier: {
//                         page: 'current'
//                     }
//                 },
//                 footer:false
//             }, 
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
        
        "columns": field,

        order: [[ 1, "desc" ]],
       
        
    });

    // //untuk menambahkan fungsi pada setiap button yang ada
    // $('#dt_table tbody').on('click', 'a', function () {
    //     var data = table.row($(this).parents('tr')).data();
    //         //            alert( data[id] +"'ID : "+ data[id] );
    //     console.log($(this).parents('tr'));
    // });

    // //membuat fungsi untuk search pada setiap kolom input yang tersedia
    // table.columns().every(function () {
    //     var that = this;
    //     $('input', this.footer()).on('keyup change', function () {
    //         if (that.search() !== this.value) {
    //             that
    //             .search(this.value)
    //             .draw();
    //         }
    //     });
    // });
    
}

function view(id){
    window.location = '/dm_main/view/'+id;
}