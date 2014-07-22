define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        tableHtml       = require('text!tpl/table.html'),

        tableTpl = Handlebars.compile(tableHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(tableTpl(content));
            this.pinchImg();
            return this;
        };

        this.pinchImg = function (argument) {
            var imgEnlargeContainer = $(document).find('.imageGesture').attr('id');
            pinchZoomImg(imgEnlargeContainer);
        }

        this.initialize();

    };

});
