define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        questionHtml    = require('text!tpl/question.html'),

        questionTpl = Handlebars.compile(questionHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(questionTpl(content)).addClass('questionstpl');
            return this;
        };

        this.getDataAnswer = function (arg) {
            console.log("getDataAnswer",arg,arg.originalEvent);
            
        }

        this.initialize();

    };

});
