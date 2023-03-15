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
	if (snapshot.exists()) {
		idLobby = urlID
	} else {
		window.location.href = "/"
	}
	// }).catch((error) => {
	// 	console.error(error)

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
})

//------------------------------------------------------------------------

// listens for database changes
onValue(gameRef, function (snapshot) {
	snapshot.forEach(() => {
		//if theres and existing url id them ill put it in the paragraph
		if (urlID) {
			//Gives it and ID and puts the Id code into innertext
			const idLobbyEl = document.getElementById("lobbyId")
			idLobbyEl.innerText = "Lobby ID:" + " " + urlID

		}


		let CheckCon = get(ref(db, "lobbies/"))

		if (CheckCon.val) {
			// Check if connected is true, set player = 2
			player = 2
		} else {
			// Else, set connected = true and player = 1
			player = 1
			update(ref(db, "lobbies/" + idLobby), { connected: true })
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
//----------------------------------------------------------------------
// Function to switch turns
function switchTurns() {

	if (player === player1) {
		player = player2
	} else {
		player = player1
	}
}
switchTurns()

const buttonsClick = document.querySelector("button")

function hit(board) {
	if (player === player1) {
		if (board !== 2) return
		if (gameState === "attack") {
			if (buttonsClick.classList.contains("locked")) {
				buttonsClick.classList.add("boom")
				document.querySelector("#pp").innerText = "You hit a boat"
			} else {
				document.querySelector("#pp").innerText = "You missed"
			}

		}
	} console.log("hej")
	if (player === player2) {
		if (board != 1) return
		if (gameState == "attack") {
			if (!buttonsClick.classList.contains("locked")) {
				document.querySelector("#p").innerText = "You missed"
			} else {
				buttonsClick.classList.add("boom")
				document.querySelector("#p").innerText = "You hit a boat"
			}
		}
	}
}
hit()
//------------------------------------------------------------------------

//function that creates all the buttons and divs
function init() {
	document.querySelector("#pp").innerText = "Place the boats"
	const boardSection = document.querySelector("#boardContainer")

	// Create divs that holds the boxes
	for (let j = 1; j < 3; j++) {
		const newDiv = document.createElement("div")
		newDiv.id = "board" + j

		//Create buttons inside every div
		for (let i = 1; i < 82; i++) {
			const newButton = document.createElement("button")

			//Set id on button
			newButton.id = newDiv.id + "-" + i

			if (newButton.id == "board1-1") {
				newButton.innerText = "A"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-10") {
				newButton.innerText = "B"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-19") {
				newButton.innerText = "C"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-28") {
				newButton.innerText = "D"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-37") {
				newButton.innerText = "E"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-46") {
				newButton.innerText = "F"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-55") {
				newButton.innerText = "G"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-64") {
				newButton.innerText = "H"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-73") {
				newButton.classList.add("null")
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-74") {
				newButton.innerText = "1"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-75") {
				newButton.innerText = "2"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-76") {
				newButton.innerText = "3"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-77") {
				newButton.innerText = "4"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-78") {
				newButton.innerText = "5"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-79") {
				newButton.innerText = "6"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-80") {
				newButton.innerText = "7"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board1-81") {
				newButton.innerText = "8"
				newButton.classList.add("selected-blue")
			} else if (newButton.id == "board2-1") {
				newButton.innerText = "A"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-10") {
				newButton.innerText = "B"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-19") {
				newButton.innerText = "C"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-28") {
				newButton.innerText = "D"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-37") {
				newButton.innerText = "E"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-46") {
				newButton.innerText = "F"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-55") {
				newButton.innerText = "G"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-64") {
				newButton.innerText = "H"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-73") {
				newButton.classList.add("null")
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-74") {
				newButton.innerText = "1"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-75") {
				newButton.innerText = "2"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-76") {
				newButton.innerText = "3"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-77") {
				newButton.innerText = "4"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-78") {
				newButton.innerText = "5"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-79") {
				newButton.innerText = "6"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-80") {
				newButton.innerText = "7"
				newButton.classList.add("selected-red")
			} else if (newButton.id == "board2-81") {
				newButton.innerText = "8"
				newButton.classList.add("selected-red")
			}

			//Set ononclick on button
			newButton.onclick = function () {
				if (newButton.classList == "selected-red" || newButton.classList == "selected-blue") {
					console.log("you cant place a boat there")
				} else { toggleBox(this, j) }

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


