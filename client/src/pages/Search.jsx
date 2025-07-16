/**
 * Enhanced SearchPage with:
 * - Elegant card design for questions and results
 * - Highlight animations
 * - Clear typography and spacing
 * - Dark mode compatible visual feedback
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(history);

    const fetchAllQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchAllQuestions();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (searchTerm) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/questions/search/query?query=${searchTerm}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelectSearch = (searchTerm) => {
    setQuery(searchTerm);
    fetchResults(searchTerm);
    saveToHistory(searchTerm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSelectSearch(query.trim());
    }
  };

  const saveToHistory = (term) => {
    let updated = [term, ...recentSearches.filter((q) => q !== term)];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const deleteFromHistory = (term) => {
    const updated = recentSearches.filter((item) => item !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const highlight = (text) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white rounded"
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
        >
          Search
        </button>
      </form>

      {query === "" && recentSearches.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                <button
                  onClick={() => handleSelectSearch(term)}
                  className="text-gray-800 dark:text-white"
                >
                  {term}
                </button>
                <button
                  onClick={() => deleteFromHistory(term)}
                  className="ml-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {query === "" && questions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">Explore Questions</h3>
          <div className="grid sm:grid-cols-1 gap-4">
            {questions.slice(0, 8).map((q) => (
              <Link to={`/question/${q._id}`} key={q._id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition border-gray-200 dark:border-gray-600"
                >
                  <h4 className="text-blue-700 dark:text-blue-400 font-semibold text-lg">
                    {q.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {q.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">Search Results</h3>
          {results.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No results found.</p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {results.map((q) => (
                  <motion.div
                    key={q._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/question/${q._id}`} onClick={() => saveToHistory(query)}>
                      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-400 text-lg">
                          {highlight(q.title)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {q.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
