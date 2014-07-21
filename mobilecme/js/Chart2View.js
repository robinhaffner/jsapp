define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        chart2Html       = require('text!tpl/chart2.html'),

        chart2Tpl = Handlebars.compile(chart2Html);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(chart2Tpl(content));
            return this;
        };

        this.initialize();

    };

});
