define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        videoHtml       = require('text!tpl/video.html'),

        videoTpl = Handlebars.compile(videoHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(videoTpl(content));
            Cookies.set("cmeaudio","pause");
            return this;
        };

        this.initialize();

    };

});
