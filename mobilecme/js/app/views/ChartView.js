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
		
		this.renderChart = function(content){
			console.log(content);
			require(['js/lib/Chart.js'], function(Chart) {
				var yourSelections =[5,4,3,2,1],
				peerSelections = [],
				_labels = [],
				_type = content.type;
	
				for (var i = 0; i <content.answers.length; ++i){
					console.log(content.answers[i]);
					peerSelections[i] = content.answers[i].score;
					_labels[i] = jQuery(content.answers[i].answerstxt).text();
				}
			
				// Colour variables
				var selectedColor = "#f96802",defaultColor = "#dcd2ba",red = "#bf616a",blue = "#5B90BF",orange = "#d08770",yellow = "#ebcb8b",green = "#a3be8c",teal = "#96b5b4",pale_blue = "#8fa1b3",purple = "#b48ead",brown = "#ab7967";
				 
				var data = [],
					barsCount = 50,
					labels = new Array(barsCount),
					updateDelayMax = 500,
					$id = function(id){
						return document.getElementById(id);
					},
					random = function(max){ return Math.round(Math.random()*100)},
					helpers = Chart.helpers;

				Chart.defaults.global.responsive = true;
				
				if (_type == "bubbles"){
		
					var contexts = {
						bubble0 : $id('bubble_1').getContext('2d'),
						bubble1 : $id('bubble_2').getContext('2d'),
						bubble2 : $id('bubble_3').getContext('2d'),
						bubble3 : $id('bubble_4').getContext('2d'),
						bubble4 : $id('bubble_5').getContext('2d')
				   };

					var config = {
						animation: true,
						animateScale: true,
						responsive : true, percentageInnerCutout: 0, animateRotate : false, segmentStrokeWidth : 0, segmentShowStroke : false,
						onAnimationComplete: function(){
							this.options.animation = true;
						},
						legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"


					};
					var myCircle = function(radius, steps, centerX, centerY){
							var degrees = 360/steps;
							var x,y;
							var results = [];
							for (var i=0; i<steps; ++i){
								var angle = i*degrees;
								//console.log(degrees, angle);
								x = Math.round((centerX + radius * Math.cos(2*Math.PI * i / steps)));
    							y =  Math.round((centerY + radius * Math.sin(2*Math.PI * i / steps)));
								results.push([x,y]);
								//results.push([y,x]);
								console.log(x,y);
								//console.log(y,x);
					   }
						
						return results;

					}
					//var dw = $('body').width,dh = $('body').height,x = dw/2,y = dh/2;
					var posArray = [];
					posArray = myCircle(130, 5, 120,280);

					for (var i=1; i<= 5; ++i){
						var positionDiv = document.getElementById("positionBubble_"+i);
						console.log(positionDiv);
						positionDiv.style.left=Math.round(posArray[i-1][0])+"px";
						positionDiv.style.top=Math.round(posArray[i-1][1])+"px";
						positionDiv.style.width = 130+"px";
						positionDiv.style.height = 130+"px";
						positionDiv.style.position = "absolute";
						//positionDiv.innerHTML = _labels[i-1];
						
					};
					

					var index = 0;
					helpers.each(contexts, function(bubble){
					console.log(bubble.canvas.attributes);
						
						var data = {
							segments : [
								{
									value : index+1,
									color : pale_blue,
									highlight : pale_blue,
									label :_labels[index]
								}
							]
						}
						//bubble.canvas.left = 100; //window.innerHeight / 2;
						//bubble.canvas.top = 100; 
						
						var _chart = new Chart(bubble).Doughnut(data.segments, config);
						//add the text label for the bubble. It should come from the view div that was loaded from the json when the template was loaded
						
						//console.log(_chart);
						helpers.addEvent(bubble.canvas, 'click', function(evt){
							 console.log(evt, this.parentElement);
							this.style.display = 'none';
							this.parentElement.innerHTML = '';
							//1. record the selection - these are used to display the results
							//2. animate and destroy the object
						});
						index+=1;
					});
					
		
					
				} //end create bubbles
				else if (_type == 'bar'){
					var canvas = $id('interactive-bar');
					var ctx =  $id('interactive-bar').getContext('2d');
		
					var microBar = new Chart(ctx).Bar({
						labels: _labels,
						datasets: [{
							label: "Your Selections",
							fillColor : selectedColor,
							strokeColor : "rgba(0,0,0,0)",
							highlightFill: selectedColor,
							data: yourSelections//[random(), random(), random(), random(), random()]
						},
								  {
							label: "Peer Selections",
							fillColor : defaultColor,
							strokeColor : "rgba(0,0,0,0)",
							highlightFill: defaultColor,
							data:peerSelections//[random(), random(), random(), random(), random()]
						}]
					}, {
						animation: true,
						animateRotate : true,
						showScale: true,
						barShowStroke: true,
						tooltipXPadding: 10,
						tooltipYPadding: 6,
						tooltipFontSize: 18,
						tooltipFontStyle: 'bold',
						// Boolean - If we want to override with a hard coded scale
						scaleOverride: true,
		
						// ** Required if scaleOverride is true **
						// Number - The number of steps in a hard coded scale
						scaleSteps: 1,
						// Number - The value jump in the hard coded scale
						scaleStepWidth: 5,
						// Number - The scale starting value
						scaleStartValue: 0,
						//String - A legend template
						legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
		
					});
		
				helpers.addEvent(canvas, 'mousemove', function(evt){
		
				});
		
				helpers.addEvent(canvas, 'click', function(evt){
		
				});
		
				}//end create bar chart
		
				$.fn.rotate = function(degrees) {
					$(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
								 '-moz-transform' : 'rotate('+ degrees +'deg)',
								 '-ms-transform' : 'rotate('+ degrees +'deg)',
								 'transform' : 'rotate('+ degrees +'deg)'});
				};
				var rotater = document.getElementById("interactive-bar");
				$(rotater).rotate(90);
				
				 var Chartjs = Chart.noConflict();
			});
		}
		

        this.render = function (content) {
            this.$el.html(chartTpl(content));
            this.$el.data('template', '').data('template', 'charttpl');
			this.renderChart(content);
            return this;
        };
		


        this.initialize();

    };

});
