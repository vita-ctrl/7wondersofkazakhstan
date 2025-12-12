import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faClock,
  faHandshake,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { InputMask } from "@react-input/mask";

export default function Booking() {
  const location = useLocation();
  const dateId = location.state?.dateId || null;
  const participants = location.state?.participants || 1;
  const { tourId } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  if (!dateId) return <NotFoundPage />;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    fetch("/tours/tours.json")
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  if (loading) return <LoadingPage />;
  const tour = tours.find((t) => t.id === tourId);
  if (!tour) return <NotFoundPage />;
  const date = tour.booking.dates.find((t) => t.id === dateId);
  if (!date) return <NotFoundPage />;
  return (
    <BookingDetail
      dateId={dateId}
      currentDate={date}
      {...tour.booking}
      tourImage={tour.images[0]}
      title={tour.title}
      participants={participants}
    />
  );
}

function BookingDetail(props) {
  const [currentDate, setCurrentDate] = useState(props.currentDate);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentDate.range);
  const dates = props.dates;

  const handleDecrease = () => {
    if (participants > 1) {
      setParticipants(participants - 1);
    }
  };

  const handleIncrease = () => {
    setParticipants(participants + 1);
  };

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

  const [maxSeats, setMaxSeats] = useState(props.maxSeats);
  const [participants, setParticipants] = useState(props.participants);
  const [travelers, setTravelers] = useState([]);
  const [openTraveler, setOpenTraveler] = useState(null);

  useEffect(() => {
    const newTravelers = [];

    for (let i = 2; i <= participants; i++) {
      newTravelers.push({
        id: i,
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
      });
    }

    setTravelers(newTravelers);
    setOpenTraveler(null); // при изменении количества — свернуть всех
  }, [participants]);

  const [primary, setPrimary] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [dob, setDob] = useState("");

  const [gender, setGender] = useState("male");

  const isValidDate = (str) => {
    const [dd, mm, yyyy] = str.split(".").map(Number);
    if (!dd || !mm || !yyyy) return false;

    const date = new Date(yyyy, mm - 1, dd);

    return (
      date.getFullYear() === yyyy &&
      date.getMonth() === mm - 1 &&
      date.getDate() === dd
    );
  };

  const isValidBirthDate = (str, minAge = 4) => {
    if (!isValidDate(str)) return false;

    const [_, __, yyyy] = str.split(".").map(Number);
    const now = new Date();

    const age = now.getFullYear() - yyyy;
    if (age < minAge || age > 120) return false;

    return true;
  };
  const [errors, setErrors] = useState({});
  const validatePrimary = () => {
    const newErrors = {};

    if (!primary.firstName.trim()) newErrors.firstName = "Введите имя";
    if (!primary.lastName.trim()) newErrors.lastName = "Введите фамилию";

    if (!primary.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email)) {
      newErrors.email = "Некорректный email";
    }

    if (!primary.phone.trim() || primary.phone.includes("_")) {
      newErrors.phone = "Введите телефон полностью";
    }

    if (!dob || dob.length !== 10 || !isValidBirthDate(dob, 18)) {
      newErrors.dob = "Введите корректную дату рождения";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // true если ошибок нет
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-5">
      <div className="grid grid-cols-12 gap-20 max-w-7xl mx-auto ">
        <div className="col-span-8">
          <div className="bg-cream dark:bg-gray-800 rounded-xl shadow-xl p-6 dark:border dark:border-gray-700 mb-6">
            <p className="font-semibold text-lg text-olive-dark dark:text-gray-100 mb-2">
              Даты
            </p>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="w-full md:w-1/2 flex self-start">
                {/* Выбор даты */}
                <div className="relative w-full">
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
                              setCurrentDate(d);
                              setMaxSeats(d.seats);
                              setParticipants(1);
                              setIsOpen(false);
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
                            <span className="text-gray-400 text-[13px]">
                              мест нет
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="self-stretch w-px bg-gray-300 dark:bg-gray-600" />
              <div className="space-y-1.5 w-full md:w-1/2 p-3 rounded-lg shadow-xs border border-gray-300 dark:border-gray-600 bg-vanilla dark:bg-gray-700/40 text-gray-700 dark:text-gray-300">
                <p className="text-base text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon
                    className="text-lg text-forest-dark dark:text-blue-400"
                    icon={faHandshake}
                  />{" "}
                  Гарантия проведения
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon
                    className="text-lg text-forest-dark dark:text-blue-400"
                    icon={faRotateLeft}
                  />{" "}
                  Полный возврат в течение 24 часов
                </p>
              </div>
            </div>
          </div>
          <div className="bg-cream dark:bg-gray-800 rounded-xl shadow-xl p-6 dark:border dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-lg text-olive-dark dark:text-gray-100">
                Участники
              </p>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <button
                  onClick={handleDecrease}
                  disabled={participants <= 1}
                  className="px-2 py-1 cursor-pointer shadow-xl bg-[#f7f7f7] dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  –
                </button>
                <span className="px-2 text-sm font-semibold">
                  {participants}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={participants == maxSeats}
                  className="px-2 py-1 cursor-pointer shadow-xl bg-[#f7f7f7] dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-olive-dark dark:text-gray-100">
              Основной путешественник
              <span className="select-none text-red-600">*</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <input
                  value={primary.firstName}
                  onChange={(e) =>
                    setPrimary({ ...primary, firstName: e.target.value })
                  }
                  placeholder="Имя"
                  className="p-3 w-full rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-500 text-xs ml-2">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <input
                  value={primary.lastName}
                  onChange={(e) =>
                    setPrimary({ ...primary, lastName: e.target.value })
                  }
                  placeholder="Фамилия"
                  className="p-3 w-full rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-500 text-xs ml-2">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <input
                  value={primary.email}
                  onChange={(e) =>
                    setPrimary({ ...primary, email: e.target.value })
                  }
                  placeholder="Email"
                  className="p-3 w-full rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-xs ml-2">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <InputMask
                  mask="+7 (7__) ___-__-__"
                  replacement={{ _: /\d/ }}
                  value={primary.phone}
                  onChange={(e) =>
                    setPrimary({ ...primary, phone: e.target.value })
                  }
                  placeholder="Телефон"
                  className="p-3 w-full rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                />
                {errors.phone && (
                  <p className="mt-1 text-red-500 text-xs ml-2">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <InputMask
                  mask="dd.mm.yyyy"
                  replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                  value={dob}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Если формат заполнен полностью
                    if (value.length === 10) {
                      if (isValidBirthDate(value, 18)) {
                        setDob(value);
                      }
                      // если дата невалидная — не меняем состояние (старое значение)
                    } else {
                      // позволяем ввод до полного формата
                      setDob(value);
                    }
                  }}
                  placeholder="Дата рождения"
                  className="p-3 w-full rounded-xl bg-vanilla dark:bg-[#1a2435] 
             text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
             placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
             border border-transparent focus:border-forest-dark dark:focus:border-blue-400
             focus:outline-none transition-all disabled:opacity-50"
                />
                {errors.dob && (
                  <p className="mt-1 text-red-500 text-xs ml-2">
                    {errors.dob}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center bg-cream dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 text-forest-dark dark:text-taupe py-3 px-4 w-fit h-fit">
                <label className="flex items-center gap-2 pr-6 border-r border-gray-300 dark:border-gray-600">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className="appearance-none h-5 w-5 rounded-full 
                        border border-gray-400 bg-forest-dark/20
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-forest-dark dark:checked:before:bg-blue-400"
                  />{" "}
                  Мужской
                </label>

                <label className="flex items-center gap-2 pl-6">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="appearance-none h-5 w-5 rounded-full 
                        border border-gray-400 bg-forest-dark/20
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-forest-dark dark:checked:before:bg-blue-400"
                  />{" "}
                  Женский
                </label>
              </div>
              {travelers.map((t, index) => {
                const isOpenBlock = openTraveler === t.id;

                return (
                  <div
                    key={t.id}
                    className="col-span-full w-full mt-6 bg-cream dark:bg-gray-800 rounded-xl shadow-xl dark:border dark:border-gray-700 p-6"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => setOpenTraveler(isOpenBlock ? null : t.id)}
                    >
                      {/* Заголовок */}
                      <div className="flex items-center justify-between">
                        <p className="text-olive-dark dark:text-gray-100">
                          {t.id}-й путешественник
                        </p>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-8">
                            Необязательно к заполнению
                          </span>
                          {/* Стрелка */}
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className={`text-gray-500 duration-300 transition-transform ${
                              isOpenBlock ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Контент */}
                    <div
                      className={`overflow-hidden transition-all duration-400 ${
                        isOpenBlock
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className=" mt-4 grid grid-cols-2 gap-4 text-sm">
                        <input
                          value={t.firstName}
                          onChange={(e) => {
                            const updated = [...travelers];
                            updated[index].firstName = e.target.value;
                            setTravelers(updated);
                          }}
                          placeholder="Имя"
                          className="p-3 rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                        />

                        <input
                          value={t.lastName}
                          onChange={(e) => {
                            const updated = [...travelers];
                            updated[index].lastName = e.target.value;
                            setTravelers(updated);
                          }}
                          placeholder="Фамилия"
                          className="p-3 rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                        />

                        <InputMask
                          mask="dd.mm.yyyy"
                          replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                          value={t.dob}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updated = [...travelers];

                            // Если дата введена полностью
                            if (value.length === 10) {
                              if (isValidBirthDate(value)) {
                                updated[index].dob = value; // сохраняем
                              }
                              // если невалидная — НЕ перезаписываем (оставляем старую)
                            } else {
                              // пока ввод не закончен — позволяем менять
                              updated[index].dob = value;
                            }

                            setTravelers(updated);
                          }}
                          placeholder="Дата рождения"
                          className="p-3 rounded-xl bg-vanilla dark:bg-[#1a2435] 
                           text-forest-dark dark:text-taupe shadow-xs focus:shadow-xl
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border border-transparent focus:border-forest-dark dark:focus:border-blue-400
                           focus:outline-none transition-all disabled:opacity-50"
                        />

                        {/* Пол */}
                        <div className="flex items-center justify-center bg-cream dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 text-forest-dark dark:text-taupe py-3 px-4 w-fit h-fit">
                          <label className="flex items-center gap-2 pr-6 border-r border-gray-300 dark:border-gray-600">
                            <input
                              type="radio"
                              checked={t.gender === "male"}
                              onChange={() => {
                                const updated = [...travelers];
                                updated[index].gender = "male";
                                setTravelers(updated);
                              }}
                              className="appearance-none h-5 w-5 rounded-full 
                        border border-gray-400 bg-forest-dark/20
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-forest-dark dark:checked:before:bg-blue-400"
                            />
                            Мужской
                          </label>

                          <label className="flex items-center gap-2 pl-6">
                            <input
                              type="radio"
                              checked={t.gender === "female"}
                              onChange={() => {
                                const updated = [...travelers];
                                updated[index].gender = "female";
                                setTravelers(updated);
                              }}
                              className="appearance-none h-5 w-5 rounded-full 
                        border border-gray-400 bg-forest-dark/20
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-forest-dark dark:checked:before:bg-blue-400"
                            />
                            Женский
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-cream dark:bg-gray-800 rounded-xl shadow-xl p-6 dark:border dark:border-gray-700"></div>
        </div>
        <div className="col-span-4">
          <div className="sticky top-18">
            {/* Блок данных о путешествии */}
            <div className="bg-cream dark:bg-gray-800 rounded-xl shadow-xl p-4 dark:border dark:border-gray-700 mb-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-gray-700 dark:text-gray-200 font-medium">
                  Ваше путешествие
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src={props.tourImage}
                  alt="tour"
                  className="w-22 h-15 object-cover rounded"
                />
                <div>
                  <div className="font-semibold text-olive-dark dark:text-gray-100">
                    {props.title}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {currentDate.range}
                  </span>
                  <FontAwesomeIcon
                    className="text-sm text-gray-600 dark:text-gray-300 lg:ml-4"
                    icon={faClock}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {" "}
                    {pluralize(props.days, ["день", "дня", "дней"])}
                  </span>
                </div>
              </div>
            </div>

            {/* Блок цены */}
            <div className="bg-cream dark:bg-gray-800 rounded-xl shadow-xl p-4 dark:border dark:border-gray-700">
              {/* Цена × участники */}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {props.currency}{" "}
                {new Intl.NumberFormat("ru-RU").format(currentDate.price)} ×{" "}
                {pluralize(participants, [
                  "участник",
                  "участника",
                  "участников",
                ])}
              </div>

              {/* Итого */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-gray-700 dark:text-gray-100 font-semibold">
                  Итого
                </div>
                <div className="font-semibold text-forest-dark dark:text-gray-100">
                  {props.currency}{" "}
                  {new Intl.NumberFormat("ru-RU").format(
                    currentDate.price * participants
                  )}
                </div>
              </div>

              {/* К оплате сейчас */}
              <div className="mt-3 flex items-center justify-between border-t pt-3 border-dashed border-gray-600 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-100">
                  К оплате сейчас
                </div>
                <div className="font-semibold text-forest-dark dark:text-gray-100">
                  {props.currency}{" "}
                  {new Intl.NumberFormat("ru-RU").format(
                    props.prepayment * participants
                  )}
                </div>
              </div>

              {/* Кнопка */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (!validatePrimary()) {
                      // Скроллим к форме

                      return;
                    }
                  }}
                  className="w-full cursor-pointer py-2.5 rounded-xl bg-sage-green border-2 border-sage-green dark:border-blue-400 hover:bg-cream dark:hover:bg-gray-800 dark:bg-blue-400 hover:text-sage-green dark:hover:text-blue-400 text-white font-semibold transition duration-300"
                >
                  Перейти к оплате {props.currency}{" "}
                  {new Intl.NumberFormat("ru-RU").format(
                    props.prepayment * participants
                  )}
                </button>
              </div>

              {/* Безопасность */}
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                <div>Безопасная оплата</div>
                <div>100% возврат в течение 24 часов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
