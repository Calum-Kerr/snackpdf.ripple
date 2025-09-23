// Contact and application types
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

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface TableColumn {
  key: keyof Contact;
  label: string;
  sortable: boolean;
  width?: string;
}

export interface AppState {
  contacts: Contact[];
  selectedContacts: Set<string>;
  activeTab: string;
  filters: FilterOptions;
  pagination: PaginationState;
  sortBy: {
    column: keyof Contact;
    direction: 'asc' | 'desc';
  };
}