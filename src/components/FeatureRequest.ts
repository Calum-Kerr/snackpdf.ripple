import { BaseRippleComponent } from '../types/ripple';
import { FeatureRequest, FeatureRequestFilterOptions } from '../types/app';
import './FeatureRequest.css';

export interface FeatureRequestProps {
  featureRequests: FeatureRequest[];
  onVote: (requestId: string) => void;
  onSubmitRequest: (request: Omit<FeatureRequest, 'id' | 'submittedAt' | 'votes' | 'voters'>) => void;
  onBack?: () => void;
  onCategoryClick?: (category: string) => void;
  currentUser: string;
}

export class FeatureRequestComponent extends BaseRippleComponent {
  private showSubmitForm = false;
  private filters: FeatureRequestFilterOptions = {
    search: '',
    categories: [],
    status: [],
    sortBy: 'votes',
    sortOrder: 'desc'
  };

  constructor(props: FeatureRequestProps) {
    super({ className: 'feature-request-container', props });
  }

  render(): void {
    const filteredRequests = this.getFilteredRequests();

    this.element.innerHTML = `
      <div class="feature-request-header">
        <div class="header-content">
          <button class="btn btn-ghost back-btn">← Back to Tools</button>
          <h2>Feature Requests</h2>
          <p>Suggest new PDF tools and vote on ideas from the community</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary submit-request-btn">
            Submit Request
          </button>
        </div>
      </div>

      ${this.showSubmitForm ? this.renderSubmitForm() : ''}

      <div class="feature-request-filters">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search feature requests..." 
            class="search-input"
            value="${this.filters.search}"
          />
        </div>
        <div class="filter-controls">
          <select class="filter-select sort-select">
            <option value="votes" ${this.filters.sortBy === 'votes' ? 'selected' : ''}>Most Votes</option>
            <option value="date" ${this.filters.sortBy === 'date' ? 'selected' : ''}>Most Recent</option>
            <option value="title" ${this.filters.sortBy === 'title' ? 'selected' : ''}>Alphabetical</option>
          </select>
          <select class="filter-select status-select">
            <option value="">All Status</option>
            <option value="pending" ${this.filters.status.includes('pending') ? 'selected' : ''}>Pending</option>
            <option value="in-progress" ${this.filters.status.includes('in-progress') ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${this.filters.status.includes('completed') ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>

      <div class="feature-request-list">
        ${filteredRequests.length === 0 ? `
          <div class="empty-state">
            <p>No feature requests found</p>
            <p class="empty-description">Try adjusting your search or filters</p>
          </div>
        ` : filteredRequests.map(request => this.renderFeatureRequest(request)).join('')}
      </div>
    `;

    this.bindEvents();
  }

  private renderSubmitForm(): string {
    return `
      <div class="submit-form-overlay">
        <div class="submit-form">
          <div class="form-header">
            <h3>Submit Feature Request</h3>
            <button class="close-form-btn">×</button>
          </div>
          <form class="request-form">
            <div class="form-group">
              <label for="request-title">Title</label>
              <input 
                type="text" 
                id="request-title" 
                class="form-input" 
                placeholder="e.g., Excel to PDF Converter"
                required
              />
            </div>
            <div class="form-group">
              <label for="request-description">Description</label>
              <textarea 
                id="request-description" 
                class="form-textarea" 
                placeholder="Describe the feature you'd like to see..."
                rows="4"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="request-category">Category</label>
              <select id="request-category" class="form-select" required>
                <option value="">Select a category</option>
                <option value="organise">Organise</option>
                <option value="convert-to-pdf">Convert to PDF</option>
                <option value="convert-from-pdf">Convert from PDF</option>
                <option value="sign-and-security">Sign and Security</option>
                <option value="view-and-edit">View and Edit</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label for="request-tags">Tags (optional)</label>
              <input 
                type="text" 
                id="request-tags" 
                class="form-input" 
                placeholder="e.g., excel, spreadsheet, convert (comma-separated)"
              />
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary submit-btn">Submit Request</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  private renderFeatureRequest(request: FeatureRequest): string {
    const hasVoted = request.voters.includes(this.props.currentUser);
    const timeAgo = this.getTimeAgo(request.submittedAt);
    const statusBadge = this.getStatusBadge(request.status);

    return `
      <div class="feature-request-item" data-request-id="${request.id}">
        <div class="request-vote">
          <button 
            class="vote-btn ${hasVoted ? 'voted' : ''}" 
            data-request-id="${request.id}"
            ${hasVoted ? 'disabled' : ''}
          >
            ↑
          </button>
          <span class="vote-count">${request.votes}</span>
        </div>
        <div class="request-content">
          <div class="request-header">
            <h3 class="request-title">${request.title}</h3>
            <div class="request-meta">
              ${statusBadge}
              <button class="request-category-btn" data-category="${request.category}">${request.category.replace('-', ' ')}</button>
            </div>
          </div>
          <p class="request-description">${request.description}</p>
          <div class="request-footer">
            <div class="request-tags">
              ${request.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="request-info">
              <span class="submitted-by">by ${request.submittedBy}</span>
              <span class="submitted-time">${timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getStatusBadge(status: string): string {
    const statusConfig = {
      'pending': { label: 'Pending', class: 'status-pending' },
      'in-progress': { label: 'In Progress', class: 'status-progress' },
      'completed': { label: 'Completed', class: 'status-completed' },
      'rejected': { label: 'Rejected', class: 'status-rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    return `<span class="status-badge ${config.class}">${config.label}</span>`;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  private getFilteredRequests(): FeatureRequest[] {
    let filtered = [...this.props.featureRequests];

    // Search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        request.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (this.filters.status.length > 0) {
      filtered = filtered.filter(request => this.filters.status.includes(request.status));
    }

    // Category filter
    if (this.filters.categories.length > 0) {
      filtered = filtered.filter(request => this.filters.categories.includes(request.category));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.filters.sortBy) {
        case 'votes':
          comparison = b.votes - a.votes;
          break;
        case 'date':
          comparison = b.submittedAt.getTime() - a.submittedAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return this.filters.sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.element.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.props.onBack) {
          this.props.onBack();
        }
      });
    }

    // Submit request button
    const submitBtn = this.element.querySelector('.submit-request-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.showSubmitForm = true;
        this.render();
      });
    }

    // Close form button
    const closeBtn = this.element.querySelector('.close-form-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.showSubmitForm = false;
        this.render();
      });
    }

    // Form submission
    const form = this.element.querySelector('.request-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Cancel button
    const cancelBtn = this.element.querySelector('.cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.showSubmitForm = false;
        this.render();
      });
    }

    // Vote buttons
    const voteButtons = this.element.querySelectorAll('.vote-btn:not([disabled])');
    voteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const requestId = (e.currentTarget as HTMLElement).dataset.requestId;
        if (requestId && this.props.onVote) {
          this.props.onVote(requestId);
        }
      });
    });

    // Search input
    const searchInput = this.element.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      let timeoutId: number;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          this.filters.search = (e.target as HTMLInputElement).value;
          this.render();
        }, 300);
      });
    }

    // Sort select
    const sortSelect = this.element.querySelector('.sort-select') as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filters.sortBy = (e.target as HTMLSelectElement).value as any;
        this.render();
      });
    }

    // Status select
    const statusSelect = this.element.querySelector('.status-select') as HTMLSelectElement;
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        const value = (e.target as HTMLSelectElement).value;
        this.filters.status = value ? [value] : [];
        this.render();
      });
    }

    // Form overlay click to close
    const overlay = this.element.querySelector('.submit-form-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.showSubmitForm = false;
          this.render();
        }
      });
    }

    // Category button clicks
    const categoryBtns = this.element.querySelectorAll('.request-category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = (e.target as HTMLElement).dataset.category;
        if (category && this.props.onCategoryClick) {
          this.props.onCategoryClick(category);
        }
      });
    });
  }

  private handleFormSubmit(): void {
    const form = this.element.querySelector('.request-form') as HTMLFormElement;
    
    const title = (form.querySelector('#request-title') as HTMLInputElement).value;
    const description = (form.querySelector('#request-description') as HTMLTextAreaElement).value;
    const category = (form.querySelector('#request-category') as HTMLSelectElement).value;
    const tagsInput = (form.querySelector('#request-tags') as HTMLInputElement).value;
    
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newRequest = {
      title,
      description,
      category,
      submittedBy: 'You', // In a real app, this would come from authentication
      status: 'pending' as const,
      tags,
      votes: 0,
      voters: []
    };

    if (this.props.onSubmitRequest) {
      this.props.onSubmitRequest(newRequest);
    }

    this.showSubmitForm = false;
    this.render();
  }

  update(props: Partial<FeatureRequestProps>): void {
    super.update(props);
  }
}