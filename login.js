function login() {
  const username = document.getElementById('username').value;

  if (username.trim() === '') {
    alert('Please enter a username');
    return;
  }

  // Store username for dashboard
  localStorage.setItem('loggedInUser', username);

  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}
