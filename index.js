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
	let username = "anonymous";
	clients[socket.id] = username;	
	io.emit('users updated', listClients());
	socket.emit('backscroll', persistence.loadRoom());
	socket.on('message', message => {
		console.log(username + ': ' + message);
		persistence.saveLine(username, message);
		io.emit('message', formatMessage(username, message));
	});
	socket.on('set username', newUsername => {
		clients[socket.id] = username = newUsername;
		io.emit('users updated', listClients());
	});
	socket.on('disconnect', function() {
		delete clients[socket.id];
		console.log("disconnected");
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
