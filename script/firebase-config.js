 // Import the functions you need from the SDKs you need

 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

 // TODO: Add SDKs for Firebase products that you want to use

 // https://firebase.google.com/docs/web/setup#available-libraries


 // Your web app's Firebase configuration

 const firebaseConfig = {

   apiKey: "AIzaSyA4GsPxTJ8678dQBadaP-LYIlHV4bpudyc",

   authDomain: "pronia-store.firebaseapp.com",

   databaseURL: "https://pronia-store-default-rtdb.firebaseio.com",

   projectId: "pronia-store",

   storageBucket: "pronia-store.appspot.com",

   messagingSenderId: "387720620718",

   appId: "1:387720620718:web:d1e3d40428097bb1285b3f"

 };


 // Initialize Firebase

 const app = initializeApp(firebaseConfig);

 export default app;
