define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        chartHtml       = require('text!tpl/chart.html'),

        chartTpl = Handlebars.compile(chartHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(chartTpl(content));
            return this;
        };

        this.initialize();

    };

});
