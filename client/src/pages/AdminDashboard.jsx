import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Trash2, ChevronDown, ChevronUp,
  Search, Users, HelpCircle, MessageSquare, Pencil
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [searchUser, setSearchUser] = useState("");
  const [searchQuestion, setSearchQuestion] = useState("");

  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error("You are not admin!");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [userRes, questionRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/questions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const usersData = await userRes.json();
        const questionsData = await questionRes.json();
        setUsers(usersData);
        setQuestions(questionsData);
      } catch {
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) fetchAdminData();
  }, [token, user]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all their content?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted");
      } else toast.error("Failed to delete user");
    } catch {
      toast.error("Server error");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete this question? This will also delete all its answers and comments.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/question/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q._id !== id));
        toast.success("Question deleted");
      } else toast.error("Failed to delete question");
    } catch {
      toast.error("Server error");
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/answer/${answerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: prev[questionId].filter((a) => a._id !== answerId),
        }));
        toast.success("Answer deleted");
      } else toast.error("Failed to delete answer");
    } catch {
      toast.error("Server error");
    }
  };

  const handleDeleteComment = async (questionId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setComments((prev) => ({
          ...prev,
          [questionId]: prev[questionId].filter((c) => c._id !== commentId),
        }));
        toast.success("Comment deleted");
      } else toast.error("Failed to delete comment");
    } catch {
      toast.error("Server error");
    }
  };

  const toggleExpand = async (questionId) => {
    if (expanded[questionId]) {
      setExpanded((prev) => ({ ...prev, [questionId]: false }));
      return;
    }

    try {
      const [aRes, cRes] = await Promise.all([
        fetch(`http://localhost:5000/api/admin/question/${questionId}/answers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/admin/question/${questionId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!aRes.ok || !cRes.ok) throw new Error();

      const aData = await aRes.json();
      const cData = await cRes.json();

      setAnswers((prev) => ({ ...prev, [questionId]: aData }));
      setComments((prev) => ({ ...prev, [questionId]: cData }));
      setExpanded((prev) => ({ ...prev, [questionId]: true }));
    } catch {
      toast.error("Failed to load details");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuestion.toLowerCase()) ||
    q.user?.name?.toLowerCase().includes(searchQuestion.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-20 text-gray-500 dark:text-gray-400">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-[95%] xl:max-w-[90%] mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <DashboardSection
          title="Manage Users"
          icon={<Users />}
          search={{
            value: searchUser,
            onChange: (e) => setSearchUser(e.target.value),
            placeholder: "Search by name or email..."
          }}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <UserItem key={u._id} user={u} onDelete={handleDeleteUser} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No users found.</p>
          )}
        </DashboardSection>

        <DashboardSection
          title="Manage Questions"
          icon={<HelpCircle />}
          search={{
            value: searchQuestion,
            onChange: (e) => setSearchQuestion(e.target.value),
            placeholder: "Search questions or authors..."
          }}
        >
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <QuestionItem
                key={q._id}
                question={q}
                isExpanded={expanded[q._id]}
                onToggleExpand={() => toggleExpand(q._id)}
                onDelete={handleDeleteQuestion}
                answers={answers[q._id]}
                comments={comments[q._id]}
                onDeleteAnswer={handleDeleteAnswer}
                onDeleteComment={handleDeleteComment}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No questions found.</p>
          )}
        </DashboardSection>
      </div>
    </div>
  );
}

const DashboardSection = ({ title, icon, search, children }) => (
  <section>
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {icon} {title}
      </h2>
      <SearchInput {...search} />
    </div>
    <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md overflow-hidden">
      {children}
    </div>
  </section>
);

const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative w-full sm:w-auto">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 dark:text-white transition-all"
    />
  </div>
);

const UserItem = ({ user, onDelete }) => (
  <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.isAdmin ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
        {user.isAdmin ? "Admin" : "User"}
      </span>
      {!user.isAdmin && (
        <button onClick={() => onDelete(user._id)} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
          <Trash2 size={18} />
        </button>
      )}
    </div>
  </div>
);

const QuestionItem = ({ question, isExpanded, onToggleExpand, onDelete, answers, comments, onDeleteAnswer, onDeleteComment }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={onToggleExpand}>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white">{question.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">by {question.user?.name || "Unknown"}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(question._id); }} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
        >
          <div className="px-6 py-4 space-y-4">
            <ExpandableContentSection
              title="Answers"
              icon={<Pencil size={16} />}
              data={answers}
              type="answer"
              onDelete={(id) => onDeleteAnswer(question._id, id)}
            />
            <ExpandableContentSection
              title="Comments"
              icon={<MessageSquare size={16} />}
              data={comments}
              type="comment"
              onDelete={(id) => onDeleteComment(question._id, id)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ExpandableContentSection = ({ title, icon, data, type, onDelete }) => (
  <div>
    <p className="font-semibold mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
      {icon}{title} ({data?.length || 0})
    </p>
    <div className="space-y-2">
      {data?.length > 0 ? data.map((item) => (
        <div key={item._id} className={`flex justify-between items-start pl-4 py-2 rounded-md bg-white dark:bg-gray-800 border-l-4 ${type === 'answer' ? 'border-blue-500' : 'border-yellow-500'}`}>
          <div className="text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.user?.name || item.answeredBy?.name}</p>
            <p className="text-gray-600 dark:text-gray-400">{item.content || item.text}</p>
          </div>
          <button onClick={() => onDelete(item._id)} className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors ml-4 flex-shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      )) : <p className="text-sm text-gray-500 dark:text-gray-400 pl-4">No {type}s yet.</p>}
    </div>
  </div>
);
