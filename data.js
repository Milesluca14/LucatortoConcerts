/* =========================================
   CONCERT DATA
   =========================================
   This file contains all concerts.
   No HTML.
   No CSS.
   No logic.
   Just facts.
*/

/*
  lane values:
  "dad"   = right side
  "miles" = left side
  "both"  = center bridge
*/

const concerts = [

  /* =====================================
     DAD ONLY CONCERTS (RIGHT SIDE)
     ===================================== */

  {
    id: "dad-001",
    date: "1978-06-01",
    year: 1978,
    lane: "dad",
    artist: "Kiss",
    venue: "Nassau Coliseum",
    city: "Uniondale",
    state: "NY",
    youtube: ""
  },

  {
    id: "dad-002",
    date: "1982-08-15",
    year: 1982,
    lane: "dad",
    artist: "The Rolling Stones",
    venue: "Shea Stadium",
    city: "Queens",
    state: "NY",
    youtube: ""
  },

  /* =====================================
     FIRST SHARED CONCERT (MERGE POINT)
     ===================================== */

  {
    id: "both-001",
    date: "2016-04-14",
    year: 2016,
    lane: "both",
    artist: "Red Hot Chili Peppers",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    youtube: "https://www.youtube.com/watch?v=example"
  },

  /* =====================================
     MILES ONLY CONCERTS (LEFT SIDE)
     ===================================== */

  {
    id: "miles-001",
    date: "2018-07-21",
    year: 2018,
    lane: "miles",
    artist: "Arctic Monkeys",
    venue: "Forest Hills Stadium",
    city: "Queens",
    state: "NY",
    youtube: ""
  },

  {
    id: "miles-002",
    date: "2022-10-03",
    year: 2022,
    lane: "miles",
    artist: "The Strokes",
    venue: "Barclays Center",
    city: "Brooklyn",
    state: "NY",
    youtube: ""
  }

];
