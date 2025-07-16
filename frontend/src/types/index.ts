export interface Project {
  id: string;
  title: string;
  industry: string;
  objective: string;
  last_accessed: string;
}

export interface Source {
    id: string;
    headline: string;
    publisher: string;
    url: string;
    date_published: string;
    summary: string;
    is_trusted?: boolean;
    is_in_project?: boolean;
  }
  
  export interface ResearchSpace {
    id: string;
    project_id: string;
    query: string;
    search_type: string;
    created_at: string;
    space_title?: string; 
    research_question?: string;
    industries?: string[];
    geographies?: string[];
    timeframe?: string;
    insight_style?: string;
    additional_notes?: string;
  }
  

  export interface ResearchSpaceCardProps {
    space: {
      id: string;
      project_id: string;
      query: string;
      search_type: string;
      created_at: string;
      space_title?: string; 
      research_question?: string;
      industries?: string[];
      geographies?: string[];
      timeframe?: string;
      insight_style?: string;
      additional_notes?: string;
    };
    selected: boolean;
    onClick: (id: string) => void;
    onVisit?: (id: string) => void;
    onDelete?: (id: string) => void;
  }

  export interface NewResearchSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectIndustries: string[];
  }

  export interface SourceCardProps {
    source: Source;
    variant?: "added" | "explore";
    onAdd?: () => void;
  }
  
  export interface DeleteResearchSpaceWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    spaceTitle?: string; 
  }

  export interface IndustryPillProps {
    label: string;
  }