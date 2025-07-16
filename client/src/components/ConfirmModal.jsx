import { motion, AnimatePresence } from "framer-motion";

function ConfirmModal({ show, onClose, onConfirm, message = "Are you sure?" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{message}</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:text-white hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
