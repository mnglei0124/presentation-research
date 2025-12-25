'use client';

import { motion } from 'framer-motion';
import { TemplateProps, Section } from '@/app/data/templates';
import { MotionWrapper } from '@/app/components/MotionWrapper';

export function Timeline({ presentation }: TemplateProps) {
  return (
    <div className="min-h-screen">
      {presentation.sections.map((section, index) => (
        <TimelineSection 
          key={section.id} 
          section={section} 
          index={index}
          accentColor={presentation.accentColor}
          isLast={index === presentation.sections.length - 1}
        />
      ))}
    </div>
  );
}

interface TimelineSectionProps {
  section: Section;
  index: number;
  accentColor: string;
  isLast: boolean;
}

function TimelineSection({ section, index, accentColor, isLast }: TimelineSectionProps) {
  if (section.type === 'hero') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        <div className={`absolute inset-0 bg-linear-to-br ${accentColor} opacity-5 dark:opacity-10`} />
        
        <MotionWrapper className="relative z-10 text-center max-w-4xl mx-auto">
          {section.subtitle && (
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-lg font-medium text-gray-500 dark:text-gray-400 mb-4"
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

  if (section.type === 'milestone') {
    return (
      <section className="py-16 md:py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-8 md:gap-16">
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
              <MotionWrapper>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-br ${accentColor} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg md:text-xl">
                    {section.year?.slice(-2) || index}
                  </span>
                </div>
              </MotionWrapper>
              {!isLast && (
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="w-0.5 bg-linear-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800 absolute top-20 md:top-24"
                  style={{ minHeight: '150px' }}
                />
              )}
            </div>

            {/* Content */}
            <MotionWrapper className="flex-1 pb-16">
              {section.year && (
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">
                  {section.year}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                  {section.content}
                </p>
              )}
            </MotionWrapper>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'cta') {
    return (
      <section className={`py-24 md:py-32 px-6 bg-linear-to-br ${accentColor}`}>
        <MotionWrapper className="max-w-3xl mx-auto text-center">
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
            </a>
          )}
        </MotionWrapper>
      </section>
    );
  }

  return null;
}
