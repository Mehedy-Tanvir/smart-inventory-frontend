import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Restock from "../pages/Restock";
import Layout from "../components/Layout";
import ActivityLog from "../pages/ActivityLog";

export const router = createBrowserRouter([
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: "/products",
    element: (
      <Layout>
        <Products />
      </Layout>
    ),
  },
  {
    path: "/orders",
    element: (
      <Layout>
        <Orders />
      </Layout>
    ),
  },
  {
    path: "/restock",
    element: (
      <Layout>
        <Restock />
      </Layout>
    ),
  },
  {
    path: "/restock",
    element: (
      <Layout>
        <Restock />
      </Layout>
    ),
  },
  {
    path: "/activity",
    element: (
      <Layout>
        <ActivityLog />
      </Layout>
    ),
  },
]);
