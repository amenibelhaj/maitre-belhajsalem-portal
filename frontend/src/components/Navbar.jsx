import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { getClients, getCases } from "../api";

export default function LawyerDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, casesRes] = await Promise.all([
          getClients(),
          getCases(),
        ]);
        setClients(clientsRes.data);
        setCases(casesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-700 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="p-8 space-y-10">
        {/* Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Total Clients" value={clients.length} />
          <DashboardCard title="Total Cases" value={cases.length} />
          <DashboardCard
            title="Pending Cases"
            value={cases.filter((c) => c.status === "open").length}
          />
        </motion.div>

        {/* Clients */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.slice(0, 6).map((client) => (
              <motion.div
                key={client.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow p-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {client.name}
                </h3>
                <p className="text-gray-600 text-sm">{client.email}</p>
                <p className="text-gray-500 text-sm">{client.phone}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Cases */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.slice(0, 6).map((caseItem) => (
              <motion.div
                key={caseItem.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow p-4"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {caseItem.title}
                </h3>
                <p className="text-gray-600 text-sm">{caseItem.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      caseItem.status === "open"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {caseItem.status}
                  </span>
                </p>
                <p className="text-gray-500 text-sm">
                  Court Date: {new Date(caseItem.courtDate).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </motion.div>
  );
}
