$(document).ready(function () {
	$('[data-toggle="offcanvas"]').click(function (event) {
		event.preventDefault();
		if ($("#sidebar").position().left < -1.0) {
			$('.row-offcanvas').toggleClass('active');
		} else {
			$('.row-offcanvas').removeClass('active');
		}
	});
});
