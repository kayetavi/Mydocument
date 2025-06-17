// script.js
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from './firebase.js';

const auth = getAuth(app);
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");

document.getElementById("signup").onclick = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => message.innerText = "✅ Sign Up Success")
    .catch(e => message.innerText = "❌ " + e.message);
};

document.getElementById("login").onclick = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      message.innerText = "✅ Login Success";
      window.location.href = "dashboard.html";
    })
    .catch(e => message.innerText = "❌ " + e.message);
};

document.getElementById("forgot").onclick = () => {
  sendPasswordResetEmail(auth, email.value)
    .then(() => message.innerText = "✅ Password reset link sent to your email.")
    .catch(e => message.innerText = "❌ " + e.message);
};
