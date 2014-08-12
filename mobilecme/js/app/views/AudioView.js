define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        audioHtml       = require('text!tpl/audio.html'),
        _getaudio, sound,
        audioTpl        = Handlebars.compile(audioHtml);

        $.browser = {};
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

    return function () {

        this.initialize = function () {
            this.$el = $('.audio-container');
        };

        this.render = function (_currentpage,_audiocontainer) {
            if (_currentpage != undefined) {
                _getaudio = _audiocontainer;
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

            if ( $.browser.msie == false) {
                this.pageAudioPlayer();
            }
        };

        this.pageAudioPlayer = function () {
            var apContainer = $(_getaudio).find('.audioplay'),
                getAudioURL = apContainer.data('audiourl'),
                getAutoPlay = apContainer.data('autoplay');

            if (apContainer.length == 1) {
                if (sound) {
                    sound.unload();
                };

                sound = new Howl({
                urls: [getAudioURL],
                autoplay: getAutoPlay,
                loop: false,
                volume: 0.5,
                onloaderror: function(){
                    $('.icon-sound').removeClass('on pause')
                    $('.icon-sound').addClass('none');
                    alert("An error occurred.  Unable to load sound: "+getAudioURL); 
                },
                onend: function() {
                    console.log('Finished!');
                    },
                onplay: function() {
                    $('.icon-sound').removeClass('none pause')
                    $('.icon-sound').addClass('on')
                    $(apContainer).data('cmeaudio','play')
                    if (Cookies("cmeaudio") == "pause") { sound.pause(); };
                    console.log('Play!');
                    },
                onpause: function() {
                    $('.icon-sound').removeClass('none on')
                    $('.icon-sound').addClass('pause')
                    $(apContainer).data('cmeaudio','pause');
                    Cookies.set("cmeaudio","pause");
                    console.log('Pause!');
                    }
                });

                if (!getAutoPlay) { //disable autoplay and set to pause
                    $('.icon-sound').addClass('pause')
                    $(apContainer).data('cmeaudio','pause');
                }


            } else { 
                if (sound) { //destroy player
                    sound.unload();
                    $('.icon-sound').addClass('none')
                };
                return
            }
        };

        $(document).on('click',".icon-sound", function(event) {
            var getController = $(_getaudio).find('.audioplay').data('cmeaudio');
            console.log("getController",getController);
            if (getController == 'pause') {
                Cookies.set("cmeaudio","play");
                sound.play();
            } else if (getController == 'play') {
                sound.pause();
            } else { return }
                
        });


        this.initialize();

    };

});
