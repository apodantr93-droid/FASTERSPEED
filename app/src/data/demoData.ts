import { storage } from './storage';
import type { User, Shipment, Driver, Client, ShipmentStatus, ExternalLink, Notification } from '@/types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function generateTrackingNumber(): string {
  return 'FD' + Math.random().toString(36).substring(2, 8).toUpperCase() + Date.now().toString(36).substring(0, 4).toUpperCase();
}

const demoUsers: User[] = [
  { id: 'admin1', name: 'المدير', email: 'admin@faster.com', password: 'admin123', role: 'admin', phone: '01000000001', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'driver1', name: 'أحمد محمد', email: 'driver@faster.com', password: 'driver123', role: 'driver', phone: '01000000002', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'driver2', name: 'محمد علي', email: 'driver2@faster.com', password: 'driver123', role: 'driver', phone: '01000000003', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'driver3', name: 'خالد إبراهيم', email: 'driver3@faster.com', password: 'driver123', role: 'driver', phone: '01000000004', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'driver4', name: 'سامي حسن', email: 'driver4@faster.com', password: 'driver123', role: 'driver', phone: '01000000005', isActive: false, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'driver5', name: 'عمر عبدالله', email: 'driver5@faster.com', password: 'driver123', role: 'driver', phone: '01000000006', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'client1', name: 'محمد السيد', email: 'client@faster.com', password: 'client123', role: 'client', phone: '01000000007', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'client2', name: 'أحمد حسن', email: 'client2@faster.com', password: 'client123', role: 'client', phone: '01000000008', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'client3', name: 'فاطمة أحمد', email: 'client3@faster.com', password: 'client123', role: 'client', phone: '01000000009', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'client4', name: 'علي محمود', email: 'client4@faster.com', password: 'client123', role: 'client', phone: '01000000010', isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'client5', name: 'سارة خالد', email: 'client5@faster.com', password: 'client123', role: 'client', phone: '01000000011', isActive: false, createdAt: '2025-01-01T10:00:00Z' },
];

const defaultStatuses: ShipmentStatus[] = [
  { id: 'pending', name: 'pending', nameAr: 'مستلمة', color: '#3B82F6', description: 'تم استلام الشحنة من المرسل', isDefault: true, order: 1 },
  { id: 'in_transit', name: 'in_transit', nameAr: 'جار التوصيل', color: '#F97316', description: 'الشحنة في طريقها للمستلم', isDefault: true, order: 2 },
  { id: 'delivered', name: 'delivered', nameAr: 'مكتملة', color: '#22C55E', description: 'تم توصيل الشحنة بنجاح', isDefault: true, order: 3 },
  { id: 'rejected', name: 'rejected', nameAr: 'مرفوضة', color: '#EF4444', description: 'تم رفض استلام الشحنة', isDefault: true, order: 4 },
  { id: 'postponed', name: 'postponed', nameAr: 'مؤجلة', color: '#EAB308', description: 'تم تأجيل توصيل الشحنة', isDefault: true, order: 5 },
  { id: 'returned', name: 'returned', nameAr: 'مرتجعة', color: '#8B5CF6', description: 'الشحنة مرتجعة للمرسل', isDefault: false, order: 6 },
];

const demoDrivers: Driver[] = [
  { id: 'd1', userId: 'driver1', name: 'أحمد محمد', phone: '01000000002', email: 'driver@faster.com', isActive: true, shipmentsCount: 12, completedCount: 8 },
  { id: 'd2', userId: 'driver2', name: 'محمد علي', phone: '01000000003', email: 'driver2@faster.com', isActive: true, shipmentsCount: 15, completedCount: 10 },
  { id: 'd3', userId: 'driver3', name: 'خالد إبراهيم', phone: '01000000004', email: 'driver3@faster.com', isActive: true, shipmentsCount: 8, completedCount: 5 },
  { id: 'd4', userId: 'driver4', name: 'سامي حسن', phone: '01000000005', email: 'driver4@faster.com', isActive: false, shipmentsCount: 3, completedCount: 2 },
  { id: 'd5', userId: 'driver5', name: 'عمر عبدالله', phone: '01000000006', email: 'driver5@faster.com', isActive: true, shipmentsCount: 20, completedCount: 15 },
];

const demoClients: Client[] = [
  { id: 'c1', userId: 'client1', name: 'محمد السيد', storeName: 'متجر السيد', phone: '01000000007', email: 'client@faster.com', isActive: true, shipmentsCount: 10 },
  { id: 'c2', userId: 'client2', name: 'أحمد حسن', storeName: 'متجر حسن', phone: '01000000008', email: 'client2@faster.com', isActive: true, shipmentsCount: 8 },
  { id: 'c3', userId: 'client3', name: 'فاطمة أحمد', storeName: 'متجر فاطمة', phone: '01000000009', email: 'client3@faster.com', isActive: true, shipmentsCount: 12 },
  { id: 'c4', userId: 'client4', name: 'علي محمود', storeName: 'متجر علي', phone: '01000000010', email: 'client4@faster.com', isActive: true, shipmentsCount: 6 },
  { id: 'c5', userId: 'client5', name: 'سارة خالد', storeName: 'متجر سارة', phone: '01000000011', email: 'client5@faster.com', isActive: false, shipmentsCount: 3 },
];

const governorates = ['القاهرة', 'الإسكندرية', 'الجيزة', 'الشرقية', 'الدقهلية', 'البحيرة', 'المنوفية', 'القليوبية', 'الغربية'];

function createShipment(index: number, clientId?: string, driverId?: string): Shipment {
  const statusIds = ['pending', 'in_transit', 'delivered', 'rejected', 'postponed'];
  const statusId = statusIds[Math.floor(Math.random() * statusIds.length)];
  const governorate = governorates[Math.floor(Math.random() * governorates.length)];
  const weight = Math.floor(Math.random() * 20) + 1;
  const basePrice = 25 + Math.floor(Math.random() * 40);
  const price = basePrice + (weight > 1 ? (weight - 1) * 5 : 0);
  const serviceTypes: Array<'normal' | 'express' | 'cold'> = ['normal', 'express', 'cold'];
  const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
  const finalPrice = serviceType === 'express' ? price * 1.5 : serviceType === 'cold' ? price * 2 : price;

  const statusHistory: Shipment['statusHistory'] = [
    { status: 'pending', statusName: 'مستلمة', timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), note: 'تم استلام الشحنة', updatedBy: 'admin1' },
  ];

  if (statusId !== 'pending') {
    statusHistory.push({
      status: 'in_transit',
      statusName: 'جار التوصيل',
      timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'الشحنة في الطريق',
      updatedBy: driverId || 'driver1',
    });
  }

  if (statusId === 'delivered' || statusId === 'rejected' || statusId === 'postponed') {
    statusHistory.push({
      status: statusId,
      statusName: defaultStatuses.find(s => s.id === statusId)?.nameAr || statusId,
      timestamp: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
      note: `الشحنة ${defaultStatuses.find(s => s.id === statusId)?.nameAr}`,
      updatedBy: driverId || 'driver1',
    });
  }

  const clientNames = ['محمد السيد', 'أحمد حسن', 'فاطمة أحمد', 'علي محمود', 'سارة خالد'];
  const driverNames = ['أحمد محمد', 'محمد علي', 'خالد إبراهيم', 'عمر عبدالله'];

  return {
    id: generateId(),
    trackingNumber: generateTrackingNumber(),
    senderName: clientNames[Math.floor(Math.random() * clientNames.length)],
    senderPhone: '010' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
    senderId: clientId || `client${Math.floor(Math.random() * 5) + 1}`,
    receiverName: `مستلم ${index + 1}`,
    receiverPhone: '010' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
    receiverAddress: `شارع ${Math.floor(Math.random() * 100) + 1}، ${governorate}`,
    governorate,
    weight,
    notes: Math.random() > 0.5 ? 'ملاحظات إضافية' : undefined,
    status: statusId,
    statusHistory,
    driverId: driverId || `d${Math.floor(Math.random() * 5) + 1}`,
    driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
    price: Math.round(finalPrice),
    serviceType,
    createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const demoShipments: Shipment[] = Array.from({ length: 25 }, (_, i) => {
  const clientIds = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const driverIds = ['d1', 'd2', 'd3', 'd5'];
  return createShipment(i, clientIds[i % 5], driverIds[i % 4]);
});

const demoLinks: ExternalLink[] = [
  { id: 'link1', name: 'واتساب', url: 'https://wa.me/201000000000', icon: 'MessageCircle', position: 'sidebar', isActive: true },
  { id: 'link2', name: 'الموقع الإلكتروني', url: 'https://faster-delivery.com', icon: 'Globe', position: 'sidebar', isActive: true },
  { id: 'link3', name: 'فيسبوك', url: 'https://facebook.com/fasterdelivery', icon: 'Facebook', position: 'sidebar', isActive: false },
];

const demoNotifications: Notification[] = [
  { id: 'n1', title: 'شحنة جديدة', message: 'تم إضافة شحنة جديدة برقم FD12345', type: 'info', isRead: false, role: 'admin', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'n2', title: 'تم التوصيل', message: 'تم توصيل الشحنة FD67890 بنجاح', type: 'success', isRead: false, role: 'admin', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: 'n3', title: 'شحنة مرفوضة', message: 'تم رفض استلام الشحنة FD11111', type: 'warning', isRead: true, role: 'admin', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: 'n4', title: 'مندوب جديد', message: 'تم إضافة مندوب جديد: عمر عبدالله', type: 'info', isRead: true, role: 'admin', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

export function seedDemoData(): void {
  if (storage.isInitialized()) return;

  storage.setUsers(demoUsers);
  storage.setShipments(demoShipments);
  storage.setDrivers(demoDrivers);
  storage.setClients(demoClients);
  storage.setStatuses(defaultStatuses);
  storage.setLinks(demoLinks);
  storage.setNotifications(demoNotifications);
  storage.setActivities([]);
  storage.setInitialized(true);
}

export { generateId, generateTrackingNumber, governorates };
