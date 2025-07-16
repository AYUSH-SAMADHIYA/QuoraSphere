import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HelpCircle, FileText, Image } from "lucide-react";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const isValidImageUrl = (url) => {
    if (!url) return true;
    const isBase64 = url.startsWith("data:image/");
    const isImageUrl = /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(url);
    return isBase64 || isImageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!isValidImageUrl(photoUrl)) {
      alert("Please enter a valid image URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, photoUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/question/${data._id}`);
      } else {
        alert(data.message || "Error submitting question");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-4"
    >
      {/* Gradient Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="w-7 h-7" />
          Ask a Question
        </h1>
        <p className="text-sm mt-1">
          Let the community help you solve your doubt!
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border dark:border-gray-700">
        {/* Tips Box */}
        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 p-4 rounded text-sm text-gray-700 dark:text-gray-300 mb-6">
          <p className="font-medium mb-1">Tips for asking a good question:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Be specific and clear in your title</li>
            <li>Provide enough context in the description</li>
            <li>You can optionally attach a relevant image</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="font-medium mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="What do you want to ask?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context"
            />
          </div>

          {/* Image via URL */}
          <div>
            <label className="font-medium mb-1 flex items-center gap-1">
              <Image className="w-4 h-4" />
              Optional Image URL
            </label>
            <input
              type="url"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2"
              placeholder="Paste image address"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Image Preview */}
          {photoUrl && (
            <div className="mt-4">
              <p className="text-sm mb-1">Your Image:</p>
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain border rounded"
              />
            </div>
          )}

          {/* Live Preview */}
          {(title || description) && (
            <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Preview:</h2>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{description}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 text-white px-6 py-2 rounded-lg shadow flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Question"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default AskQuestion;
