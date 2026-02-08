export type SectionSlot = 'section' | 'navbar' | 'footer'

export type HomeSectionItem = {
  uid: string
  sectionId: string
  type: SectionSlot
  source: 'sections'
  props?: Record<string, unknown>
}

export type HomeBuilder = {
  version: number
  sections: HomeSectionItem[]
}

export type PageBlock =
  | {
      uid: string
      type: 'text'
      content: string
    }
  | {
      uid: string
      type: SectionSlot
      sectionId: string
      source: 'sections'
      props?: Record<string, unknown>
    }

export type PageBuilder = {
  version: number
  blocks: PageBlock[]
}

export type PageRecord = {
  id: number
  slug: string
  title: string
  status: 'draft' | 'published'
  seo: Record<string, unknown>
  builder: PageBuilder
  createdAt: number
  updatedAt: number
}
