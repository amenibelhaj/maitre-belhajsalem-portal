import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setUserName(user.name || "");
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Welcome, {userName}!
      </h1>

      {/* Rest of your client dashboard content here */}
    </div>
  );
}
