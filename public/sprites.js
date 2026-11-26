// Illustration sprites for the island map.
// Each sprite draws around the centre of its base (x, y), at scale s. Uses the global d3 selection API.

export const INK = {
  cream: "#fff3e2",
  creamShade: "#efd6b8",
  roof: "#e8602c",
  roofShade: "#c4471b",
  darkRoof: "#8a3412",
  wood: "#8a4a22",
  trunk: "#6b3d1e",
  window: "#2d5560",
  tree: "#0e6f53",
  treeLight: "#2b9a72",
  pine: "#0d6b55",
  pineLight: "#1d8a68",
  snow: "#fff8ee",
  dome: "#e9eef0",
  domeShade: "#bccbcf",
  lamp: "#ffd166",
  water: "#8fd8c8",
  waterEdge: "#5cbca6",
  sand: "#f6cf9c",
  stone: "#dfe5e0",
  stoneShade: "#a9b6ad",
  ink: "#24343a",
  boulder: "#b8441a",
  boulderLight: "#f07a45"
};

const points = list => list.map(p => p.join(",")).join(" ");

function place(layer, x, y, s = 1, angle = 0) {
  return layer.append("g").attr("transform", `translate(${x},${y}) rotate(${angle}) scale(${s})`);
}

function poly(g, fill, list) {
  return g.append("polygon").attr("fill", fill).attr("points", points(list));
}

function box(g, fill, x, y, width, height, radius = 0) {
  return g.append("rect").attr("fill", fill)
    .attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("rx", radius);
}

function circle(g, fill, cx, cy, r) {
  return g.append("circle").attr("fill", fill).attr("cx", cx).attr("cy", cy).attr("r", r);
}

function oval(g, fill, cx, cy, rx, ry) {
  return g.append("ellipse").attr("fill", fill).attr("cx", cx).attr("cy", cy).attr("rx", rx).attr("ry", ry);
}

function shape(g, fill, d) {
  return g.append("path").attr("fill", fill).attr("d", d);
}

function line(g, color, width, d) {
  return g.append("path").attr("fill", "none").attr("stroke", color).attr("stroke-width", width)
    .attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("d", d);
}

function flag(g, x, y) {
  line(g, INK.ink, 0.8, `M${x},${y} v-9`);
  poly(g, INK.lamp, [[x, y - 9], [x + 6, y - 7.4], [x, y - 5.8]]);
}

function crenels(g, x, y, width) {
  for (let cx = x; cx + 3.5 <= x + width; cx += 6.5) box(g, INK.cream, cx, y - 3.5, 3.5, 3.5);
}

// ---- Nature ----

export function tree(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.trunk, -1.4, -6, 2.8, 6);
  circle(g, INK.tree, 0, -12.5, 8);
  circle(g, INK.treeLight, -2.8, -15, 3.4);
}

export function pine(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.trunk, -1.5, -5, 3, 5);
  poly(g, INK.pine, [[-8, -4], [0, -18], [8, -4]]);
  poly(g, INK.pineLight, [[-8, -4], [0, -18], [0, -4]]);
  poly(g, INK.pine, [[-6, -12], [0, -25], [6, -12]]);
  poly(g, INK.pineLight, [[-6, -12], [0, -25], [0, -12]]);
}

export function palm(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  line(g, INK.trunk, 2.2, "M0,0 Q4,-9 2,-18");
  for (const degrees of [200, 240, 290, 335, 20]) {
    const a = (degrees * Math.PI) / 180;
    const [dx, dy] = [11 * Math.cos(a), 11 * Math.sin(a)];
    line(g, INK.pine, 3, `M2,-18 q${dx / 2},${dy / 2 - 3} ${dx},${dy + 2}`);
  }
}

export function mountain(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  poly(g, INK.roof, [[-26, 0], [0, -44], [26, 0]]);
  poly(g, INK.roofShade, [[0, -44], [26, 0], [6, 0]]);
  poly(g, INK.snow, [[-8.3, -30], [0, -44], [8.3, -30], [3.5, -33.5], [0, -28.5], [-3.5, -33.5]]);
}

export function hill(layer, x, y, rx, ry, fill) {
  const g = place(layer, x, y);
  shape(g, fill, `M${-rx},0 Q${-rx * 0.55},${-ry} 0,${-ry} T${rx},0 Z`);
  shape(g, "rgba(255,255,255,0.08)", `M${-rx},0 Q${-rx * 0.55},${-ry} 0,${-ry} L0,0 Z`);
}

export function boulder(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  poly(g, INK.boulder, [[-7, 0], [-5, -6], [1, -8], [7, -4], [7, 0]]);
  poly(g, INK.boulderLight, [[-5, -6], [1, -8], [-1, -3]]);
}

export function cloud(layer, x, y, s = 1) {
  const g = place(layer, x, y, s).attr("fill", "#ffffff").attr("opacity", 0.92);
  oval(g, null, 0, 0, 17, 6);
  oval(g, null, -6, -5, 8, 6);
  oval(g, null, 5, -7, 9, 7);
}

export function wave(layer, x, y) {
  line(place(layer, x, y), "rgba(255,255,255,0.16)", 1.4, "M0,0 q4,-4 8,0 q4,4 8,0");
}

export function deadTree(layer, x, y, s = 1) {
  line(place(layer, x, y, s), "#5c4a3d", 2, "M0,0 V-17 M0,-9 L-6,-15 M0,-12 L5,-19 M-6,-15 L-8,-19");
}

// ---- Buildings ----

export function house(layer, x, y, s = 1, roof = INK.roof) {
  const g = place(layer, x, y, s);
  box(g, INK.cream, -8, -11, 16, 11);
  box(g, INK.creamShade, 3, -11, 5, 11);
  poly(g, roof, [[-10.5, -11], [0, -20], [10.5, -11]]);
  box(g, INK.wood, -2, -6, 4, 6);
  box(g, INK.window, -6.5, -8.5, 2.8, 2.8);
}

export function university(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.creamShade, -38, -4, 76, 4);
  box(g, INK.cream, -35, -25, 70, 21);
  box(g, INK.roof, -37, -29, 74, 5, 1);
  for (const wx of [-29, -20, -11, 6, 15, 24]) box(g, INK.window, wx, -20, 5, 7, 1);
  shape(g, INK.wood, "M-4,-4 v-8 a4,4 0 0 1 8,0 v8 z");
  box(g, INK.cream, -8, -48, 16, 19);
  box(g, INK.creamShade, 2, -48, 6, 19);
  circle(g, "#ffffff", 0, -39.5, 4.6).attr("stroke", INK.ink).attr("stroke-width", 0.8);
  line(g, INK.ink, 0.9, "M0,-39.5 v-3 M0,-39.5 h2.4");
  poly(g, INK.roof, [[-10, -48], [0, -64], [10, -48]]);
  poly(g, INK.roofShade, [[0, -64], [10, -48], [0, -48]]);
  flag(g, 0, -64);
}

export function capitol(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.creamShade, -35, -4, 70, 4);
  box(g, INK.creamShade, -31, -8, 62, 4);
  box(g, INK.cream, -29, -11, 58, 3);
  for (let cx = -24; cx <= 24; cx += 8) box(g, INK.cream, cx - 1.6, -27, 3.2, 16);
  box(g, INK.cream, -32, -31, 64, 4);
  box(g, INK.cream, -14, -40, 28, 9);
  for (const wx of [-9.5, -1.5, 6.5]) box(g, INK.window, wx, -38, 3, 5, 1.5);
  shape(g, INK.roof, "M-15,-40 A15,15 0 0 1 15,-40 Z");
  shape(g, INK.roofShade, "M0,-55 A15,15 0 0 1 15,-40 L0,-40 Z");
  box(g, INK.cream, -2.5, -60, 5, 5);
  flag(g, 0, -60);
}

export function castle(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.cream, -34, -24, 68, 24);
  crenels(g, -34, -24, 68);
  box(g, INK.cream, -13, -47, 26, 23);
  box(g, INK.creamShade, 5, -47, 8, 23);
  crenels(g, -13, -47, 26);
  for (const wx of [-7.5, 2]) box(g, INK.window, wx, -41, 3.4, 6, 1.7);
  shape(g, INK.wood, "M-7,0 v-11 a7,7 0 0 1 14,0 v11 z");
  for (const tx of [-40, 40]) {
    box(g, INK.cream, tx - 8, -40, 16, 40);
    box(g, INK.creamShade, tx + 2, -40, 6, 40);
    box(g, INK.window, tx - 1.7, -30, 3.4, 6, 1.7);
    poly(g, INK.darkRoof, [[tx - 10, -40], [tx, -61], [tx + 10, -40]]);
    poly(g, INK.roofShade, [[tx, -61], [tx + 10, -40], [tx, -40]]);
    flag(g, tx, -61);
  }
}

export function observatory(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.cream, -11, -12, 22, 12);
  box(g, INK.creamShade, 4, -12, 7, 12);
  box(g, INK.wood, -3, -7, 6, 7);
  shape(g, INK.dome, "M-13,-12 A13,13 0 0 1 13,-12 Z");
  shape(g, INK.domeShade, "M0,-25 A13,13 0 0 1 13,-12 L0,-12 Z");
  box(g, INK.ink, -2, -24, 4, 11);
  box(g, INK.ink, -2.2, -36, 4.4, 14).attr("transform", "rotate(32 0 -22)");
}

export function lighthouse(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  poly(g, "rgba(255,209,102,0.32)", [[5, -33], [30, -43], [30, -24]]);
  poly(g, "rgba(255,209,102,0.32)", [[-5, -33], [-30, -43], [-30, -24]]);
  poly(g, INK.cream, [[-6.5, 0], [-4.3, -30], [4.3, -30], [6.5, 0]]);
  poly(g, INK.roof, [[-6, -8], [-5.4, -16], [5.4, -16], [6, -8]]);
  poly(g, INK.roof, [[-5, -22], [-4.6, -28], [4.6, -28], [5, -22]]);
  box(g, INK.lamp, -5, -36, 10, 6);
  poly(g, INK.darkRoof, [[-6.5, -36], [0, -44], [6.5, -36]]);
}

export function radioTower(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  line(g, INK.darkRoof, 1.7, "M-9,0 L0,-44 L9,0");
  line(g, INK.darkRoof, 1, "M-7,-10 H7 M-5,-21 H5 M-3,-31 H3 M-7,-10 L5,-21 M-5,-21 L3,-31");
  circle(g, INK.roof, 0, -46, 2.6);
  for (const r of [7, 12, 17]) {
    line(g, "rgba(255,255,255,0.75)", 1.3, `M${-r * 0.7},${-46 - r * 0.7} A${r},${r} 0 0 1 ${r * 0.7},${-46 - r * 0.7}`);
  }
}

export function parasol(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  oval(g, "rgba(120,50,10,0.18)", 3, 0, 9, 2.5);
  line(g, INK.wood, 1.3, "M0,0 V-14");
  shape(g, INK.roof, "M-11,-13 A11,8 0 0 1 11,-13 Z");
  poly(g, INK.cream, [[0, -21], [-4, -13], [4, -13]]);
}

// ---- Places ----

export function plaza(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  oval(g, INK.sand, 0, 0, 24, 11);
  oval(g, INK.creamShade, 0, 0, 10, 5);
  oval(g, INK.water, 0, 0, 7.5, 3.6);
  line(g, INK.water, 1.6, "M0,-1 V-9 M0,-9 q-3,1 -4.5,4.5 M0,-9 q3,1 4.5,4.5");
}

export function fields(layer, x, y, s = 1, angle = 0) {
  const g = place(layer, x, y, s, angle);
  const crops = [["#f2c27e", "#e3a35e"], ["#5cc79a", "#3fae84"], ["#3fae84", "#5cc79a"], ["#e3a35e", "#f2c27e"]];
  crops.forEach(([a, b], i) => {
    const left = (i % 2) * 35 - 35;
    const top = Math.floor(i / 2) * 23 - 23;
    for (let row = 0; row < 5; row++) box(g, row % 2 ? a : b, left + 1, top + 1 + row * 4.2, 33, 4.2);
  });
}

export function lagoon(layer, x, y, rx, ry) {
  const g = place(layer, x, y);
  oval(g, INK.waterEdge, 0, 1.5, rx + 3, ry + 3);
  oval(g, INK.water, 0, 0, rx, ry);
  line(g, "rgba(255,255,255,0.6)", 1.2, `M${-rx * 0.4},${-ry * 0.2} q4,-3 8,0`);
}

export function bridge(layer, x, y, angle = 0) {
  const g = place(layer, x, y, 1, angle);
  box(g, INK.wood, -10, -5, 20, 10, 1.5);
  line(g, INK.trunk, 1.3, "M-10,-5 H10 M-10,5 H10");
}

export function dock(layer, x, y, length) {
  const g = place(layer, x, y);
  box(g, INK.wood, 0, -3, length, 6);
  for (let px = 6; px < length; px += 10) box(g, INK.trunk, px, 3, 2.5, 5);
}

export function boat(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  poly(g, INK.wood, [[-14, 0], [14, 0], [9, 7], [-9, 7]]);
  box(g, INK.trunk, -0.8, -24, 1.6, 24);
  poly(g, INK.cream, [[2, -23], [13, -3], [2, -3]]);
  poly(g, "#ffd9b8", [[-2, -19], [-11, -3], [-2, -3]]);
}

export function tombstone(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  shape(g, INK.stone, "M-4.5,0 v-9 a4.5,4.5 0 0 1 9,0 v9 z");
  box(g, INK.stoneShade, 1.5, -10, 3, 10);
}

export function cross(layer, x, y, s = 1) {
  const g = place(layer, x, y, s);
  box(g, INK.stone, -1.3, -13, 2.6, 13);
  box(g, INK.stone, -4.5, -10, 9, 2.4);
}

export function compass(layer, x, y) {
  const star = "0,-26 5,-5 26,0 5,5 0,26 -5,5 -26,0 -5,-5";
  const g = place(layer, x, y);
  circle(g, INK.roofShade, 0, 0, 30).attr("stroke", INK.roof).attr("stroke-width", 2.5);
  g.append("polygon").attr("points", star).attr("transform", "rotate(45) scale(0.62)").attr("fill", INK.darkRoof);
  g.append("polygon").attr("points", star).attr("fill", INK.roof);
  circle(g, INK.cream, 0, 0, 4);
  g.append("text").attr("y", -36).attr("text-anchor", "middle").attr("fill", INK.roof)
    .attr("font-size", 11).attr("font-weight", 700).text("N");
}
