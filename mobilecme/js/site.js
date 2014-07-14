function offCanvas () {
	if ($("#sidebar").position().left < -1.0) {
	//          $(".row-offcanvas .sidebar-offcanvas").css('visibility', 'visible');
		$('.row-offcanvas').toggleClass('active');
	} else {
		$('.row-offcanvas').removeClass('active');
	//          $(".row-offcanvas .sidebar-offcanvas").css('visibility', 'hidden');
	}
}

$(document).ready(function () {

    $(document).on('click','.selection-list li',function(event){
        event.preventDefault();
        var selectionlist = $(this).parent();
        console.log("this",$(this),selectionlist);

        if ($( selectionlist ).hasClass('single')) {

            $( selectionlist ).find('li').removeClass('selected');
            $(this).addClass('selected');
            var listtype = $( selectionlist ).data( "listview-type" );
            var listtext = $(this).text();

            Cookies(listtype, undefined);
            Cookies.set(listtype, listtext, { expires: 600 });

        } else if ($( selectionlist ).hasClass('single-result')) {
            $( selectionlist ).find('li').removeClass('selectedresult');

            $(this).addClass('selectedresult');
            var listtype = $( selectionlist ).data( "listview-type" );
            var listtext = $(this).find('p').text();

            $($( selectionlist ).find('li')).each( function(i, ele) {
                var getprecent = parseInt($(this).find('.choice-percent').text());
                if (getprecent >= 100) {
                    $(this).find('.color-fill').addClass('percent-fill')
                };
                $(this).find('.color-fill')
                    .stop().addClass('color-animate')
                    .css('height', ($(this).outerHeight() - 2)+'px')
                    .animate({width: getprecent+'%'}, 300);
                $(this).find('.choice-percent').show();

                Cookies(listtype, undefined);
                Cookies.set(listtype, listtext, { expires: 600 });
            });

        }
        else {
            $(this).addClass('selected');
        }
    });


	$('#footerModal').on('show.bs.modal', function (e) {
		var container = $(e.currentTarget).attr('id');
		$.get( $(e.relatedTarget).attr('href'), function( data ) {
		  $( "#"+container + " .modal-content").html( data );
		});
	});
});
