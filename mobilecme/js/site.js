//Log() - a Lightweight Wrapper for console.log
window.log=function(){log.history=log.history|| new Array(1000);log.history.shift();log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};

var multiselectArr = new Array();
var specialty, paramObj, passedJoinedVars, startPageNum;

Cookies.defaults = {
    path: '/',
    expires: 600
};

function offCanvas () {
    var setwidth = $(window).width();
    if ( setwidth < 767) {
        $('.sidebar-offcanvas').width(setwidth);
    	if ($('.row-offcanvas').position().left < setwidth) {
    		$('.row-offcanvas').toggleClass('active').css('left', setwidth);
    	} else {
    		$('.row-offcanvas').removeClass('active').css('left', 0);
    	}
    } else {
        $('.row-offcanvas').attr('style', '');
        $('.sidebar-offcanvas').attr('style', '');
    }
}

//url parse function
function getPageParam() {
    var checkspecialty = -1;
   
    __param = window.location;
    __p = __param.search.split("?");
    __p = $.grep(__p,function(n,i){ return ( n !== "" ) });

    var b = {};
    if(__p.length > 0){

        getParam = __p[0].split('&');
        for (var i = 0; i < getParam.length; ++i)
        {
            var p=getParam[i].split('=');
            //if( $.inArray( "specialty", p ) == 0) checkspecialty = 0;

            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }

        var joinedVars = $.map(b, function(value, index) {
            if (value != "") {
                return [index+'='+value];
            };
        });

        passedJoinedVars = joinedVars.join("&");
        Cookies.set('user_passedpage_params', passedJoinedVars);

        specialty = 'specialty' in b;
        paramObj = b;

        console.log("getPageParam b: ",b);
    } else {
        Cookies.set('first_time_visit_program', 0);
    }
}

function selectSpecialty(s) {
    var doclocation = document.location.href,
    search = /([^&=]+)=?([^&]*)/g,
    strsplit = doclocation.split(document.location.search)[0],    
    userselectedspecialty = s.text();

    Cookies.set('specialty', userselectedspecialty);
    if (passedJoinedVars == undefined){
        document.location = document.location.href+"?specialty="+userselectedspecialty+"#"+startPageNum;
    }else{
        document.location = strsplit+"?specialty="+userselectedspecialty+"&"+passedJoinedVars+"#"+startPageNum;
    }
}

var showanswers = {
    answercall: function (_qtype,_qid,_qalist,_gid,_async) {

        if (_qtype == "single") { _qtype = "multiplechoice"; }
        var request = $.ajax({
            url: window.config.path.quizapi+"/js/pquiz/answer",
            type: "POST",
            data: {
                type:       _qtype,
                qid:        _qid,
                cid:        _qalist,
                groupid:    _gid,
                programid:  $('body').data('programid')
            },
            dataType: "json",
            beforeSend: function(){
                var storebtn = $('.next-control').parent();
                $('.next-control').hide();
                if($(document).find('.icon-loading').length <= 0){
                    $(storebtn).append("<img src='images/loading.gif' class='icon-loading'>");
                }
            }
        });

        request.done(function( data ) {
            console.log("done",data);
            htmlErr = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Message!</strong> </div>';
            if (data) {
                if(data.status == 0){
                    showanswers.errorhandler(data.err);
                } else {
                    if (_async) {
                        showanswers.inputdata(data.responses);
                    } else {
                        showanswers.bypass();
                    }
                    
                    $('.icon-loading').remove();
                    $('.next-control').show();
                }
            };
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log("jqXHR, textStatus",jqXHR, textStatus);
            var msg = jqXHR.statusText;
            showanswers.errorhandler(msg)
        });
    },
    inputdata: function (data) {
        $(document).find('.listview li').removeClass('selected');

        $.each(data, function(index, val) {
            var _qlist = $(document).find('.listview li#'+index+' .color-fill');
            if (val.correct == 1) {
                $(document).find('.listview li#'+index).addClass('selectedresult');
            };
            var html = '<div class="choice-percent">'+val.percent+'%</div>';
             $(_qlist).append(html);
        });

        $(document).find('.listview li').each( function(i, ele) {
            var getprecent = parseInt($(this).find('.choice-percent').text());
            if($(this).find('.correct').length){
                $(this).addClass('selectedresult');
            }

            if (getprecent >= 100) {
                $(this).find('.color-fill').addClass('percent-fill')
            };

            $(this).find('.color-fill')
                .stop().addClass('color-animate')
                .css('height', '100%')
                .animate({width: getprecent+'%'}, 300);
            $(this).find('.choice-percent').show();

            /*Cookies(listtype, undefined);
            Cookies.set(listtype, listtext);*/
        });

        $(document).find('.listview').addClass('pass'); //answers completed
        $(".alert").remove(); //remove alert box
    },
    errorhandler: function(_msg){
        var msg, 
            htmlErr = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Message!</strong> </div>';

        $(".alert").remove();
        $(htmlErr).insertBefore('.content-wrapper h1');
        $('.alert').append(_msg);

        $(document).find('.listview').addClass('pass');
        $('.icon-loading').remove();
        $('.next-control').show();
    },
    bypass: function(){
        $(".alert").remove();
        $(document).find('.listview').addClass('pass'); //answers completed
        var currentURL = document.location.href;
        var res = currentURL.replace(location.hash, $('.next-control').attr('href'));
        document.location = res;
    }
}

$(document).ready(function () {
    //Polyfill to remove click delays on browsers with touch UIs
    FastClick.attach(document.body);
    
    // Do responsive stuff
    $(window).on('resize', function(e){
        if ($("html").hasClass('no-touch')) {
            offCanvas ();
        };
    });

    //Questions function
    $(document).on('click','.selection-list li',function(event){
        event.preventDefault();
        var selectionlist = $(this).parent();
        var listtype = $( selectionlist ).data( "listview-type" );

        if ($( selectionlist ).hasClass('single') && !$(selectionlist).hasClass('pass')){

            $( selectionlist ).find('li').removeClass('selected');
            $(this).addClass('selected');
            var listtext = $(this).text();

            Cookies(listtype, undefined);
            Cookies.set(listtype, listtext);

        } else if ($( selectionlist ).hasClass('multiplechoice') && !$(selectionlist).hasClass('pass')) {
            $(this).toggleClass('selected');

            if ($(this).hasClass('selected')) {
                var listtext = $(this).text();
                multiselectArr.push(listtext);
            };

            Cookies(listtype, undefined);
            Cookies.set(listtype, multiselectArr);
            //console.log("Cookies.get",Cookies.get(listtype));
        } else { return; }

        if (listtype == "specialty") {
            selectSpecialty($(this));
        };
    });
	 $(document).on('click', '.prev-control', function(event) {
		 playAudio('prev');
	 });

    $(document).on('click', '.next-control', function(event) {
		
        var questionpage = $('.content-wrapper').data('template') == "questionstpl" ? true : false; //check for question template
        if (questionpage) {
         
            if ($(document).find('.listview').data('skip')) { //allow user to skip question
				
                showanswers.bypass();
            };

            if ($(document).hasClass('.listview.pass') || $(document).find('.listview li.selected').length > 0 || $(document).find('.listview li.selectedresult').length > 0) {
                
                if ($(document).find('.listview').data('role') == "listview" && !$(this).hasClass('click-control')) {
                    event.preventDefault();

                    $(this).addClass('click-control');
                    var _qalist = [],
                        _list = $(document).find('.listview'),
                        listviewType = _list.data('listview-type'),
                        listviewQid = _list.data('qid'),
                        listviewGid = _list.data('groupid'),
                        listviewAsync = _list.data('async-answer'),
                        listselect = _list.find('li.selected');

                    if(listselect.length > 0){
                        $(listselect).each(function(index, val) {
                             _qalist.push($(val).attr('id'));
                        });
                        showanswers.answercall(listviewType,listviewQid,_qalist,listviewGid,listviewAsync)
                    } 
                    return;
                } else if($(this).hasClass('click-control')) {
                    $(this).removeClass('click-control');
                }

            }
            else { 
                event.preventDefault(); 
                var htmlAlert = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Warning!</strong> Please select an answer</div>';
                $(".alert").remove();
                $(htmlAlert).insertBefore('.content-wrapper h1');
                //return; 
            }
        } else {
			playAudio('next');
			return;

		}

    });
	

		 
	function playAudio(_page){
			var audio_url = $('.'+_page+'-control').attr('audio_url');
			var audio_autoplay = $('.'+_page+'-control').attr('audio_autoplay');
			var _playState = Cookies.get("cmeaudio");
			console.log("next control", $('.next-control'), audio_url);
			if (audio_url != ''){
					initPlayer('audio',audio_url);

                if (_playState != "pause" && audio_autoplay){ //set the icon state and play or pause the video
                        jwplayer('audioPlayer').play(true);
						$('.icon-sound').removeClass('none pause');
                        $('.icon-sound').addClass('on');
                 }else {			
                        jwplayer('audioPlayer').play(false);
					 	$('.icon-sound').removeClass('none on');
                        $('.icon-sound').addClass('pause');
                 }
            } else { //No audio for this page; initialize player with a blank audio file
				initPlayer('audio', '//jwpsrv.com/feed/VqEsf9Va.rss');
				$('.icon-sound').removeClass('pause on');
                $('.icon-sound').addClass('none');
				return;
            }
	
}
	
	function initPlayer(type, file) {
					jwplayer(type +'Player').setup({
							file: file,
							height: '35'
					}).onSetupError(function(event){
						console.log("onsetuperror", event);
					}).onPlay( function(event){
						console.log("onplay", event);
					}).onError(function(event){
						console.log("onError", event);
					});
		
		//console.log(jwplayer('audioPlayer'));
	}
	
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


	$('#footerModal').on('show.bs.modal', function (e) {
		var container = $(e.currentTarget).attr('id');
        var htmlCloseBtn = '<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>';
		$.get( $(e.relatedTarget).attr('href'), function( data ) {
		  $( "#"+container + " .modal-content").html( data );
          $(htmlCloseBtn).insertBefore( "#"+container + " .modal-body");
		});
	});

}); //ready
