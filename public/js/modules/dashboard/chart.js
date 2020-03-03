var chartCustomer;
var chartStatusAction;
var chartStatus;
var chartRange;
var chartStatusSummary;
var hslToHex = (t,n,e)=>{let o,r,s;if(t/=360,e/=100,0===(n/=100))o=r=s=e;else{const c=(t,n,e)=>(e<0&&(e+=1),e>1&&(e-=1),e<1/6?t+6*(n-t)*e:e<.5?n:e<2/3?t+(n-t)*(2/3-e)*6:t),l=e<.5?e*(1+n):e+n-e*n,u=2*e-l;o=c(u,l,t+1/3),r=c(u,l,t),s=c(u,l,t-1/3)}const c=t=>{const n=Math.round(255*t).toString(16);return 1===n.length?"0"+n:n};return`#${c(o)}${c(r)}${c(s)}`}
var percentage = (m,v)=>{return (v*100)/(m);};
var ftable = (select,chartx,data)=>{
    $(select+' tbody').html('');
    let tr = d3
        .select(select+' tbody')
        .selectAll("tr")
        .data(data)
        .enter().append('tr')
        .on('mouseover', function(id) {
            chartx.focus(id.substring(0,(id.indexOf(','))));
        })
        .on('mouseout', function(id) {
            chartx.revert();
        })

    let td1 = tr
        .append('td')
        .html(function(id) {
            return chartx.data(id.substring(0,(id.indexOf(','))));
        })
        .html((id)=>{return id.substring(0,(id.indexOf(',')));});

    let td2 = tr
        .append('td')
        .insert('span', '.legend-label-action').attr('class', 'badge')
        .each(function(id) {
            d3.select(this).style('background-color', chartx.color(id.substring(0,(id.indexOf(',')))));
        })
        .text((id)=>{
            let a = id.substring(id.indexOf(','), id.length);
            let b = a.replace(', Total: ','');
            return b;
        });
}


let xData = [];

$(document).ready(async (e)=>{

    await x.ajax.getStatusAction();
    await x.ajax.getStatus();
    await x.ajax.getCustomer();
    await x.ajax.getOpenToday();
    await x.ajax.getOpenAll();
    await x.ajax.getStatusSummary();
    await x.ajax.getRangeDays();

    let sec = 60;
    function ax(){setTimeout(async()=>{await x.ajax.getStatusAction();ax();}, sec * 1000);}
    function bx(){setTimeout(async()=>{await x.ajax.getStatus();bx();}, sec * 1000);}
    function cx(){setTimeout(async()=>{await x.ajax.getCustomer();cx();}, sec * 1000);}
    function dx(){setTimeout(async()=>{await x.ajax.getOpenToday();dx();}, sec * 1000);}
    function ex(){setTimeout(async()=>{await x.ajax.getOpenAll();ex();}, sec * 1000);}
    function fx(){setTimeout(async()=>{await x.ajax.getStatusSummary();fx();}, sec * 1000);}
    function gx(){setTimeout(async()=>{await x.ajax.getRangeDays();gx();}, sec * 1000);}
    
    ax();
    bx();
    cx();
    dx();
    ex();
    fx();
    gx();

});

var x = {
    ajax:{
        getStatusAction:()=>{$.post('/api/dashboard/get/status/action',{},x.complete.getStatusAction);},
        getStatus:()=>{$.post('/api/dashboard/get/status/list',{},x.complete.getStatus);},
        getCustomer:()=>{$.post('/api/dashboard/get/customer',{},x.complete.getCustomer);},
        getStatusSummary:()=>{$.post('/api/dashboard/get/status/summary',{},x.complete.getStatusSummary);},
        getOpenToday:()=>{$.post('/api/dashboard/get/open/today',{},x.complete.getOpenToday);},
        getOpenAll:()=>{$.post('/api/dashboard/get/open/all',{},x.complete.getOpenAll);},
        getRangeDays:()=>{$.post('/api/dashboard/get/range/days',{},x.complete.getRangeDays);},
    },
    complete:{
        getOpenToday:(res,ret)=>{
            $('#openToday').html(res.results);
        },
        getOpenAll:(res,ret)=>{
            $('#openAll').html(res.results);
        },
        getCustomer:(res,ret)=>{
            // //console.log(res.results);
            var data = res.results;
            let xAxis = [];
            var colors = {};
            var len = data.length;
            //var percentage = (m,v)=>{return (v*100)/(m/2);};
            var percentage = (m,v)=>{ 
                let min = 20;
                let percent =(v*100)/m;
                let rate = 100-(min + (min*((percent)/40)));
                return (rate);};

            let xxc= 140;
            for(var x in data){
                xxc += 15;
                console.log(percentage(len,x));
                console.log(hslToHex(xxc,60,percentage(len,x)).toString());
                colors[data[x][0]] = hslToHex(xxc,60,percentage(len,x)).toString();
            }            

            for(var x in res.results){
                xAxis.push(res.results[x][0]+ ', Total: '+res.results[x][1]);
                //console.log(res.results[x][0]);
            }
            chartCustomer = c3.generate({
                data:{
                    columns: res.results,
                    type: 'pie',
                    colors: colors
                },
                axis: {
                    x: {label: 'Sepal.Width'}, y: {label: 'Petal.Width'}
                },
                pie: {
                    label: {
                        format: function (value, ratio, id) {
                            return id +" : "+ value;
                        }
                    }
                },
                legend:{
                    show: false
                },
                tooltip: {
                    format: {
                        
                        value: function(value, ratio) {
                            var percentFormat = d3.format('.1%');
                            var twoDecimal = d3.format('.2f');
                            return 'PERCENTAGE: '+percentFormat(ratio) + ', TOTAL: ' + twoDecimal(value);
                        }
                    }
                }
            });
            $('#customer-body').html('');
            d3.select('#customer-body').insert('div')
                .attr('class', 'legend col-md-12')
                //.insert('ul').attr('class', 'list-group')
                .selectAll('span')
                .data(xAxis)
                .enter()
                .append('div').attr('class', 'col-md-3 col-xs-6 list-group')
                .append('div').attr('class', 'legend-label')
                .attr('data-id', function(id) {
                    return id.substring(0,(id.indexOf(',')));
                })
                .append('div', '.legend-label')
                .html(function(id) {
                    var data = chartCustomer.data(id.substring(0,(id.indexOf(','))));
                    return id + '&nbsp&nbsp&nbsp';
                })

                .on('mouseover', function(id) {
                    chartCustomer.focus(id.substring(0,(id.indexOf(','))));
                })
                .on('mouseout', function(id) {
                    chartCustomer.revert();
                })

                .insert('span', '.legend-label').attr('class', 'badge')
                .each(function(id) {
                    d3.select(this).style('background-color', chartCustomer.color(id.substring(0,(id.indexOf(',')))));
                })
                .html(function(id){
                    return '&nbsp&nbsp&nbsp&nbsp&nbsp'
                });

            chartCustomer.resize({height:600})
            $('#chartCustomer').html(chartCustomer.element);

        },

        getStatusAction:(res,ret)=>{
            // //console.log(res.results);
            let data = res.results;
            let colors = {};
            let len = data.length;
            let actionAxis = [];
            
            for(var x in data){
                colors[data[x][0]] = hslToHex(((percentage(len,x)*360)/100).toFixed(),60,50).toString();
            }            

            for(var x in res.results){
                actionAxis.push(res.results[x][0]+ ', Total: '+res.results[x][1]);
            }

            chartStatusAction = c3.generate({
                data:{
                    columns: res.results,
                    type: 'pie',
                    colors: colors
                },
                legend:{
                    show: false
                },
                tooltip: {
                    format: {
                        value: function(value, ratio) {
                            let percentFormat = d3.format('.1%');
                            let twoDecimal = d3.format('.2f');
                            return 'PERCENTAGE: '+percentFormat(ratio) + ', TOTAL: ' + twoDecimal(value);
                        }
                    }
                }
            });
            ftable('#tb_action',chartStatusAction,actionAxis);
            $('#chartStatusAction').html(chartStatusAction.element);
        },

        getRangeDays:(res,ret)=>{
            let data = res.results;
            let colors = {};
            let len = data.length;
            let actionAxis = [];
            
            for(let x in data){
                colors[data[x][0]] = hslToHex(((percentage(len,x)*360)/100).toFixed(),60,50).toString();
            }            

            for(let x in res.results){
                actionAxis.push(res.results[x][0]+ ', Total: '+res.results[x][1]);
            }

            chartRange = c3.generate({
                data:{
                    columns: res.results,
                    type: 'pie',
                    colors: colors
                },
                legend:{
                    show: false
                },
                tooltip: {
                    format: {
                        value: function(value, ratio) {
                            let percentFormat = d3.format('.1%');
                            let twoDecimal = d3.format('.2f');
                            return 'PERCENTAGE: '+percentFormat(ratio) + ', TOTAL: ' + twoDecimal(value);
                        }
                    }
                }
            });
            ftable('#tb_range',chartRange,actionAxis);
            $('#chartRange').html(chartRange.element);
        },
        getStatus:(res,ret)=>{
            let data = res.results;
            let colors = {};
            let len = data.length;
            let actionAxis = [];
            
            for(let x in data){
                colors[data[x][0]] = hslToHex(((percentage(len,x)*360)/100).toFixed(),60,50).toString();
            }            

            for(let x in res.results){
                actionAxis.push(res.results[x][0]+ ', Total: '+res.results[x][1]);
            }

            chartStatus = c3.generate({
                data:{
                    columns: res.results,
                    type: 'pie',
                    colors: colors
                },
                legend:{
                    show: false
                },
                tooltip: {
                    format: {
                        value: function(value, ratio) {
                            let percentFormat = d3.format('.1%');
                            let twoDecimal = d3.format('.2f');
                            return 'PERCENTAGE: '+percentFormat(ratio) + ', TOTAL: ' + twoDecimal(value);
                        }
                    }
                }
            });
            ftable('#tb_status',chartStatus,actionAxis);
            $('#chartStatus').html(chartStatus.element);
        },
        getStatusSummary:(res,ret)=>{
            console.log(res.results);
            chartStatusSummary = c3.generate({
                data:{
                    columns: res.results.data,
                    type:'bar'
                },
                bar:{
                    width:{
                        ratio:0.5
                    }
                },
                axis:{
                    x:{
                        type:'category',
                        categories : res.results.field
                    }
                }

            })
            $('#chartStatusSummary').html(chartStatusSummary.element);
        },
    }
}