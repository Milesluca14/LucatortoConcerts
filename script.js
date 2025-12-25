/* =========================================================
   SCRIPT.JS — TWO TIMELINES + BRIDGE ONLY
   ========================================================= */

const timeline = document.getElementById("timeline");
const backToTopBtn = document.getElementById("back-to-top");

/* =========================================================
   SORT CONCERTS BY DATE
   ========================================================= */

const sortedConcerts = concerts.slice().sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

/* =========================================================
   GROUP BY YEAR
   ========================================================= */

const concertsByYear = {};

sortedConcerts.forEach(concert => {
  if (!concertsByYear[concert.year]) {
    concertsByYear[concert.year] = [];
  }
  concertsByYear[concert.year].push(concert);
});

/* =========================================================
   BUILD TIMELINE
   ========================================================= */

Object.keys(concertsByYear).forEach(year => {

  const yearBlock = document.createElement("div");
  yearBlock.className = "timeline-year";

  const yearLabel = document.createElement("div");
  yearLabel.className = "year-label";
  yearLabel.textContent = year;
  yearBlock.appendChild(yearLabel);

  concertsByYear[year].forEach(concert => {

    if (concert.lane === "both") {
      yearBlock.appendChild(buildBridge(concert));
    } else {
      yearBlock.appendChild(buildSingleEntry(concert));
    }

  });

  timeline.appendChild(yearBlock);
});

/* =========================================================
   SINGLE ENTRY (LEFT OR RIGHT ONLY)
   ========================================================= */

function buildSingleEntry(concert) {

  const entry = document.createElement("div");
  entry.className = "timeline-entry";

  const isDad = concert.lane === "dad";
  entry.classList.add(isDad ? "entry-dad" : "entry-miles");

  const node = document.createElement("div");
  node.className = "entry-node";

  const content = buildEntryContent(concert);

  if (isDad) {
    entry.appendChild(content);
    entry.appendChild(node);
  } else {
    entry.appendChild(node);
    entry.appendChild(content);
  }

  return entry;
}

/* =========================================================
   BRIDGE — CONNECTS LEFT AND RIGHT ONLY
   ========================================================= */

function buildBridge(concert) {

  const entry = document.createElement("div");
  entry.className = "timeline-entry entry-both";

  /* Horizontal bridge line */
  const bridgeLine = document.createElement("div");
  bridgeLine.style.position = "relative";
  bridgeLine.style.width = "100%";
  bridgeLine.style.height = "2px";
  bridgeLine.style.background = "#000";

  /* Left endpoint (Miles side) */
  const leftNode = document.createElement("div");
  leftNode.className = "entry-node";
  leftNode.style.position = "absolute";
  leftNode.style.left = "18%";
  leftNode.style.top = "-5px";

  /* Right endpoint (Dad side) */
  const rightNode = document.createElement("div");
  rightNode.className = "entry-node";
  rightNode.style.position = "absolute";
  rightNode.style.right = "18%";
  rightNode.style.top = "-5px";

  bridgeLine.appendChild(leftNode);
  bridgeLine.appendChild(rightNode);

  /* Content centered ABOVE the bridge */
  const content = buildEntryContent(concert);
  content.style.position = "absolute";
  content.style.left = "50%";
  content.style.top = "-48px";
  content.style.transform = "translateX(-50%)";
  content.style.textAlign = "center";

  entry.appendChild(bridgeLine);
  entry.appendChild(content);

  return entry;
}

/* =========================================================
   ENTRY CONTENT
   ========================================================= */

function buildEntryContent(concert) {

  const content = document.createElement("div");
  content.className = "entry-content";

  const artist = document.createElement("div");
  artist.className = "entry-artist";
  artist.textContent = concert.artist;

  const venue = document.createElement("div");
  venue.className = "entry-venue";
  venue.textContent = `${concert.venue}, ${concert.city}, ${concert.state}`;

  const meta = document.createElement("div");
  meta.className = "entry-meta";
  meta.textContent = concert.date.slice(5);

  content.appendChild(artist);
  content.appendChild(venue);
  content.appendChild(meta);

  if (concert.youtube) {
    const link = document.createElement("a");
    link.href = concert.youtube;
    link.target = "_blank";
    link.textContent = "YouTube";
    content.appendChild(link);
  }

  return content;
}

/* =========================================================
   BACK TO TOP
   ========================================================= */

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
