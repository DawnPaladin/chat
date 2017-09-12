const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

var clients = {};

io.on('connect', (socket) => {
	console.log(socket.id);
	socket.on('message', message => {
		console.log("Message:", message);
		io.emit('message', message);
	});
	socket.on('set username', username => {
		clients[socket.id] = username;
		io.emit('users updated', listClients());
	})
	socket.on('disconnect', function() {
		delete clients[socket.id];
		console.log("disconnected");
		io.emit('users updated', listClients());
	})
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
