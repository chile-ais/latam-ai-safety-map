import { CATEGORIES, ORGS } from "./data.js";
import { drawMap } from "./map.js";

const categoryLabel = Object.fromEntries(CATEGORIES.map(category => [category.id, category.label]));
const filters = { category: null, country: "", query: "" };

const element = id => document.getElementById(id);
const placeOf = org => (org.city ? `${org.city}, ${org.country}` : org.country);
const hostOf = url => new URL(url).hostname.replace(/^www\./, "");
const cardId = org => `card-${ORGS.indexOf(org)}`;

function matches(org) {
  if (filters.category && org.category !== filters.category) return false;
  if (filters.country && org.country !== filters.country) return false;
  if (!filters.query) return true;
  const text = [org.name, org.short, org.description, placeOf(org), categoryLabel[org.category]].join(" ");
  return text.toLowerCase().includes(filters.query);
}

function renderChips() {
  const chips = [{ id: null, label: "All", count: ORGS.length }];
  for (const category of CATEGORIES) {
    chips.push({ ...category, count: ORGS.filter(org => org.category === category.id).length });
  }
  element("chips").replaceChildren(...chips.map(chip => {
    const button = document.createElement("button");
    button.className = "chip";
    button.setAttribute("aria-pressed", String(filters.category === chip.id));
    button.innerHTML = `${chip.label} <span class="chip-count">${chip.count}</span>`;
    button.addEventListener("click", () => {
      filters.category = filters.category === chip.id ? null : chip.id;
      refresh();
    });
    return button;
  }));
}

function renderCard(org) {
  const card = document.createElement("article");
  card.className = "card";
  card.id = cardId(org);
  const logo = org.icon ? `<img class="card-logo" src="${org.icon}" alt="">` : "";
  const badge = org.status ? `<span class="badge">${org.status === "inactive" ? "inactive" : "status unclear"}</span>` : "";
  card.innerHTML = `
    <h3>${logo}<span>${org.name}</span>${badge}</h3>
    <p class="card-meta">${categoryLabel[org.category]} · ${placeOf(org)}</p>
    <p>${org.description}</p>
    <a href="${org.url}" target="_blank" rel="noopener">${hostOf(org.url)}</a>`;
  return card;
}

function renderCards() {
  const shown = ORGS.filter(matches);
  element("grid").replaceChildren(...shown.map(renderCard));
  element("count").textContent = shown.length === ORGS.length ? `${ORGS.length} listings` : `${shown.length} of ${ORGS.length}`;
  element("empty").hidden = shown.length > 0;
}

function showTip(org, pin) {
  const tip = element("tip");
  const panel = element("map-panel");
  tip.innerHTML = `
    <strong>${org.name}</strong>
    <span class="tip-meta">${categoryLabel[org.category]} · ${placeOf(org)}</span>
    <span>${org.description}</span>`;
  tip.hidden = false;
  const panelBox = panel.getBoundingClientRect();
  const pinBox = pin.getBoundingClientRect();
  const maxX = panel.scrollLeft + panelBox.width - tip.offsetWidth - 10;
  let x = pinBox.right - panelBox.left + panel.scrollLeft + 8;
  if (x > maxX) x = pinBox.left - panelBox.left + panel.scrollLeft - tip.offsetWidth - 8;
  const y = Math.min(pinBox.top - panelBox.top, panelBox.height - tip.offsetHeight - 10);
  tip.style.left = `${Math.max(panel.scrollLeft + 10, x)}px`;
  tip.style.top = `${Math.max(10, y)}px`;
}

function hideTip() {
  element("tip").hidden = true;
}

function selectOrg(org) {
  hideTip();
  filters.category = null;
  filters.country = "";
  filters.query = "";
  element("search").value = "";
  element("country").value = "";
  refresh();
  const card = element(cardId(org));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  card.classList.add("flash");
  setTimeout(() => card.classList.remove("flash"), 1800);
}

const dimPins = drawMap(element("map"), ORGS, categoryLabel, {
  onEnter: showTip,
  onLeave: hideTip,
  onSelect: selectOrg
});

function refresh() {
  renderChips();
  renderCards();
  dimPins(org => !matches(org));
}

for (const country of [...new Set(ORGS.map(org => org.country))].sort()) {
  element("country").add(new Option(country, country));
}
element("country").addEventListener("change", event => {
  filters.country = event.target.value;
  refresh();
});
element("search").addEventListener("input", event => {
  filters.query = event.target.value.trim().toLowerCase();
  refresh();
});
refresh();
