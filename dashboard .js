// Load PDF
function loadPDF(file, title, element) {
  const viewer = document.getElementById('pdfFrame');
  viewer.src = file;
  document.getElementById('docTitle').innerText = "📄 " + title;
  updateActiveItem(element);
}

// Load Word/Excel/PPT via Google Docs Viewer
function loadDoc(file, title, element) {
  const base = location.origin + '/' + file;
  const viewerURL = 'https://docs.google.com/gview?url=' + encodeURIComponent(base) + '&embedded=true';
  const frame = document.getElementById('pdfFrame');
  frame.outerHTML = `<iframe id="pdfFrame" src="${viewerURL}"></iframe>`;
  document.getElementById('docTitle').innerText = "📄 " + title;
  updateActiveItem(element);
}

// Highlight selected document
function updateActiveItem(element) {
  const allItems = document.querySelectorAll('.submenu li');
  allItems.forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');
  document.getElementById('sidebar').classList.remove('active');
}

// Filter by search
function filterList() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const folders = document.querySelectorAll('#docList > li');

  folders.forEach(folder => {
    const submenu = folder.querySelector('.submenu');
    const items = submenu.querySelectorAll('li');
    let anyVisible = false;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(filter)) {
        item.style.display = '';
        anyVisible = true;
      } else {
        item.style.display = 'none';
      }
    });

    submenu.style.display = anyVisible ? 'block' : 'none';
    folder.querySelector('.arrow').textContent = anyVisible ? '▼' : '▶️';
  });
}

// Toggle submenu
function toggleSubmenu(folderDiv) {
  const submenu = folderDiv.nextElementSibling;
  const arrow = folderDiv.querySelector('.arrow');
  if (submenu.style.display === 'block') {
    submenu.style.display = 'none';
    arrow.textContent = '▶️';
  } else {
    submenu.style.display = 'block';
    arrow.textContent = '▼';
  }
}

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Sidebar mobile toggle
document.getElementById('toggleSidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('active');
});

// Local PDF upload
document.getElementById('localFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    const url = URL.createObjectURL(file);
    document.getElementById('pdfFrame').src = url;
    document.getElementById('docTitle').innerText = "📄 " + file.name;
  } else {
    alert("Please select a valid PDF file.");
  }
});

// Add folders & files
document.getElementById("docList").innerHTML = `
  <li>
    <div class="folder-label" onclick="toggleSubmenu(this)">📂 P&ID <span class="arrow">▶️</span></div>
    <ul class="submenu">
      <li onclick="loadPDF('E-182b-reac.pdf', 'P&ID 1 - Reactor', this)">📄 P&ID 1 - Reactor</li>
      <li onclick="loadDoc('UTG_REPORT.xlsx', 'P&ID 2 - Furnace', this)">📊 P&ID 2 - Furnace (Excel)</li>
      <li onclick="loadPDF('fractionator.pdf', 'P&ID 3 - Fractionator', this)">📄 P&ID 3 - Fractionator</li>
    </ul>
  </li>

  <li>
    <div class="folder-label" onclick="toggleSubmenu(this)">📂 GAD <span class="arrow">▶️</span></div>
    <ul class="submenu">
      <li onclick="loadPDF('gad1.pdf', 'GAD 1 - Overview', this)">📄 GAD 1 - Overview</li>
      <li onclick="loadPDF('gad2.pdf', 'GAD 2 - Structural', this)">📄 GAD 2 - Structural</li>
    </ul>
  </li>

  <li>
    <div class="folder-label" onclick="toggleSubmenu(this)">📂 Other Files <span class="arrow">▶️</span></div>
    <ul class="submenu">
      <li onclick="loadPDF('layout.pdf', 'Equipment Layout', this)">📄 Equipment Layout</li>
      <li onclick="loadPDF('line-list.pdf', 'Line List', this)">📄 Line List</li>
      <li onclick="loadDoc('report.docx', 'Monthly Report (Word)', this)">📄 Monthly Report (Word)</li>
      <li onclick="loadDoc('presentation.pptx', 'Review Slides (PPT)', this)">📊 Review Slides (PPT)</li>
    </ul>
  </li>
`;

// Collapse all by default
document.querySelectorAll('.submenu').forEach(sub => sub.style.display = 'none');
