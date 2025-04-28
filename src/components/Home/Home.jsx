import React from "react";
import { NavLink } from 'react-router-dom';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00AD91] via-[#0185B1] via-50% to-[#00AC92] text-white">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-4">
        <img src="../" alt="Logo" className="w-20 h-20 mb-4" />
        <h1 className="text-4xl font-bold mb-2">نظم جدولك الجامعي بسهولة</h1>
        <p className="text-lg mb-6">مساعدك الذكي للإرشاد الأكاديمي وتنظيم الجداول الدراسية</p>
        <button className="bg-white text-[#00AD91] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">ابدأ الآن</button>
      </header>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20 py-12">
        <div className="bg-white text-[#00AD91] p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-2">تنظيم الجدول تلقائيًا</h3>
          <p>حدد المواد، وسيقوم النظام بإنشاء الجدول دون تعارضات.</p>
        </div>
        <div className="bg-white text-[#00AD91] p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-2">متابعة المواد</h3>
          <p>عرض المواد المضافة والجداول الخاصة بك بوضوح وسهولة.</p>
        </div>
        <div className="bg-white text-[#00AD91] p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-2">تقرير ذكي</h3>
          <p>احصل على اقتراحات لإضافة المواد بناءً على جدولك ومعدلك.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-10 px-4">
        <h2 className="text-3xl font-bold mb-4">جاهز تبدأ؟</h2>
        <p className="mb-6">انضم إلينا وسهّل إدارة جدولك الجامعي!</p>
        <NavLink className="bg-white text-[#00AD91] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">ابدأ الآن</NavLink>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-4 border-t border-white/20">
        <p>© 2025 Academic Scheduler. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
