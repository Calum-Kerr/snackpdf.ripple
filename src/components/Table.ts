import { BaseRippleComponent } from '../types/ripple';
import { Contact, TableColumn, PDFTool, ToolTableColumn } from '../types/app';
import { formatDate } from '../utils/helpers';
import './Table.css';

// Interface for both Contact and PDFTool compatibility
export interface TableProps {
  contacts: (Contact | PDFTool)[];
  selectedContacts: Set<string>;
  sortBy: { column: string; direction: 'asc' | 'desc' };
  onSelectionChange: (selectedIds: Set<string>) => void;
  onSortChange: (column: string) => void;
  onContactAction: (contactId: string, action: string) => void;
}

export class Table extends BaseRippleComponent {
  private contactColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, width: '20%' },
    { key: 'email', label: 'Email', sortable: true, width: '20%' },
    { key: 'phone', label: 'Phone', sortable: false, width: '15%' },
    { key: 'company', label: 'Company', sortable: true, width: '15%' },
    { key: 'role', label: 'Role', sortable: true, width: '15%' },
    { key: 'lastContact', label: 'Last Contact', sortable: true, width: '10%' }
  ];

  private toolColumns: ToolTableColumn[] = [
    { key: 'name', label: 'Tool Name', sortable: true, width: '30%' },
    { key: 'description', label: 'Description', sortable: false, width: '50%' },
    { key: 'tags', label: 'Tags', sortable: false, width: '20%' }
  ];

  constructor(props: TableProps) {
    super({ className: 'contacts-table-container', props });
  }

  private isPDFTool(item: Contact | PDFTool): item is PDFTool {
    return 'description' in item && 'category' in item && 'tags' in item;
  }

  private isContact(item: Contact | PDFTool): item is Contact {
    return 'email' in item && 'phone' in item && 'company' in item;
  }

  render(): void {
    const { contacts, selectedContacts, sortBy } = this.props;
    
    // Determine if we're showing PDF tools or contacts
    const showingPDFTools = contacts.length > 0 && this.isPDFTool(contacts[0]);
    const columns = showingPDFTools ? this.toolColumns : this.contactColumns;

    this.element.innerHTML = `
      <div class="table-wrapper">
        <table class="contacts-table">
          <thead>
            <tr>
              ${columns.map(column => `
                <th 
                  class="table-header ${column.sortable ? 'sortable' : ''} ${sortBy.column === column.key ? 'sorted' : ''}"
                  data-column="${column.key}"
                  style="${column.width ? `width: ${column.width}` : ''}"
                >
                  <div class="header-content">
                    <span>${column.label}</span>
                    ${column.sortable ? `
                      <div class="sort-indicator ${sortBy.column === column.key ? sortBy.direction : ''}">
                      </div>
                    ` : ''}
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${contacts.length === 0 ? `
              <tr>
                <td colspan="${columns.length}" class="empty-state">
                  <div class="empty-content">
                    <p>No ${showingPDFTools ? 'PDF tools' : 'contacts'} found</p>
                    <p class="empty-description">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ` : contacts.map((item: Contact | PDFTool) => {
              if (showingPDFTools && this.isPDFTool(item)) {
                return this.renderPDFToolRow(item, selectedContacts);
              } else if (!showingPDFTools && this.isContact(item)) {
                return this.renderContactRow(item, selectedContacts);
              }
              return '';
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
    this.updateIndeterminateState();
  }

  private renderPDFToolRow(tool: PDFTool, _selectedContacts: Set<string>): string {
    return `
      <tr class="table-row tool-row" data-tool-id="${tool.id}">
        <td class="name-cell">
          <div class="tool-info">
            <div class="tool-avatar" style="background-image: url('/${tool.icon}');">
            </div>
            <div class="tool-details">
              <div class="tool-name">${tool.name}</div>
              <div class="tool-category">${tool.category.replace('-', ' ')}</div>
            </div>
          </div>
        </td>
        <td class="description-cell">
          <div class="tool-description">${tool.description}</div>
        </td>
        <td class="tags-cell">
          <div class="tool-tags">
            ${tool.tags.slice(0, 3).map((tag: string) => `
              <span class="tag">${tag}</span>
            `).join('')}
            ${tool.tags.length > 3 ? `<span class="tag-more">+${tool.tags.length - 3}</span>` : ''}
          </div>
        </td>
      </tr>
    `;
  }

  private renderContactRow(contact: Contact, selectedContacts: Set<string>): string {
    return `
      <tr class="table-row ${selectedContacts.has(contact.id) ? 'selected' : ''}">
        <td class="select-column">
          <input 
            type="checkbox" 
            class="checkbox row-select"
            data-contact-id="${contact.id}"
            ${selectedContacts.has(contact.id) ? 'checked' : ''}
          />
        </td>
        <td class="name-cell">
          <div class="contact-info">
            <div class="contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
            <div class="contact-details">
              <div class="contact-name">${contact.name}</div>
              <div class="contact-status">
                <span class="status-badge status-${contact.status}">${contact.status}</span>
              </div>
            </div>
          </div>
        </td>
        <td class="email-cell">${contact.email}</td>
        <td class="phone-cell">${contact.phone}</td>
        <td class="company-cell">${contact.company}</td>
        <td class="role-cell">${contact.role}</td>
        <td class="date-cell">${formatDate(contact.lastContact)}</td>
        <td class="actions-cell">
          <div class="table-actions">
            <div class="contact-tags">
              ${contact.tags.slice(0, 2).map((tag: string) => `
                <span class="tag">${tag}</span>
              `).join('')}
              ${contact.tags.length > 2 ? `<span class="tag">+${contact.tags.length - 2}</span>` : ''}
            </div>
            <button class="btn btn-ghost btn-sm more-actions" data-contact-id="${contact.id}">
              ⋯
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  private bindEvents(): void {
    // Select all checkbox
    const selectAllCheckbox = this.element.querySelector('.select-all') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        const newSelection = new Set<string>();
        
        if (checked) {
          this.props.contacts.forEach((item: Contact | PDFTool) => newSelection.add(item.id));
        }
        
        if (this.props.onSelectionChange) {
          this.props.onSelectionChange(newSelection);
        }
      });
    }

    // Individual row checkboxes
    const rowCheckboxes = this.element.querySelectorAll('.row-select');
    rowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const contactId = (e.target as HTMLElement).dataset.contactId;
        const checked = (e.target as HTMLInputElement).checked;
        
        if (contactId) {
          const newSelection = new Set(this.props.selectedContacts);
          if (checked) {
            newSelection.add(contactId);
          } else {
            newSelection.delete(contactId);
          }
          
          if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelection);
          }
        }
      });
    });

    // Sortable column headers
    const sortableHeaders = this.element.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        const column = (e.currentTarget as HTMLElement).dataset.column as keyof (Contact | PDFTool);
        if (column && this.props.onSortChange) {
          this.props.onSortChange(column);
        }
      });
    });

    // Tool row clicks
    const toolRows = this.element.querySelectorAll('.tool-row');
    toolRows.forEach(row => {
      row.addEventListener('click', (e) => {
        const toolId = (e.currentTarget as HTMLElement).dataset.toolId;
        if (toolId && this.props.onContactAction) {
          this.props.onContactAction(toolId, 'open');
        }
      });
    });
  }

  private updateIndeterminateState(): void {
    const selectAllCheckbox = this.element.querySelector('.select-all') as HTMLInputElement;
    if (selectAllCheckbox) {
      const { contacts, selectedContacts } = this.props;
      const allSelected = contacts.length > 0 && contacts.every((c: Contact | PDFTool) => selectedContacts.has(c.id));
      const someSelected = contacts.some((c: Contact | PDFTool) => selectedContacts.has(c.id));
      
      selectAllCheckbox.indeterminate = someSelected && !allSelected;
    }
  }

  update(props: Partial<TableProps>): void {
    super.update(props);
    this.updateIndeterminateState();
  }
}