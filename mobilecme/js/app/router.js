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
		ChartView        	= require("views/ChartView"),

        detailsURL = /^#(\w+)/,
        mainView = new MainView(),
        navView = new NavView(),
        programIDView = siteAdapter.getSettings("programid"),
        certificateIDView = siteAdapter.getSettings("certificate"),
        specialtyView = siteAdapter.getSettings("specialtyRequired"),
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


            if (specialtyView == "true") {
                if (specialty == true && !hashpath) {
                    siteAdapter.getData("sitecontent",startPageNum).done(function(_content) {
                      var tpl = eval(_content.template+"View");
                      var handler = new tpl();

                      handler.render(_content);
                      navView.setNextPage(startPageNum);
                      $("title").html(_content.title);
                    });

                }
                if (specialty == false) {
                    siteAdapter.getData("sitecontent","main").done(function(_content) {
                      var tpl = eval(_content.template+"View");
                      var handler = new tpl();

                      handler.render(_content);
                      navView.setNextPage("main");
                      $("title").html(_content.title);
                    });
                };
            } else {
                if (specialty == false) {
                    Cookies.set('specialty', "None");
                }
                specialty = getStoredSpecialty;
                console.log("gotopage",gotopage);

                if (match == null) { 
                    match = []; 
                    match[1] = startPageNum; 
                };
                
                siteAdapter.getData("sitecontent",match[1]).done(function(_content) {
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();

                  handler.render(_content);
                  navView.setNextPage(match[1]);
                  $("title").html(_content.title);
                });
            }
            console.log("message",match,specialty,getStoredSpecialty);

            if (match && specialty || getStoredSpecialty != undefined) {

                if (match == null) { match = []; match[1] = startPageNum; }; // setcookie

                siteAdapter.getData("sitecontent",match[1]).done(function(_content){
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();
                  handler.render(_content);

                  navView.setNextPage(match[1]);
                  $("title").html(_content.title);
                }).fail(function() {
                  //document.location = document.location.origin; // 404 page not found
                });
            }

            $(document).scrollTop(0); //force scroll to top at value 0

        },
        nav = function () {
            navView.render()
            navView.getTopNav()
        },
        sidebarCanvas = function () {
            var sidebarView = new SidebarView();
            sidebarView.render();
            sidebarView.getSidebar(sidebarView);
        },
        ftr = function () {
            var footerView = new FooterView();
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