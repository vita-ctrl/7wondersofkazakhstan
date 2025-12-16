import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingWidget(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Выберите даты");

  const navigate = useNavigate();
  const dates = props.dates;

  const [dateId, setDateId] = useState(null);
  const [cost, setCost] = useState(props.cost);
  const [maxSeats, setMaxSeats] = useState(props.maxSeats);
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    setCost(props.cost);
  }, [props.cost]);

  const pluralRules = new Intl.PluralRules("ru");

  const pluralize = (n, [one, few, many]) => {
    const rule = pluralRules.select(n);
    if (rule === "one") return `${n} ${one}`;
    if (rule === "few") return `${n} ${few}`;
    return `${n} ${many}`;
  };

  return (
    <div className="font-['Inter'] bg-cream mb-8 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg w-[388px] text-[#001A34] dark:text-gray-100 p-5 transition">
      {/* Цена */}
      <div className="mb-4">
        <span className="text-[22px] font-extrabold text-gray-900 dark:text-gray-100">
          {props.currency}{" "}
          {new Intl.NumberFormat("ru-RU").format(cost * participants)}
        </span>
        <p className="text-sm text-gray-500 mt-1">
          {new Intl.NumberFormat("ru-RU").format(
            Math.round((cost / props.days) * participants)
          )}{" "}
          {props.currency} / день •{" "}
          {pluralize(props.days, ["день", "дня", "дней"])}
        </p>
      </div>

      {/* Выбор даты */}
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-vanilla shadow-xs dark:bg-gray-700/40 text-[14px] text-gray-700 dark:text-gray-300 transition"
        >
          {selectedDate}
          <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
            <FontAwesomeIcon icon={faChevronDown} />
          </span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-vanilla dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 py-2">
            {dates.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  if (!d.active) return;
                  setSelectedDate(d.range);
                  setDateId(d.id);
                  setMaxSeats(d.seats);
                  setParticipants(1);
                  setIsOpen(false);
                  setCost(d.price);
                }}
                className={`flex justify-between px-4 py-2 text-[14px] ${
                  d.active
                    ? "cursor-pointer hover:bg-cream dark:hover:bg-gray-700"
                    : "text-gray-400"
                }`}
              >
                <span>{d.range}</span>
                {d.active ? (
                  <span className="text-[13px] font-medium">
                    {props.currency}{" "}
                    {new Intl.NumberFormat("ru-RU").format(d.price)} •{" "}
                    {pluralize(d.seats, ["место", "места", "мест"])}
                  </span>
                ) : (
                  <span className="text-[13px]">мест нет</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Участники */}
      <div className="flex justify-between items-center bg-vanilla dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
        <span className="text-[13px]">Участников</span>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => participants > 1 && setParticipants(participants - 1)}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-md"
          >
            –
          </button>
          <span className="text-sm font-semibold">{participants}</span>
          <button
            onClick={() =>
              participants < maxSeats && setParticipants(participants + 1)
            }
            className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-md"
          >
            +
          </button>
        </div>
      </div>

      {/* Кнопка */}
      <button
        disabled={!dateId}
        onClick={() =>
          navigate(`/booking/${props.tourId}`, {
            state: { dateId, participants },
          })
        }
        className="w-full bg-sage-green dark:bg-blue-400 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 transition"
      >
        Перейти к оплате
      </button>

      {/* Предоплата */}
      <div className="mt-4 text-center text-[13px]">
        Предоплата —{" "}
        {new Intl.NumberFormat("ru-RU").format(
          props.prepayment * participants
        )}{" "}
        {props.currency}
      </div>
    </div>
  );
}
