// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgFCM5QZkY3rpxr5crSV84364Oav1IL0A",
  authDomain: "battle-ships-95e11.firebaseapp.com",
  projectId: "battle-ships-95e11",
  storageBucket: "battle-ships-95e11.appspot.com",
  messagingSenderId: "721655809959",
  appId: "1:721655809959:web:7736b0045d3824d6ed5882",
  databaseURL:"https://battle-ships-95e11-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//------------------------------------------------

let gameState = "place boats"

function toggleBox(el, board) {
//Check if gamestate is place boats
    if(gameState =="place boats"){

        if(board != 1) return
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
        if (lockedElements.length+1 === 11) {
            //Change text of paragraph
            document.querySelector("#pp").innerText = "Attack"
            gameState = "attack"
            }
        }
    }
    //If gamestate isnt place boats run this
    if (gameState =="attack"){
        if(board != 2) return
 //Check if box is already "locked"
 if (el.classList !== "locked") {
    //Get parent element (div) of el (button) and get all elements
    const lockedElements = el.parentElement.querySelectorAll(".locked")

        //Check if locked elements is less than 11
        if (lockedElements.length < 1){
        //If not, lock box by adding class to element
        el.classList.add("locked")

        console.log("locked", el.id)
        }
    }

}
}

    
function generateNumbers(el) {
    // 1. Check if any box are locked
    const lockedElements = el.parentElement.querySelectorAll(".locked")

    //Check if locked elements is less than 11
    if (lockedElements.length < 11) {
        for (let i = lockedElements.length; i < 11;) {
            //Generate random boxs between 1-40
            const rNumber = Math.floor(Math.random() * 40) + 1

            //Get button with the random boxs
            const button = document.getElementById(el.parentElement.id + "-" + rNumber
            )
            console.log(button)
            //If NOT locked , add locked class
            if (button.classList != "locked") {
                button.classList.add("locked")
                i++
            }
        }
    }

}

function init() {
    document.querySelector("#pp").innerText ="Place the boats"

    const leftSection = document.querySelector("#left")

    // Create divs that holds the box
    for (let j = 1; j < 3; j++) {
        const newDiv = document.createElement("div")
        newDiv.id = j;
        //Create buttons inside every div
        for (let i = 1; i < 65; i++) {
            const newButton = document.createElement("button")

            //Set id on button
            newButton.id = newDiv.id + "-" + i 
            //Set text on button
            //newButton.innerText = i
            //Set ononclick on button
            newButton.onclick = function () {
                toggleBox(this, j)
            }
            //Add button inside div
            newDiv.appendChild(newButton)
        }

        //Add div (with buttons) to left section
        leftSection.appendChild(newDiv)
    }
}
//Ropar på att functionen ska starta
init()

