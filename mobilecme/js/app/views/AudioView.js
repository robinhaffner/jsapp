define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        audioHtml       = require('text!tpl/audio.html'),
        _getaudio, sound,
        audioTpl        = Handlebars.compile(audioHtml);

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

            this.pageAudioPlayer();
        };

 this.pageAudioPlayer = function () {
            var apContainer = $(_getaudio).find('.audioplay'),
                getAudioURL = apContainer.data('audiourl'),
                getAutoPlay = apContainer.data('autoplay');
            var _playState = Cookies.get("cmeaudio"); //check to see if the user has paused the audio
   

            if (apContainer.length == 1 ){ // set up the jwPlayer for audio
              jwplayer('audioPlayer').setup({
                    file: getAudioURL,
                    height: '0',
                    width: '0',
					//skin: 'jw/audio/procmeaudio.xml'
                });
				
	
                //console.log("_playState",_playState);
                if (_playState != "pause" && getAutoPlay){ //set the icon state and play or pause the video
                        jwplayer('audioPlayer').play(true);
						$('.icon-sound').removeClass('none pause');
                        $('.icon-sound').addClass('on');
                        //console.log('Play!');
                 }else {			
                        jwplayer('audioPlayer').play(false);
		 				$('.icon-sound').removeClass('none on');
                        $('.icon-sound').addClass('pause');
                        //console.log('Pause!');
                 }
            } else { //No video for this page
				$('.icon-sound').removeClass('pause on');
                $('.icon-sound').addClass('none');

                return
            }
        };


        $(document).on('click',".icon-sound", function(event) {
            var _audioPlayer = jwplayer('audioPlayer');

            var _playState =  _audioPlayer.getState();//Cookies.get("cmeaudio");
		_audioPlayer.play();

            if (_playState == 'PAUSED' || _playState == 'IDLE') {
                $('.icon-sound').removeClass('none pause');
                $('.icon-sound').addClass('on');
		Cookies.set('cmeaudio','play');
            } else if (_playState == 'PLAYING') {
                $('.icon-sound').removeClass('none on');
                $('.icon-sound').addClass('pause');
                Cookies.set('cmeaudio','pause');
            } else { return }
                
        });




        this.initialize();

    };

});
