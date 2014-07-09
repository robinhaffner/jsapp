define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        pageAdapter     = require('adapters/page'),
        facultyHtml     = require('text!tpl/faculty.html'),

        facultyTpl = Handlebars.compile(facultyHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(facultyTpl(content));
            return this;
        };

        this.initialize();

    };

});
