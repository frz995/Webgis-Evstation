import {
    ORS_API_KEY,
    ORS_ISOCHRONE_URL,
    OSRM_BASE_URL,
    MAPTILER_API_KEY,
    NAV_GL_STYLE_LIGHT,
    NAV_GL_STYLE_DARK,
    MALAYSIA_STATES
} from './config.js';

import {
    getDistance,
    getTurnIcon,
    normalizeConnectionType,
    formatDistance,
    formatPlugInfo
} from './utils.js';

class MapManager {
    constructor() {
        this.map = null;
        this.navGlMap = null;
        this.navGlMapReady = false;
        this.navGlIsDarkStyle = false;

        this.navigationActive = false;
        this.isNavigating = false;
        this.isNavTracking = true;

        this.geolocationWatchId = null;

        this.lastNavCameraUpdateTime = 0;
        this.lastNavCameraLat = null;
        this.lastNavCameraLng = null;
        this.lastNavPos = null;
    }

    initMaps() {
        if (typeof window.initMap === 'function') {
            window.initMap();
        }
    }

    drawRoute(data) {
        if (typeof window.getDirections === 'function' && data && data.lat && data.lng) {
            window.getDirections(data.lat, data.lng, data.name || '', data.id || null);
        }
    }

    toggleNavMode(active) {
        if (active) {
            if (typeof window.startNavigation === 'function') {
                window.startNavigation();
            }
        } else if (typeof window.stopNavigation === 'function') {
            window.stopNavigation();
        }
    }

    updateUserLocation(coords) {
        if (
            typeof window.onLocationFound === 'function' &&
            coords &&
            typeof coords.lat === 'number' &&
            typeof coords.lng === 'number'
        ) {
            window.onLocationFound(coords.lat, coords.lng, '');
        }
    }

    flyToStation(lat, lng, zoom) {
        const map = window.map;
        if (!map) return;
        const targetZoom = typeof zoom === 'number' ? zoom : 16;
        map.flyTo([lat, lng], targetZoom, {
            animate: true,
            duration: 1.5
        });
    }

    updateNavMap(lat, lng, bearing) {
        const navGl = this.navGlMap || window.navGlMap;
        if (!navGl || !navGl.isStyleLoaded()) return;

        const center = [lng, lat];
        const now = performance.now();
        if (this.lastNavCameraLat !== null && this.lastNavCameraLng !== null) {
            const moveKm = getDistance(lat, lng, this.lastNavCameraLat, this.lastNavCameraLng);
            if (moveKm < 0.01 && (now - this.lastNavCameraUpdateTime) < 200) {
                return;
            }
        }

        let effectiveBearing = bearing;

        if ((effectiveBearing === null || effectiveBearing === undefined || isNaN(effectiveBearing)) && this.lastNavPos) {
            const dLon = (lng - this.lastNavPos.lng) * Math.PI / 180;
            const lat1 = this.lastNavPos.lat * Math.PI / 180;
            const lat2 = lat * Math.PI / 180;
            const y = Math.sin(dLon) * Math.cos(lat2);
            const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            const brng = Math.atan2(y, x) * 180 / Math.PI;
            effectiveBearing = (brng + 360) % 360;
        }
        this.lastNavPos = { lat, lng };

        if (effectiveBearing === null || effectiveBearing === undefined || isNaN(effectiveBearing)) {
            effectiveBearing = navGl.getBearing();
        }

        if (window.navGlMarker) {
            window.navGlMarker.setLngLat(center);
            window.navGlMarker.setRotation(effectiveBearing);
        }

        if (window.isNavTracking && window.navigationActive) {
            navGl.easeTo({
                center: center,
                zoom: 18,
                pitch: 65,
                bearing: effectiveBearing,
                duration: 280,
                easing: (t) => t,
                essential: true
            });
            this.lastNavCameraUpdateTime = now;
            this.lastNavCameraLat = lat;
            this.lastNavCameraLng = lng;
        }
    }
}

export const mapManager = new MapManager();
