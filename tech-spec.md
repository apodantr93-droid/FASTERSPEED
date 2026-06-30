# Faster Delivery — Technical Specification

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui (pre-installed) |
| Routing | React Router DOM 7 |
| Charts | Chart.js 4 + react-chartjs-2 |
| QR Code | qrcode.react |
| PDF Export | jspdf + jspdf-autotable |
| Excel Export | xlsx (SheetJS) |
| Icons | Lucide React |
| State Management | React Context + localStorage |

## Dependencies

```
react-router-dom
chart.js
react-chartjs-2
qrcode.react
jspdf
jspdf-autotable
xlsx
lucide-react
clsx
tailwind-merge
```

## Project Structure

```
/mnt/agents/output/app/
├── public/
│   └── (static assets)
├── src/
│   ├── main.tsx                    # Entry point with Router
│   ├── App.tsx                     # Root layout + auth context
│   ├── index.css                   # Global styles + Tailwind
│   │
│   ├── context/
│   │   ├── AuthContext.tsx         # Authentication state (current user, login, logout)
│   │   └── DataContext.tsx         # All data state (shipments, drivers, clients, etc.)
│   │
│   ├── data/
│   │   ├── storage.ts              # localStorage CRUD operations
│   │   ├── demoData.ts             # Seed/demo data generator
│   │   └── pricing.ts              # Pricing logic and governorate data
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (User, Shipment, Driver, Client, etc.)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── Header.tsx          # Top header bar
│   │   │   ├── Layout.tsx          # Main layout wrapper
│   │   │   └── MobileNav.tsx       # Mobile bottom navigation
│   │   │
│   │   ├── common/
│   │   │   ├── StatCard.tsx        # Statistics card component
│   │   │   ├── DataTable.tsx       # Reusable data table
│   │   │   ├── Modal.tsx           # Reusable modal dialog
│   │   │   ├── Toast.tsx           # Toast notification
│   │   │   ├── StatusBadge.tsx     # Status badge component
│   │   │   ├── FormInput.tsx       # Styled form input
│   │   │   ├── FormSelect.tsx      # Styled select dropdown
│   │   │   ├── ConfirmDialog.tsx   # Confirmation dialog
│   │   │   └── ExportButton.tsx    # PDF/Excel export button
│   │   │
│   │   ├── charts/
│   │   │   ├── LineChart.tsx       # Line chart component
│   │   │   ├── PieChart.tsx        # Pie/doughnut chart
│   │   │   └── BarChart.tsx        # Bar chart component
│   │   │
│   │   └── shipment/
│   │       ├── ShipmentForm.tsx    # Add/edit shipment form
│   │       ├── ShipmentTimeline.tsx # Shipment tracking timeline
│   │       ├── QRCodeModal.tsx     # QR code display modal
│   │       └── QRScanner.tsx       # QR scanner (simulated)
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx           # Login page (shared for all roles)
│   │   ├── admin/
│   │   │   ├── DashboardPage.tsx   # Admin overview dashboard
│   │   │   ├── ShipmentsPage.tsx   # Shipments management
│   │   │   ├── DriversPage.tsx     # Drivers management
│   │   │   ├── ClientsPage.tsx     # Clients management
│   │   │   ├── StatusesPage.tsx    # Shipment statuses management
│   │   │   ├── CalculatorPage.tsx  # Shipping calculator
│   │   │   ├── ReportsPage.tsx     # Reports & analytics
│   │   │   └── LinksPage.tsx       # External links management
│   │   │
│   │   ├── driver/
│   │   │   ├── DriverDashboard.tsx # Driver overview
│   │   │   ├── MyShipments.tsx     # Assigned shipments list
│   │   │   ├── NewShipment.tsx     # Create new shipment
│   │   │   ├── QRScanPage.tsx      # QR code scanner
│   │   │   └── Notifications.tsx   # Driver notifications
│   │   │
│   │   └── client/
│   │       ├── ClientDashboard.tsx # Client overview
│   │       ├── MyShipments.tsx     # Client's shipments
│   │       ├── TrackShipment.tsx   # Track shipment by tracking number
│   │       ├── CalculatorPage.tsx  # Shipping calculator
│   │       ├── HistoryPage.tsx     # Shipment history
│   │       └── NewShipment.tsx     # Request new shipment
│   │
│   └── hooks/
│       ├── useAuth.ts              # Authentication hook
│       ├── useData.ts              # Data access hook
│       ├── useLocalStorage.ts      # localStorage hook
│       └── useToast.ts             # Toast notification hook
```

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In real app: hashed
  role: 'admin' | 'driver' | 'client';
  phone: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}
```

### Shipment
```typescript
interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderId?: string; // client ID if from client
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  governorate: string;
  weight: number;
  notes?: string;
  status: string; // status ID
  statusHistory: StatusUpdate[];
  driverId?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface StatusUpdate {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy: string; // user ID
}
```

### Driver
```typescript
interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  shipmentsCount: number;
  completedCount: number;
}
```

### Client
```typescript
interface Client {
  id: string;
  userId: string;
  name: string;
  storeName?: string;
  phone: string;
  email: string;
  isActive: boolean;
  shipmentsCount: number;
}
```

### ShipmentStatus
```typescript
interface ShipmentStatus {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  description?: string;
  isDefault: boolean;
  order: number;
}
```

### ExternalLink
```typescript
interface ExternalLink {
  id: string;
  name: string;
  url: string;
  icon: string; // lucide icon name
  position: 'sidebar' | 'header' | 'footer';
  isActive: boolean;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  userId?: string; // specific user or all
  role?: 'admin' | 'driver' | 'client';
  createdAt: string;
}
```

## localStorage Schema

| Key | Type | Description |
|-----|------|-------------|
| `fd_users` | User[] | All users |
| `fd_shipments` | Shipment[] | All shipments |
| `fd_drivers` | Driver[] | All drivers |
| `fd_clients` | Client[] | All clients |
| `fd_statuses` | ShipmentStatus[] | Shipment statuses |
| `fd_links` | ExternalLink[] | External links |
| `fd_notifications` | Notification[] | All notifications |
| `fd_currentUser` | User \| null | Currently logged in user |
| `fd_activities` | Activity[] | Activity log |

## Routing Structure

| Path | Page | Access |
|------|------|--------|
| `/login` | LoginPage | Public |
| `/admin` | DashboardPage | Admin |
| `/admin/shipments` | ShipmentsPage | Admin |
| `/admin/drivers` | DriversPage | Admin |
| `/admin/clients` | ClientsPage | Admin |
| `/admin/statuses` | StatusesPage | Admin |
| `/admin/calculator` | CalculatorPage | Admin |
| `/admin/reports` | ReportsPage | Admin |
| `/admin/links` | LinksPage | Admin |
| `/driver` | DriverDashboard | Driver |
| `/driver/shipments` | MyShipments (driver) | Driver |
| `/driver/new` | NewShipment (driver) | Driver |
| `/driver/scan` | QRScanPage | Driver |
| `/driver/notifications` | Notifications | Driver |
| `/client` | ClientDashboard | Client |
| `/client/shipments` | MyShipments (client) | Client |
| `/client/track` | TrackShipment | Client |
| `/client/calculator` | CalculatorPage | Client |
| `/client/history` | HistoryPage | Client |
| `/client/new` | NewShipment (client) | Client |

## Authentication Flow

1. User visits `/login`
2. Enters email + password
3. App checks against `fd_users` in localStorage
4. If valid: saves user to `fd_currentUser` + AuthContext
5. Redirect based on role: `/admin`, `/driver`, or `/client`
6. On app load: checks `fd_currentUser` for auto-login
7. Logout: clears `fd_currentUser` + redirects to `/login`

## Role-Based Access

Implemented via route guards in App.tsx:
- Check `currentUser.role` against route prefix
- Redirect to login if not authenticated
- Redirect to correct dashboard if accessing wrong role routes

## Key Implementation Notes

1. **localStorage Service**: All CRUD operations go through `storage.ts` which reads/writes to localStorage with JSON serialization

2. **Demo Data**: On first load (if no data exists), `demoData.ts` seeds localStorage with sample users, shipments, drivers, clients, and statuses

3. **Charts**: Use react-chartjs-2 with Chart.js. Register required Chart.js components in a setup file

4. **PDF Export**: Use jspdf + jspdf-autotable for table exports. Right-to-left text support via custom font

5. **Excel Export**: Use xlsx library to create workbooks from data arrays

6. **QR Code**: Use qrcode.react to generate QR codes containing the tracking number

7. **QR Scanner**: Simulated with input field for tracking number (true camera scanning requires additional permissions/APIs)

8. **Responsive**: Use Tailwind breakpoints: `sm:640px`, `md:768px`, `lg:1024px`. Sidebar hidden on mobile, shown as drawer

9. **Dark Mode**: Single dark theme (no toggle). All colors are dark-mode optimized

10. **Form Validation**: Client-side validation with required fields, phone format, email format

11. **Notifications**: Toast system with auto-dismiss after 3 seconds. Support info/success/warning/error types

12. **Status Workflow**: Shipment statuses follow a defined flow. Status history tracked for each shipment

13. **Pricing Calculator**: Base price per governorate + weight-based fee + service type multiplier

14. **Tracking Timeline**: Visual step-by-step display of shipment journey with timestamps
