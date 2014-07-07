define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        siteAdapter         = require('adapters/site'),
        pageAdapter         = require('adapters/page'),
        NavView             = require("app/NavView"),
        FooterView          = require("app/FooterView"),
        HomeView            = require("app/HomeView"),
        InstructionsView    = require("app/InstructionsView"),

        detailsURL = /^#(\w+)/,
        homeView = new HomeView(),
        navView = new NavView(),

        route = function () {
            var hashpath = window.location.hash,
                view,
                match;
            if (!hashpath) {
                homeView.render();
                navView.setNextPage("index");
                return;
            }
            match = hashpath.match(detailsURL);
            if (match) {
                console.log("match",match,match[1]);
                siteAdapter.getTitle(match[1]).done(function (_site) {
                    $("title").html(_site);
                });
                navView.setNextPage(match[1]);
            }

        },
        nav = function () {
            navView.render()
            navView.getTopNav()
        },
        ftr = function () {
            var footerView = new FooterView().render()
            footerView.getFooter()
        },
        start = function () {
            $(window).on('hashchange', route);
            nav();
            route();
            ftr();
        };

    // The public API
    return {
        start: start
    };

});