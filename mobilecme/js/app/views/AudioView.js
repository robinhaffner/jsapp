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

            //if ( $.browser.msie == false) {
                this.pageAudioPlayer();
           // }
        };

        this.pageAudioPlayer = function () {
            var apContainer = $(_getaudio).find('.audioplay'),
                getAudioURL = apContainer.data('audiourl'),
                getAutoPlay = apContainer.data('autoplay');
            var _playState = Cookies.get("cmeaudio"); //check to see if the user has paused the audio
            if (_playState == undefined) { //if the audi state cookie has not been set - initialize it here.
                Cookies.set('cmeaudio','play');
            }

            if (apContainer.length == 1 ){ // set up the jwPlayer for audio
                jwplayer('audioPlayer').setup({
                    file: getAudioURL,
                    height: '0',
                    width: '0'
            
                });
                if (_playState != "pause" || _playState == undefined){ //set the icon state and play or pause the video
                        if (getAutoPlay ){
                            $('.icon-sound').removeClass('none pause');
                            $('.icon-sound').addClass('on');
                            jwplayer('audioPlayer').play(true);
                            $(apContainer).data('cmeaudio','play');
                            console.log('Play!');
                        }else if (!getAutoPlay){
                            $('.icon-sound').removeClass('none on');
                            $('.icon-sound').addClass('pause');
                            jwplayer('audioPlayer').play(false);
                            $(apContainer).data('cmeaudio','pause');
                            console.log('Pause!');
                        }else{
                            $('.icon-sound').addClass('none');
                        }
                    }

            } else { //No video for this page
                $('.icon-sound').addClass('none');
                return
            }
        };


        $(document).on('click',".icon-sound", function(event) {
            var _audioPlayer = jwplayer('audioPlayer');
            var apContainer = $(_getaudio).find('.audioplay');
            var getController = $(_getaudio).find('.audioplay').data('cmeaudio');

            var _playState = Cookies.get("cmeaudio");
            
            if (_playState == 'pause') {
                Cookies.set('cmeaudio','play');
                $(apContainer).data('cmeaudio','play');
                _audioPlayer.play(true);
                $('.icon-sound').removeClass('none pause');
                $('.icon-sound').addClass('on');

            } else if (_playState == 'play') {
                Cookies.set('cmeaudio','pause');
                $(apContainer).data('cmeaudio','pause');
                _audioPlayer.pause(true);
                $('.icon-sound').removeClass('none on');
                $('.icon-sound').addClass('pause');

            } else { return }
                
        });


        this.initialize();

    };

});
