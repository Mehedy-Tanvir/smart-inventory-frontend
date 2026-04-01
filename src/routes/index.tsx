import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Restock from "../pages/Restock";
import Layout from "../components/Layout";
import ActivityLog from "../pages/ActivityLog";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <Layout>
          <Products />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <Layout>
          <Orders />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/restock",
    element: (
      <ProtectedRoute>
        <Layout>
          <Restock />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/activity",
    element: (
      <ProtectedRoute>
        <Layout>
          <ActivityLog />
        </Layout>
      </ProtectedRoute>
    ),
  },

  // Default fallback
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
