var socket = io();

const body = document.getElementById('body');

const action_cells = [["ban1_1", 0],["ban2_1", 180],["ban1_2", 0],["ban2_2", 180],["ban1_3", 0],["ban2_3", 180],["pick1_1", 0],["pick2_1", 180],["pick2_2", 180],["pick1_2", 0],["pick1_3", 0],["pick2_3", 180],["ban2_4", 180],["ban1_4", 0],["ban2_5", 180],["ban1_5", 0],["pick2_4", 180],["pick1_4", 0],["pick1_5", 0],["pick2_5", 180]];
const single_action_cells = [["ban1_1", 0],["ban1_2", 180],["ban1_3", 0],["pick1_1", 0]];
const imageNames = {square: "square",tile: "tile",portrait: "portrait",splash: "splash-art",splash_center: "splash-art/centered"}
const imageNamesSkins = {tile_skin: "tile/skin",portrait_skin: "portrait/skin",splash_skin: "splash-art/skin",splash_center_skin: "splash-art/centered/skin",}
const teamStyles = {bgcolor: "backgroundColor",fontcolor: "color"}
const activeClasses = ["ban", "pick"];

let patch = "10.19.1";
let uiState = false;
let champState = false;

// https://cdn.communitydragon.org/10.19.1/champion/89/tile
// https://cdn.communitydragon.org/10.19.1/champion/89/tile/skin/11

// https://cdn.communitydragon.org/10.19.1/champion/generic/square
// https://cdn.communitydragon.org/10.19.1/champion/89/square

// https://cdn.communitydragon.org/10.19.1/champion/89/portrait
// https://cdn.communitydragon.org/10.19.1/champion/89/portrait/skin/11

// https://cdn.communitydragon.org/10.19.1/champion/89/splash-art
// https://cdn.communitydragon.org/10.19.1/champion/89/splash-art/skin/11

// https://cdn.communitydragon.org/10.19.1/champion/89/splash-art/centered
// https://cdn.communitydragon.org/10.19.1/champion/89/splash-art/centered/skin/11

// https://cdn.communitydragon.org/10.19.1/champion/89/champ-select/sounds/ban
// https://cdn.communitydragon.org/10.19.1/champion/89/champ-select/sounds/choose

// https://cdn.communitydragon.org/10.19.1/profile-icon/50
// https://cdn.communitydragon.org/10.19.1/profile-icon/4673

String.prototype.format = function () {
	var a = this;
	for (var k in arguments) {
		a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
	}
	return a
}

function getPatch() { socket.emit('getLatestPatch') };

socket.on('setLatestPatch', (p, cid) => {
	patch = p;

	// for (var i in cid) {
	// 	document.getElementById('testDiv').innerHTML += `<img src="https://cdn.communitydragon.org/${patch}/champion/${cid[i]}/portrait">`;
	// 	document.getElementById('testDiv').innerHTML += `<img src="https://cdn.communitydragon.org/${patch}/champion/${cid[i]}/square">`;
	// 	document.getElementById('testDiv').innerHTML += `<img src="https://cdn.communitydragon.org/${patch}/champion/${cid[i]}/splash-art">`;
	// 	document.getElementById('testDiv').innerHTML += `<img src="https://cdn.communitydragon.org/${patch}/champion/${cid[i]}/splash-art/centered">`;
	// }
});

function playChampMusic(play) {
	if (play) {
		document.getElementById('champSelect_player').load();
		$("#champSelect_player").currentTime = 0;
		document.getElementById('champSelect_player').play();
		$("#champSelect_player").animate({volume: 0.05}, 1000);
	}
	else {
		$("#champSelect_player").animate({volume: 0}, 1000);
	}
}

socket.on('playChampMusic', state => { playChampMusic(state) });
socket.on('changeChampMusic', music => {
	document.getElementById('champSelect_player').innerHTML = `<source id="champSelect_player_src" src="${music}" type="audio/mp3">`;
});

async function opseAnimateIn() {
	uiState = true;
	let center_info = document.getElementById('center_info');
	let team1_container = document.getElementById('team1_container');
	let team2_container = document.getElementById('team2_container');
	let team1_ban_container = document.getElementById('team1_ban_container');
	let team2_ban_container = document.getElementById('team2_ban_container');

	center_info.style.bottom = "0px";
	team1_container.style.bottom = "0px";
	team2_container.style.bottom = "0px";

	setTimeout(() => {
		team1_container.style.width = "39%";
		team2_container.style.width = "39%";
	}, 200);

	setTimeout(() => {
		team1_container.style.right = "57%";
		team2_container.style.left = "57%";
	}, 600);

	if (champState) {
		setTimeout(() => {
			team1_ban_container.style.height = "5%";
			team2_ban_container.style.height = "5%";
		}, 1300);
	}
}

async function opseAnimateOut() {
	uiState = false;
	let center_info = document.getElementById('center_info');
	let team1_container = document.getElementById('team1_container');
	let team2_container = document.getElementById('team2_container');
	let team1_ban_container = document.getElementById('team1_ban_container');
	let team2_ban_container = document.getElementById('team2_ban_container');

	team1_ban_container.style.height = "0px";
	team2_ban_container.style.height = "0px";
	
	let delay1 = 0;
	let delay2 = 400;

	if (champState) {
		delay1 = 1000;
		delay2 = 1400;
	}

	setTimeout(() => {
		team1_container.style.right = "50%";
		team2_container.style.left = "50%";
		team1_container.style.width = "0px";
		team2_container.style.width = "0px";
	}, delay1);
	
	setTimeout(() => {
		center_info.style.bottom = "-22%";
		team1_container.style.bottom = "-22%";
		team2_container.style.bottom = "-22%";
	}, delay2);
}

socket.on('refreshPage', () => {location.reload()});
socket.on('animateIn', () => {opseAnimateIn()});
socket.on('animateOut', () => {opseAnimateOut()});

socket.on('toggleChamps', state => {
	champState = state;
	if (state) {
		if (uiState) {
			document.getElementById('team1_ban_container').style.height = "5%";
			document.getElementById('team2_ban_container').style.height = "5%";
		}
		
		document.getElementsByClassName("teams_display_holder")[0].classList.add("hidden");
		document.getElementsByClassName("teams_display_holder")[1].classList.add("hidden");

		document.getElementById("team1_logo").classList.remove("hidden");
		document.getElementById("team2_logo").classList.remove("hidden");
		document.getElementById("team1_name").classList.remove("hidden");
		document.getElementById("team2_name").classList.remove("hidden");
		document.getElementById("team1_score").classList.add("hidden");
		document.getElementById("team2_score").classList.add("hidden");
		document.getElementById("vs").classList.add("hidden");

		setTimeout(() => {
			document.getElementById("team1_container").children[5].classList.remove("hidden");
			document.getElementById("team2_container").children[1].classList.remove("hidden");
		}, 200);

		setTimeout(() => {
			document.getElementById("team1_container").children[4].classList.remove("hidden");
			document.getElementById("team2_container").children[2].classList.remove("hidden");
		}, 300);

		setTimeout(() => {
			document.getElementById("team1_container").children[3].classList.remove("hidden");
			document.getElementById("team2_container").children[3].classList.remove("hidden");
		}, 400);

		setTimeout(() => {
			document.getElementById("team1_container").children[2].classList.remove("hidden");
			document.getElementById("team2_container").children[4].classList.remove("hidden");
		}, 500);

		setTimeout(() => {
			document.getElementById("team1_container").children[1].classList.remove("hidden");
			document.getElementById("team2_container").children[5].classList.remove("hidden");
		}, 600);
	}
	else {
		document.getElementById('team1_ban_container').style.height = "0px";
		document.getElementById('team2_ban_container').style.height = "0px";

		document.getElementById("team1_logo").classList.add("hidden");
		document.getElementById("team2_logo").classList.add("hidden");
		document.getElementById("team1_name").classList.add("hidden");
		document.getElementById("team2_name").classList.add("hidden");
		document.getElementById("team1_score").classList.remove("hidden");
		document.getElementById("team2_score").classList.remove("hidden");

		document.getElementById("team1_container").children[1].classList.add("hidden");
		document.getElementById("team2_container").children[5].classList.add("hidden");

		setTimeout(() => {
			document.getElementById("team1_container").children[2].classList.add("hidden");
			document.getElementById("team2_container").children[4].classList.add("hidden");
		}, 100);

		setTimeout(() => {
			document.getElementById("team1_container").children[3].classList.add("hidden");
			document.getElementById("team2_container").children[3].classList.add("hidden");
		}, 200);

		setTimeout(() => {
			document.getElementById("team1_container").children[4].classList.add("hidden");
			document.getElementById("team2_container").children[2].classList.add("hidden");
		}, 300);

		setTimeout(() => {
			document.getElementById("team1_container").children[5].classList.add("hidden");
			document.getElementById("team2_container").children[1].classList.add("hidden");
		}, 400);

		setTimeout(() => {
			document.getElementsByClassName("teams_display_holder")[0].classList.remove("hidden");
            document.getElementsByClassName("teams_display_holder")[1].classList.remove("hidden");
            document.getElementById("vs").classList.remove("hidden");
		}, 400);
	}
});

socket.on('giveInfo', info => {
	let champselectCompleted = info.actions[info.actions.length-1][0].completed;
	let cID = info.actions[info.actions.length-1][0].id;

    for (var i in info.actions) {
        if (!info.actions[i][0].completed) {
            cID = info.actions[i][0].id;
            break;
        }
    }

	var singlePayer = true;
	if (info.team2.player1.summonerId != "") singlePayer = false;


	for (var a in activeClasses) for (var i=1; i<3; i++) for (var j=1; j<6; j++) for (var k=0; k<document.getElementsByClassName(`${activeClasses[a]}${i}_${j}`).length; k++) document.getElementsByClassName(`${activeClasses[a]}${i}_${j}`)[k].classList.remove("active-pick");	
	if (!champselectCompleted) {
		try {document.getElementById('indicator').style.opacity = 1;} catch (e) {}
		var cTurn, cIndicator;

		if (singlePayer) {cTurn = single_action_cells[cID-1][0];cIndicator = single_action_cells[cID-1][1];}
		else {cTurn = action_cells[cID-1][0];cIndicator = action_cells[cID-1][1];}

		if (cIndicator == 0) document.getElementById('indicator').style.transform = `rotate(${cIndicator}deg) translate(-50%,0px)`;
		else document.getElementById('indicator').style.transform = `rotate(${cIndicator}deg) translate(50%,0px)`;
		
		for (var i=0; i<document.getElementsByClassName(cTurn).length; i++) document.getElementsByClassName(cTurn)[i].classList.add("active-pick");
	}
	else document.getElementById('indicator').style.opacity = 0;

	for (var i=0; i<document.getElementsByClassName('team1_name').length; i++) document.getElementsByClassName('team1_name')[i].innerHTML = info.eventInfo.team1;
	for (var i=0; i<document.getElementsByClassName('team2_name').length; i++) document.getElementsByClassName('team2_name')[i].innerHTML = info.eventInfo.team2;
	for (var i=0; i<document.getElementsByClassName('team1_abbr').length; i++) document.getElementsByClassName('team1_abbr')[i].innerHTML = info.eventInfo.team1_abbr;
	for (var i=0; i<document.getElementsByClassName('team2_abbr').length; i++) document.getElementsByClassName('team2_abbr')[i].innerHTML = info.eventInfo.team2_abbr;
	for (var i=0; i<document.getElementsByClassName('team1_score').length; i++) document.getElementsByClassName('team1_score')[i].innerHTML = info.eventInfo.team1_score;
	for (var i=0; i<document.getElementsByClassName('team2_score').length; i++) document.getElementsByClassName('team2_score')[i].innerHTML = info.eventInfo.team2_score;
	for (var i=0; i<document.getElementsByClassName('team1_logo').length; i++) document.getElementsByClassName('team1_logo')[i].style.backgroundImage = `url(${info.eventInfo.team1_logo})`;
	for (var i=0; i<document.getElementsByClassName('team2_logo').length; i++) document.getElementsByClassName('team2_logo')[i].style.backgroundImage = `url(${info.eventInfo.team2_logo})`;
	for (var i=0; i<document.getElementsByClassName('team1_logo2').length; i++) document.getElementsByClassName('team1_logo2')[i].style.backgroundImage = `url(${info.eventInfo.team1_logo2})`;
	for (var i=0; i<document.getElementsByClassName('team2_logo2').length; i++) document.getElementsByClassName('team2_logo2')[i].style.backgroundImage = `url(${info.eventInfo.team2_logo2})`;

	// Player Name and Icon
	for (var a=1; a<3; a++) for (var b=1; b<6; b++) for (var i=0; i<document.getElementsByClassName(`team${a}_player${b}_name`).length; i++) document.getElementsByClassName(`team${a}_player${b}_name`)[i].innerHTML = info[`team${a}`][`player${b}`].summonerName;
	for (var a=1; a<3; a++) for (var b=1; b<6; b++) for (var i=0; i<document.getElementsByClassName(`team${a}_player${b}_icon`).length; i++) document.getElementsByClassName(`team${a}_player${b}_icon`)[i].style.backgroundImage = `url('https://cdn.communitydragon.org/${patch}/profile-icon/{0}')`.format(info[`team${a}`][`player${b}`].summonerIconId);
	
	// Team color styles
	for (var a in teamStyles) for (var b=1; b<3; b++) for (var c=1; c<3; c++) for (var i=0; i<document.getElementsByClassName(`team${b}_${a}${c}`).length; i++) document.getElementsByClassName(`team${b}_${a}${c}`)[i].style[teamStyles[a]] = info.eventInfo[`team${b}_color${c}`];
	
	// Team Bans
	for (var a in imageNames) for (var b=1; b<3; b++) for (var c=1; c<6; c++) for (var i=0; i<document.getElementsByClassName(`team${b}_ban${c}_${a}`).length; i++) document.getElementsByClassName(`team${b}_ban${c}_${a}`)[i].style.backgroundImage = `url('https://cdn.communitydragon.org/${patch}/champion/{0}/${imageNames[a]}')`.format(info[`team${b}`].bans[c-1]);

	// Player Selection
	for (var a in imageNames) for (var b=1; b<3; b++) for (var c=1; c<6; c++) for (var i=0; i<document.getElementsByClassName(`team${b}_player${c}_${a}`).length; i++) document.getElementsByClassName(`team${b}_player${c}_${a}`)[i].style.backgroundImage = `url('https://cdn.communitydragon.org/${patch}/champion/{0}/${imageNames[a]}')`.format(info[`team${b}`][`player${c}`].champID);

	// Player Selection (for skins)
	for (var a in imageNamesSkins) for (var b=1; b<3; b++) for (var c=1; c<6; c++) {
		let skinID = info[`team${b}`][`player${c}`].champSkinID.toString();
		for (var i=0; i<document.getElementsByClassName(`team${b}_player${c}_${a}`).length; i++) document.getElementsByClassName(`team${b}_player${c}_${a}`)[i].style.backgroundImage = `url('https://cdn.communitydragon.org/${patch}/champion/{0}/${imageNamesSkins[a]}/{1}')`.format(info[`team${b}`][`player${c}`].champID, skinID.substring(skinID.length-3,skinID.length));
	}
})

setInterval(() => {socket.emit('getInfo')}, 1000);