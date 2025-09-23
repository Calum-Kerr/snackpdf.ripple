import { BaseRippleComponent } from '../types/ripple';
import { AppState, PDFTool, ToolFilterOptions, FeatureRequest } from '../types/app';
import { mockPDFTools, mockFeatureRequests } from '../utils/mockData';
import { filterPDFTools, sortPDFTools, paginatePDFTools, debounce } from '../utils/helpers';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { FeatureRequestComponent } from './FeatureRequest';
import { Footer } from './Footer';
import { LegalPages } from './LegalPages';
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
    },
    featureRequests: mockFeatureRequests,
    showFeatureRequests: false,
    currentUser: 'current-user',
    showLegalPage: null
  };

  private sidebar: Sidebar;
  private header: Header;
  private table: Table;
  private pagination: Pagination;
  private featureRequestComponent: FeatureRequestComponent;
  private footer: Footer;
  private legalPages: LegalPages;

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
      onFilterChange: this.handleFilterChange.bind(this),
      onRequestFeature: this.handleRequestFeature.bind(this)
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

    this.featureRequestComponent = new FeatureRequestComponent({
      featureRequests: this.state.featureRequests,
      onVote: this.handleFeatureVote.bind(this),
      onSubmitRequest: this.handleSubmitFeatureRequest.bind(this),
      currentUser: this.state.currentUser
    });

    this.footer = new Footer({
      onPageChange: this.handleLegalPageChange.bind(this)
    });

    this.legalPages = new LegalPages({
      currentPage: this.state.showLegalPage || '',
      onBack: this.handleBackFromLegal.bind(this)
    });
  }

  render(): void {
    // If showing legal page, render only the legal page
    if (this.state.showLegalPage) {
      this.element.innerHTML = `
        <div class="legal-page-container"></div>
      `;
      
      const legalContainer = this.element.querySelector('.legal-page-container');
      if (legalContainer) this.legalPages.mount(legalContainer as HTMLElement);
      return;
    }

    // Normal app layout with footer
    this.element.innerHTML = `
      <div class="app-main">
        <div class="sidebar-container"></div>
        <div class="main-content">
          <div class="header-container"></div>
          <div class="content-area">
            ${this.state.showFeatureRequests ? `
              <div class="feature-request-section">
                <div class="feature-request-container"></div>
              </div>
            ` : `
              <div class="table-section">
                <div class="table-container"></div>
                <div class="pagination-container"></div>
              </div>
            `}
          </div>
        </div>
      </div>
      <div class="footer-container"></div>
    `;

    // Mount child components
    const sidebarContainer = this.element.querySelector('.sidebar-container');
    const headerContainer = this.element.querySelector('.header-container');
    const tableContainer = this.element.querySelector('.table-container');
    const paginationContainer = this.element.querySelector('.pagination-container');
    const featureRequestContainer = this.element.querySelector('.feature-request-container');
    const footerContainer = this.element.querySelector('.footer-container');

    if (sidebarContainer) this.sidebar.mount(sidebarContainer as HTMLElement);
    if (headerContainer) this.header.mount(headerContainer as HTMLElement);
    
    if (this.state.showFeatureRequests) {
      if (featureRequestContainer) this.featureRequestComponent.mount(featureRequestContainer as HTMLElement);
    } else {
      if (tableContainer) this.table.mount(tableContainer as HTMLElement);
      if (paginationContainer) this.pagination.mount(paginationContainer as HTMLElement);
    }

    if (footerContainer) this.footer.mount(footerContainer as HTMLElement);
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

    if (!this.state.showFeatureRequests) {
      this.table.update({
        contacts: this.getFilteredTools(),
        selectedContacts: this.state.selectedTools,
        sortBy: this.state.sortBy
      });

      this.pagination.update({
        pagination: this.state.pagination
      });
    } else {
      this.featureRequestComponent.update({
        featureRequests: this.state.featureRequests
      });
    }
  }

  private handleRequestFeature(): void {
    this.state.showFeatureRequests = !this.state.showFeatureRequests;
    this.render();
  }

  private handleFeatureVote(requestId: string): void {
    const request = this.state.featureRequests.find(r => r.id === requestId);
    if (request && !request.voters.includes(this.state.currentUser)) {
      request.votes += 1;
      request.voters.push(this.state.currentUser);
      this.updateComponents();
    }
  }

  private handleSubmitFeatureRequest(newRequest: Omit<FeatureRequest, 'id' | 'submittedAt' | 'votes' | 'voters'>): void {
    const featureRequest: FeatureRequest = {
      ...newRequest,
      id: `fr-${Date.now()}`,
      submittedAt: new Date(),
      votes: 0,
      voters: []
    };
    
    this.state.featureRequests.unshift(featureRequest); // Add to beginning of array
    this.updateComponents();
  }

  private handleLegalPageChange(page: string): void {
    this.state.showLegalPage = page;
    this.legalPages.update({ currentPage: page });
    this.render();
  }

  private handleBackFromLegal(): void {
    this.state.showLegalPage = null;
    this.render();
  }

  mount(parent: HTMLElement): void {
    super.mount(parent);
  }
}