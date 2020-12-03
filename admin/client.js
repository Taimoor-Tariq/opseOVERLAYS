try {var socket = io()} catch(e) {}

function togglePick(s) {socket.emit('togglePick', s)}
function loadData() {socket.emit('getOpseInfo')}
function showALL(state) {socket.emit('hideAllUI-send', state)}
function updateSkybox() {socket.emit('updateSkybox-send', document.getElementById("skybox_name").value)}
function musicChange(state) {socket.emit('changeChampMusic-send', state)}
function musicPlay(state) {socket.emit('playChampMusic-send', state)}
function changeLayout(layout) {socket.emit('changeOPSElayout', layout)}
function overlayIngame(state) {socket.emit('clientToggleOverlay-send', state)}
function toggleChamps(state) {socket.emit('toggleChamps-send', state)}
function triggerSequence(sequence="") {socket.emit('triggerSequence', sequence)}
function setBaron(home) {socket.emit('setBaron-send', document.getElementById("baron_time").value, home)}
function setElder(home) {socket.emit('setElder-send', document.getElementById("elder_time").value, home)}
function timerPaused(state) {socket.emit('timerPaused-send', state)}
function setupUI() {
    socket.emit('setupUI-send');
    updateSkybox();
}

function showLB(state) {
    if (state) socket.emit('changeOPSElayout', "test");
    else socket.emit('changeOPSElayout', "nolb");
};

function updateData() {
    let data = {
        team1: document.getElementById("config_team1_name").value,
        team2: document.getElementById("config_team2_name").value,
        team1_abbr: document.getElementById("config_team1_abbr").value,
        team2_abbr: document.getElementById("config_team2_abbr").value,
        team1_color1: document.getElementById("config_team1_color1").value,
        team2_color1: document.getElementById("config_team2_color1").value,
        team1_color2: document.getElementById("config_team1_color2").value,
        team2_color2: document.getElementById("config_team2_color2").value,
        team1_score: document.getElementById("config_team1_score").value,
        team2_score: document.getElementById("config_team2_score").value,
        team1_logo: document.getElementById("config_team1_logo").value,
        team2_logo: document.getElementById("config_team2_logo").value,
        team1_logo2: document.getElementById("config_team1_logo2").value,
        team2_logo2: document.getElementById("config_team2_logo2").value
    }
    
    socket.emit('opseOverlayUpdate', data);
}

function swithcSides() {
    let temp1 = document.getElementById("config_team1_name").value;
    let temp2 = document.getElementById("config_team1_logo").value;
    let temp3 = document.getElementById("config_team1_color1").value;
    let temp4 = document.getElementById("config_team1_score").value;
    let temp5 = document.getElementById("config_team1_color2").value;
    let temp6 = document.getElementById("config_team1_abbr").value;
    let temp7 = document.getElementById("config_team1_logo2").value;
    
    document.getElementById("config_team1_name").value = document.getElementById("config_team2_name").value;
    document.getElementById("config_team1_logo").value = document.getElementById("config_team2_logo").value;
    document.getElementById("config_team1_logo2").value = document.getElementById("config_team2_logo2").value;
    document.getElementById("config_team1_color1").value = document.getElementById("config_team2_color1").value;
    document.getElementById("config_team1_color2").value = document.getElementById("config_team2_color2").value;
    document.getElementById("config_team1_score").value = document.getElementById("config_team2_score").value;
    document.getElementById("config_team1_abbr").value = document.getElementById("config_team2_abbr").value;
    
    document.getElementById("config_team2_name").value = temp1;
    document.getElementById("config_team2_logo").value = temp2;
    document.getElementById("config_team2_color1").value = temp3;
    document.getElementById("config_team2_score").value = temp4;
    document.getElementById("config_team2_color2").value = temp5;
    document.getElementById("config_team2_abbr").value = temp6;
    document.getElementById("config_team2_logo2").value = temp7;
    
    updateData();
}

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

socket.on('opseOverlayInfo', (data, codes) => {
    let codeContainer = document.getElementById("tourneyCodes");

    document.getElementById("config_team1_name").value = data.team1;
    document.getElementById("config_team2_name").value = data.team2;

    document.getElementById("config_team1_abbr").value = data.team1_abbr;
    document.getElementById("config_team2_abbr").value = data.team2_abbr;

    document.getElementById("config_team1_color1").value = data.team1_color1;
    document.getElementById("config_team2_color1").value = data.team2_color1;
    document.getElementById("config_team1_color2").value = data.team1_color2;
    document.getElementById("config_team2_color2").value = data.team2_color2;

    document.getElementById("config_team1_score").value = data.team1_score;
    document.getElementById("config_team2_score").value = data.team2_score;

    document.getElementById("config_team1_logo").value = data.team1_logo;
    document.getElementById("config_team2_logo").value = data.team2_logo;
    document.getElementById("config_team1_logo2").value = data.team1_logo2;
    document.getElementById("config_team2_logo2").value = data.team2_logo2;

    let coden = Object.keys(codes).length;
    if (coden != 0) codeContainer.innerHTML = "";

    for (var i in codes) {
        codeContainer.innerHTML += `<p>${i}</p><input type="text" value="${codes[i]}">`
    }

    // if (coden != 0) codeContainer.innerHTML += `<button class="btn other-btn" onclick="">UPDATE CODES</button>`;
});

setInterval(() => { updateData() }, 10000);