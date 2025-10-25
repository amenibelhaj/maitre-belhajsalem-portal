import React, { useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddClientModal({ axiosConfig, onClose, onClientAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/clients", { name, email, phone }, axiosConfig);

      // Professional toast: show credentials and copy to clipboard
      const credentialsText = `ID: ${res.data.credentials.id}\nPassword: ${res.data.credentials.password}`;
      navigator.clipboard.writeText(credentialsText);

      toast.success(
        <div>
          <p>Client created successfully!</p>
          <p>
            <strong>ID:</strong> {res.data.credentials.id} <br />
            <strong>Password:</strong> {res.data.credentials.password}
          </p>
          <p className="text-sm">Credentials copied to clipboard.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      onClientAdded(); // Refresh clients list
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding client", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">➕ إضافة حريف جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-1 rounded"
            >
              {loading ? "جارٍ الإضافة..." : "إضافة"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
