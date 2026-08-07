import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface BannerCarouselProps {
  images: string[];
  onSelectAction: (category: 'store' | 'builder' | 'help') => void;
}

const DEFAULT_SLIDES = [
  {
    title: '৪জি সুপারফাস্ট ইন্টারনেট অফার',
    price: '৳২৯৯ থেকে আকর্ষণীয় ক্যাশব্যাক প্যাক',
    description: 'দেশের সবচেয়ে কম পিং ও আনলিমিটেড বাফার-ফ্রি ইন্টারনেট গতি উপভোগ করুন ফাহিম ইন্টারনেটে।',
    ctaText: 'এমবি অফার দেখুন',
    icon: <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />,
    category: 'store' as const,
  },
  {
    title: 'নিজের জন্য সেরা ড্রাইভ প্যাক বানান',
    price: 'পছন্দসই মেয়াদ ও যত খুশি জিবি ও মিনিট',
    description: 'কাস্টম ড্রাইভ বিল্ডার দিয়ে আপনার বাজেট অনুযায়ী কাস্টম এমবি ও মিনিট অফার বানিয়ে নিন মুহূর্তেই।',
    ctaText: 'কাস্টম অফার বানান',
    icon: <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />,
    category: 'builder' as const,
  },
  {
    title: '১ মিনিটে ১০০% ইনস্ট্যান্ট ডেলিভারি',
    price: 'শতভাগ নিরাপদ অটো রিচার্জ গ্যারান্টি',
    description: 'বিকাশ, রকেট ও নগদের মাধ্যমে শতভাগ স্বয়ংক্রিয় ও নিরাপদ পেমেন্ট সম্পন্ন করে দ্রুততম অ্যাক্টিভেশন নিশ্চিত করুন।',
    ctaText: 'সহায়তা ও এফএকিউ',
    icon: <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400" />,
    category: 'help' as const,
  }
];

export default function BannerCarousel({ images, onSelectAction }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images?.length, images?.join(',')]);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // Safe fallback overlay pulling matching index
  const slideData = DEFAULT_SLIDES[currentIndex % DEFAULT_SLIDES.length];

  return (
    <div 
      id="banner-carousel" 
      className="relative w-full overflow-hidden rounded-xl border border-slate-250/60 shadow-md bg-slate-900 aspect-[1.85/1] sm:aspect-[2.1/1] md:aspect-[2.2/1] lg:aspect-[2.4/1] xl:aspect-[2.5/1] group"
    >
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`Banner Offer ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=480';
            }}
          />
          {/* Subtle gradient on the left for text readability only */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Clear Text Layer */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-24 text-left select-none pointer-events-none">
        <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] space-y-3 sm:space-y-5 pointer-events-auto">
          
          {/* Offer Title (Largest & Most Prominent) */}
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {slideData.title}
          </motion.h2>

          {/* Price (Second Largest) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3 text-emerald-400 text-base sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-md"
          >
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
              {slideData.icon}
            </div>
            <span>{slideData.price}</span>
          </motion.div>

          {/* Description (Small and elegant) */}
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-100 text-[11px] sm:text-sm md:text-base leading-relaxed max-w-sm sm:max-w-md md:max-w-lg font-bold drop-shadow-sm line-clamp-2 sm:line-clamp-none opacity-90"
          >
            {slideData.description}
          </motion.p>

          {/* CTA Button (Highly visual with Hover Animation & Smooth Transition) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="pt-1 sm:pt-2"
          >
            <button
              onClick={() => onSelectAction(slideData.category)}
              className={`px-5 sm:px-7 py-2.5 sm:py-3.5 text-white font-black text-[10px] sm:text-xs rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.04] active:scale-[0.97] cursor-pointer group shadow-lg border-none ${
                currentIndex % 3 === 0 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/50' : 
                currentIndex % 3 === 1 ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30 hover:shadow-amber-500/50' : 
                'bg-sky-600 hover:bg-sky-700 shadow-sky-500/30 hover:shadow-sky-500/50'
              }`}
            >
              <span>{slideData.ctaText}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </motion.div>

        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/40 hover:bg-slate-900 border border-white/10 text-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/40 hover:bg-slate-900 border border-white/10 text-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-950/50 px-2.5 py-1.5 rounded-full border border-white/5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === i 
                  ? 'bg-emerald-500 w-4' 
                  : 'bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
