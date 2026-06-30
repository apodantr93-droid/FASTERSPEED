import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { storage } from '@/data/storage';
import { generateId, generateTrackingNumber } from '@/data/demoData';
import type { Shipment, Driver, Client, ShipmentStatus, ExternalLink, Notification, Activity, User } from '@/types';

interface DataContextType {
  shipments: Shipment[];
  drivers: Driver[];
  clients: Client[];
  statuses: ShipmentStatus[];
  links: ExternalLink[];
  notifications: Notification[];
  activities: Activity[];
  refreshData: () => void;
  addShipment: (shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Shipment;
  updateShipment: (id: string, data: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'shipmentsCount' | 'completedCount'>) => void;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'shipmentsCount'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addStatus: (status: Omit<ShipmentStatus, 'id'>) => void;
  updateStatus: (id: string, data: Partial<ShipmentStatus>) => void;
  deleteStatus: (id: string) => void;
  addLink: (link: Omit<ExternalLink, 'id'>) => void;
  updateLink: (id: string, data: Partial<ExternalLink>) => void;
  deleteLink: (id: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(() => storage.getShipments());
  const [drivers, setDrivers] = useState<Driver[]>(() => storage.getDrivers());
  const [clients, setClients] = useState<Client[]>(() => storage.getClients());
  const [statuses, setStatuses] = useState<ShipmentStatus[]>(() => storage.getStatuses());
  const [links, setLinks] = useState<ExternalLink[]>(() => storage.getLinks());
  const [notifications, setNotifications] = useState<Notification[]>(() => storage.getNotifications());
  const [activities, setActivities] = useState<Activity[]>(() => storage.getActivities());

  const refreshData = useCallback(() => {
    setShipments(storage.getShipments());
    setDrivers(storage.getDrivers());
    setClients(storage.getClients());
    setStatuses(storage.getStatuses());
    setLinks(storage.getLinks());
    setNotifications(storage.getNotifications());
    setActivities(storage.getActivities());
  }, []);

  const addShipment = useCallback((shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Shipment => {
    const newShipment: Shipment = {
      ...shipmentData,
      id: generateId(),
      trackingNumber: generateTrackingNumber(),
      statusHistory: [
        {
          status: shipmentData.status,
          statusName: statuses.find(s => s.id === shipmentData.status)?.nameAr || shipmentData.status,
          timestamp: new Date().toISOString(),
          note: 'تم استلام الشحنة',
          updatedBy: shipmentData.senderId || 'admin',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...shipments, newShipment];
    setShipments(updated);
    storage.setShipments(updated);
    return newShipment;
  }, [shipments, statuses]);

  const updateShipment = useCallback((id: string, data: Partial<Shipment>) => {
    const updated = shipments.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s);
    setShipments(updated);
    storage.setShipments(updated);
  }, [shipments]);

  const deleteShipment = useCallback((id: string) => {
    const updated = shipments.filter(s => s.id !== id);
    setShipments(updated);
    storage.setShipments(updated);
  }, [shipments]);

  const addDriver = useCallback((driverData: Omit<Driver, 'id' | 'shipmentsCount' | 'completedCount'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: generateId(),
      shipmentsCount: 0,
      completedCount: 0,
    };
    const updated = [...drivers, newDriver];
    setDrivers(updated);
    storage.setDrivers(updated);
  }, [drivers]);

  const updateDriver = useCallback((id: string, data: Partial<Driver>) => {
    const updated = drivers.map(d => d.id === id ? { ...d, ...data } : d);
    setDrivers(updated);
    storage.setDrivers(updated);
  }, [drivers]);

  const deleteDriver = useCallback((id: string) => {
    const updated = drivers.filter(d => d.id !== id);
    setDrivers(updated);
    storage.setDrivers(updated);
  }, [drivers]);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'shipmentsCount'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      shipmentsCount: 0,
    };
    const updated = [...clients, newClient];
    setClients(updated);
    storage.setClients(updated);
  }, [clients]);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...data } : c);
    setClients(updated);
    storage.setClients(updated);
  }, [clients]);

  const deleteClient = useCallback((id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    storage.setClients(updated);
  }, [clients]);

  const addStatus = useCallback((statusData: Omit<ShipmentStatus, 'id'>) => {
    const newStatus: ShipmentStatus = {
      ...statusData,
      id: generateId(),
    };
    const updated = [...statuses, newStatus];
    setStatuses(updated);
    storage.setStatuses(updated);
  }, [statuses]);

  const updateStatus = useCallback((id: string, data: Partial<ShipmentStatus>) => {
    const updated = statuses.map(s => s.id === id ? { ...s, ...data } : s);
    setStatuses(updated);
    storage.setStatuses(updated);
  }, [statuses]);

  const deleteStatus = useCallback((id: string) => {
    const updated = statuses.filter(s => s.id !== id);
    setStatuses(updated);
    storage.setStatuses(updated);
  }, [statuses]);

  const addLink = useCallback((linkData: Omit<ExternalLink, 'id'>) => {
    const newLink: ExternalLink = {
      ...linkData,
      id: generateId(),
    };
    const updated = [...links, newLink];
    setLinks(updated);
    storage.setLinks(updated);
  }, [links]);

  const updateLink = useCallback((id: string, data: Partial<ExternalLink>) => {
    const updated = links.map(l => l.id === id ? { ...l, ...data } : l);
    setLinks(updated);
    storage.setLinks(updated);
  }, [links]);

  const deleteLink = useCallback((id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    storage.setLinks(updated);
  }, [links]);

  const markNotificationRead = useCallback((id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    storage.setNotifications(updated);
  }, [notifications]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    storage.setNotifications(updated);
  }, [notifications]);

  const addActivity = useCallback((activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newActivity, ...activities].slice(0, 100);
    setActivities(updated);
    storage.setActivities(updated);
  }, [activities]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const users = storage.getUsers();
    users.push(newUser);
    storage.setUsers(users);
    return newUser;
  }, []);

  const deleteUser = useCallback((id: string) => {
    const users = storage.getUsers().filter(u => u.id !== id);
    storage.setUsers(users);
  }, []);

  return (
    <DataContext.Provider value={{
      shipments, drivers, clients, statuses, links, notifications, activities,
      refreshData,
      addShipment, updateShipment, deleteShipment,
      addDriver, updateDriver, deleteDriver,
      addClient, updateClient, deleteClient,
      addStatus, updateStatus, deleteStatus,
      addLink, updateLink, deleteLink,
      markNotificationRead,
      addNotification, addActivity,
      addUser, deleteUser,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
