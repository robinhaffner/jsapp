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

function pinchZoomImg(imgcontainterID) {
    var myScroll;
        myScroll = new IScroll('#'+imgcontainterID, {
            zoom: true,
            scrollX: true,
            scrollY: true,
            mouseWheel: true,
            wheelAction: 'zoom'
        });
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
    answercall: function (_qtype,_qid,_qalist) {

        if (_qtype == "single") { _qtype = "multiplechoice"; }
        var request = $.ajax({
            url: window.config.path.quizapi+"/js/pquiz/answer",
            type: "POST",
            data: {
                type:   _qtype,
                qid:    _qid,
                cid:    _qalist,
                programid: $('body').data('programid')
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
            if (data) {
                if(data.status == 0){
                    showanswers.errorhandler(data.err);
                } else {
                    showanswers.inputdata(data.responses);
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

        /**random correct**/
        var tempcorrect = Math.floor(Math.random() * $(document).find('.listview li').length);
        $(document).find('.listview li:eq('+tempcorrect+')').addClass('selectedresult');
        /**end**/

        $.each(data, function(index, val) {
            var _qlist = $(document).find('.listview li#'+index+' .color-fill');
            var _correct = (val.correct = 0 ) ? "correct":"incorrect";
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

    }
}

$(document).ready(function () {

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

    $(document).on('click', '.next-control', function(event) {
        var questionpage = $('.content-wrapper').data('template') == "questionstpl" ? true : false; //check for question template
        if (questionpage) {
            if ($(document).hasClass('.listview.pass') || $(document).find('.listview li.selected').length > 0 || $(document).find('.listview li.selectedresult').length > 0) {
                
                if ($(document).find('.listview').data('role') == "listview" && !$(this).hasClass('click-control')) {
                    event.preventDefault();

                    $(this).addClass('click-control');
                    var _qalist = [],
                        _list = $(document).find('.listview'),
                        listviewType = _list.data('listview-type'),
                        listviewQid = _list.data('qid'),
                        listselect = _list.find('li.selected');

                    if(listselect.length > 0){
                        $(listselect).each(function(index, val) {
                             _qalist.push($(val).attr('id'));
                        });
                        showanswers.answercall(listviewType,listviewQid,_qalist)
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
        } else { return; }

    });


	$('#footerModal').on('show.bs.modal', function (e) {
		var container = $(e.currentTarget).attr('id');
		$.get( $(e.relatedTarget).attr('href'), function( data ) {
		  $( "#"+container + " .modal-content").html( data );
		});
	});

}); //ready

/*! iScroll v5.1.1 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function(e,t,n){function s(e,r){this.wrapper=typeof e=="string"?t.querySelector(e):e;this.scroller=this.wrapper.children[0];this.scrollerStyle=this.scroller.style;this.options={zoomMin:1,zoomMax:4,startZoom:1,resizeScrollbars:true,mouseWheelSpeed:20,snapThreshold:.334,startX:0,startY:0,scrollY:true,directionLockThreshold:5,momentum:true,bounce:true,bounceTime:600,bounceEasing:"",preventDefault:true,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:true,useTransition:true,useTransform:true};for(var s in r){this.options[s]=r[s]}this.translateZ=this.options.HWCompositing&&i.hasPerspective?" translateZ(0)":"";this.options.useTransition=i.hasTransition&&this.options.useTransition;this.options.useTransform=i.hasTransform&&this.options.useTransform;this.options.eventPassthrough=this.options.eventPassthrough===true?"vertical":this.options.eventPassthrough;this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault;this.options.scrollY=this.options.eventPassthrough=="vertical"?false:this.options.scrollY;this.options.scrollX=this.options.eventPassthrough=="horizontal"?false:this.options.scrollX;this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough;this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold;this.options.bounceEasing=typeof this.options.bounceEasing=="string"?i.ease[this.options.bounceEasing]||i.ease.circular:this.options.bounceEasing;this.options.resizePolling=this.options.resizePolling===undefined?60:this.options.resizePolling;if(this.options.tap===true){this.options.tap="tap"}if(this.options.shrinkScrollbars=="scale"){this.options.useTransition=false}this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1;this.x=0;this.y=0;this.directionX=0;this.directionY=0;this._events={};this.scale=n.min(n.max(this.options.startZoom,this.options.zoomMin),this.options.zoomMax);this._init();this.refresh();this.scrollTo(this.options.startX,this.options.startY);this.enable()}function o(e,n,r){var i=t.createElement("div"),s=t.createElement("div");if(r===true){i.style.cssText="position:absolute;z-index:9999";s.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"}s.className="iScrollIndicator";if(e=="h"){if(r===true){i.style.cssText+=";height:7px;left:2px;right:2px;bottom:0";s.style.height="100%"}i.className="iScrollHorizontalScrollbar"}else{if(r===true){i.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px";s.style.width="100%"}i.className="iScrollVerticalScrollbar"}i.style.cssText+=";overflow:hidden";if(!n){i.style.pointerEvents="none"}i.appendChild(s);return i}function u(n,r){this.wrapper=typeof r.el=="string"?t.querySelector(r.el):r.el;this.wrapperStyle=this.wrapper.style;this.indicator=this.wrapper.children[0];this.indicatorStyle=this.indicator.style;this.scroller=n;this.options={listenX:true,listenY:true,interactive:false,resize:true,defaultScrollbars:false,shrink:false,fade:false,speedRatioX:0,speedRatioY:0};for(var s in r){this.options[s]=r[s]}this.sizeRatioX=1;this.sizeRatioY=1;this.maxPosX=0;this.maxPosY=0;if(this.options.interactive){if(!this.options.disableTouch){i.addEvent(this.indicator,"touchstart",this);i.addEvent(e,"touchend",this)}if(!this.options.disablePointer){i.addEvent(this.indicator,"MSPointerDown",this);i.addEvent(e,"MSPointerUp",this)}if(!this.options.disableMouse){i.addEvent(this.indicator,"mousedown",this);i.addEvent(e,"mouseup",this)}}if(this.options.fade){this.wrapperStyle[i.style.transform]=this.scroller.translateZ;this.wrapperStyle[i.style.transitionDuration]=i.isBadAndroid?"0.001s":"0ms";this.wrapperStyle.opacity="0"}}var r=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t){e.setTimeout(t,1e3/60)};var i=function(){function o(e){if(s===false)return false;if(s==="")return e;return s+e.charAt(0).toUpperCase()+e.substr(1)}var r={};var i=t.createElement("div").style;var s=function(){var e=["t","webkitT","MozT","msT","OT"],t,n=0,r=e.length;for(;n<r;n++){t=e[n]+"ransform";if(t in i)return e[n].substr(0,e[n].length-1)}return false}();r.getTime=Date.now||function(){return(new Date).getTime()};r.extend=function(e,t){for(var n in t){e[n]=t[n]}};r.addEvent=function(e,t,n,r){e.addEventListener(t,n,!!r)};r.removeEvent=function(e,t,n,r){e.removeEventListener(t,n,!!r)};r.momentum=function(e,t,r,i,s,o){var u=e-t,a=n.abs(u)/r,f,l;o=o===undefined?6e-4:o;f=e+a*a/(2*o)*(u<0?-1:1);l=a/o;if(f<i){f=s?i-s/2.5*(a/8):i;u=n.abs(f-e);l=u/a}else if(f>0){f=s?s/2.5*(a/8):0;u=n.abs(e)+f;l=u/a}return{destination:n.round(f),duration:l}};var u=o("transform");r.extend(r,{hasTransform:u!==false,hasPerspective:o("perspective")in i,hasTouch:"ontouchstart"in e,hasPointer:navigator.msPointerEnabled,hasTransition:o("transition")in i});r.isBadAndroid=/Android /.test(e.navigator.appVersion)&&!/Chrome\/\d/.test(e.navigator.appVersion);r.extend(r.style={},{transform:u,transitionTimingFunction:o("transitionTimingFunction"),transitionDuration:o("transitionDuration"),transitionDelay:o("transitionDelay"),transformOrigin:o("transformOrigin")});r.hasClass=function(e,t){var n=new RegExp("(^|\\s)"+t+"(\\s|$)");return n.test(e.className)};r.addClass=function(e,t){if(r.hasClass(e,t)){return}var n=e.className.split(" ");n.push(t);e.className=n.join(" ")};r.removeClass=function(e,t){if(!r.hasClass(e,t)){return}var n=new RegExp("(^|\\s)"+t+"(\\s|$)","g");e.className=e.className.replace(n," ")};r.offset=function(e){var t=-e.offsetLeft,n=-e.offsetTop;while(e=e.offsetParent){t-=e.offsetLeft;n-=e.offsetTop}return{left:t,top:n}};r.preventDefaultException=function(e,t){for(var n in t){if(t[n].test(e[n])){return true}}return false};r.extend(r.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3});r.extend(r.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(e){return e*(2-e)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(e){return n.sqrt(1- --e*e)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(e){var t=4;return(e=e-1)*e*((t+1)*e+t)+1}},bounce:{style:"",fn:function(e){if((e/=1)<1/2.75){return 7.5625*e*e}else if(e<2/2.75){return 7.5625*(e-=1.5/2.75)*e+.75}else if(e<2.5/2.75){return 7.5625*(e-=2.25/2.75)*e+.9375}else{return 7.5625*(e-=2.625/2.75)*e+.984375}}},elastic:{style:"",fn:function(e){var t=.22,r=.4;if(e===0){return 0}if(e==1){return 1}return r*n.pow(2,-10*e)*n.sin((e-t/4)*2*n.PI/t)+1}}});r.tap=function(e,n){var r=t.createEvent("Event");r.initEvent(n,true,true);r.pageX=e.pageX;r.pageY=e.pageY;e.target.dispatchEvent(r)};r.click=function(e){var n=e.target,r;if(!/(SELECT|INPUT|TEXTAREA)/i.test(n.tagName)){r=t.createEvent("MouseEvents");r.initMouseEvent("click",true,true,e.view,1,n.screenX,n.screenY,n.clientX,n.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,0,null);r._constructed=true;n.dispatchEvent(r)}};return r}();s.prototype={version:"5.1.1",_init:function(){this._initEvents();if(this.options.zoom){this._initZoom()}if(this.options.scrollbars||this.options.indicators){this._initIndicators()}if(this.options.mouseWheel){this._initWheel()}if(this.options.snap){this._initSnap()}if(this.options.keyBindings){this._initKeys()}},destroy:function(){this._initEvents(true);this._execEvent("destroy")},_transitionEnd:function(e){if(e.target!=this.scroller||!this.isInTransition){return}this._transitionTime();if(!this.resetPosition(this.options.bounceTime)){this.isInTransition=false;this._execEvent("scrollEnd")}},_start:function(e){if(i.eventType[e.type]!=1){if(e.button!==0){return}}if(!this.enabled||this.initiated&&i.eventType[e.type]!==this.initiated){return}if(this.options.preventDefault&&!i.isBadAndroid&&!i.preventDefaultException(e.target,this.options.preventDefaultException)){e.preventDefault()}var t=e.touches?e.touches[0]:e,r;this.initiated=i.eventType[e.type];this.moved=false;this.distX=0;this.distY=0;this.directionX=0;this.directionY=0;this.directionLocked=0;this._transitionTime();this.startTime=i.getTime();if(this.options.useTransition&&this.isInTransition){this.isInTransition=false;r=this.getComputedPosition();this._translate(n.round(r.x),n.round(r.y));this._execEvent("scrollEnd")}else if(!this.options.useTransition&&this.isAnimating){this.isAnimating=false;this._execEvent("scrollEnd")}this.startX=this.x;this.startY=this.y;this.absStartX=this.x;this.absStartY=this.y;this.pointX=t.pageX;this.pointY=t.pageY;this._execEvent("beforeScrollStart")},_move:function(e){if(!this.enabled||i.eventType[e.type]!==this.initiated){return}if(this.options.preventDefault){e.preventDefault()}var t=e.touches?e.touches[0]:e,r=t.pageX-this.pointX,s=t.pageY-this.pointY,o=i.getTime(),u,a,f,l;this.pointX=t.pageX;this.pointY=t.pageY;this.distX+=r;this.distY+=s;f=n.abs(this.distX);l=n.abs(this.distY);if(o-this.endTime>300&&f<10&&l<10){return}if(!this.directionLocked&&!this.options.freeScroll){if(f>l+this.options.directionLockThreshold){this.directionLocked="h"}else if(l>=f+this.options.directionLockThreshold){this.directionLocked="v"}else{this.directionLocked="n"}}if(this.directionLocked=="h"){if(this.options.eventPassthrough=="vertical"){e.preventDefault()}else if(this.options.eventPassthrough=="horizontal"){this.initiated=false;return}s=0}else if(this.directionLocked=="v"){if(this.options.eventPassthrough=="horizontal"){e.preventDefault()}else if(this.options.eventPassthrough=="vertical"){this.initiated=false;return}r=0}r=this.hasHorizontalScroll?r:0;s=this.hasVerticalScroll?s:0;u=this.x+r;a=this.y+s;if(u>0||u<this.maxScrollX){u=this.options.bounce?this.x+r/3:u>0?0:this.maxScrollX}if(a>0||a<this.maxScrollY){a=this.options.bounce?this.y+s/3:a>0?0:this.maxScrollY}this.directionX=r>0?-1:r<0?1:0;this.directionY=s>0?-1:s<0?1:0;if(!this.moved){this._execEvent("scrollStart")}this.moved=true;this._translate(u,a);if(o-this.startTime>300){this.startTime=o;this.startX=this.x;this.startY=this.y}},_end:function(e){if(!this.enabled||i.eventType[e.type]!==this.initiated){return}if(this.options.preventDefault&&!i.preventDefaultException(e.target,this.options.preventDefaultException)){e.preventDefault()}var t=e.changedTouches?e.changedTouches[0]:e,r,s,o=i.getTime()-this.startTime,u=n.round(this.x),a=n.round(this.y),f=n.abs(u-this.startX),l=n.abs(a-this.startY),c=0,h="";this.isInTransition=0;this.initiated=0;this.endTime=i.getTime();if(this.resetPosition(this.options.bounceTime)){return}this.scrollTo(u,a);if(!this.moved){if(this.options.tap){i.tap(e,this.options.tap)}if(this.options.click){i.click(e)}this._execEvent("scrollCancel");return}if(this._events.flick&&o<200&&f<100&&l<100){this._execEvent("flick");return}if(this.options.momentum&&o<300){r=this.hasHorizontalScroll?i.momentum(this.x,this.startX,o,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:u,duration:0};s=this.hasVerticalScroll?i.momentum(this.y,this.startY,o,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:a,duration:0};u=r.destination;a=s.destination;c=n.max(r.duration,s.duration);this.isInTransition=1}if(this.options.snap){var p=this._nearestSnap(u,a);this.currentPage=p;c=this.options.snapSpeed||n.max(n.max(n.min(n.abs(u-p.x),1e3),n.min(n.abs(a-p.y),1e3)),300);u=p.x;a=p.y;this.directionX=0;this.directionY=0;h=this.options.bounceEasing}if(u!=this.x||a!=this.y){if(u>0||u<this.maxScrollX||a>0||a<this.maxScrollY){h=i.ease.quadratic}this.scrollTo(u,a,c,h);return}this._execEvent("scrollEnd")},_resize:function(){var e=this;clearTimeout(this.resizeTimeout);this.resizeTimeout=setTimeout(function(){e.refresh()},this.options.resizePolling)},resetPosition:function(e){var t=this.x,n=this.y;e=e||0;if(!this.hasHorizontalScroll||this.x>0){t=0}else if(this.x<this.maxScrollX){t=this.maxScrollX}if(!this.hasVerticalScroll||this.y>0){n=0}else if(this.y<this.maxScrollY){n=this.maxScrollY}if(t==this.x&&n==this.y){return false}this.scrollTo(t,n,e,this.options.bounceEasing);return true},disable:function(){this.enabled=false},enable:function(){this.enabled=true},refresh:function(){var e=this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth;this.wrapperHeight=this.wrapper.clientHeight;this.scrollerWidth=n.round(this.scroller.offsetWidth*this.scale);this.scrollerHeight=n.round(this.scroller.offsetHeight*this.scale);this.maxScrollX=this.wrapperWidth-this.scrollerWidth;this.maxScrollY=this.wrapperHeight-this.scrollerHeight;this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0;this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0;if(!this.hasHorizontalScroll){this.maxScrollX=0;this.scrollerWidth=this.wrapperWidth}if(!this.hasVerticalScroll){this.maxScrollY=0;this.scrollerHeight=this.wrapperHeight}this.endTime=0;this.directionX=0;this.directionY=0;this.wrapperOffset=i.offset(this.wrapper);this._execEvent("refresh");this.resetPosition()},on:function(e,t){if(!this._events[e]){this._events[e]=[]}this._events[e].push(t)},off:function(e,t){if(!this._events[e]){return}var n=this._events[e].indexOf(t);if(n>-1){this._events[e].splice(n,1)}},_execEvent:function(e){if(!this._events[e]){return}var t=0,n=this._events[e].length;if(!n){return}for(;t<n;t++){this._events[e][t].apply(this,[].slice.call(arguments,1))}},scrollBy:function(e,t,n,r){e=this.x+e;t=this.y+t;n=n||0;this.scrollTo(e,t,n,r)},scrollTo:function(e,t,n,r){r=r||i.ease.circular;this.isInTransition=this.options.useTransition&&n>0;if(!n||this.options.useTransition&&r.style){this._transitionTimingFunction(r.style);this._transitionTime(n);this._translate(e,t)}else{this._animate(e,t,n,r.fn)}},scrollToElement:function(e,t,r,s,o){e=e.nodeType?e:this.scroller.querySelector(e);if(!e){return}var u=i.offset(e);u.left-=this.wrapperOffset.left;u.top-=this.wrapperOffset.top;if(r===true){r=n.round(e.offsetWidth/2-this.wrapper.offsetWidth/2)}if(s===true){s=n.round(e.offsetHeight/2-this.wrapper.offsetHeight/2)}u.left-=r||0;u.top-=s||0;u.left=u.left>0?0:u.left<this.maxScrollX?this.maxScrollX:u.left;u.top=u.top>0?0:u.top<this.maxScrollY?this.maxScrollY:u.top;t=t===undefined||t===null||t==="auto"?n.max(n.abs(this.x-u.left),n.abs(this.y-u.top)):t;this.scrollTo(u.left,u.top,t,o)},_transitionTime:function(e){e=e||0;this.scrollerStyle[i.style.transitionDuration]=e+"ms";if(!e&&i.isBadAndroid){this.scrollerStyle[i.style.transitionDuration]="0.001s"}if(this.indicators){for(var t=this.indicators.length;t--;){this.indicators[t].transitionTime(e)}}},_transitionTimingFunction:function(e){this.scrollerStyle[i.style.transitionTimingFunction]=e;if(this.indicators){for(var t=this.indicators.length;t--;){this.indicators[t].transitionTimingFunction(e)}}},_translate:function(e,t){if(this.options.useTransform){this.scrollerStyle[i.style.transform]="translate("+e+"px,"+t+"px) scale("+this.scale+") "+this.translateZ}else{e=n.round(e);t=n.round(t);this.scrollerStyle.left=e+"px";this.scrollerStyle.top=t+"px"}this.x=e;this.y=t;if(this.indicators){for(var r=this.indicators.length;r--;){this.indicators[r].updatePosition()}}},_initEvents:function(t){var n=t?i.removeEvent:i.addEvent,r=this.options.bindToWrapper?this.wrapper:e;n(e,"orientationchange",this);n(e,"resize",this);if(this.options.click){n(this.wrapper,"click",this,true)}if(!this.options.disableMouse){n(this.wrapper,"mousedown",this);n(r,"mousemove",this);n(r,"mousecancel",this);n(r,"mouseup",this)}if(i.hasPointer&&!this.options.disablePointer){n(this.wrapper,"MSPointerDown",this);n(r,"MSPointerMove",this);n(r,"MSPointerCancel",this);n(r,"MSPointerUp",this)}if(i.hasTouch&&!this.options.disableTouch){n(this.wrapper,"touchstart",this);n(r,"touchmove",this);n(r,"touchcancel",this);n(r,"touchend",this)}n(this.scroller,"transitionend",this);n(this.scroller,"webkitTransitionEnd",this);n(this.scroller,"oTransitionEnd",this);n(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var t=e.getComputedStyle(this.scroller,null),n,r;if(this.options.useTransform){t=t[i.style.transform].split(")")[0].split(", ");n=+(t[12]||t[4]);r=+(t[13]||t[5])}else{n=+t.left.replace(/[^-\d.]/g,"");r=+t.top.replace(/[^-\d.]/g,"")}return{x:n,y:r}},_initIndicators:function(){function a(e){for(var t=i.indicators.length;t--;){e.call(i.indicators[t])}}var e=this.options.interactiveScrollbars,t=typeof this.options.scrollbars!="string",n=[],r;var i=this;this.indicators=[];if(this.options.scrollbars){if(this.options.scrollY){r={el:o("v",e,this.options.scrollbars),interactive:e,defaultScrollbars:true,customStyle:t,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:false};this.wrapper.appendChild(r.el);n.push(r)}if(this.options.scrollX){r={el:o("h",e,this.options.scrollbars),interactive:e,defaultScrollbars:true,customStyle:t,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:false};this.wrapper.appendChild(r.el);n.push(r)}}if(this.options.indicators){n=n.concat(this.options.indicators)}for(var s=n.length;s--;){this.indicators.push(new u(this,n[s]))}if(this.options.fadeScrollbars){this.on("scrollEnd",function(){a(function(){this.fade()})});this.on("scrollCancel",function(){a(function(){this.fade()})});this.on("scrollStart",function(){a(function(){this.fade(1)})});this.on("beforeScrollStart",function(){a(function(){this.fade(1,true)})})}this.on("refresh",function(){a(function(){this.refresh()})});this.on("destroy",function(){a(function(){this.destroy()});delete this.indicators})},_initZoom:function(){this.scrollerStyle[i.style.transformOrigin]="0 0"},_zoomStart:function(e){var t=n.abs(e.touches[0].pageX-e.touches[1].pageX),r=n.abs(e.touches[0].pageY-e.touches[1].pageY);this.touchesDistanceStart=n.sqrt(t*t+r*r);this.startScale=this.scale;this.originX=n.abs(e.touches[0].pageX+e.touches[1].pageX)/2+this.wrapperOffset.left-this.x;this.originY=n.abs(e.touches[0].pageY+e.touches[1].pageY)/2+this.wrapperOffset.top-this.y;this._execEvent("zoomStart")},_zoom:function(e){if(!this.enabled||i.eventType[e.type]!==this.initiated){return}if(this.options.preventDefault){e.preventDefault()}var t=n.abs(e.touches[0].pageX-e.touches[1].pageX),r=n.abs(e.touches[0].pageY-e.touches[1].pageY),s=n.sqrt(t*t+r*r),o=1/this.touchesDistanceStart*s*this.startScale,u,a,f;this.scaled=true;if(o<this.options.zoomMin){o=.5*this.options.zoomMin*n.pow(2,o/this.options.zoomMin)}else if(o>this.options.zoomMax){o=2*this.options.zoomMax*n.pow(.5,this.options.zoomMax/o)}u=o/this.startScale;a=this.originX-this.originX*u+this.startX;f=this.originY-this.originY*u+this.startY;this.scale=o;this.scrollTo(a,f,0)},_zoomEnd:function(e){if(!this.enabled||i.eventType[e.type]!==this.initiated){return}if(this.options.preventDefault){e.preventDefault()}var t,n,r;this.isInTransition=0;this.initiated=0;if(this.scale>this.options.zoomMax){this.scale=this.options.zoomMax}else if(this.scale<this.options.zoomMin){this.scale=this.options.zoomMin}this.refresh();r=this.scale/this.startScale;t=this.originX-this.originX*r+this.startX;n=this.originY-this.originY*r+this.startY;if(t>0){t=0}else if(t<this.maxScrollX){t=this.maxScrollX}if(n>0){n=0}else if(n<this.maxScrollY){n=this.maxScrollY}if(this.x!=t||this.y!=n){this.scrollTo(t,n,this.options.bounceTime)}this.scaled=false;this._execEvent("zoomEnd")},zoom:function(e,t,n,r){if(e<this.options.zoomMin){e=this.options.zoomMin}else if(e>this.options.zoomMax){e=this.options.zoomMax}if(e==this.scale){return}var i=e/this.scale;t=t===undefined?this.wrapperWidth/2:t;n=n===undefined?this.wrapperHeight/2:n;r=r===undefined?300:r;t=t+this.wrapperOffset.left-this.x;n=n+this.wrapperOffset.top-this.y;t=t-t*i+this.x;n=n-n*i+this.y;this.scale=e;this.refresh();if(t>0){t=0}else if(t<this.maxScrollX){t=this.maxScrollX}if(n>0){n=0}else if(n<this.maxScrollY){n=this.maxScrollY}this.scrollTo(t,n,r)},_wheelZoom:function(e){var t,r,i=this;clearTimeout(this.wheelTimeout);this.wheelTimeout=setTimeout(function(){i._execEvent("zoomEnd")},400);if("deltaX"in e){t=-e.deltaY/n.abs(e.deltaY)}else if("wheelDeltaX"in e){t=e.wheelDeltaY/n.abs(e.wheelDeltaY)}else if("wheelDelta"in e){t=e.wheelDelta/n.abs(e.wheelDelta)}else if("detail"in e){t=-e.detail/n.abs(e.wheelDelta)}else{return}r=this.scale+t/5;this.zoom(r,e.pageX,e.pageY,0)},_initWheel:function(){i.addEvent(this.wrapper,"wheel",this);i.addEvent(this.wrapper,"mousewheel",this);i.addEvent(this.wrapper,"DOMMouseScroll",this);this.on("destroy",function(){i.removeEvent(this.wrapper,"wheel",this);i.removeEvent(this.wrapper,"mousewheel",this);i.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(e){if(!this.enabled){return}e.preventDefault();e.stopPropagation();var t,r,i,s,o=this;if(this.wheelTimeout===undefined){o._execEvent("scrollStart")}clearTimeout(this.wheelTimeout);this.wheelTimeout=setTimeout(function(){o._execEvent("scrollEnd");o.wheelTimeout=undefined},400);if("deltaX"in e){t=-e.deltaX;r=-e.deltaY}else if("wheelDeltaX"in e){t=e.wheelDeltaX/120*this.options.mouseWheelSpeed;r=e.wheelDeltaY/120*this.options.mouseWheelSpeed}else if("wheelDelta"in e){t=r=e.wheelDelta/120*this.options.mouseWheelSpeed}else if("detail"in e){t=r=-e.detail/3*this.options.mouseWheelSpeed}else{return}t*=this.options.invertWheelDirection;r*=this.options.invertWheelDirection;if(!this.hasVerticalScroll){t=r;r=0}if(this.options.snap){i=this.currentPage.pageX;s=this.currentPage.pageY;if(t>0){i--}else if(t<0){i++}if(r>0){s--}else if(r<0){s++}this.goToPage(i,s);return}i=this.x+n.round(this.hasHorizontalScroll?t:0);s=this.y+n.round(this.hasVerticalScroll?r:0);if(i>0){i=0}else if(i<this.maxScrollX){i=this.maxScrollX}if(s>0){s=0}else if(s<this.maxScrollY){s=this.maxScrollY}this.scrollTo(i,s,0)},_initSnap:function(){this.currentPage={};if(typeof this.options.snap=="string"){this.options.snap=this.scroller.querySelectorAll(this.options.snap)}this.on("refresh",function(){var e=0,t,r=0,i,s,o,u=0,a,f=this.options.snapStepX||this.wrapperWidth,l=this.options.snapStepY||this.wrapperHeight,c;this.pages=[];if(!this.wrapperWidth||!this.wrapperHeight||!this.scrollerWidth||!this.scrollerHeight){return}if(this.options.snap===true){s=n.round(f/2);o=n.round(l/2);while(u>-this.scrollerWidth){this.pages[e]=[];t=0;a=0;while(a>-this.scrollerHeight){this.pages[e][t]={x:n.max(u,this.maxScrollX),y:n.max(a,this.maxScrollY),width:f,height:l,cx:u-s,cy:a-o};a-=l;t++}u-=f;e++}}else{c=this.options.snap;t=c.length;i=-1;for(;e<t;e++){if(e===0||c[e].offsetLeft<=c[e-1].offsetLeft){r=0;i++}if(!this.pages[r]){this.pages[r]=[]}u=n.max(-c[e].offsetLeft,this.maxScrollX);a=n.max(-c[e].offsetTop,this.maxScrollY);s=u-n.round(c[e].offsetWidth/2);o=a-n.round(c[e].offsetHeight/2);this.pages[r][i]={x:u,y:a,width:c[e].offsetWidth,height:c[e].offsetHeight,cx:s,cy:o};if(u>this.maxScrollX){r++}}}this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0);if(this.options.snapThreshold%1===0){this.snapThresholdX=this.options.snapThreshold;this.snapThresholdY=this.options.snapThreshold}else{this.snapThresholdX=n.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold);this.snapThresholdY=n.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold)}});this.on("flick",function(){var e=this.options.snapSpeed||n.max(n.max(n.min(n.abs(this.x-this.startX),1e3),n.min(n.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,e)})},_nearestSnap:function(e,t){if(!this.pages.length){return{x:0,y:0,pageX:0,pageY:0}}var r=0,i=this.pages.length,s=0;if(n.abs(e-this.absStartX)<this.snapThresholdX&&n.abs(t-this.absStartY)<this.snapThresholdY){return this.currentPage}if(e>0){e=0}else if(e<this.maxScrollX){e=this.maxScrollX}if(t>0){t=0}else if(t<this.maxScrollY){t=this.maxScrollY}for(;r<i;r++){if(e>=this.pages[r][0].cx){e=this.pages[r][0].x;break}}i=this.pages[r].length;for(;s<i;s++){if(t>=this.pages[0][s].cy){t=this.pages[0][s].y;break}}if(r==this.currentPage.pageX){r+=this.directionX;if(r<0){r=0}else if(r>=this.pages.length){r=this.pages.length-1}e=this.pages[r][0].x}if(s==this.currentPage.pageY){s+=this.directionY;if(s<0){s=0}else if(s>=this.pages[0].length){s=this.pages[0].length-1}t=this.pages[0][s].y}return{x:e,y:t,pageX:r,pageY:s}},goToPage:function(e,t,r,i){i=i||this.options.bounceEasing;if(e>=this.pages.length){e=this.pages.length-1}else if(e<0){e=0}if(t>=this.pages[e].length){t=this.pages[e].length-1}else if(t<0){t=0}var s=this.pages[e][t].x,o=this.pages[e][t].y;r=r===undefined?this.options.snapSpeed||n.max(n.max(n.min(n.abs(s-this.x),1e3),n.min(n.abs(o-this.y),1e3)),300):r;this.currentPage={x:s,y:o,pageX:e,pageY:t};this.scrollTo(s,o,r,i)},next:function(e,t){var n=this.currentPage.pageX,r=this.currentPage.pageY;n++;if(n>=this.pages.length&&this.hasVerticalScroll){n=0;r++}this.goToPage(n,r,e,t)},prev:function(e,t){var n=this.currentPage.pageX,r=this.currentPage.pageY;n--;if(n<0&&this.hasVerticalScroll){n=0;r--}this.goToPage(n,r,e,t)},_initKeys:function(t){var n={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};var r;if(typeof this.options.keyBindings=="object"){for(r in this.options.keyBindings){if(typeof this.options.keyBindings[r]=="string"){this.options.keyBindings[r]=this.options.keyBindings[r].toUpperCase().charCodeAt(0)}}}else{this.options.keyBindings={}}for(r in n){this.options.keyBindings[r]=this.options.keyBindings[r]||n[r]}i.addEvent(e,"keydown",this);this.on("destroy",function(){i.removeEvent(e,"keydown",this)})},_key:function(e){if(!this.enabled){return}var t=this.options.snap,r=t?this.currentPage.pageX:this.x,s=t?this.currentPage.pageY:this.y,o=i.getTime(),u=this.keyTime||0,a=.25,f;if(this.options.useTransition&&this.isInTransition){f=this.getComputedPosition();this._translate(n.round(f.x),n.round(f.y));this.isInTransition=false}this.keyAcceleration=o-u<200?n.min(this.keyAcceleration+a,50):0;switch(e.keyCode){case this.options.keyBindings.pageUp:if(this.hasHorizontalScroll&&!this.hasVerticalScroll){r+=t?1:this.wrapperWidth}else{s+=t?1:this.wrapperHeight}break;case this.options.keyBindings.pageDown:if(this.hasHorizontalScroll&&!this.hasVerticalScroll){r-=t?1:this.wrapperWidth}else{s-=t?1:this.wrapperHeight}break;case this.options.keyBindings.end:r=t?this.pages.length-1:this.maxScrollX;s=t?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:r=0;s=0;break;case this.options.keyBindings.left:r+=t?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:s+=t?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:r-=t?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:s-=t?1:5+this.keyAcceleration>>0;break;default:return}if(t){this.goToPage(r,s);return}if(r>0){r=0;this.keyAcceleration=0}else if(r<this.maxScrollX){r=this.maxScrollX;this.keyAcceleration=0}if(s>0){s=0;this.keyAcceleration=0}else if(s<this.maxScrollY){s=this.maxScrollY;this.keyAcceleration=0}this.scrollTo(r,s,0);this.keyTime=o},_animate:function(e,t,n,s){function c(){var h=i.getTime(),p,d,v;if(h>=l){o.isAnimating=false;o._translate(e,t);if(!o.resetPosition(o.options.bounceTime)){o._execEvent("scrollEnd")}return}h=(h-f)/n;v=s(h);p=(e-u)*v+u;d=(t-a)*v+a;o._translate(p,d);if(o.isAnimating){r(c)}}var o=this,u=this.x,a=this.y,f=i.getTime(),l=f+n;this.isAnimating=true;c()},handleEvent:function(e){switch(e.type){case"touchstart":case"MSPointerDown":case"mousedown":this._start(e);if(this.options.zoom&&e.touches&&e.touches.length>1){this._zoomStart(e)}break;case"touchmove":case"MSPointerMove":case"mousemove":if(this.options.zoom&&e.touches&&e.touches[1]){this._zoom(e);return}this._move(e);break;case"touchend":case"MSPointerUp":case"mouseup":case"touchcancel":case"MSPointerCancel":case"mousecancel":if(this.scaled){this._zoomEnd(e);return}this._end(e);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(e);break;case"wheel":case"DOMMouseScroll":case"mousewheel":if(this.options.wheelAction=="zoom"){this._wheelZoom(e);return}this._wheel(e);break;case"keydown":this._key(e);break}}};u.prototype={handleEvent:function(e){switch(e.type){case"touchstart":case"MSPointerDown":case"mousedown":this._start(e);break;case"touchmove":case"MSPointerMove":case"mousemove":this._move(e);break;case"touchend":case"MSPointerUp":case"mouseup":case"touchcancel":case"MSPointerCancel":case"mousecancel":this._end(e);break}},destroy:function(){if(this.options.interactive){i.removeEvent(this.indicator,"touchstart",this);i.removeEvent(this.indicator,"MSPointerDown",this);i.removeEvent(this.indicator,"mousedown",this);i.removeEvent(e,"touchmove",this);i.removeEvent(e,"MSPointerMove",this);i.removeEvent(e,"mousemove",this);i.removeEvent(e,"touchend",this);i.removeEvent(e,"MSPointerUp",this);i.removeEvent(e,"mouseup",this)}if(this.options.defaultScrollbars){this.wrapper.parentNode.removeChild(this.wrapper)}},_start:function(t){var n=t.touches?t.touches[0]:t;t.preventDefault();t.stopPropagation();this.transitionTime();this.initiated=true;this.moved=false;this.lastPointX=n.pageX;this.lastPointY=n.pageY;this.startTime=i.getTime();if(!this.options.disableTouch){i.addEvent(e,"touchmove",this)}if(!this.options.disablePointer){i.addEvent(e,"MSPointerMove",this)}if(!this.options.disableMouse){i.addEvent(e,"mousemove",this)}this.scroller._execEvent("beforeScrollStart")},_move:function(e){var t=e.touches?e.touches[0]:e,n,r,s,o,u=i.getTime();if(!this.moved){this.scroller._execEvent("scrollStart")}this.moved=true;n=t.pageX-this.lastPointX;this.lastPointX=t.pageX;r=t.pageY-this.lastPointY;this.lastPointY=t.pageY;s=this.x+n;o=this.y+r;this._pos(s,o);e.preventDefault();e.stopPropagation()},_end:function(t){if(!this.initiated){return}this.initiated=false;t.preventDefault();t.stopPropagation();i.removeEvent(e,"touchmove",this);i.removeEvent(e,"MSPointerMove",this);i.removeEvent(e,"mousemove",this);if(this.scroller.options.snap){var r=this.scroller._nearestSnap(this.scroller.x,this.scroller.y);var s=this.options.snapSpeed||n.max(n.max(n.min(n.abs(this.scroller.x-r.x),1e3),n.min(n.abs(this.scroller.y-r.y),1e3)),300);if(this.scroller.x!=r.x||this.scroller.y!=r.y){this.scroller.directionX=0;this.scroller.directionY=0;this.scroller.currentPage=r;this.scroller.scrollTo(r.x,r.y,s,this.scroller.options.bounceEasing)}}if(this.moved){this.scroller._execEvent("scrollEnd")}},transitionTime:function(e){e=e||0;this.indicatorStyle[i.style.transitionDuration]=e+"ms";if(!e&&i.isBadAndroid){this.indicatorStyle[i.style.transitionDuration]="0.001s"}},transitionTimingFunction:function(e){this.indicatorStyle[i.style.transitionTimingFunction]=e},refresh:function(){this.transitionTime();if(this.options.listenX&&!this.options.listenY){this.indicatorStyle.display=this.scroller.hasHorizontalScroll?"block":"none"}else if(this.options.listenY&&!this.options.listenX){this.indicatorStyle.display=this.scroller.hasVerticalScroll?"block":"none"}else{this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none"}if(this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll){i.addClass(this.wrapper,"iScrollBothScrollbars");i.removeClass(this.wrapper,"iScrollLoneScrollbar");if(this.options.defaultScrollbars&&this.options.customStyle){if(this.options.listenX){this.wrapper.style.right="8px"}else{this.wrapper.style.bottom="8px"}}}else{i.removeClass(this.wrapper,"iScrollBothScrollbars");i.addClass(this.wrapper,"iScrollLoneScrollbar");if(this.options.defaultScrollbars&&this.options.customStyle){if(this.options.listenX){this.wrapper.style.right="2px"}else{this.wrapper.style.bottom="2px"}}}var e=this.wrapper.offsetHeight;if(this.options.listenX){this.wrapperWidth=this.wrapper.clientWidth;if(this.options.resize){this.indicatorWidth=n.max(n.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8);this.indicatorStyle.width=this.indicatorWidth+"px"}else{this.indicatorWidth=this.indicator.clientWidth}this.maxPosX=this.wrapperWidth-this.indicatorWidth;if(this.options.shrink=="clip"){this.minBoundaryX=-this.indicatorWidth+8;this.maxBoundaryX=this.wrapperWidth-8}else{this.minBoundaryX=0;this.maxBoundaryX=this.maxPosX}this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX}if(this.options.listenY){this.wrapperHeight=this.wrapper.clientHeight;if(this.options.resize){this.indicatorHeight=n.max(n.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8);this.indicatorStyle.height=this.indicatorHeight+"px"}else{this.indicatorHeight=this.indicator.clientHeight}this.maxPosY=this.wrapperHeight-this.indicatorHeight;if(this.options.shrink=="clip"){this.minBoundaryY=-this.indicatorHeight+8;this.maxBoundaryY=this.wrapperHeight-8}else{this.minBoundaryY=0;this.maxBoundaryY=this.maxPosY}this.maxPosY=this.wrapperHeight-this.indicatorHeight;this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY}this.updatePosition()},updatePosition:function(){var e=this.options.listenX&&n.round(this.sizeRatioX*this.scroller.x)||0,t=this.options.listenY&&n.round(this.sizeRatioY*this.scroller.y)||0;if(!this.options.ignoreBoundaries){if(e<this.minBoundaryX){if(this.options.shrink=="scale"){this.width=n.max(this.indicatorWidth+e,8);this.indicatorStyle.width=this.width+"px"}e=this.minBoundaryX}else if(e>this.maxBoundaryX){if(this.options.shrink=="scale"){this.width=n.max(this.indicatorWidth-(e-this.maxPosX),8);this.indicatorStyle.width=this.width+"px";e=this.maxPosX+this.indicatorWidth-this.width}else{e=this.maxBoundaryX}}else if(this.options.shrink=="scale"&&this.width!=this.indicatorWidth){this.width=this.indicatorWidth;this.indicatorStyle.width=this.width+"px"}if(t<this.minBoundaryY){if(this.options.shrink=="scale"){this.height=n.max(this.indicatorHeight+t*3,8);this.indicatorStyle.height=this.height+"px"}t=this.minBoundaryY}else if(t>this.maxBoundaryY){if(this.options.shrink=="scale"){this.height=n.max(this.indicatorHeight-(t-this.maxPosY)*3,8);this.indicatorStyle.height=this.height+"px";t=this.maxPosY+this.indicatorHeight-this.height}else{t=this.maxBoundaryY}}else if(this.options.shrink=="scale"&&this.height!=this.indicatorHeight){this.height=this.indicatorHeight;this.indicatorStyle.height=this.height+"px"}}this.x=e;this.y=t;if(this.scroller.options.useTransform){this.indicatorStyle[i.style.transform]="translate("+e+"px,"+t+"px)"+this.scroller.translateZ}else{this.indicatorStyle.left=e+"px";this.indicatorStyle.top=t+"px"}},_pos:function(e,t){if(e<0){e=0}else if(e>this.maxPosX){e=this.maxPosX}if(t<0){t=0}else if(t>this.maxPosY){t=this.maxPosY}e=this.options.listenX?n.round(e/this.sizeRatioX):this.scroller.x;t=this.options.listenY?n.round(t/this.sizeRatioY):this.scroller.y;this.scroller.scrollTo(e,t)},fade:function(e,t){if(t&&!this.visible){return}clearTimeout(this.fadeTimeout);this.fadeTimeout=null;var n=e?250:500,r=e?0:300;e=e?"1":"0";this.wrapperStyle[i.style.transitionDuration]=n+"ms";this.fadeTimeout=setTimeout(function(e){this.wrapperStyle.opacity=e;this.visible=+e}.bind(this,e),r)}};s.utils=i;if(typeof module!="undefined"&&module.exports){module.exports=s}else{e.IScroll=s}})(window,document,Math)
