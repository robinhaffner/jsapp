//Log() - a Lightweight Wrapper for console.log
window.log=function(){log.history=log.history|| new Array(1000);log.history.shift();log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};

var multiselectArr = new Array();
var specialty, paramObj, passedJoinedVars, startPageNum, gotopage;

Cookies.defaults = {
    path: '/',
    expires: 600
};

strhash = window.location.hash;

if (strhash.split("#").length > 0) {
    gotopage = strhash.split("#")[1]
} else { gotopage = startPageNum }

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
    console.log("selectSpecialty",s, window.location.hash);
    var doclocation = document.location.href,
    search = /([^&=]+)=?([^&]*)/g,
    strsplit = doclocation.split(document.location.search)[0],    
    userselectedspecialty = s.text();

    Cookies.set('specialty', userselectedspecialty);
    if (passedJoinedVars == undefined){
        document.location = document.location.href+"?specialty="+userselectedspecialty+"#"+gotopage;
    }else{
        document.location = strsplit+"?specialty="+userselectedspecialty+"&"+passedJoinedVars+"#"+gotopage;
    }
}

var questionhandler = {
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
var submitform = {
    formaction: function (_formdata) {
        console.log("_formdata",_formdata);
        var request = $.ajax({
            url: window.config.path.quizapi+"/pcertificates/ajax/submit",
            type: "POST",
            data: _formdata,
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
            var msg = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Success!</strong> </div>'
            if (data) {
                if(data.status == 0){
                    questionhandler.errorhandler(data.err);
                } else {
                    $(msg).insertBefore('.content-wrapper h1');
                    $('.icon-loading').remove();
                    $('.next-control').show();
                }
            }
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log("jqXHR, textStatus",jqXHR, textStatus);
            var msg = jqXHR.statusText;
            questionhandler.errorhandler(msg)
        });
    }
}

var showanswers = {
    answercall: function (_qadata,_async) {

        if (_qadata.type == "single") { _qadata.type = "multiplechoice"; }
        var request = $.ajax({
            url: window.config.path.quizapi+"/js/pquiz/answer",
            type: "POST",
            data: _qadata,
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
                    questionhandler.errorhandler(data.err);
                } else {
                    if (_async) {
                        showanswers.inputdata(data.responses);
                    } else {
                        questionhandler.bypass();
                    }
                    
                    $('.icon-loading').remove();
                    $('.next-control').show();
                }
            };
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log("jqXHR, textStatus",jqXHR, textStatus);
            var msg = jqXHR.statusText;
            questionhandler.errorhandler(msg)
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
    }
}

$(document).ready(function () {

    //Polyfill to remove click delays on browsers with touch UIs
    FastClick.attach(document.body);
    
    // Do responsive stuff
    $(window).on('resize', function(e){
        if ($("html").hasClass('no-touch')) {
            if ($('.sidebar-offcanvas').length) { offCanvas (); };            
        };
    });

    //sidebar clickable container
    /*$(document).on('click', '#sidebar .list-group-item', function(event) {
        event.preventDefault();
        var chapterurlpath = document.location.host+document.location.pathname+$(this).data('chapterurl');
        console.log("chapterurlpath",chapterurlpath);
        document.location = chapterurlpath;
    });*/

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

    $(document).on('click', '.freeform button[type="submit"]', function(event) {
        event.preventDefault();
        console.log("this",this);
        var _qaObj = {},
            req = $(document).find('.form-control');

        $(req).removeClass('has-error');
        var formObj = {};
        console.log("req",req);
        $.each(req, function(i, field) {
            console.log("i, field",i, field);
             var    fname = $(field).attr('name'),
                    fval = $(field).val();
                    if ($(field).is('select')) {
                        formObj[$(this).attr('name')] = $(this).find("option:selected").text();
                    };
             formObj[fname] = fval;
        });
        formObj["certificate"] = $('body').data('certificate');
        submitform.formaction(formObj);
    });
    
    $(document).on('click', '.next-control', function(event) {
		
        var questionpage = $('.content-wrapper').data('template') == "questionstpl" ? true : false; //check for question template
        if (questionpage) {
            var _qaObj = {},
                req = $(document).find('.form-control');
         
            if ($(document).find('.listview').data('skip')) { //allow user to skip question
                questionhandler.bypass();
                return;
            }

            if ($("ul.sortable").data('sortJSON')) {
                var sortJSON = $("ul.sortable").data('sortJSON'),
                    orgList = sortJSON.listArr,
                    sortList = sortJSON.sortedlistArr;
                
                console.log("sortJSON",orgList,sortList);
                Cookies.set('plot1',orgList);
                Cookies.set('plot2',sortList);
                /*if(sortList !=  undefined){
                    showanswers.answercall(sortList,"sort");
                }*/
            };

            if ($(document).find('.form-control.required').val() != undefined || $(document).hasClass('.listview.pass') || $(document).find('.listview li.selected').length > 0 || $(document).find('.listview li.selectedresult').length > 0) {
                console.log("if");
                if ($(document).find('.freeform').data('role') == "listview" && !$(this).hasClass('click-control')) {
                    event.preventDefault();

                    $(this).addClass('click-control');
                    $(req).removeClass('has-error');
                    var formObj = {};
                    console.log("req",req);
                    $.each(req, function(i, field) {
                        console.log("i, field",i, field);
                         var    fname = $(field).attr('name'),
                                fval = $(field).val();
                                if ($(field).is('select')) {
                                    formObj[$(this).attr('name')] = $(this).find("option:selected").text();
                                };
                         formObj[fname] = fval;
                    });
                    formObj["certificate"] = $('body').data('certificate');
                    submitform.formaction(formObj);
                }
                else if ($(document).find('.listview').data('role') == "listview" && !$(this).hasClass('click-control')) {
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
                        _qaObj.type = listviewType;
                        _qaObj.qid = listviewQid;
                        _qaObj.cid = _qalist; //null
                        _qaObj.groupid = listviewGid;
                        _qaObj.programid = $('body').data('programid');
                        showanswers.answercall(_qaObj,listviewAsync)
                    } 
                    return;
                } else if($(this).hasClass('click-control')) {
                    $(this).removeClass('click-control');
                }

            }
            else { 
                console.log("else");
                event.preventDefault(); 
                var htmlAlert = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Warning!</strong> Please answer question</div>';
                $(".alert").remove();
                if ($(document).find('.freeform')) {
                    $(".form-control").each(function(index, field) {
                         if($(field).hasClass('required') && $(field).val() == "") {
                            $(field).parent().addClass('has-error')
                         }
                    });
                };
                $(htmlAlert).insertBefore('.content-wrapper h1');
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
