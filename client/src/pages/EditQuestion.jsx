import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Pencil, FileText, ImageIcon } from "lucide-react";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPhotoUrl(data.photoUrl || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch question", err);
        setLoading(false);
      });
  }, [id]);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject("Failed to convert image");
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
      setPhotoUrl(""); // Clear manual URL if file selected
    } else {
      setPhotoFile(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let finalPhoto = photoUrl;
    if (photoFile) {
      try {
        finalPhoto = await convertFileToBase64(photoFile);
      } catch (err) {
        alert("Image processing error");
        console.error(err);
        return;
      }
    }

    const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, photoUrl: finalPhoto }),
    });

    if (res.ok) {
      navigate("/profile");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update question");
    }
  };

  if (loading) {
    return (
      <motion.p
        className="text-center mt-10 text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading...
      </motion.p>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Pencil className="text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold">Edit Question</h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="font-medium mb-1 flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Title
          </label>
          <input
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label className="font-medium mb-1 flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            Image Address (URL or Data URI)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste image address"
            value={photoUrl}
            onChange={(e) => {
              setPhotoUrl(e.target.value);
              setPhotoFile(null); // Clear file if URL manually entered
            }}
          />
        </div>

        {/* File Upload Option */}
       

        {/* Image Preview */}
        {(photoFile || photoUrl) && (
          <div className="mt-4">
            <p className="text-sm mb-1">Image Preview:</p>
            <img
              src={photoFile ? URL.createObjectURL(photoFile) : photoUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update
        </motion.button>
      </form>
    </motion.div>
  );
}

export default EditQuestion;
