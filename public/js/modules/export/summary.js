$(document).ready(function() {
    $('.datepicker').datepicker({
        autoclose : true,
        format: 'yyyy-mm-dd'
    })
    $('#btn_search').click((e)=>{x.ajax.getSummary()});
    
});

var goToData = async(arx)=>{
    var win = window.open('/export/tabel_sum/'+arx);
    if(!win) alert('Please allowed Popup Windows.!')
}

var x = {
    ajax:{
        getSummary: ()=>{$.post('/export/list_summary',$('#fmain').serializeArray(),x.complete.getSummary);},
        
    },

    complete:{
        
        getSummary: (res,ret)=>{
            if(!res.status) return x.showError(res.message);
            var $table = $('#dt_table');
            var $table1 = $('#dt_table1');
            var $table2 = $('#dt_table2');
            var $table3 = $('#dt_table3');

            $table.html("");
            $table1.html("");
            $table2.html("");
            $table3.html("");

            var data = res.results;
            var i = 0;

            var rxb = "";
            var rxc = "";
            var rxf = "";
            var rxi = "";

            var rxstatus = "";
            var rxxstatus = "<th>OPEN</th><th>CLOSED</th>";
            var rxspv = "";
            var rxxspv = "<th>OPEN</th><th>CLOSED</th>";
            var rxowner = "";
            var rxxowner = "<th>OPEN</th><th>CLOSED</th>";

            var tostatus = {};
            var toticket = {};
            var tcticket = {};
            var tospv = {};
            var tcspv = {};
            var toowner = {};
            var tcowner = {};
            let excld = ['CLOSED','CANCELED'];

            for(let o in data){

                var ab = 0;
                if(i==0){
                    var rxa = "<th>DATE</th>";
                    for(let x in data[o].action){
                        rxa += "<th>"+x+"</th>";
                    }
                    rxa += "<th>PERCENTAGE</th>";
                    $table.append("<thead><tr>" +rxa+ "</tr></thead>");
                }
                var rx = "<td>"+toDateString(o).substring(0,10)+"</td>";

                for(let x in data[o].action){
                    if(excld.includes(x))  ab+=parseInt(data[o].action[x]);

                    let param = [o], d = x;
                    if(x=='PROCESSING CCC') d = 'OPEN';
                    param.push('status_action',d);
                    if($('#district').val()) param.push('atm_district',$('#district').val());
                    let hrxv1 = window.btoa(param.join('.'));

                    if(x == 'OPEN TICKET'){
                        rx += "<td>"+(data[o].action[x])+"</td>";
                    }else{
                        rx += "<td><a href='javascript:goToData(\""+hrxv1+"\");' >"+(data[o].action[x])+"</a></td>";
                    }
                    tostatus[x] = (tostatus[x])? tostatus[x]+data[o].action[x] : data[o].action[x];
                }
                rx += "<td>"+((ab)*100/(data[o].action['OPEN TICKET'])).toFixed(2)+" %</td>";
                rxb += "<tr>"+rx+"</tr>";
                
                ///////////////////////////////////////////////////
                var ac = 0;
                if(i==0){
                    var rxd = "<th rowspan=2 >DATE</th>";
                    for(let x in data[o].status_open){
                        rxd += "<th colspan=2>"+x+"</th>";
                        rxstatus += rxxstatus;
                    }
                    rxd += "<th rowspan=2>TOTAL</th>";
                    $table1.append("<thead><tr>" +rxd+ "</tr><tr>"+rxstatus+"</tr></thead>");
                    
                }
                var rxe = "<td>"+toDateString(o).substring(0,10)+"</td>";
                for(let x in data[o].status_open){
                    ac+=parseInt(data[o].status_open[x] + data[o].status_close[x] )

                    let param = [o], d = x;
                    param.push('status',d);
                    if($('#district').val()) param.push('atm_district',$('#district').val());
                    let hrxv1 = window.btoa(param.join('.').concat('.open_status.1'));
                    let hrxv2 = window.btoa(param.join('.').concat('.open_status.0'));

                    rxe += "<td><a href='javascript:goToData(\""+hrxv1+"\");' >"+(data[o].status_open[x])+"</a></td>\
                            <td><a href='javascript:goToData(\""+hrxv2+"\");' >"+(data[o].status_close[x])+ "</a></td>";
                    toticket[x] = (toticket[x])? toticket[x]+data[o].status_open[x] : data[o].status_open[x];
                    tcticket[x] = (tcticket[x])? tcticket[x]+data[o].status_close[x] : data[o].status_close[x];
                }
                rxe += "<td>"+ac+"</td>";
                rxc += "<tr>"+rxe+"</tr>";
                
                ///////////////////////////////////////////////////
                var ad = 0;
                if(i==0){
                    var rxg = "<th rowspan=2 >DATE</th>";
                    for(let x in data[o].spv_open){
                        rxg += "<th colspan=2>"+x+"</th>";
                        rxspv += rxxspv;
                    }
                    rxg += "<th rowspan=2>TOTAL</th>";
                    $table2.append("<thead><tr>" +rxg+ "</tr><tr>"+rxspv+"</tr></thead>");
                }
                var rxh = "<td>"+toDateString(o).substring(0,10)+"</td>";
                for(let x in data[o].spv_open){
                    ad+=parseInt(data[o].spv_open[x] + data[o].spv_close[x] )

                    let param = [o], d = x;
                    param.push('fse_spv_name',d);
                    if($('#district').val()) param.push('atm_district',$('#district').val());
                    let hrxv1 = window.btoa(param.join('.').concat('.open_status.1'));
                    let hrxv2 = window.btoa(param.join('.').concat('.open_status.0'));
                    
                    rxh += "<td><a href='javascript:goToData(\""+hrxv1+"\");' >"+(data[o].spv_open[x])+"</a></td>\
                            <td><a href='javascript:goToData(\""+hrxv2+"\");' >"+(data[o].spv_close[x])+ "</a></td>";
                    tospv[x] = (tospv[x])? tospv[x]+data[o].spv_open[x] : data[o].spv_open[x];
                    tcspv[x] = (tcspv[x])? tcspv[x]+data[o].spv_close[x] : data[o].spv_close[x];
                }
                rxh += "<td>"+ad+"</td>";
                rxf += "<tr>"+rxh+"</tr>";
                ///////////////////////////////////////////////////
                var af = 0;
                if(i==0){
                    var rxj = "<th rowspan=2 >DATE</th>";
                    for(let x in data[o].owner_open){
                        rxj += "<th colspan=2>"+x+"</th>";
                        rxowner += rxxowner;
                    }
                    rxj += "<th rowspan=2>TOTAL</th>";
                    $table3.append("<thead><tr>" +rxj+ "</tr><tr>"+rxowner+"</tr></thead>");
                }
                var rxk = "<td>"+toDateString(o).substring(0,10)+"</td>";
                for(let x in data[o].owner_open){
                    af+=parseInt(data[o].owner_open[x] + data[o].owner_close[x] )

                    let param = [o], d = x;
                    param.push('owner',d);
                    if($('#district').val()) param.push('atm_district',$('#district').val());
                    let hrxv1 = window.btoa(param.join('.').concat('.open_status.1'));
                    let hrxv2 = window.btoa(param.join('.').concat('.open_status.0'));


                    rxk += "<td><a href='javascript:goToData(\""+hrxv1+"\");' >"+(data[o].owner_open[x])+"</a></td>\
                            <td><a href='javascript:goToData(\""+hrxv2+"\");' >"+(data[o].owner_close[x])+ "</a></td>";
                    toowner[x] = (toowner[x])? toowner[x]+data[o].owner_open[x] : data[o].owner_open[x];
                    tcowner[x] = (tcowner[x])? tcowner[x]+data[o].owner_close[x] : data[o].owner_close[x];
                }
                rxk += "<td>"+af+"</td>";
                rxi += "<tr>"+rxk+"</tr>";
                i++;
            }

            /////////////////////////////////////////////////
            var toxstatus = "<td><b>TOTAL</b></td>";
            for(var x in tostatus){
                toxstatus += "<td><b>" + tostatus[x] + "</b></td>";
            }
            toxstatus += "<td><b>" + ((tostatus['CLOSED'] + tostatus['CANCELED']) * 100/ tostatus['OPEN TICKET']).toFixed(2) + "% </b></td>";
            rxb += "<tr>"+toxstatus+"</tr>";

            /////////////////////////////////////////////////
            var toxticket = "<td><b>TOTAL</b></td>";
            var topticket = "<td><b>PERCENTAGE</b></td>";
            var totticket = 0;
            var topxticket = 0;
            var topyticket = 0;
            for(var x in toticket){
                toxticket += "<td><b>" + toticket[x] + "</b></td><td><b>" + tcticket[x] + "</b></td>";
                topticket += "<td colspan=2><b>"+ (((tcticket[x]+toticket[x])>0)?(tcticket[x] * 100 / (tcticket[x]+toticket[x])):0).toFixed(2) +" %</b></td><td style='display: none;'></td>"
                totticket += (toticket[x]+tcticket[x]);
                topxticket += toticket[x];
                topyticket += tcticket[x];
            }
            toxticket +="<td><b>"+totticket+"</b></td>";
            topticket +="<td><b>"+(topyticket*100/(topxticket+topyticket)).toFixed(2)+" %</b></td>";
            rxc += "<tr>"+toxticket+"</tr>";
            rxc += "<tr>"+topticket+"</tr>";

            /////////////////////////////////////////////////
            var toxspv = "<td><b>TOTAL</b></td>";
            var topspv = "<td><b>PERCENTAGE</b></td>";
            var totspv = 0;
            var topxspv = 0;
            var topyspv = 0;
            for(var x in tospv){
                toxspv += "<td><b>" + tospv[x] + "</b></td><td><b>" + tcspv[x] + "</b></td>";
                topspv += "<td colspan=2><b>"+ (((tcspv[x]+tospv[x])>0)?(tcspv[x] * 100 / (tcspv[x]+tospv[x])):0).toFixed(2) +" %</b></td><td style='display: none;'></td>"
                totspv += (tospv[x]+tcspv[x]);
                topxspv += tospv[x];
                topyspv += tcspv[x];
            }
            toxspv +="<td><b>"+totspv+"</b></td>";
            topspv +="<td><b>"+(topyspv*100/(topxspv+topyspv)).toFixed(2)+" %</b></td>";
            rxf += "<tr>"+toxspv+"</tr>";
            rxf += "<tr>"+topspv+"</tr>";

            ///////////////////////////////////////////////
            var toxowner = "<td><b>TOTAL</b></td>";
            var topowner = "<td><b>PERCENTAGE</b></td>";
            var totowner = 0;
            var topxowner = 0;
            var topyowner = 0;
            for(var x in toowner){
                toxowner += "<td><b>" + toowner[x] + "</b></td><td><b>" + tcowner[x] + "</b></td>";
                topowner += "<td colspan=2><b>"+ (((tcowner[x]+toowner[x])>0)?(tcowner[x] * 100 / (tcowner[x]+toowner[x])):0).toFixed(2) +" %</b></td><td style='display: none;'></td>"
                totowner += (toowner[x]+tcowner[x]);
                topxowner += toowner[x];
                topyowner += tcowner[x];
            }
            toxowner +="<td><b>"+totowner+"</b></td>";
            topowner +="<td><b>"+(topyowner*100/(topxowner+topyowner)).toFixed(2)+" %</b></td>";
            rxi += "<tr>"+toxowner+"</tr>";
            rxi += "<tr>"+topowner+"</tr>";


            $table.append("<tbody>" +rxb+ "</tbody>");
            $table1.append("<tbody>" +rxc+ "</tbody>");
            $table2.append("<tbody>" +rxf+ "</tbody>");
            $table3.append("<tbody>" +rxi+ "</tbody>");

            

            var config = {
                "lengthMenu": [[-1], ["All"]],
                ordering: false,
                scrollX: true,
                autoWidth: false,
                dom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>",
                destroy: true,
                stateSave: false,
                deferRender: true,
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fa fa-file-excel"></i> Excel All Page',
                        titleAttr: 'Excel All Page',
                        // exportOptions: {
                        //     columns: ':visible:not(:first-child)'
                        // },
                        footer:true
                    }
                ]
            }
            $table.DataTable(config);
            $table1.DataTable(config);
            $table2.DataTable(config);
            $table3.DataTable(config);
        },
        
    },
    showError:(message)=>{
        $('#alertbox #message').html(message);
		$('#alertbox').show();
		return false;
    }
};