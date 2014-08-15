require.config({

    baseUrl: 'js/lib',

    paths: {
        root: '../../',
        app: '../../js/app',
        tpl: '../../tpl',
        views:'../../js/app/views',
        data: '../../data',
        server: window.config.path.server
    },

    map: {
        '*': {
           'adapters/site': 'root/js/adapters/site-memory'
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
