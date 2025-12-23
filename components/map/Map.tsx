'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, X, Leaf, AlertTriangle, ShieldCheck, Home, CheckCircle2, Droplet, Flashlight, FileText, Package, Radio, Mountain, Tent, MessageSquare, Clock, Play, Square } from 'lucide-react';
import { ALMATY_CENTER, DEFAULT_ZOOM } from '@/constants/map';
import { LocationType } from '@/constants/locations';
import { ALMATY_AQI_DATA, getAQIColor, getAQIStatus } from '@/constants/aqi';
import type { Location } from '@/types/location';
import MapFilters from './MapFilters';
import LocationDetailsSidebar from './LocationDetailsSidebar';
import UserMenu from './UserMenu';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons based on location type
const getMarkerIcon = (type: string, safetyRating: string, isDimmed: boolean = false) => {
  const colors: Record<string, string> = {
    HOSPITAL: '#ef4444',
    POLICE_STATION: '#3b82f6',
    FIRE_STATION: '#f59e0b',
    TOURIST_SPOT: '#10b981',
    SAFE_ZONE: '#8b5cf6',
    EVACUATION_POINT: '#10b981', // Green for evacuation points
    RESTAURANT: '#ec4899',
    HOTEL: '#06b6d4',
    MOUNTAIN_AREA: '#64748b',
    CITY_AREA: '#6366f1',
    OTHER: '#6b7280',
  };

  const color = colors[type] || colors.OTHER;
  const opacity = isDimmed ? 0.3 : 1;

  // Special icon for evacuation points
  if (type === 'EVACUATION_POINT') {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          opacity: ${opacity};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  }

  // Special icon for mountain shelters
  if (type === 'MOUNTAIN_SHELTER') {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          opacity: ${opacity};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M3.5 21l8.5-18 8.5 18M11 18h5"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  }

  // Special icon for rescue points
  if (type === 'RESCUE_POINT') {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          opacity: ${opacity};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        opacity: ${opacity};
      ">
        <div style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">${safetyRating === 'VERY_SAFE' ? '✓' : safetyRating === 'SAFE' ? '✓' : '!'}</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

interface MapProps {
  locations?: Location[];
}

function MapContent({ locations = [] }: MapProps) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.latitude, loc.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

// Component to handle map zoom and bounds fitting
function MapZoomHandler({ 
  userPosition, 
  nearestLocation 
}: { 
  userPosition: [number, number] | null;
  nearestLocation: Location | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (userPosition && nearestLocation) {
      const bounds = L.latLngBounds([
        userPosition,
        [nearestLocation.latitude, nearestLocation.longitude],
      ]);
      map.fitBounds(bounds, { padding: [100, 100] });
    }
  }, [userPosition, nearestLocation, map]);

  return null;
}

export default function Map() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<LocationType>>(
    new Set([LocationType.TOURIST_SPOT, LocationType.POLICE_STATION, LocationType.HOSPITAL, LocationType.SAFE_ZONE])
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // Nearest Help Locator state
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [isFindingNearest, setIsFindingNearest] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Air Quality Index Layer state
  const [showAQILayer, setShowAQILayer] = useState(false);

  // Earthquake Safety & Evacuation Points state
  const [panicMode, setPanicMode] = useState(false);
  const [showEarthquakeGuide, setShowEarthquakeGuide] = useState(false);
  const [nearestEvacuationPoint, setNearestEvacuationPoint] = useState<Location | null>(null);
  const [evacuationDistance, setEvacuationDistance] = useState<number | null>(null);
  const [isFindingEvacuation, setIsFindingEvacuation] = useState(false);

  // Mountain Safety & Trip Tracker state
  const [isHikingTripActive, setIsHikingTripActive] = useState(false);
  const [hikingStartTime, setHikingStartTime] = useState<Date | null>(null);
  const [hikingElapsedTime, setHikingElapsedTime] = useState(0);
  const [currentAltitude, setCurrentAltitude] = useState<number | null>(null);
  const [showMountainTracker, setShowMountainTracker] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleToggleFilter = (type: LocationType) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(type)) {
        newFilters.delete(type);
      } else {
        newFilters.add(type);
      }
      return newFilters;
    });
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    // Clear nearest help locator when clicking a marker
    clearNearestHelp();
  };

  const clearNearestHelp = () => {
    setUserPosition(null);
    setNearestLocation(null);
    setDistanceMeters(null);
    setNearestEvacuationPoint(null);
    setEvacuationDistance(null);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const findNearestEvacuationPoint = async () => {
    setIsFindingEvacuation(true);
    clearNearestHelp();

    try {
      if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        setIsFindingEvacuation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserPosition([userLat, userLng]);

          const response = await fetch(
            `/api/locations/nearest?lat=${userLat}&lng=${userLng}&type=EVACUATION_POINT`
          );

          if (!response.ok) {
            const error = await response.json();
            showToast(error.error || 'Failed to find nearest evacuation point');
            setIsFindingEvacuation(false);
            return;
          }

          const data = await response.json();
          setNearestEvacuationPoint(data.location);
          setEvacuationDistance(data.distanceMeters);

          const distanceKm = (data.distanceMeters / 1000).toFixed(1);
          const distanceText = data.distanceMeters < 1000 
            ? `${data.distanceMeters}m` 
            : `${distanceKm}km`;
          
          showToast(`Nearest Evacuation Point is ${distanceText} away`);
          setIsFindingEvacuation(false);
        },
        (error) => {
          showToast('Failed to get your location. Please enable location services.');
          setIsFindingEvacuation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      showToast('An error occurred. Please try again.');
      setIsFindingEvacuation(false);
    }
  };

  const findNearestHelp = async (type: 'POLICE_STATION' | 'HOSPITAL') => {
    setIsFindingNearest(true);
    clearNearestHelp();

    try {
      // Get user's current position
      if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        setIsFindingNearest(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserPosition([userLat, userLng]);

          // Call API to find nearest location
          const response = await fetch(
            `/api/locations/nearest?lat=${userLat}&lng=${userLng}&type=${type}`
          );

          if (!response.ok) {
            const error = await response.json();
            showToast(error.error || 'Failed to find nearest location');
            setIsFindingNearest(false);
            return;
          }

          const data = await response.json();
          setNearestLocation(data.location);
          setDistanceMeters(data.distanceMeters);

          const typeLabel = type === 'POLICE_STATION' ? 'Police' : 'Hospital';
          const distanceKm = (data.distanceMeters / 1000).toFixed(1);
          const distanceText = data.distanceMeters < 1000 
            ? `${data.distanceMeters}m` 
            : `${distanceKm}km`;
          
          showToast(`Nearest ${typeLabel} is ${distanceText} away`);
          setIsFindingNearest(false);
        },
        (error) => {
          showToast('Failed to get your location. Please enable location services.');
          setIsFindingNearest(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      showToast('An error occurred. Please try again.');
      setIsFindingNearest(false);
    }
  };

  const filteredLocations = locations.filter((loc) =>
    activeFilters.has(loc.type as LocationType)
  );

  // Create polyline positions if we have both user and nearest location
  const polylinePositions: [number, number][] | null = 
    userPosition && nearestLocation
      ? [userPosition, [nearestLocation.latitude, nearestLocation.longitude]]
      : null;

  // Create polyline for evacuation point (green line)
  const evacuationPolylinePositions: [number, number][] | null = 
    userPosition && nearestEvacuationPoint
      ? [userPosition, [nearestEvacuationPoint.latitude, nearestEvacuationPoint.longitude]]
      : null;

  // Determine if markers should be dimmed (panic mode active and not evacuation point)
  const shouldDimMarker = (type: string) => {
    return panicMode && type !== 'EVACUATION_POINT';
  };

  // Hiking trails data (coordinates for main trails)
  const hikingTrails = [
    {
      id: 'trail_medeu_furmanov',
      name: 'Medeu to Furmanov Peak',
      difficulty: 'Moderate',
      color: '#f59e0b', // Yellow
      coordinates: [
        [43.15, 76.95], // Medeu
        [43.14, 76.96],
        [43.13, 76.97],
        [43.12, 76.98], // Furmanov Peak area
      ] as [number, number][],
    },
    {
      id: 'trail_shymbulak_easy',
      name: 'Shymbulak Easy Trail',
      difficulty: 'Easy',
      color: '#10b981', // Green
      coordinates: [
        [43.10, 76.97], // Shymbulak
        [43.11, 76.96],
        [43.12, 76.95],
      ] as [number, number][],
    },
    {
      id: 'trail_kok_tobe_difficult',
      name: 'Kok-Tobe Difficult Route',
      difficulty: 'Difficult',
      color: '#ef4444', // Red
      coordinates: [
        [43.25, 76.95], // Kok-Tobe
        [43.24, 76.94],
        [43.23, 76.93],
        [43.22, 76.92],
      ] as [number, number][],
    },
  ];

  // Timer effect for hiking trip
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isHikingTripActive && hikingStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - hikingStartTime.getTime()) / 1000);
        setHikingElapsedTime(elapsed);
      }, 1000);
    } else {
      setHikingElapsedTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHikingTripActive, hikingStartTime]);

  // Mock altitude detection (check if in mountain area)
  useEffect(() => {
    if (userPosition) {
      const [lat, lng] = userPosition;
      // Check if in mountain area (roughly lat < 43.20, lng > 76.90)
      if (lat < 43.20 && lng > 76.90) {
        // Mock altitude calculation (rough estimate based on latitude)
        const baseAltitude = 1500; // Base altitude for Almaty
        const altitudeOffset = (43.20 - lat) * 1000; // Rough calculation
        setCurrentAltitude(Math.round(baseAltitude + altitudeOffset));
      } else {
        setCurrentAltitude(null);
      }
    } else {
      setCurrentAltitude(null);
    }
  }, [userPosition]);

  const startHikingTrip = () => {
    setIsHikingTripActive(true);
    setHikingStartTime(new Date());
    setShowMountainTracker(true);
  };

  const stopHikingTrip = () => {
    setIsHikingTripActive(false);
    setHikingStartTime(null);
    setHikingElapsedTime(0);
  };

  const sendPanicSMS = () => {
    if (userPosition) {
      const [lat, lng] = userPosition;
      const hours = Math.floor(hikingElapsedTime / 3600);
      const minutes = Math.floor((hikingElapsedTime % 3600) / 60);
      const timeString = `${hours}h ${minutes}m`;
      showToast(`Panic SMS sent! Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}. Trip duration: ${timeString}`);
      // In production, this would send actual SMS via API
    } else {
      showToast('Unable to send SMS: Location not available');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center glass-strong rounded-2xl p-8 max-w-md">
          <p className="text-red-400 mb-4">Error loading map</p>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={ALMATY_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapContent locations={filteredLocations} />
        
        <MapZoomHandler 
          userPosition={userPosition} 
          nearestLocation={nearestLocation || nearestEvacuationPoint} 
        />

        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={getMarkerIcon(location.type, location.safetyRating, shouldDimMarker(location.type))}
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
          />
        ))}

        {/* User Position Marker */}
        {userPosition && (
          <Marker
            position={userPosition}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  background-color: #10b981;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          />
        )}

        {/* Dashed Red Polyline connecting user to nearest location */}
        {polylinePositions && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#ef4444',
              weight: 3,
              dashArray: '10, 10',
              opacity: 0.8,
            }}
          />
        )}

        {/* Green Polyline connecting user to nearest evacuation point */}
        {evacuationPolylinePositions && (
          <Polyline
            positions={evacuationPolylinePositions}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              dashArray: '15, 10',
              opacity: 0.9,
            }}
          />
        )}

        {/* Hiking Trails */}
        {hikingTrails.map((trail) => (
          <Polyline
            key={trail.id}
            positions={trail.coordinates}
            pathOptions={{
              color: trail.color,
              weight: 4,
              opacity: 0.7,
            }}
          />
        ))}

        {/* Air Quality Index (AQI) Layer */}
        {showAQILayer && ALMATY_AQI_DATA.map((aqiPoint) => {
          const color = getAQIColor(aqiPoint.aqiValue);
          const status = getAQIStatus(aqiPoint.aqiValue);
          
          return (
            <Circle
              key={aqiPoint.id}
              center={[aqiPoint.latitude, aqiPoint.longitude]}
              radius={1800} // 1.8km radius
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.25,
                color: color,
                weight: 2,
                opacity: 0.6,
              }}
            >
              <Popup className="aqi-popup">
                <div className="p-3">
                  <h3 className="font-bold text-slate-900 mb-2">{aqiPoint.district} District</h3>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-slate-700">Air Quality Index:</span>{' '}
                      <span className="font-bold" style={{ color }}>{aqiPoint.aqiValue}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-slate-700">Status:</span>{' '}
                      <span className="font-medium" style={{ color }}>{status}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{aqiPoint.description}</p>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>

      {/* Filter Bar */}
      <MapFilters activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />

      {/* Location Details Sidebar */}
      <LocationDetailsSidebar
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
        <div className="text-sm text-slate-600 mb-1 font-medium">Locations Found</div>
        <div className="text-2xl font-bold text-slate-900">{filteredLocations.length}</div>
      </div>

      {/* Air Quality Toggle Button */}
      <motion.button
        onClick={() => setShowAQILayer(!showAQILayer)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-4 left-4 mt-20 z-[1000] bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-200 flex items-center space-x-2 transition-all ${
          showAQILayer ? 'ring-2 ring-green-500' : ''
        }`}
      >
        <Leaf className={`w-5 h-5 ${showAQILayer ? 'text-green-600' : 'text-slate-600'}`} />
        <span className="font-semibold text-slate-900">Air Quality</span>
      </motion.button>

      {/* Nearest Help Locator Buttons */}
      <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-3">
        <motion.button
          onClick={() => findNearestHelp('POLICE_STATION')}
          disabled={isFindingNearest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-slate-200 flex items-center space-x-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-slate-900">Find Police</span>
        </motion.button>

        <motion.button
          onClick={() => findNearestHelp('HOSPITAL')}
          disabled={isFindingNearest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-slate-200 flex items-center space-x-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-slate-900">Find Hospital</span>
        </motion.button>

        <motion.button
          onClick={findNearestEvacuationPoint}
          disabled={isFindingEvacuation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-green-200 flex items-center space-x-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-slate-900">Find Safe Zone</span>
        </motion.button>
      </div>

      {/* Panic Mode / Emergency Points Button */}
      <motion.button
        onClick={() => setPanicMode(!panicMode)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={panicMode ? {
          boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.7)',
            '0 0 0 10px rgba(239, 68, 68, 0)',
            '0 0 0 0 rgba(239, 68, 68, 0)',
          ],
        } : {}}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: panicMode ? Infinity : 0,
            ease: 'easeInOut',
          },
        }}
        className={`absolute bottom-24 left-4 z-[1000] bg-white rounded-2xl px-5 py-4 shadow-xl border flex items-center space-x-3 transition-all ${
          panicMode 
            ? 'border-red-500 ring-2 ring-red-500' 
            : 'border-slate-200'
        }`}
      >
        <AlertTriangle className={`w-5 h-5 ${panicMode ? 'text-red-600' : 'text-orange-600'}`} />
        <span className="font-semibold text-slate-900">Emergency Points</span>
      </motion.button>

      {/* Earthquake Survival Guide Button */}
      <motion.button
        onClick={() => setShowEarthquakeGuide(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-40 left-4 z-[1000] bg-white rounded-2xl px-5 py-4 shadow-xl border border-slate-200 flex items-center space-x-3 hover:bg-white transition-all"
      >
        <Home className="w-5 h-5 text-orange-600" />
        <span className="font-semibold text-slate-900">Survival Guide</span>
      </motion.button>

      {/* Mountain Tracker Toggle Button */}
      <motion.button
        onClick={() => setShowMountainTracker(!showMountainTracker)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-56 left-4 z-[1000] bg-white rounded-2xl px-5 py-4 shadow-xl border border-slate-200 flex items-center space-x-3 hover:bg-white transition-all"
      >
        <Mountain className="w-5 h-5 text-slate-700" />
        <span className="font-semibold text-slate-900">Trip Tracker</span>
      </motion.button>

      {/* Mountain Trip Tracker Sidebar */}
      <AnimatePresence>
        {showMountainTracker && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[2000] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Mountain className="w-6 h-6 text-slate-700" />
                  <h3 className="text-xl font-bold text-slate-900">Mountain Trip Tracker</h3>
                </div>
                <button
                  onClick={() => setShowMountainTracker(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Start/Stop Button */}
              {!isHikingTripActive ? (
                <motion.button
                  onClick={startHikingTrip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mb-6"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Hiking Trip</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={stopHikingTrip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mb-6"
                >
                  <Square className="w-5 h-5" />
                  <span>Stop Trip</span>
                </motion.button>
              )}

              {/* Timer Display */}
              {isHikingTripActive && (
                <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-600">Trip Duration</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 font-mono">
                    {formatTime(hikingElapsedTime)}
                  </p>
                </div>
              )}

              {/* Panic SMS Button */}
              {isHikingTripActive && (
                <motion.button
                  onClick={sendPanicSMS}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 mb-6 shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Panic SMS</span>
                </motion.button>
              )}

              {/* Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-slate-700">
                  <strong>Note:</strong> This is a demo feature. In production, the Panic SMS would send your coordinates and trip duration to mountain rescue services.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Altitude Display Widget */}
      {currentAltitude !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute top-4 right-4 z-[1000] bg-white rounded-2xl px-5 py-4 shadow-xl border border-slate-200"
        >
          <div className="flex items-center space-x-2 mb-1">
            <Mountain className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Altitude</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{currentAltitude}m</p>
          <p className="text-xs text-slate-500 mt-1">Above sea level</p>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[10000] bg-white rounded-2xl px-6 py-4 shadow-2xl border border-slate-200 flex items-center space-x-3 max-w-md"
          >
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{toastMessage}</p>
            </div>
            <button
              onClick={() => {
                setToastMessage(null);
                if (toastTimeoutRef.current) {
                  clearTimeout(toastTimeoutRef.current);
                }
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Earthquake Survival Guide Modal */}
      <AnimatePresence>
        {showEarthquakeGuide && (
          <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEarthquakeGuide(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setShowEarthquakeGuide(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className="w-7 h-7 text-orange-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Earthquake Survival Guide</h2>
                </div>
                <p className="text-slate-600 text-sm">Essential steps to stay safe during and after an earthquake</p>
              </div>

              {/* Content Sections */}
              <div className="space-y-5">
                {/* Section 1: DURING (Immediate) */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>DURING (Immediate Actions)</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-bold text-orange-700 mb-1">DROP</p>
                        <p className="text-sm text-slate-700">Get down on your hands and knees immediately</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-bold text-orange-700 mb-1">COVER</p>
                        <p className="text-sm text-slate-700">Cover your head and neck. Get under a sturdy table or desk</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-bold text-orange-700 mb-1">HOLD</p>
                        <p className="text-sm text-slate-700">Hold on to your shelter until shaking stops</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: AFTER (Evacuation) */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>AFTER (Evacuation)</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Use stairs, never elevators</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Stay away from windows and glass</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Check for gas leaks before using matches or lighters</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Move to open areas away from buildings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Follow evacuation routes to designated safe zones</span>
                    </li>
                  </ul>
                </div>

                {/* Section 3: EMERGENCY KIT */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <Package className="w-5 h-5 text-slate-700" />
                    <span>EMERGENCY KIT</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm text-slate-700">
                      <Droplet className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Water (1 gallon per person per day)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-700">
                      <Flashlight className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span>Flashlight with extra batteries</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-700">
                      <FileText className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <span>Important documents (passport, ID, insurance)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-700">
                      <Radio className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Battery-powered radio</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-700">
                      <Package className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>First aid kit and medications</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Understood Button */}
              <button
                onClick={() => setShowEarthquakeGuide(false)}
                className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
