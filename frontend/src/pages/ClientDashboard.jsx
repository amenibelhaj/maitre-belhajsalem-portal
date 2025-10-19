import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReminders(data);
    };
    fetchReminders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Your Reminders</h2>
      <ul className="space-y-2">
        {reminders.map((r) => (
          <li
            key={r.id}
            className="p-4 bg-white rounded shadow hover:bg-gray-50"
          >
            {r.title} - {r.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
