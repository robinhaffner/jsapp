require.config({

    baseUrl: 'js/lib',

    paths: {
        root: '../../',
        app: '../../js/app',
        tpl: '../../tpl',
        views:'../../js/app/views',
        data: '../../data',
        server: window.config.path.server,
		jquery: '../../js/lib/vendor/jquery.min',
		'jqplot.core': '../../js/lib/jqplot/jquery.jqplot.min',
        jqplot: '../../js/lib/jquery-jqplot-wrapper',
		'jqplot.barRenderer':   '../../js/lib/jqplot/plugins/jqplot.barRenderer.min',
    	'jqplot.categoryAxisRenderer': '../../js/lib/jqplot/plugins/jqplot.categoryAxisRenderer.min',
    	'jqplot.canvasTextRenderer': '../../js/lib/jqplot/plugins/jqplot.canvasTextRenderer.min',
    	'jqplot.canvasAxisLabelRenderer': '../../js/lib/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min',
    	'jqplot.enhancedLegendRenderer': '../../js/lib/jqplot/plugins/jqplot.enhancedLegendRenderer.min',
    	'jqplot.pointLabels': '../../js/lib/jqplot/plugins/jqplot.pointLabels.min',
    	'jqplot.bubbleRenderer': '../../js/lib/jqplot/plugins/jqplot.bubbleRenderer.min',
        'piwik': window.config.path.piwik+'/piwik'
    },

    map: {
        '*': {
           'adapters/site': 'root/js/adapters/site-memory'
        }
    },
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
		"jqplot.core": {deps: ["jquery"]},
        "jqplot": {deps: ["jqplot.core"]},
		'../../js/lib/jqplot/plugins/jqplot.canvasTextRenderer': ['jqplot'],
		'../../js/lib/jqplot/plugins/jqplot.pointLabels': ['jqplot'],
		'../../js/lib/jqplot/plugins/jqplot.barRenderer': ['jqplot'],
		'../../js/lib/jqplot/plugins/jqplot.categoryAxisRenderer': ['jqplot'],
		'../../js/lib/jqplot/plugins/jqplot.canvasAxisLabelRenderer': ['jqplot'],
		'../../js/lib/jqplot/plugins/jqplot.enhancedLegendRenderer': ['jqplot'],
		'../../js/lib/jqplot/plugins/jqplot.bubbleRenderer': ['jqplot'],
        "tracking": {deps: ["jquery"]},
        "piwik":{deps:[]}
    }

});

require(['app/router'], function (router) {

    'use strict';

    router.start();

});
