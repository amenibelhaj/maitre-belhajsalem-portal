import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

export default function Login() {
  const [emailOrId, setEmailOrId] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { password };

      if (/^\d+$/.test(emailOrId)) {
        payload.id = Number(emailOrId);
      } else {
        payload.email = emailOrId;
      }

      const res = await API.post("/auth/login", payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "lawyer") navigate("/lawyer");
      else if (res.data.user.role === "client") navigate("/client");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-300">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-10 w-96 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-4 text-blue-700">⚖️ Portal Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email (Lawyer) or Client ID"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
  Are you a lawyer?{" "}
  <Link to="/register" className="text-blue-600 hover:underline">
    Register here
  </Link>
</p>
<p className="mt-2 text-sm text-gray-600">
  Clients cannot register. Please contact your lawyer.
</p>

      </motion.div>
    </div>
  );
}
