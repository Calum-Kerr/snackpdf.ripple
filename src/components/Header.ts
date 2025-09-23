import { BaseRippleComponent } from '../types/ripple';
import { FilterOptions, ToolFilterOptions } from '../types/app';
import './Header.css';

export interface HeaderProps {
  activeTab: string;
  filters: FilterOptions | ToolFilterOptions;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Partial<FilterOptions | ToolFilterOptions>) => void;
  onRequestFeature?: () => void;
}

export class Header extends BaseRippleComponent {
  constructor(props: HeaderProps) {
    super({ className: 'header', props });
  }

  render(): void {
    const isPDFToolsContext = this.isPDFToolsTab(this.props.activeTab);
    const searchPlaceholder = isPDFToolsContext ? 'Search PDF tools...' : 'Search contacts...';
    const addButtonText = isPDFToolsContext ? 'Request Feature' : 'Add Contact';

    this.element.innerHTML = `
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">${this.getPageTitle()}</h1>
          <div class="breadcrumb">
            <span>Dashboard</span>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-current">${this.getPageTitle()}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="search-box">
            ${this.createIcon('search').outerHTML}
            <input 
              type="text" 
              placeholder="${searchPlaceholder}" 
              class="search-input"
              value="${this.props.filters.search || ''}"
            />
          </div>
          <button class="btn btn-secondary filter-btn">
            ${this.createIcon('filter').outerHTML}
            Filters
          </button>
          <button class="btn btn-primary request-feature-btn">
            ${this.createIcon('lightbulb').outerHTML}
            ${addButtonText}
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private getPageTitle(): string {
    // PDF Tools tabs
    const pdfToolTitles: Record<string, string> = {
      'organise': 'Organise',
      'convert-to-pdf': 'Convert to PDF',
      'convert-from-pdf': 'Convert from PDF', 
      'sign-and-security': 'Sign and Security',
      'view-and-edit': 'View and Edit',
      'advanced': 'Advanced'
    };

    // Legacy contact tabs
    const contactTitles: Record<string, string> = {
      contacts: 'Contacts',
      companies: 'Companies',
      deals: 'Deals',
      tasks: 'Tasks'
    };

    return pdfToolTitles[this.props.activeTab] || contactTitles[this.props.activeTab] || 'PDF Tools';
  }

  private isPDFToolsTab(tab: string): boolean {
    const pdfToolTabs = ['organise', 'convert-to-pdf', 'convert-from-pdf', 'sign-and-security', 'view-and-edit', 'advanced'];
    return pdfToolTabs.includes(tab);
  }

  private bindEvents(): void {
    const searchInput = this.element.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      let timeoutId: number;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          const value = (e.target as HTMLInputElement).value;
          if (this.props.onSearchChange) {
            this.props.onSearchChange(value);
          }
        }, 300);
      });
    }

    const filterBtn = this.element.querySelector('.filter-btn');
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        // TODO: Implement filter popover
        console.log('Open filter popover');
      });
    }

    const requestFeatureBtn = this.element.querySelector('.request-feature-btn');
    if (requestFeatureBtn) {
      requestFeatureBtn.addEventListener('click', () => {
        if (this.props.onRequestFeature) {
          this.props.onRequestFeature();
        }
      });
    }
  }

  update(props: Partial<HeaderProps>): void {
    super.update(props);
  }
}