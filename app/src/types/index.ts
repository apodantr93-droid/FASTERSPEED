export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'driver' | 'client';
  phone: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderId?: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  governorate: string;
  weight: number;
  notes?: string;
  status: string;
  statusHistory: StatusUpdate[];
  driverId?: string;
  driverName?: string;
  price: number;
  serviceType: 'normal' | 'express' | 'cold';
  createdAt: string;
  updatedAt: string;
}

export interface StatusUpdate {
  status: string;
  statusName?: string;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  shipmentsCount: number;
  completedCount: number;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  storeName?: string;
  phone: string;
  email: string;
  isActive: boolean;
  shipmentsCount: number;
}

export interface ShipmentStatus {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  description?: string;
  isDefault: boolean;
  order: number;
}

export interface ExternalLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  position: 'sidebar' | 'header' | 'footer';
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  userId?: string;
  role?: 'admin' | 'driver' | 'client';
  createdAt: string;
}

export interface Activity {
  id: string;
  action: string;
  details: string;
  userId: string;
  userName: string;
  role: string;
  createdAt: string;
}

export interface PricingRule {
  from: string;
  to: string;
  basePrice: number;
  perKg: number;
}

export type ServiceType = 'normal' | 'express' | 'cold';
