'use client';

import { motion } from 'framer-motion';
import { LocationType } from '@/constants/locations';
import { MapPin, Shield, Building2, Heart, Home, Mountain, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MapFiltersProps {
  activeFilters: Set<LocationType>;
  onToggleFilter: (type: LocationType) => void;
}

export default function MapFilters({ activeFilters, onToggleFilter }: MapFiltersProps) {
  const { t } = useLanguage();
  
  const filterCategories = [
    { type: LocationType.TOURIST_SPOT, label: t.map.touristSpots, icon: MapPin },
    { type: LocationType.POLICE_STATION, label: t.map.police, icon: Shield },
    { type: LocationType.HOSPITAL, label: t.map.hospitals, icon: Heart },
    { type: LocationType.SAFE_ZONE, label: t.map.safeZones, icon: Building2 },
    { type: LocationType.EVACUATION_POINT, label: 'Evacuation Points', icon: Home },
    { type: LocationType.RESCUE_POINT, label: 'Rescue Points', icon: AlertCircle },
    { type: LocationType.MOUNTAIN_SHELTER, label: 'Mountain Shelters', icon: Mountain },
  ] as const;
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute top-20 left-4 right-4 md:left-auto md:right-4 md:w-auto z-[1000] bg-white rounded-3xl p-4 shadow-xl border border-slate-200"
    >
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        {filterCategories.map((category) => {
          const isActive = activeFilters.has(category.type);
          const Icon = category.icon;
          return (
            <motion.button
              key={category.type}
              onClick={() => onToggleFilter(category.type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
