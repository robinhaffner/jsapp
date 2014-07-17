require.config({

    baseUrl: 'lib',

    paths: {
        root: '../',
        app: '../js',
        tpl: '../tpl'
    },

    map: {
        '*': {
            'adapters/site': 'root/adapters/site-memory',
            'adapters/page': 'root/adapters/page-memory'
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
