<<<<<<< HEAD
import { db } from './firebase.js'
import { ref, push } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js'
=======
import { db } from "./firebase.js"
import { ref, push } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"

>>>>>>> 2ae0a4a70eb39fc288639f555cb4b1429d337941

//create lobby button
const creatEL = document.querySelector('.create-lobby')

//Adds eventListiner to see if the button is pressed
<<<<<<< HEAD
creatEL.addEventListener('click', async function(){

    
	// send to database and generates a random ID
	let pushes = await push(ref(db, 'lobbies/'),{
		p1Ready:false,
		p2Ready:false,
		connected: false,
	})
   
	window.location.href = '/game.html?id=' + pushes.key

   
=======
creatEL.addEventListener("click", async function () {
	// send to database and generates a random ID
	let pushes = await push(ref(db, "lobbies/"), {
		p1Ready: false,
		p2Ready: false,
		connected: false,
>>>>>>> 2ae0a4a70eb39fc288639f555cb4b1429d337941

	})
	//Change page you are on
	window.location.href = "/game.html?id=" + pushes.key
})

<<<<<<< HEAD
//Join lobby button
const joinEl = document.querySelector('#joinLob')
let input = document.querySelector('#input')
const joinInput = document.querySelector('.hidden')

joinEl.addEventListener('click', function(){
	joinInput.classList.remove('hidden')
	if(input.value){
		window.location.href = '/game.html?id=' + input.value
	}
    
     
=======
joinEl.addEventListener("click", function () {
	if (input.value) {
		//Puts you back in front page
		window.location.href = "/game.html?id=" + input.value
	}

>>>>>>> 2ae0a4a70eb39fc288639f555cb4b1429d337941
})

//------------------------------------------------
