export const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI3MWJkNGJjMDI3NjQwZTk5MDBkMmI2OWJlNjI4MGE5IiwiaCI6Im11cm11cjY0In0=';
export const ORS_ISOCHRONE_URL = 'https://api.openrouteservice.org/v2/isochrones/driving-car';
export const OSRM_BASE_URL = 'https://router.project-osrm.org';
export const MAPTILER_API_KEY = 'lDUYLvmpj4UGdtFecEHo';
export const OPENCHARGEMAP_API_KEY = 'c10f1691-d3a4-4408-bf34-ff9a3b3e69bd';
export const NAV_GL_STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/positron';
export const NAV_GL_STYLE_DARK = 'https://tiles.openfreemap.org/styles/fiord-color';
export const MALAYSIA_STATES = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Perak',
    'Perlis',
    'Pulau Pinang',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
    'Kuala Lumpur'
];

if (typeof window !== 'undefined') {
    window.ORS_API_KEY = ORS_API_KEY;
    window.ORS_ISOCHRONE_URL = ORS_ISOCHRONE_URL;
    window.OSRM_BASE_URL = OSRM_BASE_URL;
    window.MAPTILER_API_KEY = MAPTILER_API_KEY;
    window.OPENCHARGEMAP_API_KEY = OPENCHARGEMAP_API_KEY;
    window.NAV_GL_STYLE_LIGHT = NAV_GL_STYLE_LIGHT;
    window.NAV_GL_STYLE_DARK = NAV_GL_STYLE_DARK;
    window.MALAYSIA_STATES = MALAYSIA_STATES;
}
