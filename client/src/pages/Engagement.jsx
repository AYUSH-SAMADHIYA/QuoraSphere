import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Filter,
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import AddEngagementQuestionModal from "../components/AddEngagementQuestionModal";
import EditEngagementQuestionModal from "../components/EditEngagementQuestionModal";
import ConfirmModal from "../components/ConfirmModal";

export default function Engagement() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("feed"); // "feed" or "test"
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "aptitude", "reasoning", "coding"
  const [showAnswers, setShowAnswers] = useState({});

  // Test Mode State
  const [testMode, setTestMode] = useState(false);
  const [testCategory, setTestCategory] = useState("aptitude");
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // Admin Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch questions for feed
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("category", filter);
      }

      const res = await fetch(
        `http://localhost:5000/api/engagement/questions?${params.toString()}`
      );
      const data = await res.json();

      if (res.ok) {
        // Shuffle questions for random order
        const shuffled = [...(data.questions || [])].sort(
          () => Math.random() - 0.5
        );
        setQuestions(shuffled);
      } else {
        toast.error(data.message || "Failed to fetch questions");
      }
    } catch (err) {
      toast.error("Error loading questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "feed") {
      fetchQuestions();
    }
  }, [filter, activeTab]);

  // Start Test
  const startTest = async () => {
    setTestLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/engagement/questions/test?category=${testCategory}&limit=10`
      );
      const data = await res.json();

      if (res.ok) {
        setTestQuestions(data);
        setTestAnswers({});
        setTestSubmitted(false);
        setTestResults(null);
        setTestMode(true);
      } else {
        toast.error("Failed to load test questions");
      }
    } catch (err) {
      toast.error("Error starting test");
      console.error(err);
    } finally {
      setTestLoading(false);
    }
  };

  // Submit Test
  const submitTest = () => {
    let correct = 0;
    let incorrect = 0;
    const results = testQuestions.map((q) => {
      const selectedAnswer = testAnswers[q._id];
      const isCorrect = selectedAnswer === q.correctOption;
      if (isCorrect) correct++;
      else incorrect++;

      return {
        question: q,
        selectedAnswer,
        isCorrect,
      };
    });

    setTestResults({
      correct,
      incorrect,
      total: testQuestions.length,
      score: Math.round((correct / testQuestions.length) * 100),
      results,
    });
    setTestSubmitted(true);
  };

  // Reset Test
  const resetTest = () => {
    setTestMode(false);
    setTestQuestions([]);
    setTestAnswers({});
    setTestSubmitted(false);
    setTestResults(null);
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/engagement/questions/${deletingQuestion._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Question deleted successfully");
        setShowDeleteModal(false);
        setDeletingQuestion(null);
        fetchQuestions();
      } else {
        toast.error(data.message || "Failed to delete question");
      }
    } catch (err) {
      toast.error("Error deleting question");
      console.error(err);
    }
  };

  const handleQuestionAdded = () => {
    setShowAddModal(false);
    fetchQuestions();
  };

  const handleQuestionUpdated = () => {
    setEditingQuestion(null);
    fetchQuestions();
  };

  const toggleAnswer = (questionId) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

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
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Engagement & Practice
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Learn through questions and test your skills
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
                Add Question
              </motion.button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setActiveTab("feed");
                resetTest();
              }}
              className={`px-4 py-2 font-medium transition ${
                activeTab === "feed"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Learning Feed
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`px-4 py-2 font-medium transition ${
                activeTab === "test"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Test Mode
            </button>
          </div>
        </motion.div>

        {/* Learning Feed Tab */}
        {activeTab === "feed" && (
          <div>
            {/* Filters */}
            <div className="mb-6 flex items-center gap-4">
              <Filter className="text-gray-600 dark:text-gray-400" size={20} />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("aptitude")}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === "aptitude"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Aptitude
                </button>
                <button
                  onClick={() => setFilter("reasoning")}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === "reasoning"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Reasoning
                </button>
                <button
                  onClick={() => setFilter("coding")}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === "coding"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Coding
                </button>
              </div>
            </div>

            {/* Questions Feed */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading questions...
                </p>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No questions found. Try adjusting your filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <motion.div
                    key={question._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              question.category === "aptitude"
                                ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                : question.category === "reasoning"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            }`}
                          >
                            {question.category.charAt(0).toUpperCase() +
                              question.category.slice(1)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              question.difficulty === "easy"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : question.difficulty === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          {question.questionText}
                        </p>
                      </div>
                      {user?.isAdmin && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingQuestion(question);
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
                      {question.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded border ${
                            showAnswers[question._id] &&
                            idx === question.correctOption
                              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                              : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                          {showAnswers[question._id] &&
                            idx === question.correctOption && (
                              <CheckCircle
                                className="inline-block ml-2 text-green-600"
                                size={16}
                              />
                            )}
                        </div>
                      ))}
                    </div>

                    {showAnswers[question._id] && question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {question.explanation}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => toggleAnswer(question._id)}
                      className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {showAnswers[question._id] ? (
                        <>
                          <EyeOff size={16} />
                          Hide Answer
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          Show Answer
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test Mode Tab */}
        {activeTab === "test" && (
          <div>
            {!testMode ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Start a Test
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Category
                    </label>
                    <select
                      value={testCategory}
                      onChange={(e) => setTestCategory(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="aptitude">Aptitude</option>
                      <option value="reasoning">Reasoning</option>
                      <option value="coding">Coding</option>
                    </select>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startTest}
                    disabled={testLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition"
                  >
                    {testLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Start Test
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : testSubmitted ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Test Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {testResults.score}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {testResults.correct}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {testResults.incorrect}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                      {testResults.total}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {testResults.results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        result.isCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Q{idx + 1}: {result.question.questionText}
                        </p>
                        {result.isCorrect ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <XCircle className="text-red-600" size={20} />
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Correct:</span>{" "}
                          {String.fromCharCode(65 + result.question.correctOption)}.{" "}
                          {result.question.options[result.question.correctOption]}
                        </p>
                        {!result.isCorrect && (
                          <p>
                            <span className="font-medium">Your Answer:</span>{" "}
                            {result.selectedAnswer !== undefined
                              ? `${String.fromCharCode(65 + result.selectedAnswer)}. ${result.question.options[result.selectedAnswer]}`
                              : "Not answered"}
                          </p>
                        )}
                        {result.question.explanation && (
                          <p className="mt-2 text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Explanation:</span>{" "}
                            {result.question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetTest}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition"
                >
                  <RotateCcw size={20} />
                  Retry Test
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Test: {testCategory.charAt(0).toUpperCase() + testCategory.slice(1)}
                  </h2>
                  <button
                    onClick={resetTest}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {testQuestions.map((question, idx) => (
                    <div
                      key={question._id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <p className="font-medium text-gray-900 dark:text-white mb-4">
                        Q{idx + 1}: {question.questionText}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <label
                            key={optIdx}
                            className="flex items-center p-3 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <input
                              type="radio"
                              name={`question-${question._id}`}
                              value={optIdx}
                              checked={testAnswers[question._id] === optIdx}
                              onChange={(e) =>
                                setTestAnswers((prev) => ({
                                  ...prev,
                                  [question._id]: parseInt(e.target.value),
                                }))
                              }
                              className="mr-3"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {String.fromCharCode(65 + optIdx)}. {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={submitTest}
                    disabled={Object.keys(testAnswers).length < testQuestions.length}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <AddEngagementQuestionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleQuestionAdded}
          token={token}
        />
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <EditEngagementQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSuccess={handleQuestionUpdated}
          token={token}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingQuestion && (
        <ConfirmModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingQuestion(null);
          }}
          onConfirm={handleDeleteQuestion}
          message={`Are you sure you want to delete this question?`}
        />
      )}
    </div>
  );
}

