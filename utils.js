export function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function getTurnIcon(modifier) {
    const style =
        'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
    const size = 'style="width: 32px; height: 32px;"';
    const svgStart = `<svg viewBox="0 0 24 24" ${style} ${size}>`;

    if (modifier === 'arrive') {
        return `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 32px; height: 32px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
    }

    let path;
    if (modifier === 'uturn') {
        path =
            '<path d="M7 19v-7a4 4 0 0 1 8 0v7M7 19l-4-4M7 19l4-4"/>';
    } else if (modifier.includes('sharp left')) {
        path =
            '<path d="M18 20v-8a4 4 0 0 0-4-4H4M4 8l5-5M4 8l5 5"/>';
    } else if (modifier.includes('slight left')) {
        path =
            '<path d="M15 21v-8a6 6 0 0 0-6-6M9 7l-4-4 4-4"/>';
    } else if (modifier.includes('left')) {
        path =
            '<path d="M17 21v-8a4 4 0 0 0-4-4H5M5 9l5-5M5 9l5 5"/>';
    } else if (modifier.includes('sharp right')) {
        path =
            '<path d="M6 20v-8a4 4 0 0 1 4-4h10M20 8l-5-5M20 8l-5 5"/>';
    } else if (modifier.includes('slight right')) {
        path =
            '<path d="M9 21v-8a6 6 0 0 1 6-6M15 7l4-4-4-4"/>';
    } else if (modifier.includes('right')) {
        path =
            '<path d="M7 21v-8a4 4 0 0 1 4-4h8M19 9l-5-5M19 9l-5 5"/>';
    } else {
        path = '<path d="M12 21V3M5 10l7-7 7 7"/>';
    }

    return `${svgStart}${path}</svg>`;
}

export function normalizeConnectionType(c) {
    const id = c?.ConnectionTypeID || c?.ConnectionType?.ID || c?.id;
    const idMap = {
        33: 'CCS (Type 2)',
        2: 'CHAdeMO',
        25: 'Type 2 (Socket)',
        1036: 'Type 2 (Tethered)',
        1: 'Type 1 (J1772)',
        30: 'Tesla (Model S/X)',
        27: 'Tesla Supercharger',
        32: 'CCS (Type 1)',
        3: 'BS1363 3-Pin'
    };
    if (idMap[id]) return idMap[id];

    if (c?.type && c.type !== 'Unknown') return c.type;

    let t =
        c?.ConnectionType?.Title ||
        c?.ConnectionType?.FormalName ||
        '';
    if (!t || t.toLowerCase() === 'unknown') {
        const level = (c?.Level?.Title || c?.level || '').toLowerCase();
        const current =
            (c?.CurrentType?.Title || c?.current || '').toLowerCase();
        const desc =
            (c?.ConnectionType?.Description || '').toLowerCase();
        const combined = `${level} ${current} ${desc}`;

        if (combined.includes('ccs') || combined.includes('combo'))
            return 'CCS';
        if (combined.includes('chademo')) return 'CHAdeMO';
        if (
            combined.includes('type 2') ||
            combined.includes('mennekes')
        )
            return 'Type 2';
        if (combined.includes('type 1') || combined.includes('yazaki'))
            return 'Type 1';
        if (combined.includes('tesla')) return 'Tesla';
        if (current.includes('dc')) return 'DC Fast';
        if (current.includes('ac')) return 'AC';
    }
    return t ? t : 'Unknown';
}

export function formatDistance(km) {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
}

export function formatPlugInfo(conn) {
    if (!conn) return 'Unknown';

    let type;
    if (typeof conn === 'string') {
        type = conn;
    } else if (typeof conn.type === 'string' && conn.type && conn.type !== 'Unknown') {
        type = conn.type;
    } else {
        type = normalizeConnectionType(conn);
    }

    const power =
        conn && (typeof conn.power === 'number' || typeof conn.powerKw === 'number')
            ? `${(conn.powerKw ?? conn.power)} kW`
            : null;

    return power ? `${type} (${power})` : type;
}

if (typeof window !== 'undefined') {
    window.getDistance = getDistance;
    window.getTurnIcon = getTurnIcon;
    window.normalizeConnectionType = normalizeConnectionType;
    window.formatDistance = formatDistance;
    window.formatPlugInfo = formatPlugInfo;
}
