import { Contact, FilterOptions, PDFTool, ToolFilterOptions } from '../types/app';

// PDF Tool utility functions
export function filterPDFTools(tools: PDFTool[], filters: ToolFilterOptions): PDFTool[] {
  return tools.filter(tool => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [tool.name, tool.description, tool.category];
      if (!searchableFields.some(field => field.toLowerCase().includes(searchTerm))) {
        return false;
      }
    }

    // Categories filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(tool.category)) {
        return false;
      }
    }

    // Ghostscript compatibility filter
    if (filters.ghostscriptOnly && !tool.ghostscriptCompatible) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      if (!filters.tags.some(tag => tool.tags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}

export function sortPDFTools(tools: PDFTool[], sortBy: { column: keyof PDFTool; direction: 'asc' | 'desc' }): PDFTool[] {
  return [...tools].sort((a, b) => {
    const aValue = a[sortBy.column];
    const bValue = b[sortBy.column];
    
    let comparison = 0;
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return sortBy.direction === 'asc' ? comparison : -comparison;
  });
}

export function paginatePDFTools(tools: PDFTool[], page: number, itemsPerPage: number): PDFTool[] {
  const startIndex = (page - 1) * itemsPerPage;
  return tools.slice(startIndex, startIndex + itemsPerPage);
}

// Legacy contact utility functions (keeping for backward compatibility)
export function filterContacts(contacts: Contact[], filters: FilterOptions): Contact[] {
  return contacts.filter(contact => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [contact.name, contact.email, contact.company, contact.role];
      if (!searchableFields.some(field => field.toLowerCase().includes(searchTerm))) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      if (!filters.tags.some(tag => contact.tags.includes(tag))) {
        return false;
      }
    }

    // Status filter
    if (filters.status.length > 0) {
      if (!filters.status.includes(contact.status)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const contactDate = contact.lastContact;
      if (filters.dateRange.start && contactDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && contactDate > filters.dateRange.end) {
        return false;
      }
    }

    return true;
  });
}

export function sortContacts(contacts: Contact[], sortBy: { column: keyof Contact; direction: 'asc' | 'desc' }): Contact[] {
  return [...contacts].sort((a, b) => {
    const aValue = a[sortBy.column];
    const bValue = b[sortBy.column];
    
    let comparison = 0;
    
    if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return sortBy.direction === 'asc' ? comparison : -comparison;
  });
}

export function paginateContacts(contacts: Contact[], page: number, itemsPerPage: number): Contact[] {
  const startIndex = (page - 1) * itemsPerPage;
  return contacts.slice(startIndex, startIndex + itemsPerPage);
}

// Common utility functions
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}