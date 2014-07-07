define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        homeHtml        = require('text!tpl/home.html'),

        homeTpl         = Handlebars.compile(homeHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function () {
            this.$el.html(homeTpl());
            return this;
        };

        this.initialize();

    };

});

