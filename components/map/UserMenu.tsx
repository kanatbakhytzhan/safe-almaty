'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserCircle2, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  if (!session) {
    return (
      <div className="absolute top-4 right-4 z-[1000]">
        <Link
          href="/login"
          className="glass-strong rounded-lg px-4 py-2 text-white font-medium hover:glass transition-all duration-300"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-strong rounded-lg px-4 py-2 text-white font-medium hover:glass transition-all duration-300 flex items-center space-x-2"
        >
          <span className="text-sm truncate max-w-[150px]">
            {session.user?.email || 'User'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[999]"
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-2xl overflow-hidden z-[1001]"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-300 border-b border-white/10">
                    <p className="font-semibold text-white truncate">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs truncate">{session.user?.email}</p>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:glass rounded-lg transition-all duration-200"
                  >
                    <UserCircle2 className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:glass rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

