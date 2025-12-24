/* =========================================
   SCRIPT.JS
   =========================================
   This file takes the concert data and
   turns it into the visible timeline.
*/

/* =========================================
   BASIC REFERENCES
   ========================================= */

const timeline = document.getElementById("timeline");
const backToTopBtn = document.getElementById("back-to-top");

/* =========================================
   SORT CONCERTS BY DATE
   ========================================= */

const sortedConcerts = concerts.slice().sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

/* =========================================
   GROUP CONCERTS BY YEAR
   ========================================= */

const concertsByYear = {};

sortedConcerts.forEach(concert => {
  if (!concertsByYear[concert.year]) {
    concertsByYear[concert.year] = [];
  }
  concertsByYear[concert.year].push(concert);
});

/* =========================================
   BUILD THE TIMELINE
   ========================================= */

Object.keys(concertsByYear).forEach(year => {

  /* Create year container */
  const yearBlock = document.createElement("div");
  yearBlock.className = "timeline-year";

  /* Year label */
  const yearLabel = document.createElement("div");
  yearLabel.className = "year-label";
  yearLabel.textContent = year;

  yearBlock.appendChild(yearLabel);

  /* Entries for this year */
  concertsByYear[year].forEach(concert => {

    const entry = document.createElement("div");
    entry.classList.add("timeline-entry");

    if (concert.lane === "dad") {
      entry.classList.add("entry-dad");
    } else if (concert.lane === "miles") {
      entry.classList.add("entry-miles");
    } else {
      entry.classList.add("entry-both");
    }

    /* Node */
    const node = document.createElement("div");
    node.className = "entry-node";

    /* Content container */
    const content = document.createElement("div");
    content.className = "entry-content";

    /* Artist */
    const artist = document.createElement("div");
    artist.className = "entry-artist";
    artist.textContent = concert.artist;

    /* Venue */
    const venue = document.createElement("div");
    venue.className = "entry-venue";
    venue.textContent = `${concert.venue}, ${concert.city}, ${concert.state}`;

    content.appendChild(artist);
    content.appendChild(venue);

    /* Optional YouTube link */
    if (concert.youtube && concert.youtube !== "") {
      const link = document.createElement("a");
      link.href = concert.youtube;
      link.target = "_blank";
      link.textContent = "YouTube";
      link.style.display = "block";
      link.style.fontSize = "0.8rem";
      link.style.marginTop = "4px";

      content.appendChild(link);
    }

    /* Assemble entry */
    if (concert.lane === "dad") {
      entry.appendChild(content);
      entry.appendChild(node);
    } else if (concert.lane === "miles") {
      entry.appendChild(node);
      entry.appendChild(content);
    } else {
      entry.appendChild(node);
      entry.appendChild(content);
    }

    yearBlock.appendChild(entry);

  });

  timeline.appendChild(yearBlock);

});

/* =========================================
   BACK TO TOP BUTTON
   ========================================= */

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
