// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js"
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js"

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
	databaseURL: "https://battle-ships-95e11-default-rtdb.europe-west1.firebasedatabase.app/"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// initializes Realtime Database and get a reference service
export const db = getDatabase(app)