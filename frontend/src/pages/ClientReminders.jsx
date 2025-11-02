// src/pages/ClientReminders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ClientReminders({ axiosConfig }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchReminders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/clients/me/reminders",
        { ...axiosConfig, headers: { ...axiosConfig.headers, "Cache-Control": "no-cache" } }
      );
      setReminders(res.data || []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (reminderId) => {
    if (!selectedFile) return alert("Please select a file first.");
    setUploadingId(reminderId);

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      await axios.post(
        `http://localhost:5000/api/reminders/${reminderId}/upload`,
        formData,
        { ...axiosConfig, headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );
      setSelectedFile(null);
      fetchReminders(); // refresh reminders to show uploaded document
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDownload = (documentUrl) => {
    const url = `http://localhost:5000/${documentUrl}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {loading ? (
        <p className="text-center text-gray-500">جارٍ تحميل التذكيرات...</p>
      ) : reminders.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد تذكيرات حالياً.</p>
      ) : (
        reminders.map((r) => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.02 }}
            className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow-sm"
          >
            <h4 className="font-bold text-yellow-700">{r.title}</h4>
            <p className="text-gray-700 mt-1">{r.description}</p>
            <p className="text-sm mt-1 text-gray-500">نوع التذكير: {r.type === "normal" ? "عادي" : "طلب مستند"}</p>

            {/* Document actions */}
            {r.type === "document_request" && (
              <div className="mt-2 flex gap-2 items-center">
                {r.documentUrl ? (
                  <button
                    onClick={() => handleDownload(r.documentUrl)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                  >
                    تحميل المستند
                  </button>
                ) : (
                  <>
                    <input type="file" onChange={handleFileChange} className="border p-1 rounded-md" />
                    <button
                      onClick={() => handleUpload(r.id)}
                      disabled={uploadingId === r.id}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      {uploadingId === r.id ? "جارٍ التحميل..." : "رفع المستند"}
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}
