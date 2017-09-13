const dirty = require('dirty');
const db = dirty('chats.db');

function initializeDatabase() {
	if (!db.get('rooms')) {
		db.set('rooms', ['room1']);
		db.set('room1', []);
	}
}

db.on('load', function() {
	initializeDatabase();
});

function listRooms() {
	return db.get('rooms');
}

function saveLine(author, msg, roomName) {
	console.log ("Saving",author,msg);
	db.update(roomName, oldRoom => {
		let chatline = { author, msg };
		oldRoom.push(chatline);
		return oldRoom;
	});
}

function loadRoom(roomName) {
	const data = db.get(roomName);
	console.log("Loading", data);
	return data;
}

module.exports = {
	saveLine, 
	loadRoom,
	listRooms,
};