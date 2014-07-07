define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        instructionsHtml        = require('text!tpl/instructions.html'),

        instructionsTpl = Handlebars.compile(instructionsHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function () {
            this.$el.html(instructionsTpl());
            return this;
        };

        this.initialize();

    };

});

