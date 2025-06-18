function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  localStorage.setItem("user", JSON.stringify({ username, password }));
  alert("Account created! Please login.");
  window.location.href = "login.html";
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const stored = JSON.parse(localStorage.getItem("user"));

  if (!stored) {
    alert("No user found. Please sign up.");
  } else if (stored.username === username && stored.password === password) {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials.");
  }
}
