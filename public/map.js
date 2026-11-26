// Draws the illustrated island. Each region of the island is one category.
// Uses the global d3 (loaded from the CDN in index.html).

const WIDTH = 1000;
const HEIGHT = 640;

// Landmasses are noisy ellipses: centre, radii, and a seed for the coastline.
const ISLAND = { cx: 480, cy: 348, rx: 352, ry: 208, seed: 7, points: 24 };
const GRAVEYARD = { cx: 892, cy: 574, rx: 88, ry: 36, seed: 31, points: 12 };
const ISLET = { cx: 88, cy: 150, rx: 40, ry: 22, seed: 5, points: 10 };

// site: the Voronoi seed that shapes the region. pins: the centre of its pin cluster.
const REGIONS = [
  { id: "community", name: "Bahía Comunidad", site: [300, 265], pins: [306, 300], fill: "#1fa67d" },
  { id: "training", name: "Valle Formación", site: [595, 232], pins: [590, 252], fill: "#15896a" },
  { id: "governance", name: "Cerro Gobernanza", site: [245, 475], pins: [262, 464], fill: "#15896a" },
  { id: "research", name: "Sierra Investigación", site: [455, 440], pins: [452, 486], fill: "#2bb98f" },
  { id: "media", name: "Costa Medios", site: [650, 480], pins: [640, 484], fill: "#f2a77e" },
  { id: "career", name: "Puerto Carreras", site: [770, 345], pins: [748, 364], fill: "#e4582c" }
];
const GRAVEYARD_REGION = { id: "graveyard", name: "Isla Panteón", label: "No longer active", pins: [892, 572] };

const INK = {
  shelfOuter: "#1b434c",
  shelfInner: "#205258",
  coast: "#0c5547",
  cliff: "#d94e1b",
  cliffShade: "#a8380f",
  roof: "#e8602c",
  roofShade: "#c4471b",
  darkRoof: "#7a2e10",
  cream: "#fff3e2",
  sail: "#ffd9b8",
  wood: "#8a4a22",
  trunk: "#6b3d1e",
  pine: "#0d6b55",
  snow: "#fff8ee",
  lamp: "#ffd166",
  lagoon: "#8fd8c8",
  sand: "#f3c892",
  stone: "#8ea69c",
  stoneShade: "#5f746c",
  tomb: "#dfe5e0"
};

const PIN_SPACING_X = 60;
const PIN_SPACING_Y = 50;

const points = list => list.map(p => p.join(",")).join(" ");

function seededRandom(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function coastline(land) {
  const random = seededRandom(land.seed);
  const ring = [];
  for (let i = 0; i < land.points; i++) {
    const angle = (i / land.points) * 2 * Math.PI;
    const wobble = 0.9 + 0.2 * random();
    ring.push([land.cx + Math.cos(angle) * land.rx * wobble, land.cy + Math.sin(angle) * land.ry * wobble]);
  }
  return d3.line().curve(d3.curveCatmullRomClosed.alpha(0.8))(ring);
}

// ---- Illustration pieces. x, y is the centre of the base; s is the scale. ----

function mountain(g, x, y, s = 1) {
  g.append("polygon").attr("fill", INK.roof)
    .attr("points", points([[x - 24 * s, y], [x, y - 44 * s], [x + 24 * s, y]]));
  g.append("polygon").attr("fill", INK.roofShade)
    .attr("points", points([[x, y - 44 * s], [x + 24 * s, y], [x + 5 * s, y]]));
  g.append("polygon").attr("fill", INK.snow)
    .attr("points", points([[x - 8 * s, y - 29.3 * s], [x, y - 44 * s], [x + 8 * s, y - 29.3 * s], [x + 3.5 * s, y - 33 * s], [x, y - 28 * s], [x - 3.5 * s, y - 33 * s]]));
}

function pine(g, x, y, s = 1) {
  g.append("rect").attr("fill", INK.trunk)
    .attr("x", x - 1.5 * s).attr("y", y - 5 * s).attr("width", 3 * s).attr("height", 5 * s);
  g.append("polygon").attr("fill", INK.pine)
    .attr("points", points([[x - 8 * s, y - 4 * s], [x, y - 18 * s], [x + 8 * s, y - 4 * s]]));
  g.append("polygon").attr("fill", INK.pine)
    .attr("points", points([[x - 6 * s, y - 12 * s], [x, y - 24 * s], [x + 6 * s, y - 12 * s]]));
}

function palm(g, x, y, s = 1) {
  const top = [x + 2 * s, y - 17 * s];
  g.append("path").attr("fill", "none").attr("stroke", INK.trunk).attr("stroke-width", 2.2 * s)
    .attr("d", `M${x},${y} Q${x + 4 * s},${y - 9 * s} ${top[0]},${top[1]}`);
  for (const degrees of [195, 235, 285, 330, 15]) {
    const angle = (degrees * Math.PI) / 180;
    g.append("line").attr("stroke", INK.pine).attr("stroke-width", 3 * s).attr("stroke-linecap", "round")
      .attr("x1", top[0]).attr("y1", top[1])
      .attr("x2", top[0] + 10 * s * Math.cos(angle)).attr("y2", top[1] + 10 * s * Math.sin(angle));
  }
}

function house(g, x, y, s = 1, roof = INK.roof) {
  g.append("rect").attr("fill", INK.cream)
    .attr("x", x - 8 * s).attr("y", y - 11 * s).attr("width", 16 * s).attr("height", 11 * s);
  g.append("polygon").attr("fill", roof)
    .attr("points", points([[x - 10.5 * s, y - 11 * s], [x, y - 20 * s], [x + 10.5 * s, y - 11 * s]]));
  g.append("rect").attr("fill", INK.wood)
    .attr("x", x - 2 * s).attr("y", y - 6 * s).attr("width", 4 * s).attr("height", 6 * s);
}

function hall(g, x, y, s = 1) {
  g.append("rect").attr("fill", INK.cream)
    .attr("x", x - 15 * s).attr("y", y - 3 * s).attr("width", 30 * s).attr("height", 3 * s);
  for (const dx of [-11, -4, 4, 11]) {
    g.append("rect").attr("fill", INK.cream)
      .attr("x", x + (dx - 1.5) * s).attr("y", y - 15 * s).attr("width", 3 * s).attr("height", 12 * s);
  }
  g.append("polygon").attr("fill", INK.roof)
    .attr("points", points([[x - 16 * s, y - 15 * s], [x, y - 25 * s], [x + 16 * s, y - 15 * s]]));
}

function lighthouse(g, x, y, s = 1) {
  g.append("polygon").attr("fill", INK.cream)
    .attr("points", points([[x - 6 * s, y], [x - 4 * s, y - 30 * s], [x + 4 * s, y - 30 * s], [x + 6 * s, y]]));
  g.append("polygon").attr("fill", INK.roofShade)
    .attr("points", points([[x - 5.4 * s, y - 9 * s], [x - 4.8 * s, y - 17 * s], [x + 4.8 * s, y - 17 * s], [x + 5.4 * s, y - 9 * s]]));
  g.append("rect").attr("fill", INK.lamp)
    .attr("x", x - 5 * s).attr("y", y - 36 * s).attr("width", 10 * s).attr("height", 6 * s);
  g.append("polygon").attr("fill", INK.darkRoof)
    .attr("points", points([[x - 6.5 * s, y - 36 * s], [x, y - 43 * s], [x + 6.5 * s, y - 36 * s]]));
}

function boat(g, x, y, s = 1) {
  g.append("polygon").attr("fill", INK.wood)
    .attr("points", points([[x - 14 * s, y], [x + 14 * s, y], [x + 9 * s, y + 7 * s], [x - 9 * s, y + 7 * s]]));
  g.append("rect").attr("fill", INK.trunk)
    .attr("x", x - 0.8 * s).attr("y", y - 24 * s).attr("width", 1.6 * s).attr("height", 24 * s);
  g.append("polygon").attr("fill", INK.cream)
    .attr("points", points([[x + 2 * s, y - 23 * s], [x + 13 * s, y - 3 * s], [x + 2 * s, y - 3 * s]]));
  g.append("polygon").attr("fill", INK.sail)
    .attr("points", points([[x - 2 * s, y - 19 * s], [x - 11 * s, y - 3 * s], [x - 2 * s, y - 3 * s]]));
}

function dock(g, x, y, length) {
  g.append("rect").attr("fill", INK.wood).attr("x", x).attr("y", y - 3).attr("width", length).attr("height", 6);
  for (let px = x + 6; px < x + length; px += 10) {
    g.append("rect").attr("fill", INK.trunk).attr("x", px).attr("y", y + 3).attr("width", 2.5).attr("height", 5);
  }
}

function cloud(g, x, y, s = 1) {
  const puff = g.append("g").attr("fill", "#ffffff").attr("opacity", 0.92);
  puff.append("ellipse").attr("cx", x).attr("cy", y).attr("rx", 16 * s).attr("ry", 6 * s);
  puff.append("ellipse").attr("cx", x - 6 * s).attr("cy", y - 5 * s).attr("rx", 8 * s).attr("ry", 6 * s);
  puff.append("ellipse").attr("cx", x + 5 * s).attr("cy", y - 7 * s).attr("rx", 9 * s).attr("ry", 7 * s);
}

function wave(g, x, y) {
  g.append("path").attr("fill", "none").attr("stroke", "rgba(255,255,255,0.16)")
    .attr("stroke-width", 1.4).attr("stroke-linecap", "round")
    .attr("d", `M${x},${y} q4,-4 8,0 q4,4 8,0`);
}

function tombstone(g, x, y) {
  g.append("path").attr("fill", INK.tomb).attr("d", `M${x - 4},${y} v-8 a4,4 0 0 1 8,0 v8 z`);
}

function compass(g, x, y) {
  const star = "0,-26 5,-5 26,0 5,5 0,26 -5,5 -26,0 -5,-5";
  const rose = g.append("g").attr("transform", `translate(${x},${y})`);
  rose.append("circle").attr("r", 30).attr("fill", INK.cliffShade).attr("stroke", INK.roof).attr("stroke-width", 2.5);
  rose.append("polygon").attr("points", star).attr("transform", "rotate(45) scale(0.62)").attr("fill", INK.roofShade);
  rose.append("polygon").attr("points", star).attr("fill", INK.roof);
  rose.append("circle").attr("r", 4).attr("fill", INK.cream);
  rose.append("text").attr("y", -36).attr("text-anchor", "middle").attr("fill", INK.roof)
    .attr("font-size", 11).attr("font-weight", 700).text("N");
}

// ---- Layers ----

function drawLand(svg, shape, fill, cliff, cliffShade) {
  const d = coastline(shape);
  const scale = shape === ISLAND ? 1 : 0.6;
  svg.select(".shelf").append("path").attr("d", d).attr("fill", "none")
    .attr("stroke", INK.shelfOuter).attr("stroke-width", 64 * scale).attr("stroke-linejoin", "round");
  svg.select(".shelf-inner").append("path").attr("d", d).attr("fill", "none")
    .attr("stroke", INK.shelfInner).attr("stroke-width", 34 * scale).attr("stroke-linejoin", "round");
  const land = svg.select(".land");
  land.append("path").attr("d", d).attr("fill", cliffShade).attr("transform", "translate(0,16)");
  land.append("path").attr("d", d).attr("fill", cliff).attr("transform", "translate(0,8)");
  land.append("path").attr("d", d).attr("fill", fill);
  return d;
}

function drawRegions(svg, islandPath) {
  svg.select("defs").append("clipPath").attr("id", "island-clip").append("path").attr("d", islandPath);
  const voronoi = d3.Delaunay.from(REGIONS.map(region => region.site)).voronoi([0, 0, WIDTH, HEIGHT]);
  const cells = svg.select(".land").append("g").attr("clip-path", "url(#island-clip)");
  REGIONS.forEach((region, i) => {
    cells.append("path").attr("d", voronoi.renderCell(i)).attr("fill", region.fill)
      .attr("stroke", INK.coast).attr("stroke-opacity", 0.55).attr("stroke-width", 3);
  });
  cells.append("ellipse").attr("cx", 150).attr("cy", 302).attr("rx", 46).attr("ry", 26).attr("fill", INK.lagoon);
  svg.select(".land").append("path").attr("d", islandPath).attr("fill", "none")
    .attr("stroke", INK.coast).attr("stroke-width", 2.5);
}

function drawScenery(svg) {
  const sea = svg.select(".sea");
  [[60, 250], [210, 600], [330, 90], [700, 95], [930, 300], [560, 610], [40, 470], [940, 450], [770, 610]]
    .forEach(([x, y]) => wave(sea, x, y));
  boat(sea, 112, 300, 0.8);
  boat(sea, 96, 478, 1.1);
  boat(sea, 250, 596, 0.85);
  dock(sea, 824, 398, 44);
  boat(sea, 892, 384, 0.9);

  const land = svg.select(".scenery");
  palm(land, 80, 152, 1);
  palm(land, 100, 156, 0.8);
  [[236, 238], [252, 228], [412, 224], [430, 238], [190, 372], [174, 386]].forEach(([x, y]) => pine(land, x, y));
  [[522, 196], [688, 206], [706, 216]].forEach(([x, y]) => pine(land, x, y));
  house(land, 682, 244);
  house(land, 700, 252, 0.85);
  hall(land, 332, 512);
  mountain(land, 412, 398, 1.05);
  mountain(land, 500, 402, 1.1);
  mountain(land, 456, 392, 1.45);
  [[392, 528], [408, 536]].forEach(([x, y]) => pine(land, x, y, 0.85));
  palm(land, 586, 420, 1);
  palm(land, 604, 432, 0.85);
  lighthouse(land, 728, 492);
  house(land, 792, 310, 1, INK.darkRoof);
  house(land, 772, 300, 0.85, INK.darkRoof);
  tombstone(land, 862, 592);
  tombstone(land, 922, 592);

  const sky = svg.select(".sky");
  cloud(sky, 168, 96, 1);
  cloud(sky, 842, 232, 0.9);
  cloud(sky, 70, 560, 0.8);
  cloud(sky, 640, 128, 0.7);
  compass(sky, 928, 84);
}

// Lays the pins out in centred rows: one row up to three pins, two rows above that.
function layoutPins(orgs, centre) {
  const perRow = orgs.length <= 3 ? orgs.length : Math.ceil(orgs.length / 2);
  const rows = Math.ceil(orgs.length / perRow);
  const positions = orgs.map((org, k) => {
    const row = Math.floor(k / perRow);
    const inRow = row === rows - 1 ? orgs.length - perRow * (rows - 1) : perRow;
    const column = k - row * perRow;
    return {
      org,
      x: centre[0] + (column - (inRow - 1) / 2) * PIN_SPACING_X,
      y: centre[1] + (row - (rows - 1) / 2) * PIN_SPACING_Y
    };
  });
  return { positions, rows };
}

function drawRegionLabel(svg, region, label, rows) {
  const width = Math.max(region.name.length * 6.6, label.length * 5) + 24;
  const x = region.pins[0];
  const y = region.pins[1] - ((rows - 1) / 2) * PIN_SPACING_Y - 40;
  const g = svg.select(".labels").append("g").attr("class", "region-label");
  g.append("rect").attr("x", x - width / 2).attr("y", y - 16).attr("width", width).attr("height", 32).attr("rx", 11);
  g.append("text").attr("class", "region-name").attr("x", x).attr("y", y - 2).text(region.name);
  g.append("text").attr("class", "region-category").attr("x", x).attr("y", y + 10).text(label);
}

function drawPins(svg, placed, handlers) {
  const pins = svg.select(".pins").selectAll("g").data(placed).join("g")
    .attr("class", d => "pin" + (d.org.status === "inactive" ? " inactive" : ""))
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("tabindex", 0)
    .attr("role", "img")
    .attr("aria-label", d => d.org.name)
    .on("mouseenter focus", function (event, d) { handlers.onEnter(d.org, this); })
    .on("mouseleave blur", handlers.onLeave)
    .on("click", (event, d) => handlers.onSelect(d.org))
    .on("keydown", (event, d) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handlers.onSelect(d.org);
      }
    });

  pins.append("circle").attr("class", "pin-shadow").attr("cy", 2).attr("r", 11);
  pins.append("circle").attr("class", "pin-disc").attr("r", 11);
  pins.filter(d => d.org.icon).append("image")
    .attr("href", d => d.org.icon).attr("x", -7.5).attr("y", -7.5).attr("width", 15).attr("height", 15)
    .attr("clip-path", "url(#pin-clip)").attr("preserveAspectRatio", "xMidYMid slice");
  pins.filter(d => !d.org.icon).append("text").attr("class", "pin-initials").attr("y", 2.8).text(d => d.org.initials);

  const labelWidth = d => d.org.short.length * 4.3 + 10;
  pins.append("rect").attr("class", "pin-label-box")
    .attr("x", d => -labelWidth(d) / 2).attr("y", 14).attr("width", labelWidth).attr("height", 11).attr("rx", 5.5);
  pins.append("text").attr("class", "pin-label").attr("y", 22).text(d => d.org.short);
  return pins;
}

// Returns a function that dims the pins of the organizations for which isDimmed is true.
export function drawMap(svgElement, orgs, categoryLabel, handlers) {
  const svg = d3.select(svgElement).attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
  svg.append("defs").append("clipPath").attr("id", "pin-clip").append("circle").attr("r", 7.5);
  for (const layer of ["shelf", "shelf-inner", "sea", "land", "scenery", "labels", "pins", "sky"]) {
    svg.append("g").attr("class", layer);
  }

  const islandPath = drawLand(svg, ISLAND, REGIONS[0].fill, INK.cliff, INK.cliffShade);
  drawRegions(svg, islandPath);
  drawLand(svg, GRAVEYARD, INK.stone, INK.stoneShade, "#4d5f58");
  drawLand(svg, ISLET, INK.sand, INK.cliff, INK.cliffShade);
  drawScenery(svg);

  const placed = [];
  for (const region of REGIONS) {
    const members = orgs.filter(org => org.category === region.id && org.status !== "inactive");
    const { positions, rows } = layoutPins(members, region.pins);
    placed.push(...positions);
    drawRegionLabel(svg, region, categoryLabel[region.id], rows);
  }
  const gone = layoutPins(orgs.filter(org => org.status === "inactive"), GRAVEYARD_REGION.pins);
  placed.push(...gone.positions);
  drawRegionLabel(svg, GRAVEYARD_REGION, GRAVEYARD_REGION.label, gone.rows);

  const pins = drawPins(svg, placed, handlers);
  return isDimmed => pins.classed("dim", d => isDimmed(d.org));
}
