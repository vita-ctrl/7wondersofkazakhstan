import { useState } from "react";

export default function BookingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Выберите даты");

  const dates = [
    { id: 1, range: "26–28 нояб 2025", price: "₸ 610 000", seats: 18, active: true },
    { id: 2, range: "26–28 нояб 2025", price: "₸ 620 000", seats: 0, active: false },
    { id: 3, range: "18–20 дек 2025", price: "₸ 590 000", seats: 19, active: true },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg w-[388px] text-[#001A34] dark:text-gray-100 p-5 transition">
      {/* Цена */}
      <div className="mb-3">
        <span className="text-[22px] font-extrabold text-gray-900 dark:text-gray-100">
          от 600 000 ₸
        </span>
        <p className="text-sm text-gray-500 mt-1">200 000 ₸ / день • 3 дня</p>
      </div>

      {/* Выбор даты */}
      <div className="relative mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700/40 text-[14px] text-gray-700 dark:text-gray-300 hover:border-[#8DC21F] transition"
        >
          {selectedDate}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
            fill="none" viewBox="0 0 16 16" stroke="currentColor"
          >
            <path d="M6 12L10 8L6 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 py-2">
            {dates.map((d) => (
              <div
                key={d.id}
                onClick={() => { if (d.active) { setSelectedDate(d.range); setIsOpen(false); } }}
                className={`flex items-center justify-between px-4 py-2 text-[14px] cursor-pointer ${
                  d.active ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100" : "text-gray-400 cursor-default"
                }`}
              >
                <span>{d.range}</span>
                {d.active ? (
                  <span className="flex items-center gap-2 text-[13px]">
                    <span className="text-[#8DC21F] font-medium">{d.price}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[#8DC21F] font-medium">{d.seats} мест</span>
                  </span>
                ) : (
                  <span className="text-gray-400 text-[13px]">мест нет</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Кол-во участников */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
        <span className="text-[13px] text-gray-700 dark:text-gray-300">Участников</span>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">–</button>
          <span className="px-2 text-sm font-semibold">1</span>
          <button className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">+</button>
        </div>
      </div>

      {/* Гарантия */}
      <div className="flex items-center justify-center text-[12px] text-gray-600 dark:text-gray-400 gap-1 mb-4">
        <span className="inline-flex items-center gap-1 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 20.5A8.5 8.5 0 104.5 12 8.5 8.5 0 0012 20.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 15.5V12M12 8.5h.01" />
          </svg>
          <span>Гарантия проведения</span>
        </span>
      </div>

      {/* Кнопка */}
      <button className="w-full bg-[#8DC21F] hover:bg-[#7EB31A] text-white font-semibold py-2.5 rounded-lg transition-colors">
        Выбрать даты
      </button>

      {/* Предоплата / отмена */}
      <div className="mt-4 text-center text-[13px] text-gray-700 dark:text-gray-300">
        <p className="font-medium mb-1">Предоплата — 400 000 ₸</p>
        <p className="text-gray-500 text-[12px]">Полная отмена в течение 24 часов</p>
      </div>

      {/* Индивидуальный тур */}
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 text-center">
        <a href="#" className="text-[#8DC21F] hover:text-[#76A519] text-[13px] font-medium transition-colors">
          Или запросить индивидуальный тур →
        </a>
      </div>
    </div>
  );
}
