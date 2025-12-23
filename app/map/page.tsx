'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import Map component with SSR disabled
const MapComponent = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Control Panel - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 z-[1000] flex items-center space-x-2"
      >
        <motion.button
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-full p-3 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          aria-label="Home"
        >
          <Home className="w-5 h-5 text-slate-700" />
        </motion.button>
        
        {session && (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-full p-3 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 text-slate-700" />
          </motion.button>
        )}
      </motion.div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading map...</p>
          </div>
        </div>
      }>
        <MapComponent />
      </Suspense>
    </div>
  );
}
