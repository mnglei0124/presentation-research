import { notFound } from 'next/navigation';
import { getTemplate, Presentation } from '@/app/data/templates';
import presentationsData from '@/app/data/presentations.json';
import Link from 'next/link';
import { PrintButton } from '@/app/components/PrintButton';

// Generate static paths for all presentations
export async function generateStaticParams() {
  const presentations = presentationsData.presentations as Presentation[];
  return presentations.map((p) => ({
    slug: p.slug,
  }));
}

// Generate metadata for each presentation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const presentations = presentationsData.presentations as Presentation[];
  const presentation = presentations.find((p) => p.slug === slug);

  if (!presentation) {
    return {
      title: 'Presentation Not Found',
    };
  }

  return {
    title: `${presentation.title} | Presentation Hub`,
    description: presentation.description,
    openGraph: {
      title: presentation.title,
      description: presentation.description,
      type: 'article',
    },
  };
}

export default async function PresentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const presentations = presentationsData.presentations as Presentation[];
  const presentation = presentations.find((p) => p.slug === slug);

  if (!presentation) {
    notFound();
  }

  const Template = getTemplate(presentation.template);

  if (!Template) {
    notFound();
  }

  return (
    <div className="relative">
      {/* Back button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium hover:scale-105 transition-transform duration-200 no-print"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Print button */}
      <PrintButton />

      {/* Render the presentation using the selected template */}
      <Template presentation={presentation} />

      {/* Navigation footer */}
      <nav className="border-t border-gray-100 dark:border-gray-800 no-print">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <Link 
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Presentations
          </Link>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            {presentation.template} Template
          </div>
        </div>
      </nav>
    </div>
  );
}
