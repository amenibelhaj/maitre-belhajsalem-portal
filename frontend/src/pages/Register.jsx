import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "lawyer" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-emerald-300">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-10 w-96 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-4 text-emerald-700">🧑‍⚖️ Lawyer Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
          />
          <select
            name="role"
            className="w-full border p-3 rounded-lg"
            value={form.role}
            onChange={handleChange}
          >
            <option value="lawyer">Lawyer</option>
            <option value="client">Client</option>
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
