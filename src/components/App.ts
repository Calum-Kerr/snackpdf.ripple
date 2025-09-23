import { BaseRippleComponent } from '../types/ripple';
import { AppState, PDFTool, ToolFilterOptions } from '../types/app';
import { mockPDFTools } from '../utils/mockData';
import { filterPDFTools, sortPDFTools, paginatePDFTools, debounce } from '../utils/helpers';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Table } from './Table';
import { Pagination } from './Pagination';
import './App.css';

export class App extends BaseRippleComponent {
  private state: AppState = {
    tools: mockPDFTools,
    selectedTools: new Set(),
    activeTab: 'organise',
    filters: {
      search: '',
      categories: [],
      tags: []
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 25,
      totalItems: mockPDFTools.length
    },
    sortBy: {
      column: 'name',
      direction: 'asc'
    }
  };

  private sidebar: Sidebar;
  private header: Header;
  private table: Table;
  private pagination: Pagination;

  private debouncedSearch = debounce((search: string) => {
    this.updateFilters({ search });
  }, 300);

  constructor() {
    super({ className: 'app-layout' });
    
    this.sidebar = new Sidebar({
      activeTab: this.state.activeTab,
      onTabChange: this.handleTabChange.bind(this)
    });

    this.header = new Header({
      activeTab: this.state.activeTab,
      filters: this.state.filters,
      onSearchChange: this.debouncedSearch,
      onFilterChange: this.handleFilterChange.bind(this)
    });

    this.table = new Table({
      contacts: this.getFilteredTools(),
      selectedContacts: this.state.selectedTools,
      sortBy: this.state.sortBy,
      onSelectionChange: this.handleSelectionChange.bind(this),
      onSortChange: this.handleSortChange.bind(this),
      onContactAction: this.handleToolAction.bind(this)
    });

    this.pagination = new Pagination({
      pagination: this.state.pagination,
      onPageChange: this.handlePageChange.bind(this),
      onItemsPerPageChange: this.handleItemsPerPageChange.bind(this)
    });
  }

  render(): void {
    this.element.innerHTML = `
      <div class="sidebar-container"></div>
      <div class="main-content">
        <div class="header-container"></div>
        <div class="content-area">
          <div class="table-section">
            <div class="table-container"></div>
            <div class="pagination-container"></div>
          </div>
        </div>
      </div>
    `;

    // Mount child components
    const sidebarContainer = this.element.querySelector('.sidebar-container');
    const headerContainer = this.element.querySelector('.header-container');
    const tableContainer = this.element.querySelector('.table-container');
    const paginationContainer = this.element.querySelector('.pagination-container');

    if (sidebarContainer) this.sidebar.mount(sidebarContainer as HTMLElement);
    if (headerContainer) this.header.mount(headerContainer as HTMLElement);
    if (tableContainer) this.table.mount(tableContainer as HTMLElement);
    if (paginationContainer) this.pagination.mount(paginationContainer as HTMLElement);
  }

  private getFilteredTools(): PDFTool[] {
    // Auto-filter by category based on active tab
    const categoryFilters = this.getCategoryFiltersForActiveTab();
    const mergedFilters = {
      ...this.state.filters,
      categories: categoryFilters.length > 0 ? categoryFilters : this.state.filters.categories
    };
    
    let filtered = filterPDFTools(this.state.tools, mergedFilters);
    filtered = sortPDFTools(filtered, this.state.sortBy);
    
    // Update total items for pagination
    this.state.pagination.totalItems = filtered.length;
    
    return paginatePDFTools(filtered, this.state.pagination.currentPage, this.state.pagination.itemsPerPage);
  }

  private getAllFilteredTools(): PDFTool[] {
    // Auto-filter by category based on active tab
    const categoryFilters = this.getCategoryFiltersForActiveTab();
    const mergedFilters = {
      ...this.state.filters,
      categories: categoryFilters.length > 0 ? categoryFilters : this.state.filters.categories
    };
    
    let filtered = filterPDFTools(this.state.tools, mergedFilters);
    return sortPDFTools(filtered, this.state.sortBy);
  }

  private getCategoryFiltersForActiveTab(): string[] {
    // Map navigation tabs to PDF tool categories
    const tabCategoryMap: Record<string, string[]> = {
      'organise': ['organise'],
      'convert-to-pdf': ['convert-to-pdf'],
      'convert-from-pdf': ['convert-from-pdf'],
      'sign-and-security': ['sign-and-security'],
      'view-and-edit': ['view-and-edit'],
      'advanced': ['advanced']
    };
    
    return tabCategoryMap[this.state.activeTab] || [];
  }

  private handleTabChange(tab: string): void {
    this.state.activeTab = tab;
    this.updateComponents();
  }

  private updateFilters(filters: Partial<ToolFilterOptions>): void {
    this.state.filters = { ...this.state.filters, ...filters };
    this.state.pagination.currentPage = 1; // Reset to first page when filtering
    this.state.selectedTools.clear(); // Clear selection when filtering
    this.updateComponents();
  }

  private handleFilterChange(filters: Partial<ToolFilterOptions>): void {
    this.updateFilters(filters);
  }

  private handleSelectionChange(selectedIds: Set<string>): void {
    this.state.selectedTools = selectedIds;
    this.updateComponents();
  }

  private handleSortChange(column: keyof PDFTool): void {
    if (this.state.sortBy.column === column) {
      // Toggle direction if same column
      this.state.sortBy.direction = this.state.sortBy.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column with default ascending direction
      this.state.sortBy = { column, direction: 'asc' };
    }
    this.updateComponents();
  }

  private handlePageChange(page: number): void {
    this.state.pagination.currentPage = page;
    this.updateComponents();
  }

  private handleItemsPerPageChange(itemsPerPage: number): void {
    this.state.pagination.itemsPerPage = itemsPerPage;
    this.state.pagination.currentPage = 1; // Reset to first page
    this.updateComponents();
  }

  private handleToolAction(toolId: string, action: string): void {
    console.log(`Action ${action} for tool ${toolId}`);
    // TODO: Implement context menu actions for PDF tools
  }

  private updateComponents(): void {
    // Update pagination total items based on filtered results
    const allFilteredTools = this.getAllFilteredTools();
    this.state.pagination.totalItems = allFilteredTools.length;

    // Update each component with new props
    this.sidebar.update({
      activeTab: this.state.activeTab
    });

    this.header.update({
      activeTab: this.state.activeTab,
      filters: this.state.filters
    });

    this.table.update({
      contacts: this.getFilteredTools(),
      selectedContacts: this.state.selectedTools,
      sortBy: this.state.sortBy
    });

    this.pagination.update({
      pagination: this.state.pagination
    });
  }

  mount(parent: HTMLElement): void {
    super.mount(parent);
  }
}