// Draws the illustrated island. Each region of the island is one category.
// Uses the global d3 (loaded from the CDN in index.html).

import * as draw from "./sprites.js";

const WIDTH = 1100;
const HEIGHT = 720;

// squareness 2 gives an ellipse. Higher values give a rounded rectangle.
const ISLAND = { cx: 545, cy: 385, rx: 385, ry: 232, squareness: 4, seed: 7 };
const GRAVEYARD = { cx: 990, cy: 652, rx: 94, ry: 38, squareness: 2.6, seed: 31 };
const ISLET = { cx: 86, cy: 172, rx: 46, ry: 25, squareness: 2.4, seed: 5 };

// site: the Voronoi seed that shapes the region. label and pins: the centres of the region label and of the pin cluster.
const REGIONS = [
  { id: "community", name: "Bahía Comunidad", site: [305, 280], label: [300, 262], pins: [300, 325], fill: "#22a67c", texture: "grass" },
  { id: "training", name: "Valle Formación", site: [600, 245], label: [612, 268], pins: [612, 307], fill: "#14866a", texture: "speckle" },
  { id: "research", name: "Sierra Investigación", site: [555, 430], label: [510, 494], pins: [634, 432], fill: "#33b98d", texture: "grass" },
  { id: "governance", name: "Cerro Gobernanza", site: [305, 505], label: [330, 438], pins: [330, 478], fill: "#117a5f", texture: "speckle" },
  { id: "media", name: "Costa Medios", site: [765, 525], label: [770, 468], pins: [770, 508], fill: "#f5b48a", texture: "sand" },
  { id: "career", name: "Castillo Carreras", site: [835, 330], label: [835, 338], pins: [835, 382], fill: "#e4582c", texture: "strata" }
];
const GRAVEYARD_REGION = { name: "Isla Panteón", category: "No longer active", label: [990, 600], pins: [990, 658] };

const SHELF = ["#1b434c", "#215359"];
const COAST = "#0b5a48";
const CLIFF = ["#d94e1b", "#a8380f"];
const ROAD = ["#b8602f", "#f0b27c"];

const RIVER = "M452,448 C430,430 405,402 360,398 S258,410 214,398 S168,386 140,392";
const ROADS = [
  "M402,256 C440,270 478,266 506,252",
  "M512,256 C528,372 650,370 730,352 S815,318 835,296",
  "M545,356 C500,420 430,520 270,530",
  "M868,300 C905,380 902,470 874,540"
];

const PIN_SPACING_X = 58;
const PIN_SPACING_Y = 52;

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
  const power = 2 / land.squareness;
  const ring = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * 2 * Math.PI;
    const [c, s] = [Math.cos(t), Math.sin(t)];
    const wobble = 1 + 0.03 * Math.sin(3 * t + land.seed) + 0.02 * Math.sin(7 * t + land.seed) + 0.025 * (random() - 0.5);
    ring.push([
      land.cx + land.rx * wobble * Math.sign(c) * Math.abs(c) ** power,
      land.cy + land.ry * wobble * Math.sign(s) * Math.abs(s) ** power
    ]);
  }
  return d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))(ring);
}

function addPatterns(defs) {
  const tile = (id, size) => defs.append("pattern").attr("id", id)
    .attr("width", size).attr("height", size).attr("patternUnits", "userSpaceOnUse");
  tile("grass", 24).append("path").attr("fill", "none").attr("stroke", "rgba(255,255,255,0.17)")
    .attr("stroke-width", 1.2).attr("stroke-linecap", "round").attr("d", "M4,10 l2,-4 l2,4 M15,21 l2,-4 l2,4");
  const speckle = tile("speckle", 16);
  speckle.append("circle").attr("cx", 4).attr("cy", 5).attr("r", 1.1).attr("fill", "rgba(0,0,0,0.13)");
  speckle.append("circle").attr("cx", 12).attr("cy", 12).attr("r", 1.1).attr("fill", "rgba(255,255,255,0.09)");
  const sand = tile("sand", 12);
  sand.append("circle").attr("cx", 3).attr("cy", 4).attr("r", 0.9).attr("fill", "rgba(170,80,30,0.25)");
  sand.append("circle").attr("cx", 9).attr("cy", 9).attr("r", 0.8).attr("fill", "rgba(255,255,255,0.3)");
  tile("strata", 14).append("path").attr("stroke", "rgba(110,28,0,0.2)").attr("stroke-width", 1.4)
    .attr("d", "M-2,4 L16,0 M-2,12 L16,8");
}

function drawLand(svg, land, fill, cliff, cliffShade) {
  const d = coastline(land);
  const scale = land === ISLAND ? 1 : 0.6;
  svg.select(".shelf").append("path").attr("d", d).attr("fill", "none")
    .attr("stroke", SHELF[0]).attr("stroke-width", 64 * scale).attr("stroke-linejoin", "round");
  svg.select(".shelf-inner").append("path").attr("d", d).attr("fill", "none")
    .attr("stroke", SHELF[1]).attr("stroke-width", 34 * scale).attr("stroke-linejoin", "round");
  const ground = svg.select(".land");
  ground.append("path").attr("d", d).attr("fill", cliffShade).attr("transform", "translate(0,16)");
  ground.append("path").attr("d", d).attr("fill", cliff).attr("transform", "translate(0,8)");
  ground.append("path").attr("d", d).attr("fill", fill);
  ground.append("path").attr("d", d).attr("fill", "url(#speckle)");
  return d;
}

function drawRegions(svg, islandPath) {
  svg.select("defs").append("clipPath").attr("id", "island-clip").append("path").attr("d", islandPath);
  const voronoi = d3.Delaunay.from(REGIONS.map(region => region.site)).voronoi([0, 0, WIDTH, HEIGHT]);
  const ground = svg.select(".land").append("g").attr("clip-path", "url(#island-clip)");
  REGIONS.forEach((region, i) => {
    ground.append("path").attr("d", voronoi.renderCell(i)).attr("fill", region.fill);
    ground.append("path").attr("d", voronoi.renderCell(i)).attr("fill", `url(#${region.texture})`);
  });
  ground.append("path").attr("d", voronoi.render()).attr("fill", "none")
    .attr("stroke", COAST).attr("stroke-opacity", 0.45).attr("stroke-width", 3);
  svg.select(".land").append("path").attr("d", islandPath).attr("fill", "none")
    .attr("stroke", COAST).attr("stroke-width", 3);
}

function drawWater(layer) {
  layer.append("path").attr("d", RIVER).attr("fill", "none").attr("stroke", draw.INK.waterEdge)
    .attr("stroke-width", 13).attr("stroke-linecap", "round");
  layer.append("path").attr("d", RIVER).attr("fill", "none").attr("stroke", draw.INK.water)
    .attr("stroke-width", 8.5).attr("stroke-linecap", "round");
  draw.lagoon(layer, 228, 222, 32, 15);
}

function drawRoads(layer) {
  ROADS.forEach((d, i) => {
    layer.append("path").attr("d", d).attr("fill", "none").attr("stroke", ROAD[0])
      .attr("stroke-width", 7).attr("stroke-linecap", "round");
    layer.append("path").attr("d", d).attr("fill", "none").attr("stroke", ROAD[1])
      .attr("stroke-width", 4).attr("stroke-linecap", "round").attr("stroke-dasharray", i === 3 ? "6 4" : null);
  });
}

function drawSea(layer) {
  [[60, 280], [230, 652], [380, 690], [700, 96], [960, 262], [580, 690], [36, 470], [1000, 470], [820, 690], [300, 104], [140, 625]]
    .forEach(([x, y]) => draw.wave(layer, x, y));
  draw.dock(layer, 120, 330, 44);
  draw.boat(layer, 102, 352, 0.8);
  draw.boat(layer, 92, 504, 1.1);
  draw.boat(layer, 296, 668, 0.85);
  draw.boat(layer, 1000, 404, 0.9);
}

function drawScenery(layer) {
  // Bahía Comunidad: a fishing village by a lagoon, and a plaza with a fountain.
  draw.house(layer, 268, 208, 0.75, draw.INK.darkRoof);
  draw.house(layer, 370, 216, 0.9);
  draw.house(layer, 392, 208);
  draw.house(layer, 416, 218, 0.85, draw.INK.darkRoof);
  draw.plaza(layer, 404, 252);
  draw.boat(layer, 232, 218, 0.4);
  [[178, 272], [192, 252, 0.8], [300, 198, 0.75], [328, 204, 0.85], [434, 304], [176, 356], [196, 364, 0.8], [424, 374, 0.8], [442, 382, 0.7]]
    .forEach(([x, y, s]) => draw.tree(layer, x, y, s));

  // Valle Formación: a university town with fields.
  draw.university(layer, 510, 250);
  draw.fields(layer, 700, 208, 1, -6);
  draw.house(layer, 588, 224, 0.85);
  draw.house(layer, 606, 230, 0.75, draw.INK.darkRoof);
  [[474, 292, 0.9], [490, 302, 0.8], [562, 212, 0.75], [640, 238, 0.8], [652, 186, 0.7]].forEach(([x, y, s]) => draw.tree(layer, x, y, s));

  // Sierra Investigación: a mountain range with an observatory on the highest peak.
  draw.mountain(layer, 520, 448, 1.55);
  draw.observatory(layer, 520, 382, 0.8);
  draw.mountain(layer, 470, 454, 1.15);
  draw.mountain(layer, 578, 454, 1.15);
  draw.mountain(layer, 430, 458, 0.9);
  [[410, 472, 0.8], [446, 476, 0.7], [604, 472, 0.85], [590, 480, 0.7], [612, 492, 0.7]].forEach(([x, y, s]) => draw.pine(layer, x, y, s));

  // Cerro Gobernanza: a capitol on a hill above a grove.
  draw.hill(layer, 232, 540, 58, 20, "#1b8a69");
  draw.capitol(layer, 232, 536);
  [[330, 550], [352, 558], [374, 548], [396, 560], [418, 552], [340, 580], [362, 588], [386, 582], [408, 590], [430, 576], [302, 568], [318, 594], [282, 574, 0.8], [270, 592, 0.75]]
    .forEach(([x, y, s]) => draw.tree(layer, x, y, s));

  // Costa Medios: a beach with a lighthouse and a radio tower.
  draw.radioTower(layer, 670, 562, 0.95);
  draw.lighthouse(layer, 874, 548, 1.1);
  draw.parasol(layer, 780, 574);
  draw.parasol(layer, 806, 558, 0.85);
  [[720, 582], [738, 592, 0.8], [826, 588, 0.9], [692, 600, 0.8], [850, 522, 0.8]].forEach(([x, y, s]) => draw.palm(layer, x, y, s));

  // Castillo Carreras: a castle on the cliffs.
  draw.castle(layer, 835, 290, 1.1);
  [[776, 302], [898, 252, 0.9], [902, 344, 0.8], [770, 404, 0.8], [800, 248, 0.8], [868, 404, 0.7]].forEach(([x, y, s]) => draw.boulder(layer, x, y, s));

  // Isla Panteón.
  draw.tombstone(layer, 961, 634);
  draw.cross(layer, 1019, 636);
  draw.deadTree(layer, 1076, 664);

  // The small islet.
  draw.palm(layer, 72, 176);
  draw.house(layer, 98, 180, 0.7);
}

function drawSky(layer) {
  draw.cloud(layer, 210, 112);
  draw.cloud(layer, 760, 120, 0.8);
  draw.cloud(layer, 1010, 300, 0.9);
  draw.cloud(layer, 70, 612, 0.8);
  draw.cloud(layer, 600, 162, 0.6);
  draw.compass(layer, 1032, 96);
}

// Lays the pins out in centred rows: one row up to three pins, two rows above that.
function layoutPins(orgs, centre) {
  const perRow = orgs.length <= 3 ? orgs.length : Math.ceil(orgs.length / 2);
  const rows = Math.ceil(orgs.length / perRow);
  return orgs.map((org, k) => {
    const row = Math.floor(k / perRow);
    const inRow = row === rows - 1 ? orgs.length - perRow * (rows - 1) : perRow;
    const column = k - row * perRow;
    return {
      org,
      x: centre[0] + (column - (inRow - 1) / 2) * PIN_SPACING_X,
      y: centre[1] + (row - (rows - 1) / 2) * PIN_SPACING_Y
    };
  });
}

function drawRegionLabel(layer, [x, y], name, category) {
  const width = Math.max(name.length * 6.6, category.length * 5) + 24;
  const g = layer.append("g").attr("class", "region-label");
  g.append("rect").attr("x", x - width / 2).attr("y", y - 16).attr("width", width).attr("height", 32).attr("rx", 11);
  g.append("text").attr("class", "region-name").attr("x", x).attr("y", y - 2).text(name);
  g.append("text").attr("class", "region-category").attr("x", x).attr("y", y + 10).text(category);
}

function drawPins(layer, placed, handlers) {
  const pins = layer.selectAll("g").data(placed).join("g")
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
  const defs = svg.append("defs");
  defs.append("clipPath").attr("id", "pin-clip").append("circle").attr("r", 7.5);
  addPatterns(defs);
  for (const layer of ["shelf", "shelf-inner", "sea", "land", "water", "roads", "scenery", "labels", "pins", "sky"]) {
    svg.append("g").attr("class", layer);
  }

  const islandPath = drawLand(svg, ISLAND, REGIONS[0].fill, ...CLIFF);
  drawRegions(svg, islandPath);
  drawLand(svg, GRAVEYARD, "#93a89f", "#6b8077", "#4d5f58");
  drawLand(svg, ISLET, draw.INK.sand, ...CLIFF);
  drawSea(svg.select(".sea"));
  drawWater(svg.select(".water").attr("clip-path", "url(#island-clip)"));
  drawRoads(svg.select(".roads"));
  drawScenery(svg.select(".scenery"));
  drawSky(svg.select(".sky"));

  const labels = svg.select(".labels");
  const placed = [];
  for (const region of REGIONS) {
    placed.push(...layoutPins(orgs.filter(org => org.category === region.id && org.status !== "inactive"), region.pins));
    drawRegionLabel(labels, region.label, region.name, categoryLabel[region.id]);
  }
  placed.push(...layoutPins(orgs.filter(org => org.status === "inactive"), GRAVEYARD_REGION.pins));
  drawRegionLabel(labels, GRAVEYARD_REGION.label, GRAVEYARD_REGION.name, GRAVEYARD_REGION.category);

  const pins = drawPins(svg.select(".pins"), placed, handlers);
  return isDimmed => pins.classed("dim", d => isDimmed(d.org));
}
