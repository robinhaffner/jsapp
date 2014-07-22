require.config({

    baseUrl: 'lib',

    paths: {
        root: '../',
        app: '../js',
        tpl: '../tpl'
        //,data: '../data'
    },

    map: {
        '*': {
           'adapters/site': 'root/adapters/site-memory'
        }
    },
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        }
    }

});

require(['app/router'], function (router) {

    "use strict";

    router.start();

});
