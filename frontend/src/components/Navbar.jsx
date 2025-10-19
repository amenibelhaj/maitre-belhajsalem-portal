import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="font-bold">Maitre Belhaj Salem Portal ⚖️</h1>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
}
