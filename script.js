// script.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");

document.getElementById("signup").addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      message.innerText = "✅ Sign up successful";
    })
    .catch(e => {
      message.innerText = "❌ " + e.message;
    });
});

document.getElementById("login").addEventListener("click", () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      message.innerText = "✅ Login successful";
      window.location.href = "dashboard.html";
    })
    .catch(e => {
      message.innerText = "❌ " + e.message;
    });
});

document.getElementById("forgot").addEventListener("click", () => {
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      message.innerText = "📩 Password reset link sent to email";
    })
    .catch(e => {
      message.innerText = "❌ " + e.message;
    });
});
