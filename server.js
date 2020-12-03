const express = require("express");
const bodyParser = require('body-parser')
const request = require('request-promise');
const fs = require("fs");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var port = 3000;

function removeUser(a, b) {
	var ans = [];
	for (var i in a) if (a[i] != b) ans.push(a[i]);

	return ans;
}

global.connectedUsers = [];
global.gamesInfo = {
	eventInfo: {
		team1: "",
		team2: "",
		team1_abbr: "",
		team2_abbr: "",
		team1_logo: "",
        team2_logo: "",
        team1_logo2: "",
		team2_logo2: "",
		team1_score: "",
		team2_score: "",
		team1_color1: "",
		team2_color1: "",
		team1_color2: "",
		team2_color2: "",
	},
	actions: [[{completed:true}]],
	timer: {},
	team1: {
		player1: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player2: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player3: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player4: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player5: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		bans: ["", "", "", "", ""]
	},
	team2: {
		player1: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player2: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player3: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player4: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		player5: {
			summonerId: "",
			summonerName: "",
			summonerIconId: "",
			summonerLevel: "",
			champID: "",
			summonerSpellID: ["", ""],
			champSkinID: ""
		},
		bans: ["", "", "", "", ""]
	}
};
global.latestPatch = "";
global.champIDs = [];

global.activeCodes = {
	// "NA04876-e3e3e4c4-5ee0-49c2-a139-f661f868b66e": "101 116 Test"
};

request("https://ddragon.leagueoflegends.com/api/versions.json").then(body => { global.latestPatch = JSON.parse(body)[0] });

request("http://ddragon.leagueoflegends.com/cdn/10.21.1/data/en_US/champion.json").then(body => {
	body = JSON.parse(body).data;
	for (var i in body) global.champIDs.push(body[i].key);
});

app.use(
	express.urlencoded({
	  	extended: true
	})
);
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(require("./urlLinks"));

io.on('connection', function(socket) {
	const address = socket.handshake.headers['x-forwarded-for'].split(",")[0];
	console.log(` -> ${socket.id} connected from ${address}`);
	global.connectedUsers.push(socket.id);
	io.emit('opseUpdateData', global.gamesInfo.eventInfo);

	socket.on('getLatestPatch', () => {	socket.emit('setLatestPatch', global.latestPatch, global.champIDs) });

	socket.on('getInfo', () => { socket.emit('giveInfo', global.gamesInfo) })
	socket.on('getOpseInfo', () => { socket.emit('opseOverlayInfo', global.gamesInfo.eventInfo, global.activeCodes); });
	socket.on('changeOPSElayout', data => {
		socket.broadcast.emit('opseLayoutUpdate', data);
		let delay = 300;
		if (data == "nolb") delay = 0;
		setTimeout(() => {
			socket.broadcast.emit('opseLayoutUpdate2', data);
		}, delay);
	});

	socket.on('updatePickInfo', info => {
		global.gamesInfo.timer = info.timer;
		global.gamesInfo.team1 = info.team1;
		global.gamesInfo.team2 = info.team2;
		global.gamesInfo.actions = info.actions;
	});

    socket.on('opseOverlayUpdate', data => {
		global.gamesInfo.eventInfo = data;
		socket.broadcast.emit('opseUpdateData', data);
	});
	
	socket.on('togglePick', s => {
		switch (s) {
			case 0:
				socket.broadcast.emit('refreshPage');

			case true:
				socket.broadcast.emit('animateIn');
				break;

			case false:
				socket.broadcast.emit('animateOut');
				break;	

			default:
				break;
		}
	});

	socket.on('clientToggleOverlay-send', data => { socket.broadcast.emit('clientToggleOverlay', data) });
	socket.on('triggerSequence', data => { socket.broadcast.emit('playSequence', data) });
	socket.on('updateSkybox-send', data => { socket.broadcast.emit('updateSkybox', data) });
	socket.on('setBaron-send', (time, home) => { socket.broadcast.emit('setBaron', time, home) });
	socket.on('setElder-send', (time, home) => { socket.broadcast.emit('setElder', time, home) });
	socket.on('changeChampMusic-send', data => { socket.broadcast.emit('changeChampMusic', data) });
	socket.on('playChampMusic-send', data => { socket.broadcast.emit('playChampMusic', data) });
	socket.on('toggleChamps-send', data => { socket.broadcast.emit('toggleChamps', data) });
	socket.on('timerPaused-send', data => { socket.broadcast.emit('timerPaused', data) });
	socket.on('hideAllUI-send', data => { socket.broadcast.emit('hideAllUI', data) });
	socket.on('setupUI-send', () => { socket.broadcast.emit('setupUI') });
	
	socket.on('saveImage', (name, data) => {
		let base64Data = data.replace(/^data:image\/png;base64,/, "");
		fs.writeFile(`./public/siteImages/${name}`, base64Data, 'base64', (err) => {if (err) console.log(err)});
	});

	socket.on('makeCode', () => {
		let body = {
			"mapType": "SUMMONERS_RIFT",
			"metadata": "123 321 ABC",
			"pickType": "TOURNAMENT_DRAFT",
			"spectatorType": "ALL",
			"teamSize": 5
		}

		request.post("https://americas.api.riotgames.com/lol/tournament/v4/codes?count=1&tournamentId=1851519", body).then(body => {
			let code = JSON.parse(body)[0];
			console.log(code);
			socket.emit('sendCode', code)
		});
	});

    socket.on('serverRestart', (pass) => {
        if (pass == "5524278") {
            console.log(`Server Stopping`);
            process.exit(1);
        }
	});

	socket.on('disconnect', function(){
		console.log(` <- ${socket.id} disconnected`);
		global.connectedUsers = removeUser(global.connectedUsers, socket.id);
	});
});

server.listen(port, function () {
	console.info('Server listening at port %d', port);
});

// setInterval(() => {
// 	console.log(global.gamesInfo)
// }, 1000);