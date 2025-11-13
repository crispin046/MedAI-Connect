import React, { useState, useEffect, useMemo, useRef } from 'react';
import { mockDoctors } from '../data/doctors';
import { getDistance } from '../utils/geolocation';
import type { Doctor } from '../types';
import { DoctorCard } from './DoctorCard';
import { MapPinIcon } from './icons/MapPinIcon';
import { AlertCircleIcon } from './icons/AlertCircleIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ListIcon } from './icons/ListIcon';
import { MapIcon } from './icons/MapIcon';
import { loadGoogleMapsApi } from '../utils/googleMapsLoader';
import { loadMarkerClustererApi } from '../utils/markerClustererLoader';
import { DoctorProfileModal } from './DoctorProfileModal';


// Add global types for Google Maps and MarkerClusterer API to avoid TypeScript errors
declare global {
    interface Window {
        google: any;
        markerClusterer: any;
    }
}

interface DoctorWithDistance extends Doctor {
    distance: number;
}
interface DoctorWithDetails extends DoctorWithDistance {
    isOnline: boolean;
}


export const FindDoctorPage: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorWithDetails[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithDetails | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const [isMapApiLoaded, setIsMapApiLoaded] = useState(false);
    const mapRef = useRef<any>(null); // google.maps.Map
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const userMarkerRef = useRef<any>(null); // For the single user marker
    const clustererRef = useRef<any>(null); // For the doctor marker clusterer
    const doctorMarkersRef = useRef<any[]>([]); // To hold marker instances
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const handleViewProfile = (doctor: DoctorWithDetails) => {
        setSelectedDoctor(doctor);
        setIsProfileModalOpen(true);
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setUserLocation({ latitude: 6.5244, longitude: 3.3792 }); // Default to Lagos
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
            },
            (err) => {
                setError(`Could not get your location: ${err.message}. Showing a default map view.`);
                setUserLocation({ latitude: 6.5244, longitude: 3.3792 }); // Default to Lagos
            }
        );
    }, []);

    useEffect(() => {
        if (userLocation) {
            const initialDoctors = mockDoctors.map(doctor => ({
                ...doctor,
                distance: getDistance(userLocation.latitude, userLocation.longitude, doctor.location.latitude, doctor.location.longitude),
                isOnline: Math.random() > 0.5 // Initial random status
            })).sort((a, b) => a.distance - b.distance);

            setDoctors(initialDoctors);
            setIsLoading(false);
        }
    }, [userLocation]);
    
    useEffect(() => {
        if(doctors.length === 0) return;
        
        const interval = setInterval(() => {
            setDoctors(prevDoctors =>
                prevDoctors.map(doc => ({
                    ...doc,
                    isOnline: Math.random() > 0.6 ? !doc.isOnline : doc.isOnline,
                }))
            );
        }, 7000);
        return () => clearInterval(interval);
    }, [doctors.length]);

    const specialties = useMemo(() => [...new Set(mockDoctors.map(d => d.specialty))].sort(), []);
    const locations = useMemo(() => [...new Set(mockDoctors.map(d => d.location.name))].sort(), []);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            if (showOnlineOnly && !doctor.isOnline) return false;
            if (specialtyFilter && doctor.specialty !== specialtyFilter) return false;
            if (locationFilter && doctor.location.name !== locationFilter) return false;

            if (searchTerm) {
                const lowercasedTerm = searchTerm.toLowerCase();
                return (
                    doctor.name.toLowerCase().includes(lowercasedTerm) ||
                    doctor.specialty.toLowerCase().includes(lowercasedTerm) ||
                    doctor.location.name.toLowerCase().includes(lowercasedTerm)
                );
            }
            return true;
        });
    }, [doctors, searchTerm, specialtyFilter, locationFilter, showOnlineOnly]);
    
    useEffect(() => {
        if (viewMode === 'map') {
            if (filteredDoctors.length > 0 && !selectedDoctor) {
                setSelectedDoctor(filteredDoctors[0]);
            }
            if (filteredDoctors.length > 0 && selectedDoctor && !filteredDoctors.find(d => d.id === selectedDoctor.id)) {
                 setSelectedDoctor(filteredDoctors[0]);
            }
            if (filteredDoctors.length === 0) {
                setSelectedDoctor(null);
            }
        }
    }, [filteredDoctors, selectedDoctor, viewMode]);


    // Initialize map and load APIs
    useEffect(() => {
        if (viewMode !== 'map' || isMapApiLoaded) return;
    
        Promise.all([loadGoogleMapsApi(), loadMarkerClustererApi()]).then(() => {
             if (!window.google || !window.google.maps || !window.google.maps.marker) {
                setError("Google Maps failed to initialize. This may be due to an invalid API key or network issues.");
                return;
            }
            if (mapContainerRef.current && !mapRef.current) {
                const map = new window.google.maps.Map(mapContainerRef.current, {
                    center: { lat: userLocation?.latitude || 6.5244, lng: userLocation?.longitude || 3.3792 },
                    zoom: 10,
                    disableDefaultUI: true,
                    styles: [{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}],
                    mapId: 'MEDAI_CONNECT_MAP' // Required for Advanced Markers
                });
                mapRef.current = map;
                setIsMapApiLoaded(true);
            }
        }).catch(err => {
            console.error(err);
            setError("Could not load Google Maps. Please check your API key and internet connection.");
        });
    }, [viewMode, isMapApiLoaded, userLocation]);

    // Update markers and clusters
     useEffect(() => {
        if (viewMode !== 'map' || !isMapApiLoaded || !mapRef.current) return;

        const map = mapRef.current;
        
        if (userMarkerRef.current) {
            userMarkerRef.current.map = null;
        }

        if (userLocation) {
             // FIX: Use AdvancedMarkerElement for user location.
            const userMarkerEl = document.createElement('div');
            userMarkerEl.className = "w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md";
            userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                position: { lat: userLocation.latitude, lng: userLocation.longitude },
                map,
                title: "Your Location",
                content: userMarkerEl,
                zIndex: 999
            });
        }
        
        // Clear previous doctor markers before creating new ones
        doctorMarkersRef.current.forEach(marker => marker.map = null);
        doctorMarkersRef.current = [];
        
        doctorMarkersRef.current = filteredDoctors.map(doctor => {
            // FIX: Use AdvancedMarkerElement for doctor locations.
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                position: { lat: doctor.location.latitude, lng: doctor.location.longitude },
                title: doctor.name,
            });
            
            // FIX: Use 'gmp-click' for AdvancedMarkerElement event listeners.
            marker.addListener('gmp-click', () => {
                setSelectedDoctor(doctor);
            });

            return marker;
        });
        
        if (clustererRef.current) {
            clustererRef.current.clearMarkers();
        }
        clustererRef.current = new window.markerClusterer.MarkerClusterer({ markers: doctorMarkersRef.current, map });

    }, [filteredDoctors, isMapApiLoaded, viewMode, userLocation]);


    // Pan map to selected doctor and scroll card into view
    useEffect(() => {
        if (mapRef.current && selectedDoctor) {
            const selectedPos = { lat: selectedDoctor.location.latitude, lng: selectedDoctor.location.longitude };
            mapRef.current.panTo(selectedPos);
            mapRef.current.setZoom(14);
            const cardElement = cardRefs.current[selectedDoctor.id];
            cardElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedDoctor]);


    if (isLoading) {
        return (
            <div className="text-center py-20">
                <MapPinIcon className="w-12 h-12 mx-auto text-gray-400 animate-bounce" />
                <p className="mt-4 text-gray-600">Getting your location and finding nearby specialists...</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Specialist</h1>
                <p className="text-gray-600 mb-6">Search, filter, and connect with available doctors. Switch between list and map views.</p>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 sticky top-20 z-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative lg:col-span-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                        <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                            <option value="">All Specialties</option>
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                         <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                            <option value="">All Locations</option>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <div className="flex items-center justify-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlineOnly}
                                    onChange={e => setShowOnlineOnly(e.target.checked)}
                                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Online Only</span>
                            </label>
                        </div>
                         <div className="flex items-center justify-center bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}><ListIcon className="w-5 h-5"/></button>
                            <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-md ${viewMode === 'map' ? 'bg-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}><MapIcon className="w-5 h-5"/></button>
                         </div>
                     </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center gap-3">
                        <AlertCircleIcon className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Map Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {filteredDoctors.length > 0 ? (
                     <>
                        {viewMode === 'list' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                               {filteredDoctors.map(doctor => (
                                   <DoctorCard 
                                       key={doctor.id} 
                                       doctor={doctor} 
                                       distance={doctor.distance}
                                       isOnline={doctor.isOnline}
                                       onViewProfile={() => handleViewProfile(doctor)}
                                   />
                               ))}
                           </div>
                        )}
                        {viewMode === 'map' && (
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-22rem)]">
                                <div ref={mapContainerRef} className={`lg:col-span-2 h-full rounded-xl shadow-md border ${error ? 'bg-gray-100' : ''}`} />
                                <div className="lg:col-span-1 h-full overflow-y-auto space-y-4 pr-2 -mr-2">
                                    {filteredDoctors.map(doctor => (
                                         <DoctorCard 
                                            key={doctor.id}
                                            ref={(el) => { cardRefs.current[doctor.id] = el; }}
                                            doctor={doctor} 
                                            distance={doctor.distance}
                                            isOnline={doctor.isOnline}
                                            onCardClick={() => setSelectedDoctor(doctor)}
                                            onViewProfile={() => handleViewProfile(doctor)}
                                            isSelected={selectedDoctor?.id === doctor.id}
                                        />
                                    ))}
                                </div>
                             </div>
                        )}
                     </>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
                        <SearchIcon className="w-12 h-12 mx-auto text-gray-400"/>
                        <h2 className="mt-4 text-xl font-medium text-gray-900">No Doctors Found</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}
            </div>
            {isProfileModalOpen && selectedDoctor && (
                <DoctorProfileModal 
                    doctor={selectedDoctor} 
                    isOnline={selectedDoctor.isOnline}
                    onClose={() => setIsProfileModalOpen(false)} 
                />
            )}
        </>
    );
};