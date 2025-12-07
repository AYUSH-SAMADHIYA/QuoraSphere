import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
  Filter,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import AddJobModal from "../components/AddJobModal";
import JobDetailsModal from "../components/JobDetailsModal";

export default function Placement() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    remote: "",
    ctc: "",
    tags: "",
    year: "",
  });

  // Modals
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  // Fetch jobs
  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (filters.location) params.append("location", filters.location);
      if (filters.remote !== "") params.append("remote", filters.remote);
      if (filters.ctc) params.append("ctc", filters.ctc);
      if (filters.tags) params.append("tags", filters.tags);
      if (filters.year) params.append("year", filters.year);

      const res = await fetch(`http://localhost:5000/api/jobs?${params}`);
      const data = await res.json();

      if (res.ok) {
        setJobs(data.jobs || []);
        setPagination(data.pagination || pagination);
      } else {
        toast.error(data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      toast.error("Error loading jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [filters, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      remote: "",
      ctc: "",
      tags: "",
      year: "",
    });
    setSearchQuery("");
  };

  const handleJobClick = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedJob(data);
        setShowJobDetails(true);
      } else {
        toast.error("Failed to load job details");
      }
    } catch (err) {
      toast.error("Error loading job details");
    }
  };

  const handleJobAdded = () => {
    setShowAddJobModal(false);
    fetchJobs(pagination.currentPage);
    toast.success("Job posted successfully!");
  };

  const hasActiveFilters =
    filters.location ||
    filters.remote !== "" ||
    filters.ctc ||
    filters.tags ||
    filters.year ||
    searchQuery;

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
                <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Placement Board
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Find your dream job opportunity
              </p>
            </div>
            {user?.isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddJobModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
              >
                <Plus size={20} />
                Add Job
              </motion.button>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, company, or keywords..."
              className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 pl-12 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </form>
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
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    placeholder="e.g., Bangalore, Mumbai"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Remote/On-site Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Work Type
                  </label>
                  <select
                    value={filters.remote}
                    onChange={(e) => handleFilterChange("remote", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
                  </select>
                </div>

                {/* CTC Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    CTC Range
                  </label>
                  <input
                    type="text"
                    value={filters.ctc}
                    onChange={(e) => handleFilterChange("ctc", e.target.value)}
                    placeholder="e.g., 5-10, 10+"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={filters.tags}
                    onChange={(e) => handleFilterChange("tags", e.target.value)}
                    placeholder="e.g., React, Node.js, Python"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Year Eligibility Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Eligible Year
                  </label>
                  <input
                    type="text"
                    value={filters.year}
                    onChange={(e) => handleFilterChange("year", e.target.value)}
                    placeholder="e.g., 2024, 2025"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Job Cards */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No jobs found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {jobs.length} of {pagination.totalJobs} jobs
                </div>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleJobClick(job._id)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                          </div>
                          {job.company && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                              <Building2 size={16} />
                              <span className="font-medium">{job.company}</span>
                            </div>
                          )}
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>
                                {job.location} {job.isRemote && "(Remote)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={16} />
                              <span>{job.ctc}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.tags.slice(0, 5).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => fetchJobs(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => fetchJobs(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      {showAddJobModal && (
        <AddJobModal
          onClose={() => setShowAddJobModal(false)}
          onSuccess={handleJobAdded}
          token={token}
        />
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => {
            setShowJobDetails(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
