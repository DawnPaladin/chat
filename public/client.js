var username;
$('#username').on('change', function(e) {
	username = $(this).val();
	console.log(username);
});

var socket = io.connect('http://localhost:3030');
socket.emit('connect');
socket.on('message', function(message) {
	$('#room1').append('<p>' + message + '</p>');
});

$('#send-btn').on('click', function() {
	var message = $('#input-line').val();
	console.log("Transmitting", message, socket);
	socket.emit('message', message);
});