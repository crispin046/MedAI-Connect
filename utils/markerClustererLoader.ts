const MARKER_CLUSTERER_SCRIPT_ID = 'google-maps-marker-clusterer-script';

let isClustererLoaded = false;
let clustererLoadingPromise: Promise<void> | null = null;

export const loadMarkerClustererApi = (): Promise<void> => {
    if (isClustererLoaded) {
        return Promise.resolve();
    }

    if (clustererLoadingPromise) {
        return clustererLoadingPromise;
    }

    clustererLoadingPromise = new Promise((resolve, reject) => {
        if (document.getElementById(MARKER_CLUSTERER_SCRIPT_ID)) {
            isClustererLoaded = true;
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.id = MARKER_CLUSTERER_SCRIPT_ID;
        script.src = `https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            isClustererLoaded = true;
            clustererLoadingPromise = null;
            resolve();
        };

        script.onerror = () => {
            clustererLoadingPromise = null;
            reject(new Error('Failed to load Google Maps MarkerClusterer API.'));
        };

        document.head.appendChild(script);
    });
    
    return clustererLoadingPromise;
};
