/* ------------------------------------------------------------------------------
 *
 *  # c3_advanced.js
 *  Viknesh Alagappan
 *  6/20/18
 *  Base file: limitless/layout_2/assets/js/charts/c3/c3_advanced.js
 *  First experimentation with Limitless for a dashboard
 *
 * ---------------------------------------------------------------------------- */

$(function () {
    var initialload=true;
    var updateinterval=5000;//auto update every 5 sec by default
    //switching default switches to switchery switches
    var switches = Array.prototype.slice.call(document.querySelectorAll('.switch'));
    switches.forEach(function(html) {
        var switchery = new Switchery(html, {color: '#4CAF50'});
    });
    $('#update-5').click(function(){
        updateinterval=5*1000;
        clearInterval(intervalVar);
        if($('#livetoggle').prop('checked')){
            intervalVar=setInterval(update,updateinterval);
        }
        $('#update-button').text('Update Interval: 5s');
    })
    $('#update-10').click(function(){
        updateinterval=10*1000;
        clearInterval(intervalVar);
        if($('#livetoggle').prop('checked')){
            intervalVar=setInterval(update,updateinterval);
        }
        $('#update-button').text('Update Interval: 10s');
    })
    $('#update-30').click(function(){
        updateinterval=30*1000;
        clearInterval(intervalVar);
        if($('#livetoggle').prop('checked')){
            intervalVar=setInterval(update,updateinterval);
        }
        $('#update-button').text('Update Interval: 30s');
    })
    $('#update-60').click(function(){
        updateinterval=60*1000;
        clearInterval(intervalVar);
        if($('#livetoggle').prop('checked')){
            intervalVar=setInterval(update,updateinterval);
        }
        $('#update-button').text('Update Interval: 60s');
    })
    var intervalVar=setInterval(update,updateinterval);
    $('#livetoggle').click(function(){
        //toggles auto update
        if($('#livetoggle').prop('checked')){
            intervalVar=setInterval(update,updateinterval); //resets interval (starts live update)
        }else{
            clearInterval(intervalVar);//clears interval (stops live update)
        }
    })
    document.getElementById("serversoff").style.visibility = "hidden";//servers offline message hidden at start
    var serverbtn=document.getElementById('resetserver');
    var serverbtntext=document.getElementById('serverbuttontext');
    serverbtn.value='Online';
    serverbtn.onclick=function(){
        switchbtn();
    }
    //Function that extends the jQuery library for ease of use for animate.css
    $.fn.extend({
        animateCss: function(animationName, callback) {
          var animationEnd = (function(el) {
            var animations = {
              animation: 'animationend',
              OAnimation: 'oAnimationEnd',
              MozAnimation: 'mozAnimationEnd',
              WebkitAnimation: 'webkitAnimationEnd',
            };
            for (var t in animations) {
              if (el.style[t] !== undefined) {
                return animations[t];
              }
            }
          })(document.createElement('div'));
      
          this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
      
            if (typeof callback === 'function') callback();
          });
      
          return this;
        },
      });
    function switchbtn(){
        //button to toggle servers on/offline
        if(serverbtntext.innerHTML=='Servers Online?'){
            
            $('#serversoff').animateCss('flash',function(){
                document.getElementById("serversoff").style.visibility = "hidden";
                document.getElementById("serverson").style.visibility = "visible";
                $('#serverson').animateCss('tada');
                $('#resetserver').animateCss('flipOutX',function(){
                    serverbtntext.innerHTML='Servers Offline?';
                })
            });
            
        }else if(serverbtntext.innerHTML=='Servers Offline?'){
            $('#serverson').animateCss('hinge',function(){
                document.getElementById("serverson").style.visibility = "hidden";
                document.getElementById("serversoff").style.visibility = "visible";
                $('#serversoff').animateCss('flash');
                $('#resetserver').animateCss('flipOutX',function(){
                    serverbtntext.innerHTML='Servers Online?';
                })
            });
        }
    }
    
    // Chart transforms (ISS chart)
    // ------------------------------

    // Generate chart
    var transform = c3.generate({
        bindto: '#c3-transform',
        size: { height: 400 },
        data: {
            columns: [
                ['Latitude',0],
                ['Longitude',0]
            ]
        },
        grid: {
            y: {
                show: true
            }
        }
    });
    // Total parts chart
    // ------------------------------

    // Generate chart
    var serverload = c3.generate({
        bindto: '#c3-serverload',
        size: { height: 400 },
        data: {
            columns: [
                ['Load',-1]
            ],
            types: {
                Load: 'area-spline'
            }
        },
        color: {
            pattern: ['#E74C3C']
        },
        grid: {
            y: {
                show: true
            }
        }
    });
    

    // Run update on click
    $('#btn-transform').click(function () {
        $(this).addClass('disabled');
        //update();
    });
    



    // Zoomable chart
    // ------------------------------

    // Generate chart
    var zoomable_chart = c3.generate({
        bindto: '#c3-chart-zoomable',
        size: { height: 400 },
        data: {
            columns: [
                ['random', 30, 120, 320, 180, 50, 250, 167, 279, 290, 400, 214, 190, 40, 400, 162, 289, 300, 200, 120, 320, 390, 110, 130, 400, 240, 189, 250, 30, 100, 200, 300, 250, 50, 100, 50, 300, 250, 20, 90, 150, 400, 320, 220, 150, 190, 270, 190, 350, 90, 300, 150, 220, 170, 40]
            ]
        },
        color: {
            pattern: ['#1E88E5']
        },
        zoom: {
            enabled: true
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        }
    });
    function update() {       
        //ZOOMABLE CHART
        var zoomdata=zoomable_chart.data(['random']);
        zoomdata[0].values.push({
            id:"random",
            value: Math.floor(Math.random()*400),
            x:zoomdata[0].values[zoomdata[0].values.length-1].x+1,
            index:zoomdata[0].values[zoomdata[0].values.length-1].x+1
        });
        if(zoomdata[0].values.length>200){
            zoomdata[0].values.shift();
        }
        zoomable_chart.load(zoomdata);//pushing zoom data
        //ZOOMABLE CHART

        //ADDING ISS DATA
        var requestURL = 'http://api.open-notify.org/iss-now.json';
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        var prev=transform.data(['Latitude','Longitude']);
        request.onload = function () {
            var testData = request.response;
            
            //console.log(prev);
            if(prev[0].values.length>50){
                
                prev[0].values.shift();
                prev[1].values.shift();
            }
            for(var i=0;i<prev[0].values.length;i++){
                prev[0].values[i].index--;
                prev[1].values[i].index--;
            }
            prev[0].values.push({
                id: 'Latitude',
                index: prev[0].values.length,
                value: parseFloat(testData['iss_position']['latitude']),
                x: testData['timestamp']
            });
            prev[1].values.push({
                id: 'Longitude',
                index: prev[1].values.length,
                value: parseFloat(testData['iss_position']['longitude']),
                x: testData['timestamp']
            });
            if(prev[0].values[0].x==0||prev[0].values[0].x==-1){
                prev[0].values.shift();
                prev[1].values.shift();
            }
            transform.load(prev);//pushing iss data
        }
        //ADDING ISS DATA

        //ADDING MY SAMPLE DATA
        var requestURL1='https://right1.github.io/-right1.github.io/misc/limitlessdata.json';
        var request1 = new XMLHttpRequest();
        request1.open('GET', requestURL1);
        request1.responseType = 'json';
        request1.send();
        request1.onload=function(){
            var sampleData=request1.response;
            $('#staffonline').text(sampleData['staffonline']);//updating staff online
            $('#servicestatus').text(sampleData['servicestatus']);//updating service status
            $('#partschanged').text(sampleData['partschanged']);//updating daily parts changed

            //CPU & RAM METER
            var cpu=document.getElementById('cpu_usage');
            var ram=document.getElementById('ram_usage');
            var cpu_usage=parseInt(sampleData['cpuusage']*100);
            var ram_usage=parseInt(sampleData['ramusage']*100);
            //Randomizing (remove later)
            cpu_usage+=(Math.floor(Math.random()*3)-1)*10;
            ram_usage+=(Math.floor(Math.random()*3)-1)*15;
            //console.log(ram_usage);
            if(('CPU: '+cpu_usage+'%')!=$('#cpu_usage_text').text()){
                cpu.innerHTML='';
                $('#cpu_usage_text').text('CPU: '+cpu_usage+'%');
                progressIcon('#cpu_usage', 30, 2.5, "#00897B", "#fff", 0.01*cpu_usage, "icon-windows2");
            }
            if(('RAM: '+ram_usage+'%')!=$('#ram_usage_text').text()){
                ram.innerHTML='';
                $('#ram_usage_text').text('RAM: '+ram_usage+'%');
                progressIcon('#ram_usage', 30, 2.5, "#673AB7", "#fff", 0.01*ram_usage, "icon-meter-fast");
            }
            //CPU & RAM METER

            //UPDATING PART QUANTITIES BAR CHART
            var quantities=sampleData['partquantities'];
            var bardata=bar_chart.data();
            for(var i=0;i<quantities.length;i++){
                bardata[0].values[i]={
                    id: 'Part Quantity',
                    index: i,
                    value: quantities[i],
                    x: i
                };
            }
            bar_chart.load(bardata);
            //UPDATING PART QUANTITIES BAR CHART

            //UPDATING SERVER LOAD CHART
            var load=sampleData['serverload'];
            var currentload=serverload.data();
            var currentloaddata=[];
            for(var i=0;i<currentload[0].values.length;i++){
                currentloaddata.push(currentload[0].values[i].value);
            }
            if(initialload){
                currentload[0].values.shift();
                for(var i=0;i<load.length;i++){
                    currentload[0].values.push({
                        id: 'Load',
                        index: i,
                        value: load[i],
                        x: i
                    })
                }
                serverload.load(currentload);
            }else if(currentloaddata[currentloaddata.length-1]!=load[load.length-1]){//new value pushed
                currentload[0].values.push({
                    id: 'Load',
                    index: currentloaddata[0].values[currentloaddata.length-1].x+1,
                    value: load[load.length-1],
                    x: currentloaddata[0].values[currentloaddata.length-1].x+1
                })
                serverload.load(currentload);
            }
            //UPDATING SERVER LOAD CHART

            //LOADING TOTAL PARTS CHART (updates on refresh only)
            var newparttotal=['parts'].concat(sampleData['totalparts']);
            var newparttotal_dates=['x'].concat(sampleData['totalparts_date']);
            if(initialload){
                var partschart = c3.generate({
                    bindto: '#c3-chart-totalparts',
                    size: { height: 400 },
                    data: {
                        x: 'x',
                        columns: [
                            newparttotal_dates,
                            newparttotal
                        ],
                        types: {
                            parts: 'area-spline'
                        }
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick:{
                                format: '%Y-%m-%d'
                            }
                        }
                    },
                    color: {
                        pattern: ['#F39C12']
                    },
                    subchart: {
                        show: true
                    },
                    grid: {
                        y: {
                            show: true
                        }
                    }
                });
            }
            //LOADING TOTAL PARTS CHART (updates on refresh only)
            initialload=false;
        }
        //ADDING MY SAMPLE DATA
    }
    update();//initial update so that it doesn't take 5 seconds

    // Subchart (brushing)
    // ------------------------------

    // Generate chart
    var subchart = c3.generate({
        bindto: '#c3-subchart',
        size: { height: 400 },
        data: {
            columns: [
                ['sample', 30, 200, 100, 400, 150, 250, 150, 200, 170, 240, 350, 150, 100, 400, 150, 250, 150, 200, 170, 240, 100, 150, 250, 150, 200, 170, 240, 30, 200, 100, 400, 150, 250, 150, 200, 170, 240, 350, 150, 100, 400, 350, 220, 250, 300, 270, 140, 150, 90, 150, 50, 120, 70, 40]
            ]
        },
        color: {
            pattern: ['#00ACC1']
        },
        subchart: {
            show: true
        },
        grid: {
            y: {
                show: true
            }
        }
    });

    // Bar Chart (Part Quantities)
    // ------------------------------

    // Generate chart

    var bar_chart = c3.generate({
        bindto: '#c3-bar-chart',
        size: { height: 400 },
        data: {
            columns: [
                ['Part Quantity', 15, 15, 15, 15, 15,15, 15, 15, 15, 15,15, 15, 15, 15, 15,15, 15, 15, 15, 15]
            ],
            type: 'bar'
        },
        color: {
            pattern: ['#2196F3', '#FF9800', '#4CAF50']
        },
        bar: {
            width: {
                ratio: 0.5
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        axis: {
            x: {
                type: 'category',
                categories: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9','P10','P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19','P20']
            }
        },
        grid: {
            x: {
                show: true
            }
        }
    });
    // Label format
    // ------------------------------

    // Generate chart
    var label_format = c3.generate({
        bindto: '#c3-label-format',
        size: { height: 400 },
        data: {
            columns: [
                ['data1', 30, -200, -100, 400, 150, 250, 100, 120, 150],
                ['data2', -50, 150, 150, -150, -50, -150, -120, -100, -120],
                ['data3', -100, 100, -40, 100, -150, -50, 90, -40, 100]
            ],
            groups: [
                ['data1', 'data2']
            ],
            type: 'bar',
            labels: {
                format: {
                    y: d3.format('$')
                }
            }
        },
        color: {
            pattern: ['#4CAF50', '#F4511E', '#1E88E5']
        },
        bar: {
            width: {
                ratio: 1
            }
        },
        grid: {
            y: {
                lines: [{ value: 0 }]
            }
        }
    });



    // Data colors
    // ------------------------------

    // Generate chart
    var data_color = c3.generate({
        bindto: '#c3-data-color',
        size: { height: 400 },
        data: {
            columns: [
                ['data1', 30, 20, 50, 40, 60, 50],
                ['data2', 200, 130, 90, 240, 130, 220],
                ['data3', 300, 200, 160, 400, 250, 250]
            ],
            type: 'bar',
            colors: {
                data1: '#4DB6AC',
                data2: '#009688',
                data3: '#00796B'
            }
        },
        grid: {
            y: {
                show: true
            }
        }
    });



    // Resize chart on sidebar width change
    $(".sidebar-control").on('click', function () {
        transform.resize();
        zoomable_chart.resize();
        subchart.resize();
        label_format.resize();
        data_color.resize();
    });
    
    function progressIcon(element, radius, border, backgroundColor, foregroundColor, end, iconClass) {
        

        // Basic setup
        // ------------------------------

        // Main variables
        var d3Container = d3.select(element),
            startPercent = 0,
            iconSize = 32,
            endPercent = end,
            twoPi = Math.PI * 2,
            formatPercent = d3.format('.0%'),
            boxSize = radius * 2;

        // Values count
        var count = Math.abs((endPercent - startPercent) / 0.01);

        // Values step
        var step = endPercent < startPercent ? -0.01 : 0.01;


        // Create chart
        // ------------------------------

        // Add SVG element
        var container = d3Container.append('svg');

        // Add SVG group
        var svg = container
            .attr('width', boxSize)
            .attr('height', boxSize)
            .append('g')
                .attr('transform', 'translate(' + (boxSize / 2) + ',' + (boxSize / 2) + ')');


        // Construct chart layout
        // ------------------------------

        // Arc
        var arc = d3.svg.arc()
            .startAngle(0)
            .innerRadius(radius)
            .outerRadius(radius - border)
            .cornerRadius(20);


        //
        // Append chart elements
        //

        // Paths
        // ------------------------------

        // Background path
        svg.append('path')
            .attr('class', 'd3-progress-background')
            .attr('d', arc.endAngle(twoPi))
            .style('fill', backgroundColor);

        // Foreground path
        var foreground = svg.append('path')
            .attr('class', 'd3-progress-foreground')
            .attr('filter', 'url(#blur)')
            .style({
                'fill': foregroundColor,
                'stroke': foregroundColor
            });

        // Front path
        var front = svg.append('path')
            .attr('class', 'd3-progress-front')
            .style({
                'fill': foregroundColor,
                'fill-opacity': 1
            });


        // Text
        // ------------------------------

        // Percentage text value
        var numberText = d3.select('.progress-percentage')
                .attr('class', 'mt-15 mb-5');

        // Icon
        d3.select(element)
            .append("i")
                .attr("class", iconClass + " counter-icon")
                .style({
                    'color': foregroundColor,
                    'top': ((boxSize - iconSize) / 2) + 'px'
                });


        // Animation
        // ------------------------------

        // Animate path
        function updateProgress(progress) {
            foreground.attr('d', arc.endAngle(twoPi * progress));
            front.attr('d', arc.endAngle(twoPi * progress));
            numberText.text(formatPercent(progress));
        }

        // Animate text
        var progress = startPercent;
        (function loops() {
            updateProgress(progress);
            if (count > 0) {
                count--;
                progress += step;
                setTimeout(loops, 10);
            }
        })();
    }
});