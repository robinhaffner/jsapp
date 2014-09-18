define(function (require) {

    "use strict";

    var Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        chartHtml    	= require('text!tpl/chart.html'),
        chartTpl 		= Handlebars.compile(chartHtml);
	
		
    

        Handlebars.registerHelper('if_eq', function(a, b, opts) {
            if(a == b) // Or === depending on your needs
                return opts.fn(this);
            else
                if(opts == undefined){
                    var ret = "";

                    for(var i=0, j=a.length; i<j; i++) {
                        ret = ret + b.fn(a[i]);
                    }
                    return ret;
                }
                else {
                    return opts.inverse(this);
                }
        });

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };
		
		this.initPlotArrays = function(content){
			console.log('in initPlotArrays');
			//initialize the plot arrays
			var plotTemp=[];
			var ctemp = Cookies.get('__plot1');
			if (new String(ctemp) == '' || Cookies.get('__plot1')==undefined){
				for (var i=0;i<content.answers.length;i++){
					console.log([content.answers[i].score, content.answers[i].answerstxt]);
					plotTemp.push([content.answers[i].score, content.answers[i].answerstxt]);
				
				}
				Cookies.set('__plot1', plotTemp);
			}
			ctemp = Cookies.get('__plot2');
			plotTemp = [];
			if (new String(ctemp) == '' || Cookies.get('__plot2')==undefined){
				for (var i=0;i<content.answers.length;i++){
					console.log([content.answers[i].score, content.answers[i].answerstxt]);
					plotTemp.push([content.answers[i].score, content.answers[i].answerstxt]);
				
				}
				Cookies.set('__plot2', plotTemp);
			}
			ctemp = Cookies.get('__popArray');
			plotTemp = [];
			if (new String(ctemp) == '' || Cookies.get('__popArray')==undefined){
				for (var i=0;i<content.answers.length;i++){
					console.log(content.answers[i].answerstxt.replace(/([^,]+,[^,]+),/g,'$1;'));
					plotTemp.push(content.answers[i].answerstxt.replace(/([^,]+,[^,]+),/g,'$1;'));
				
				}
				Cookies.set('__popArray', plotTemp);
			}
		}
		
		this.renderChart = function(content){
			var _type = content.type,colorArray=[];
			this.initPlotArrays(content);
			require(["jquery", "jqplot"], function ($, $jqplot) {
				
			
			//require(['js/lib/jqplot/jquery.jqplot.min.js', 'js/lib/jqplot/plugins/jqplot.barRenderer.min.js', 'js/lib/jqplot/plugins/jqplot.categoryAxisRenderer.min.js', 'js/lib/jqplot/plugins/jqplot.enhancedLegendRenderer.min.js', 'js/lib/jqplot/plugins/jqplot.pointLabels.min.js'], function(jqplot) {
				console.log("Success..Inside Require JS");
    		console.log("Plot...", $.jqplot);
				
			$("#chart").empty();
            $.jqplot.config.enablePlugins = true;
 			var __plot1, __plot2, __p1, __p2,bar1=[], bar2=[];

            function makePlotArray (s, name){
				var arr=[], i, s;
                for (i in s) {
                    if(name == "bar1"){
                        arr = s[i].split(',')
                        bar1.push([parseFloat(arr[0]),arr[1]]);
                    }
                    if(name == "bar2"){
                        arr = s[i].split(',')
                        bar2.push([parseFloat(arr[0]),arr[1]]);
                    }
                }
				return bar1;
            }
				
				
			if (_type == 'bar1'){
				//check if the cookies exist and if not create them
				//also - check to see if this is a promoquiz result page by chekcing for ansid in the querystring (set in site.js as a global var)
				var popArray = [];//, p1=[];
				if (ansid){
					console.log('create popArray', ansid);
					for (var i=0;i<content.answers.length;i++){
						//p1.push([content.answers[i].score, content.answers[i].answerstxt]);
						if(ansid == content.answers[i].answersid){
							popArray.push(content.answers[i].answerstxt.replace(/([^,]+,[^,]+),/g,'$1;'));
							console.log('create popArray', ansid, content.answers[i].answerstxt.replace(/([^,]+,[^,]+),/g,'$1;'));
						}
				
					}
					Cookies.set('__popArray', popArray);
					//Cookies.set('__plot1', p1);
				}
				__plot1 = Cookies.get('__plot1'); 
				popArray = Cookies.get('__popArray').split(',');
				//decode cookie
				__p1=__plot1.replace(/([^,]+,[^,]+),/g,'$1;');
				var __bar1 = new String(__p1);
				makePlotArray(__bar1.split(';'), "bar1");
				for (var i = 0; i < bar1.length; i++){
					if($.inArray(bar1[i][1], popArray) != -1) {
						colorArray[i] = '#f96802';
					}else{
						colorArray[i] = '#dcd2ba';
					}
				}
				
				
			}else{
				//read q1 cookie
				__plot1 = Cookies.get('__plot1'); 
				__plot2 = Cookies.get('__plot2');
				console.log(__plot1);
				console.log(__plot2);	
				//decode cookie
				__p1=__plot1.replace(/([^,]+,[^,]+),/g,'$1;');
				__p2=__plot2.replace(/([^,]+,[^,]+),/g,'$1;');
				var __bar1 = new String(__p1);
            	var __bar2 = new String(__p2);
				makePlotArray(__bar1.split(';'), "bar1");
            	makePlotArray(__bar2.split(';'), "bar2");
			}


            

            //The length of the plots determines the ticks and number of ticks
            var numTicks = bar1.length;
            var tickArray = new Array();
            for (var i=0; i<numTicks+1; i++)
            {
                tickArray.push(i);                      
            }
			if(_type == 'bar2'){
				
            	colorArray = ['#f96802', '#dcd2ba'];
				//console.log(__bar1, __bar2);
            	var chart = $.jqplot('chart', [bar1, bar2],
                {
                    animate: true,
                    captureRightClick: true,
                    seriesColors:colorArray,
                     grid: {
                        drawGridLines: true,        // wether to draw lines across the grid or not.
                        gridLineColor: '#cccccc',    // *Color of the grid lines.
                        background: '#ffffff',      // CSS color spec for background color of grid.
                        borderColor: '#999999',     // CSS color spec for border around grid.
                        borderWidth: 0,           // pixel width of border around grid.
                        shadow: false,               // draw a shadow for grid.
                        shadowAngle: 0,            // angle of the shadow.  Clockwise from x axis.
                        shadowOffset: 0,          // offset from the line of the shadow.
                        shadowWidth: 0,             // width of the stroke for the shadow.
                        shadowDepth: 0,             // Number of strokes to make when drawing shadow.
                                                    // Each stroke offset by shadowOffset from the last.
                        shadowAlpha: 0,           // Opacity of the shadow
                        renderer: $.jqplot.CanvasGridRenderer,  // renderer to use to draw the grid.
                        rendererOptions: {}         // options to pass to the renderer.  Note, the default
                                                    // CanvasGridRenderer takes no additional options.
                    },
                    seriesDefaults:{
                        renderer:$.jqplot.BarRenderer,
                        shadowAngle: 0,
                        shadowAlpha: 0,
                        rendererOptions: {
                            barDirection: 'horizontal',
                            highlightMouseDown: true   ,
                            barWidth: 18,
                            barPadding: 0,
                            barMargin: 0,
                            shadowAngle: 0,
                            shadowAlpha: 0
                        },
                        pointLabels: {show: false, formatString: '%d'},
                    },

                    axes: {
                        yaxis: {
                            renderer: $.jqplot.CategoryAxisRenderer
                        },
                        
                        xaxis: {
                            renderer: $.jqplot.LinearAxisRenderer,
                            tickInterval: 1,
                            ticks: tickArray,//[1,2,3,4,5],
                            drawMajorGridlines: true,
                            drawMinorGridlines: false,
                            drawMajorTickMarks: false,
                            rendererOptions: {
                                tickInset: 0,
                                minorTicks: 0
                            }
                        }
                    }
                });
			}else if (_type=='bar1'){
				//var colorArray = ['#f96802'];
				makePlotArray(__bar1.split(';'), "bar1");
			  	var plot1 = $.jqplot('chart', 
					[bar1],//, plot1],
					{
						animate: true,
						seriesColors:colorArray,
						series:[
							//{label:'Your picks'},
						   // {label:'What your peers think'}
							{pointLabels:{
								show: true,
								formatString: '%s%' 
							  }}
							],
						 seriesDefaults:{
							renderer:$.jqplot.BarRenderer,
							shadowAngle: 0,
							shadowAlpha: 0,
							rendererOptions: {
								varyBarColor: true,
								barDirection: 'horizontal',
								highlightMouseDown: true   ,
								barWidth: 18,
								barPadding: -5,
								barMargin: 0,
								shadowAngle: 0,
								shadowAlpha: 0
							},
						},
						grid: {
							drawGridLines: false,        // wether to draw lines across the grid or not.
							gridLineColor: '#fff',    // *Color of the grid lines.
							background: '#ffffff',      // CSS color spec for background color of grid.
							borderColor: '#fff',     // CSS color spec for border around grid.
							borderWidth: 0,           // pixel width of border around grid.
							shadow: false,               // draw a shadow for grid.
							shadowAngle: 0,            // angle of the shadow.  Clockwise from x axis.
							shadowOffset: 0,          // offset from the line of the shadow.
							shadowWidth: 0,             // width of the stroke for the shadow.
							shadowDepth: 0,             // Number of strokes to make when drawing shadow.
														// Each stroke offset by shadowOffset from the last.
							shadowAlpha: 0,           // Opacity of the shadow
							renderer: $.jqplot.CanvasGridRenderer,  // renderer to use to draw the grid.
							rendererOptions: {}         // options to pass to the renderer.  Note, the default
														// CanvasGridRenderer takes no additional options.
						},
						axes: {
							xaxis: {
							   // renderer: $.jqplot.AxisLabelRenderer,
								show: false,    // wether or not to renderer the axis.  Determined automatically.
								min: 0, 
								max: 120,
								rendererOptions: {
								   drawBaseline: false
								},
								tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
								 pad: 1.05,
								tickOptions: { formatString: '%d%', showMark: false, showLabel: false },
								showTickMarks: false,
								showLabel: false,
								textColor: "#fff"
								
							},
							yaxis: {    
								renderer: $.jqplot.CategoryAxisRenderer,
								rendererOptions: {
								   drawBaseline: false
								}
							}  
						}
					});//end render bar1
				}//end if bar1/bar2
        	});	//end require jqplot
		};//end render chart

		this.renderBubbles = function(content){
			require(["jquery", "jqplot"], function ($, $jqplot) {
			//require(['js/lib/jqplot/jquery.jqplot.min.js', 'js/lib/jqplot/plugins/jqplot.bubbleRenderer.min.js'], 	
					//function(jqplot) {
			
			console.log('in render',content);
			//$("#chart").empty();
            $.jqplot.config.enablePlugins = true;
			 var bubblePlot = [];
			 var arr = [];
			//define alternate plots for different answer counts
			var bubblePlot5 = [[45,25,50,""],[25,60,50,""],[55,80,50,""],[90,70,50,""],[80,30,50,""],[50,50,50,""]];
			var bubblePlot6 = [[45,25,50,""],[25,60,50,""],[55,80,50,""],[90,70,50,""],[80,30,50,""]];
			var bubblePlot7 = [[45,25,50,""],[25,60,50,""],[55,80,50,""],[90,70,50,""],[80,30,50,""]];

			var plot1 = [], tmp = [];
			for (var i=0; i<content.answers.length; ++i){
				console.log([content.answers[i].score, content.answers[i].answerstxt]);
				plot1.push([content.answers[i].score, content.answers[i].answerstxt]);
				tmp.push(content.answers[i].answerstxt);
			}
			Cookies.set("__plot1", plot1); 
			Cookies.set("__popArray", tmp); 
			bubblePlot = [[45,25,50,content.answers[0].answerstxt],[25,60,50,content.answers[1].answerstxt],[55,80,50,content.answers[2].answerstxt],[90,70,50,content.answers[3].answerstxt],[80,30,50,content.answers[4].answerstxt]];

			var colorArray=[];
			colorArray = ['#ffffff', '#def5f9', '#8bcffa', '#eafcff','#8bcffa'];
			var plot = $.jqplot('chart',[bubblePlot],{
				animate: true,
				seriesColors:colorArray,
				 grid: {
					drawGridLines: false,        // wether to draw lines across the grid or not.
					//gridLineColor: '#d3eaee',    // *Color of the grid lines.
					//background: '#d3eaee',      // CSS color spec for background color of grid.
					//borderColor: '#d3eaee',     // CSS color spec for border around grid.
					borderWidth: 0,           // pixel width of border around grid.
					shadow: false,               // draw a shadow for grid.
					shadowAngle: 0,            // angle of the shadow.  Clockwise from x axis.
					shadowOffset: 0,          // offset from the line of the shadow.
					shadowWidth: 0,             // width of the stroke for the shadow.
					shadowDepth: 0,             // Number of strokes to make when drawing shadow.
												// Each stroke offset by shadowOffset from the last.
					shadowAlpha: 0,           // Opacity of the shadow
					//renderer: $.jqplot.CanvasGridRenderer,  // renderer to use to draw the grid.
					rendererOptions: {}         // options to pass to the renderer.  Note, the default
												// CanvasGridRenderer takes no additional options.
				},
				seriesDefaults:{
					renderer: $.jqplot.BubbleRenderer,
					rendererOptions: {
						bubbleAlpha: 0.6,
						highlightAlpha: 0.8,
						highlightMouseDown: false, //diesable jqplotDataHighlight
						highlightMouseOver: false, //diesable jqplotDataHighlight
						autoscaleBubbles: true,
					},
					shadow: true,
					shadowAlpha: 0.05
				},
				
				 axesDefaults: {
					show: false,  
					renderer: $.jqplot.LinearAxisRenderer,
					showTickMarks:false,
					tickInterval: 10,
					ticks: [10,20,30,40,50,60,70,80,100],
					showTicks: false, 
					drawMajorGridlines: false,
					drawMinorGridlines: false,
					drawMajorTickMarks: false,
					rendererOptions: {
						tickInset: 0,
						minorTicks: 0
					}
							  
			   }
			});//end create bubble chart
			var canvasArr, labelArr;
    		var selected;
			var  popArray = [];
			$('#chart').bind('jqplotDataClick',
				function (ev, seriesIndex, pointIndex, data) {
					canvasArr = $.makeArray( $(this).find(".jqplot-series-canvas .jqplot-bubble-point") );
					labelArr = $.makeArray( $(this).find(".jqplot-series-canvas .jqplot-bubble-label") );
					//search for click location and hide from canvas container
					for(var t in labelArr){
						if($.inArray($(labelArr[t]).html().toString(), data) != -1) {
							//var options = {};
							selected =  data[3];
							//$(canvasArr[t]).effect( "puff", options, 300);
							$(canvasArr[t]).hide();
							$(labelArr[t]).hide();
							popArray.push(selected);	
						}
					}
					Cookies.set('__popArray', popArray);

				});//.canvasBubble().bind('refresh');

			});//end require jqplot
		};//end render bubbles

        this.render = function (content) {
            this.$el.html(chartTpl(content));
            this.$el.data('template', '').data('template', 'charttpl');
							console.log('content',content);
			if(content.type == 'bubbles'){
				this.renderBubbles(content);
			}else{
				this.renderChart(content);
			}
            return this;
        };
		

        this.initialize();

    };

});
