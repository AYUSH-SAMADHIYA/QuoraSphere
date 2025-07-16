import { useEffect, useState } from "react";

function Comments({ answerId, token }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:5000/api/comments/${answerId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [answerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

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
      setComments((prev) => [...prev, data]);
      setText("");
    }
  };

  return (
    <div className="mt-2 pl-4 border-l text-sm">
      <h4 className="font-semibold">Comments:</h4>
      {comments.map((c) => (
        <p key={c._id} className="text-gray-700">- {c.text}</p>
      ))}
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          className="w-full border px-2 py-1 rounded text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
      </form>
    </div>
  );
}

export default Comments;
