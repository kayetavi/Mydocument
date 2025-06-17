import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDysRpcubPyUY8P1CYse2E_nkzsv9HcBkE",
  authDomain: "hcu-mydocument.firebaseapp.com",
  projectId: "hcu-mydocument",
  storageBucket: "hcu-mydocument.appspot.com",
  messagingSenderId: "812100927727",
  appId: "1:812100927727:web:3ee1b237beceac0d8b9b1a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);