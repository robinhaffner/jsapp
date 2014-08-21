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
			console.log("getnav");
            siteAdapter.getData('topnav',0).done(function (_nav) {
                $("#nav-container").html(navTpl(_nav));
                return;
            });
        };

        this.setNextPage = function (_h) {
			var next_page = "";
			var prev_page = "";
            siteAdapter.getData("manifest",0).done(function(manifest) {
                console.log("manifest",manifest);
                
                var pagemax = manifest.pages.length;
                $(".page-ctn .num").empty().append(pagemax);

                for (var key in manifest.pages){
                    
                    if (manifest.pages[key] == _h) {
						next_page = manifest.pages[parseInt(key)+1];
						prev_page = manifest.pages[parseInt(key)-1];
                        $(".page-ctn .pgenum").empty().append(parseInt(key)+1);
                        $(".next-control").show().attr('href', "#"+next_page);
						$(".prev-control").show().attr('href', "#"+prev_page);
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
			siteAdapter.getData("sitecontent",next_page).done(function(_obj) {
				console.log("next_page",next_page, _obj.audio_url);
							$(".next-control").attr('audio_url', _obj.audio_url);
							$(".next-control").attr('audio_autoplay', _obj.audio_autoplay);
			});
			siteAdapter.getData("sitecontent",prev_page).done(function(_obj) {
				console.log("prev_page",prev_page, _obj.audio_url);
							$(".prev-control").attr('audio_url', _obj.audio_url);
							$(".prev-control").attr('audio_autoplay', _obj.audio_autoplay);
			});
        }

        this.initialize();
    };

});


