#!/usr/bin/env bash
# BuyLand Land Data API — curl examples. No key needed.
B="https://buyland.co.uk/api/v1"

echo "# Sold prices near a postcode"
curl -s "$B/sold-prices?postcode=CW5%207PX&limit=3" | python3 -m json.tool

echo "# Guide value for 2.5 acres of pasture"
curl -s "$B/land-value?postcode=GL7%205NX&acres=2.5&land_type=Pasture" | python3 -m json.tool

echo "# Registered parcel containing a point"
curl -s "$B/parcel?lat=53.0066&lng=-2.4257" | python3 -m json.tool

echo "# Planning designations at a point (Surrey Hills)"
curl -s "$B/constraints?lat=51.2287&lng=-0.4&radius_m=50" | python3 -m json.tool

echo "# Indicative value of a 4-bed house at a postcode"
curl -s "$B/property-value?postcode=CW5%207PX&bedrooms=4" | python3 -m json.tool
