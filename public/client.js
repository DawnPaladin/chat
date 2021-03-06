var searchParams = new URLSearchParams(window.location.search);
var currentRoom = searchParams.get('room');
if (!currentRoom) {
	currentRoom = 'room1';
	searchParams.set('room', currentRoom);
	window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
}

var username;
var usernameFromCookie = readUsernameCookie();
if (usernameFromCookie) {
	username = usernameFromCookie;
	$('#username').val(username);
} else {
	username = "anonymous";
}

var socket = io.connect({query: "room=" + currentRoom + '&user=' + username});

socket.emit('connect', currentRoom);
$('#room-name').text(currentRoom);

socket.on('backscroll', function(backscroll) {
	var formatted = backscroll.map(line => formatMessage(line.author, line.msg));
	formatted.forEach(line => {
		$('#chat-room').append(line);
	});
});

socket.on('rooms list', function(roomsList) {
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
	$('#users-list').empty();
	users.forEach(function(user) {
		$('#users-list').append('<li>' + user + '</li>');
	});
});

$('#send-btn').on('click', function() {
	var message = $('#input-line').val();
	socket.emit('message', message);
	$('#input-line').val('');
});

$('#username').on('change', function(e) {
	username = $(this).val();
	socket.emit('set username', username);
	setUsernameCookie(username);
});

$('#create-room-btn').on('click', function() {
	var roomName = window.prompt("What should the room be named?");
	socket.emit('create room', roomName);
});

var formatMessage = (author, msg) => `<p class='chatline'><span class='chatline-author'>${author}:</span> ${msg}`;

function setUsernameCookie(name) {
	var daysToExpiration = 7;
	var expirationDate = new Date();
	expirationDate.setTime(expirationDate.getTime() + (daysToExpiration * 24 * 60 * 60 * 1000));

	document.cookie = `username=${name}; expires=${expirationDate.toGMTString()}; path=/`;
}

function readUsernameCookie() {
	return document.cookie.split('=')[1];
}