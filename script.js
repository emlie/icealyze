// jshint esversion: 6

// Get HTML elements
let selRink = document.getElementById('selectRink');
let thisDate = document.getElementById('thisDate');
let rinkNameH2 = document.getElementById('rinkNameH2');
let avgTemp = document.getElementById('avgTemp');
let avgHumidity = document.getElementById('avgHumidity');
let avgQuality= document.getElementById('avgQuality');
let rinkMenu = document.getElementsByClassName('rink-menu')[0];
let legend = document.getElementsByClassName('legend')[0];

let rinkData = [
  {
    name: 'A',
    avgTemp: 3,
    avgHumidity: 45,
    avgQuality: 6
  },
  {
    name: 'B',
    avgTemp: 1,
    avgHumidity: 15,
    avgQuality: 2
  },
  {
    name: 'C',
    avgTemp: 2,
    avgHumidity: 65,
    avgQuality: 5
  },
];

const legendData = [
  {
    name: 'temperature',
    low: 'var(--main-blue)',
    mid: 'var(--main-orange)',
    high: 'var(--main-red)',
  },
  {
    name: 'humidity',
    low: 'var(--light-blue)',
    mid: 'var(--medium-blue)',
    high: 'var(--main-blue)',
  },
  {
    name: 'quality',
    low: 'var(--dark-yellow)',
    mid: 'var(--medium-yellow)',
    high: 'var(--main-yellow)',
  },
];

let d = new Date();
let date = d.getDate();
let month = d.getMonth();
let year = d.getFullYear();
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

// Load all data
function loadData() {
  let monthName = months[0];
  // thisDate.innerHTML = `${month} ${date}, ${year}`;

  rinkData.forEach(rink => {
    selRink.innerHTML += `
    <option value="${rink.name}">
      Rink ${rink.name}
    </option>
    `;
  });
}

// Show legend
function loadLegend() {
  legendData.forEach(data => {
    legend.innerHTML += `
    <div class="legend-data">
      <div class="bar top-bar" style="background:${data.high}"></div>
      <div class="bar" style="background:${data.mid}"></div>
      <div class="bar bottom-bar" style="background:${data.low}"></div>
      <h3 class="center">${data.name}</h3>
    </div>
    `;

    rinkMenu.innerHTML += `
    <div class="">
      <input type="checkbox" name="inp-${data.name}" value="">
      <label for="inp-${data.name}" class="label">${data.name}</label>
    </div>
    `;
  });
}

// Select rink functionality
function selectRink(event) {
  event.preventDefault();

  let selectedRink = event.target.value;

  rinkData.forEach(rink => {
    if (selectedRink == rink.name) {
      let rinkName = rink.name;
      let rinkAvgTemp = rink.avgTemp;
      let rinkAvgHumidity = rink.avgHumidity;
      let rinkAvgQuality = rink.avgQuality;

      rinkNameH2.innerHTML = `Rink ${rinkName}`;
      avgTemp.innerHTML = `${rinkAvgTemp}°c`;
      avgHumidity.innerHTML = `${rinkAvgHumidity}%`;
      avgQuality.innerHTML = `${rinkAvgQuality}/6`;
    } else if (selectedRink == 0) {
      rinkNameH2.innerHTML = `Rink unknown`;
      avgTemp.innerHTML = `X°c`;
      avgHumidity.innerHTML = `Y%`;
      avgQuality.innerHTML = `Z/6`;
    }
  });
}

// Run functions
loadData();
loadLegend();
selRink.onclick = selectRink;
