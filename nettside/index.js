const express = require('express');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Bane = require('./Bane')
const port = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', async (socket) => {
  console.log('Ny bruker tilkoblet');
  var BaneA = new Bane(bane_navn='Rink A')
  await BaneA.init()

  BaneA.bilde_stream((nytt_bilde) => {
    socket.emit('nytt bilde', {bilde: nytt_bilde.iskvalitet_bilde})
  })

  BaneA.status_stream((ny_status) => {
    socket.emit('status', ny_status)
  })

  BaneA.status_stream((ny_status) => {
    socket.emit('kamp status', ny_status)
  })

  socket.on('kamp start', async (respons) => {
    console.log('Starter ny kamp..')
    
    await BaneA.start_kamp('En test kamp på bane A', respons.overkjor_kamp ?? false)
  })

  socket.on('hent kamp status', (_) => {
    socket.emit('kamp status', BaneA.hent_kamp_status())
  })

  socket.on('kamp avslutt', async (respons) => {
    console.log('Avslutter kamp..')
    await BaneA.avslutt_kamp();
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});