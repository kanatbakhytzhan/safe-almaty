'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { Mountain, Building2, Bus, AlertTriangle, Handshake, CloudSnow, Lightbulb, Star } from 'lucide-react';

interface SafetyTip {
  id: string;
  title: string;
  titleKz?: string | null;
  titleRu?: string | null;
  content: string;
  contentKz?: string | null;
  contentRu?: string | null;
  category: string;
  priority: number;
  imageUrl?: string | null;
}

const categoryIcons: Record<string, typeof Mountain> = {
  MOUNTAIN_SAFETY: Mountain,
  CITY_SAFETY: Building2,
  TRANSPORT_SAFETY: Bus,
  EMERGENCY_PREPAREDNESS: AlertTriangle,
  CULTURAL_ETIQUETTE: Handshake,
  WEATHER_SAFETY: CloudSnow,
  GENERAL: Lightbulb,
};

const categoryColors: Record<string, string> = {
  MOUNTAIN_SAFETY: 'bg-green-50 border-green-200',
  CITY_SAFETY: 'bg-blue-50 border-blue-200',
  TRANSPORT_SAFETY: 'bg-purple-50 border-purple-200',
  EMERGENCY_PREPAREDNESS: 'bg-red-50 border-red-200',
  CULTURAL_ETIQUETTE: 'bg-yellow-50 border-yellow-200',
  WEATHER_SAFETY: 'bg-slate-50 border-slate-200',
  GENERAL: 'bg-indigo-50 border-indigo-200',
};

export default function SafetyTipsPage() {
  const [tips, setTips] = useState<SafetyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch('/api/safety-tips');
        if (!response.ok) {
          throw new Error('Failed to fetch safety tips');
        }
        const data = await response.json();
        setTips(data);
      } catch (error) {
        console.error('Error fetching safety tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const categories = Array.from(new Set(tips.map((tip) => tip.category)));
  const filteredTips = selectedCategory
    ? tips.filter((tip) => tip.category === selectedCategory)
    : tips;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading safety tips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900">Safety Tips</h1>
            <p className="text-xl text-slate-600">Essential guidance for staying safe in Almaty</p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Tips
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Lightbulb;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.replace('_', ' ')}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredTips.map((tip, index) => {
              const Icon = categoryIcons[tip.category] || Lightbulb;
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="break-inside-avoid mb-6"
                >
                  <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 hover:shadow-md transition-all duration-300 ${categoryColors[tip.category] || categoryColors.GENERAL}`}>
                    {/* Category Badge */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        {tip.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>

                    {/* Content */}
                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-4">
                      {tip.content}
                    </p>

                    {/* Image */}
                    {tip.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-4">
                        <img
                          src={tip.imageUrl}
                          alt={tip.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* Priority Indicator */}
                    {tip.priority >= 8 && (
                      <div className="flex items-center space-x-1 text-amber-600 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">High Priority</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTips.length === 0 && (
            <div className="text-center py-20">
              <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No safety tips found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
