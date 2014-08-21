define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        questionHtml    = require('text!tpl/question.html'),

        questionTpl = Handlebars.compile(questionHtml);

        Handlebars.registerHelper('if_eq', function(a, b, opts) {
            console.log("a, b, opts",a, b, opts);
            if(a == b) // Or === depending on your needs
                return opts.fn(this);
            else
                return opts.inverse(this);
        });
    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(questionTpl(content));
            this.$el.data('template', '').data('template', 'questionstpl');
            return this;
        };

        this.initialize();

    };

});
