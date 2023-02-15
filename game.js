import { db } from "./firebase.js"
import { ref, update, onValue, get } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"

let idLobby
let player

let gameState = "place boats"

// Get game id from URL
const url = new URL(window.location.href)
const urlID = url.searchParams.get("id")

// create reference, where in the database we want to take info from
const gameRef = ref(db, "/lobbies/" + urlID)

// Check if urlID exicts in DB, then set at idLobby
get(gameRef).then((snapshot) => {
	if (snapshot.exists()) {
		idLobby = urlID

		//Gives it and ID and puts the Id code into innertext
		const idLobbyEl = document.getElementById("idLobby")
		//Sets ID in paragraph
		idLobbyEl.innerText = "Lobby ID:" + " " + idLobby
	} else {
		window.location.href = "/"
	}
}).catch((error) => {
	console.error(error)
})
//------------------------------------------------------------------------
// listens for database changes
onValue(gameRef, function (snapshot) {
	const data = snapshot.val()

	if (data.connected !== true) {
		// Else, set connected = true and player = 1
		player = 1
		update(ref(db, "lobbies/" + idLobby), { connected: true })

	} else {
		// Check if connected is true, set player = 2
		player = 2
	}

	console.log(player)
})

//-----------------------------------------------------------------------------------

function toggleBox(el, board) {
	//Check if gamestate is place boats
	if (gameState == "place boats") {

		if (board != 1) return
		//Check if box is already "locked"
		if (el.classList !== "locked") {
			//Get parent element (div) of el (button) and get all elements
			const lockedElements = el.parentElement.querySelectorAll(".locked")

			//Check if locked elements is less than 11
			if (lockedElements.length < 11)
				//If not, lock box by adding class to element
				el.classList.add("locked")

			console.log("locked", el.id)

			//Check if box of locked elements is now equal to 11
			if (lockedElements.length + 1 == 11) {
				//Change text of paragraph
				document.querySelector("#pp").innerText = "Attack"
				gameState = "attack"
			}

		}
		//If gamestate isnt "place boats" run this
		if (gameState == "attack") {
			if (player == 1) {
				update(ref(db, "lobbies/" + idLobby), { p1Ready: true })
			}
			else if (player == 2) {
				update(ref(db, "lobbies/" + idLobby), { p2Ready: true })
			}
			console.log(player)
			if (board != 2) return
			//Check if box is already "locked"
			if (el.classList !== "locked") {
				//Get parent element (div) of el (button) and get all elements
				const lockedElements = el.parentElement.querySelectorAll(".locked")

				//You can press once on the other board
				if (lockedElements.length < 1) {
					//If not, lock box by adding class to element
					el.classList.add("locked")
					console.log("locked", el.id)
				}
			}
		}
	}
}
//---------------------------------------------------------------------------------------

function init() {
	document.querySelector("#pp").innerText = "Place the boats"
	const boardSection = document.querySelector("#board")

	// Create divs that holds the buttons
	for (let j = 1; j < 3; j++) {
		const newDiv = document.createElement("div")
		newDiv.id = j
		//Create buttons inside every div
		for (let i = 1; i < 65; i++) {
			const newButton = document.createElement("button")

			//Set id on button
			newButton.id = newDiv.id + "-" + i

			//Set ononclick on button
			newButton.onclick = function () {
				toggleBox(this, j)
			}
			//Add button inside div
			newDiv.appendChild(newButton)
		}

		//Add div (with buttons) to left section
		boardSection.appendChild(newDiv)
	}
}
//Ropar på att functionen ska starta
init()

