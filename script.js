/* =========================================================
   SCRIPT.JS
   Two lane lines only at 20 percent and 80 percent
   Bridge segments only on the outside
   Adds year library button grid before the first year
   No visible load in animations
   ========================================================= */

const timeline = document.getElementById("timeline");
const entryHeader = document.getElementById("entry-header");
const backToTopBtn = document.getElementById("back-to-top");

const LANE_LEFT_PCT = 20;
const LANE_RIGHT_PCT = 80;

function safeText(value) {
  return (value === undefined || value === null) ? "" : String(value).trim();
}

function formatLocation(concert) {
  const venue = safeText(concert.venue);
  const city = safeText(concert.city);
  const state = safeText(concert.state);

  if (venue && city && state) return `${venue}, ${city}, ${state}`;
  if (venue && city) return `${venue}, ${city}`;
  if (venue && state) return `${venue}, ${state}`;
  return venue || "";
}

function formatMonthDay(dateStr) {
  if (!dateStr || dateStr.length < 10) return "";
  return dateStr.slice(5);
}

/* =========================================================
   Sort and group
   ========================================================= */

const sortedConcerts = concerts.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

const concertsByYear = {};
sortedConcerts.forEach(concert => {
  if (!concertsByYear[concert.year]) concertsByYear[concert.year] = [];
  concertsByYear[concert.year].push(concert);
});

const yearsWithData = Object.keys(concertsByYear)
  .map(y => parseInt(y, 10))
  .sort((a, b) => a - b);

/* =========================================================
   Global lane lines, only two
   ========================================================= */

timeline.style.position = "relative";

const laneLines = document.createElement("div");
laneLines.style.position = "absolute";
laneLines.style.top = "0";
laneLines.style.left = "0";
laneLines.style.right = "0";
laneLines.style.bottom = "0";
laneLines.style.pointerEvents = "none";
laneLines.style.zIndex = "0";

const leftLine = document.createElement("div");
leftLine.style.position = "absolute";
leftLine.style.top = "0";
leftLine.style.bottom = "0";
leftLine.style.left = `${LANE_LEFT_PCT}%`;
leftLine.style.width = "2px";
leftLine.style.background = "#000";

const rightLine = document.createElement("div");
rightLine.style.position = "absolute";
rightLine.style.top = "0";
rightLine.style.bottom = "0";
rightLine.style.left = `${LANE_RIGHT_PCT}%`;
rightLine.style.width = "2px";
rightLine.style.background = "#000";

laneLines.appendChild(leftLine);
laneLines.appendChild(rightLine);
timeline.appendChild(laneLines);

/* =========================================================
   Insert year library section before timeline content
   Buttons from 1979 to 2025, evenly laid out
   If a year has no data, button is disabled
   ========================================================= */

insertYearLibrary({
  startYear: 1979,
  endYear: 2025,
  yearsWithData
});

/* =========================================================
   Build timeline DOM with year anchors
   ========================================================= */

yearsWithData.forEach(year => {
  const yearBlock = document.createElement("div");
  yearBlock.className = "timeline-year";

  /* Anchor id for scroll */
  yearBlock.id = `year-${year}`;

  const yearLabel = document.createElement("div");
  yearLabel.className = "year-label";
  yearLabel.textContent = String(year);
  yearBlock.appendChild(yearLabel);

  concertsByYear[year].forEach(concert => {
    const lane = safeText(concert.lane);
    yearBlock.appendChild(lane === "both" ? buildBridge(concert) : buildLaneEntry(concert));
  });

  timeline.appendChild(yearBlock);
});

/* =========================================================
   Lane entries
   Dad text left of right line
   Miles text right of left line
   ========================================================= */

function buildLaneEntry(concert) {
  const lane = safeText(concert.lane);

  const row = document.createElement("div");
  row.className = "timeline-entry";
  row.style.position = "relative";
  row.style.zIndex = "1";
  row.style.minHeight = "56px"; /* spacing control */

  const node = document.createElement("div");
  node.className = "entry-node";
  node.style.position = "absolute";
  node.style.top = "50%";
  node.style.transform = "translate(-50%, -50%)";

  const content = document.createElement("div");
  content.className = "entry-content";
  content.style.position = "absolute";
  content.style.top = "50%";
  content.style.transform = "translateY(-50%)";

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
    content.style.right = `calc(${100 - LANE_RIGHT_PCT}% + 18px)`;
    content.style.textAlign = "right";
    content.style.maxWidth = "560px";
  } else {
    node.style.left = `${LANE_LEFT_PCT}%`;
    content.style.left = `calc(${LANE_LEFT_PCT}% + 18px)`;
    content.style.textAlign = "left";
    content.style.maxWidth = "560px";
  }

  row.appendChild(node);
  row.appendChild(content);
  return row;
}

/* =========================================================
   Bridge
   Keep dots 1, 2, 4, 5
   Keep only line 1 to 2 and line 4 to 5
   Remove the middle entirely
   ========================================================= */

function buildBridge(concert) {
  const row = document.createElement("div");
  row.className = "timeline-entry";
  row.style.position = "relative";
  row.style.zIndex = "1";
  row.style.minHeight = "98px";

  const INNER_LEFT = 25;
  const INNER_RIGHT = 75;

  const bridge = document.createElement("div");
  bridge.style.position = "absolute";
  bridge.style.top = "60%";
  bridge.style.left = `${LANE_LEFT_PCT}%`;
  bridge.style.width = `${LANE_RIGHT_PCT - LANE_LEFT_PCT}%`;
  bridge.style.height = "2px";
  bridge.style.transform = "translateY(-50%)";

  const leftSeg = document.createElement("div");
  leftSeg.style.position = "absolute";
  leftSeg.style.left = "0";
  leftSeg.style.top = "0";
  leftSeg.style.height = "2px";
  leftSeg.style.width = `${INNER_LEFT}%`;
  leftSeg.style.background = "#000";

  const rightSeg = document.createElement("div");
  rightSeg.style.position = "absolute";
  rightSeg.style.left = `${INNER_RIGHT}%`;
  rightSeg.style.top = "0";
  rightSeg.style.height = "2px";
  rightSeg.style.width = `${100 - INNER_RIGHT}%`;
  rightSeg.style.background = "#000";

  bridge.appendChild(leftSeg);
  bridge.appendChild(rightSeg);

  const dot1 = makeBridgeDot("0%");
  const dot2 = makeBridgeDot(`${INNER_LEFT}%`);
  const dot4 = makeBridgeDot(`${INNER_RIGHT}%`);
  const dot5 = makeBridgeDot("100%");

  bridge.appendChild(dot1);
  bridge.appendChild(dot2);
  bridge.appendChild(dot4);
  bridge.appendChild(dot5);

  const content = document.createElement("div");
  content.className = "entry-content bridge-label";
  content.style.position = "absolute";
  content.style.left = "50%";
  content.style.top = "0";
  content.style.transform = "translateX(-50%)";
  content.style.maxWidth = "760px";

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

  row.appendChild(bridge);
  row.appendChild(content);

  return row;
}

function makeBridgeDot(leftValue) {
  const d = document.createElement("div");
  d.className = "entry-node";
  d.style.position = "absolute";
  d.style.left = leftValue;
  d.style.top = "50%";
  d.style.transform = "translate(-50%, -50%)";
  return d;
}

/* =========================================================
   Year library insertion and scroll
   ========================================================= */

function insertYearLibrary({ startYear, endYear, yearsWithData }) {
  const wrapper = document.getElementById("timeline-wrapper");
  if (!wrapper) return;

  const library = document.createElement("section");
  library.id = "year-library";

  const inner = document.createElement("div");
  inner.id = "year-library-inner";

  const header = document.createElement("div");
  header.className = "year-library-header";

  const title = document.createElement("div");
  title.className = "year-library-title";
  title.textContent = "Library";

  const hint = document.createElement("div");
  hint.className = "year-library-hint";
  hint.textContent = "Jump to a year";

  header.appendChild(title);
  header.appendChild(hint);

  const grid = document.createElement("div");
  grid.className = "year-grid";

  const yearSet = new Set(yearsWithData);

  for (let y = startYear; y <= endYear; y++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "year-btn";
    btn.textContent = String(y);

    if (!yearSet.has(y)) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
        const target = document.getElementById(`year-${y}`);
        if (!target) return;

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }

    grid.appendChild(btn);
  }

  inner.appendChild(header);
  inner.appendChild(grid);
  library.appendChild(inner);

  wrapper.insertBefore(library, timeline.parentElement === wrapper ? timeline : wrapper.firstChild);
}

/* =========================================================
   Playlist links
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
