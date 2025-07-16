import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

const Register = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email address";
    }
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
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
          Create an Account
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-300 mb-6">
          Join our knowledge-sharing community today.
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <div className="relative">
              <User className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 rounded border focus:outline-none dark:bg-gray-800 dark:text-white ${
                  fieldErrors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>

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
                className={`w-full pl-10 pr-3 py-2 rounded border focus:outline-none dark:bg-gray-800 dark:text-white ${
                  fieldErrors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
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
                className={`w-full pl-10 pr-3 py-2 rounded border focus:outline-none dark:bg-gray-800 dark:text-white ${
                  fieldErrors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
