define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        questionHtml    = require('text!tpl/question.html'),

        questionTpl = Handlebars.compile(questionHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(questionTpl(content));
            return this;
        };

        this.getDataAnswer = function (arg) {
            console.log("getDataAnswer",$(this),arg);
        }

        this.initialize();


        $(document).on('click','.selection-list li',function(event){
            event.preventDefault();
            var selectionlist = $(this).parent();
            var listtype = $( selectionlist ).data( "listview-type" );

            if ($( selectionlist ).hasClass('single')) {
            console.log("selectionlist,listtype",selectionlist,listtype);

                $( selectionlist ).find('li').removeClass('selected');
                $(this).addClass('selected');
                var listtext = $(this).text();

                Cookies(listtype, undefined);
                Cookies.set(listtype, listtext);

            } else if ($( selectionlist ).hasClass('single-result')) {
                $( selectionlist ).find('li').removeClass('selectedresult');

                $(this).addClass('selectedresult');
                var listtext = $(this).find('p').text();

                $($( selectionlist ).find('li')).each( function(i, ele) {
                    var getprecent = parseInt($(this).find('.choice-percent').text());
                    if (getprecent >= 100) {
                        $(this).find('.color-fill').addClass('percent-fill')
                    };
                    $(this).find('.color-fill')
                        .stop().addClass('color-animate')
                        .css('height', ($(this).outerHeight() - 2)+'px')
                        .animate({width: getprecent+'%'}, 300);
                    $(this).find('.choice-percent').show();

                    Cookies(listtype, undefined);
                    Cookies.set(listtype, listtext);
                });
            } else if ($( selectionlist ).hasClass('multiple-choice')) {
                $(this).addClass('selected');

                if ($(this).hasClass('selected')) {
                    var listtext = $(this).text();
                    multiselectArr.push(listtext);
                };

                Cookies(listtype, undefined);
                Cookies.set(listtype, multiselectArr);
                //console.log("Cookies.get",Cookies.get(listtype));
            }
            else {
                $(this).addClass('selected');
            }

            if (listtype == "specialty") {
                selectSpecialty($(this));
            };
        });

    };

});
