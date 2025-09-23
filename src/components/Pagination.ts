import { BaseRippleComponent } from '../types/ripple';
import { PaginationState } from '../types/app';
import './Pagination.css';

export interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export class Pagination extends BaseRippleComponent {
  private itemsPerPageOptions = [10, 25, 50, 100];

  constructor(props: PaginationProps) {
    super({ className: 'pagination-container', props });
  }

  render(): void {
    const { pagination } = this.props;
    const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
    const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems);

    this.element.innerHTML = `
      <div class="pagination-info">
        <span class="items-info">
          ${pagination.totalItems === 0 ? 'No items' : `${startItem}-${endItem} of ${pagination.totalItems} items`}
        </span>
        <div class="items-per-page">
          <label for="items-per-page">Items per page:</label>
          <select id="items-per-page" class="items-per-page-select">
            ${this.itemsPerPageOptions.map(option => `
              <option value="${option}" ${option === pagination.itemsPerPage ? 'selected' : ''}>
                ${option}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="pagination-controls">
        <button 
          class="btn btn-ghost btn-sm pagination-btn"
          data-action="first"
          ${pagination.currentPage === 1 ? 'disabled' : ''}
        >
          First
        </button>
        <button 
          class="btn btn-ghost btn-sm pagination-btn"
          data-action="prev"
          ${pagination.currentPage === 1 ? 'disabled' : ''}
        >
          Previous
        </button>
        
        <div class="page-numbers">
          ${this.renderPageNumbers(pagination.currentPage, totalPages)}
        </div>
        
        <button 
          class="btn btn-ghost btn-sm pagination-btn"
          data-action="next"
          ${pagination.currentPage === totalPages ? 'disabled' : ''}
        >
          Next
        </button>
        <button 
          class="btn btn-ghost btn-sm pagination-btn"
          data-action="last"
          ${pagination.currentPage === totalPages ? 'disabled' : ''}
        >
          Last
        </button>
      </div>
    `;

    this.bindEvents();
  }

  private renderPageNumbers(currentPage: number, totalPages: number): string {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show on each side of current page

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage - delta > 2) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage + delta < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages.map(page => {
      if (page === '...') {
        return '<span class="pagination-ellipsis">...</span>';
      }
      
      const isActive = page === currentPage;
      return `
        <button 
          class="btn btn-ghost btn-sm page-number ${isActive ? 'active' : ''}"
          data-page="${page}"
          ${isActive ? 'disabled' : ''}
        >
          ${page}
        </button>
      `;
    }).join('');
  }

  private bindEvents(): void {
    const { pagination } = this.props;
    const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

    // Items per page selector
    const itemsPerPageSelect = this.element.querySelector('.items-per-page-select') as HTMLSelectElement;
    if (itemsPerPageSelect) {
      itemsPerPageSelect.addEventListener('change', (e) => {
        const value = parseInt((e.target as HTMLSelectElement).value);
        if (this.props.onItemsPerPageChange) {
          this.props.onItemsPerPageChange(value);
        }
      });
    }

    // Pagination buttons
    const paginationBtns = this.element.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = (e.currentTarget as HTMLElement).dataset.action;
        let newPage = pagination.currentPage;

        switch (action) {
          case 'first':
            newPage = 1;
            break;
          case 'prev':
            newPage = Math.max(1, pagination.currentPage - 1);
            break;
          case 'next':
            newPage = Math.min(totalPages, pagination.currentPage + 1);
            break;
          case 'last':
            newPage = totalPages;
            break;
        }

        if (newPage !== pagination.currentPage && this.props.onPageChange) {
          this.props.onPageChange(newPage);
        }
      });
    });

    // Page number buttons
    const pageNumbers = this.element.querySelectorAll('.page-number');
    pageNumbers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt((e.currentTarget as HTMLElement).dataset.page || '1');
        if (page !== pagination.currentPage && this.props.onPageChange) {
          this.props.onPageChange(page);
        }
      });
    });
  }

  update(props: Partial<PaginationProps>): void {
    super.update(props);
  }
}