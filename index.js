const express = require('express');
const app = express();
const socket = require('socket.io');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.listen(3030, function() {
	console.log("Listening on port 3030");
});