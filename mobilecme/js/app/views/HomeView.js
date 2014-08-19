define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        mainHtml    = require('text!tpl/main.html'),

        mainTpl = Handlebars.compile(mainHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(mainTpl(content));
            this.$el.data('template', '').data('template', 'maintpl');
            return this;
        };

        this.initialize();

    };

});
