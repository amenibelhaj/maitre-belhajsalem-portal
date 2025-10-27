import React, { useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddClientModal({ axiosConfig, onClose, onClientAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [newClient, setNewClient] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 👈 added

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/clients", { name, email, phone }, axiosConfig);

      const { id, password } = res.data.credentials;
      const credentialsText = `ID: ${id}\nPassword: ${password}`;
      navigator.clipboard.writeText(credentialsText);

      setNewClient({ id, password });

      toast.success("✅ تم إنشاء الحريف بنجاح! تم نسخ المعرف وكلمة المرور.", {
        position: "top-right",
        autoClose: 5000,
      });

      onClientAdded();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة الحريف", {
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

        {!newClient ? (
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
        ) : (
          <div className="text-center space-y-3">
            <p className="text-green-600 font-semibold">✅ تم إنشاء الحريف بنجاح</p>
            <p>🆔 <strong>المعرّف:</strong> {newClient.id}</p>

            {/* 👇 Password field with show/hide toggle */}
            <div className="flex items-center justify-center gap-2">
              <p>
                🔑 <strong>كلمة المرور:</strong>{" "}
                <input
                  type={showPassword ? "text" : "password"}
                  value={newClient.password}
                  readOnly
                  className="border px-2 py-1 rounded w-[130px] text-center bg-gray-50"
                />
              </p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-purple-600 hover:underline"
              >
                {showPassword ? "إخفاء" : "عرض"}
              </button>
            </div>

            <p className="text-sm text-gray-500">📋 تم نسخ المعلومات إلى الحافظة</p>

            <button
              onClick={onClose}
              className="bg-purple-500 text-white px-4 py-2 rounded mt-3"
            >
              إغلاق
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
