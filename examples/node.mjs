// BuyLand Land Data API — Node 18+ (native fetch). No key needed.
const BASE = "https://buyland.co.uk/api/v1";

async function get(path, params) {
  const url = `${BASE}${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

const sales = await get("/sold-prices", { postcode: "CW5 7PX", limit: 3 });
console.log(`${sales.count} sales (${sales.scope}) near ${sales.postcode}`);
for (const s of sales.sales) console.log(`  £${s.price_paid.toLocaleString()} ${s.date} — ${s.address}`);

const value = await get("/land-value", { postcode: "GL7 5NX", acres: 2.5, land_type: "Pasture" });
console.log(`Guide value: £${value.low.toLocaleString()}–£${value.high.toLocaleString()} (${value.method})`);

const cons = await get("/constraints", { lat: 51.2287, lng: -0.4, radius_m: 50 });
console.log("Flagged designations:", cons.flagged.join(", ") || "none");

const home = await get("/property-value", { postcode: "CW5 7PX", bedrooms: 4 });
console.log(`Property value: £${home.low.toLocaleString()}–£${home.high.toLocaleString()} (${home.comparables_used} comparables)`);

// Always show the attribution and link to the source_url where you display the data.
console.log(sales.attribution);
console.log(sales.source_url);
