const GOOGLE_MAPS_API_KEY = process.env.API_KEY;
const MAP_SCRIPT_ID = 'google-maps-script';

let isLoaded = false;
let loadingPromise: Promise<void> | null = null;

export const loadGoogleMapsApi = (): Promise<void> => {
    if (isLoaded) {
        return Promise.resolve();
    }

    if (loadingPromise) {
        return loadingPromise;
    }

    loadingPromise = new Promise((resolve, reject) => {
        if (document.getElementById(MAP_SCRIPT_ID)) {
            isLoaded = true;
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.id = MAP_SCRIPT_ID;
        // FIX: Added the 'marker' library to the script URL to support the new AdvancedMarkerElement.
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            isLoaded = true;
            loadingPromise = null;
            resolve();
        };

        script.onerror = () => {
            loadingPromise = null;
            reject(new Error('Failed to load Google Maps API.'));
        };

        document.head.appendChild(script);
    });
    
    return loadingPromise;
};
