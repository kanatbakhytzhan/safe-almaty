'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Phone, X, Copy, RefreshCw } from 'lucide-react';

interface Location {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocation({ latitude: null, longitude: null, error: null });

    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          error: error.message || 'Failed to get location',
        });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const copyCoordinates = () => {
    if (location.latitude && location.longitude) {
      const coords = `${location.latitude}, ${location.longitude}`;
      navigator.clipboard.writeText(coords);
      alert('Coordinates copied to clipboard!');
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(220, 38, 38, 0.7)',
            '0 0 0 10px rgba(220, 38, 38, 0)',
            '0 0 0 0 rgba(220, 38, 38, 0)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        aria-label="Emergency SOS"
      >
        <AlertCircle className="w-7 h-7" />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container - Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white hover:bg-slate-100 shadow-lg flex items-center justify-center text-slate-700 transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Emergency Header */}
              <div className="bg-red-600 px-8 py-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">EMERGENCY SOS</h2>
                <p className="text-red-100 text-sm">Your location is being tracked</p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Location Display */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Your Current Location
                  </h3>
                  {isLoadingLocation ? (
                    <div className="flex items-center justify-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                      <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mr-3" />
                      <span className="text-slate-600 font-medium">Getting your location...</span>
                    </div>
                  ) : location.error ? (
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <div className="flex items-start space-x-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-red-800 font-medium mb-3">{location.error}</p>
                          <button
                            onClick={getCurrentLocation}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-all flex items-center space-x-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Try Again</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : location.latitude && location.longitude ? (
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <p className="text-3xl font-mono text-slate-900 font-bold mb-3 text-center break-all">
                        {location.latitude.toFixed(6)}
                        <br />
                        {location.longitude.toFixed(6)}
                      </p>
                      <button
                        onClick={copyCoordinates}
                        className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-2 mx-auto"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy coordinates</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
                      <p className="text-slate-500 font-medium">Location not available</p>
                    </div>
                  )}
                </div>

                {/* Emergency Action Buttons - Side by Side */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    onClick={() => handleCall('102')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold text-lg shadow-lg flex flex-col items-center justify-center space-y-2 transition-all"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-base">Police</span>
                    <span className="text-sm opacity-90">(102)</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleCall('103')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold text-lg shadow-lg flex flex-col items-center justify-center space-y-2 transition-all"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-base">Ambulance</span>
                    <span className="text-sm opacity-90">(103)</span>
                  </motion.button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
