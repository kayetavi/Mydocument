let records = JSON.parse(localStorage.getItem("psvRecords")) || [];
let isEditing = true;

function showCard(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "viewCard") updateRecordList();
  if (id === "entryCard") {
    isEditing = true;
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("currentEditTag").value = "";
    setFormEditable(true);
  }
}

function setFormEditable(editable) {
  const inputs = document.querySelectorAll("#entryCard input, #entryCard select");
  inputs.forEach(i => i.disabled = !editable);
}

function enableEditing() {
  isEditing = true;
  setFormEditable(true);
  document.getElementById("editBtn").style.display = "none";
}

function saveData() {
  if (!isEditing) {
    alert("Click 'Edit' to enable editing.");
    return;
  }

  const tag = document.getElementById("tagInput").value.trim();
  const date = document.getElementById("dateInput").value.trim();
  const reason = document.getElementById("reasonInput").value.trim();
  const witness = document.getElementById("witnessInput").value.trim();

  if (!tag || !date || !reason || !witness) {
    alert("Please fill required fields: Tag No, Date, Reason, Witnessed By");
    return;
  }

  const formData = {
    tag,
    fields: Array.from(document.querySelectorAll("#formFields input, #formFields select")).map(e => e.value),
    test: Array.from(document.querySelectorAll("#testTable input, #testTable select")).map(e => e.value),
    footer: Array.from(document.querySelectorAll(".footer input, .footer select")).map(e => e.value)
  };

  const originalTag = document.getElementById("currentEditTag").value.trim();
  const idx = records.findIndex(r => r.tag === originalTag || r.tag === tag);
  if (idx >= 0) {
    records[idx] = formData;
  } else {
    records.push(formData);
  }

  // ✅ Save to localStorage
  localStorage.setItem("psvRecords", JSON.stringify(records));

  alert("Saved!");
  showCard("viewCard");
}

function updateRecordList() {
  const tbody = document.querySelector("#recordList tbody");
  tbody.innerHTML = "";
  records.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.tag}</td>
      <td>${r.fields[16]}</td>
      <td>${r.fields[0]}</td>
      <td>${r.footer[0]}</td>
      <td>
        <button onclick="loadRecord('${r.tag}')">👁 View</button>
        <button onclick="deleteRecord('${r.tag}')">🗑 Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function loadRecord(tag) {
  const record = records.find(r => r.tag === tag);
  if (!record) return;

  showCard("entryCard");
  isEditing = false;

  const fieldInputs = document.querySelectorAll("#formFields input, #formFields select");
  fieldInputs.forEach((e, i) => e.value = record.fields[i] || "");

  const testInputs = document.querySelectorAll("#testTable input, #testTable select");
  testInputs.forEach((e, i) => e.value = record.test[i] || "");

  const footerInputs = document.querySelectorAll(".footer input, .footer select");
  footerInputs.forEach((e, i) => e.value = record.footer[i] || "");

  document.getElementById("tagInput").value = record.tag;
  document.getElementById("currentEditTag").value = record.tag;
  setFormEditable(false);
  document.getElementById("editBtn").style.display = "inline-block";
}

function deleteRecord(tag) {
  if (confirm(`Delete record for ${tag}?`)) {
    records = records.filter(r => r.tag !== tag);
    localStorage.setItem("psvRecords", JSON.stringify(records));
    updateRecordList();
  }
}
