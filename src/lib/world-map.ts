import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import topoData from "world-atlas/countries-110m.json";

// world-atlas TopoJSON → GeoJSON features, then projected to flat SVG paths.
// 빌드 타임에 한 번만 돌고, 결과는 정적 SVG로 inline 됨.

const WIDTH = 960;
const HEIGHT = 500;

const topo = topoData as any;
const features = (feature(topo, topo.objects.countries) as any).features as any[];

const projection = geoNaturalEarth1()
  .scale(180)
  .translate([WIDTH / 2, HEIGHT / 2 - 8]);

const pathGen = geoPath(projection as any);

const continentByName: Record<string, "asia" | "americas" | "europe" | "africa" | "oceania" | "antarctica"> = {
  // Asia
  "China": "asia", "Japan": "asia", "South Korea": "asia", "North Korea": "asia",
  "Mongolia": "asia", "India": "asia", "Pakistan": "asia", "Bangladesh": "asia",
  "Nepal": "asia", "Bhutan": "asia", "Sri Lanka": "asia", "Myanmar": "asia",
  "Thailand": "asia", "Vietnam": "asia", "Laos": "asia", "Cambodia": "asia",
  "Malaysia": "asia", "Indonesia": "asia", "Philippines": "asia", "Brunei": "asia",
  "Timor-Leste": "asia", "Taiwan": "asia",
  "Kazakhstan": "asia", "Uzbekistan": "asia", "Turkmenistan": "asia",
  "Kyrgyzstan": "asia", "Tajikistan": "asia", "Afghanistan": "asia",
  "Iran": "asia", "Iraq": "asia", "Saudi Arabia": "asia", "Yemen": "asia",
  "Oman": "asia", "United Arab Emirates": "asia", "Qatar": "asia", "Kuwait": "asia",
  "Syria": "asia", "Jordan": "asia", "Lebanon": "asia", "Israel": "asia",
  "Palestine": "asia", "Turkey": "asia", "Georgia": "asia", "Armenia": "asia",
  "Azerbaijan": "asia", "Cyprus": "asia", "N. Cyprus": "asia",
  // Americas
  "Canada": "americas", "United States of America": "americas", "Mexico": "americas",
  "Guatemala": "americas", "Honduras": "americas", "Nicaragua": "americas",
  "Costa Rica": "americas", "Panama": "americas", "El Salvador": "americas",
  "Belize": "americas", "Cuba": "americas", "Haiti": "americas",
  "Dominican Rep.": "americas", "Jamaica": "americas", "Bahamas": "americas",
  "Puerto Rico": "americas", "Trinidad and Tobago": "americas",
  "Brazil": "americas", "Argentina": "americas", "Chile": "americas",
  "Peru": "americas", "Colombia": "americas", "Venezuela": "americas",
  "Ecuador": "americas", "Bolivia": "americas", "Paraguay": "americas",
  "Uruguay": "americas", "Guyana": "americas", "Suriname": "americas",
  "Falkland Is.": "americas",
  // Europe
  "United Kingdom": "europe", "Ireland": "europe", "France": "europe",
  "Germany": "europe", "Spain": "europe", "Portugal": "europe", "Italy": "europe",
  "Switzerland": "europe", "Austria": "europe", "Netherlands": "europe",
  "Belgium": "europe", "Luxembourg": "europe", "Denmark": "europe",
  "Norway": "europe", "Sweden": "europe", "Finland": "europe", "Iceland": "europe",
  "Poland": "europe", "Czechia": "europe", "Slovakia": "europe", "Hungary": "europe",
  "Romania": "europe", "Bulgaria": "europe", "Greece": "europe", "Serbia": "europe",
  "Croatia": "europe", "Bosnia and Herz.": "europe", "Slovenia": "europe",
  "Albania": "europe", "Macedonia": "europe", "Montenegro": "europe",
  "Kosovo": "europe", "Ukraine": "europe", "Belarus": "europe",
  "Lithuania": "europe", "Latvia": "europe", "Estonia": "europe",
  "Moldova": "europe", "Russia": "europe", "Greenland": "europe",
  // Africa
  "South Africa": "africa", "Lesotho": "africa", "eSwatini": "africa",
  "Namibia": "africa", "Botswana": "africa", "Zimbabwe": "africa",
  "Zambia": "africa", "Mozambique": "africa", "Malawi": "africa",
  "Tanzania": "africa", "Kenya": "africa", "Uganda": "africa",
  "Rwanda": "africa", "Burundi": "africa", "Ethiopia": "africa",
  "Somalia": "africa", "Somaliland": "africa", "Djibouti": "africa",
  "Eritrea": "africa", "Sudan": "africa", "S. Sudan": "africa",
  "Egypt": "africa", "Libya": "africa", "Tunisia": "africa",
  "Algeria": "africa", "Morocco": "africa", "W. Sahara": "africa",
  "Mauritania": "africa", "Mali": "africa", "Niger": "africa", "Chad": "africa",
  "Nigeria": "africa", "Cameroon": "africa", "Central African Rep.": "africa",
  "Gabon": "africa", "Eq. Guinea": "africa", "Congo": "africa",
  "Dem. Rep. Congo": "africa", "Angola": "africa", "Ghana": "africa",
  "Côte d'Ivoire": "africa", "Burkina Faso": "africa", "Togo": "africa",
  "Benin": "africa", "Guinea": "africa", "Guinea-Bissau": "africa",
  "Sierra Leone": "africa", "Liberia": "africa", "Senegal": "africa",
  "Gambia": "africa", "Madagascar": "africa",
  // Oceania
  "Australia": "oceania", "Papua New Guinea": "oceania", "New Zealand": "oceania",
  "Fiji": "oceania", "Solomon Is.": "oceania", "New Caledonia": "oceania",
  "Vanuatu": "oceania",
  // Antarctica (skip from emphasis but include in base map)
  "Antarctica": "antarctica", "Fr. S. Antarctic Lands": "antarctica",
};

// ASEZ 활동 활발 국가 (지도에서 brand 컬러로 강조).
const presenceSet = new Set([
  "South Korea", "Japan", "China", "India", "Philippines", "Indonesia",
  "Vietnam", "Thailand", "Malaysia", "Mongolia", "Nepal", "Sri Lanka",
  "Taiwan", "Cambodia", "Myanmar", "Bangladesh",
  "United States of America", "Canada", "Mexico", "Brazil", "Peru",
  "Argentina", "Chile", "Colombia", "Ecuador", "Bolivia",
  "United Kingdom", "France", "Germany", "Italy", "Spain", "Portugal",
  "Poland", "Ukraine", "Netherlands", "Ireland", "Belgium",
  "South Africa", "Kenya", "Nigeria", "Ghana", "Ethiopia", "Egypt",
  "Tanzania", "Uganda", "Morocco", "Rwanda",
  "Australia", "Papua New Guinea", "New Zealand", "Timor-Leste", "Fiji",
]);

export type Country = {
  id: string;
  name: string;
  d: string;
  continent: string;
  active: boolean;
};

export const countries: Country[] = features
  .map((f: any) => {
    const d = pathGen(f);
    if (!d) return null;
    const name = f.properties?.name ?? "";
    return {
      id: String(f.id),
      name,
      d,
      continent: continentByName[name] ?? "other",
      active: presenceSet.has(name),
    };
  })
  .filter(Boolean) as Country[];

// 마커: 도시 lat/lng → 정확한 projection 좌표.
export type Marker = {
  city: string;
  country: string;
  role: string;
  kind: "hq" | "campus";
  x: number;
  y: number;
};

const cities: Array<Omit<Marker, "x" | "y"> & { lng: number; lat: number }> = [
  { city: "Seoul",       country: "South Korea",  role: "Asia HQ",     kind: "hq",     lng: 126.978, lat: 37.566 },
  { city: "Los Angeles", country: "USA",          role: "Americas HQ", kind: "hq",     lng: -118.244, lat: 34.052 },
  { city: "London",      country: "UK",           role: "Europe HQ",   kind: "hq",     lng: -0.127, lat: 51.507 },
  { city: "Nairobi",     country: "Kenya",        role: "Africa HQ",   kind: "hq",     lng: 36.817, lat: -1.286 },
  { city: "Sydney",      country: "Australia",    role: "Oceania HQ",  kind: "hq",     lng: 151.209, lat: -33.868 },
  { city: "New Delhi",   country: "India",        role: "Plastic-Free India",     kind: "campus", lng: 77.209, lat: 28.614 },
  { city: "Manila",      country: "Philippines",  role: "Reduce Crime Together", kind: "campus", lng: 120.984, lat: 14.599 },
  { city: "Dili",        country: "Timor-Leste",  role: "National partnership",  kind: "campus", lng: 125.564, lat: -8.557 },
  { city: "Pretoria",    country: "South Africa", role: "Tree-planting program", kind: "campus", lng: 28.188, lat: -25.747 },
  { city: "Lima",        country: "Peru",         role: "Amazon protection",     kind: "campus", lng: -77.043, lat: -12.046 },
];

export const markers: Marker[] = cities.map((c) => {
  const [x, y] = (projection as any)([c.lng, c.lat]) ?? [0, 0];
  return {
    city: c.city,
    country: c.country,
    role: c.role,
    kind: c.kind,
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
});

export const viewBox = `0 0 ${WIDTH} ${HEIGHT}`;
export const mapWidth = WIDTH;
export const mapHeight = HEIGHT;

// 각 대륙별 viewBox — 해당 대륙 country path들의 bounding box를 d3-geoPath.bounds()로 계산.
const continentBounds: Record<string, [number, number, number, number]> = {};
for (const f of features) {
  const name = f.properties?.name ?? "";
  const cont = continentByName[name];
  if (!cont || cont === "antarctica") continue;
  const b = pathGen.bounds(f);
  const cur = continentBounds[cont];
  if (!cur) {
    continentBounds[cont] = [b[0][0], b[0][1], b[1][0], b[1][1]];
  } else {
    cur[0] = Math.min(cur[0], b[0][0]);
    cur[1] = Math.min(cur[1], b[0][1]);
    cur[2] = Math.max(cur[2], b[1][0]);
    cur[3] = Math.max(cur[3], b[1][1]);
  }
}

export const continentViewBox: Record<string, string> = {};
for (const [cont, b] of Object.entries(continentBounds)) {
  const pad = 6;
  const x = b[0] - pad;
  const y = b[1] - pad;
  const w = b[2] - b[0] + pad * 2;
  const h = b[3] - b[1] + pad * 2;
  continentViewBox[cont] = `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}

export const countriesByContinent: Record<string, Country[]> = {};
for (const c of countries) {
  if (!countriesByContinent[c.continent]) countriesByContinent[c.continent] = [];
  countriesByContinent[c.continent].push(c);
}
