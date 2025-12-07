import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Linkedin,
  Phone,
  Filter,
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import AddMentorModal from "../components/AddMentorModal";
import EditMentorModal from "../components/EditMentorModal";
import ConfirmModal from "../components/ConfirmModal";

export default function Mentors() {
  const { user, token } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    roleNumber: "",
    domain: "",
    careerGoal: "",
    experience: "",
    mentoringStyle: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [deletingMentor, setDeletingMentor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch mentors
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.roleNumber) params.append("roleNumber", filters.roleNumber);
      if (filters.domain) params.append("domain", filters.domain);
      if (filters.careerGoal) params.append("careerGoal", filters.careerGoal);
      if (filters.experience) params.append("experience", filters.experience);
      if (filters.mentoringStyle)
        params.append("mentoringStyle", filters.mentoringStyle);

      const res = await fetch(
        `http://localhost:5000/api/mentors?${params.toString()}`
      );
      const data = await res.json();

      if (res.ok) {
        setMentors(data);
      } else {
        toast.error(data.message || "Failed to fetch mentors");
      }
    } catch (err) {
      toast.error("Error loading mentors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      roleNumber: "",
      domain: "",
      careerGoal: "",
      experience: "",
      mentoringStyle: "",
    });
  };

  const handleSelectMentor = async (mentorId) => {
    if (!token) {
      toast.error("Please login to select a mentor");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/mentors/${mentorId}/select`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Mentor selected successfully!");
        fetchMentors();
      } else {
        toast.error(data.message || "Failed to select mentor");
      }
    } catch (err) {
      toast.error("Error selecting mentor");
      console.error(err);
    }
  };

  const handleDeleteMentor = async () => {
    if (!deletingMentor) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/mentors/${deletingMentor._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Mentor deleted successfully");
        setShowDeleteModal(false);
        setDeletingMentor(null);
        fetchMentors();
      } else {
        toast.error(data.message || "Failed to delete mentor");
      }
    } catch (err) {
      toast.error("Error deleting mentor");
      console.error(err);
    }
  };

  const handleMentorAdded = () => {
    setShowAddModal(false);
    fetchMentors();
  };

  const handleMentorUpdated = () => {
    setEditingMentor(null);
    fetchMentors();
  };

  // Get unique values for filter dropdowns
  const uniqueDomains = [
    ...new Set(mentors.map((m) => m.domain)),
  ].sort();
  const uniqueCareerGoals = [
    ...new Set(mentors.map((m) => m.careerGoal)),
  ].sort();
  const uniqueExperiences = [
    ...new Set(mentors.map((m) => m.experience)),
  ].sort();
  const uniqueMentoringStyles = [
    ...new Set(mentors.map((m) => m.mentoringStyle)),
  ].sort();

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Mentors
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Find and connect with your ideal mentor
              </p>
            </div>
            {user?.isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
              >
                <Plus size={20} />
                Add Mentor
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <X size={16} />
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Role Number Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role Number
                  </label>
                  <input
                    type="text"
                    value={filters.roleNumber}
                    onChange={(e) =>
                      handleFilterChange("roleNumber", e.target.value)
                    }
                    placeholder="e.g., R001"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Domain Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <select
                    value={filters.domain}
                    onChange={(e) => handleFilterChange("domain", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Domains</option>
                    {uniqueDomains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Career Goal Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Career Goal
                  </label>
                  <select
                    value={filters.careerGoal}
                    onChange={(e) =>
                      handleFilterChange("careerGoal", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Career Goals</option>
                    {uniqueCareerGoals.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) =>
                      handleFilterChange("experience", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Experience Levels</option>
                    {uniqueExperiences.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mentoring Style Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mentoring Style
                  </label>
                  <select
                    value={filters.mentoringStyle}
                    onChange={(e) =>
                      handleFilterChange("mentoringStyle", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Styles</option>
                    {uniqueMentoringStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Mentor Cards */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading mentors...
                </p>
              </div>
            ) : mentors.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No mentors found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {mentors.length} mentor{mentors.length !== 1 ? "s" : ""}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentors.map((mentor, index) => (
                <motion.div
                  key={mentor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Role: {mentor.roleNumber}
                      </p>
                    </div>
                    {user?.isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingMentor(mentor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingMentor(mentor);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">
                        Domain:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">
                        {mentor.domain}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">
                        Experience:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">
                        {mentor.experience}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">
                        Career Goal:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">
                        {mentor.careerGoal}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">
                        Style:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">
                        {mentor.mentoringStyle}
                      </span>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="flex gap-2 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={`mailto:${mentor.email}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                    {mentor.linkedIn && (
                      <a
                        href={mentor.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm"
                      >
                        <Linkedin size={16} />
                        LinkedIn
                      </a>
                    )}
                    <a
                      href={`tel:${mentor.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm"
                    >
                      <Phone size={16} />
                      Phone
                    </a>
                  </div>

                  {/* Select Mentor Button (Students only) */}
                  {!user?.isAdmin && (
                    <button
                      onClick={() => handleSelectMentor(mentor._id)}
                      disabled={!!mentor.selectedBy}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                        mentor.selectedBy
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {mentor.selectedBy ? (
                        <>
                          <CheckCircle size={18} />
                          Already Selected
                        </>
                      ) : (
                        "Select Mentor"
                      )}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Mentor Modal */}
      {showAddModal && (
        <AddMentorModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleMentorAdded}
          token={token}
        />
      )}

      {/* Edit Mentor Modal */}
      {editingMentor && (
        <EditMentorModal
          mentor={editingMentor}
          onClose={() => setEditingMentor(null)}
          onSuccess={handleMentorUpdated}
          token={token}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingMentor && (
        <ConfirmModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingMentor(null);
          }}
          onConfirm={handleDeleteMentor}
          message={`Are you sure you want to delete ${deletingMentor.name}?`}
        />
      )}
    </div>
  );
}

