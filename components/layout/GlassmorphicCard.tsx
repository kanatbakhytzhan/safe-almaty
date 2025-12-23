'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
}

export default function GlassmorphicCard({
  children,
  className = '',
  variant = 'default',
  hover = false,
}: GlassmorphicCardProps) {
  const variantClasses = {
    default: 'glass',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
  };

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

