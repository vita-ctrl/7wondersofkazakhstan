import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingWidget(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Выберите даты");

  const navigate = useNavigate();
  const dates = props.dates;

  const [dateId, setDateId] = useState(null);

  const [cost, setCost] = useState(props.cost);

  const maximumCount = props.maxSeats;
  const [count, setCount] = useState(1);

  const pluralRules = new Intl.PluralRules("ru");

  const pluralize = (n, [one, few, many]) => {
    const rule = pluralRules.select(n);

    switch (rule) {
      case "one":
        return `${n} ${one}`;
      case "few":
        return `${n} ${few}`;
      default:
        return `${n} ${many}`;
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  return (
    <div className="bg-cream mb-8 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg w-[388px] text-[#001A34] dark:text-gray-100 p-5 transition">
      {/* Цена */}
      <div className="mb-4">
        <span className="text-[22px] font-extrabold text-gray-900 dark:text-gray-100">
          {props.currency} {new Intl.NumberFormat("ru-RU").format(cost * count)}
        </span>
        <p className="text-sm text-gray-500 mt-1">
          {new Intl.NumberFormat("ru-RU").format(
            Math.round((cost / props.days) * count)
          )}{" "}
          {props.currency} / день •{" "}
          {pluralize(props.days, ["день", "дня", "дней"])}
        </p>
      </div>

      {/* Выбор даты */}
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-vanilla shadow-xs dark:bg-gray-700/40 text-[14px] text-gray-700 dark:text-gray-300 hover:border-lime-green dark:hover:border-blue-400 transition"
        >
          {selectedDate}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
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
          <div className="absolute left-0 right-0 mt-2 bg-vanilla dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 py-2">
            {dates.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  if (d.active) {
                    setSelectedDate(d.range);
                    setDateId(d.id);
                    setIsOpen(false);
                    setCost(d.price);
                  }
                }}
                className={`flex items-center justify-between px-4 py-2 text-[14px] ${
                  d.active
                    ? "cursor-pointer hover:bg-cream dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "cursor-default text-gray-400"
                }`}
              >
                <span>{d.range}</span>

                {d.active ? (
                  <span className="flex items-center gap-2 text-[13px]">
                    <span className="text-lime-green dark:text-blue-400 font-medium">
                      {props.currency}{" "}
                      {new Intl.NumberFormat("ru-RU").format(d.price)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-lime-green dark:text-blue-400 font-medium">
                      {pluralize(d.seats, ["место", "места", "мест"])}
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
      <div className="flex items-center justify-between bg-vanilla shadow-xs dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
        <span className="text-[13px] text-gray-700 dark:text-gray-300">
          Участников
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={count <= 1}
            className="px-2 py-1 cursor-pointer shadow-xl bg-[#f7f7f7] dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            –
          </button>
          <span className="px-2 text-sm font-semibold">{count}</span>
          <button
            onClick={handleIncrease}
            disabled={count == maximumCount}
            className="px-2 py-1 cursor-pointer shadow-xl bg-[#f7f7f7] dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Кнопка перехода */}
      <button
        onClick={() =>
          navigate(`/booking/${props.tourId}`, {
            state: { dateId: dateId },
          })
        }
        className="w-full cursor-pointer bg-sage-green dark:bg-blue-400 hover:bg-cream hover:text-sage-green dark:hover:bg-gray-800 dark:hover:text-blue-400 border-2 border-sage-green dark:border-blue-400 dark:hover:border-blue-400 text-white font-semibold py-2.5 rounded-lg transition"
      >
        Перейти к оплате
      </button>

      {/* Предоплата */}
      <div className="mt-4 text-center text-[13px] text-gray-700 dark:text-gray-300">
        <p className="font-medium mb-1">
          Предоплата —{" "}
          {new Intl.NumberFormat("ru-RU").format(props.prepayment * count)}{" "}
          {props.currency}
        </p>
      </div>
    </div>
  );
}
