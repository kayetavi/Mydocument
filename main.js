let selectedDMCode = null;

// Load the SVG and bind interaction logic
fetch("HCU-Model-Final.svg")
  .then(res => res.text())
  .then(data => {
    document.getElementById("svgContainer").innerHTML = data;

    const svgElement = document.querySelector("#svgContainer svg");
    const dmListItems = document.querySelectorAll("#dm-list li");
    let blinkIntervals = [];

    // ✅ SVG Styling to prevent clipping
    svgElement.style.width = "100%";
    svgElement.style.height = "auto";
    svgElement.style.overflow = "visible";
    svgElement.style.maxWidth = "none";
    svgElement.style.cursor = "grab";
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // ✅ Add viewBox if missing
    if (!svgElement.hasAttribute("viewBox")) {
      const vb = svgElement.getBBox();
      svgElement.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
    }

    const viewBox = svgElement.viewBox.baseVal;

    // ✅ Pan and Zoom
    let isPanning = false, startX, startY;

    svgElement.addEventListener("mousedown", (e) => {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      svgElement.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      isPanning = false;
      svgElement.style.cursor = "grab";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanning) return;
      const dx = (e.clientX - startX) * (viewBox.width / svgElement.clientWidth);
      const dy = (e.clientY - startY) * (viewBox.height / svgElement.clientHeight);
      viewBox.x -= dx;
      viewBox.y -= dy;
      startX = e.clientX;
      startY = e.clientY;
    });

    svgElement.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const scale = e.deltaY < 0 ? 1 / zoomFactor : zoomFactor;
      const mx = e.offsetX / svgElement.clientWidth;
      const my = e.offsetY / svgElement.clientHeight;
      const wx = viewBox.x + mx * viewBox.width;
      const wy = viewBox.y + my * viewBox.height;

      viewBox.width *= scale;
      viewBox.height *= scale;
      viewBox.width = Math.max(100, Math.min(10000, viewBox.width));
      viewBox.height = Math.max(100, Math.min(10000, viewBox.height));
      viewBox.x = wx - mx * viewBox.width;
      viewBox.y = wy - my * viewBox.height;
    });

    // ✅ Click DM item: Highlight + Blink
    dmListItems.forEach(item => {
      item.addEventListener("click", () => {
        const dmCode = item.getAttribute("data-dm").trim();
        selectedDMCode = dmCode;
        document.getElementById("showDetailsMsg").style.display = "inline-block";

        // Stop previous blinking
        blinkIntervals.forEach(interval => clearInterval(interval));
        blinkIntervals = [];

        // Reset previous highlights
        svgElement.querySelectorAll("text, tspan").forEach(txt => {
          txt.style.fill = "";
          txt.style.stroke = "";
          txt.style.strokeWidth = "";
          txt.style.filter = "";
        });

        // Highlight matching DM codes
        const matchingTexts = Array.from(svgElement.querySelectorAll("text, tspan")).filter(txt =>
  txt.textContent.includes(dmCode)
);

        matchingTexts.forEach(txt => {
          let visible = true;
          const interval = setInterval(() => {
            txt.style.fill = visible ? "red" : "";
            txt.style.stroke = visible ? "black" : "";
            txt.style.strokeWidth = visible ? "1px" : "";
            txt.style.filter = visible ? "drop-shadow(0 0 2px yellow)" : "";
            visible = !visible;
          }, 500);
          blinkIntervals.push(interval);
        });
      });
    });
  });

// ✅ Open modal popup
function openModal() {
  if (!selectedDMCode || !damageMechanisms[selectedDMCode]) {
    alert("No details found.");
    return;
  }
  showPopup(selectedDMCode);
}

// ✅ Close modal
function closeModal() {
  document.getElementById("popupModal").style.display = "none";
}

// ✅ Tabs generator
const createTabs = (dmData) => {
  const tabTitles = [
    "description",
    "affectedUnits",
    "mitigation",
    "inspection",
    "appearance",
    "criticalFactors",
    "temperatureComparison"
  ];

  const container = document.createElement("div");
  container.style.padding = "10px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.height = "calc(100vh - 100px)";

  const tabHeader = document.createElement("ul");
  tabHeader.style.display = "flex";
  tabHeader.style.listStyle = "none";
  tabHeader.style.margin = "0";
  tabHeader.style.padding = "0";
  tabHeader.style.borderBottom = "1px solid #ccc";

  const tabContent = document.createElement("div");
  tabContent.style.padding = "15px";
  tabContent.style.flex = "1";
  tabContent.style.overflowY = "auto";
  tabContent.style.border = "1px solid #ccc";
  tabContent.style.marginTop = "-1px";
  tabContent.style.background = "#fafafa";
  tabContent.style.fontSize = "16px";
  tabContent.style.lineHeight = "1.6";
  tabContent.style.color = "#333";

  let firstTabLoaded = false;

  tabTitles.forEach((key) => {
    if (!dmData[key]) return;

    const tab = document.createElement("li");
    tab.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    tab.style.cursor = "pointer";
    tab.style.padding = "10px 15px";
    tab.style.border = "1px solid #ccc";
    tab.style.borderBottom = "none";
    tab.style.background = firstTabLoaded ? "#eee" : "#fff";

    tab.addEventListener("click", () => {
      [...tabHeader.children].forEach(li => li.style.background = "#eee");
      tab.style.background = "#fff";

      tabContent.innerHTML = `
        <style>
          ul { margin: 10px 0 10px 20px; padding-left: 20px; }
          li { margin-bottom: 6px; }
        </style>
        ${dmData[key]}
      `;
    });

    tabHeader.appendChild(tab);

    if (!firstTabLoaded) {
      tabContent.innerHTML = `
        <style>
          ul { margin: 10px 0 10px 20px; padding-left: 20px; }
          li { margin-bottom: 6px; }
        </style>
        ${dmData[key]}
      `;
      firstTabLoaded = true;
    }
  });

  container.appendChild(tabHeader);
  container.appendChild(tabContent);
  return container;
};

// ✅ Show popup full screen
const showPopup = (dmId) => {
  const dmData = damageMechanisms[dmId];
  if (!dmData) {
    alert("No data available");
    return;
  }

  const existingPopup = document.getElementById("customPopup");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.id = "customPopup";
  popup.style.position = "fixed";
  popup.style.top = "50px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.background = "#fff";
  popup.style.border = "2px solid #444";
  popup.style.boxShadow = "0 0 12px rgba(0,0,0,0.5)";
  popup.style.zIndex = "1000";
  popup.style.width = "800px";
  popup.style.maxWidth = "95vw";
  popup.style.maxHeight = "80vh";
  popup.style.overflowY = "auto";
  popup.style.padding = "20px";
  popup.style.borderRadius = "10px";
  popup.style.boxSizing = "border-box";

  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "15px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "20px";
  closeBtn.style.color = "#333";
  closeBtn.title = "Close";
  closeBtn.onclick = () => popup.remove();

  const title = document.createElement("h2");
  title.textContent = dmData.name;

  const tabs = createTabs(dmData);

  popup.appendChild(closeBtn);
  popup.appendChild(title);
  popup.appendChild(tabs);

  document.body.appendChild(popup);
};
