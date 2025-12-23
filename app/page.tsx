'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { MapPin, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=10')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-slate-900 tracking-tight"
            >
              Safe Almaty
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-xl sm:text-2xl text-slate-600 mb-4 font-light leading-relaxed max-w-2xl mx-auto"
            >
              Your trusted safety guide and emergency response system for Almaty, Kazakhstan
            </motion.p>

            {/* Kazakh Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base sm:text-lg text-slate-500 mb-12 leading-relaxed"
            >
              Алматы қауіпсіздік нұсқаулығы
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/map">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-slate-900 rounded-xl font-medium text-lg border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Explore Map</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {[
                { icon: MapPin, title: 'Interactive Map', desc: 'Explore safe zones & locations' },
                { icon: AlertCircle, title: 'SOS System', desc: 'Emergency response at your fingertips' },
                { icon: Shield, title: 'Safety Tips', desc: 'Expert guidance for Almaty' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="relative py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-6 h-6 text-slate-700" />
                <h3 className="text-2xl font-semibold text-slate-900">For Tourists</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Discover safe locations, get cultural tips, and navigate Almaty with confidence. 
                Find the best tourist spots, restaurants, and hotels with safety ratings.
              </p>
              <Link href="/locations" className="text-slate-900 hover:text-slate-700 font-medium inline-flex items-center space-x-1">
                <span>Explore Locations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-slate-700" />
                <h3 className="text-2xl font-semibold text-slate-900">For Residents</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Access emergency contacts, report issues, and stay informed about your neighborhood. 
                Get real-time safety updates and connect with local services.
              </p>
              <Link href="/safety-tips" className="text-slate-900 hover:text-slate-700 font-medium inline-flex items-center space-x-1">
                <span>View Safety Tips</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-white text-center py-12 text-slate-500 text-sm border-t border-slate-100">
        <p>© 2024 Safe Almaty. Built with Next.js, PostGIS & React-Leaflet.</p>
      </footer>
    </div>
  );
}
