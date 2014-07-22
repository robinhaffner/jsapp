define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        footerHtml      = require('text!tpl/footer.html'),

        footerTpl       = Handlebars.compile(footerHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('#ftr');
        };

        this.render = function () {
            this.$el.html(footerTpl());
            return this;
        };

        this.getFooter = function () {
            siteAdapter.getData('footer',0).done(function (_ftr) {
                $("#ftr").html(footerTpl(_ftr));
                return;
            });
        };

        this.initialize();

    };

});

