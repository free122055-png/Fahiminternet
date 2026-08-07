import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealCardProps {
  index: number;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  children: React.ReactNode;
}

export const ScrollRevealCard: React.FC<ScrollRevealCardProps> = ({
  index,
  scrollContainerRef: _scrollContainerRef,
  className = '',
  children
}) => {
  // Clear left / right entrance:
  // Card 0, 2, 4 -> Slides from LEFT (-50px)
  // Card 1, 3, 5 -> Slides from RIGHT (+50px)
  const isLeft = index % 2 === 0;
  const initialX = isLeft ? -50 : 50;

  return (
    <motion.div
      initial={{ x: initialX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: false, amount: 0.05 }}
      transition={{
        duration: 0.22, // Super snappy 220ms duration for instant 60fps animations
        ease: [0.16, 1, 0.3, 1], // Fluid deceleration
        delay: (index % 2) * 0.02 // Very small delay to keep scrolling super fast
      }}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)' // GPU hardware acceleration layer
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealCard;
