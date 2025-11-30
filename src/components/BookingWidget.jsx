import { useState } from "react";
import ParticipantsCounter from "./ParticipantsCounter";

export default function BookingWidget(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Выберите даты");

  const dates = props.dates;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg w-[388px] text-[#001A34] dark:text-gray-100 p-5 transition">
      {/* Цена */}
      <div className="mb-3">
        <span className="text-[22px] font-extrabold text-gray-900 dark:text-gray-100">
          от {props.cost}
        </span>
        <p className="text-sm text-gray-500 mt-1">{props.costPerDay}</p>
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
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
          >
            <path
              d="M6 12L10 8L6 4"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 py-2">
            {dates.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  if (d.active) {
                    setSelectedDate(d.range);
                    setIsOpen(false);
                  }
                }}
                className={`flex items-center justify-between px-4 py-2 text-[14px] cursor-pointer ${
                  d.active
                    ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-400 cursor-default"
                }`}
              >
                <span>{d.range}</span>
                {d.active ? (
                  <span className="flex items-center gap-2 text-[13px]">
                    <span className="text-[#8DC21F] font-medium">
                      {d.price}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[#8DC21F] font-medium">
                      {d.seats} мест
                    </span>
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
      <ParticipantsCounter {...props} />

      {/* Кнопка */}
      <button className="cursor-pointer w-full bg-[#424E2B] hover:bg-[#6c9225] text-white font-semibold py-2.5 rounded-lg transition-colors">
        Перейти к оплате
      </button>

      {/* Предоплата / отмена */}
      <div className="mt-4 text-center text-[13px] text-gray-700 dark:text-gray-300">
        <p className="font-medium mb-1">Предоплата — {props.prepayment}</p>
        <p className="text-gray-500 text-[12px]">
          Полная отмена в течение 24 часов
        </p>
      </div>
    </div>
  );
}
