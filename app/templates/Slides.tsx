'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateProps, Section } from '@/app/data/templates';
import { MotionWrapper } from '@/app/components/MotionWrapper';
import { ImagePreview } from '@/app/components/ImagePreview';
import Image from 'next/image';

export function Slides({ presentation }: TemplateProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [previewImage, setPreviewImage] = useState<{src: string, alt: string} | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  const totalSlides = presentation.sections.length;

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setShowGrid(false); // Close grid on navigate
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if image preview is open (it handles its own keys)
      if (previewImage) return;

      if (e.key === 'g' || e.key === 'G') {
        setShowGrid(prev => !prev);
        return;
      }

      if (showGrid) {
        if (e.key === 'Escape') setShowGrid(false);
        return; 
      }

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, showGrid, previewImage]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="h-screen w-full bg-white dark:bg-gray-950 overflow-hidden relative font-sans text-gray-900 dark:text-white">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-800 w-full z-20">
        <motion.div 
          className={`h-full bg-linear-to-r ${presentation.accentColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Slide Area */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full h-full absolute top-0 left-0 flex items-center justify-center p-6 md:p-12 lg:p-24"
        >
          <SlideContent 
            section={presentation.sections[currentSlide]} 
            index={currentSlide}
            accentColor={presentation.accentColor}
            onImageClick={(src, alt) => setPreviewImage({ src, alt })}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grid Overlay */}
      <AnimatePresence>
        {showGrid && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl overflow-y-auto p-4 md:p-12"
          >
            <div className="max-w-7xl mx-auto pb-24">
               <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl py-4 z-10 border-b border-gray-100 dark:border-gray-800">
                 <h2 className="text-3xl font-bold">Slide Overview</h2>
                 <button onClick={() => setShowGrid(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               </div>
               
               {(() => {
                 // Grouping Logic
                 const groups: { title: string; slides: { section: Section; index: number }[] }[] = [];
                 let currentGroup = { title: "Introduction", slides: [] as { section: Section; index: number }[] };

                 presentation.sections.forEach((section, idx) => {
                   if (section.type === 'topic' || /^\\d+\\./.test(section.title)) {
                     if (currentGroup.slides.length > 0) {
                       groups.push(currentGroup);
                     }
                     currentGroup = { title: section.title, slides: [] };
                   }
                   currentGroup.slides.push({ section, index: idx });
                 });
                 if (currentGroup.slides.length > 0) {
                   groups.push(currentGroup);
                 }

                 return (
                   <div className="space-y-12">
                     {groups.map((group, gIdx) => (
                       <div key={gIdx}>
                         <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-6 border-l-4 border-blue-500 pl-4">
                           {group.title}
                         </h3>
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {group.slides.map(({ section, index }) => (
                             <button 
                               key={index}
                               onClick={() => goToSlide(index)}
                               className={`text-left p-6 rounded-2xl border transition-all hover:scale-105 active:scale-95 group relative overflow-hidden h-48 flex flex-col
                                 ${currentSlide === index 
                                   ? `border-transparent ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 ring-blue-500 bg-linear-to-br ${presentation.accentColor} text-white` 
                                   : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-blue-500/50 hover:shadow-lg'
                                 }`}
                             >
                               <span className={`text-sm font-mono mb-2 ${currentSlide === index ? 'text-white/80' : 'text-gray-400'}`}>
                                 {String(index + 1).padStart(2, '0')}
                               </span>
                               <h3 className={`font-bold line-clamp-3 text-sm md:text-base ${currentSlide === index ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                 {section.title || (section.type === 'image' ? 'Image' : 'Untitled Slide')}
                               </h3>
                               {section.image && (
                                  <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rotate-12 pointer-events-none">
                                    <Image src={section.image} alt="" fill className="object-cover" />
                                  </div>
                               )}
                             </button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 );
               })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 bg-white/10 dark:bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 dark:border-white/10 shadow-xl transition-transform hover:scale-105">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 transition-colors"
          title="Previous (Left Arrow)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${showGrid ? 'bg-white/20' : ''}`}
          title="Toggle Grid View (G)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        <span className="font-mono text-sm font-medium opacity-80 min-w-[3ch] text-center select-none">
          {currentSlide + 1} / {totalSlides}
        </span>

        <button 
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 transition-colors"
          title="Next (Space / Right Arrow)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image Preview Modal */}
      <ImagePreview 
        isOpen={!!previewImage}
        src={previewImage?.src || null}
        alt={previewImage?.alt || ''}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}

// Reusing layout logic but adapted for full-screen slide
function SlideContent({ section, index, accentColor, onImageClick }: { section: Section, index: number, accentColor: string, onImageClick: (src: string, alt: string) => void }) {
  const commonContent = (
    <>
       {section.title && (
         <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
           {section.title}
         </h1>
       )}
       {section.content && (
         <div className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl whitespace-pre-wrap">
           {section.content}
         </div>
       )}
    </>
  );

  if (section.type === 'hero') {
    return (
      <div className="text-center max-w-5xl mx-auto">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 bg-linear-to-r ${accentColor} text-white`}>
          {section.subtitle || "Presentation"}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          {section.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          {section.content}
        </p>
      </div>
    );
  }

  if (section.type === 'split') {
    const isImageRight = section.imagePosition === 'right';
    return (
      <div className={`grid md:grid-cols-[40%_60%] gap-8 lg:gap-12 w-full h-full items-center ${!isImageRight ? 'md:grid-flow-dense' : ''}`}>
        <div className={`flex flex-col justify-center ${!isImageRight ? 'md:col-start-2' : ''}`}>
           {commonContent}
        </div>
        <div className={`relative h-full max-h-[85vh] w-full ${!isImageRight ? 'md:col-start-1' : ''}`}>
          {section.image ? (
            <div 
              className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
              onClick={() => onImageClick(section.image!, section.title)}
            >
              <Image 
                src={section.image} 
                alt={section.title} 
                fill 
                className="object-contain bg-gray-50 dark:bg-gray-900/50" 
              />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full p-2 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
            </div>
          ) : (
            <div className={`w-full h-full rounded-3xl bg-linear-to-br ${accentColor} opacity-10 flex items-center justify-center`}>
              <span className="text-3xl text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (['topic', 'definition'].includes(section.type)) {
     return (
       <div className="text-center max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
         <div className="mb-6 shrink-0">
            <span className="text-gray-400 uppercase tracking-widest font-semibold mb-2 text-sm block">{section.type}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{section.title}</h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-4xl mx-auto">{section.content}</p>
         </div>
         {section.image && (
            <div 
              className="relative w-full h-full min-h-0 flex-1 rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in hover:scale-[1.01] transition-transform"
              onClick={() => onImageClick(section.image!, section.title)}
            >
               <Image src={section.image} alt={section.title} fill className="object-contain" />
            </div>
         )}
       </div>
     );
  }

  if (['keypoints', 'components'].includes(section.type)) {
    return (
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center">{section.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[75vh] p-4">
          {section.items?.map((item, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
               <div className={`text-lg font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r ${accentColor}`}>
                 {String(i + 1).padStart(2, '0')}
               </div>
               <h3 className="text-base font-bold mb-2">{item.title}</h3>
               <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for other types
  return (
    <div className="text-center max-w-4xl mx-auto">
       {commonContent}
    </div>
  );
}
