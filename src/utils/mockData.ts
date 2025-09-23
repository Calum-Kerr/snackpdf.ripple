import { Contact, PDFTool } from '../types/app';

// Mock PDF Tools data based on Ghostscript-compatible Stirling PDF features
export const mockPDFTools: PDFTool[] = [
  // Organise category
  {
    id: 'merge-pdfs',
    name: 'Merge PDFs',
    description: 'Combine multiple PDF files into a single document',
    category: 'organise',
    icon: 'add_to_photos',
    ghostscriptCompatible: true,
    popularity: 95,
    tags: ['merge', 'combine', 'essential']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split a PDF document into multiple files',
    category: 'organise',
    icon: 'cut',
    ghostscriptCompatible: true,
    popularity: 90,
    tags: ['split', 'separate', 'essential']
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    description: 'Extract specific pages from a PDF document',
    category: 'organise',
    icon: 'upload',
    ghostscriptCompatible: true,
    popularity: 85,
    tags: ['extract', 'pages', 'essential']
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate pages in a PDF document',
    category: 'organise',
    icon: 'rotate_right',
    ghostscriptCompatible: true,
    popularity: 75,
    tags: ['rotate', 'orientation']
  },
  {
    id: 'remove-pages',
    name: 'Remove Pages',
    description: 'Remove specific pages from a PDF document',
    category: 'organise',
    icon: 'delete',
    ghostscriptCompatible: true,
    popularity: 70,
    tags: ['remove', 'delete', 'pages']
  },
  {
    id: 'organize-pages',
    name: 'Organize Pages',
    description: 'Reorder and organize pages in a PDF',
    category: 'organise',
    icon: 'format_list_bulleted',
    ghostscriptCompatible: true,
    popularity: 80,
    tags: ['organize', 'reorder', 'pages']
  },

  // Convert to PDF category
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images (JPG, PNG, etc.) to PDF format',
    category: 'convert-to-pdf',
    icon: 'picture_as_pdf',
    ghostscriptCompatible: true,
    popularity: 95,
    tags: ['image', 'convert', 'essential']
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert HTML files and web pages to PDF',
    category: 'convert-to-pdf',
    icon: 'html',
    ghostscriptCompatible: true,
    popularity: 85,
    tags: ['html', 'web', 'convert']
  },
  {
    id: 'markdown-to-pdf',
    name: 'Markdown to PDF',
    description: 'Convert Markdown files to PDF format',
    category: 'convert-to-pdf',
    icon: 'markdown',
    ghostscriptCompatible: true,
    popularity: 70,
    tags: ['markdown', 'convert', 'text']
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Convert plain text files to PDF format',
    category: 'convert-to-pdf',
    icon: 'draft',
    ghostscriptCompatible: true,
    popularity: 65,
    tags: ['text', 'convert', 'basic']
  },

  // Convert from PDF category
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF pages to images (PNG, JPG)',
    category: 'convert-from-pdf',
    icon: 'photo_library',
    ghostscriptCompatible: true,
    popularity: 90,
    tags: ['image', 'convert', 'essential']
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text content from PDF documents',
    category: 'convert-from-pdf',
    icon: 'text_fields',
    ghostscriptCompatible: true,
    popularity: 85,
    tags: ['text', 'extract', 'content']
  },
  {
    id: 'extract-images',
    name: 'Extract Images',
    description: 'Extract all images from a PDF document',
    category: 'convert-from-pdf',
    icon: 'photo_library',
    ghostscriptCompatible: true,
    popularity: 75,
    tags: ['images', 'extract', 'media']
  },

  // Sign and Security category
  {
    id: 'add-password',
    name: 'Add Password',
    description: 'Protect PDF with password encryption',
    category: 'sign-and-security',
    icon: 'lock',
    ghostscriptCompatible: true,
    popularity: 90,
    tags: ['password', 'security', 'protect']
  },
  {
    id: 'remove-password',
    name: 'Remove Password',
    description: 'Remove password protection from PDF',
    category: 'sign-and-security',
    icon: 'lock_open_right',
    ghostscriptCompatible: true,
    popularity: 80,
    tags: ['password', 'unlock', 'security']
  },
  {
    id: 'change-permissions',
    name: 'Change Permissions',
    description: 'Modify PDF permissions and restrictions',
    category: 'sign-and-security',
    icon: 'encrypted',
    ghostscriptCompatible: true,
    popularity: 70,
    tags: ['permissions', 'security', 'restrict']
  },

  // View and Edit category
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    description: 'Add text or image watermarks to PDF',
    category: 'view-and-edit',
    icon: 'water_drop',
    ghostscriptCompatible: true,
    popularity: 85,
    tags: ['watermark', 'branding', 'edit']
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    description: 'Add page numbers to PDF documents',
    category: 'view-and-edit',
    icon: '123',
    ghostscriptCompatible: true,
    popularity: 80,
    tags: ['pages', 'numbers', 'edit']
  },
  {
    id: 'add-stamps',
    name: 'Add Stamps',
    description: 'Add stamps and annotations to PDF',
    category: 'view-and-edit',
    icon: 'approval',
    ghostscriptCompatible: true,
    popularity: 75,
    tags: ['stamps', 'annotations', 'edit']
  },
  {
    id: 'flatten-pdf',
    name: 'Flatten PDF',
    description: 'Flatten form fields and annotations',
    category: 'view-and-edit',
    icon: 'layers_clear',
    ghostscriptCompatible: true,
    popularity: 60,
    tags: ['flatten', 'forms', 'finalize']
  },

  // Advanced category
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    category: 'advanced',
    icon: 'zoom_in_map',
    ghostscriptCompatible: true,
    popularity: 95,
    tags: ['compress', 'optimize', 'essential']
  },
  {
    id: 'ocr-pdf',
    name: 'OCR / Cleanup Scans',
    description: 'Convert scanned documents to searchable text',
    category: 'advanced',
    icon: 'quick_reference_all',
    ghostscriptCompatible: true,
    popularity: 85,
    tags: ['ocr', 'scans', 'text']
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    description: 'Convert to PDF/A archival format',
    category: 'advanced',
    icon: 'picture_as_pdf',
    ghostscriptCompatible: true,
    popularity: 70,
    tags: ['pdfa', 'archive', 'standard']
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    description: 'Attempt to repair corrupted PDF files',
    category: 'advanced',
    icon: 'build',
    ghostscriptCompatible: true,
    popularity: 65,
    tags: ['repair', 'fix', 'corrupted']
  },
  {
    id: 'remove-blank-pages',
    name: 'Remove Blank Pages',
    description: 'Automatically detect and remove blank pages',
    category: 'advanced',
    icon: 'scan_delete',
    ghostscriptCompatible: true,
    popularity: 75,
    tags: ['blank', 'remove', 'cleanup']
  }
];

export const availableToolCategories = ['organise', 'convert-to-pdf', 'convert-from-pdf', 'sign-and-security', 'view-and-edit', 'advanced'];
export const availableToolTags = ['essential', 'merge', 'combine', 'split', 'separate', 'extract', 'pages', 'rotate', 'orientation', 'remove', 'delete', 'organize', 'reorder', 'image', 'convert', 'html', 'web', 'markdown', 'text', 'basic', 'content', 'media', 'password', 'security', 'protect', 'unlock', 'restrict', 'permissions', 'watermark', 'branding', 'edit', 'numbers', 'stamps', 'annotations', 'flatten', 'forms', 'finalize', 'compress', 'optimize', 'ocr', 'scans', 'pdfa', 'archive', 'standard', 'repair', 'fix', 'corrupted', 'blank', 'cleanup'];

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