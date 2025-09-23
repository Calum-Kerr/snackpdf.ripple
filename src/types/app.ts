// PDF Tool and application types
export interface PDFTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  ghostscriptCompatible: boolean;
  popularity: number;
  tags: string[];
}

export interface ToolFilterOptions {
  search: string;
  categories: string[];
  tags: string[];
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface ToolTableColumn {
  key: keyof PDFTool;
  label: string;
  sortable: boolean;
  width?: string;
}

export interface AppState {
  tools: PDFTool[];
  selectedTools: Set<string>;
  activeTab: string;
  filters: ToolFilterOptions;
  pagination: PaginationState;
  sortBy: {
    column: keyof PDFTool;
    direction: 'asc' | 'desc';
  };
}

// Legacy Contact interface for backward compatibility during transition
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  tags: string[];
  lastContact: Date;
  status: 'active' | 'inactive' | 'pending';
}

export interface FilterOptions {
  search: string;
  tags: string[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface TableColumn {
  key: keyof Contact;
  label: string;
  sortable: boolean;
  width?: string;
}