import { BaseRippleComponent } from '../types/ripple';
import './Sidebar.css';

export interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export class Sidebar extends BaseRippleComponent {
  private navItems = [
    { id: 'organise', label: 'Organise', icon: 'menu' },
    { id: 'convert-to-pdf', label: 'Convert to PDF', icon: 'menu' },
    { id: 'convert-from-pdf', label: 'Convert from PDF', icon: 'menu' },
    { id: 'sign-and-security', label: 'Sign and Security', icon: 'menu' },
    { id: 'view-and-edit', label: 'View and Edit', icon: 'menu' },
    { id: 'advanced', label: 'Advanced', icon: 'menu' }
  ];

  constructor(props: SidebarProps) {
    super({ className: 'sidebar', props });
  }

  render(): void {
    this.element.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <h2>SnackPDF</h2>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${this.navItems.map(item => `
          <button 
            class="nav-item ${item.id === this.props.activeTab ? 'active' : ''}"
            data-tab="${item.id}"
          >
            ${this.createIcon(item.icon).outerHTML}
            <span>${item.label}</span>
          </button>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">U</div>
          <div class="user-info">
            <div class="user-name">User Name</div>
            <div class="user-email">user@example.com</div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const navItems = this.element.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).dataset.tab;
        if (tab && this.props.onTabChange) {
          this.props.onTabChange(tab);
        }
      });
    });
  }

  update(props: Partial<SidebarProps>): void {
    super.update(props);
  }
}