<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>API 571 Damage Mechanism Dashboard</title>
  <link rel="stylesheet" href="style.css"/>
  
<!-- ✅ Paste these favicon links BELOW the CSS line -->
  <link rel="apple-touch-icon" sizes="180x180" href="image/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="image/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="image/favicon-16x16.png">
  <link rel="manifest" href="image/site.webmanifest">
  <link rel="icon" type="image/png" href="image/favicon.png" />

  
  <style>
    .tab-content { display: none; margin-top: 20px; }
    label { display: block; margin-top: 10px; }
    input, select { width: 200px; }
    #result, #corrosionResult, #corrosionResultFull {
      margin-top: 20px; padding: 10px; border: 1px solid #ccc; background: #f9f9f9;
    }
    .category { cursor: pointer; font-weight: bold; margin-top: 10px; display: block; }
    .mechanisms { display: none; list-style-type: circle; margin-left: 20px; }
    .mechanisms li { margin: 5px 0; }
    footer.footer {
      margin-top: 30px; padding: 10px; background-color: #f0f0f0; text-align: center; border-top: 1px solid #ccc;
    }
    /* ✅ Background image for login */
    .login-background {
      background: url('images/bg.jpg') no-repeat center center / cover;
      background-size: cover;
      background-position: center;
    }
  </style>
</head>

<!-- ✅ Keep body tag simple -->
<body>
  <script>
    const user = localStorage.getItem("loggedInUser");

    // ✅ Redirect to login page if not logged in
    if (!user && !window.location.href.includes("login.html")) {
      window.location.href = "login.html";
    }

    // ✅ Add background image only on login.html
    if (window.location.href.includes("login.html")) {
      document.body.classList.add("login-background");
    }

     </script>

  <div class="dashboard">
    <div class="top-bar">
      <h2 id="welcome">Welcome to API 571 Damage Mechanism Dashboard</h2>
      <div class="settings-menu">
        <button id="settingsBtn" type="button">⚙️ Settings</button>
        <div class="dropdown-content" id="dropdownContent">
          <button onclick="exportToPDF()">Export PDF</button>
          <button onclick="exportToExcel()">Export Excel</button>
          <button onclick="toggleDarkMode()">Toggle Light/Dark Mode</button>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="sidebar">
        <h3>Damage Categories</h3>
        <input type="text" id="searchBox" placeholder="Search Mechanism..." />
        <ul id="categoryList"></ul>
      </div>

      <div class="content">
        <h3 id="selectedMechanismTitle">Select a Damage Mechanism</h3>
        <div id="mechanismDetailsContainer"></div>

        <div class="tab-content" id="criteriaTab">
          <h3>Damage Mechanism Finder (API 581)</h3>
          <form id="filterForm">
            <label>Material:<select id="material"><option>Carbon Steel</option><option>304 SS</option><option>316 SS</option><option>5Cr-0.5Mo</option><option>9Cr-1Mo</option></select></label>
            <label>Max Temperature (°C):<input type="number" id="temperature" /></label>
            <label>Min Temperature (°C):<input type="number" id="mintemp" /></label>
            <label>Environment:<input type="text" id="environment" placeholder="e.g., Wet H2S, Amine" /></label>
            <label>pH:<input type="number" id="ph" step="0.1" /></label>
            <label>H₂ Partial Pressure (MPa):<input type="number" id="h2pp" step="0.1" /></label>
            <label>Chloride (ppm):<input type="number" id="chloride" /></label>
            <label>Flow:<select id="flow"><option>Turbulent</option><option>Stagnant</option></select></label>
            <label>Sulfur Content (%):<input type="number" id="sulfur" step="0.01" /></label>
            <label>Fluid Phase:<select id="phase"><option>Liquid</option><option>Gas</option><option>Two-phase</option></select></label>
            <label>Welded Component:<select id="weld"><option>Yes</option><option>No</option></select></label>
            <label>Insulated:<select id="insulated"><option>Yes</option><option>No</option></select></label>
            <label>Exposed to Moisture:<select id="exposed"><option>Yes</option><option>No</option></select></label>
            <label>Cyclic Conditions:<select id="cycled"><option>Yes</option><option>No</option></select></label>
            <button type="submit">Find Damage Mechanisms</button>
          </form>
          <div id="result" style="display:none;"></div>
        </div>

        <div class="tab-content" id="corrosionRateTab">
          <h3>🛠️ Damage Mechanism – Corrosion Rate Estimator</h3>
          <label>Select Damage Mechanism:
            <select id="dmSelector" onchange="loadCriteria()"></select>
          </label>
          <div id="criteriaForm"></div>
          <button onclick="calculateCorrosion()">🔍 Calculate</button>
          <div id="corrosionResult"></div>
        </div>

        <div class="tab-content" id="corrosionFullTab">
          <header class="header">
            <h1> Corrosion Rate Dashboard</h1>
          </header>

          <main class="main-content">
            <div class="form-section">
              <label for="dmSelectFull">⚙️ Select Damage Mechanism:</label>
              <select id="dmSelectFull">
                <option value="">-- Choose Mechanism --</option>
                <option value="Alkaline Sour Water Corrosion">Alkaline Sour Water Corrosion</option>
                 <option value="Acid Sour Water Corrosion">Acid Sour Water Corrosion</option>
                <option value="cui">CUI (Corrosion Under Insulation)</option>
                <option value="co2">CO₂ Corrosion</option>
                <option value="oxidation">High-temperature Oxidation</option>
                <option value="HCl Corrosion">HCl Corrosion</option>
                <option value="H2SO4 Corrosion">H2SO4 Corrosion</option>
                <option value="sulfidation">Sulfidation & NAP Acid Corrosion</option>
              </select>
              <div id="formContainerFull"></div>
              <button id="calculateBtnFull">🚀 Calculate Corrosion Rate</button>
            </div>
            <div id="corrosionResultFull" class="result-section"></div>
          </main>
          
        </div>
      </div>
    </div>
    <footer class="footer">
  <div class="footer-links">
    <a href="about.html">About</a> |
    <a href="privacy.html">Privacy</a> |
    <a href="contact.html">Contact</a>
  </div>
  <div class="footer-credit">
    &copy; 2025 | Created by Avijit Kayet | Email: avijitkayet97@gmail.com
  </div>
    </footer>
  </div>

  <script src="data.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script src="dashboard.js"></script>
  <script src="script.js"></script>
  <script>
    const settingsBtn = document.getElementById("settingsBtn");
    const dropdown = document.getElementById("dropdownContent");
    settingsBtn.addEventListener("click", e => { e.stopPropagation(); dropdown.classList.toggle("show"); });
    window.addEventListener("click", () => dropdown.classList.remove("show"));

    function toggleCategory(element) {
      const ul = element.nextElementSibling;
      ul.style.display = ul.style.display === "block" ? "none" : "block";
    }

    function showCriteriaTab() {
      document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
      document.getElementById("criteriaTab").style.display = "block";
      document.getElementById("selectedMechanismTitle").style.display = "none";
    }

    function showCorrosionTab() {
      document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
      document.getElementById("corrosionRateTab").style.display = "block";
      document.getElementById("selectedMechanismTitle").style.display = "none";
    }

    function showCorrosionFullTab() {
      document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
      document.getElementById("corrosionFullTab").style.display = "block";
      document.getElementById("selectedMechanismTitle").style.display = "none";
    }

    function clearMechanismDetails() {
      document.getElementById("mechanismDetailsContainer").innerHTML = "";
      document.getElementById("selectedMechanismTitle").textContent = "Select a Damage Mechanism";
      document.getElementById("selectedMechanismTitle").style.display = "block";
    }

    function injectAPI581Category() {
      const categoryList = document.getElementById("categoryList");
      const api581 = document.createElement("li");
      api581.innerHTML = `
  <span class="category" onclick="toggleCategory(this)">▶ API 581</span>
  <ul class="mechanisms" style="display:none;">
    <li><a href="#" onclick="hideAllMainPanels(); showCriteriaTab()">Criteria of Finding Damage Mechanism</a></li>
    <li><a href="#" onclick="hideAllMainPanels(); showCorrosionFullTab()">Damage Mechanism – Corrosion Rate Estimator</a></li>
  </ul>
`;

      categoryList.appendChild(api581);
    }

    window.addEventListener("DOMContentLoaded", () => {
      loadCategories(data);
      injectAPI581Category();
    });
  </script>

  <!-- ✅ Auto Logout After 10 Minutes of Inactivity -->
<script>
  let inactivityTimer;

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      alert("⚠️ Session expired due to 10 minutes of inactivity.");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/API-Damage-Mechanism"; // ✅ Correct path for GitHub Pages
    }, 600000); // 10 minutes
  }

  window.onload = resetInactivityTimer;
  document.onmousemove = resetInactivityTimer;
  document.onkeydown = resetInactivityTimer;
  document.onclick = resetInactivityTimer;
  document.onscroll = resetInactivityTimer;
</script>

  
</body>
</html>
