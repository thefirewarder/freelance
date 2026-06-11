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
            
        );

    }
);
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import {
    auth,
    db,
    login
}
from "./firebase.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
onAuthStateChanged(
    auth,
    function(user){

        if(user){

            document.getElementById(
                "loginScreen"
            ).style.display = "none";

            document.getElementById(
                "setup"
            ).style.display = "block";

        }

    }
);
let map = null
let currentCityMarker = null;
const car = L.icon({
    iconUrl: "car.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
const game = document.getElementById("game")
let routeLine = null
history.scrollRestoration = "manual";
const googleBtn = document.getElementById("googleBtn")
googleBtn.addEventListener(
    "click",
    async function(){

        const user =
            await login();

        const userDoc =
    await getDoc(
        doc(
            db,
            "users",
            user.uid
        )
    );
if(userDoc.exists()){

    document.getElementById("setup").style.display = "block";

}
else{

    document.getElementById("aliasScreen").style.display = "block"

}

        createAliasBtn.addEventListener(
    "click",
    async function(){

        const alias =
            aliasInput.value.trim();

        if(alias.length < 3){

            alert(
                "Alias must be at least 3 characters."
            );

            return;

        }

        await setDoc(
            doc(
                db,
                "users",
                auth.currentUser.uid
            ),
            {
                alias,
                bounty: 0,
                artifactsFound: 0,
                treasures: 0
            }
        );
document.getElementById("aliasScreen").style.display = "none"
document.getElementById("setup").style.display = "block";
    }
);
        
        document.getElementById("loginScreen").style.display = "none";
    }
);

let regGamesPlayed = Number(localStorage.getItem("regGames")) || 0
let guestBtn = document.getElementById("guestBtn")
 if(regGamesPlayed > 1){
        guestBtn.style.display = "none"
    }
guestBtn.addEventListener("click",function(){
    regGamesPlayed++
    localStorage.setItem("regGames", regGamesPlayed.toString())
    if(regGamesPlayed === 2){
        alert("This is your last game as a guest! Sign up to rank on our leaderboard and save your scores!")
    }
    document.getElementById(
                "loginScreen"
            ).style.display = "none";

            document.getElementById(
                "setup"
            ).style.display = "block";
    startGame()
})
let leftLine = null
let rightLine = null
let statesVisited = []
let collectingBounty = true
map = L.map("map").setView([39.5, -98.35], 4);
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
function loadVignette(){

    const lastShown =
        Number(
            localStorage.getItem(
                "lastVignette"
            )
        ) || 0

    const now =
        Date.now()

    if(
        now - lastShown <
        5 * 60 * 1000
    ){
        return
    }

    localStorage.setItem(
        "lastVignette",
        now
    )

    const oldScript =
        document.getElementById(
            "monetagVignette"
        )

    if(oldScript){
        oldScript.remove()
    }

    const script =
        document.createElement(
            "script"
        )

    script.id =
        "monetagVignette"

    script.dataset.zone =
        "11119415"

    script.src =
        "https://n6wxm.com/vignette.min.js"

    document.body.appendChild(
        script
    )

}
async function updateSuggestions(){

    if(!choice1 || !choice2){
        return;
    }
    
    const search =
        cityInput.value.trim();

    if(search.length < 1){
        citySuggestions.innerHTML = "";
        return;
    }

    try{

        const response =
            await fetch(
                `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(search)}&country=US&featureClass=P&maxRows=50&username=thefirewarder`
            );

        const data =
            await response.json();

        if(!Array.isArray(data.geonames)){
            return;
        }

        const candidates = [];

        for(const city of data.geonames){

            const lat =
                parseFloat(city.lat);

            const lon =
                parseFloat(city.lng);
            console.log(city);
console.log(lat, lon);
            const distanceFromCurrent =
                getDistance(
                    currentCity.lat,
                    currentCity.lon,
                    lat,
                    lon
                );

            const currentGap =
                getDistance(
                    currentCity.lat,
                    currentCity.lon,
                    otherCity.lat,
                    otherCity.lon
                );

            const newGap =
                getDistance(
                    lat,
                    lon,
                    otherCity.lat,
                    otherCity.lon
                );

            if(
                distanceFromCurrent < reqDist &&
                newGap < currentGap
            ){

                candidates.push({
                    city,
                    score:
                        Math.abs(
                            distanceFromCurrent -
                            reqDist
                        )
                });

            }

        }
        if(learningMode.checked){
        candidates.sort(
            (a,b) =>
                a.score -
                b.score
        )
        }
        candidates.sort(
    (a, b) => b.city.population - a.city.population
)
        citySuggestions.innerHTML = "";

        for(
            const candidate of candidates.slice(0,5)
        ){

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                candidate.city.name;

            citySuggestions.appendChild(
                option
            );

        }

    }

    catch(err){

        console.error(err);

    }

}

if(!localStorage.getItem("roadRenegadePlayed")){
collectingBounty = false
showTutorial();

localStorage.setItem(
    "roadRenegadePlayed",
    "true"
);

}

startBtn.addEventListener(
    "click",
    () => startGame(false)
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

function startGame(tutorial=false){
if(tutorial){
    guestBtn.hidden = true
}
else{
    collectingBounty = true
}
statesVisited = []
document.getElementById("music").play()
document.getElementById("setup").style.display = "none";
document.getElementById("game").style.display = "block";

setTimeout(() => {
    map.invalidateSize();
}, 100);
    
if(learningMode.checked){
    gtag("event", "enabled_learning_mode")
}
    
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
if(typeof gtag === "function"){
 gtag(
        "event",
        "game_started",
     {
         fuel: reqDist,
         detours: detourCt,
         wantedStates: blockedCt
     }
    )
}

console.log("START GAME CALLED")
document.getElementById(
    "setup"
).style.display = "none";
generateGame(tutorial);

}

function generateGame(tutorial){
console.log(tutorial)
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

if(leftLine){
    map.removeLayer(leftLine);
    leftLine = null;
}

if(rightLine){
    map.removeLayer(rightLine);
    rightLine = null;
}
if(startMarker){
    map.removeLayer(startMarker);
}

if(endMarker){
    map.removeLayer(endMarker);
}
if(currentCityMarker){
    map.removeLayer(currentCityMarker);
    currentCityMarker = null;
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

if(tutorial){
    choice1 = {name:"New York, NY",lat:40.7128,lon:-74.0060}
    choice2 = {name:"Boston, MA",lat:42.361145,lon:-71.057083}
}
    
currentCity = choice1;
otherCity = choice2;
    
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
    `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(cityName)}&country=US&featureClass=P&maxRows=1&username=thefirewarder`
);

const data =
    await response.json();
data.geonames.sort(
    (a, b) => b.population - a.population
);
return data.geonames[0];

}

function clickHandler(){

if(!choice1){
    return;
}

getCityData(
    cityInput.value
).then(async city => {

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
            city.lng
        );

    for(
        const state
        of blocked
    ){

        if(
            city.adminName1 === state
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
            "This city is outside of your fuel range. Try entering one closer to either end of your route!"
        );

        return;

    }

    const newNode = {
        name:
            city.name,
        lat,
        lon
    }
    if(currentCityMarker){
    map.removeLayer(currentCityMarker);
}

currentCityMarker =
    L.marker(
        [lat, lon],
        {
            icon: car
        }
    )
    .addTo(map)
    .bindPopup(
        city.name
    );
    if(leftLine){
        map.removeLayer(leftLine)
    }
    if(rightLine){
        map.removeLayer(rightLine)
    }
    cityInput.value = "";
    cityInput.focus();
    console.log(city)
    if(!statesVisited.includes(city.adminName1)){
        statesVisited.push(city.adminName1)
        if(Math.random() < 0.025){
            await updateDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.uid
                ),
                {
                    artifactsFound: increment(1)
                }
            )
            const snap = await getDoc(
    doc(
        db,
        "users",
        auth.currentUser.uid
    )
)

let userData = snap.data()
        }
    }
    if(leftReachable){
        leftNetwork.push(
            newNode
        );
        currentCity = newNode
        let closestOther = rightNetwork[0]
        for(const city1 of rightNetwork){
            if(getDistance(city1.lat, city1.lon, newNode.lat, newNode.lon) < getDistance(closestOther.lat, closestOther.lon, newNode.lat, newNode.lon))
            closestOther = city1
        }
        otherCity = closestOther
    }
    if(rightReachable){
        rightNetwork.push(
            newNode
        );
        if(typeof gtag === "function"){
        gtag("event","entered_city",{city: newNode.name})
        }
        currentCity = newNode
        let closestOther = leftNetwork[0]
        for(const city1 of leftNetwork){
            if(getDistance(city1.lat, city1.lon, newNode.lat, newNode.lon) < getDistance(closestOther.lat, closestOther.lon, newNode.lat, newNode.lon))
            closestOther = city1
        }
        otherCity = closestOther
    }
let leftCoords = leftNetwork.map(city2 => [city2.lat, city2.lon])
    let rightCoords = rightNetwork.map(city2 => [city2.lat, city2.lon])
    leftLine = L.polyline(leftCoords,{color: "red"}).addTo(map)
    rightLine = L.polyline(rightCoords,{color: "blue"}).addTo(map)
    citiesVisited.push(
        city.name
    );

    cityInput.value = "";

    if(lat !== currentCity.lat || lon !== currentCity.lon){
    const marker =
        L.marker(
            [lat, lon]
        )
        .addTo(map)
        .bindPopup(
            city.name
        );
    cityMarkers.push(
        marker
    );
    }

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
            blockedCt * 100 +
            detourCt * 75 +
            (400 - reqDist) * 2 -
            citiesVisited.length * 25;
        if(typeof gtag === "function"){
        gtag("event","game_won",{score: score, citiesVisited: citiesVisited.length})
        }
        if(collectingBounty  && auth.currentUser){
        updateDoc(
    doc(
        db,
        "users",
        auth.currentUser.uid
    ),
    {
        bounty:
            increment(
                score
            )
    }
);
        }
    setTimeout(function(){
        alert(

`ESCAPE SUCCESSFUL

You escaped from ${choice1.name}
and reached ${choice2.name}.

Cities visited: ${citiesVisited.length}

Score: ${score}

The authorities lost your trail.`);
loadVignette()
if(!collectingBounty){

    alert(
        "Tutorial complete! Continue as a guest to keep playing normally or sign in to start earning bounty and rank on the Most Wanted leaderboard!"
    );
    guestBtn.hidden = false
    document.getElementById("game").style.display = "none";
    document.getElementById("loginScreen").style.display = "block";

    return;
}
else{
    const playAgain = confirm("Do you want to play again?")
    document.getElementById("game").style.display = "none";
    if(playAgain){
        document.getElementById("setup").style.display = "block";
    }
    else{
        document.getElementById("loginScreen").style.display = "block";
    }
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
let startMode = alert("Let's try an example. Try entering 'Hartford', as it is between the two cities you will have to get between, 'New York' and 'Boston'. After this tutorial, you can always refresh to play again!")
setTimeout(startGame, 500, true)
}
