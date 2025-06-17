// script.js
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from './firebase.js';
const auth = getAuth(app);

// LOGIN
if (document.getElementById("login-btn")) {
  document.getElementById("login-btn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => window.location.href = "dashboard.html")
      .catch(e => alert(e.message));
  };
}

// SIGNUP
if (document.getElementById("signup-btn")) {
  document.getElementById("signup-btn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => alert("Signup successful. Please login."))
      .catch(e => alert(e.message));
  };
}

// FORGOT
if (document.getElementById("forgot-btn")) {
  document.getElementById("forgot-btn").onclick = () => {
    const email = document.getElementById("email").value;
    sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset link sent"))
      .catch(e => alert(e.message));
  };
}

// LOGOUT
if (document.getElementById("logout-btn")) {
  document.getElementById("logout-btn").onclick = () => {
    signOut(auth).then(() => window.location.href = "login.html");
  };
}
