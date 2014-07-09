define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        overviewHtml    = require('text!tpl/overview.html'),

        overviewTpl = Handlebars.compile(overviewHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(overviewTpl(content));
            return this;
        };

        this.initialize();

    };

});
