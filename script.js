// jshint esversion: 6

// Get HTML elements
let selRink = document.getElementById('selectRink');
let rinkNameH2 = document.getElementById('rinkNameH2');
let avgTemp = document.getElementById('avgTemp');
let avgHumidity = document.getElementById('avgHumidity');
let avgQuality= document.getElementById('avgQuality');

// Get and define data
let rinkNames = [
  'A',
  'B',
  'C'
];

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
selRink.onclick = selectRink;
