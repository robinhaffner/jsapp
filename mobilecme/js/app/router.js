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
        ChartView        	  = require("views/ChartView"),
        tracker             = require("api/tracking"),

        detailsURL = /^#(\w+)/,
        mainView = new MainView(),
        navView = new NavView(),
        presentationIDView = siteAdapter.getSettings("presentationid"),
        certificateIDView = siteAdapter.getSettings("certificate"),
        specialtyView = siteAdapter.getSettings("specialtyRequired"),
        startPageNum = siteAdapter.getStartPage("start"),

        route = function () {
            var hashpath = window.location.hash,
                view,
                match = hashpath.match(detailsURL),
                getStoredSpecialty = Cookies.get('specialty');

            if (match != null) { 
            	gotopage = match[1];
            }else{
            	gotopage = startPageNum;
            }
			
            
            console.log("route",specialty,hashpath,match,presentationIDView,getStoredSpecialty);
            console.log("startPageNum",startPageNum);

            $('body').data('presentationid', presentationIDView);
            $('body').data('certificate', certificateIDView);
            
            track('view/'+gotopage,{
              ProgramID:window.urlParams['collection'],
              PromoCode:0,
              CampaignID:0,
              PresentationID:presentationIDView
            });

            if (specialtyView == "true") {
                if (specialty == true ) {
                    siteAdapter.getData("sitecontent",gotopage).done(function(_content) {
                      var tpl = eval(_content.template+"View");
                      var handler = new tpl();

                      handler.render(_content);
                      navView.setNextPage(gotopage);
                      $("title").html(_content.title);
                    });

                } else if (specialty == false) {
                    siteAdapter.getData("sitecontent","main").done(function(_content) {
                      var tpl = eval(_content.template+"View");
                      var handler = new tpl();

                      handler.render(_content);
                      navView.setNextPage("main");
                      $("title").html(_content.title);
                    });
                } else { return; };
            } else {
                if (specialty == false) {
                    Cookies.set('specialty', "None");
                }
                specialty = getStoredSpecialty;

                siteAdapter.getData("sitecontent",gotopage).done(function(_content) {

                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();

                  handler.render(_content);
                  navView.setNextPage(gotopage);
                  $("title").html(_content.title);
                });
            }

            if (match && specialty || getStoredSpecialty != undefined) {

                siteAdapter.getData("sitecontent",gotopage).done(function(_content){
                  var tpl = eval(_content.template+"View");
                  var handler = new tpl();
                  handler.render(_content);

                  navView.setNextPage(gotopage);
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
        initTrack = function () {
          
          $.ajax(window.config.path.api+'/js/pquiz/initialize',{
            success:function(data) {
              if(data.status) {
                window.urlParams['qsession'] = data.qsession;
              }
            },
            dataType:'json'
          });
    
        },
        start = function () {
            $(window).on('hashchange', route);
            initTrack();
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
