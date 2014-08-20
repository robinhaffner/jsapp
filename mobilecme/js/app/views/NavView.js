define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        QuestionView    = require("views/QuestionView"),
        questionView    = new QuestionView(),
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
            siteAdapter.getData("manifest",0).done(function(manifest) {
                console.log("manifest",manifest);
                
                var pagemax = manifest.pages.length;
                $(".page-ctn .num").empty().append(pagemax);

                for (var key in manifest.pages){
                    
                    if (manifest.pages[key] == _h) {
                        $(".page-ctn .pgenum").empty().append(parseInt(key)+1);
                        $(".next-control").show().attr('href', "#"+manifest.pages[parseInt(key)+1]);
                    }
                }

                if (parseInt($(".page-ctn .pgenum").text()) == pagemax) {
                    $(".next-control").attr('href', "#finalstep");
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

