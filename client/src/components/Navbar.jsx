import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
    }
  };

  const handleAdminClick = () => {
    if (user?.isAdmin) {
      navigate("/admin");
    } else {
      toast.error("You are not admin");
    }
  };

  return (
    <nav className="bg-white dark:bg-[#121212] shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight"
        >
          QuoraSphere
        </Link>

        <div className="flex gap-4 items-center text-sm font-medium text-gray-800 dark:text-gray-100">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-300">Home</Link>
          <Link to="/ask" className="hover:text-blue-600 dark:hover:text-blue-300">Ask</Link>
          <Link to="/search" className="hover:text-blue-600 dark:hover:text-blue-300">Search</Link>
          <Link to="/profile" className="hover:text-blue-600 dark:hover:text-blue-300">Profile</Link>

          <button
            onClick={handleAdminClick}
            className="hover:text-blue-600 dark:hover:text-blue-300"
          >
            Admin
          </button>

          <button
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="px-2 py-1 rounded text-sm bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            🌙
          </button>

          {user ? (
            <button onClick={logout} className="text-red-600 dark:text-red-400 hover:underline">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-300">Login</Link>
              <Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
