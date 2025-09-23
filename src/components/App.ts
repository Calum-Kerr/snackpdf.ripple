import { BaseRippleComponent } from '../types/ripple';
import { AppState, Contact, FilterOptions } from '../types/app';
import { mockContacts } from '../utils/mockData';
import { filterContacts, sortContacts, paginateContacts, debounce } from '../utils/helpers';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Table } from './Table';
import { Pagination } from './Pagination';
import './App.css';

export class App extends BaseRippleComponent {
  private state: AppState = {
    contacts: mockContacts,
    selectedContacts: new Set(),
    activeTab: 'contacts',
    filters: {
      search: '',
      tags: [],
      status: [],
      dateRange: { start: null, end: null }
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 25,
      totalItems: mockContacts.length
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
      contacts: this.getFilteredContacts(),
      selectedContacts: this.state.selectedContacts,
      sortBy: this.state.sortBy,
      onSelectionChange: this.handleSelectionChange.bind(this),
      onSortChange: this.handleSortChange.bind(this),
      onContactAction: this.handleContactAction.bind(this)
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

  private getFilteredContacts(): Contact[] {
    let filtered = filterContacts(this.state.contacts, this.state.filters);
    filtered = sortContacts(filtered, this.state.sortBy);
    
    // Update total items for pagination
    this.state.pagination.totalItems = filtered.length;
    
    return paginateContacts(filtered, this.state.pagination.currentPage, this.state.pagination.itemsPerPage);
  }

  private getAllFilteredContacts(): Contact[] {
    let filtered = filterContacts(this.state.contacts, this.state.filters);
    return sortContacts(filtered, this.state.sortBy);
  }

  private handleTabChange(tab: string): void {
    this.state.activeTab = tab;
    this.updateComponents();
  }

  private updateFilters(filters: Partial<FilterOptions>): void {
    this.state.filters = { ...this.state.filters, ...filters };
    this.state.pagination.currentPage = 1; // Reset to first page when filtering
    this.state.selectedContacts.clear(); // Clear selection when filtering
    this.updateComponents();
  }

  private handleFilterChange(filters: Partial<FilterOptions>): void {
    this.updateFilters(filters);
  }

  private handleSelectionChange(selectedIds: Set<string>): void {
    this.state.selectedContacts = selectedIds;
    this.updateComponents();
  }

  private handleSortChange(column: keyof Contact): void {
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

  private handleContactAction(contactId: string, action: string): void {
    console.log(`Action ${action} for contact ${contactId}`);
    // TODO: Implement context menu actions
  }

  private updateComponents(): void {
    // Update pagination total items based on filtered results
    const allFilteredContacts = this.getAllFilteredContacts();
    this.state.pagination.totalItems = allFilteredContacts.length;

    // Update each component with new props
    this.sidebar.update({
      activeTab: this.state.activeTab
    });

    this.header.update({
      activeTab: this.state.activeTab,
      filters: this.state.filters
    });

    this.table.update({
      contacts: this.getFilteredContacts(),
      selectedContacts: this.state.selectedContacts,
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