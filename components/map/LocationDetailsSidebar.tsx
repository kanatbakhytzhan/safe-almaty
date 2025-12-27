'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from '@/types/location';
import { SAFETY_RATING_LABELS } from '@/constants/locations';
import { X, Star, MapPin, Phone, Globe, DollarSign, Clock, Navigation } from 'lucide-react';

interface LocationDetailsSidebarProps {
  location: Location | null;
  onClose: () => void;
  userPosition: [number, number] | null;
  onShowRoute: (targetLat: number, targetLng: number) => Promise<void>;
}

const SafetyRatingStars = ({ rating }: { rating: string }) => {
  const ratingMap: Record<string, number> = {
    VERY_SAFE: 5,
    SAFE: 4,
    MODERATE: 3,
    CAUTION: 2,
    UNSAFE: 1,
  };

  const stars = ratingMap[rating] || 0;
  const colorClass =
    rating === 'VERY_SAFE' ? 'text-green-600' :
    rating === 'SAFE' ? 'text-blue-600' :
    rating === 'MODERATE' ? 'text-yellow-600' :
    rating === 'CAUTION' ? 'text-orange-600' :
    'text-red-600';

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < stars ? colorClass + ' fill-current' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className={`ml-2 font-semibold ${colorClass}`}>
        {SAFETY_RATING_LABELS[rating as keyof typeof SAFETY_RATING_LABELS]}
      </span>
    </div>
  );
};

export default function LocationDetailsSidebar({ location, onClose, userPosition, onShowRoute }: LocationDetailsSidebarProps) {
  if (!location) return null;

  const getDirectionsUrl = () => {
    const { latitude, longitude } = location;
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  const handleShowRoute = async () => {
    if (!userPosition) {
      alert('Please enable location services to show route');
      return;
    }
    await onShowRoute(location.latitude, location.longitude);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 bottom-0 w-full md:w-96 z-[2000] overflow-y-auto"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sidebar Content */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative h-full w-full md:w-96 bg-white shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Image */}
          <div className="relative h-64 w-full overflow-hidden bg-slate-200">
            <img
              src={location.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'}
              alt={location.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-3xl font-bold text-white mb-2">{location.name}</h2>
              <p className="text-slate-200 text-sm">{location.type.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Safety Rating */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Safety Rating</h3>
              <SafetyRatingStars rating={location.safetyRating} />
            </div>

            {/* Description */}
            {location.description && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">{location.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="space-y-4">
              {location.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-500 block mb-1">Address</span>
                    <p className="text-slate-900">{location.address}</p>
                  </div>
                </div>
              )}

              {location.phoneNumber && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-500 block mb-1">Phone</span>
                    <a
                      href={`tel:${location.phoneNumber}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {location.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {location.website && (
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-500 block mb-1">Website</span>
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 truncate block"
                    >
                      {location.website}
                    </a>
                  </div>
                </div>
              )}

              {location.entryCost !== null && (
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-500 block mb-1">Entry Cost</span>
                    <p className="text-slate-900">
                      {location.isFree ? 'Free' : `${location.entryCost} KZT`}
                    </p>
                  </div>
                </div>
              )}

              {location.is24Hours && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-500 block mb-1">Hours</span>
                    <p className="text-slate-900">24/7 Open</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Show Route Button */}
              <motion.button
                onClick={handleShowRoute}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Navigation className="w-5 h-5" />
                <span>📍 Show Route</span>
              </motion.button>

              {/* Get Directions Button */}
              <motion.a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Navigation className="w-5 h-5" />
                <span>Get Directions</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
