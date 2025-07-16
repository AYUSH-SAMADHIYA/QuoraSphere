import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        window.location.href = "/";
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-300 mb-6">
          Log in to continue learning and sharing.
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
          <a href="#" className="hover:underline">Forgot password?</a>
          <a href="/register" className="hover:underline text-blue-600 dark:text-blue-400">
            Don't have an account?
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
