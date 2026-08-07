import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealSectionProps {
  id: string;
  className?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  isHero?: boolean;
  children: React.ReactNode;
}

export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  id,
  className = '',
  scrollContainerRef: _scrollContainerRef,
  isHero = false,
  children
}) => {
  return (
    <motion.section
      id={id}
      initial={isHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={isHero ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.05 }}
      transition={{
        duration: 0.22, // Ultra-fast 220ms reveal
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)' // Hardware acceleration
      }}
      className={`w-full py-8 md:py-12 relative overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default ScrollRevealSection;
