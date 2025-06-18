function showForm(id, event) {
  const forms = document.querySelectorAll('.form');
  const tabs = document.querySelectorAll('.tab-btn');

  forms.forEach(f => f.classList.remove('active'));
  tabs.forEach(t => t.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}

// Simple login redirect simulation
function handleLogin(event) {
  event.preventDefault();

  // You can add validation logic here
  window.location.href = "dashboard.html"; // or your real dashboard file
}
