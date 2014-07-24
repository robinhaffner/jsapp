define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        mainHtml        = require('text!tpl/main.html'),

        mainTpl         = Handlebars.compile(mainHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            startPageNum = siteAdapter.getStartPage("start")
            this.$el.html(mainTpl(content));
            $('#hdr .next-control').remove()
            return this;
        };

        this.initialize();

    };

});
