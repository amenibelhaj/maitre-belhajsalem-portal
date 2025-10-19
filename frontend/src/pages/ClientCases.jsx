import React, { useEffect, useState } from "react";

export default function ClientCases({ clientId }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  const token = localStorage.getItem("token");

  const fetchCases = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/cases?clientId=${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch cases");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAddCase = () => {
    fetch("http://localhost:5000/api/cases", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, status, clientId }),
    })
      .then((res) => res.json())
      .then(() => {
        setTitle("");
        setDescription("");
        fetchCases();
      });
  };

  const handleDelete = (caseId) => {
    fetch(`http://localhost:5000/api/cases/${caseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchCases());
  };

  if (loading) return <p className="p-4">Loading cases...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cases</h2>

      <div className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2">Add New Case</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Case title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={handleAddCase}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Case
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{c.title}</h3>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            <p className="text-gray-700 mb-1">{c.description}</p>
            <p className="text-sm text-gray-600 mb-2">Status: {c.status}</p>

            {c.courtDate && (
              <p className="text-sm text-gray-600 mb-2">
                Court Date: {new Date(c.courtDate).toLocaleString()}
              </p>
            )}

            {c.outcome && (
              <p className="text-sm text-gray-800 mb-2">
                <strong>Outcome:</strong> {c.outcome}
              </p>
            )}

            {c.sessions?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-gray-700">Sessions:</p>
                <ul className="list-disc list-inside">
                  {c.sessions.map((s, i) => (
                    <li key={i} className="text-sm">
                      {new Date(s.date).toLocaleDateString()} – {s.notes}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.actions?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-gray-700">Actions:</p>
                <ul className="list-disc list-inside">
                  {c.actions.map((a, i) => (
                    <li key={i} className="text-sm">
                      {new Date(a.date).toLocaleDateString()} – {a.type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
