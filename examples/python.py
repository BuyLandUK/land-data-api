"""BuyLand Land Data API — Python examples. Requires `requests`. No key needed."""
import requests

BASE = "https://buyland.co.uk/api/v1"


def get(path, **params):
    r = requests.get(f"{BASE}{path}", params=params, timeout=20)
    r.raise_for_status()
    return r.json()


sales = get("/sold-prices", postcode="CW5 7PX", limit=3)
print(f"{sales['count']} sales ({sales['scope']}) near {sales['postcode']}")
for s in sales["sales"]:
    print(f"  £{s['price_paid']:,} {s['date']} — {s['address']}")

value = get("/land-value", postcode="GL7 5NX", acres=2.5, land_type="Pasture")
print(f"Guide value: £{value['low']:,}–£{value['high']:,} ({value['method']})")

parcel = get("/parcel", lat=53.0066, lng=-2.4257)
print("Parcel:", parcel.get("inspire_id"), parcel.get("area_acres"), "acres")

cons = get("/constraints", lat=51.2287, lng=-0.4, radius_m=50)
print("Flagged designations:", ", ".join(cons["flagged"]) or "none")

# Always show the attribution and link to the source_url where you display the data.
print(sales["attribution"])
print(sales["source_url"])
