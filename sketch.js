const map = L.map('map').setView([39.5, -98.35], 4);
const directions = document.getElementById("directions");
const cityInput = document.getElementById("cityInput");
const enter = document.getElementById("enter");
let reqDist = null
let detourCt = null
let blockedCt = null
if(!localStorage.getItem("roadRenegadePlayed")){

    showTutorial();

    localStorage.setItem(
        "roadRenegadePlayed",
        "true"
    );

}
const wantsCustom = confirm("Here are some questions to help you customize your game! Press cancel for the default game.")
if(wantsCustom){
 reqDist = parseInt(prompt("How many miles do you want your car to be able to drive you on one tank of gas? (200- is hard, 300 is average, 400+ is easy)")) || 300
}
else{
  reqDist = 300
}
const citiesVisited = []
if(wantsCustom){
 detourCt = parseInt(prompt("How many detours do you want to take? (More is harder, Max of 4)")) || 0
}
else{
   detourCt = 0
}
if(wantsCustom){
 blockedCt = parseInt(prompt("How many states do you want to be wanted in? (More is harder,  max of 4)")) || 0
}
else{
   blockedCt = 0
}
const possibleDetours = [
    "Montana",
    "Wyoming",
    "Oregon",
    "Kentucky",
    "West Virginia"
];

const detours = [];
const blocked = [];

let detoursReached = false;
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }
).addTo(map);

const majorCities = [
    {
        name: "New York, NY",
        lat: 40.7128,
        lon: -74.0060
    },

    {
        name: "Los Angeles, CA",
        lat: 34.0522,
        lon: -118.2437
    },

    {
        name: "Chicago, IL",
        lat: 41.8781,
        lon: -87.6298
    },

    {
        name: "Houston, TX",
        lat: 29.7604,
        lon: -95.3698
    },

    {
        name: "Phoenix, AZ",
        lat: 33.4483,
        lon: -112.07404
    },

    {
        name: "Philadelphia, PA",
        lat: 39.9526,
        lon: -75.1652
    },

    {
        name: "San Antonio, TX",
        lat: 29.4241,
        lon: -98.4936
    },

    {
        name: "San Diego, CA",
        lat: 32.7157,
        lon: -117.1611
    },

    {
        name: "Dallas, TX",
        lat: 32.7767,
        lon: -96.7970
    },

    {
        name: "Jacksonville, FL",
        lat: 30.3322,
        lon: -81.6557
    },

    {
        name: "Charlotte, NC",
        lat: 35.11333,
        lon: -80.85361
    },

    {
        name: "Columbus, OH",
        lat: 39.98333,
        lon: -82.98333
    },

    {
        name: "Denver, CO",
        lat: 39.73923,
        lon: -104.99025
    },

    {
        name: "Seattle, WA",
        lat: 47.60620,
        lon: -122.332069
    },

    {
        name: "Oklahoma City, OK",
        lat: 35.481918,
        lon: -97.508469
    },

    {
        name: "Boston, MA",
        lat: 42.361145,
        lon: -71.057083
    }
];

const pointer = Math.floor(Math.random() * majorCities.length);

const choice1 = majorCities[pointer];

majorCities.splice(pointer, 1);

const choice2 =
majorCities[Math.floor(Math.random() * majorCities.length)];

const startState =
    choice1.name.split(", ")[1];

const endState =
    choice2.name.split(", ")[1];

const possibleBlocked = [
    "Nebraska",
    "Kansas",
    "Texas",
    "New Mexico",
    "Colorado"
].filter(state =>
    state !== startState &&
    state !== endState
);

const actualDetourCt =
    Math.min(detourCt, possibleDetours.length);

const actualBlockedCt =
    Math.min(blockedCt, possibleBlocked.length);

for (let i = 0; i < actualDetourCt; i++) {

    const di =
        Math.floor(
            Math.random() *
            possibleDetours.length
        );

    detours.push(
        possibleDetours[di]
    );

    possibleDetours.splice(di, 1);

}

for (let i = 0; i < actualBlockedCt; i++) {

    const bi =
        Math.floor(
            Math.random() *
            possibleBlocked.length
        );

    blocked.push(
        possibleBlocked[bi]
    );

    possibleBlocked.splice(bi, 1);

}

const detourStr =
    detours.join(", ");

const blockedStr =
    blocked.join(", ");
directions.innerHTML =
`
<h2>ROAD RENEGADE</h2>

Escape from <b>${choice1.name}</b>
and reach <b>${choice2.name}</b>.

<br><br>

Fuel Range:
${reqDist} miles

<br>

Required Detours:
${detourStr || "None"}

<br>

Wanted In:
${blockedStr || "None"}
`;

L.marker([choice1.lat, choice1.lon])
.addTo(map)
.bindPopup(choice1.name);

L.marker([choice2.lat, choice2.lon])
.addTo(map)
.bindPopup(choice2.name);

const leftNetwork = [choice1];
const rightNetwork = [choice2];

function getDistance(lat1, lon1, lat2, lon2) {

    const R = 3958.8;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c;
}

async function getCityData(cityName) {

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${cityName}&country=USA&format=json`
    );
    
    const data = await response.json();

    return data[0];
}
enter.addEventListener("click",clickHandler, false);
function clickHandler(){
  getCityData(cityInput.value).then(city => {

    if (!city) {
        alert("City not found");
        return;
    }

  const lat = parseFloat(city.lat);
const lon = parseFloat(city.lon);
    for (const block of blocked) {
        if (city.display_name.includes(block)) {
            alert("Don't go in there or you'll be arrested on the spot!");
            return
        }
    }
      detoursReached = detours.every(
    detour =>
        citiesVisited.some(
            city2 =>
                city2.includes(detour)
        )
);
    let leftReachable = false;
    let rightReachable = false;

    for (const node of leftNetwork) {

        const d = getDistance(
            lat,
            lon,
            node.lat,
            node.lon
        );

        if (d < reqDist) {
            leftReachable = true;
            break;
        }
    }

    for (const node of rightNetwork) {

        const d = getDistance(
            lat,
            lon,
            node.lat,
            node.lon
        );

        if (d < reqDist) {
            rightReachable = true;
            break;
        }
    }

    if (!leftReachable && !rightReachable) {

        alert("Too far away from both networks!");
        return;

    }

    const newNode = {
        name: city.display_name,
        lat,
        lon
    };

    if (leftReachable) {
        leftNetwork.push(newNode);
    }

    if (rightReachable) {
        rightNetwork.push(newNode);
    }
citiesVisited.push(
    city.display_name
);
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(city.display_name);

    let connected = false;
    let smallestDistance = Infinity;

    for (const leftCity of leftNetwork) {

        for (const rightCity of rightNetwork) {

            const d = getDistance(
                leftCity.lat,
                leftCity.lon,
                rightCity.lat,
                rightCity.lon
            );

            smallestDistance = Math.min(
                smallestDistance,
                d
            );

            if (d < reqDist) {
                connected = true;
            }

        }

    }

    console.log(
        "Closest network distance:",
        smallestDistance
    );

    if (connected && detoursReached) {
const score =
1000+ (blockedCt * 200)+ (detourCt * 150)+ ((400 - reqDist) * 2)- (citiesVisited.length * 25)
       alert(
`ESCAPE SUCCESSFUL

You escaped from ${choice1.name}
and reached ${choice2.name}.

Cities visited: ${citiesVisited.length}

Score: ${score} 

The authorities lost your trail.`
);
      return

    }

});

}
window.addEventListener("keydown",function(e){
    if(e.keyCode === 13){
      clickHandler()
    }
  })
function showTutorial(){
  alert(
"ROAD RENEGADE\n\nYou are a criminal trying to escape the law."
);

alert(
"Build a chain of cities from start to finish using the input box."
);

alert(
"Every city must be within your fuel range. Avoid states where you're wanted."
);

alert(
"Visit all required detours. Harder settings and fewer cities = higher score.\n\nGood luck!"
);
}
