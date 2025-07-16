import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  MessageSquare,
  Image,
  X,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "sonner";

function QuestionDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [targetAnswerId, setTargetAnswerId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchQuestionAndAnswers = async () => {
    try {
      const qRes = await fetch(`http://localhost:5000/api/questions/${id}`);
      const qData = await qRes.json();

      const aRes = await fetch(`http://localhost:5000/api/answers/${id}`);
      const aData = await aRes.json();

      setQuestion({ ...qData, answers: aData });

      const allComments = {};
      for (const answer of aData) {
        const res = await fetch(
          `http://localhost:5000/api/comments/${answer._id}`
        );
        const data = await res.json();
        allComments[answer._id] = data;
      }
      setComments(allComments);
    } catch (err) {
      console.error("❌ Error loading question or answers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim() && !imageFile && !imageUrl) {
      toast.error("Answer text or image is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", answerText);
      if (imageFile) formData.append("image", imageFile);
      else if (imageUrl) formData.append("imageUrl", imageUrl);

      const res = await fetch(`http://localhost:5000/api/answers/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setQuestion((prev) => ({
          ...prev,
          answers: [...(prev.answers || []), data],
        }));
        setAnswerText("");
        setImageFile(null);
        setImageUrl("");
        toast.success("Answer submitted successfully");
      } else toast.error(data.message || "Failed to submit answer");
    } catch {
      toast.error("Failed to submit answer");
    }
  };

  const handleVote = async (answerId, type) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/answers/${type}/${answerId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = await res.json();
      if (res.ok) {
        setQuestion((prev) => ({
          ...prev,
          answers: prev.answers.map((a) =>
            a._id === answerId ? updated : a
          ),
        }));
      } else {
        toast.error(updated.message || "Failed to vote");
      }
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleCommentSubmit = async (e, answerId) => {
    e.preventDefault();
    const text = commentInputs[answerId];
    if (!text?.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${answerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => ({
          ...prev,
          [answerId]: [...(prev[answerId] || []), data],
        }));
        setCommentInputs((prev) => ({ ...prev, [answerId]: "" }));
        toast.success("Comment posted");
      } else toast.error(data.message || "Failed to submit comment");
    } catch {
      toast.error("Failed to submit comment");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/answers/${answerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setQuestion((prev) => ({
          ...prev,
          answers: prev.answers.filter((a) => a._id !== answerId),
        }));
        toast.success("Answer deleted");
        setShowModal(false);
      } else toast.error("Unauthorized to delete answer");
    } catch {
      toast.error("Failed to delete answer");
    }
  };

  const handleDeleteComment = async (commentId, answerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return toast.error("Unauthorized to delete comment");

      setComments((prev) => ({
        ...prev,
        [answerId]: prev[answerId].filter((c) => c._id !== commentId),
      }));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleSort = (a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "mostUpvoted":
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      default:
        return 0;
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!question) return <p className="text-center mt-10">Question not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="border rounded p-4 bg-white dark:bg-gray-800 shadow">
          {question.photoUrl && (
            <motion.img
              src={question.photoUrl}
              alt="Question"
              className="w-full h-auto max-h-[300px] object-contain rounded mb-4"
              onClick={() => setPreviewImage(question.photoUrl)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
          <motion.h1 className="text-xl font-bold mb-2 dark:text-white">{question.title}</motion.h1>
          <p className="dark:text-gray-300">{question.description}</p>
        </div>

        <form onSubmit={handleAnswerSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <textarea
            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
            rows="4"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your answer..."
          />
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-1 cursor-pointer text-blue-600 dark:text-blue-400">
              <Image size={16} /> Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </label>
            {imageFile && <span className="text-sm text-green-600">{imageFile.name}</span>}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700 transition">
            Submit Answer
          </button>
        </form>
      </div>

      <div className="md:col-span-2">
        <div className="mb-4">
          <label className="font-medium mr-2">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostUpvoted">Most Upvoted</option>
          </select>
        </div>

        <h2 className="text-xl font-semibold mb-4 dark:text-white">Answers</h2>
        {question.answers?.length === 0 ? (
          <p className="dark:text-gray-400">No answers yet.</p>
        ) : (
          question.answers.sort(handleSort).map((a) => (
            <motion.div
              key={a._id}
              className="mb-6 border rounded p-4 bg-white dark:bg-gray-800 shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {a.imageUrl && (
                <div className="mb-3 cursor-pointer">
                  <img
                    src={a.imageUrl.startsWith("http") ? a.imageUrl : `http://localhost:5000${a.imageUrl}`}
                    alt="Answer"
                    className="w-full max-h-[300px] object-contain rounded"
                    onClick={() => setPreviewImage(a.imageUrl.startsWith("http") ? a.imageUrl : `http://localhost:5000${a.imageUrl}`)}
                  />
                </div>
              )}
              <p className="mb-2 dark:text-gray-100">{a.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Answered on {new Date(a.createdAt).toLocaleString()}</p>
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => handleVote(a._id, "upvote")}
                  className="text-green-600 flex gap-1 hover:scale-110 transition-transform"
                >
                  <ThumbsUp size={16} /> {a.upvotes?.length || 0}
                </button>
                <button
                  onClick={() => handleVote(a._id, "downvote")}
                  className="text-red-600 flex gap-1 hover:scale-110 transition-transform"
                >
                  <ThumbsDown size={16} /> {a.downvotes?.length || 0}
                </button>
                <button
                  onClick={() => {
                    setTargetAnswerId(a._id);
                    setShowModal(true);
                  }}
                  className="text-red-500 ml-auto flex gap-1 hover:underline"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-1 flex items-center gap-1 dark:text-white">
                  <MessageSquare size={16} /> Comments
                </h3>
                <form
                  onSubmit={(e) => handleCommentSubmit(e, a._id)}
                  className="flex gap-2 mt-1"
                >
                  <input
                    className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-white"
                    value={commentInputs[a._id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [a._id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment"
                  />
                  <button className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600 transition">
                    Post
                  </button>
                </form>
                {comments[a._id]?.length > 0 ? (
                  comments[a._id].map((c) => (
                    <div key={c._id} className="text-sm mt-2 flex justify-between dark:text-gray-200">
                      <span>{c.text}</span>
                      <button
                        onClick={() => handleDeleteComment(c._id, a._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 mt-2">No comments yet.</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDeleteAnswer(targetAnswerId)}
        message="Do you really want to delete this answer?"
      />

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-xl z-50"
            onClick={() => setPreviewImage(null)}
          >
            <X />
          </button>
          <motion.img
            src={previewImage}
            alt="Full View"
            className="max-w-full max-h-full rounded shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        </div>
      )}
    </div>
  );
}

export default QuestionDetail;
