import { BaseRippleComponent } from '../types/ripple';
import './ExtractPages.css';

export interface ExtractPagesProps {
  onBack: () => void;
}

interface PageRange {
  from: number;
  to: number;
}

export class ExtractPages extends BaseRippleComponent {
  private selectedFile: File | null = null;
  private totalPages: number = 0;
  private tempPath: string = '';
  private pageRanges: PageRange[] = [];
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
            <p class="help-text">Add one or more page ranges to extract. You can extract multiple non-contiguous ranges.</p>

            <div class="ranges-container">
              ${this.pageRanges.map((range, index) => `
                <div class="range-item" data-index="${index}">
                  <div class="range-inputs">
                    <div class="input-group">
                      <label>From:</label>
                      <input type="number" class="range-from" min="1" max="${this.totalPages}" value="${range.from}" data-index="${index}">
                    </div>
                    <div class="input-group">
                      <label>To:</label>
                      <input type="number" class="range-to" min="1" max="${this.totalPages}" value="${range.to}" data-index="${index}">
                    </div>
                  </div>
                  <button class="btn btn-ghost remove-range-btn" data-index="${index}" title="Remove this range">×</button>
                </div>
              `).join('')}
            </div>

            <button class="btn btn-secondary add-range-btn">+ Add Another Range</button>

            <div class="selection-preview">
              <p><strong>Will extract:</strong> ${this.getTotalPageCount()} page(s) ${this.getPageRangesDescription()}</p>
            </div>

            <div class="action-section">
              <button class="btn btn-primary extract-btn" ${this.isProcessing || this.pageRanges.length === 0 ? 'disabled' : ''}>
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

  private getTotalPageCount(): number {
    let total = 0;
    for (const range of this.pageRanges) {
      if (range.from <= range.to) {
        total += range.to - range.from + 1;
      }
    }
    return total;
  }

  private getPageRangesDescription(): string {
    if (this.pageRanges.length === 0) return '';

    const descriptions = this.pageRanges.map(range => {
      if (range.from === range.to) {
        return `page ${range.from}`;
      }
      return `pages ${range.from}-${range.to}`;
    });

    if (descriptions.length === 1) {
      return `(${descriptions[0]})`;
    }

    return `(${descriptions.join(', ')})`;
  }

  private addRange(): void {
    this.pageRanges.push({ from: 1, to: this.totalPages });
    this.render();
  }

  private removeRange(index: number): void {
    this.pageRanges.splice(index, 1);
    this.render();
  }

  private updateRange(index: number, field: 'from' | 'to', value: number): void {
    if (this.pageRanges[index]) {
      this.pageRanges[index][field] = Math.max(1, Math.min(value, this.totalPages));
      this.updatePreview();
    }
  }

  private updatePreview(): void {
    const preview = this.element.querySelector('.selection-preview p');
    if (preview) {
      preview.innerHTML = `<strong>Will extract:</strong> ${this.getTotalPageCount()} page(s) ${this.getPageRangesDescription()}`;
    }
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
        this.tempPath = '';
        this.pageRanges = [];
        this.render();
      });
    }

    // Add range button
    const addRangeBtn = this.element.querySelector('.add-range-btn');
    if (addRangeBtn) {
      addRangeBtn.addEventListener('click', () => {
        this.addRange();
      });
    }

    // Remove range buttons
    const removeRangeBtns = this.element.querySelectorAll('.remove-range-btn');
    removeRangeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
        this.removeRange(index);
      });
    });

    // Range inputs
    const rangeFromInputs = this.element.querySelectorAll('.range-from');
    rangeFromInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
        const value = parseInt((e.target as HTMLInputElement).value) || 1;
        this.updateRange(index, 'from', value);
      });
    });

    const rangeToInputs = this.element.querySelectorAll('.range-to');
    rangeToInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
        const value = parseInt((e.target as HTMLInputElement).value) || 1;
        this.updateRange(index, 'to', value);
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
      console.log('Storing tempPath:', data.tempPath);

      this.totalPages = data.pages || 1;
      this.tempPath = data.tempPath || '';
      this.pageRanges = [{ from: 1, to: this.totalPages }];
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
      this.tempPath = '';
      this.pageRanges = [];
      this.render();
    }
  }

  private async handleExtraction(): Promise<void> {
    if (!this.selectedFile || this.pageRanges.length === 0 || !this.tempPath) return;

    try {
      this.isProcessing = true;
      this.render();

      // Collect all pages from all ranges
      const pages: number[] = [];
      for (const range of this.pageRanges) {
        for (let i = range.from; i <= range.to; i++) {
          if (!pages.includes(i)) {
            pages.push(i);
          }
        }
      }

      // Sort pages in ascending order
      pages.sort((a, b) => a - b);

      console.log('Sending extraction request with tempPath:', this.tempPath);
      console.log('Pages to extract:', pages);

      const response = await fetch('/api/pdf/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tempPath: this.tempPath,
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
