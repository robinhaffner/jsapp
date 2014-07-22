define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        instructionsHtml        = require('text!tpl/instructions.html'),

        instructionsTpl = Handlebars.compile(instructionsHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(instructionsTpl(content));
            return this;
        };

        this.initialize();

    };

});
