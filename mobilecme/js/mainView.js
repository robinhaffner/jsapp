define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        mainHtml    = require('text!tpl/main.html'),

        mainTpl = Handlebars.compile(mainHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(mainTpl(content));
            return this;
        };

        this.initialize();

    };

});
