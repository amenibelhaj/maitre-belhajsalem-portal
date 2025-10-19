// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LawyerDashboard from "./pages/LawyerDashboard";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/lawyer" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lawyer" element={<LawyerDashboard />} />
      </Routes>
    </Router>
  );
}
