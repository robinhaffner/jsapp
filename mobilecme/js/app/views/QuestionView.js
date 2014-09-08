define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        questionHtml    = require('text!tpl/question.html'),

        questionTpl = Handlebars.compile(questionHtml);

        require('js/lib/vendor/jquery-ui.min.js'); //file plugin need to execute sortable funtion
        
        Handlebars.registerHelper('if_eq', function(a, b, opts) {
            if(a == b) // Or === depending on your needs
                return opts.fn(this);
            else
                if(opts == undefined){
                    var ret = "";

                    for(var i=0, j=a.length; i<j; i++) {
                        ret = ret + b.fn(a[i]);
                    }
                    return ret;
                }
                else {
                    return opts.inverse(this);
                }
        });
    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(questionTpl(content));
            this.$el.data('template', '').data('template', 'questionstpl');
 

            var sortcontainer = $("ul.sortable").attr('id'); //find sortable ul id
            if (sortcontainer) {  $("#"+sortcontainer).sortable(); }; //sortable jquery-ui function
     
            return this;
        };

        this.initialize();

    };

});
