import { Contact, PDFTool, FeatureRequest } from '../types/app';

// Mock PDF Tools data
export const mockPDFTools: PDFTool[] = [
  // Organise category
  {
    id: 'merge-pdfs',
    name: 'Merge PDFs',
    description: 'Combine multiple PDF files into a single document',
    category: 'organise',
    icon: 'merge.svg',
    tags: ['merge', 'combine', 'essential']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split a PDF document into multiple files',
    category: 'organise',
    icon: 'split.svg',
    tags: ['split', 'separate', 'essential']
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    description: 'Extract specific pages from a PDF document',
    category: 'organise',
    icon: 'extract.svg',
    tags: ['extract', 'pages', 'essential']
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate pages in a PDF document',
    category: 'organise',
    icon: 'rotate.svg',
    tags: ['rotate', 'orientation']
  },
  {
    id: 'remove-pages',
    name: 'Remove Pages',
    description: 'Remove specific pages from a PDF document',
    category: 'organise',
    icon: 'remove.svg',
    tags: ['remove', 'delete', 'pages']
  },
  {
    id: 'organize-pages',
    name: 'Organize Pages',
    description: 'Reorder and organize pages in a PDF',
    category: 'organise',
    icon: 'sort.svg',
    tags: ['organize', 'reorder', 'pages']
  },

  // Convert to PDF category
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images (JPG, PNG, etc.) to PDF format',
    category: 'convert-to-pdf',
    icon: 'image_t0_pdf.svg',
    tags: ['image', 'convert', 'essential']
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert HTML files and web pages to PDF',
    category: 'convert-to-pdf',
    icon: 'html_to_pdf.svg',
    tags: ['html', 'web', 'convert']
  },
  {
    id: 'markdown-to-pdf',
    name: 'Markdown to PDF',
    description: 'Convert Markdown files to PDF format',
    category: 'convert-to-pdf',
    icon: 'edit.svg',
    tags: ['markdown', 'convert', 'text']
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Convert plain text files to PDF format',
    category: 'convert-to-pdf',
    icon: 'edit.svg',
    tags: ['text', 'convert', 'basic']
  },

  // Convert from PDF category
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF pages to images (PNG, JPG)',
    category: 'convert-from-pdf',
    icon: 'pdf_to_image.svg',
    tags: ['image', 'convert', 'essential']
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text content from PDF documents',
    category: 'convert-from-pdf',
    icon: 'edit.svg',
    tags: ['text', 'extract', 'content']
  },
  {
    id: 'extract-images',
    name: 'Extract Images',
    description: 'Extract all images from a PDF document',
    category: 'convert-from-pdf',
    icon: 'extract.svg',
    tags: ['images', 'extract', 'media']
  },

  // Sign and Security category
  {
    id: 'add-password',
    name: 'Add Password',
    description: 'Protect PDF with password encryption',
    category: 'sign-and-security',
    icon: 'password_protect.svg',
    tags: ['password', 'security', 'protect']
  },
  {
    id: 'remove-password',
    name: 'Remove Password',
    description: 'Remove password protection from PDF',
    category: 'sign-and-security',
    icon: 'unlock.svg',
    tags: ['password', 'unlock', 'security']
  },
  {
    id: 'change-permissions',
    name: 'Change Permissions',
    description: 'Modify PDF permissions and restrictions',
    category: 'sign-and-security',
    icon: 'password_protect.svg',
    tags: ['permissions', 'security', 'restrict']
  },

  // View and Edit category
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    description: 'Add text or image watermarks to PDF',
    category: 'view-and-edit',
    icon: 'watermark.svg',
    tags: ['watermark', 'branding', 'edit']
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    description: 'Add page numbers to PDF documents',
    category: 'view-and-edit',
    icon: 'page_numbers.svg',
    tags: ['pages', 'numbers', 'edit']
  },
  {
    id: 'add-stamps',
    name: 'Add Stamps',
    description: 'Add stamps and annotations to PDF',
    category: 'view-and-edit',
    icon: 'sign.svg',
    tags: ['stamps', 'annotations', 'edit']
  },
  {
    id: 'flatten-pdf',
    name: 'Flatten PDF',
    description: 'Flatten form fields and annotations',
    category: 'view-and-edit',
    icon: 'flatten.svg',
    tags: ['flatten', 'forms', 'finalize']
  },

  // Advanced category
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    category: 'advanced',
    icon: 'compress.svg',
    tags: ['compress', 'optimize', 'essential']
  },
  {
    id: 'ocr-pdf',
    name: 'OCR / Cleanup Scans',
    description: 'Convert scanned documents to searchable text',
    category: 'advanced',
    icon: 'ocr.svg',
    tags: ['ocr', 'scans', 'text']
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    description: 'Convert to PDF/A archival format',
    category: 'advanced',
    icon: 'pdf_to_pdfA.svg',
    tags: ['pdfa', 'archive', 'standard']
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    description: 'Attempt to repair corrupted PDF files',
    category: 'advanced',
    icon: 'repair.svg',
    tags: ['repair', 'fix', 'corrupted']
  },
  {
    id: 'remove-blank-pages',
    name: 'Remove Blank Pages',
    description: 'Automatically detect and remove blank pages',
    category: 'advanced',
    icon: 'remove.svg',
    tags: ['blank', 'remove', 'cleanup']
  }
];

export const availableToolCategories = ['organise', 'convert-to-pdf', 'convert-from-pdf', 'sign-and-security', 'view-and-edit', 'advanced'];
export const availableToolTags = ['essential', 'merge', 'combine', 'split', 'separate', 'extract', 'pages', 'rotate', 'orientation', 'remove', 'delete', 'organize', 'reorder', 'image', 'convert', 'html', 'web', 'markdown', 'text', 'basic', 'content', 'media', 'password', 'security', 'protect', 'unlock', 'restrict', 'permissions', 'watermark', 'branding', 'edit', 'numbers', 'stamps', 'annotations', 'flatten', 'forms', 'finalize', 'compress', 'optimize', 'ocr', 'scans', 'pdfa', 'archive', 'standard', 'repair', 'fix', 'corrupted', 'blank', 'cleanup'];

// Feature Requests mock data
export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: 'fr-1',
    title: 'Excel to PDF Converter',
    description: 'Convert Excel spreadsheets (.xlsx, .xls) to PDF format while preserving formatting and charts.',
    category: 'convert-to-pdf',
    submittedBy: 'Sarah M.',
    submittedAt: new Date('2024-01-20'),
    votes: 45,
    status: 'pending',
    tags: ['excel', 'spreadsheet', 'convert'],
    voters: ['user1', 'user2', 'user3']
  },
  {
    id: 'fr-2',
    title: 'PDF Digital Signature Tool',
    description: 'Add digital signatures to PDF documents with certificate validation and timestamp.',
    category: 'sign-and-security',
    submittedBy: 'Mike Chen',
    submittedAt: new Date('2024-01-18'),
    votes: 38,
    status: 'in-progress',
    tags: ['signature', 'certificate', 'validation'],
    voters: ['user4', 'user5']
  },
  {
    id: 'fr-3',
    title: 'Batch PDF Processing',
    description: 'Process multiple PDF files at once with the same operation (merge, split, compress, etc.).',
    category: 'advanced',
    submittedBy: 'Emily R.',
    submittedAt: new Date('2024-01-15'),
    votes: 52,
    status: 'pending',
    tags: ['batch', 'automation', 'productivity'],
    voters: ['user1', 'user6', 'user7']
  },
  {
    id: 'fr-4',
    title: 'PDF Form Builder',
    description: 'Create interactive PDF forms with text fields, checkboxes, dropdowns, and validation.',
    category: 'view-and-edit',
    submittedBy: 'David K.',
    submittedAt: new Date('2024-01-12'),
    votes: 31,
    status: 'pending',
    tags: ['forms', 'interactive', 'builder'],
    voters: ['user2', 'user8']
  },
  {
    id: 'fr-5',
    title: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF with notes and animation preservation options.',
    category: 'convert-to-pdf',
    submittedBy: 'Lisa T.',
    submittedAt: new Date('2024-01-10'),
    votes: 29,
    status: 'pending',
    tags: ['powerpoint', 'presentation', 'notes'],
    voters: ['user3', 'user9']
  },
  {
    id: 'fr-6',
    title: 'PDF Bookmark Editor',
    description: 'Advanced bookmark editing with hierarchical structure and automatic generation from headings.',
    category: 'view-and-edit',
    submittedBy: 'James W.',
    submittedAt: new Date('2024-01-08'),
    votes: 24,
    status: 'pending',
    tags: ['bookmarks', 'navigation', 'structure'],
    voters: ['user4', 'user10']
  },
  {
    id: 'fr-7',
    title: 'PDF to Word with Formatting',
    description: 'Convert PDF to Word documents while preserving complex formatting, tables, and images.',
    category: 'convert-from-pdf',
    submittedBy: 'Anna K.',
    submittedAt: new Date('2024-01-05'),
    votes: 67,
    status: 'pending',
    tags: ['word', 'formatting', 'conversion'],
    voters: ['user1', 'user5', 'user11']
  },
  {
    id: 'fr-8',
    title: 'PDF Comparison Tool',
    description: 'Compare two PDF documents side-by-side with highlighting of differences.',
    category: 'advanced',
    submittedBy: 'Robert G.',
    submittedAt: new Date('2024-01-03'),
    votes: 33,
    status: 'pending',
    tags: ['compare', 'diff', 'analysis'],
    voters: ['user6', 'user12']
  }
];

export const featureRequestStatuses = ['pending', 'in-progress', 'completed', 'rejected'];
export const featureRequestCategories = availableToolCategories;

// Legacy mock data for contacts (keeping for backward compatibility during transition)
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    role: 'Product Manager',
    tags: ['client', 'vip'],
    lastContact: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 234-5678',
    company: 'StartupXYZ',
    role: 'CEO',
    tags: ['prospect', 'enterprise'],
    lastContact: new Date('2024-01-10'),
    status: 'pending'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Design Studio',
    role: 'Creative Director',
    tags: ['client', 'design'],
    lastContact: new Date('2024-01-08'),
    status: 'active'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 456-7890',
    company: 'DataFlow Solutions',
    role: 'Data Scientist',
    tags: ['prospect', 'technical'],
    lastContact: new Date('2024-01-05'),
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    phone: '+1 (555) 567-8901',
    company: 'Marketing Plus',
    role: 'Marketing Director',
    tags: ['client', 'marketing'],
    lastContact: new Date('2024-01-12'),
    status: 'active'
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 678-9012',
    company: 'Legal Associates',
    role: 'Partner',
    tags: ['prospect', 'legal'],
    lastContact: new Date('2024-01-03'),
    status: 'pending'
  },
  {
    id: '7',
    name: 'Anna Kowalski',
    email: 'anna.kowalski@example.com',
    phone: '+1 (555) 789-0123',
    company: 'Global Industries',
    role: 'Operations Manager',
    tags: ['client', 'operations'],
    lastContact: new Date('2024-01-14'),
    status: 'active'
  },
  {
    id: '8',
    name: 'Robert Garcia',
    email: 'robert.garcia@example.com',
    phone: '+1 (555) 890-1234',
    company: 'Finance Corp',
    role: 'CFO',
    tags: ['vip', 'finance'],
    lastContact: new Date('2024-01-07'),
    status: 'active'
  }
];

export const availableTags = ['client', 'prospect', 'vip', 'enterprise', 'design', 'technical', 'marketing', 'legal', 'operations', 'finance'];