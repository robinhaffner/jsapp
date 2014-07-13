define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        navHtml         = require('text!tpl/nav.html'),
        errHtml         = require('text!tpl/404.html'),

        navTpl          = Handlebars.compile(navHtml);

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
                var pagemax = _page.length;
                $(".page-ctn .num").empty().append(pagemax);
                for (var i = 0; i < pagemax; i++) {

                    if (_page[i] == _h) {
                        $(".page-ctn .pgenum").empty().append(i+1);
                        $(".next-control").show();
                        $(".next-control").attr('href', "#"+_page[i+1]);
                    } //else { return false} ;
                };
                    if (parseInt($(".page-ctn .pgenum").text()) == pagemax) {
                        $(".next-control").attr('href', "#playagain");
                    };
                        $(".progress-bar").attr({
                            "aria-valuemin": 0,
                            "aria-valuenow": parseInt($(".page-ctn .pgenum").text()),
                            "aria-valuemax": pagemax
                        })
                        .css("width", parseInt($(".page-ctn .pgenum").text()) / pagemax * 100 + "%");
            });
        }

        this.initialize();

    };

});

