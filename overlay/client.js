var socket = io();

function uploadLogo(ele, inp) {
    const image = ele.files[0];
    
	if (image) {
        var FR= new FileReader();
		FR.onload = function(e) {
            document.getElementById(inp).value = e.target.result;
		};       
		FR.readAsDataURL( image );
	}
}

let teamcolorHome = "#CCF";
let teamcolorAway = "#FCC";
let textcolorHome = "#FFF";
let textcolorAway = "#FFF";

socket.on('opseUpdateData', data => {
    document.getElementById("team1_name").innerHTML = data.team1_abbr;
    document.getElementById("team2_name").innerHTML = data.team2_abbr;

    document.getElementById("team1_score").innerHTML = data.team1_score;
    document.getElementById("team2_score").innerHTML = data.team2_score;

    document.getElementById("team1_score").style.color = data.team1_color2;
    document.getElementById("team2_score").style.color = data.team2_color2;
    document.getElementById("team1_score").style.backgroundColor = data.team1_color1;
    document.getElementById("team2_score").style.backgroundColor = data.team2_color1;
    teamcolorHome = data.team1_color1;
    teamcolorAway = data.team2_color1;
    textcolorHome = data.team1_color2;
    textcolorAway = data.team2_color2;

    document.getElementById("team1_logo").style.backgroundImage = `url(${data.team1_logo})`;
    document.getElementById("team2_logo").style.backgroundImage = `url(${data.team2_logo})`;
});

socket.on('opseLayoutUpdate2', layout => {
    document.body.classList.remove("tf");
    document.body.classList.remove("nolb");
    document.body.classList.add(layout);
});

let baronTime = 0;
let baronHome = true;

let elderTime = 0;
let elderHome = true;

let timerPaused = false;

setInterval(() => {
    document.getElementById("baronTimer").classList.remove("show");
    document.getElementById("elderTimer").classList.remove("show");
    
    if (baronTime != 0) {
        document.getElementById("baronTimer").classList.add("show");
        if (baronHome) document.getElementById("baronTimer").style.backgroundColor = teamcolorHome;
        else document.getElementById("baronTimer").style.backgroundColor = teamcolorAway;

        let min = Math.floor(baronTime/60);
        let sec = baronTime - (min*60);

        if (sec<10) sec = `0${sec}`;

        document.getElementById("baronTimer").innerHTML = `<p style="text-align: center; font-size: 20pt; margin: 7px;">${min}:${sec}</p>`;

        if (!timerPaused) baronTime--;
    }

    if (elderTime != 0) {
        document.getElementById("elderTimer").classList.add("show");
        if (elderHome) {
            document.getElementById("elderTimer").style.backgroundColor = teamcolorHome;
        }
        else {
            document.getElementById("elderTimer").style.backgroundColor = teamcolorAway;
        }

        let min = Math.floor(elderTime/60);
        let sec = elderTime - (min*60);

        if (sec<10) sec = `0${sec}`;

        document.getElementById("elderTimer").innerHTML = `<p style="text-align: center; font-size: 20pt; margin: 7px;">${min}:${sec}</p>`;

        if (!timerPaused) elderTime--;
    }
}, 1000);

socket.on('setBaron', (time, home) => {
    baronTime = time;
    baronHome = home;
});

socket.on('setElder', (time, home) => {
    elderTime = time;
    elderHome = home;
});

socket.on('hideAllUI', state => {
    if (state) document.body.style.display = "block";
    else document.body.style.display = "none";
});

socket.on('timerPaused', state => { timerPaused = state });