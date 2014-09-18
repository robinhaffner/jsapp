// wraps jquery jqplot plugin in define statement
define([
    'jquery',
	'jqplot.barRenderer',
    'jqplot.categoryAxisRenderer',
    'jqplot.canvasTextRenderer',
    'jqplot.canvasAxisLabelRenderer',
    'jqplot.enhancedLegendRenderer',
    'jqplot.pointLabels',
    'jqplot.bubbleRenderer'
], 
function() {
    return $.jqplot;
});
 