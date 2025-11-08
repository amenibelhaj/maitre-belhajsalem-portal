import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ClientDashboard() {
  const [cases, setCases] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cases");

  // New: selected files state for document uploads
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadedReminders, setUploadedReminders] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Get the logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [clientName, setClientName] = useState(user.name || "");
  const [lawyerName, setLawyerName] = useState("");

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch client cases and reminders
  const fetchClientData = async () => {
    try {
      // 1️⃣ Fetch cases
      const casesRes = await axios.get(
        "http://localhost:5000/api/clients/me/cases",
        axiosConfig
      );
      setCases(casesRes.data || []);

      // 2️⃣ Fetch reminders for the logged-in client
      const remindersRes = await axios.get(
        "http://localhost:5000/api/clients/me/reminders",
        axiosConfig
      );
      setReminders(remindersRes.data || []);

      // 3️⃣ Fetch lawyer name if cases exist
      if (casesRes.data && casesRes.data.length > 0 && casesRes.data[0].lawyerId) {
        const lawyerRes = await axios.get(
          `http://localhost:5000/api/lawyers/${casesRes.data[0].lawyerId}`,
          axiosConfig
        );
        setLawyerName(lawyerRes.data.name);
      }
    } catch (err) {
      console.error("Error fetching client dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 font-sans">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-blue-700">
           مرحبًا <span className="text-blue-900">{clientName}</span>
        </h1>

        {lawyerName && (
          <span className="text-lg text-blue-600 flex items-center gap-1">
            ⚖️ maitre {lawyerName}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          تسجيل الخروج
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("cases")}
          className={`px-6 py-2 rounded-xl transition-all ${
            activeTab === "cases"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-blue-600 border"
          }`}
        >
          ⚖️ القضايا
        </button>
        <button
          onClick={() => setActiveTab("reminders")}
          className={`px-6 py-2 rounded-xl transition-all ${
            activeTab === "reminders"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white text-green-600 border"
          }`}
        >
          🔔 التذكيرات
        </button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {loading ? (
          <p className="text-center text-gray-500">جارٍ تحميل البيانات...</p>
        ) : activeTab === "cases" ? (
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
              ⚖️ القضايا
            </h2>
            {cases.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">لا توجد قضايا مضافة بعد.</p>
            ) : (
              <div className="space-y-4">
                {cases.map((c) => (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.02 }}
                    className="shadow-md hover:shadow-xl transition-all rounded-2xl bg-white p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">{c.title}</h3>
                        <p className="text-gray-700 mt-1">{c.description}</p>
                        <p className="mt-1">
                          <span className="font-semibold">📅 التاريخ:</span>{" "}
                          {c.courtDate ? new Date(c.courtDate).toLocaleDateString() : "-"}
                        </p>
                        <p className="mt-1">
                          <span className="font-semibold">📊 الحالة:</span> {c.status}
                        </p>
                        <p className="mt-1">
                          <span className="font-semibold">النتيجة:</span> {c.outcome || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Sessions */}
                    {c.sessions?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">📅 الجلسات:</h4>
                        <ul className="list-disc ml-6 text-gray-700">
                          {c.sessions.map((s, i) => (
                            <li key={i}>
                              {s.date || "-"} — {s.notes || "-"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    {c.actions?.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-semibold text-gray-800 mb-2">⚖️ الإجراءات:</h4>
                        <ul className="list-disc ml-6 text-gray-700">
                          {c.actions.map((a, i) => (
                            <li key={i}>
                              {a.date || "-"} — {a.type || "-"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Reminders Tab
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
              🔔 التذكيرات
            </h2>
            {reminders.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">لا توجد تذكيرات حالياً.</p>
            ) : (
              <div className="space-y-4">
                {reminders.map((r) => (
                  <motion.div
                    key={r.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow-sm"
                  >
                    <h4 className="font-bold text-yellow-700">{r.title}</h4>
                    <p className="text-gray-700 mt-1">{r.description}</p>
                    <p className="text-sm mt-1 text-gray-500">
                      نوع التذكير: {r.type === "normal" ? "عادي" : "طلب مستند"}
                    </p>

                  {/* Document upload for document_request reminders */}
{r.type === "document_request" && (
  <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
    
    {/* File Selector */}
    <div className="flex items-center gap-3 w-full md:w-auto">
      <input
        type="file"
        id={`file-input-${r.id}`}
        className="hidden"
        onChange={(e) =>
          setSelectedFiles((prev) => ({ ...prev, [r.id]: e.target.files[0] }))
        }
      />
      <label
        htmlFor={`file-input-${r.id}`}
        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4" />
        </svg>
        اختر ملف
        {selectedFiles[r.id] && (
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {selectedFiles[r.id].name}
          </span>
        )}
      </label>
    </div>

    {/* Upload Button */}
    <button
      onClick={async () => {
        if (!selectedFiles[r.id]) return alert("اختر ملف أولاً");
        const formData = new FormData();
        formData.append("document", selectedFiles[r.id]);

        try {
          setUploadProgress((prev) => ({ ...prev, [r.id]: 0 }));

          await axios.post(
            `http://localhost:5000/api/reminders/${r.id}/upload`,
            formData,
            {
              headers: {
                ...axiosConfig.headers,
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress((prev) => ({ ...prev, [r.id]: percent }));
              },
            }
          );

          setSelectedFiles((prev) => ({ ...prev, [r.id]: null }));
          setUploadedReminders((prev) => ({ ...prev, [r.id]: true }));
          fetchClientData();
        } catch (err) {
          alert("حدث خطأ أثناء رفع الملف");
          console.error(err);
        }
      }}
      className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4" />
      </svg>
      رفع المستند
    </button>

    {/* Progress Bar */}
    {uploadProgress[r.id] > 0 && uploadProgress[r.id] < 100 && (
      <div className="w-full md:w-40 bg-gray-200 rounded-full h-2 overflow-hidden mt-2 md:mt-0">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${uploadProgress[r.id]}%` }}
        ></div>
      </div>
    )}

    {/* Success Message */}
    {uploadedReminders[r.id] && (
      <span className="text-green-600 text-sm ml-2">
        تم رفع المستند بنجاح ✅
      </span>
    )}
  </div>
)}


  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}