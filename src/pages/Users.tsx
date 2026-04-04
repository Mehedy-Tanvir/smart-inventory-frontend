import { useEffect, useState } from "react";
import instance from "../services/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await instance.get("admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Promote manager → admin
  const handlePromote = async (userId: string) => {
    try {
      setPromotingId(userId);
      const token = localStorage.getItem("token");

      await instance.patch(
        `admin/users/${userId}/promote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("User promoted to admin");
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: "admin" } : user,
        ),
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to promote user");
    } finally {
      setPromotingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading users...</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Users Management
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Manage registered users and assign admin roles.
        </p>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 break-words">{user.email}</td>
                <td className="p-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full font-medium text-xs md:text-sm ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {user.role === "manager" ? (
                    <button
                      onClick={() => handlePromote(user.id)}
                      disabled={promotingId === user.id}
                      className="px-4 cursor-pointer py-1.5 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {promotingId === user.id ? "Promoting..." : "Make Admin"}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm md:text-base">
                      No action
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="p-6 text-center text-gray-500">No users found</div>
      )}
    </div>
  );
}
