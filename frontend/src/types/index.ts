export interface Project {
  id: string;
  title: string;
  industry: string;
  objective: string;
  last_accessed: string;
  hasBenchmark?: boolean;
}

export interface Source {
    id: string;
    headline: string;
    publisher: string;
    url: string;
    date_published: string;
    summary: string;
    is_trusted?: boolean;
    isInProject?: boolean;
  }
  
  export interface ResearchSpace {
    id: string;
    query: string;
    search_type: string;
  }

  export interface ResearchSpaceCardProps {
    space: {
      id: string;
      query: string;
      search_type: string;
      created_at: string;
    };
    onClick: (id: string) => void;
    onVisit?: (id: string) => void;
  }

  export interface NewResearchSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
  }

  export interface SourceCardProps {
    source: Source;
    variant?: "added" | "explore";
    onAdd?: () => void;
  }
  