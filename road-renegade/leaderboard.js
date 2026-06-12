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
let tagEmojis = ""
snapshot.forEach(doc => {
  tagEmojis = ""
  const data = doc.data()
  for(const tag of data.tags){
    switch(tag){
     case "very early":
     tagEmojis += "🌅"
     break
     case "founder":
     tagEmojis += "⭐️"
     break
     case "team member":
     tagEmojis += "👥"
     break
     case "bug hunter":
     tagEmojis += "🐞"
     break
    }
  }
  html += `<h2>
    ${rank}.
    ${tagEmojis}
    ${data.alias}
    - Bounty:
    $${data.bounty.toLocaleString()}
    </h2>
  `
  rank++
})
document.getElementById("leaderboard").innerHTML = html
