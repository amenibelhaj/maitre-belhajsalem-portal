// frontend/src/pages/LawyerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

export default function LawyerDashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  const [reminders, setReminders] = useState([]); // <-- for reminders
  const [reminderForm, setReminderForm] = useState({ title: "", description: "" });
  const [showReminderForm, setShowReminderForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    courtDate: "",
    outcome: "",
    sessions: [{ date: "", notes: "" }],
    actions: [{ type: "", date: "" }],
  });

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Setup Socket.IO connection
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });
    setSocket(newSocket);

    // Listen for new reminders in real-time
    newSocket.on("newReminder", (reminder) => {
      setReminders((prev) => [reminder, ...prev]);
    });

    return () => newSocket.disconnect();
  }, [token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients", axiosConfig);
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cases for a specific client
  const fetchClientCases = async (clientId) => {
    try {
      const res = await axios.get("http://localhost:5000/api/cases", axiosConfig);
      const clientCases = res.data.filter((c) => c.clientId === clientId);
      setCases(clientCases);
    } catch (err) {
      console.error("Error fetching cases:", err);
      setCases([]);
    }
  };

  // Fetch reminders for selected client
  const fetchReminders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reminders", axiosConfig);
      setReminders(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchReminders();
  }, []);

  // Select a client
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    fetchClientCases(client.id);
    setShowCaseForm(false);
    setEditingCase(null);
  };

  // Reminder form change
  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setReminderForm((prev) => ({ ...prev, [name]: value }));
  };

  // Send a new reminder
  const handleSendReminder = async () => {
    if (!selectedClient) return alert("اختر حريفًا لإرسال التذكير");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reminders",
        { ...reminderForm, recipientId: selectedClient.id },
        axiosConfig
      );
      // Already handled by real-time socket event
      setReminderForm({ title: "", description: "" });
      setShowReminderForm(false);
    } catch (err) {
      console.error("Error sending reminder:", err);
      alert("فشل إرسال التذكير.");
    }
  };

  // Case handlers (same as before)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (field, index, prop, value) => {
    setFormData((prev) => {
      const updated = prev[field].map((item, i) => (i === index ? { ...item, [prop]: value } : item));
      return { ...prev, [field]: updated };
    });
  };

  const addField = (field) => {
    setFormData((prev) => {
      if (field === "sessions") return { ...prev, sessions: [...prev.sessions, { date: "", notes: "" }] };
      else return { ...prev, actions: [...prev.actions, { type: "", date: "" }] };
    });
  };

  const removeField = (field, index) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      if (updated.length === 0) updated.push(field === "sessions" ? { date: "", notes: "" } : { type: "", date: "" });
      return { ...prev, [field]: updated };
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "open",
      courtDate: "",
      outcome: "",
      sessions: [{ date: "", notes: "" }],
      actions: [{ type: "", date: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) return alert("اختر حريفًا أولاً");

    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      courtDate: formData.courtDate ? new Date(formData.courtDate).toISOString() : null,
      outcome: formData.outcome,
      sessions: formData.sessions.map((s) => ({ date: s.date, notes: s.notes })),
      actions: formData.actions.map((a) => ({ type: a.type, date: a.date })),
      clientId: selectedClient.id,
    };

    try {
      if (editingCase) await axios.put(`http://localhost:5000/api/cases/${editingCase.id}`, payload, axiosConfig);
      else await axios.post("http://localhost:5000/api/cases", payload, axiosConfig);

      await fetchClientCases(selectedClient.id);
      setShowCaseForm(false);
      setEditingCase(null);
      resetForm();
    } catch (err) {
      console.error("Error saving case:", err);
      alert("حدث خطأ أثناء حفظ القضية.");
    }
  };

  const handleEditCase = (caseData) => {
    setEditingCase(caseData);
    setFormData({
      title: caseData.title || "",
      description: caseData.description || "",
      status: caseData.status || "open",
      courtDate: caseData.courtDate ? new Date(caseData.courtDate).toISOString().slice(0, 10) : "",
      outcome: caseData.outcome || "",
      sessions:
        caseData.sessions && caseData.sessions.length
          ? caseData.sessions.map((s) => ({ date: s.date || "", notes: s.notes || "" }))
          : [{ date: "", notes: "" }],
      actions:
        caseData.actions && caseData.actions.length
          ? caseData.actions.map((a) => ({ type: a.type || "", date: a.date || "" }))
          : [{ type: "", date: "" }],
    });
    setShowCaseForm(true);
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه القضية؟")) return;
    try {
      await axios.delete(`http://localhost:5000/api/cases/${caseId}`, axiosConfig);
      if (selectedClient) await fetchClientCases(selectedClient.id);
    } catch (err) {
      console.error("Error deleting case:", err);
      alert("فشل حذف القضية.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-blue-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚖️ بوابة المحامي
        </motion.h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Clients List */}
        <div className="col-span-1 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 الحرفاء</h2>
          {loading ? (
            <p>جارٍ التحميل...</p>
          ) : (
            clients.map((client) => (
              <motion.button
                key={client.id}
                whileHover={{ scale: 1.05 }}
                className={`block w-full text-left mb-3 p-3 rounded-xl shadow ${
                  selectedClient?.id === client.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => handleClientSelect(client)}
              >
                <p className="font-medium">{client.name}</p>
                <p className="text-sm">{client.email}</p>
                <p className="text-sm">{client.phone}</p>
              </motion.button>
            ))
          )}
        </div>

        {/* Cases + Reminders */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[80vh]">
          {selectedClient ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">⚖️ قضايا {selectedClient.name}</h2>

              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => {
                    setShowCaseForm(true);
                    setEditingCase(null);
                    resetForm();
                  }}
                  className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  ➕ إضافة قضية جديدة
                </button>

                <button
                  onClick={() => setShowReminderForm((prev) => !prev)}
                  className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  🔔 إرسال تذكير
                </button>

                <button
                  onClick={async () => {
                    await fetchClientCases(selectedClient.id);
                    await fetchReminders();
                  }}
                  className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg"
                >
                  تحديث
                </button>
              </div>

              {/* Reminder Form */}
              {showReminderForm && (
                <div className="bg-gray-100 p-4 rounded-xl mb-4">
                  <input
                    type="text"
                    name="title"
                    value={reminderForm.title}
                    placeholder="عنوان التذكير"
                    onChange={handleReminderChange}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea
                    name="description"
                    value={reminderForm.description}
                    placeholder="وصف التذكير"
                    onChange={handleReminderChange}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowReminderForm(false)}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSendReminder}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              )}

              {/* Reminders List */}
              {reminders.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">🔔 التذكيرات</h3>
                  {reminders
                    .filter((r) => r.recipientId === selectedClient.id || r.lawyerId === selectedClient.id)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="border border-gray-300 rounded p-2 mb-2 bg-yellow-50"
                      >
                        <p className="font-medium">{r.title}</p>
                        <p className="text-sm">{r.description}</p>
                      </div>
                    ))}
                </div>
              )}

              {/* Cases List */}
              {cases.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">❗ لا توجد قضايا لهذا الحريف بعد.</p>
              ) : (
                cases.map((c) => (
                  <motion.div
                    key={c.id}
                    className="border border-gray-200 p-4 rounded-xl mb-4 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-700">{c.title}</h3>
                        <p className="mt-1">📄 {c.description}</p>
                        <p className="mt-1">📅 التاريخ: {c.courtDate ? new Date(c.courtDate).toLocaleDateString() : "-"}</p>
                        <p className="mt-1">📊 الحالة: {c.status}</p>
                        <p className="mt-1">المآل: {c.outcome || "-"}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEditCase(c)}
                          className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded-lg"
                        >
                          ✏️ تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteCase(c.id)}
                          className="mt-2 bg-red-500 hover:bg-red-600 text-sm px-3 py-1 rounded-lg text-white"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>

                    {/* Sessions */}
                    {c.sessions && c.sessions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold">📅 الجلسات:</h4>
                        <ul className="list-disc ml-6">
                          {c.sessions.map((s, i) => (
                            <li key={i}>
                              {s.date || "-"} – {s.notes || "-"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    {c.actions && c.actions.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-semibold">⚖️ الإجراءات:</h4>
                        <ul className="list-disc ml-6">
                          {c.actions.map((a, i) => (
                            <li key={i}>
                              {a.date || "-"} – {a.type || "-"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center">اختر حريفًا لعرض قضاياه</p>
          )}
        </div>
      </div>

      {/* Case Form Modal */}
      {showCaseForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 w-[700px] shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              {editingCase ? "تعديل القضية" : "إضافة قضية جديدة"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* same case form inputs as before */}
              <input
                type="text"
                name="title"
                placeholder="عنوان القضية"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="وصف القضية"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                name="courtDate"
                value={formData.courtDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />

              {/* Sessions and Actions */}
              {/* same as before */}
              <div>
                <h3 className="font-semibold mt-4">📅 الجلسات</h3>
                {formData.sessions.map((s, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <input
                      type="date"
                      value={s.date}
                      onChange={(e) => handleNestedChange("sessions", i, "date", e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={s.notes}
                      placeholder="ملاحظات الجلسة"
                      onChange={(e) => handleNestedChange("sessions", i, "notes", e.target.value)}
                      className="flex-grow p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeField("sessions", i)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField("sessions")}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                  ➕ أضف جلسة
                </button>
              </div>

              <div>
                <h3 className="font-semibold mt-4">⚖️ الإجراءات</h3>
                {formData.actions.map((a, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={a.type}
                      placeholder="نوع الإجراء"
                      onChange={(e) => handleNestedChange("actions", i, "type", e.target.value)}
                      className="flex-grow p-2 border rounded"
                    />
                    <input
                      type="date"
                      value={a.date}
                      onChange={(e) => handleNestedChange("actions", i, "date", e.target.value)}
                      className="p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeField("actions", i)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField("actions")}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                  ➕ أضف إجراء
                </button>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCaseForm(false);
                    setEditingCase(null);
                    resetForm();
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  إلغاء
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  {editingCase ? "حفظ التعديلات" : "إضافة"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}