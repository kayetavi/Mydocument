import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Signup successful!"))
    .catch(err => alert("Error: " + err.message));
}

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => alert("Login failed: " + err.message));
}

window.resetPassword = function () {
  const email = document.getElementById("email").value;
  sendPasswordResetEmail(auth, email)
    .then(() => alert("Reset email sent!"))
    .catch(err => alert("Error: " + err.message));
}

window.logout = function () {
  signOut(auth).then(() => {
    alert("Logged out");
    window.location.href = "index.html";
  });
}