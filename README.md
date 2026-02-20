⚡ EV Station Finder - Advanced WebGIS Navigation

A high-performance, modular WebGIS application designed for Electric Vehicle (EV) drivers. This application provides real-time station discovery, 2D/3D synchronized navigation, and environmental data integration.
🚀 Key Engineering Highlights
1. Dual-Engine Spatial Synchronization

The "brain" of the app is the Map Manager, which coordinates two different rendering engines:

    Leaflet (2D View): Handles high-performance marker clustering, spatial search, and isochrone (reachability) calculations.

    MapLibre GL (3D View): Provides a fluid, vector-based navigation experience with 3D buildings, terrain elevation, and smooth camera interpolation for a "car-view" perspective.

    The Sync: User coordinates and heading are shared between engines in real-time, allowing a seamless transition from browsing (2D) to driving (3D).

2. Modular Architecture (ES6 Modules)

The project was refactored from a monolithic structure into specialized service layers:

    api.js: Centralized data fetching (Charging Stations, Weather, Elevation).

    map-manager.js: Encapsulated geospatial logic and engine coordination.

    ui-controller.js: Decoupled UI state and gesture-based interactions.

    utils.js: Pure helper functions for formatting and unit conversions.

3. Mobile-First "Bottom Sheet" Interaction

To mimic native mobile experiences (like Google or Apple Maps), the app features a custom-built, pointer-event-driven bottom panel. It supports:

    Flick gestures to expand/collapse.

    Dynamic transparency based on scroll depth.

    Responsive layout that shifts from a bottom drawer (mobile) to a sidebar (desktop).

4. PWA & Offline Capability

Built as a Progressive Web App, it includes a custom Service Worker strategy:

    Core Asset Caching: Immediate access to logic and styles even without signal.

    External Library Versioning: Caches critical GIS libraries (Turf.js, Leaflet) via CDN interception.

    Manifest Integration: Add to home screen with standalone display mode.

🛠 Tech Stack

    Mapping: Leaflet.js, MapLibre GL, OpenStreetMap.

    Spatial Analysis: Turf.js (Geospatial math), OpenRouteService (Isochrones).

    Data APIs: OpenChargeMap (Charger data), Open-Meteo (Weather), OSRM (Routing).

    UI/UX: Vanilla JS (ES6+), CSS Grid/Flexbox, Chart.js (Elevation profiles).

🗺 Features

    🔍 Smart Search: Filter by state, station name, or operator.

    📉 Elevation Profiling: View the terrain slope of your route to estimate energy consumption.

    🌡 Environment Awareness: Real-time temperature checks at your destination.

    📏 Reachability Mapping: Visualize how far you can drive based on time or distance.

⚙️ Local Setup

    Clone the repository.

    Open config.js and add your API keys:

        OpenRouteService API Key (for reachability).

        MapTiler API Key (for 3D vector tiles).

        OpenChargeMap API Key (for charger data).

    Launch via any local web server (e.g., Live Server in VS Code).