define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        navHtml         = require('text!tpl/nav.html'),

        navTpl         = Handlebars.compile(navHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('#nav-container');
        };

        this.render = function () {
            this.$el.html(navTpl());
            return this;
        };

        this.getTopNav = function () {
            siteAdapter.getTopNav().done(function (_nav) {
                $("#nav-container").html(navTpl(_nav));
                return;
            });
        };

        this.setNextPage = function (_h) {
            pageAdapter.getPage().done(function (_page) {
                for (var i = 0; i < _page.length; i++) {
                    //console.log("_page[i]",_page[i],_h);

                    if (_page[i] == _h) {
                        //console.log("i",i,_page.length,_page[i],_page[]);
                    } else { return false} ;
                };
            });
        }

        this.initialize();

    };

});

