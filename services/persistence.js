const dirty = require('dirty');
const db = dirty('chats.db');

db.on('load', function() {
	var room1 = loadRoom() || [];
	db.set('room1', room1);
});

function saveLine(author, msg) {
	console.log ("Saving",author,msg);
	db.update('room1', oldRoom => {
		let chatline = { author, msg };
		oldRoom.push(chatline);
		return oldRoom;
	});
}

function loadRoom() {
	const data = db.get('room1');
	console.log("Loading", data);
	return data;
}

module.exports = {
	saveLine, 
	loadRoom,
};