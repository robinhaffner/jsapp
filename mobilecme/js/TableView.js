define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        tableHtml       = require('text!tpl/table.html'),

        tableTpl = Handlebars.compile(tableHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(tableTpl(content));
            return this;
        };

        this.initialize();

    };

});
