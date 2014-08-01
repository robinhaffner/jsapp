define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        sidebarHtml     = require('text!tpl/sidebar.html'),

        sidebarTpl      = Handlebars.compile(sidebarHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.sidebar-offcanvas');
        };

        this.render = function () {
            this.$el.html(sidebarTpl());
            return this;
        };

        this.getSidebar = function () {
            siteAdapter.getSidebarData('sidebar',0).done(function (_sidebar) {
                $('.sidebar-offcanvas').html(sidebarTpl(_sidebar));
                return;
            });

            if ( !highlightchapter){
                Cookies.set('first_time_visit_program', 0, { expires: 600 });
                $('.list-group-item:eq(0)').addClass('selected');
            } else {
                $('.list-group-item:eq('+paramObj.chapter+')').addClass('selected');
            }

        };

        this.initialize();

    };

});

