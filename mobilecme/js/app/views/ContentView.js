define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        contentHtml     = require('text!tpl/content.html'),

        contentTpl = Handlebars.compile(contentHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(contentTpl(content));
            return this;
        };

        this.initialize();

    };

});
