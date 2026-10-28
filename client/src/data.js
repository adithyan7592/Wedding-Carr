// All invitation text lives here — edit once, the whole site updates.
export const EVENT = {
  bride: "Jancy Joy",
  groom: "Aswin Jacob",
  monogram: ["J", "A"],
  verse: "So they are no longer two, but one flesh.",
  verseRef: "Matthew 19:6",
  brideParents: "Joy P.V. & Sindhu Joy",
  brideHouse: "Pollayil House, Alangad P.O. 683511",
  groomParents: "Jacob K. Devassy & Bini Jacob",
  groomHouse: "Kudiyirikal House, St. Mary’s Road, Puthanvelikara P.O., Puthanvelikara",
  siblings: ["Jimsy Joy", "Jasmi Joy", "Don Joy"],
  withLove: "Ryan Luke",
  dateISO: "2026-11-29T12:00:00+05:30",
  day: "Sunday",
  dateNum: "29",
  month: "November",
  year: "2026",
  time: "12:00 PM",
  venue: "St. Mary’s Church",
  venueArea: "Alangad P.O.",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=St.+Mary%27s+Church+Alangad+Kerala",
};

export const calendarUrl = () => {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `Engagement of ${EVENT.bride} & ${EVENT.groom}`,
    dates: "20261129T063000Z/20261129T090000Z",
    details: "With love from the families of Joy P.V. and Jacob K. Devassy",
    location: `${EVENT.venue}, ${EVENT.venueArea}, Kerala`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
};
