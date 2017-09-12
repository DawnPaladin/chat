const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on('connect', (client) => {
	console.log("Connected");
	client.on('message', message => {
		console.log("Message:", message);
		io.emit('message', message);
	});
});

server.listen(3030, function() {
	console.log("Listening on port 3030");
});
