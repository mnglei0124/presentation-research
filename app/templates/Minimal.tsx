'use client';

import { motion } from 'framer-motion';
import { TemplateProps, Section } from '@/app/data/templates';
import { MotionWrapper } from '@/app/components/MotionWrapper';
import Image from 'next/image';

export function Minimal({ presentation }: TemplateProps) {
  return (
    <div className="min-h-screen">
      {presentation.sections.map((section, index) => (
        <MinimalSection 
          key={section.id} 
          section={section} 
          index={index}
          accentColor={presentation.accentColor}
        />
      ))}
    </div>
  );
}

interface MinimalSectionProps {
  section: Section;
  index: number;
  accentColor: string;
}

function MinimalSection({ section, index, accentColor }: MinimalSectionProps) {
  switch (section.type) {
    case 'hero':
      return (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-linear-to-br ${accentColor} opacity-5 dark:opacity-10`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent dark:from-white/5" />
          
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
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                {section.content}
              </motion.p>
            )}
          </MotionWrapper>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
            </motion.div>
          </motion.div>
        </section>
      );

    case 'content':
      return (
        <section className="py-24 md:py-32 px-6">
          <MotionWrapper className="max-w-3xl mx-auto">
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">
              {String(index).padStart(2, '0')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              {section.title}
            </h2>
            {section.content && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.content}
              </p>
            )}
          </MotionWrapper>
        </section>
      );

    case 'features':
      return (
        <section className="py-24 md:py-32 px-6 bg-gray-50 dark:bg-gray-900/50">
          <MotionWrapper className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 dark:text-white">
              {section.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {section.items?.map((item, i) => (
                <MotionWrapper key={i} delay={i * 0.1}>
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
                    <span className="text-4xl mb-6 block">{item.icon}</span>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </MotionWrapper>
        </section>
      );

    case 'cta':
      return (
        <section className={`py-24 md:py-32 px-6 bg-linear-to-br ${accentColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
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

    case 'split':
      const isImageRight = section.imagePosition === 'right';
      return (
        <section className="py-24 px-6 overflow-hidden">
          <MotionWrapper className="max-w-7xl mx-auto">
            <div className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${!isImageRight ? 'md:grid-flow-dense' : ''}`}>
              <div className={!isImageRight ? 'md:col-start-2' : ''}>
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">
                  {String(index).padStart(2, '0')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                )}
              </div>
              <div className={!isImageRight ? 'md:col-start-1' : ''}>
                {section.image ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
                    <Image 
                      src={section.image} 
                      alt={section.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <div className={`aspect-video rounded-2xl bg-linear-to-br ${accentColor} opacity-10 flex items-center justify-center`}>
                     <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </MotionWrapper>
        </section>
      );

    case 'topic':
    case 'definition':
      return (
        <section className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/30">
          <MotionWrapper className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500 mb-6">
              {section.type === 'topic' ? 'Topic' : 'Definition'}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              {section.title}
            </h2>
            {section.content && (
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.content}
              </p>
            )}
            {section.image && (
               <div className="mt-12 relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl max-w-3xl mx-auto">
                  <Image 
                    src={section.image} 
                    alt={section.title} 
                    fill 
                    className="object-cover" 
                  />
               </div>
            )}
          </MotionWrapper>
        </section>
      );

    case 'keypoints':
    case 'components':
      return (
        <section className="py-24 px-6">
          <MotionWrapper className="max-w-6xl mx-auto">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {section.items?.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className={`text-sm font-mono text-transparent bg-clip-text bg-linear-to-r ${accentColor}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-8 border-l border-gray-100 dark:border-gray-800 group-hover:border-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </section>
      );

    default:
      return null;
  }
}
