'use client';

import { motion } from 'framer-motion';
import { TemplateProps, Section } from '@/app/data/templates';
import { MotionWrapper } from '@/app/components/MotionWrapper';

export function Split({ presentation }: TemplateProps) {
  return (
    <div className="min-h-screen">
      {presentation.sections.map((section, index) => (
        <SplitSection 
          key={section.id} 
          section={section} 
          index={index}
          accentColor={presentation.accentColor}
        />
      ))}
    </div>
  );
}

interface SplitSectionProps {
  section: Section;
  index: number;
  accentColor: string;
}

function SplitSection({ section, index, accentColor }: SplitSectionProps) {
  if (section.type === 'hero') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        <div className={`absolute inset-0 bg-linear-to-Wbr ${accentColor} opacity-5 dark:opacity-10`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent dark:from-white/5" />
        
        <MotionWrapper className="relative z-10 text-center max-w-4xl mx-auto">
          {section.subtitle && (
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 bg-linear-to-r ${accentColor} text-white`}
            >
              {section.subtitle}
            </motion.span>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
          >
            {section.title}
          </motion.h1>
          {section.content && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              {section.content}
            </motion.p>
          )}
        </MotionWrapper>
      </section>
    );
  }

  if (section.type === 'split') {
    const isImageRight = section.imagePosition === 'right';
    
    return (
      <section className="py-16 md:py-24 lg:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isImageRight ? '' : 'lg:grid-flow-dense'}`}>
            {/* Content */}
            <MotionWrapper className={isImageRight ? '' : 'lg:col-start-2'}>
              <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">
                Feature {String(index).padStart(2, '0')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              )}
            </MotionWrapper>

            {/* Image placeholder */}
            <MotionWrapper 
              delay={0.2}
              className={isImageRight ? '' : 'lg:col-start-1 lg:row-start-1'}
            >
              <div className={`aspect-4/3 rounded-3xl bg-linear-to-br ${accentColor} opacity-20 dark:opacity-30 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'cta') {
    return (
      <section className={`py-24 md:py-32 px-6 bg-linear-to-br ${accentColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <MotionWrapper className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {section.title}
          </h2>
          {section.content && (
            <p className="text-xl text-white/80 mb-10">
              {section.content}
            </p>
          )}
          {section.buttonText && (
            <a 
              href={section.buttonUrl || '#'}
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-gray-900 font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              {section.buttonText}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </MotionWrapper>
      </section>
    );
  }

  return null;
}
