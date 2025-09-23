import { BaseRippleComponent } from '../types/ripple';
import { FilterOptions } from '../types/app';
import './Header.css';

export interface HeaderProps {
  activeTab: string;
  filters: FilterOptions;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export class Header extends BaseRippleComponent {
  constructor(props: HeaderProps) {
    super({ className: 'header', props });
  }

  render(): void {
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
              placeholder="Search contacts..." 
              class="search-input"
              value="${this.props.filters.search || ''}"
            />
          </div>
          <button class="btn btn-secondary filter-btn">
            ${this.createIcon('filter').outerHTML}
            Filters
          </button>
          <button class="btn btn-primary">
            Add Contact
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private getPageTitle(): string {
    const titles: Record<string, string> = {
      contacts: 'Contacts',
      companies: 'Companies',
      deals: 'Deals',
      tasks: 'Tasks'
    };
    return titles[this.props.activeTab] || 'Contacts';
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
  }

  update(props: Partial<HeaderProps>): void {
    super.update(props);
  }
}