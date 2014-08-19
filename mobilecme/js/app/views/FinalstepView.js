define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        finalstepHtml   = require('text!tpl/finalstep.html'),

        finalstepTpl = Handlebars.compile(finalstepHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(finalstepTpl(content));
            this.$el.data('template', '').data('template', 'finalsteptpl');
            $(".next-control").hide();
            return this;
        };

        this.initialize();

    };

});
