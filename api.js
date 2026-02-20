import { OPENCHARGEMAP_API_KEY } from './config.js';

export async function getNavTemperature(lat, lng) {
    try {
        const url =
            'https://api.open-meteo.com/v1/forecast?latitude=' +
            encodeURIComponent(lat) +
            '&longitude=' +
            encodeURIComponent(lng) +
            '&current=temperature_2m&timezone=auto';
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const t =
            data &&
            data.current &&
            typeof data.current.temperature_2m === 'number'
                ? Math.round(data.current.temperature_2m)
                : null;
        return typeof t === 'number' ? t : null;
    } catch {
        return null;
    }
}

export async function getChargingStations(options = {}) {
    const {
        countryCode = 'MY',
        latitude,
        longitude,
        distanceKm,
        maxResults = 10000
    } = options;

    const params = new URLSearchParams({
        output: 'json',
        countrycode: countryCode,
        maxresults: String(maxResults),
        compact: 'false',
        verbose: 'true',
        key: OPENCHARGEMAP_API_KEY
    });

    if (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        typeof distanceKm === 'number'
    ) {
        params.set('latitude', String(latitude));
        params.set('longitude', String(longitude));
        params.set('distance', String(distanceKm));
        params.set('distanceunit', 'KM');
    }

    const url = `https://api.openchargemap.io/v3/poi/?${params.toString()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export async function getRouteElevationProfile(routeGeoJSON, navGlMap) {
    if (
        !routeGeoJSON ||
        !routeGeoJSON.coordinates ||
        !routeGeoJSON.coordinates.length ||
        !navGlMap ||
        typeof navGlMap.queryTerrainElevation !== 'function'
    ) {
        return null;
    }

    const line = turf.lineString(routeGeoJSON.coordinates);
    const totalDistKm = turf.length(line, { units: 'kilometers' });
    if (!totalDistKm || totalDistKm <= 0) {
        return null;
    }

    const stepKm = 0.2;
    const distances = [];
    const elevations = [];
    const slopes = [];

    let lastElev = null;
    let d = 0;
    while (d <= totalDistKm + 1e-6) {
        const pt = turf.along(line, d, { units: 'kilometers' });
        const coord = pt && pt.geometry && pt.geometry.coordinates;
        if (!coord) break;
        const lng = coord[0];
        const lat = coord[1];
        const elev = navGlMap.queryTerrainElevation({ lng, lat }) ?? 0;

        distances.push(d);
        elevations.push(elev);

        if (lastElev !== null && distances.length > 1) {
            const prevD = distances[distances.length - 2];
            const dKm = d - prevD;
            const dM = dKm * 1000;
            const rise = elev - lastElev;
            const slopePct = dM > 0 ? (rise / dM) * 100 : 0;
            slopes.push(slopePct);
        } else {
            slopes.push(0);
        }

        lastElev = elev;
        d += stepKm;
    }

    if (!distances.length || elevations.length < 2) {
        return null;
    }

    return {
        distances,
        elevations,
        slopes,
        totalDistKm
    };
}

if (typeof window !== 'undefined') {
    window.getNavTemperature = getNavTemperature;
    window.getChargingStations = getChargingStations;
    window.getRouteElevationProfile = getRouteElevationProfile;
}

