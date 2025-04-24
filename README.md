# Pharmacy Management System Backend

A Node.js backend application for managing pharmacies in Sri Lanka, built with Express and MongoDB.

## Features

- User Authentication (Customers, Pharmacies, Admin)
- Pharmacy Registration and Approval System
- Order Management
- Order Status Tracking
- Role-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pharmacy-be
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pharmacy-management
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

4. Build the TypeScript files:

```bash
npm run build
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/auth/register/customer` - Register a new customer
- POST `/api/auth/register/pharmacy` - Register a new pharmacy
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Pharmacies

- GET `/api/pharmacies` - Get all verified pharmacies
- GET `/api/pharmacies/:id` - Get single pharmacy
- GET `/api/pharmacies/admin/pending` - Get pending pharmacy registrations (Admin only)
- PUT `/api/pharmacies/admin/approve/:id` - Approve pharmacy registration (Admin only)
- PUT `/api/pharmacies/:id` - Update pharmacy details (Pharmacy owner only)

### Orders

- POST `/api/orders` - Create a new order (Customer only)
- GET `/api/orders/my-orders` - Get all orders for current customer
- GET `/api/orders/pharmacy-orders` - Get all orders for current pharmacy
- GET `/api/orders/:id` - Get single order
- PUT `/api/orders/:id/status` - Update order status (Pharmacy only)
- PUT `/api/orders/:id/cancel` - Cancel order (Customer only)

## License

This project is licensed under the ISC License.
