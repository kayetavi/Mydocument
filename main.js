let selectedDMCode = null;

// Load the SVG and bind interaction logic
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

        // Clear old blinking
        blinkIntervals.forEach(interval => clearInterval(interval));
        blinkIntervals = [];

        svgRoot.querySelectorAll("text, tspan").forEach(txt => {
          txt.style.fill = "";
          txt.style.stroke = "";
          txt.style.strokeWidth = "";
          txt.style.filter = "";
        });

        let count = 0;
        svgRoot.querySelectorAll("text, tspan").forEach(txt => {
          const cleanText = txt.textContent.replace(/\s+/g, '').trim();
          if (cleanText === dmCode) {
            count++;
            let visible = true;
            const interval = setInterval(() => {
              if (visible) {
                txt.style.fill = "red";
                txt.style.stroke = "#00ffff";
                txt.style.strokeWidth = "3px";
                txt.style.filter = "drop-shadow(0 0 6px #00ffff) drop-shadow(0 0 12px red)";
              } else {
                txt.style.fill = "#00ffff";
                txt.style.stroke = "red";
                txt.style.strokeWidth = "3px";
                txt.style.filter = "drop-shadow(0 0 6px red) drop-shadow(0 0 12px #00ffff)";
              }
              visible = !visible;
            }, 500);
            blinkIntervals.push(interval);
          }
        });
      });
    });

    // Zoom and pan logic
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

// Modal controls
function openModal() {
  if (!selectedDMCode || !damageMechanisms[selectedDMCode]) {
    alert("No details found.");
    return;
  }
  showPopup(selectedDMCode);
}

function closeModal() {
  document.getElementById("popupModal").style.display = "none";
}

// Create tab layout
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

  const tabContent = document.createElement("div");
  tabContent.style.padding = "10px";
  tabContent.style.minHeight = "250px";
  tabContent.style.maxHeight = "400px";
  tabContent.style.overflowY = "auto";
  tabContent.style.border = "1px solid #ccc";
  tabContent.style.marginTop = "-1px";

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

// Stable popup window with fixed size
const showPopup = (dmId) => {
  const dmData = damageMechanisms[dmId];
  if (!dmData) {
    alert("No data available");
    return;
  }

  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "#fff";
  popup.style.border = "2px solid #444";
  popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
  popup.style.zIndex = "1000";
  popup.style.width = "700px";
  popup.style.maxWidth = "90vw";
  popup.style.minHeight = "450px";
  popup.style.maxHeight = "90vh";
  popup.style.overflowY = "auto";
  popup.style.padding = "15px";
  popup.style.borderRadius = "8px";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.marginBottom = "10px";
  closeBtn.onclick = () => popup.remove();

  popup.appendChild(closeBtn);
  popup.appendChild(createTabs(dmData));

  document.body.appendChild(popup);
};
