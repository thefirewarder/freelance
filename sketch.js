window.addEventListener(
    "load",
    function(){

        setTimeout(
            function(){
                window.scrollTo(
                    0,
                    0
                );
            },
            0
        );

    }
);

history.scrollRestoration = "manual";
const map = L.map("map").setView([39.5, -98.35], 4);
let currentCity = null
let otherCity = null
const directions = document.getElementById("directions");
const cityInput = document.getElementById("cityInput");
const enter = document.getElementById("enter");
const startBtn = document.getElementById("startBtn");
const learningMode = document.getElementById("learningMode");
L.tileLayer(
"https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
{
attribution: "© OpenStreetMap © CARTO"
}
).addTo(map);

let reqDist = 300;
let detourCt = 0;
let blockedCt = 0;

let choice1;
let choice2;

let leftNetwork = [];
let rightNetwork = [];

let detours = [];
let blocked = [];

let citiesVisited = [];

let startMarker = null;
let endMarker = null;

const cityMarkers = [];

const majorCities = [
{name:"New York, NY",lat:40.7128,lon:-74.0060},
{name:"Los Angeles, CA",lat:34.0522,lon:-118.2437},
{name:"Chicago, IL",lat:41.8781,lon:-87.6298},
{name:"Houston, TX",lat:29.7604,lon:-95.3698},
{name:"Phoenix, AZ",lat:33.4483,lon:-112.07404},
{name:"Philadelphia, PA",lat:39.9526,lon:-75.1652},
{name:"San Antonio, TX",lat:29.4241,lon:-98.4936},
{name:"San Diego, CA",lat:32.7157,lon:-117.1611},
{name:"Dallas, TX",lat:32.7767,lon:-96.7970},
{name:"Jacksonville, FL",lat:30.3322,lon:-81.6557},
{name:"Charlotte, NC",lat:35.11333,lon:-80.85361},
{name:"Columbus, OH",lat:39.98333,lon:-82.98333},
{name:"Denver, CO",lat:39.73923,lon:-104.99025},
{name:"Seattle, WA",lat:47.60620,lon:-122.332069},
{name:"Oklahoma City, OK",lat:35.481918,lon:-97.508469},
{name:"Boston, MA",lat:42.361145,lon:-71.057083}
];
const citySuggestions =
    document.getElementById(
        "citySuggestions"
    );

cityInput.addEventListener(
    "input",
    updateSuggestions
);

async function updateSuggestions(){

    if(!learningMode.checked){
        return;
    }

    citySuggestions.innerHTML = "";

    const search =
        cityInput.value
            .trim();

    if(search.length < 1){
        return;
    }

    try{

        const response =
            await fetch(
                `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(search)}&country=US&featureClass=P&maxRows=20&username=thefirewarder`
            );

        const data =
            await response.json();

        citySuggestions.innerHTML = "";

        if(!Array.isArray(data.geonames)){
    console.log(data);
    return;
}

for(
    const city of data.geonames
){

            const option =
                document.createElement(
                    "option"
                );
            const proximity =
    getDistance(
        parseFloat(city.lat),
        parseFloat(city.lng),
        currentCity.lat,
        currentCity.lon
    );
            const otherProximity = 
                getDistance(
                    otherCity.lat, otherCity.lon, currentCity.lat, currentCity.lon
                )
            const newProximity = 
                getDistance(
                    otherCity.lat, otherCity.lon, parseFloat(city.lat), parseFloat(city.lng)
                )
            option.value =
                city.name;
            if(proximity < reqDist && proximity > reqDist / 1.5 && newProximity < otherProximity){
            citySuggestions.appendChild(
                option
            );
            }

        }

    }

    catch(err){

        console.error(err);

    }

}

if(!localStorage.getItem("roadRenegadePlayed")){

showTutorial();

localStorage.setItem(
    "roadRenegadePlayed",
    "true"
);

}

startBtn.addEventListener(
"click",
startGame
);

enter.addEventListener(
"click",
clickHandler
);

window.addEventListener(
"keydown",
function(e){

    if(e.key === "Enter"){
        clickHandler();
    }

}

);

function startGame(){

reqDist =
    parseInt(
        document.getElementById(
            "fuelSelect"
        ).value
    );

detourCt =
    parseInt(
        document.getElementById(
            "detourSelect"
        ).value
    );

blockedCt =
    parseInt(
        document.getElementById(
            "blockedSelect"
        ).value
    );
console.log("START GAME CALLED")
document.getElementById(
    "setup"
).style.display = "none";
generateGame();

}

function generateGame(){

citiesVisited = [];
detours = [];
blocked = [];

leftNetwork = [];
rightNetwork = [];

if(startMarker){
    map.removeLayer(startMarker);
}

if(endMarker){
    map.removeLayer(endMarker);
}

while(cityMarkers.length > 0){

    map.removeLayer(
        cityMarkers.pop()
    );

}

const cities =
    [...majorCities];

const pointer =
    Math.floor(
        Math.random() *
        cities.length
    );

choice1 =
    cities[pointer];

cities.splice(
    pointer,
    1
);

choice2 =
    cities[
        Math.floor(
            Math.random() *
            cities.length
        )
    ];

const startState =
    choice1.name.split(", ")[1];

const endState =
    choice2.name.split(", ")[1];

const possibleDetours = [
    "Montana",
    "Wyoming",
    "Oregon",
    "Kentucky",
    "West Virginia"
];

const possibleBlocked = [
    "Nebraska",
    "Kansas",
    "Texas",
    "New Mexico",
    "Colorado"
].filter(
    state =>
        state !== startState &&
        state !== endState
);

const actualDetourCt =
    Math.min(
        detourCt,
        possibleDetours.length
    );

const actualBlockedCt =
    Math.min(
        blockedCt,
        possibleBlocked.length
    );

for(
    let i = 0;
    i < actualDetourCt;
    i++
){

    const index =
        Math.floor(
            Math.random() *
            possibleDetours.length
        );

    detours.push(
        possibleDetours[index]
    );

    possibleDetours.splice(
        index,
        1
    );

}

for(
    let i = 0;
    i < actualBlockedCt;
    i++
){

    const index =
        Math.floor(
            Math.random() *
            possibleBlocked.length
        );

    blocked.push(
        possibleBlocked[index]
    );

    possibleBlocked.splice(
        index,
        1
    );

}

directions.innerHTML =

`

Escape from ${choice1.name}
and reach ${choice2.name}. <br>




Fuel Range:
${reqDist} miles <br>

Required Detours:
${detours.join(", ") || "None"} <br>

Wanted In:
${blocked.join(", ") || "None"}
`;

startMarker =
    L.marker(
        [choice1.lat, choice1.lon]
    )
    .addTo(map)
    .bindPopup(choice1.name);

endMarker =
    L.marker(
        [choice2.lat, choice2.lon]
    )
    .addTo(map)
    .bindPopup(choice2.name);

leftNetwork = [choice1];
rightNetwork = [choice2];

}

function getDistance(
lat1,
lon1,
lat2,
lon2
){

const R = 3958.8;

const dLat =
    (lat2 - lat1) *
    Math.PI /
    180;

const dLon =
    (lon2 - lon1) *
    Math.PI /
    180;

const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(
        lat1 *
        Math.PI /
        180
    ) *
    Math.cos(
        lat2 *
        Math.PI /
        180
    ) *
    Math.sin(
        dLon / 2
    ) ** 2;

const c =
    2 *
    Math.asin(
        Math.sqrt(a)
    );

return R * c;

}

async function getCityData(
cityName
){

    const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${cityInput.value}&countrycodes=us&format=json&limit=50`
);

const data =
    await response.json();

return data[0];

}

function clickHandler(){

if(!choice1){
    return;
}

getCityData(
    cityInput.value
).then(city => {

    if(!city){

        alert(
            "City not found."
        );

        return;

    }

    const lat =
        parseFloat(
            city.lat
        );

    const lon =
        parseFloat(
            city.lon
        );

    for(
        const state
        of blocked
    ){

        if(
            city.display_name.includes(
                state
            )
        ){

            alert(
                "Don't go in there or you'll be arrested on the spot!"
            );

            return;

        }

    }

    let leftReachable =
        false;

    let rightReachable =
        false;

    for(
        const node
        of leftNetwork
    ){

        if(
            getDistance(
                lat,
                lon,
                node.lat,
                node.lon
            ) < reqDist
        ){

            leftReachable =
                true;

            break;

        }

    }

    for(
        const node
        of rightNetwork
    ){

        if(
            getDistance(
                lat,
                lon,
                node.lat,
                node.lon
            ) < reqDist
        ){

            rightReachable =
                true;

            break;

        }

    }

    if(
        !leftReachable &&
        !rightReachable
    ){

        alert(
            "Too far away from both networks!"
        );

        return;

    }

    const newNode = {
        name:
            city.display_name,
        lat,
        lon
    };

    if(leftReachable){
        leftNetwork.push(
            newNode
        );
        currentCity = newNode
        let closestOther = rightNetwork[0]
        for(const city1 of rightNetwork){
            if(getDistance(city1.lat, newNode.lat, city.lon, newNode.lon) < getDistance(closestOther.lat, newNode.lat, closestOther.lon, newNode.lon))
            closestOther = city1
        }
        otherCity = closestOther
    }

    if(rightReachable){
        rightNetwork.push(
            newNode
        );
        currentCity = newNode
        let closestOther = leftNetwork[0]
        for(const city1 of leftNetwork){
            if(getDistance(city1.lat, newNode.lat, city.lon, newNode.lon) < getDistance(closestOther.lat, newNode.lat, closestOther.lon, newNode.lon))
            closestOther = city1
        }
        otherCity = closestOther
    }

    citiesVisited.push(
        city.display_name
    );

    cityInput.value = "";

    const marker =
        L.marker(
            [lat, lon]
        )
        .addTo(map)
        .bindPopup(
            city.display_name
        );

    cityMarkers.push(
        marker
    );

    const detoursReached =
        detours.every(
            detour =>
                citiesVisited.some(
                    cityName =>
                        cityName.includes(
                            detour
                        )
                )
        );

    let connected =
        false;

    for(
        const leftCity
        of leftNetwork
    ){

        for(
            const rightCity
            of rightNetwork
        ){

            const d =
                getDistance(
                    leftCity.lat,
                    leftCity.lon,
                    rightCity.lat,
                    rightCity.lon
                );

            if(
                d < reqDist
            ){
                connected =
                    true;
            }

        }

    }

    if(
        connected &&
        detoursReached
    ){

        const score =
            1000 +
            blockedCt * 200 +
            detourCt * 150 +
            (400 - reqDist) * 2 -
            citiesVisited.length * 25;

        alert(

`ESCAPE SUCCESSFUL

You escaped from ${choice1.name}
and reached ${choice2.name}.

Cities visited: ${citiesVisited.length}

Score: ${score}

The authorities lost your trail.`
);

    }

});

}

function showTutorial(){

alert(

`ROAD RENEGADE

Build a chain of cities from start to finish.

Every city must be within your fuel range.

Avoid states where you're wanted.

Visit all required detours.

Use as few cities as possible for a higher score.`
);
}
