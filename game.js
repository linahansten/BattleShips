import { db } from "./firebase.js"
import { ref, update, onValue, get } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"

let idLobby
let player
let player1 = "1"
let player2 = "2"
// let gameOver = false
// let playerTurn
let gameState = "place boats"

// Get game id from URL
const url = new URL(window.location.href)
const urlID = url.searchParams.get("id")

// create reference, where in the database we want to take info from
const gameRef = ref(db, "/lobbies/" + urlID)

//------------------------------------------------------------------------

// Check if urlID exicts in DB, then set at idLobby
get(gameRef).then((snapshot) => {
	const data = snapshot.val()

	if (snapshot.exists()) {
		idLobby = urlID
	} else {
		window.location.href = "/"
	}
	if (data.connected == true) {
		// Check if connected is true, set player = 2
		player = player2
	}
	if (data.connected !== true) {
		// Else, set connected = true and player = 1
		player = player1
		update(ref(db, "lobbies/" + idLobby), { connected: true })
	}
})

//------------------------------------------------------------------------

// listens for database changes
onValue(gameRef, function (snapshot) {
	snapshot.forEach(() => {
		//if theres and existing url id them ill put it in the paragraph
		if (urlID) {
			player = 1
			//Gives it and ID and puts the Id code into innertext
			const idLobbyEl = document.getElementById("lobbyId")
			idLobbyEl.innerText = "Lobby ID:" + " " + urlID
		}
	})
})

//-----------------------------------------------------------------

function toggleBox(el, board) {
	//Check if gamestate is place boats
	if (gameState == "place boats") {
		console.log("placing boats...")

		// Checks if player is player 1
		if (player == player1) {
			console.log("player 1...")

			// if board isnt 1 return
			if (board != 1) return
			//Check if box is already "locked"
			if (el.classList !== "locked") {
				//Get parent element (div) of el (button) and get all elements
				const lockedElements = el.parentElement.querySelectorAll(".locked")
				//Check if locked elements is less than 11
				if (lockedElements.length < 2)
					//If not, lock box by adding class to element
					el.classList.add("locked")
				console.log("locked", el.id)

				//Check if box of locked elements is now equal to 11
				if (lockedElements.length + 1 === 2) {
					//Change text of paragraph
					document.querySelector("#pp").innerText = "Attack"
					gameState = "attack"
					//sets in  to database that p1 is ready
					if (player == player1) {
						update(ref(db, "lobbies/" + idLobby), { p1Ready: true })
					}
				}
			}
		}
		//Checks if player is player2
		if (player == player2) {
			console.log("player 2...")

			//if board isnt 2 return
			if (board != 2) return
			//Check if box is already "locked"
			if (el.classList !== "locked") {
				//Get parent element (div) of el (button) and get all elements
				const lockedElements = el.parentElement.querySelectorAll(".locked")
				//Check if locked elements is less than 11
				if (lockedElements.length < 2) {
					//If not, lock box by adding class to element
					el.classList.add("locked")
				}
				//Check if box of locked elements is now equal to 11
				if (lockedElements.length + 1 === 2) {
					//Change text of paragraph
					document.querySelector("#pp").innerText = "Attack"
					gameState = "attack"
					//sets in  to database that p2 is ready
					if (player == player2) {
						update(ref(db, "lobbies/" + idLobby), { p2Ready: true })
					}
				}
			}
		}
	}

	//------------------------------------------------------------------------

	//If gamestate isnt "place boats" run this
	if (gameState == "attack") {
		get(gameRef).then((snapshot) => {
			const data = snapshot.val()

			if (data.p1Ready == true && data.p2Ready == true) {
				console.log("attack...")
				if (player == player1) {
					console.log("player 1...")
					if (board != 2) return

					//Check if box is already "locked"
					if (el.classList !== "locked") {
						//Get parent element (div) of el (button) and get all elements
						const lockedElements = el.parentElement.querySelectorAll(".locked")
						//You can press once on the other board
						if (lockedElements.length < 1) {
							//If not, lock box by adding class to element
							el.classList.add("locked")
						}
					}
				}
				if (player == player2) {
					console.log("player 2...")
					if (board != 1) return

					//Check if box is already "locked"
					if (el.classList !== "locked") {
						//Get parent element (div) of el (button) and get all elements
						const lockedElements = el.parentElement.querySelectorAll(".locked")
						//You can press once on the other board
						if (lockedElements.length < 1) {
							//If not, lock box by adding class to element
							el.classList.add("locked")
						}
					}
				}
			}
		})
	}
}

// Function to switch turns
function switchTurns() {

	if (player === player1) {
		player = player2
	} else {
		player = player1
	}
	console.log(player)
}


switchTurns()
const buttonsClick = document.querySelectorAll("button")
const actionsText = document.getElementById("actions")
function hit(board) {
	if (player === player1) {
		if (board != 2) return
		if (gameState == "attack") {
			if (buttonsClick.classList.contains(".locked")) {
				buttonsClick.classList.add("boom")
				actionsText.innerText = "You hit the a boat"
			} else {
				actionsText.innerText = "You missed"
			}
		}
	}
	if (player === player2) {
		if (board != 1) return
		if (gameState == "attack") {
			if (!buttonsClick.classList.contains("locked")) {
				actionsText.innerText = "You missed"
			} else {
				buttonsClick.classList.add("boom")
				actionsText.innerText = "You hit the a boat"
			}
		}
	}
}
hit()
//------------------------------------------------------------------------

//function that creates all the buttons and divs
function init() {
	document.querySelector("#pp").innerText = "Click to place the boats"
	const boardSection = document.querySelector("#board")

	// Create divs that holds the boxes
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

			

			//Add div (with buttons) to left section
			boardSection.appendChild(newDiv)
		}
	}
}
//Ropar på att functionen ska starta
init()


