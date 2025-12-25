/* =========================================================
   SCRIPT.JS
   Two lane lines only at 20 percent and 80 percent
   Bridge has only two outer segments
   No center dot and no middle segments
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

/* Sort and group */
const sortedConcerts = concerts.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

const concertsByYear = {};
sortedConcerts.forEach(concert => {
  if (!concertsByYear[concert.year]) concertsByYear[concert.year] = [];
  concertsByYear[concert.year].push(concert);
});

const yearsSorted = Object.keys(concertsByYear).map(y => parseInt(y, 10)).sort((a, b) => a - b);

/* Two global lane lines */
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

/* Build */
yearsSorted.forEach(year => {
  const yearBlock = document.createElement("div");
  yearBlock.className = "timeline-year";

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

/* Normal entries */
function buildLaneEntry(concert) {
  const lane = safeText(concert.lane);

  const row = document.createElement("div");
  row.className = "timeline-entry";
  row.style.position = "relative";
  row.style.zIndex = "1";
  row.style.minHeight = "44px";

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
    content.style.maxWidth = "520px";
  } else {
    node.style.left = `${LANE_LEFT_PCT}%`;
    content.style.left = `calc(${LANE_LEFT_PCT}% + 18px)`;
    content.style.textAlign = "left";
    content.style.maxWidth = "520px";
  }

  row.appendChild(node);
  row.appendChild(content);
  return row;
}

/* Bridge with two outer segments only */
function buildBridge(concert) {
  const row = document.createElement("div");
  row.className = "timeline-entry";
  row.style.position = "relative";
  row.style.zIndex = "1";
  row.style.minHeight = "86px";

  /* These two control where dot 2 and dot 4 live along the bridge span */
  const INNER_LEFT = 25;   /* percent of bridge width from left endpoint */
  const INNER_RIGHT = 75;  /* percent of bridge width from left endpoint */

  const bridge = document.createElement("div");
  bridge.style.position = "absolute";
  bridge.style.top = "56%";
  bridge.style.left = `${LANE_LEFT_PCT}%`;
  bridge.style.width = `${LANE_RIGHT_PCT - LANE_LEFT_PCT}%`;
  bridge.style.height = "2px";
  bridge.style.transform = "translateY(-50%)";

  /* Left segment: dot 1 to dot 2 */
  const leftSeg = document.createElement("div");
  leftSeg.style.position = "absolute";
  leftSeg.style.left = "0";
  leftSeg.style.top = "0";
  leftSeg.style.height = "2px";
  leftSeg.style.width = `${INNER_LEFT}%`;
  leftSeg.style.background = "#000";

  /* Right segment: dot 4 to dot 5 */
  const rightSeg = document.createElement("div");
  rightSeg.style.position = "absolute";
  rightSeg.style.left = `${INNER_RIGHT}%`;
  rightSeg.style.top = "0";
  rightSeg.style.height = "2px";
  rightSeg.style.width = `${100 - INNER_RIGHT}%`;
  rightSeg.style.background = "#000";

  bridge.appendChild(leftSeg);
  bridge.appendChild(rightSeg);

  /* Dot 1 at left lane endpoint */
  const dot1 = document.createElement("div");
  dot1.className = "entry-node";
  dot1.style.position = "absolute";
  dot1.style.left = "0";
  dot1.style.top = "50%";
  dot1.style.transform = "translate(-50%, -50%)";

  /* Dot 2 at inner left */
  const dot2 = document.createElement("div");
  dot2.className = "entry-node";
  dot2.style.position = "absolute";
  dot2.style.left = `${INNER_LEFT}%`;
  dot2.style.top = "50%";
  dot2.style.transform = "translate(-50%, -50%)";

  /* Dot 4 at inner right */
  const dot4 = document.createElement("div");
  dot4.className = "entry-node";
  dot4.style.position = "absolute";
  dot4.style.left = `${INNER_RIGHT}%`;
  dot4.style.top = "50%";
  dot4.style.transform = "translate(-50%, -50%)";

  /* Dot 5 at right lane endpoint */
  const dot5 = document.createElement("div");
  dot5.className = "entry-node";
  dot5.style.position = "absolute";
  dot5.style.left = "100%";
  dot5.style.top = "50%";
  dot5.style.transform = "translate(-50%, -50%)";

  bridge.appendChild(dot1);
  bridge.appendChild(dot2);
  bridge.appendChild(dot4);
  bridge.appendChild(dot5);

  /* Label sits above the empty gap, never on top of a line */
  const content = document.createElement("div");
  content.className = "entry-content bridge-label";
  content.style.position = "absolute";
  content.style.left = "50%";
  content.style.top = "0";
  content.style.transform = "translateX(-50%)";
  content.style.maxWidth = "720px";

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

/* Header fade */
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

/* Fade in on scroll */
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

/* Playlist links */
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

/* Back to top */
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
