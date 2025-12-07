import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                {job.title}
              </h2>
              {job.company && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Building2 size={18} />
                  <span className="font-medium">{job.company}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition ml-4"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin size={18} className="text-blue-600" />
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                  <p className="font-medium">
                    {job.location} {job.isRemote && "(Remote)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign size={18} className="text-green-600" />
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">CTC</span>
                  <p className="font-medium">{job.ctc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar size={18} className="text-purple-600" />
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Posted On</span>
                  <p className="font-medium">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {job.postedBy && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User size={18} className="text-orange-600" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Posted By</span>
                    <p className="font-medium">{job.postedBy.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Job Description
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {(job.eligibility?.year?.length > 0 ||
              job.eligibility?.branch?.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Eligibility
                </h3>
                <div className="space-y-2">
                  {job.eligibility.year && job.eligibility.year.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Eligible Years:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {job.eligibility.year.join(", ")}
                      </span>
                    </div>
                  )}
                  {job.eligibility.branch && job.eligibility.branch.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Eligible Branches:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {job.eligibility.branch.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

