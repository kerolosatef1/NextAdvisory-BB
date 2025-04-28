import { useState } from "react";
import axios from "axios";

const AddProfessor = () => {
  const [professor, setProfessor] = useState({
    id: "",
    name: "",
    availability: [] 
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 
  const dayMap = {
    Saturday: "sat",
    Sunday: "sun",
    Monday: "mon",
    Tuesday: "tue",
    Wednesday: "wed",
    Thursday: "thu",
    Friday: "fri"
  };
  

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id" && !/^\d*$/.test(value)) return;
    setProfessor({ ...professor, [name]: value });
  };

  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfessor((prev) => {
      const updatedAvailability = checked
        ? [...prev.availability, name]
        : prev.availability.filter((day) => day !== name);
      return { ...prev, availability: updatedAvailability };
    });
  };

  // 🚀 إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
  
      const daysObject = {};
      Object.values(dayMap).forEach((short) => {
        daysObject[short] = professor.availability.includes(
          Object.keys(dayMap).find((k) => dayMap[k] === short)
        );
      });

      const professorData = {
        id: parseInt(professor.id, 10),
        name: professor.name.trim(),
        numberAssignedCourses: 1,
        ...daysObject // ✅ تضمين الأيام هنا
      };

      console.log("📤 Sending Data:", JSON.stringify(professorData, null, 2));

      const response = await axios.post(
        "http://timetableapi.runasp.net/api/Professors",
        professorData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      );

      console.log("✅ API Response:", response.data);

      setMessage("✅ تم إرسال البيانات بنجاح!");
      setProfessor({ id: "", name: "", availability: [] });
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error);
      setMessage(
        `❌ حدث خطأ: ${
          error.response?.data?.message || "تفاصيل الخطأ غير متوفرة"
        }`
      );
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">📚 إضافة دكتور جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 👨‍🏫 الاسم */}
        <div>
          <label className="block font-semibold">👨‍🏫 اسم الدكتور:</label>
          <input
            type="text"
            name="name"
            value={professor.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* 🔢 رقم الدكتور */}
        <div>
          <label className="block font-semibold">🔢 رقم الدكتور (ID):</label>
          <input
            type="text"
            name="id"
            value={professor.id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* 📆 اختيار الأيام */}
        <div>
          <label className="block font-semibold">📆 الأيام المتاح فيها الدكتور:</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(dayMap).map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={day}
                  checked={professor.availability.includes(day)}
                  onChange={handleCheckboxChange}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ➕ زر الإرسال */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "⏳ جاري الإرسال..." : "➕ إضافة الدكتور"}
        </button>
      </form>

      {/* 💬 رسالة النتيجة */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default AddProfessor;
