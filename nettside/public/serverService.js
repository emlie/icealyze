// om nettsiden skal kommunisere med database eller ikke
const DEBUG_LOCAL = true;

// html objekter som er relevante for programmet
const startKnapp = document.getElementById('start');
const avsluttKnapp = document.getElementById('avslutt');

const bilde = document.getElementById('img');
const temperatur = document.getElementById('temperatur');
const luftfuktighet = document.getElementById('luftfuktighet');
const test_status = document.getElementById('test_status');
const kamp_navn = document.getElementById('kamp_navn');

const DEBUG_main = () => {
    startKnapp.onclick = () => {
        // simulere at en kamp er startet
        test_status.style.backgroundColor = 'green';
    }

    avsluttKnapp.onclick = () => {
        // simulere at en kamp er avsluttet
        test_status.style.backgroundColor = 'red';
    }

    bilde.src = 'test.jpg'
    kamp_navn.innerHTML = 'Test kamp'

    temperatur.innerHTML = 20;
    luftfuktighet.innerHTML = 40;
}

// kjøres ved programstart
const main = () => {

    // kjøre et annet programm som simulerer en server tilkobling
    if (DEBUG_LOCAL) {
        DEBUG_main();
        return;
    }

    // starte en kamp, når banen er gitt
    startKnapp.onclick = (e) => {
        var respond = {
            overkjor_kamp: true
        }
        socket.emit('kamp start', respond);
    }

    // avslutte kampen som vises
    avsluttKnapp.onclick = (e) => {
        var respond = {
        
        }
        socket.emit('kamp avslutt', respond);
    }

    socket.on('nytt bilde', (res) => {
        console.log(res);
        var bytes = new Uint8Array(res.bilde);

        var image = document.getElementById('img');
        image.src = 'data:image/png;base64,'+encode(bytes);
    })

    socket.emit('hent kamp status', null)

    socket.on('kamp status', (res) => {
        console.log(res);
        temperatur.innerHTML = res.temperatur;
        luftfuktighet.innerHTML = res.luftfuktighet;
        kamp_navn.innerHTML = res.kamp_navn;

        if (res.kamp_aktiv === true) {
            test_status.style.backgroundColor = 'green';
        } else {
            test_status.style.backgroundColor = 'red';
        }
    })
}

window.onload = main;