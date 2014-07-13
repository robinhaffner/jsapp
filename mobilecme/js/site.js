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
	$('#footerModal').on('show.bs.modal', function (e) {
		var container = $(e.currentTarget).attr('id');
		$.get( $(e.relatedTarget).attr('href'), function( data ) {
		  $( "#"+container + " .modal-content").html( data );
		});
	});
});
