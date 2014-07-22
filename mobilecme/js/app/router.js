define(function (require) {

    "use strict";

    var $                   = require("jquery"),
        siteAdapter         = require("adapters/site"),
        NavView             = require("views/NavView"),
        SidebarView         = require("views/SidebarView"),
        FooterView          = require("views/FooterView"),
        MainView            = require("views/MainView"),
        InstructionsView    = require("views/InstructionsView"),
        FacultyView         = require("views/FacultyView"),
        OverviewView        = require("views/OverviewView"),
        QuestionView        = require("views/QuestionView"),
        ChartView           = require("views/ChartView"),
        TableView           = require("views/TableView"),
        Chart2View          = require("views/Chart2View"),
        VideoView           = require("views/VideoView"),
        Question2View       = require("views/Question2View"),
        PlayagainView       = require("views/PlayagainView"),

        detailsURL = /^#(\w+)/,
        mainView = new MainView(),
        navView = new NavView(),

        route = function () {
            var hashpath = window.location.hash,
                view,
                match;
        
            if (!hashpath) {
              
                siteAdapter.getData("sitecontent","main").done(function(_content) {
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();

                  handler.render(_content);
                  navView.setNextPage("main");
                });
                
                return;
            }
            
            match = hashpath.match(detailsURL);
            if (match) {
                
                console.log("match",match,match[1]);

                siteAdapter.getData("sitecontent",match[1]).done(function(_content){
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();
                  handler.render(_content);

                  navView.setNextPage(match[1]);
                  $("title").html(_content.title);
                }).fail(function() {
                  
                  // 404 goes here
                  
                });
                
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
