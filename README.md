# Smart Inventory & Order Management System (Frontend)

A web application frontend for managing products, stock levels, customer orders, and fulfillment workflows. Built with React, TypeScript, and Tailwind CSS, it interacts with a Node.js/Express backend to provide a seamless inventory management experience.

## Live Demo

[View Live Application](https://your-frontend-vercel-link.vercel.app)

## Features

- **Authentication**
  - Signup and Login with email and password
  - Demo login with pre-filled credentials
  - Redirect to Dashboard upon login

- **Product & Category Management**
  - Create and view product categories
  - Add products with details:
    - Name, Category, Price, Stock Quantity, Minimum Stock Threshold, Status (Active / Out of Stock)

- **Order Management**
  - Create, update, cancel, and view orders
  - Auto-calculation of total price
  - Order statuses: Pending, Confirmed, Shipped, Delivered, Cancelled
  - Conflict detection for duplicate or inactive products

- **Stock & Restock**
  - Automatic stock deduction on confirmed orders
  - Automatic addition to Restock Queue when stock is low
  - Priority-based queue (High / Medium / Low)
  - Manual stock update and removal from queue

- **Dashboard & Analytics**
  - Overview of total orders today, revenue, pending vs completed orders
  - Low stock items summary
  - Simple analytics charts

- **Activity Log**
  - Tracks recent system actions (latest 5–10)
  - Example: Order creation, stock updates, restock queue actions

- **Search, Filter & Pagination**
  - Search and filter products or orders
  - Pagination for large datasets

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router, React Query, Zustand
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT Authentication, Zod Validation

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/mern-inventory-frontend.git
cd mern-inventory-frontend

```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Run Locally

```bash
npm run dev
# or
yarn dev
```

The app will run on http://localhost:5173 by default.

### Environment Variables

Create a .env file in the root directory with the following variables:

```
VITE_API_URL=https://your-backend.vercel.app
```

Replace the URL with your deployed backend API endpoint.
