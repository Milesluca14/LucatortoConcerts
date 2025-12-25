/* =========================================================
   SCRIPT.JS
   Two vertical timelines plus bridges only
   Right lane is Dad
   Left lane is Miles
   Center is empty except bridges
   Per entry YouTube is not rendered
   Playlists are linked at the bottom only
   ========================================================= */

const timeline = document.getElementById("timeline");
const entryHeader = document.getElementById("entry-header");
const backToTopBtn = document.getElementById("back-to-top");

/* =========================================================
   Lane geometry
   These positions control where the two vertical lines live
   Adjust these two values later if you want wider or tighter lanes
   ========================================================= */

const LANE_LEFT_PCT = 30;
const LANE_RIGHT_PCT = 70;

/* =========================================================
   Utility formatting
   ========================================================= */

function safeText(value) {
  return (value === undefined || value === null) ? "" : String(value).trim();
}

function formatLocation(concert) {
  const venue = safeText(concert.venue);
  const city = safeText(concert.city);
  const state = safeText(concert.state);

  if (city && state) return `${venue}, ${city}, ${state}`;
  if (city && !state) return `${venue}, ${city}`;
  if (!city && state) return `${venue}, ${state}`;
  return venue;
}

function formatMonthDay(dateStr) {
  if (!dateStr || dateStr.length < 10) return "";
  return dateStr.slice(5);
}

/* =========================================================
   Sort and group by year
   ========================================================= */

const sortedConcerts = concerts.slice().sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

const concertsByYear = {};
sortedConcerts.forEach(concert => {
  if (!concertsByYear[concert.year]) concertsByYear[concert.year] = [];
  concertsByYear[concert.year].push(concert);
});

const yearsSorted = Object.keys(concertsByYear)
  .map(y => parseInt(y, 10))
  .sort((a, b) => a - b);

/* =========================================================
   Global lane lines
   These ensure true vertical continuity including across bridges
   ========================================================= */

const laneLines = document.createElement("div");
laneLines.id = "lane-lines";
laneLines.style.position = "absolute";
laneLines.style.top = "0";
laneLines.style.left = "0";
laneLines.style.right = "0";
laneLines.style.bottom = "0";
laneLines.style.pointerEvents = "none";
laneLines.style.zIndex = "0";

const leftLine = document.createElement("div");
leftLine.id = "lane-left-line";
leftLine.style.position = "absolute";
leftLine.style.top = "0";
leftLine.style.bottom = "0";
leftLine.style.left = `${LANE_LEFT_PCT}%`;
leftLine.style.width = "2px";
leftLine.style.background = "#000";

const rightLine = document.createElement("div");
rightLine.id = "lane-right-line";
rightLine.style.position = "absolute";
rightLine.style.top = "0";
rightLine.style.bottom = "0";
rightLine.style.left = `${LANE_RIGHT_PCT}%`;
rightLine.style.width = "2px";
rightLine.style.background = "#000";

laneLines.appendChild(leftLine);
laneLines.appendChild(rightLine);
timeline.style.position = "relative";
timeline.appendChild(laneLines);

/* =========================================================
   Build timeline DOM
   ========================================================= */

yearsSorted.forEach(year => {
  const yearBlock = document.createElement("div");
  yearBlock.className = "timeline-year";

  const yearLabel = document.createElement("div");
  yearLabel.className = "year-label";
  yearLabel.textContent = String(year);
  yearBlock.appendChild(yearLabel);

  concertsByYear[year].forEach(concert => {
    const lane = safeText(concert.lane);

    if (lane === "both") {
      yearBlock.appendChild(buildBridge(concert));
    } else {
      yearBlock.appendChild(buildLaneEntry(concert));
    }
  });

  timeline.appendChild(yearBlock);
});

/* =========================================================
   Build a normal entry on left or right lane
   ========================================================= */

function buildLaneEntry(concert) {
  const lane = safeText(concert.lane);

  const row = document.createElement("div");
  row.className = "timeline-entry";
  row.style.position = "relative";
  row.style.zIndex = "1";
  row.style.display = "block";
  row.style.minHeight = "22px";

  const node = document.createElement("div");
  node.className = "entry-node";
  node.style.position = "absolute";
  node.style.top = "50%";
  node.style.transform = "translate(-50%, -50%)";

  const content = document.createElement("div");
  content.className = "entry-content";
  content.style.position = "relative";

  const artist = document.createElement("div");
  artist.className = "entry-artist";
  artist.textContent = safeText(concert.artist);

  const venue = document.createElement("div");
  venue.className = "entry-venue";
  venue.textContent = formatLocation(concert);

  const meta = document.createElement("div");
  meta.className = "entry-meta";
  meta.textContent = formatMonthDay(safeText(concert.date));

  content.appendChild(artist);
  content.appendChild(venue);
  content.appendChild(meta);

  if (lane === "dad") {
    node.style.left = `${LANE_RIGHT_PCT}%`;

    content.style.marginLeft = `calc(${LANE_RIGHT_PCT}% + 16px)`;
    content.style.maxWidth = "420px";
    content.style.textAlign = "left";

  } else {
    node.style.left = `${LANE_LEFT_PCT}%`;

    content.style.marginRight = `calc(100% - ${LANE_LEFT_PCT}% + 16px)`;
    content.style.maxWidth = "420px";
    content.style.textAlign = "right";
  }

  row.appendChild(node);
  row.appendChild(content);

  return row;
}

/* =========================================================
   Build a bridge entry
   Center is empty except this bridge line
   Endpoints touch the two lane lines
   ========================================================= */

function buildBridge(concert) {
  const row = document.createElement("div");
  row.className = "timeline-entry";
  row.style.position = "relative";
  row.style.zIndex = "1";
  row.style.display = "block";
  row.style.minHeight = "56px";

  const bridgeLine = document.createElement("div");
  bridgeLine.style.position = "absolute";
  bridgeLine.style.top = "50%";
  bridgeLine.style.left = `${LANE_LEFT_PCT}%`;
  bridgeLine.style.width = `${LANE_RIGHT_PCT - LANE_LEFT_PCT}%`;
  bridgeLine.style.height = "2px";
  bridgeLine.style.background = "#000";
  bridgeLine.style.transform = "translateY(-50%)";

  const leftNode = document.createElement("div");
  leftNode.className = "entry-node";
  leftNode.style.position = "absolute";
  leftNode.style.left = "0";
  leftNode.style.top = "50%";
  leftNode.style.transform = "translate(-50%, -50%)";

  const rightNode = document.createElement("div");
  rightNode.className = "entry-node";
  rightNode.style.position = "absolute";
  rightNode.style.left = "100%";
  rightNode.style.top = "50%";
  rightNode.style.transform = "translate(-50%, -50%)";

  bridgeLine.appendChild(leftNode);
  bridgeLine.appendChild(rightNode);

  const midCount = 3;
  for (let i = 1; i <= midCount; i++) {
    const mid = document.createElement("div");
    mid.className = "entry-node";
    mid.style.position = "absolute";
    mid.style.left = `${(i * 100) / (midCount + 1)}%`;
    mid.style.top = "50%";
    mid.style.transform = "translate(-50%, -50%)";
    mid.style.opacity = "1";
    bridgeLine.appendChild(mid);
  }

  const content = document.createElement("div");
  content.className = "entry-content";
  content.style.position = "absolute";
  content.style.left = "50%";
  content.style.top = "0";
  content.style.transform = "translateX(-50%)";
  content.style.textAlign = "center";
  content.style.maxWidth = "560px";

  const artist = document.createElement("div");
  artist.className = "entry-artist";
  artist.textContent = safeText(concert.artist);

  const venue = document.createElement("div");
  venue.className = "entry-venue";
  venue.textContent = formatLocation(concert);

  const meta = document.createElement("div");
  meta.className = "entry-meta";
  meta.textContent = formatMonthDay(safeText(concert.date));

  content.appendChild(artist);
  content.appendChild(venue);
  content.appendChild(meta);

  row.appendChild(bridgeLine);
  row.appendChild(content);

  return row;
}

/* =========================================================
   Header behavior
   Fade out after scroll begins
   Return only when back at top
   ========================================================= */

function updateHeaderVisibility() {
  if (!entryHeader) return;

  if (window.scrollY <= 0) {
    entryHeader.style.opacity = "1";
    entryHeader.style.transform = "translateY(0)";
    entryHeader.style.pointerEvents = "auto";
  } else {
    entryHeader.style.opacity = "0";
    entryHeader.style.transform = "translateY(-10px)";
    entryHeader.style.pointerEvents = "none";
  }
}

entryHeader.style.transition = "opacity 250ms ease, transform 250ms ease";
updateHeaderVisibility();
window.addEventListener("scroll", updateHeaderVisibility, { passive: true });

/* =========================================================
   Fade in entries on scroll
   ========================================================= */

const animated = Array.from(document.querySelectorAll(".timeline-entry, .timeline-year"));
animated.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(10px)";
  el.style.transition = "opacity 420ms ease, transform 420ms ease";
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animated.forEach(el => observer.observe(el));

/* =========================================================
   Bottom playlist links
   Use playlistLinks from data.js and fill the footer buttons
   ========================================================= */

function applyPlaylistLinks() {
  if (!window.playlistLinks) return;

  const buttons = document.querySelectorAll(".playlist-button");
  if (!buttons || buttons.length < 3) return;

  const dadUrl = safeText(playlistLinks.dad);
  const milesUrl = safeText(playlistLinks.miles);
  const bothUrl = safeText(playlistLinks.both);

  buttons[0].href = dadUrl || "javascript:void(0)";
  buttons[1].href = milesUrl || "javascript:void(0)";
  buttons[2].href = bothUrl || "javascript:void(0)";

  if (!dadUrl) buttons[0].style.opacity = "0.5";
  if (!milesUrl) buttons[1].style.opacity = "0.5";
  if (!bothUrl) buttons[2].style.opacity = "0.5";
}

applyPlaylistLinks();

/* =========================================================
   Back to top
   ========================================================= */

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
