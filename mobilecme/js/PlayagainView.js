define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        playagainHtml   = require('text!tpl/playagain.html'),

        playagainTpl = Handlebars.compile(playagainHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(playagainTpl(content));
            $(".next-control").hide();
            return this;
        };

        this.initialize();

    };

});
