define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        siteAdapter         = require('adapters/site'),
        NavView             = require("app/NavView"),
        SidebarView         = require("app/SidebarView"),
        FooterView          = require("app/FooterView"),
        MainView            = require("app/MainView"),
        InstructionsView    = require("app/InstructionsView"),
        FacultyView         = require("app/FacultyView"),
        OverviewView        = require("app/OverviewView"),
        QuestionView        = require("app/QuestionView"),
        ChartView           = require("app/ChartView"),
        TableView           = require("app/TableView"),
        Chart2View          = require("app/Chart2View"),
        VideoView           = require("app/VideoView"),
        Question2View       = require("app/Question2View"),
        PlayagainView       = require("app/PlayagainView"),

        detailsURL = /^#(\w+)/,
        mainView = new MainView(),
        navView = new NavView(),

        route = function () {
            var hashpath = window.location.hash,
                view,
                match;
            if (!hashpath) {
                var data = siteAdapter.getData("sitecontent","main");
                var tpl = eval(data.template+"View");
                var handler = new tpl();
                
                handler.render(data);
                navView.setNextPage("main");
                return;
            }
            match = hashpath.match(detailsURL);
            if (match) {
                console.log("match",match,match[1]);

                var data = siteAdapter.getData("sitecontent",match[1]);
                var tpl = eval(data.template+"View");
                var handler = new tpl();
                handler.render(data);

                navView.setNextPage(match[1]);
                $("title").html(data.title);
            }

        },
        nav = function () {
            navView.render()
            navView.getTopNav()
        },
        sidebarCanvas = function () {
            var sidebarView = new SidebarView()
            sidebarView.render()
            sidebarView.getSidebar()
            getPageParam();
        },
        ftr = function () {
            var footerView = new FooterView()
            footerView.render();
            footerView.getFooter()
        },
        start = function () {
            $(window).on('hashchange', route);
            nav();
            sidebarCanvas();
            route();
            ftr();
        };

    // The public API
    return {
        start: start
    };

});
