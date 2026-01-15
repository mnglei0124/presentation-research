import { ComponentType } from 'react';
import { Minimal } from '@/app/templates/Minimal';
import { Timeline } from '@/app/templates/Timeline';
import { Split } from '@/app/templates/Split';
import { Research } from '@/app/templates/Research';
import { Slides } from '@/app/templates/Slides';

// Types for presentation data
export interface SectionItem {
  title: string;
  description: string;
  icon?: string;
}

export interface Section {
  id: string;
  type: 'hero' | 'content' | 'features' | 'cta' | 'milestone' | 'split' | 'topic' | 'definition' | 'diagram' | 'keypoints' | 'components' | 'list' | 'code' | 'references' | 'image';
  title: string;
  subtitle?: string;
  content?: string;
  items?: SectionItem[];
  buttonText?: string;
  buttonUrl?: string;
  year?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
}

export interface Presentation {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  template: string;
  createdAt: string;
  accentColor: string;
  sections: Section[];
  customUrl?: string; // For standalone pages that don't use the dynamic route
}

export interface PresentationsData {
  presentations: Presentation[];
}

// Template component props
export interface TemplateProps {
  presentation: Presentation;
}

// Template registry - maps template names to components
export const templateRegistry: Record<string, ComponentType<TemplateProps>> = {
  Minimal,
  Timeline,
  Split,
  Research,
  Slides,
};

// Get template component by name
export function getTemplate(templateName: string): ComponentType<TemplateProps> | null {
  return templateRegistry[templateName] || null;
}

// Get all available template names
export function getTemplateNames(): string[] {
  return Object.keys(templateRegistry);
}
