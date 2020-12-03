const express = require("express");
const router = express.Router();

router.get("/config-menu", (req, res) => {
	res.sendFile(__dirname + "/admin/main.html");
});

router.get("/admin_client", (req, res) => {
	res.sendFile(__dirname + "/admin/client.js");
});

router.get("/admin_style", (req, res) => {
	res.sendFile(__dirname + "/admin/temp.css");
});

router.get("/pick", (req, res) => {
	res.sendFile(__dirname + "/pick/index.html");
});

router.get("/pick_client", (req, res) => {
	res.sendFile(__dirname + "/pick/client.js");
});

router.get("/pick_style", (req, res) => {
	res.sendFile(__dirname + "/pick/style.css");
});

router.get("/ingame", (req, res) => {
	res.sendFile(__dirname + "/overlay/index.html");
});

router.get("/ingame_client", (req, res) => {
	res.sendFile(__dirname + "/overlay/client.js");
});

router.get("/ingame_style", (req, res) => {
	res.sendFile(__dirname + "/overlay/style.css");
});

// qpgwdz02rylx41vo.preview.edgeapp.net

router.get("/getLolRank/:summoner", (req, res) => {
	request(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summoner}?api_key=RGAPI-f8b5489e-fc96-4b98-830f-ce966901dc84`).then(body => {
        let info = JSON.parse(body);
        request(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${info.id}?api_key=RGAPI-f8b5489e-fc96-4b98-830f-ce966901dc84`).then(data => {
            data = JSON.parse(data);

            let key = 0;
            if (data[1].queueType == "RANKED_SOLO_5x5") key = 1;

            let response = {
                name: data[key].summonerName,
                rank: `${toTitleCase(data[key].tier)} ${data[key].rank}`,
                lp: `${data[key].leaguePoints}`
            }

            if (toTitleCase(data[key].tier) == "Grandmaster") response.rank = "Grandmaster";

            res.header("Content-Type",'application/json');
            res.send(JSON.stringify(response, null, 4));
        });
    });
});

router.get("/getLolRank/:summoner/:key", (req, res) => {
	request(`https://loldrafts.com/getRank/${req.params.summoner}`).then(body => {
        let info = JSON.parse(body);
        res.send(info[req.params.key]);
    });
});


router.post("/tournyredirect", (req, res) => {
	let finalmeta = {
		team1_ID: "",
		team2_ID: "",
		description:""
	}
	let body = req.body;
	let meta = body.metaData.split(" ");
	let key = body.shortCode;

	finalmeta.team1_ID = meta[0];
	meta.shift();
	finalmeta.team2_ID = meta[0];
	meta.shift();
	finalmeta.description = meta.join(" ");
	body.metaData = finalmeta;

	API.saveResult(key, body);
	res.send("LOGGED");
});

// 12247
// 1851519
// NA0486f-2b508e66-9851-4601-a478-ccbf549d4f5c

// NA04876-e3e3e4c4-5ee0-49c2-a139-f661f868b66e

router.post("/restart", (req, res) => {
	if (req.headers.pass) {
		if (req.headers.pass == "5524278") {
			res.send("Server Restarted");
			console.log("Server Restarting");
			process.exit(1);
		}
	}
});

module.exports = router;
