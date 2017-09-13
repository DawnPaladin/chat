const searchParams = new URLSearchParams(window.location.search);
var currentRoom = searchParams.get('room');
if (!currentRoom) {
	currentRoom = 'room1';
	searchParams.set('room', currentRoom);
	window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
}

var socket = io.connect({query: "room=" + currentRoom});

socket.emit('connect', currentRoom);
$('#room-name').text(currentRoom);

socket.on('backscroll', function(backscroll) {
	console.log('backscroll', backscroll);
	const formatted = backscroll.map(line => formatMessage(line.author, line.msg));
	formatted.forEach(line => {
		$('#chat-room').append(line);
	});
});

socket.on('rooms list', function(roomsList) {
	console.log('rooms list', roomsList);
	$('#rooms-list').empty();
	roomsList.forEach(function(room) {
		$('#rooms-list').append(`<li><a id='room-${room}-link' href='?room=${room}'>${room}</li>`);
	});
	$(`#room-${currentRoom}-link`).addClass('current-room-link');
});

socket.on('message', function(message) {
	$('#chat-room').append(message);
});
socket.on('users updated', function(users) {
	console.log(users);
	$('#users-list').empty();
	users.forEach(function(user) {
		$('#users-list').append('<li>' + user + '</li>');
	});
});

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

$('#create-room-btn').on('click', function() {
	const roomName = window.prompt("What should the room be named?");
	socket.emit('create room', roomName);
});

const formatMessage = (author, msg) => `<p class='chatline'><span class='chatline-author'>${author}:</span> ${msg}`;
