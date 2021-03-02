const express = require('express')
const bodyParser = require('body-parser')
const Kamp = require('./Kamp')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function testKamp() {
  var kampA = new Kamp(bane_navn='Rink A', kamp_navn='test')
  await kampA.start(true)
  await kampA.avslutt()
}

app.get('/', (req, res) => {
    testKamp();
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})