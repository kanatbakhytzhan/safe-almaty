'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Home, Map, Shield, MapPin, LogIn, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-bold text-slate-900"
            >
              Safe Almaty
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: '/', label: t.navbar.home, icon: Home },
              { href: '/map', label: t.navbar.map, icon: Map },
              { href: '/safety-tips', label: t.navbar.safetyTips, icon: Shield },
              { href: '/locations', label: t.navbar.locations, icon: MapPin },
            ].map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{t.navbar.profile}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.navbar.logout}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.navbar.login}</span>
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>{t.navbar.getStarted}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-2 border-t border-slate-200"
          >
            <div className="px-4 pb-2">
              <LanguageSwitcher />
            </div>
            {[
              { href: '/', label: t.navbar.home, icon: Home },
              { href: '/map', label: t.navbar.map, icon: Map },
              { href: '/safety-tips', label: t.navbar.safetyTips, icon: Shield },
              { href: '/locations', label: t.navbar.locations, icon: MapPin },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 text-center flex items-center justify-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{t.navbar.profile}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 text-center flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.navbar.logout}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 text-center flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.navbar.login}</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg bg-slate-900 text-white text-center font-semibold hover:bg-slate-800 transition-all duration-200"
                  >
                    {t.navbar.getStarted}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
