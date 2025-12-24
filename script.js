/* =========================================================
   SCRIPT.JS — DENSE TIMELINE WITH MERGE BRIDGES
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
      yearBlock.appendChild(buildMergeBridge(concert));
    } else {
      yearBlock.appendChild(buildSingleEntry(concert));
    }

  });

  timeline.appendChild(yearBlock);
});

/* =========================================================
   SINGLE ENTRY (LEFT OR RIGHT)
   ========================================================= */

function buildSingleEntry(concert) {

  const entry = document.createElement("div");
  entry.className = "timeline-entry";

  entry.classList.add(
    concert.lane === "dad" ? "entry-dad" : "entry-miles"
  );

  const node = document.createElement("div");
  node.className = "entry-node";

  const content = buildEntryContent(concert);

  if (concert.lane === "dad") {
    entry.appendChild(content);
    entry.appendChild(node);
  } else {
    entry.appendChild(node);
    entry.appendChild(content);
  }

  return entry;
}

/* =========================================================
   MERGE BRIDGE (CENTER)
   ========================================================= */

function buildMergeBridge(concert) {

  const entry = document.createElement("div");
  entry.className = "timeline-entry entry-both";

  /* Horizontal bridge container */
  const bridge = document.createElement("div");
  bridge.style.position = "relative";
  bridge.style.display = "flex";
  bridge.style.alignItems = "center";
  bridge.style.justifyContent = "space-between";
  bridge.style.width = "100%";
  bridge.style.maxWidth = "800px";

  /* Number of nodes along the bridge */
  const NODE_COUNT = 5;
  const nodes = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const n = document.createElement("div");
    n.className = "entry-node";
    nodes.push(n);
    bridge.appendChild(n);
  }

  /* Content anchored to center node */
  const content = buildEntryContent(concert);
  content.style.position = "absolute";
  content.style.left = "50%";
  content.style.top = "24px";
  content.style.transform = "translateX(-50%)";

  entry.appendChild(bridge);
  entry.appendChild(content);

  return entry;
}

/* =========================================================
   ENTRY CONTENT (TEXT STACK)
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
