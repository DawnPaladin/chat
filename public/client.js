var socket = io.connect();
socket.emit('connect');
socket.on('message', function(message) {
	$('#room1').append(message);
});
socket.on('users updated', function(users) {
	console.log(users);
	$('#users-list').empty();
	users.forEach(function(user) {
		$('#users-list').append('<li>' + user + '</li>');
	});
})

$('#send-btn').on('click', function() {
	var message = $('#input-line').val();
	console.log("Transmitting", message, socket);
	socket.emit('message', message);
});

var username;
$('#username').on('change', function(e) {
	username = $(this).val();
	console.log(username);
	socket.emit('set username', username);
});
