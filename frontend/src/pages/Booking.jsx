import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faClock,
  faHandshake,
  faRotateLeft,
  faCheck,
  faShieldHalved,
  faLock,
  faCreditCard,
  faCalendar,
  faUsers,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { InputMask } from "@react-input/mask";

export default function Booking() {
  const location = useLocation();
  const dateId = location.state?.dateId || null;
  const participants = location.state?.participants || 1;
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!dateId) return <NotFoundPage />;

  useEffect(() => {
    fetch(`/api/tours?tourId=${tourId}`)
      .then((res) => res.json())
      .then((data) => {
        setTour(data); // data - это один тур
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tourId]);

  if (loading) return <LoadingPage />;
  if (!tour) return <NotFoundPage />;

  const date = tour.booking.dates.find((d) => d.id === dateId);
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
  const [completedSections, setCompletedSections] = useState({
    dates: false,
    participants: false,
    payment: false,
  });

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    setAuthChecked(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: {
          redirectUrl: location.pathname + location.search,
          dateId: currentDate.id,
          participants,
        },
      });
    }

    if (user) {
      setPrimary({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [
    authChecked,
    isAuthenticated,
    navigate,
    location,
    currentDate.id,
    participants,
  ]);

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
    setOpenTraveler(null);
  }, [participants]);

  const [primary, setPrimary] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardFocused, setCardFocused] = useState("");

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
  const [focusedField, setFocusedField] = useState("");

  const validatePrimary = () => {
    const newErrors = {};

    if (!primary.firstName.trim()) newErrors.firstName = "Введите имя";
    if (!primary.lastName.trim()) newErrors.lastName = "Введите фамилию";

    if (!primary.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email)) {
      newErrors.email = "Некорректный email";
    }

    if (
      !primary.phone.trim() ||
      primary.phone.includes("_") ||
      primary.phone.length !== 18
    ) {
      newErrors.phone = "Введите телефон полностью";
    }

    if (!dob || dob.length !== 10 || !isValidBirthDate(dob, 18)) {
      newErrors.dob = "Введите корректную дату рождения";
    }

    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Введите корректный номер карты";
    }

    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = "Введите срок действия в формате ММ/ГГ";
    }

    if (!cardCVC || cardCVC.length !== 3) {
      newErrors.cardCVC = "Введите CVC код";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const returnIdtoScroll = () => {
    const primaryInvalid =
      !primary.firstName.trim() ||
      !primary.lastName.trim() ||
      !primary.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email) ||
      !primary.phone.trim() ||
      primary.phone.includes("_") ||
      primary.phone.length !== 18 ||
      !dob ||
      dob.length !== 10 ||
      !isValidBirthDate(dob, 18);

    if (primaryInvalid) return "top";

    const cardInvalid =
      !cardNumber ||
      cardNumber.replace(/\s/g, "").length !== 16 ||
      !cardExpiry ||
      !/^\d{2}\/\d{2}$/.test(cardExpiry) ||
      !cardCVC ||
      cardCVC.length !== 3;

    if (cardInvalid) return "card";

    return null;
  };

  // Проверка заполненности секций
  useEffect(() => {
    const datesComplete = selectedDate && currentDate;
    const participantsComplete =
      primary.firstName &&
      primary.lastName &&
      primary.email &&
      primary.phone &&
      dob &&
      gender;
    const paymentComplete = cardNumber && cardExpiry && cardCVC;

    setCompletedSections({
      dates: datesComplete,
      participants: participantsComplete,
      payment: paymentComplete,
    });
  }, [
    selectedDate,
    currentDate,
    primary,
    dob,
    gender,
    cardNumber,
    cardExpiry,
    cardCVC,
  ]);

  // Определение типа карты
  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5")) return "mastercard";
    if (cleaned.startsWith("2")) return "mir";
    return "unknown";
  };

  return (
    <div id="top" className="min-h-screen pt-20 pb-10 px-5 bg-linear-to-br from-vanilla via-cream to-vanilla dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Прогресс бар */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-700 rounded-full -z-10">
            <div
              className="h-full bg-linear-to-r from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (Object.values(completedSections).filter(Boolean).length /
                    3) *
                  100
                }%`,
              }}
            />
          </div>

          {[
            { name: "Даты", icon: faCalendar, key: "dates" },
            { name: "Участники", icon: faUsers, key: "participants" },
            { name: "Оплата", icon: faCreditCard, key: "payment" },
          ].map((step, index) => (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  completedSections[step.key]
                    ? "bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 text-white scale-110"
                    : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600"
                }`}
              >
                {completedSections[step.key] ? (
                  <FontAwesomeIcon icon={faCheck} className="text-sm" />
                ) : (
                  <FontAwesomeIcon icon={step.icon} className="text-sm" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  completedSections[step.key]
                    ? "text-lime-green dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Секция дат */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 dark:border dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-white text-sm"
                  />
                </div>
                <p className="font-bold text-2xl text-olive-dark dark:text-gray-100">
                  Выберите даты
                </p>
              </div>
              {completedSections.dates && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-lime-green dark:text-blue-400 text-2xl animate-pulse"
                />
              )}
            </div>

            <div className="flex z-2 gap-6 flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl px-5 py-4 bg-white shadow-md dark:bg-gray-700/40 text-base text-gray-700 dark:text-gray-300 hover:border-lime-green dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span className="font-medium">{selectedDate}</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-10 py-2 animate-fadeIn">
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
                          className={`flex items-center justify-between px-5 py-3 text-base transition-all duration-200 ${
                            d.active
                              ? "cursor-pointer hover:bg-cream dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:translate-x-1"
                              : "cursor-not-allowed text-gray-400 opacity-50"
                          } ${
                            d.id === currentDate.id
                              ? "bg-cream dark:bg-gray-700"
                              : ""
                          }`}
                        >
                          <span className="font-medium">{d.range}</span>

                          {d.active ? (
                            <span className="flex items-center gap-3 text-sm">
                              <span className="text-lime-green dark:text-blue-400 font-semibold">
                                {props.currency}{" "}
                                {new Intl.NumberFormat("ru-RU").format(d.price)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-lime-green dark:text-blue-400 font-semibold">
                                {pluralize(d.seats, ["место", "места", "мест"])}
                              </span>
                            </span>
                          ) : (
                            <span className="text-red-500 text-sm font-medium">
                              мест нет
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:block w-px bg-linear-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

              <div className="space-y-3 w-full md:w-1/2 p-5 rounded-xl shadow-md border-2 border-gray-300 dark:border-gray-600 bg-linear-to-br from-white to-cream dark:from-gray-700/40 dark:to-gray-800/40">
                <p className="text-base text-gray-700 dark:text-gray-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-lime-green/20 dark:bg-blue-400/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      className="text-lime-green dark:text-blue-400"
                      icon={faHandshake}
                    />
                  </div>
                  <span className="font-medium">Гарантия проведения</span>
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-lime-green/20 dark:bg-blue-400/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      className="text-lime-green dark:text-blue-400"
                      icon={faRotateLeft}
                    />
                  </div>
                  <span className="font-medium">
                    Полный возврат в течение 24 часов
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Секция участников */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 dark:border dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-white text-sm"
                  />
                </div>
                <p className="font-bold text-2xl text-olive-dark dark:text-gray-100">
                  Участники
                </p>
              </div>
              <div className="flex items-center gap-4">
                {completedSections.participants && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-lime-green dark:text-blue-400 text-2xl animate-pulse"
                  />
                )}
                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-xl p-2 shadow-md">
                  <button
                    onClick={handleDecrease}
                    disabled={participants <= 1}
                    className="w-10 h-10 cursor-pointer shadow-md bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg hover:from-lime-green hover:to-sage-green dark:hover:from-blue-400 dark:hover:to-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 font-bold text-lg"
                  >
                    –
                  </button>
                  <span className="px-4 text-lg font-bold text-olive-dark dark:text-gray-100 min-w-8 text-center">
                    {participants}
                  </span>
                  <button
                    onClick={handleIncrease}
                    disabled={participants == maxSeats}
                    className="w-10 h-10 cursor-pointer shadow-md bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg hover:from-lime-green hover:to-sage-green dark:hover:from-blue-400 dark:hover:to-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 dark:border-amber-600 rounded-lg p-4 mb-6">
              <p className="text-amber-800 dark:text-amber-200 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationCircle} />
                Основной путешественник
                <span className="text-red-600 dark:text-red-400">*</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <input
                  value={primary.firstName}
                  onChange={(e) =>
                    setPrimary({ ...primary, firstName: e.target.value })
                  }
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Имя"
                  className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.firstName
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "firstName"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none disabled:opacity-50 transform hover:scale-[1.02]`}
                />
                {errors.firstName && (
                  <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  value={primary.lastName}
                  onChange={(e) =>
                    setPrimary({ ...primary, lastName: e.target.value })
                  }
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Фамилия"
                  className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.lastName
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "lastName"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none disabled:opacity-50 transform hover:scale-[1.02]`}
                />
                {errors.lastName && (
                  <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  value={primary.email}
                  onChange={(e) =>
                    setPrimary({ ...primary, email: e.target.value })
                  }
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Email"
                  className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.email
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "email"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none disabled:opacity-50 transform hover:scale-[1.02]`}
                />
                {errors.email && (
                  <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <InputMask
                  mask="+7 (7__) ___-__-__"
                  replacement={{ _: /\d/ }}
                  value={primary.phone}
                  onChange={(e) =>
                    setPrimary({ ...primary, phone: e.target.value })
                  }
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Телефон"
                  className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.phone
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "phone"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none disabled:opacity-50 transform hover:scale-[1.02]`}
                />
                {errors.phone && (
                  <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="relative">
                <InputMask
                  mask="dd.mm.yyyy"
                  replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                  value={dob}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length === 10) {
                      if (isValidBirthDate(value, 18)) {
                        setDob(value);
                      }
                    } else {
                      setDob(value);
                    }
                  }}
                  onFocus={() => setFocusedField("dob")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Дата рождения"
                  className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.dob
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "dob"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none disabled:opacity-50 transform hover:scale-[1.02]`}
                />
                {errors.dob && (
                  <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errors.dob}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-forest-dark dark:text-taupe py-4 px-5 shadow-md hover:shadow-lg transition-all">
                <label className="flex items-center gap-3 pr-6 border-r border-gray-300 dark:border-gray-600 text-base cursor-pointer hover:text-lime-green dark:hover:text-blue-400 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className="appearance-none h-6 w-6 rounded-full 
                        border-2 border-gray-400 bg-forest-dark/10
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1.5
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-lime-green dark:checked:before:bg-blue-400
                        checked:border-lime-green dark:checked:border-blue-400
                        transition-all duration-300"
                  />
                  Мужской
                </label>

                <label className="flex items-center gap-3 pl-6 text-base cursor-pointer hover:text-lime-green dark:hover:text-blue-400 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="appearance-none h-6 w-6 rounded-full 
                        border-2 border-gray-400 bg-forest-dark/10
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1.5
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-lime-green dark:checked:before:bg-blue-400
                        checked:border-lime-green dark:checked:border-blue-400
                        transition-all duration-300"
                  />
                  Женский
                </label>
              </div>

              {travelers.map((t, index) => {
                const isOpenBlock = openTraveler === t.id;

                return (
                  <div
                    key={t.id}
                    className="col-span-full w-full bg-linear-to-br from-white to-cream dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg dark:border dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setOpenTraveler(isOpenBlock ? null : t.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-olive-dark text-lg font-semibold dark:text-gray-100">
                          {t.id}-й путешественник
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            Необязательно
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isOpenBlock
                                ? "bg-lime-green dark:bg-blue-400 rotate-90"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              className={`text-sm ${
                                isOpenBlock
                                  ? "text-white"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpenBlock
                          ? "max-h-[1000px] opacity-100 mt-6"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          value={t.firstName}
                          onChange={(e) => {
                            const updated = [...travelers];
                            updated[index].firstName = e.target.value;
                            setTravelers(updated);
                          }}
                          placeholder="Имя"
                          className="p-4 text-base rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 border-transparent hover:border-lime-green dark:hover:border-blue-400
                           focus:border-lime-green dark:focus:border-blue-400
                           focus:outline-none transition-all"
                        />

                        <input
                          value={t.lastName}
                          onChange={(e) => {
                            const updated = [...travelers];
                            updated[index].lastName = e.target.value;
                            setTravelers(updated);
                          }}
                          placeholder="Фамилия"
                          className="p-4 text-base rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 border-transparent hover:border-lime-green dark:hover:border-blue-400
                           focus:border-lime-green dark:focus:border-blue-400
                           focus:outline-none transition-all"
                        />

                        <InputMask
                          mask="dd.mm.yyyy"
                          replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                          value={t.dob}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updated = [...travelers];

                            if (value.length === 10) {
                              if (isValidBirthDate(value)) {
                                updated[index].dob = value;
                              }
                            } else {
                              updated[index].dob = value;
                            }

                            setTravelers(updated);
                          }}
                          placeholder="Дата рождения"
                          className="p-4 text-base rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 border-transparent hover:border-lime-green dark:hover:border-blue-400
                           focus:border-lime-green dark:focus:border-blue-400
                           focus:outline-none transition-all"
                        />

                        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-forest-dark dark:text-taupe py-3 px-4 shadow-md">
                          <label className="flex items-center gap-2 pr-4 border-r border-gray-300 dark:border-gray-600 text-sm cursor-pointer">
                            <input
                              type="radio"
                              checked={t.gender === "male"}
                              onChange={() => {
                                const updated = [...travelers];
                                updated[index].gender = "male";
                                setTravelers(updated);
                              }}
                              className="appearance-none h-5 w-5 rounded-full 
                        border-2 border-gray-400 bg-forest-dark/10
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-lime-green dark:checked:before:bg-blue-400
                        checked:border-lime-green dark:checked:border-blue-400"
                            />
                            Мужской
                          </label>

                          <label className="flex items-center gap-2 pl-4 text-sm cursor-pointer">
                            <input
                              type="radio"
                              checked={t.gender === "female"}
                              onChange={() => {
                                const updated = [...travelers];
                                updated[index].gender = "female";
                                setTravelers(updated);
                              }}
                              className="appearance-none h-5 w-5 rounded-full 
                        border-2 border-gray-400 bg-forest-dark/10
                        relative cursor-pointer
                        before:content-[''] before:absolute before:inset-1
                        before:rounded-full before:bg-gray-400
                        checked:before:bg-lime-green dark:checked:before:bg-blue-400
                        checked:border-lime-green dark:checked:border-blue-400"
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

          {/* Секция оплаты */}
          <div
            id="card"
            className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 dark:border dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="text-white text-sm"
                  />
                </div>
                <p className="font-bold text-2xl text-olive-dark dark:text-gray-100">
                  Оплата
                  <span className="text-red-600 dark:text-red-400 ml-1">*</span>
                </p>
              </div>
              {completedSections.payment && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-lime-green dark:text-blue-400 text-2xl animate-pulse"
                />
              )}
            </div>

            {/* Визуализация карты */}
            <div className="mb-8 relative">
              <div
                className={`w-full h-52 rounded-2xl shadow-2xl p-6 relative overflow-hidden transition-all duration-500 transform ${
                  cardFocused
                    ? "scale-105 rotate-y-180"
                    : "scale-100 hover:scale-105"
                } ${
                  getCardType(cardNumber) === "visa"
                    ? "bg-linear-to-br from-blue-600 via-blue-700 to-blue-900"
                    : getCardType(cardNumber) === "mastercard"
                    ? "bg-linear-to-br from-red-600 via-orange-600 to-yellow-600"
                    : getCardType(cardNumber) === "mir"
                    ? "bg-linear-to-br from-green-600 via-emerald-600 to-teal-700"
                    : "bg-linear-to-br from-gray-700 via-gray-800 to-gray-900"
                }`}
              >
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

                {/* Чип карты */}
                <div className="w-12 h-10 bg-linear-to-br from-yellow-200 to-yellow-400 rounded-lg mb-6 shadow-lg" />

                {/* Номер карты */}
                <div className="text-white text-xl font-mono tracking-widest mb-4 drop-shadow-lg">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>

                {/* Имя и срок */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-white/70 text-xs mb-1">CARD HOLDER</div>
                    <div className="text-white text-sm font-semibold">
                      {primary.firstName && primary.lastName
                        ? `${primary.firstName} ${primary.lastName}`.toUpperCase()
                        : "YOUR NAME"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-xs mb-1">VALID THRU</div>
                    <div className="text-white text-sm font-semibold">
                      {cardExpiry || "••/••"}
                    </div>
                  </div>
                </div>

                {/* Логотип платежной системы */}
                <div className="absolute bottom-6 right-6">
                  {getCardType(cardNumber) === "visa" && (
                    <div className="text-white text-2xl font-bold italic">VISA</div>
                  )}
                  {getCardType(cardNumber) === "mastercard" && (
                    <div className="flex gap-1">
                      <div className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
                      <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80 -ml-3" />
                    </div>
                  )}
                  {getCardType(cardNumber) === "mir" && (
                    <div className="text-white text-2xl font-bold">МИР</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="relative">
                <InputMask
                  mask="0000 0000 0000 0000"
                  replacement={{ 0: /\d/ }}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  onFocus={() => {
                    setCardFocused("number");
                    setFocusedField("cardNumber");
                  }}
                  onBlur={() => {
                    setCardFocused("");
                    setFocusedField("");
                  }}
                  placeholder="Номер карты"
                  className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.cardNumber
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "cardNumber"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none transform hover:scale-[1.02]`}
                />
                {errors.cardNumber && (
                  <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="flex gap-5">
                <div className="w-full relative">
                  <InputMask
                    mask="00/00"
                    replacement={{ 0: /\d/ }}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    onFocus={() => {
                      setCardFocused("expiry");
                      setFocusedField("cardExpiry");
                    }}
                    onBlur={() => {
                      setCardFocused("");
                      setFocusedField("");
                    }}
                    placeholder="ММ/ГГ"
                    className={`p-4 w-full text-base rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.cardExpiry
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "cardExpiry"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none transform hover:scale-[1.02]`}
                  />
                  {errors.cardExpiry && (
                    <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {errors.cardExpiry}
                    </p>
                  )}
                </div>
                <div className="w-full relative">
                  <InputMask
                    mask="000"
                    replacement={{ 0: /\d/ }}
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value)}
                    onFocus={() => {
                      setCardFocused("cvc");
                      setFocusedField("cardCVC");
                    }}
                    onBlur={() => {
                      setCardFocused("");
                      setFocusedField("");
                    }}
                    placeholder="CVC"
                    className={`p-4 w-full text-base rounded-xl bg-white dark:bg-gray-900 
                           text-forest-dark dark:text-taupe shadow-md
                           placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
                           border-2 transition-all duration-300
                           ${
                             errors.cardCVC
                               ? "border-red-500 dark:border-red-400"
                               : focusedField === "cardCVC"
                               ? "border-lime-green dark:border-blue-400 shadow-lg"
                               : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                           }
                           focus:outline-none transform hover:scale-[1.02]`}
                  />
                  {errors.cardCVC && (
                    <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {errors.cardCVC}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Безопасность */}
            <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="text-green-600 dark:text-green-400 text-xl"
              />
              <div>
                <p className="text-green-800 dark:text-green-200 font-semibold text-sm">
                  Безопасная оплата
                </p>
                <p className="text-green-600 dark:text-green-400 text-xs">
                  Ваши данные защищены SSL-шифрованием
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - итоговая информация */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            {/* Блок информации о туре */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 dark:border dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-lime-green dark:text-blue-400"
                />
                <h3 className="text-gray-700 dark:text-gray-200 font-bold text-lg">
                  Ваше путешествие
                </h3>
              </div>

              <div className="flex gap-4 items-start">
                <img
                  src={props.tourImage}
                  alt="tour"
                  className="w-24 h-20 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-olive-dark dark:text-gray-100 mb-2 leading-tight">
                    {props.title}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-lime-green dark:text-blue-400"
                      />
                      {currentDate.range}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-lime-green dark:text-blue-400"
                      />
                      {pluralize(props.days, ["день", "дня", "дней"])}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок расчета цены */}
            <div className="bg-linear-to-br from-white to-cream dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-2xl shadow-xl p-6 dark:border-2 dark:border-gray-700">
              {/* Детализация */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
                  <span>
                    {props.currency}{" "}
                    {new Intl.NumberFormat("ru-RU").format(currentDate.price)} ×{" "}
                    {pluralize(participants, [
                      "участник",
                      "участника",
                      "участников",
                    ])}
                  </span>
                  <span className="font-semibold">
                    {props.currency}{" "}
                    {new Intl.NumberFormat("ru-RU").format(
                      currentDate.price * participants
                    )}
                  </span>
                </div>

                {/* Итого */}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-700 dark:text-gray-100">Итого</span>
                  <span className="text-forest-dark dark:text-gray-100 text-2xl">
                    {props.currency}{" "}
                    {new Intl.NumberFormat("ru-RU").format(
                      currentDate.price * participants
                    )}
                  </span>
                </div>

                {/* К оплате */}
                <div className="bg-linear-to-r from-lime-green/10 to-sage-green/10 dark:from-blue-400/10 dark:to-blue-600/10 rounded-xl p-4 border-2 border-lime-green/30 dark:border-blue-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        К оплате сейчас
                      </p>
                      <p className="text-2xl font-bold text-lime-green dark:text-blue-400">
                        {props.currency}{" "}
                        {new Intl.NumberFormat("ru-RU").format(
                          props.prepayment * participants
                        )}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-lime-green dark:text-blue-400 text-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Кнопка оплаты */}
              <button
                onClick={() => {
                  if (!validatePrimary()) {
                    const formElement = document.getElementById(
                      returnIdtoScroll()
                    );
                    if (formElement) {
                      formElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                    return;
                  }
                  // переход к оплате
                }}
                className="w-full cursor-pointer py-4 rounded-xl font-bold text-lg
                         bg-linear-to-r from-lime-green to-sage-green 
                         dark:from-blue-400 dark:to-blue-600
                         text-white shadow-lg hover:shadow-2xl
                         transform hover:scale-105 hover:-translate-y-1
                         transition-all duration-300
                         flex items-center justify-center gap-3
                         group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FontAwesomeIcon icon={faLock} />
                  Оплатить {props.currency}{" "}
                  {new Intl.NumberFormat("ru-RU").format(
                    props.prepayment * participants
                  )}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-sage-green to-forest-dark dark:from-blue-600 dark:to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Гарантии */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <span>Безопасная оплата</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon
                      icon={faRotateLeft}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span>100% возврат в течение 24 часов</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon
                      icon={faHandshake}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <span>Гарантия проведения тура</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS для анимаций */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}