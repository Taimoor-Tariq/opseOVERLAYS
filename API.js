const fs = require('fs');
const request = require('request-promise');

global.gameData = {};

fs.readFile(`./allGames.json`, function (err, data) {
	var json = JSON.parse(data);
	global.gameData = json;
});

exports.saveResult = (key, res) => {
	try {
		global.gameData[key].no_of_games++;
		global.gameData[key].games.push(res);
	}
	catch (e) {
		global.gameData[key] = {
			no_of_games: 1,
			games: [res]
		};
	}

	fs.writeFile(`./allGames.json`, JSON.stringify(global.gameData, null, 4), (err) => {if (err) throw err});
}

exports.getResult = key => {return global.gameData[key]}