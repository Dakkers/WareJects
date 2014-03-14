
$(document).ready(function () {

	$("#btn-proj").click(function() {
		/*Projects button is clicked, Projects is opened.*/
		window.open('index.html', '_blank');
	});

	$(".btn-home").click(function() {
		/*About, Login/Sign Up or Import/Export button is clicked.
		Makes the Home page fade out and the specified page fade in.*/
		var id = "#"+ $(this).attr('id').replace("btn-", "");  //e.g. btn-about --> #about
		$("#home").fadeOut(300, function() {
			$(id).fadeIn(300);
		});
	});

	$(".btn-ETphonehome").click(function() {
		/*Any Home button is pressed. Makes current page fade out, Home fade in.*/
		var id = "#"+ $(this).parent().attr('id');
		$(id).fadeOut(300, function() {
			$("#home").fadeIn(300);
		});
	});


	$('#btn-git').click(function(){
		/*The GitHub button is pressed, takes user to the repo.*/
		window.open('https://github.com/StDako/WareJects', "_blank");
	});

});