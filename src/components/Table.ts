import { BaseRippleComponent } from '../types/ripple';
import { Contact, TableColumn } from '../types/app';
import { formatDate } from '../utils/helpers';
import './Table.css';

export interface TableProps {
  contacts: Contact[];
  selectedContacts: Set<string>;
  sortBy: { column: keyof Contact; direction: 'asc' | 'desc' };
  onSelectionChange: (selectedIds: Set<string>) => void;
  onSortChange: (column: keyof Contact) => void;
  onContactAction: (contactId: string, action: string) => void;
}

export class Table extends BaseRippleComponent {
  private columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, width: '20%' },
    { key: 'email', label: 'Email', sortable: true, width: '20%' },
    { key: 'phone', label: 'Phone', sortable: false, width: '15%' },
    { key: 'company', label: 'Company', sortable: true, width: '15%' },
    { key: 'role', label: 'Role', sortable: true, width: '15%' },
    { key: 'lastContact', label: 'Last Contact', sortable: true, width: '10%' }
  ];

  constructor(props: TableProps) {
    super({ className: 'contacts-table-container', props });
  }

  render(): void {
    const { contacts, selectedContacts, sortBy } = this.props;
    const allSelected = contacts.length > 0 && contacts.every((c: Contact) => selectedContacts.has(c.id));
    const someSelected = contacts.some((c: Contact) => selectedContacts.has(c.id));

    this.element.innerHTML = `
      <div class="table-wrapper">
        <table class="contacts-table">
          <thead>
            <tr>
              <th class="select-column">
                <input 
                  type="checkbox" 
                  class="checkbox select-all"
                  ${allSelected ? 'checked' : ''}
                  ${someSelected && !allSelected ? 'data-indeterminate="true"' : ''}
                />
              </th>
              ${this.columns.map(column => `
                <th 
                  class="table-header ${column.sortable ? 'sortable' : ''} ${sortBy.column === column.key ? 'sorted' : ''}"
                  data-column="${column.key}"
                  style="${column.width ? `width: ${column.width}` : ''}"
                >
                  <div class="header-content">
                    <span>${column.label}</span>
                    ${column.sortable ? `
                      <div class="sort-indicator ${sortBy.column === column.key ? sortBy.direction : ''}">
                        ${this.createIcon('chevron-down').outerHTML}
                      </div>
                    ` : ''}
                  </div>
                </th>
              `).join('')}
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${contacts.length === 0 ? `
              <tr>
                <td colspan="${this.columns.length + 2}" class="empty-state">
                  <div class="empty-content">
                    <p>No contacts found</p>
                    <p class="empty-description">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ` : contacts.map((contact: Contact) => `
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
                      ${this.createIcon('more').outerHTML}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
    this.updateIndeterminateState();
  }

  private bindEvents(): void {
    // Select all checkbox
    const selectAllCheckbox = this.element.querySelector('.select-all') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        const newSelection = new Set<string>();
        
        if (checked) {
          this.props.contacts.forEach((contact: Contact) => newSelection.add(contact.id));
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
        const column = (e.currentTarget as HTMLElement).dataset.column as keyof Contact;
        if (column && this.props.onSortChange) {
          this.props.onSortChange(column);
        }
      });
    });

    // More actions buttons
    const moreButtons = this.element.querySelectorAll('.more-actions');
    moreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const contactId = (e.currentTarget as HTMLElement).dataset.contactId;
        if (contactId && this.props.onContactAction) {
          this.props.onContactAction(contactId, 'more');
        }
      });
    });
  }

  private updateIndeterminateState(): void {
    const selectAllCheckbox = this.element.querySelector('.select-all') as HTMLInputElement;
    if (selectAllCheckbox) {
      const { contacts, selectedContacts } = this.props;
      const allSelected = contacts.length > 0 && contacts.every((c: Contact) => selectedContacts.has(c.id));
      const someSelected = contacts.some((c: Contact) => selectedContacts.has(c.id));
      
      selectAllCheckbox.indeterminate = someSelected && !allSelected;
    }
  }

  update(props: Partial<TableProps>): void {
    super.update(props);
    this.updateIndeterminateState();
  }
}