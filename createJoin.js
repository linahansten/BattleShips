import { db } from "./firebase.js"
import { ref, push } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";

    // send to database and generates a random ID
    let pushes = await push(ref(db, "lobbies/"),{
        p1Ready:false,
        p2Ready:false,
        connected: false,
    })

//create lobby button
const creatEL = document.querySelector(".create-lobby")
//Adds eventListiner to see if the button is pressed
creatEL.addEventListener("click", async function(){
    
    window.location.href = '/game.html?id=' + pushes.key

})
//Join lobby button
const joinEl = document.querySelector("#confirm-join")
let input = document.querySelector("#input")

joinEl.addEventListener("click", function(){
    if(input.value){
        window.location.href = '/game.html?id=' + pushes.key
    }
    console.log("fuck my life")
})

//------------------------------------------------
