import { mapManager } from './map-manager.js';
import { initUI } from './ui-controller.js';
import './api.js';

window.addEventListener('DOMContentLoaded', () => {
    mapManager.initMaps();
    initUI();

    if (typeof window.initSDK === 'function') {
        window.initSDK();
    }
    if (typeof window.loadSavedAddresses === 'function') {
        window.loadSavedAddresses();
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
});
