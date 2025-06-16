
function loadPDF(file, title, element) {
  document.getElementById('pdfFrame').src = file;
  document.getElementById('docTitle').innerText = "📄 " + title;

  const allItems = document.querySelectorAll('#docList li');
  allItems.forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');
}

function filterList() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const items = document.querySelectorAll('#docList li');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filter)) {
      item.style.display = '';
    } else {
      if (!item.querySelector('ul')) item.style.display = 'none';
    }
  });
}

function previewPDF() {
  const fileInput = document.getElementById('pdfUpload');
  const file = fileInput.files[0];
  if (file && file.type === "application/pdf") {
    const fileURL = URL.createObjectURL(file);
    document.getElementById('pdfFrame').src = fileURL;
    document.getElementById('docTitle').innerText = "📄 " + file.name;
  } else {
    alert("Please select a valid PDF file.");
  }
}
