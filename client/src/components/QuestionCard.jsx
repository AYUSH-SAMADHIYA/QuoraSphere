import { Link } from "react-router-dom";

export default function QuestionCard({ question }) {
  return (
    <div className="border rounded p-4 mb-4 bg-white shadow">
      <h2 className="text-xl font-semibold">{question.title}</h2>
      <p className="text-gray-700 mt-1 mb-2">{question.description.slice(0, 120)}...</p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{question.answers?.length || 0} Answers</span>
        <span>{question.upvotes || 0} Upvotes</span>
        <Link
          to={`/question/${question._id}`}
          className="text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
