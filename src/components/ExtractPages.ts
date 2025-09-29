import { BaseRippleComponent } from '../types/ripple';
import './ExtractPages.css';

export interface ExtractPagesProps {
  onBack: () => void;
}

export class ExtractPages extends BaseRippleComponent {
  private selectedFile: File | null = null;
  private totalPages: number = 0;
  private fromPage: number = 1;
  private toPage: number = 1;
  private isProcessing: boolean = false;

  constructor(props: ExtractPagesProps) {
    super({ className: 'extract-pages-container', props });
  }

  render(): void {
    this.element.innerHTML = `
      <div class="tool-header">
        <button class="btn btn-ghost back-btn">← Back to Tools</button>
        <div class="tool-info">
          <div class="tool-icon" style="background-image: url('/extract.svg');"></div>
          <div class="tool-details">
            <h1>Extract Pages</h1>
            <p>Extract specific pages from a PDF document</p>
            <div class="tool-badges">
              <span class="badge category-badge">Organise</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tool-content">
        ${!this.selectedFile ? `
          <div class="upload-section">
            <div class="upload-area">
              <div class="upload-icon">📁</div>
              <h3>Select PDF File</h3>
              <p>Choose a PDF file to extract pages from</p>
              <button class="btn btn-primary select-file-btn">Select File</button>
              <p class="upload-note">Or drag and drop a PDF file here</p>
            </div>
            <input type="file" class="file-input" accept=".pdf" style="display: none;">
          </div>
        ` : `
          <div class="file-section">
            <div class="file-info">
              <span class="file-icon">📄</span>
              <div class="file-details">
                <div class="file-name">${this.selectedFile.name}</div>
                <div class="file-meta">${this.totalPages} pages • ${this.formatFileSize(this.selectedFile.size)}</div>
              </div>
              <button class="btn btn-ghost remove-file-btn">×</button>
            </div>
          </div>

          <div class="page-selection-section">
            <h3>Select Pages to Extract</h3>
            <div class="simple-inputs">
              <div class="input-group">
                <label>From page:</label>
                <input type="number" class="from-input" min="1" max="${this.totalPages}" value="${this.fromPage}">
              </div>
              <div class="input-group">
                <label>To page:</label>
                <input type="number" class="to-input" min="1" max="${this.totalPages}" value="${this.toPage}">
              </div>
            </div>
            
            <div class="selection-preview">
              <p><strong>Will extract:</strong> ${this.getPageCount()} page(s) (${this.getPageRange()})</p>
            </div>

            <div class="action-section">
              <button class="btn btn-primary extract-btn" ${this.isProcessing ? 'disabled' : ''}>
                ${this.isProcessing ? 'Processing...' : 'Extract Pages'}
              </button>
            </div>
          </div>
        `}

        <div class="info-section">
          <div class="info-card">
            <h3>🔧 Professional PDF Processing</h3>
            <p>This tool uses advanced PDF processing technology, ensuring:</p>
            <ul>
              <li>High-quality page extraction</li>
              <li>Preservation of fonts and formatting</li>
              <li>Support for complex PDF structures</li>
              <li>Reliable processing of large files</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getPageCount(): number {
    if (this.fromPage > this.toPage) return 0;
    return this.toPage - this.fromPage + 1;
  }

  private getPageRange(): string {
    if (this.fromPage === this.toPage) {
      return `page ${this.fromPage}`;
    }
    return `pages ${this.fromPage}-${this.toPage}`;
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.element.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.props.onBack();
      });
    }

    // File selection
    const selectFileBtn = this.element.querySelector('.select-file-btn');
    const fileInput = this.element.querySelector('.file-input') as HTMLInputElement;
    const uploadArea = this.element.querySelector('.upload-area');

    if (selectFileBtn && fileInput) {
      selectFileBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && file.type === 'application/pdf') {
          await this.handleFileSelection(file);
        }
      });
    }

    // Drag and drop
    if (uploadArea) {
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
      });

      uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const dragEvent = e as DragEvent;
        const file = dragEvent.dataTransfer?.files[0];
        if (file && file.type === 'application/pdf') {
          await this.handleFileSelection(file);
        }
      });
    }

    // Remove file
    const removeBtn = this.element.querySelector('.remove-file-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.selectedFile = null;
        this.totalPages = 0;
        this.fromPage = 1;
        this.toPage = 1;
        this.render();
      });
    }

    // Page inputs
    const fromInput = this.element.querySelector('.from-input') as HTMLInputElement;
    const toInput = this.element.querySelector('.to-input') as HTMLInputElement;

    if (fromInput) {
      fromInput.addEventListener('input', () => {
        this.fromPage = Math.max(1, Math.min(parseInt(fromInput.value) || 1, this.totalPages));
        this.updatePageSelection();
      });
    }

    if (toInput) {
      toInput.addEventListener('input', () => {
        this.toPage = Math.max(1, Math.min(parseInt(toInput.value) || 1, this.totalPages));
        this.updatePageSelection();
      });
    }

    // Extract button
    const extractBtn = this.element.querySelector('.extract-btn');
    if (extractBtn) {
      extractBtn.addEventListener('click', () => {
        this.handleExtraction();
      });
    }
  }

  private updatePageSelection(): void {
    const preview = this.element.querySelector('.selection-preview p');
    if (preview) {
      preview.innerHTML = `<strong>Will extract:</strong> ${this.getPageCount()} page(s) (${this.getPageRange()})`;
    }
  }

  private async handleFileSelection(file: File): Promise<void> {
    try {
      this.isProcessing = true;
      this.selectedFile = file;
      this.render();

      console.log('Uploading file:', file.name, 'Size:', file.size);

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/pdf/info', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to analyse PDF');
      }

      const data = await response.json();
      console.log('PDF info received:', data);
      
      this.totalPages = data.pages || 1;
      this.fromPage = 1;
      this.toPage = this.totalPages;
      this.isProcessing = false;
      
      this.render();
      
      console.log('File processed successfully. Pages:', this.totalPages);
    } catch (error) {
      console.error('File selection error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to analyse PDF file: ${errorMessage}\n\nPlease try again with a different PDF file.`);
      
      this.selectedFile = null;
      this.isProcessing = false;
      this.totalPages = 0;
      this.fromPage = 1;
      this.toPage = 1;
      this.render();
    }
  }

  private async handleExtraction(): Promise<void> {
    if (!this.selectedFile || this.getPageCount() === 0) return;
    
    try {
      this.isProcessing = true;
      this.render();

      const pages = [];
      for (let i = this.fromPage; i <= this.toPage; i++) {
        pages.push(i);
      }

      const response = await fetch('/api/pdf/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tempPath: '/tmp/uploads/' + this.selectedFile.name, // Simple approach
          pages: pages,
          filename: this.selectedFile.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to extract pages');
      }

      // Download the extracted PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.selectedFile.name.replace('.pdf', '_extracted.pdf');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      this.isProcessing = false;
      this.render();
      
      alert(`Successfully extracted ${pages.length} pages from ${this.selectedFile.name}`);
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to extract pages. Please try again.');
      this.isProcessing = false;
      this.render();
    }
  }
}
