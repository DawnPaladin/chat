const defaultRoom = "room1";

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const persistence = require('./services/persistence');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

var clients = {};

io.on('connect', (socket) => {
	var roomName = socket.handshake.query.room;
	if (roomName == "null") roomName = defaultRoom;
	var username = socket.handshake.query.user;
	if (username == undefined) username = "anonymous";
	console.log("user:", username);
	clients[socket.id] = username;	
	io.emit('users updated', listClients());
	let roomsList = persistence.listRooms();
	socket.emit('backscroll', persistence.loadRoom(roomName));
	socket.emit('rooms list', roomsList);
	socket.on('message', message => {
		persistence.saveLine(username, message, roomName);
		io.emit('message', formatMessage(username, message));
	});
	socket.on('set username', newUsername => {
		clients[socket.id] = username = newUsername;
		io.emit('users updated', listClients());
	});
	socket.on('create room', roomName => {
		persistence.createRoom(roomName);
		roomsList = persistence.listRooms();
		io.emit('rooms list', roomsList);
	});
	socket.on('disconnect', function() {
		delete clients[socket.id];
		io.emit('users updated', listClients());
	});
});

server.listen(3030, function() {
	console.log("Listening on port 3030");
});

function listClients() {
	var names = [];
	for (var socketId in clients) {
		names.push(clients[socketId]);
	}
	return names;
}

const formatMessage = (author, msg) => `<p class='chatline'><span class='chatline-author'>${author}:</span> ${msg}`;
