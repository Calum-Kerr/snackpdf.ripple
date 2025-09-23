import { Contact } from '../types/app';

// Mock data for development
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