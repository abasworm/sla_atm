var table;
$(document).ready(async function() {

    //ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
    });

    $('#btn_save').click((e)=>{x.ajax.uploadData();});
    $('#btn_transfer').click((e)=>{x.ajax.transferData();});
    $('#btn_clear').click((e)=>{x.ajax.clearData();});
    $('#btn_refresh').click((e)=>{table.ajax.reload()});
    await init_table();
    checkData();
    
    
});

var x = {
    ajax:{
        uploadData: ()=>{
            var fdata = new FormData();
            fdata.append('images',$('#FileID').get(0).files[0]);
            $.ajax({
                method: "POST",
                type: "POST",
                url: "/api/import/upload",
                data: fdata,
                cache: false,
                contentType: false,
                processData: false,
                success: x.complete.uploadData
            });
        },
        transferData: ()=>{$.post('/api/import/transfer',{},x.complete.transferData)},
        clearData: ()=>{$.post('/api/import/clear',{},x.complete.clearData)}

    },

    complete:{
        uploadData: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var data = res.results;
            table.ajax.reload();
            $('#btn_transfer').removeClass('disabled');
        },
        transferData: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            table.ajax.reload();
            x.showError(JSON.stringify(res.results));
            $('#btn_transfer').addClass('disabled');
        },
        clearData: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            table.ajax.reload();
            $('#btn_transfer').addClass('disabled');
        }

        
    },
    showError:(message)=>{
        $('#alertbox #message').html(message);
		$('#alertbox').show();
		return false;
    }
};


var init_table = ()=>{//datyatable
	var link = "/api/import/list";
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
        
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        language: {
            search: '<span>Search:</span> _INPUT_',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        }
    });

    var field = [];
    for(var a in _head){
        let c = {};
        let x = a.toString();
        switch(a.toString()){
            case 'problem_start':
            case 'worktime_start':
            case 'worktime_end':
                
                c.data = (row,type,val,meta)=>{return (row[x])?toDateString(row[x]):"-"};
                //c.data ={};
                // c.data.fnCreatedCell = (nTd, sData, oData, iRow, iCol) => {
                    
                //     $(nTd).html(oData.problem_start);
                // }
                break;
            default :  c.data = x; break;
        }
        field.push(c);
    }
    //mendeklarasikan dan mendefinisikan data table
    table = $('#dt_table').DataTable({
        scrollX: true,
        dom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>",
        //destroy: true,
        stateSave: false,
        //deferRender: true,
        processing: true,
        autoWidth: true,
        
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
        "columns": field,
        //order: [[ 0, "desc" ]],
        // columnDefs: [
        //     {"width":"100px", orderable: false, targets:[0]}
            
        // ],
    });

    //untuk menambahkan fungsi pada setiap button yang ada
    $('#dt_table tbody').on('click', 'a', function () {
        var data = table.row($(this).parents('tr')).data();
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
};

var checkData = ()=>{if(table.data().count()>1){$('#btn_transfer').removeClass('disabled');}}