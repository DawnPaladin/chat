var socket = io.connect();
socket.emit('connect');

socket.on('backscroll', function(backscroll) {
	console.log('backscroll', backscroll);
	const formatted = backscroll.map(line => formatMessage(line.author, line.msg));
	formatted.forEach(line => {
		$('#room1').append(line);
	})
});

socket.on('rooms list', function(roomsList) {
	console.log('rooms list', roomsList);
	$('#rooms-list').empty();
	roomsList.forEach(function(room) {
		$('#rooms-list').append("<li>" + room + "</li>");
	})
});

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

const formatMessage = (author, msg) => `<p class='chatline'><span class='chatline-author'>${author}:</span> ${msg}`;
