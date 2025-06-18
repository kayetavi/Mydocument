function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Dummy check
  if (username && password) {
    localStorage.setItem('loggedInUser', username); // store username
    window.location.href = 'dashboard.html';
  } else {
    alert("Please enter both username and password");
  }
}