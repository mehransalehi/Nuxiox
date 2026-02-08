import type { HomeBuilder, PageBuilder } from '~~/layers/base/types/page-builder'

export const defaultHomeBuilder: HomeBuilder = {
  version: 1,
  sections: [
    { uid: 'hero', sectionId: 'Hero', type: 'section', source: 'sections' },
    { uid: 'about', sectionId: 'About', type: 'section', source: 'sections' },
    { uid: 'service', sectionId: 'Service', type: 'section', source: 'sections' },
    { uid: 'testimonial', sectionId: 'Testimonial', type: 'section', source: 'sections' },
    { uid: 'contact', sectionId: 'Contact', type: 'section', source: 'sections' },
  ],
}

export const defaultPageBuilder: PageBuilder = {
  version: 1,
  blocks: [],
}
