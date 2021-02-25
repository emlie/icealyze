// jshint esversion: 6

// Get HTML elements
let selRink = document.getElementById('selectRink');
let rinkNameH2 = document.getElementById('rinkNameH2');
let avgTemp = document.getElementById('avgTemp');
let avgHumidity = document.getElementById('avgHumidity');
let avgQuality= document.getElementById('avgQuality');
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
    low: 'var(--main-green)',
    mid: 'var(--main-yellow)',
    high: 'var(--main-red)',
  },
  {
    name: 'humidity',
    low: 'var(--main-green)',
    mid: 'var(--main-yellow)',
    high: 'var(--main-red)',
  },
  {
    name: 'quality',
    low: 'var(--main-green)',
    mid: 'var(--main-yellow)',
    high: 'var(--main-red)',
  },
];

// Show rink names in the select menu
function loadData() {
  rinkData.forEach(rink => {
    selRink.innerHTML += `
    <option value="${rink.name}">
      Rink ${rink.name}
    </option>
    `;
  });
}

// Show legend data
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
