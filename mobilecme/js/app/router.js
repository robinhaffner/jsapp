define(function (require) {

    "use strict";

    var $                   = require("jquery"),
        siteAdapter         = require("adapters/site"),
        NavView             = require("views/NavView"),
        SidebarView         = require("views/SidebarView"),
        FooterView          = require("views/FooterView"),
        MainView            = require("views/MainView"),
        QuestionView        = require("views/QuestionView"),
        VideoView           = require("views/VideoView"),
        ContentView         = require("views/ContentView"),
        FinalstepView       = require("views/FinalstepView"),

        detailsURL = /^#(\w+)/,
        mainView = new MainView(),
        navView = new NavView(),
        programIDView = siteAdapter.getProgramID("programid"),
        certificateIDView = siteAdapter.getCertificateID("certificate"),
        startPageNum = siteAdapter.getStartPage("start"),

        route = function () {
            var hashpath = window.location.hash,
                view,
                match = hashpath.match(detailsURL),
                getStoredSpecialty = Cookies.get('specialty');
            
            console.log("route",specialty,hashpath,match,programIDView,getStoredSpecialty);
            console.log("startPageNum",startPageNum);

            $('body').data('programid', programIDView);
            $('body').data('certificate', certificateIDView);

            if ( (!hashpath && specialty) || (!hashpath && !specialty) || getStoredSpecialty == '') {
                siteAdapter.getData("sitecontent","main").done(function(_content) {
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();

                  handler.render(_content);
                  navView.setNextPage("main");
                  $("title").html(_content.title);
                });
                
            }

            if (match && specialty || getStoredSpecialty != undefined) {

                if (match == null) { match= []; match[1] = startPageNum; }; // setcookie

                siteAdapter.getData("sitecontent",match[1]).done(function(_content){
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();
                  handler.render(_content);

                  navView.setNextPage(match[1]);
                  $("title").html(_content.title);
                }).fail(function() {
                  document.location = document.location.origin; // 404 page not found
                });
                
            }

            $(document).scrollTop(0); //force scroll to top at value 0

        },
        nav = function () {
            navView.render()
            navView.getTopNav()
        },
        sidebarCanvas = function () {
            var sidebarView = new SidebarView()
            sidebarView.render()
            sidebarView.getSidebar()
        },
        ftr = function () {
            var footerView = new FooterView()
            footerView.render();
            footerView.getFooter();
        },
        start = function () {
            $(window).on('hashchange', route);
            getPageParam();
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
