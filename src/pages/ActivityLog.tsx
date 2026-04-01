import { useEffect, useState } from "react";
import instance from "../services/api";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Truck,
  RefreshCw,
} from "lucide-react";

interface Activity {
  _id: string;
  message: string;
  createdAt: string;
}

export default function ActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/activity?limit=10");
      setActivities(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIcon = (message: string) => {
    if (message.includes("Order")) return <ShoppingCart size={18} />;
    if (message.includes("Stock")) return <Package size={18} />;
    if (message.includes("Restock")) return <RefreshCw size={18} />;
    if (message.includes("Shipped")) return <Truck size={18} />;
    return <AlertTriangle size={18} />;
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Activity Log
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Recent system actions
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No recent activity found
          </div>
        ) : (
          <div className="max-h-[60vh] md:max-h-[420px] overflow-y-auto">
            {activities.map((activity, index) => (
              <div
                key={activity._id}
                className={`px-4 sm:px-5 py-3 sm:py-4 transition hover:bg-gray-50
                ${
                  index !== activities.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                {/* Mobile Layout */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-2">
                  {/* Top row (icon + time on mobile) */}
                  <div className="flex items-center justify-between sm:block">
                    {/* Icon */}
                    <div className="text-gray-600 flex items-center gap-2">
                      <span className="sm:mt-1">
                        {getIcon(activity.message)}
                      </span>

                      {/* Show small label on mobile */}
                      <span className="text-xs text-gray-400 sm:hidden">
                        Activity
                      </span>
                    </div>

                    {/* Time (mobile) */}
                    <div className="text-[11px] text-gray-400 sm:hidden">
                      {formatTime(activity.createdAt)}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {activity.message}
                    </p>
                  </div>

                  {/* Time (tablet + desktop) */}
                  <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
                    {formatTime(activity.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
