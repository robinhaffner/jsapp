define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        navHtml         = require('text!tpl/nav.html'),
        errHtml         = require('text!tpl/404.html'),

        navTpl          = Handlebars.compile(navHtml),
        siteData        = siteAdapter.getData("sitecontent");

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
            var pagemax = siteData.length;
            $(".page-ctn .num").empty().append(pagemax);
            for (var i = 0; i < pagemax; i++) {
                if (siteData[i].id == _h) {
                    $(".page-ctn .pgenum").empty().append(i+1);
                    $(".next-control").show().attr('href', "#"+siteData[i+1].id);
                    $(".next-control").removeClass('disabled');
                }
            };
            if (parseInt($(".page-ctn .pgenum").text()) == (pagemax - 1)) {
                $(".next-control").attr('href', "#playagain");
            }
            $(".progress-bar").attr({
                "aria-valuemin": 0,
                "aria-valuenow": parseInt($(".page-ctn .pgenum").text()),
                "aria-valuemax": pagemax
            })
            .css("width", parseInt($(".page-ctn .pgenum").text()) / pagemax * 100 + "%");
        }

        this.initialize();

    };

});

