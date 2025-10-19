import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));

      // Fetch clients
      fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setClients(data))
        .catch(console.error);

      // Fetch cases
      fetch("http://localhost:5000/api/cases", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setCases(data))
        .catch(console.error);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">
        Welcome, <span className="font-semibold">{user.name}</span>! You are logged in as <span className="font-medium">{user.role}</span>.
      </p>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Clients</h2>
          {clients.length === 0 ? <p>No clients yet.</p> : (
            <ul className="list-disc pl-5">
              {clients.map(client => (
                <li key={client.id}>{client.name} - {client.email}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Cases</h2>
          {cases.length === 0 ? <p>No cases yet.</p> : (
            <ul className="list-disc pl-5">
              {cases.map(c => (
                <li key={c.id}>{c.title} - {c.status}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
