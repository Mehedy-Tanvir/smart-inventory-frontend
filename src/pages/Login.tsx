import { useState } from "react";
import { useLogin } from "../features/auth/useLogin";

export default function Login() {
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("123456");
    login({ email: "demo@example.com", password: "123456" });
  };

  return (
    <div className="min-h-screen  flex items-start sm:items-center justify-center bg-gray-100 px-4 pt-16 sm:pt-0">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-6 mb-6 sm:mt-0">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent 
              transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent 
              transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isPending || !email || !password}
            className={`
    w-full py-2.5 rounded-lg font-medium text-white
    transition-all duration-200

    ${
      isPending || !email || !password
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black hover:bg-gray-900 hover:shadow-md hover:-translate-y-[1px] cursor-pointer"
    }

    active:scale-[0.98]
  `}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Demo Button */}
        <button
          onClick={handleDemoLogin}
          className="w-full cursor-pointer border border-gray-300 py-2.5 rounded-lg text-sm font-medium 
          transition-all duration-200
          hover:bg-gray-50 hover:shadow-sm hover:-translate-y-[1px]
          active:scale-[0.98]"
        >
          Use Demo Account
        </button>
      </div>
    </div>
  );
}
