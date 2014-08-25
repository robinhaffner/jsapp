define(function (require) {

    "use strict";

    var $                   = require("jquery"),
        siteAdapter         = require("adapters/site"),
        NavView             = require("views/NavView"),
        SidebarView         = require("views/SidebarView"),
        FooterView          = require("views/FooterView"),
       // AudioView           = require("views/AudioView"),
        MainView            = require("views/MainView"),
        QuestionView        = require("views/QuestionView"),
        VideoView           = require("views/VideoView"),
        ContentView         = require("views/ContentView"),
        FinalstepView       = require("views/FinalstepView"),

        detailsURL = /^#(\w+)/,
        mainView = new MainView(),
        navView = new NavView(),
        //audioView = new AudioView(),
        programIDView = siteAdapter.getProgramID("programid"),
        startPageNum = siteAdapter.getStartPage("start"),

        route = function () {
            var hashpath = window.location.hash,
                view,
                match = hashpath.match(detailsURL),
                getStoredSpecialty = Cookies.get('specialty');
            
            console.log("route",specialty,hashpath,match,programIDView,getStoredSpecialty);
            console.log("startPageNum",startPageNum);

            $('body').data('programid', programIDView);

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
                  //audiomedia(match[1]);
                  $("title").html(_content.title);
                }).fail(function() {
                  document.location = document.location.origin; // 404 page not found
                });
                
            }

            if ($(document).find('.imageGesture').length > 0) {
                var imgEnlargeContainer = $(document).find('.imageGesture').attr('id');
                console.log("images",imgEnlargeContainer);
                var myScroll;
                myScroll = new IScroll('#'+imgEnlargeContainer, {
                    zoom: true,
                    scrollX: true,
                    scrollY: true,
                    mouseWheel: true,
                    wheelAction: 'zoom'
                });
                document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            };  

        },
        nav = function () {
            navView.render()
            navView.getTopNav()
        },
       /* audiomedia = function (_c) {
            audioView.render(_c, $('.audio-container'))
        },*/
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
