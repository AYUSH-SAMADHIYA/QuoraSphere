import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Loader, Pencil, Trash2 } from "lucide-react";

function Profile() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user questions:", err);
        setLoading(false);
      });
  }, [token]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this question?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } else {
      alert(data.message || "Server error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">My Questions</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin text-blue-500 w-6 h-6" />
          <span className="ml-2 text-gray-500 dark:text-gray-300">Loading...</span>
        </div>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">You haven't asked any questions yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div key={q._id} className="border p-5 rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <Link
                to={`/question/${q._id}`}
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {q.title}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {q.description?.length > 150 ? `${q.description.slice(0, 150)}...` : q.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/edit/${q._id}`}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm gap-1"
                >
                  <Pencil size={16} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="flex items-center text-red-600 dark:text-red-400 hover:underline text-sm gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
