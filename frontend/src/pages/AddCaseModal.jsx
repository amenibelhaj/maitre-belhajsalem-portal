
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AddCaseModal({ axiosConfig, selectedClient, onClose, onCaseAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    courtDate: "",
    outcome: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) return alert("اختر حريفًا أولاً");

    try {
      await axios.post(
        "http://localhost:5000/api/cases",
        { ...formData, clientId: selectedClient.id },
        axiosConfig
      );
      onCaseAdded();
      onClose();
    } catch (err) {
      console.error("Error adding case:", err);
      alert("حدث خطأ أثناء إضافة القضية");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">➕ إضافة قضية جديدة</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="عنوان القضية"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="وصف القضية"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="courtDate"
            value={formData.courtDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="open">مفتوحة</option>
            <option value="closed">مغلقة</option>
            <option value="pending">قيد الانتظار</option>
          </select>
          <input
            type="text"
            name="outcome"
            placeholder="المآل"
            value={formData.outcome}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              إلغاء
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              إضافة
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
