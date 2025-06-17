// auth.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from './firebase.js';

const auth = getAuth(app);

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => window.location.href = "dashboard.html")
      .catch(e => alert(e.message));
  };
}

// SIGN UP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.onsubmit = (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => alert("Signup successful, please login."))
      .catch(e => alert(e.message));
  };
}

// FORGOT PASSWORD
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.onsubmit = (e) => {
    e.preventDefault();
    const email = forgotForm.email.value;

    sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset email sent!"))
      .catch(e => alert(e.message));
  };
}