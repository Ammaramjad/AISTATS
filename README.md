# Fleet OS

A responsive Astro and Three.js transportation-booking prototype. The booking UI is immediately usable while an original procedural city, shared road graph, route, and selected vehicle render progressively.

## Commands

- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`

## Integration status

This repository arrived without an application or backend contract. Confirmation therefore saves no reservation and collects no payment; the UI labels that state explicitly. Connect authentication, geocoding, live availability, pricing, dispatch, payment, and durable reservation APIs before production use.

World geometry uses **1 Three.js unit = 1 metre**. Road nodes, route lines, buildings, and vehicles share that scale and a level `y = 0` ground plane.
