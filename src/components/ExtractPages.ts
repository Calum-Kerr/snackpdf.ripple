import { BaseRippleComponent } from '../types/ripple';
import './ExtractPages.css';

export interface ExtractPagesProps {
  onBack: () => void;
}

export class ExtractPages extends BaseRippleComponent {
  private selectedFile: File | null = null;
  private selectedPages: number[] = [];
  private totalPages: number = 0;
  private tempPath: string = '';
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
        <div class="upload-section">
          <div class="upload-area ${this.selectedFile ? 'has-file' : ''}">
            ${this.selectedFile ? `
              <div class="file-info">
                <div class="file-icon">📄</div>
                <div class="file-details">
                  <div class="file-name">${this.selectedFile.name}</div>
                  <div class="file-size">${this.formatFileSize(this.selectedFile.size)}</div>
                  ${this.totalPages > 0 ? `<div class="file-pages">${this.totalPages} pages</div>` : ''}
                </div>
                <button class="btn btn-ghost remove-file-btn">×</button>
              </div>
            ` : `
              <div class="upload-prompt">
                <div class="upload-icon">📁</div>
                <h3>Select PDF File</h3>
                <p>Choose a PDF file to extract pages from</p>
                <button class="btn btn-primary select-file-btn">Select File</button>
                <p class="upload-note">Or drag and drop a PDF file here</p>
              </div>
            `}
            <input type="file" class="file-input" accept=".pdf" style="display: none;">
          </div>
        </div>

        ${this.selectedFile ? `
          <div class="extraction-section">
            <h2>Page Selection</h2>
            <div class="page-selection">
              <div class="selection-methods">
                <div class="method-group">
                  <label class="radio-label">
                    <input type="radio" name="selection-method" value="range" checked>
                    <span>Page Range</span>
                  </label>
                  <div class="range-inputs">
                    <input type="number" class="page-input" placeholder="From" min="1" max="${this.totalPages || 999}">
                    <span>to</span>
                    <input type="number" class="page-input" placeholder="To" min="1" max="${this.totalPages || 999}">
                  </div>
                </div>
                
                <div class="method-group">
                  <label class="radio-label">
                    <input type="radio" name="selection-method" value="specific">
                    <span>Specific Pages</span>
                  </label>
                  <input type="text" class="page-list-input" placeholder="e.g., 1, 3, 5-8, 10">
                </div>
                
                <div class="method-group">
                  <label class="radio-label">
                    <input type="radio" name="selection-method" value="odd-even">
                    <span>Odd/Even Pages</span>
                  </label>
                  <select class="odd-even-select">
                    <option value="odd">Odd Pages Only</option>
                    <option value="even">Even Pages Only</option>
                  </select>
                </div>
              </div>
              
              ${this.selectedPages.length > 0 ? `
                <div class="selected-pages">
                  <h3>Selected Pages: ${this.selectedPages.join(', ')}</h3>
                  <p>${this.selectedPages.length} page(s) will be extracted</p>
                </div>
              ` : ''}
            </div>

            <div class="extraction-options">
              <h3>Options</h3>
              <div class="option-group">
                <label class="checkbox-label">
                  <input type="checkbox" class="preserve-bookmarks" checked>
                  <span>Preserve bookmarks for extracted pages</span>
                </label>
              </div>
              <div class="option-group">
                <label class="checkbox-label">
                  <input type="checkbox" class="preserve-links" checked>
                  <span>Preserve internal links</span>
                </label>
              </div>
              <div class="option-group">
                <label>Output filename:</label>
                <input type="text" class="output-filename" value="${this.selectedFile.name.replace('.pdf', '_extracted.pdf')}">
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn btn-primary extract-btn" ${this.selectedPages.length === 0 || this.isProcessing ? 'disabled' : ''}>
                ${this.isProcessing ? 'Processing...' : 'Extract Pages'}
              </button>
              <button class="btn btn-secondary preview-btn" ${this.selectedPages.length === 0 ? 'disabled' : ''}>
                Preview Selection
              </button>
            </div>
          </div>
        ` : ''}

        <div class="processing-info">
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
    const removeFileBtn = this.element.querySelector('.remove-file-btn');
    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', () => {
        this.selectedFile = null;
        this.selectedPages = [];
        this.totalPages = 0;
        this.render();
      });
    }

    // Page selection methods
    const rangeInputs = this.element.querySelectorAll('.page-input');
    const pageListInput = this.element.querySelector('.page-list-input') as HTMLInputElement;
    const selectionMethods = this.element.querySelectorAll('input[name="selection-method"]');
    const oddEvenSelect = this.element.querySelector('.odd-even-select') as HTMLSelectElement;

    rangeInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateSelectedPages();
      });
      input.addEventListener('keyup', () => {
        this.updateSelectedPages();
      });
    });

    if (pageListInput) {
      pageListInput.addEventListener('input', () => {
        this.updateSelectedPages();
      });
      pageListInput.addEventListener('keyup', () => {
        this.updateSelectedPages();
      });
    }

    if (oddEvenSelect) {
      oddEvenSelect.addEventListener('change', () => {
        this.updateSelectedPages();
      });
    }

    selectionMethods.forEach(method => {
      method.addEventListener('change', () => {
        this.updateSelectedPages();
      });
    });

    // Extract button
    const extractBtn = this.element.querySelector('.extract-btn');
    if (extractBtn) {
      extractBtn.addEventListener('click', () => {
        this.handleExtraction();
      });
    }
  }

  private updateSelectedPages(): void {
    const selectedMethod = this.element.querySelector('input[name="selection-method"]:checked') as HTMLInputElement;

    if (!selectedMethod) {
      console.log('No selection method found');
      return;
    }

    console.log('Selected method:', selectedMethod.value);
    console.log('Total pages:', this.totalPages);

    switch (selectedMethod.value) {
      case 'range':
        this.updateRangeSelection();
        break;
      case 'specific':
        this.updateSpecificSelection();
        break;
      case 'odd-even':
        this.updateOddEvenSelection();
        break;
    }

    console.log('Selected pages:', this.selectedPages);
    this.render();
  }

  private updateRangeSelection(): void {
    const fromInput = this.element.querySelector('.range-inputs .page-input:first-child') as HTMLInputElement;
    const toInput = this.element.querySelector('.range-inputs .page-input:last-child') as HTMLInputElement;

    const from = parseInt(fromInput?.value || '0');
    const to = parseInt(toInput?.value || '0');

    console.log('Range selection - From:', from, 'To:', to, 'Total pages:', this.totalPages);

    if (from > 0 && to > 0 && from <= to && to <= this.totalPages) {
      this.selectedPages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
      console.log('Valid range, selected pages:', this.selectedPages);
    } else {
      this.selectedPages = [];
      console.log('Invalid range, no pages selected');
    }
  }

  private updateSpecificSelection(): void {
    const pageListInput = this.element.querySelector('.page-list-input') as HTMLInputElement;
    const input = pageListInput?.value || '';
    
    // Parse page list (e.g., "1, 3, 5-8, 10")
    this.selectedPages = [];
    const parts = input.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()));
        if (start > 0 && end > 0 && start <= end && end <= this.totalPages) {
          for (let i = start; i <= end; i++) {
            if (!this.selectedPages.includes(i)) {
              this.selectedPages.push(i);
            }
          }
        }
      } else {
        const page = parseInt(part);
        if (page > 0 && page <= this.totalPages && !this.selectedPages.includes(page)) {
          this.selectedPages.push(page);
        }
      }
    }
    
    this.selectedPages.sort((a, b) => a - b);
  }

  private updateOddEvenSelection(): void {
    const oddEvenSelect = this.element.querySelector('.odd-even-select') as HTMLSelectElement;
    const type = oddEvenSelect?.value || 'odd';
    
    this.selectedPages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if ((type === 'odd' && i % 2 === 1) || (type === 'even' && i % 2 === 0)) {
        this.selectedPages.push(i);
      }
    }
  }

  private async handleFileSelection(file: File): Promise<void> {
    try {
      this.isProcessing = true;
      this.selectedFile = file;
      this.render();

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/pdf/info', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyse PDF');
      }

      const data = await response.json();
      this.totalPages = data.pages;
      this.tempPath = data.tempPath;
      this.isProcessing = false;
      this.render();
    } catch (error) {
      console.error('File selection error:', error);
      alert('Failed to analyse PDF file. Please try again.');
      this.selectedFile = null;
      this.isProcessing = false;
      this.render();
    }
  }

  private async handleExtraction(): Promise<void> {
    if (this.selectedPages.length === 0 || !this.selectedFile || !this.tempPath) return;

    try {
      this.isProcessing = true;
      this.render();

      const response = await fetch('/api/pdf/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tempPath: this.tempPath,
          pages: this.selectedPages,
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

      alert(`Successfully extracted ${this.selectedPages.length} pages from ${this.selectedFile.name}`);
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to extract pages. Please try again.');
      this.isProcessing = false;
      this.render();
    }
  }

  update(props: Partial<ExtractPagesProps>): void {
    super.update(props);
  }
}
