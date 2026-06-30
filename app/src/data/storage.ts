import type { User, Shipment, Driver, Client, ShipmentStatus, ExternalLink, Notification, Activity } from '@/types';

const STORAGE_KEYS = {
  USERS: 'fd_users',
  SHIPMENTS: 'fd_shipments',
  DRIVERS: 'fd_drivers',
  CLIENTS: 'fd_clients',
  STATUSES: 'fd_statuses',
  LINKS: 'fd_links',
  NOTIFICATIONS: 'fd_notifications',
  CURRENT_USER: 'fd_currentUser',
  ACTIVITIES: 'fd_activities',
  INITIALIZED: 'fd_initialized',
} as const;

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers: (): User[] => getItem(STORAGE_KEYS.USERS, []),
  setUsers: (users: User[]) => setItem(STORAGE_KEYS.USERS, users),

  getShipments: (): Shipment[] => getItem(STORAGE_KEYS.SHIPMENTS, []),
  setShipments: (shipments: Shipment[]) => setItem(STORAGE_KEYS.SHIPMENTS, shipments),

  getDrivers: (): Driver[] => getItem(STORAGE_KEYS.DRIVERS, []),
  setDrivers: (drivers: Driver[]) => setItem(STORAGE_KEYS.DRIVERS, drivers),

  getClients: (): Client[] => getItem(STORAGE_KEYS.CLIENTS, []),
  setClients: (clients: Client[]) => setItem(STORAGE_KEYS.CLIENTS, clients),

  getStatuses: (): ShipmentStatus[] => getItem(STORAGE_KEYS.STATUSES, []),
  setStatuses: (statuses: ShipmentStatus[]) => setItem(STORAGE_KEYS.STATUSES, statuses),

  getLinks: (): ExternalLink[] => getItem(STORAGE_KEYS.LINKS, []),
  setLinks: (links: ExternalLink[]) => setItem(STORAGE_KEYS.LINKS, links),

  getNotifications: (): Notification[] => getItem(STORAGE_KEYS.NOTIFICATIONS, []),
  setNotifications: (notifications: Notification[]) => setItem(STORAGE_KEYS.NOTIFICATIONS, notifications),

  getCurrentUser: (): User | null => getItem(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null) => setItem(STORAGE_KEYS.CURRENT_USER, user),

  getActivities: (): Activity[] => getItem(STORAGE_KEYS.ACTIVITIES, []),
  setActivities: (activities: Activity[]) => setItem(STORAGE_KEYS.ACTIVITIES, activities),

  isInitialized: (): boolean => getItem(STORAGE_KEYS.INITIALIZED, false),
  setInitialized: (value: boolean) => setItem(STORAGE_KEYS.INITIALIZED, value),

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
