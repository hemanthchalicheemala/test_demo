export type Role = 'OWNER' | 'TENANT' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  bio?: string;
  city?: string;
  createdAt?: string;
  _count?: { properties?: number; requests?: number; complaints?: number };
}

export interface PropertyImage {
  id: number;
  url: string;
}

export interface Property {
  id: number;
  ownerId: number;
  title: string;
  address: string;
  city: string;
  monthlyRent: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  parking: boolean;
  propertyType: string;
  amenities: string;
  description: string;
  status: 'AVAILABLE' | 'OCCUPIED';
  approved: boolean;
  images: PropertyImage[];
  owner?: User;
  leases?: Lease[];
  _count?: { requests?: number; complaints?: number };
}

export interface RentalRequest {
  id: number;
  propertyId: number;
  tenantId: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  property?: Property;
  tenant?: User;
}

export interface Lease {
  id: number;
  propertyId: number;
  tenantId: number;
  ownerId: number;
  startDate: string;
  endDate?: string;
  rent: number;
  deposit: number;
  active: boolean;
  property?: Property;
  tenant?: User;
  owner?: User;
}

export interface Payment {
  id: number;
  propertyId: number;
  tenantId: number;
  leaseId?: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  method?: string;
  property?: Property;
  tenant?: User;
}

export interface Complaint {
  id: number;
  propertyId: number;
  tenantId: number;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  property?: Property;
  tenant?: User;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Announcement {
  id: number;
  ownerId: number;
  propertyId?: number;
  title: string;
  body: string;
  createdAt: string;
  owner?: User;
  property?: Property;
}
