define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        audioHtml       = require('text!tpl/audio.html'),

        audioTpl        = Handlebars.compile(audioHtml);

    return function () {

        this.initialize = function () {
            this.$el = $('.audio-container');
        };

        this.render = function (_currentpage) {
            if (_currentpage != undefined) {
                console.log("currentpage",_currentpage);
                this.getAudio(_currentpage);
            };
        };

        this.getAudio = function (_cp) {
            siteAdapter.getData('sitecontent',"null").done(function (_sitedata) {
                for(var i in _sitedata){
                    if (_sitedata[i].id == _cp) {
                        $('.audio-container').html(audioTpl(_sitedata[i]));
                        return;                                
                    };
                }
            });
        }

        this.initialize();

    };

});
