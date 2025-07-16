import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AskQuestion from "./pages/AskQuestion";
import PrivateRoute from "./components/PrivateRoute";
import QuestionDetail from './pages/QuestionDetail';
import Search from './pages/Search';
import Profile from "./pages/Profile";
import EditQuestion from "./pages/EditQuestion";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Admin Dashboard page
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Navbar />

          {/* ✅ Toast Notification Container */}
          <Toaster 
            position="top-right" 
            richColors 
            expand={true}
            closeButton={true}
            toastOptions={{
              style: { fontSize: '0.9rem' },
              duration: 3000,
            }}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/question/:id" element={<QuestionDetail />} />

            <Route
              path="/ask"
              element={
                <PrivateRoute>
                  <AskQuestion />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <EditQuestion />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
