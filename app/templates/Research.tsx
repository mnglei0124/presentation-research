'use client';

import { motion } from 'framer-motion';
import { TemplateProps, Section } from '@/app/data/templates';
import { MotionWrapper } from '@/app/components/MotionWrapper';
import Image from 'next/image';

export function Research({ presentation }: TemplateProps) {
  // Calculate topic indices separately for sequential numbering
  let topicCounter = 0;
  const topicIndices = presentation.sections.map(section => {
    if (section.type === 'topic') {
      topicCounter++;
      return topicCounter;
    }
    return 0;
  });

  return (
    <div className="min-h-screen">
      {presentation.sections.map((section, index) => (
        <ResearchSection 
          key={section.id} 
          section={section} 
          topicIndex={topicIndices[index]}
          accentColor={presentation.accentColor}
        />
      ))}
    </div>
  );
}

interface ResearchSectionProps {
  section: Section;
  topicIndex: number;
  accentColor: string;
}

function ResearchSection({ section, topicIndex, accentColor }: ResearchSectionProps) {
  switch (section.type) {
    case 'hero':
      return (
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
          <div className={`absolute inset-0 bg-linear-to-br ${accentColor} opacity-5 dark:opacity-10`} />
          
          <MotionWrapper className="relative z-10 text-center max-w-4xl mx-auto">
            {section.subtitle && (
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-linear-to-r ${accentColor} text-white`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {section.subtitle}
              </motion.span>
            )}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
            >
              {section.title}
            </motion.h1>
            {section.content && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              >
                {section.content}
              </motion.p>
            )}
          </MotionWrapper>
        </section>
      );

    case 'topic':
      return (
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${accentColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {String(topicIndex).padStart(2, '0')}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              {section.content && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              )}
            </MotionWrapper>
          </div>
        </section>
      );

    case 'definition':
      return (
        <section className="py-12 px-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper>
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${accentColor} flex items-center justify-center shrink-0`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </section>
      );

    case 'diagram':
      return (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <MotionWrapper>
              {section.title && (
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  {section.title}
                </h3>
              )}
              {section.image && (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <Image
                      src={section.image}
                      alt={section.title || 'Diagram'}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {section.content && (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4 italic">
                      {section.content}
                    </p>
                  )}
                </div>
              )}
            </MotionWrapper>
          </div>
        </section>
      );

    case 'keypoints':
      return (
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.items?.map((item, i) => (
                  <MotionWrapper key={i} delay={i * 0.1}>
                    <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${accentColor} flex items-center justify-center shrink-0`}>
                          <span className="text-white font-bold text-sm">{i + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </MotionWrapper>
          </div>
        </section>
      );

    case 'components':
      return (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <MotionWrapper>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                {section.title}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items?.map((item, i) => (
                  <MotionWrapper key={i} delay={i * 0.1}>
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 h-full">
                      {item.icon && (
                        <span className="text-3xl mb-4 block">{item.icon}</span>
                      )}
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </MotionWrapper>
          </div>
        </section>
      );

    case 'list':
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper>
              {section.title && (
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-3">
                {section.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full bg-linear-to-br ${accentColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>{item.title}</strong>
                      {item.description && <span className="text-gray-500 dark:text-gray-400"> — {item.description}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </MotionWrapper>
          </div>
        </section>
      );

    case 'code':
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper>
              {section.title && (
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  {section.title}
                </h3>
              )}
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {section.content}
                </pre>
              </div>
            </MotionWrapper>
          </div>
        </section>
      );

    case 'references':
      return (
        <section className="py-16 px-6 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {section.title || 'References'}
              </h3>
              <ul className="space-y-3">
                {section.items?.map((item, i) => (
                  <li key={i}>
                    <a 
                      href={item.description || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                    >
                      {item.title || item.description}
                    </a>
                  </li>
                ))}
              </ul>
            </MotionWrapper>
          </div>
        </section>
      );

    default:
      return null;
  }
}
