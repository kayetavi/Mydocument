let selectedDMCode = null;

// Load SVG and setup interactions
fetch("HCU-Model-Final.svg")
  .then(res => res.text())
  .then(data => {
    document.getElementById("svgContainer").innerHTML = data;

    const svgRoot = document.querySelector("#svgContainer svg");
    const dmListItems = document.querySelectorAll("#dm-list li");
    let blinkIntervals = [];

    if (!svgRoot.getAttribute("viewBox")) {
      const vb = svgRoot.getBBox();
      svgRoot.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
    }

    const viewBox = svgRoot.viewBox.baseVal;

    dmListItems.forEach(item => {
      item.addEventListener("click", () => {
        const dmCode = item.getAttribute("data-dm").trim();
        selectedDMCode = dmCode;

        document.getElementById("showDetailsMsg").style.display = "inline-block";

        // Stop previous blinking
        blinkIntervals.forEach(interval => clearInterval(interval));
        blinkIntervals = [];

        svgRoot.querySelectorAll("text, tspan").forEach(txt => {
          txt.style.fill = "";
          txt.style.stroke = "";
          txt.style.strokeWidth = "";
          txt.style.filter = "";
        });

        svgRoot.querySelectorAll("text, tspan").forEach(txt => {
          const cleanText = txt.textContent.replace(/\s+/g, '').trim();
          if (cleanText === dmCode) {
            let visible = true;
            const interval = setInterval(() => {
              txt.style.fill = visible ? "red" : "#00ffff";
              txt.style.stroke = visible ? "#00ffff" : "red";
              txt.style.strokeWidth = "3px";
              txt.style.filter = visible
                ? "drop-shadow(0 0 6px #00ffff) drop-shadow(0 0 12px red)"
                : "drop-shadow(0 0 6px red) drop-shadow(0 0 12px #00ffff)";
              visible = !visible;
            }, 500);
            blinkIntervals.push(interval);
          }
        });
      });
    });

    // Pan and zoom
    let isPanning = false;
    let startX, startY;

    svgRoot.addEventListener("mousedown", (e) => {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      svgRoot.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      isPanning = false;
      svgRoot.style.cursor = "grab";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanning) return;
      const dx = (e.clientX - startX) * (viewBox.width / svgRoot.clientWidth);
      const dy = (e.clientY - startY) * (viewBox.height / svgRoot.clientHeight);
      viewBox.x -= dx;
      viewBox.y -= dy;
      startX = e.clientX;
      startY = e.clientY;
    });

    svgRoot.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const scale = e.deltaY < 0 ? 1 / zoomFactor : zoomFactor;
      viewBox.width *= scale;
      viewBox.height *= scale;
    });
  });

function openModal() {
  if (!selectedDMCode || !damageMechanisms[selectedDMCode]) {
    alert("No details found.");
    return;
  }
  showPopup(selectedDMCode);
}

function closeModal() {
  const modalOverlay = document.getElementById("popupOverlay");
  if (modalOverlay) {
    modalOverlay.remove();
  }
}

const createTabs = (dmData) => {
  const tabTitles = [
    "description", "affectedUnits", "mitigation",
    "inspection", "appearance", "criticalFactors", "temperatureComparison"
  ];

  const container = document.createElement("div");
  container.style.padding = "10px";

  const tabHeader = document.createElement("ul");
  tabHeader.style.display = "flex";
  tabHeader.style.listStyle = "none";
  tabHeader.style.margin = "0";
  tabHeader.style.padding = "0";
  tabHeader.style.borderBottom = "1px solid #ccc";
  tabHeader.style.position = "sticky";
  tabHeader.style.top = "0";
  tabHeader.style.background = "#fff";
  tabHeader.style.zIndex = "10";

  const tabContent = document.createElement("div");
  tabContent.style.padding = "10px";

  tabTitles.forEach((key, i) => {
    if (!dmData[key]) return;

    const tab = document.createElement("li");
    tab.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    tab.style.cursor = "pointer";
    tab.style.padding = "10px 15px";
    tab.style.border = "1px solid #ccc";
    tab.style.borderBottom = "none";
    tab.style.background = i === 0 ? "#fff" : "#eee";
    tab.addEventListener("click", () => {
      Array.from(tabHeader.children).forEach(li => li.style.background = "#eee");
      tab.style.background = "#fff";
      tabContent.innerHTML = dmData[key];
    });

    tabHeader.appendChild(tab);
    if (i === 0) tabContent.innerHTML = dmData[key];
  });

  container.appendChild(tabHeader);
  container.appendChild(tabContent);
  return container;
};

const showPopup = (dmId) => {
  const dmData = damageMechanisms[dmId];
  if (!dmData) {
    alert("No data available");
    return;
  }

  // Remove any existing popup
  const existing = document.getElementById("popupOverlay");
  if (existing) existing.remove();

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "popupOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.backdropFilter = "blur(6px)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  // Modal
  const modal = document.createElement("div");
  modal.style.background = "#fff";
  modal.style.width = "60%";
  modal.style.maxHeight = "80vh";
  modal.style.overflowY = "auto";
  modal.style.padding = "20px";
  modal.style.borderRadius = "8px";
  modal.style.position = "relative";
  modal.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";

  // Close Button
  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "15px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.cursor = "pointer";
  closeBtn.title = "Close";
  closeBtn.onclick = closeModal;

  modal.appendChild(closeBtn);
  modal.appendChild(createTabs(dmData));

  overlay.appendChild(modal);

  // Close on click outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);
};
