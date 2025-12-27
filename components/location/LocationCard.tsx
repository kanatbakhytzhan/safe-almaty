'use client';

import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import type { Location } from '@/types/location';
import { LOCATION_TYPE_LABELS } from '@/constants/locations';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface LocationCardProps {
  location: Location;
  index?: number;
}

const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    TOURIST_SPOT: 'bg-green-100 text-green-800',
    POLICE_STATION: 'bg-blue-100 text-blue-800',
    HOSPITAL: 'bg-red-100 text-red-800',
    FIRE_STATION: 'bg-orange-100 text-orange-800',
    SAFE_ZONE: 'bg-purple-100 text-purple-800',
    RESTAURANT: 'bg-pink-100 text-pink-800',
    HOTEL: 'bg-cyan-100 text-cyan-800',
    MOUNTAIN_AREA: 'bg-slate-100 text-slate-800',
    CITY_AREA: 'bg-indigo-100 text-indigo-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };
  return colors[type] || colors.OTHER;
};

const getSafetyRatingNumber = (rating: string): number => {
  const ratingMap: Record<string, number> = {
    VERY_SAFE: 5.0,
    SAFE: 4.0,
    MODERATE: 3.0,
    CAUTION: 2.0,
    UNSAFE: 1.0,
  };
  return ratingMap[rating] || 3.0;
};

export default function LocationCard({ location, index = 0 }: LocationCardProps) {
  const { language } = useLanguage();
  const safetyRating = getSafetyRatingNumber(location.safetyRating);
  
  // Get language-specific title and description
  const title = language === 'ru' ? (location.nameRu || location.name) 
    : language === 'kz' ? (location.nameKz || location.name) 
    : location.name;
  
  const description = language === 'ru' ? (location.descriptionRu || location.description || '') 
    : language === 'kz' ? (location.descriptionKz || location.description || '') 
    : (location.description || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/map?location=${location.id}`}>
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
          {/* Image Area - Top 60% */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
            <img
              src={location.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Type Badge Overlay */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeBadgeColor(location.type)}`}>
                {LOCATION_TYPE_LABELS[location.type as keyof typeof LOCATION_TYPE_LABELS] || location.type.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Content Area - Bottom 40% */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h3>

            {/* Meta Row */}
            <div className="flex items-center justify-between mb-4">
              {/* Type Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(location.type)}`}>
                {LOCATION_TYPE_LABELS[location.type as keyof typeof LOCATION_TYPE_LABELS] || location.type.replace('_', ' ')}
              </span>

              {/* Safety Rating */}
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-700">
                  {safetyRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Description Preview */}
            {description && (
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">
                {description}
              </p>
            )}

            {/* Address */}
            {location.address && (
              <div className="flex items-start space-x-2 text-gray-500 text-sm pt-4 border-t border-gray-100">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1 font-medium">{location.address}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
