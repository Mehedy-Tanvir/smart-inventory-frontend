import { Link, useLocation } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBox,
  FiClipboard,
  FiRefreshCw,
  FiActivity,
} from "react-icons/fi";

const menuItems = [
  { label: "Dashboard", icon: <FiHome />, path: "/" },
  { label: "Products & Categories", icon: <FiBox />, path: "/products" },
  { label: "Orders", icon: <FiClipboard />, path: "/orders" },
  { label: "Restock", icon: <FiRefreshCw />, path: "/restock" },
  { label: "Activity Log", icon: <FiActivity />, path: "/activity" },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile Hamburger Button - top right */}
      <div className="lg:hidden bg-white fixed top-1 right-[2px] z-50">
        <button
          className="p-2 text-gray-700 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar for mobile/fullscreen overlay */}
      <div
        className={`fixed inset-0 z-40 lg:static lg:translate-x-0 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-white lg:bg-transparent`}
      >
        <div className="flex flex-col h-full lg:h-auto lg:w-64 shadow-lg lg:shadow-none">
          <div className="px-6 py-4 text-xl font-bold border-b lg:border-none">
            Smart Inventory
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 lg:px-2 lg:py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors
                  ${location.pathname === item.path ? "bg-gray-200 font-semibold" : ""}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed right-1 inset-0 z-30 bg-black bg-opacity-25 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
