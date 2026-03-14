export type SectionSlot = "section" | "navbar" | "footer";

export type HomeSectionItem = {
  uid: string;
  sectionId: string;
  type: SectionSlot;
  source: "sections";
  props?: Record<string, unknown>;
};

export type HomeBuilder = {
  version: number;
  sections: HomeSectionItem[];
};

export type PageBlock =
  | {
      uid: string;
      type: "text";
      content: string;
    }
  | {
      uid: string;
      type: SectionSlot;
      sectionId: string;
      source: "sections";
      props?: Record<string, unknown>;
    };

export type PageBuilder = {
  version: number;
  blocks: PageBlock[];
};


export type PageRecord = {
  pages: {
    id: number;
    status: "draft" | "published";
    createdAt: number;
    updatedAt: number;
  };
  pages_locales: {
    id: number;
    pageId: number;
    locale: string;
    slug: string;
    title: string;
    seo: Record<string, unknown>;
    builder: PageBuilder;
  };
};
