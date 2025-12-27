'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/constants/translations';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'kz', label: 'KZ' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
      <Globe className="w-4 h-4 text-slate-500 mr-1" />
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            language === lang.code
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {lang.label}
        </motion.button>
      ))}
    </div>
  );
}

