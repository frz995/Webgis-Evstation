import { mapManager } from './map-manager.js';

export function initUI() {
    if (typeof window.setupSidePanelDrag === 'function') {
        window.setupSidePanelDrag();
    }
    if (typeof window.setupEventListeners === 'function') {
        window.setupEventListeners();
    }
    if (typeof window.setupIntroOverlay === 'function') {
        window.setupIntroOverlay();
    }
}

export function handleStationClick(station) {
    if (!station || !station.geometry || !station.geometry.coordinates) return;
    const [lng, lat] = station.geometry.coordinates;
    mapManager.flyToStation(lat, lng);
}

if (typeof window !== 'undefined') {
    window.handleStationClick = handleStationClick;
}

