import {
    db
}
from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    limit,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const q = query(
collection(
  db,
  "users"
),
orderBy(
  "bounty",
  "desc"
),
limit(5)
)

const snapshot = await getDocs(q)
let html = ""
let rank = 1
snapshot.forEach(doc => {
  const data = doc.data()
  html += `<h2>
    ${rank}.
    ${data.alias}
    - Bounty:
    $${data.bounty.toLocaleString()}
    </h2>
  `
  rank++
})
document.getElementById("leaderboard").innerHTML = html
