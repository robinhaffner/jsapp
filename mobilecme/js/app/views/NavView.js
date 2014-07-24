define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
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
            siteAdapter.getData('topnav',0).done(function (_nav) {
                $("#nav-container").html(navTpl(_nav));
                return;
            });
        };

        this.setNextPage = function (_h) {
            siteAdapter.getData("manifesto",0).done(function(manifesto) {
                var pagemax = manifesto.pages.length;
                $(".page-ctn .num").empty().append(pagemax);

                for (var key in manifesto.pages){
                    
                    if (manifesto.pages[key] == _h) {
                        $(".page-ctn .pgenum").empty().append(parseInt(key)+1);
                        $(".next-control").show().attr('href', "#"+manifesto.pages[parseInt(key)+1]);
                    }
                }

                if (parseInt($(".page-ctn .pgenum").text()) == pagemax) {
                    $(".next-control").attr('href', "#playagain");
                }

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

