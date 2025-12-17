import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../utils/auth";
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
  faXmark,
  faEnvelope,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { InputMask } from "@react-input/mask";

// === УТИЛИТЫ ===
const pluralRules = new Intl.PluralRules("ru");
const pluralize = (n, [one, few, many]) => {
  const rule = pluralRules.select(n);
  return `${n} ${rule === "one" ? one : rule === "few" ? few : many}`;
};

const formatPrice = (price, currency) =>
  `${currency} ${new Intl.NumberFormat("ru-RU").format(price)}`;

const isValidDate = (str) => {
  const [dd, mm, yyyy] = str.split("-").map(Number);
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
  const [, , yyyy] = str.split("-").map(Number);
  const age = new Date().getFullYear() - yyyy;
  return age >= minAge && age <= 120;
};

const getCardType = (number) => {
  const first = number.replace(/\s/g, "")[0];
  return { 4: "visa", 5: "mastercard", 2: "mir" }[first] || "unknown";
};

// === КОМПОНЕНТЫ ===

// Попап успешной оплаты
const SuccessModal = ({
  isOpen,
  tourTitle,
  dateRange,
  participants,
  amount,
  currency,
  email,
  orderNumber
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Оверлей */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
      />

      {/* Модальное окно */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-slideUp overflow-hidden">
        {/* Верхняя полоса */}
        <div className="h-1.5 bg-linear-to-r from-lime-green via-sage-green to-forest-dark dark:from-blue-400 dark:via-blue-500 dark:to-blue-600" />


        {/* Контент */}
        <div className="p-8">
          {/* Иконка успеха */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-white text-3xl"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-md">
                <FontAwesomeIcon
                  icon={faTicket}
                  className="text-lime-green dark:text-blue-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-olive-dark dark:text-gray-100 mb-2">
              Оплата прошла успешно
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ваше бронирование подтверждено
            </p>
          </div>

          {/* Детали заказа */}
          <div className="bg-cream/50 dark:bg-gray-800/50 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {/* Номер заказа */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Номер заказа
                </span>
                <span className="font-mono font-bold text-olive-dark dark:text-gray-100">
                  {orderNumber}
                </span>
              </div>

              {/* Тур */}
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Тур
                </span>
                <span className="text-right font-medium text-olive-dark dark:text-gray-100 max-w-[60%]">
                  {tourTitle}
                </span>
              </div>

              {/* Даты */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Даты
                </span>
                <span className="font-medium text-olive-dark dark:text-gray-100">
                  {dateRange}
                </span>
              </div>

              {/* Участники */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Участники
                </span>
                <span className="font-medium text-olive-dark dark:text-gray-100">
                  {pluralize(participants, ["человек", "человека", "человек"])}
                </span>
              </div>

              {/* Сумма */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Оплачено
                </span>
                <span className="text-xl font-bold text-lime-green dark:text-blue-400">
                  {formatPrice(amount, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Уведомление об email */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-blue-600 dark:text-blue-400 mt-0.5"
            />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Чек и детали бронирования отправлены на
              </p>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {email}
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-olive-dark dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Мои бронирования
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 hover:shadow-lg transition-all duration-200"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({
  error,
  focused,
  onFocus,
  onBlur,
  name,
  mask,
  replacement,
  ...props
}) => {
  const Component = mask ? InputMask : "input";
  const maskProps = mask ? { mask, replacement } : {};

  return (
    <div className="relative">
      <Component
        {...props}
        {...maskProps}
        onFocus={() => onFocus?.(name)}
        onBlur={() => onBlur?.("")}
        className={`p-4 text-base w-full rounded-xl bg-white dark:bg-gray-900 
          text-forest-dark dark:text-taupe shadow-md
          placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60
          border-2 transition-all duration-300 focus:outline-none transform hover:scale-[1.02]
          ${
            error
              ? "border-red-500 dark:border-red-400"
              : focused === name
              ? "border-lime-green dark:border-blue-400 shadow-lg"
              : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
          }`}
      />
      {error && (
        <p className="mt-2 text-red-500 text-sm ml-2 flex items-center gap-2 animate-fadeIn">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </p>
      )}
    </div>
  );
};

const GenderSelector = ({ value, onChange, compact = false }) => {
  const options = [
    { value: "male", label: "Мужской" },
    { value: "female", label: "Женский" },
  ];
  const size = compact
    ? { pad: "py-3 px-4", text: "text-sm", radio: "h-5 w-5", inset: "inset-1" }
    : {
        pad: "py-4 px-5",
        text: "text-base",
        radio: "h-6 w-6",
        inset: "inset-1.5",
      };

  return (
    <div
      className={`flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-forest-dark dark:text-taupe ${size.pad} shadow-md hover:shadow-lg transition-all`}
    >
      {options.map((opt, i) => (
        <label
          key={opt.value}
          className={`flex items-center gap-3 ${
            i === 0
              ? "pr-6 border-r border-gray-300 dark:border-gray-600"
              : "pl-6"
          } ${
            size.text
          } cursor-pointer hover:text-lime-green dark:hover:text-blue-400 transition-colors`}
        >
          <input
            type="radio"
            name={`gender-${compact ? "compact" : "main"}`}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className={`appearance-none ${size.radio} rounded-full border-2 border-gray-400 bg-forest-dark/10 relative cursor-pointer
              before:content-[''] before:absolute before:${size.inset} before:rounded-full before:bg-gray-400
              checked:before:bg-lime-green dark:checked:before:bg-blue-400
              checked:border-lime-green dark:checked:border-blue-400 transition-all duration-300`}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

const ProgressBar = ({ sections }) => {
  const steps = [
    { name: "Даты", icon: faCalendar, key: "dates" },
    { name: "Участники", icon: faUsers, key: "participants" },
    { name: "Оплата", icon: faCreditCard, key: "payment" },
  ];
  const completedCount = Object.values(sections).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-700 rounded-full -z-10">
          <div
            className="h-full bg-linear-to-r from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>
        {steps.map((step) => (
          <div key={step.key} className="flex flex-col items-center z-10">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
              ${
                sections[step.key]
                  ? "bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 text-white scale-110"
                  : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600"
              }`}
            >
              <FontAwesomeIcon
                icon={sections[step.key] ? faCheck : step.icon}
                className="text-sm"
              />
            </div>
            <span
              className={`mt-2 text-xs font-medium transition-colors ${
                sections[step.key]
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
  );
};

const SectionCard = ({ children, id }) => (
  <div
    id={id}
    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 dark:border dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
  >
    {children}
  </div>
);

const SectionHeader = ({ icon, title, required, completed, children }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center">
        <FontAwesomeIcon icon={icon} className="text-white text-sm" />
      </div>
      <p className="font-bold text-2xl text-olive-dark dark:text-gray-100">
        {title}
        {required && (
          <span className="text-red-600 dark:text-red-400 ml-1">*</span>
        )}
      </p>
    </div>
    <div className="flex items-center gap-4">
      {completed && (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-lime-green dark:text-blue-400 text-2xl animate-pulse"
        />
      )}
      {children}
    </div>
  </div>
);

const CreditCardVisual = ({ number, expiry, holderName }) => {
  const type = getCardType(number);
  const gradients = {
    visa: "from-blue-600 via-blue-700 to-blue-900",
    mastercard: "from-red-600 via-orange-600 to-yellow-600",
    mir: "from-green-600 via-emerald-600 to-teal-700",
    unknown: "from-gray-700 via-gray-800 to-gray-900",
  };

  return (
    <div
      className={`w-full h-52 rounded-2xl shadow-2xl p-6 relative overflow-hidden transition-all duration-500 transform hover:scale-105 bg-linear-to-br ${gradients[type]}`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
      <div className="w-12 h-10 bg-linear-to-br from-yellow-200 to-yellow-400 rounded-lg mb-6 shadow-lg" />
      <div className="text-white text-xl font-mono tracking-widest mb-4 drop-shadow-lg">
        {number || "•••• •••• •••• ••••"}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-white/70 text-xs mb-1">CARD HOLDER</div>
          <div className="text-white text-sm font-semibold">
            {holderName || "YOUR NAME"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/70 text-xs mb-1">VALID THRU</div>
          <div className="text-white text-sm font-semibold">
            {expiry || "••/••"}
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-6">
        {type === "visa" && (
          <div className="text-white text-2xl font-bold italic">VISA</div>
        )}
        {type === "mastercard" && (
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
            <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80 -ml-3" />
          </div>
        )}
        {type === "mir" && (
          <div className="text-white text-2xl font-bold">МИР</div>
        )}
      </div>
    </div>
  );
};

const InfoBadge = ({ icon, text, colorClass }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
    <div
      className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shrink-0`}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
    <span>{text}</span>
  </div>
);

const ParticipantCounter = ({ value, min, max, onChange }) => (
  <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-xl p-2 shadow-md">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="w-10 h-10 cursor-pointer shadow-md bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg hover:from-lime-green hover:to-sage-green dark:hover:from-blue-400 dark:hover:to-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 font-bold text-lg"
    >
      –
    </button>
    <span className="px-4 text-lg font-bold text-olive-dark dark:text-gray-100 min-w-8 text-center">
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className="w-10 h-10 cursor-pointer shadow-md bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg hover:from-lime-green hover:to-sage-green dark:hover:from-blue-400 dark:hover:to-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 font-bold text-lg"
    >
      +
    </button>
  </div>
);

// === ГЛАВНЫЙ КОМПОНЕНТ ===
export default function Booking() {
  const { state } = useLocation();
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  const dateId = state?.dateId;
  const initialParticipants = state?.participants || 1;

  useEffect(() => {
    if (!dateId) {
      setLoading(false);
      return;
    }
    fetch(`/api/tours?tourId=${tourId}`)
      .then((res) => res.json())
      .then(setTour)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tourId, dateId]);

  if (loading) return <LoadingPage />;
  if (!dateId || !tour) return <NotFoundPage />;

  const date = tour.booking.dates.find((d) => d.id === dateId);
  if (!date) return <NotFoundPage />;

  return (
    <BookingDetail
      initialDate={date}
      dates={tour.booking.dates}
      currency={tour.booking.currency}
      maxSeats={tour.booking.maxSeats}
      prepayment={tour.booking.prepayment}
      days={tour.booking.days}
      tourImage={tour.images[0]}
      title={tour.title}
      initialParticipants={initialParticipants}
    />
  );
}

function BookingDetail({
  initialDate,
  dates,
  currency,
  maxSeats: initialMaxSeats,
  prepayment,
  days,
  tourImage,
  title,
  initialParticipants,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tourId } = useParams();

  // Состояния даты и участников
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [maxSeats, setMaxSeats] = useState(initialMaxSeats);
  const [participants, setParticipants] = useState(initialParticipants);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Состояния формы
  const [primary, setPrimary] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  // Дополнительные путешественники
  const [travelers, setTravelers] = useState([]);
  const [openTravelerId, setOpenTravelerId] = useState(null);

  // Валидация и UI
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");

  // Аутентификация
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Попап и загрузка
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [submitError, setSubmitError] = useState("");

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      setIsAuthenticated(!!(token && userData));

      if (userData) {
        const user = JSON.parse(userData);
        setPrimary({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
      setAuthChecked(true);
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  // Редирект на логин
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
  }, [
    authChecked,
    isAuthenticated,
    navigate,
    location,
    currentDate.id,
    participants,
  ]);

  // Генерация путешественников
  useEffect(() => {
    setTravelers(
      Array.from({ length: participants - 1 }, (_, i) => ({
        id: i + 2,
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
      }))
    );
    setOpenTravelerId(null);
  }, [participants]);

  // Валидация формы
  const validate = useCallback(() => {
    const newErrors = {};

    if (!primary.firstName.trim()) newErrors.firstName = "Введите имя";
    if (!primary.lastName.trim()) newErrors.lastName = "Введите фамилию";
    if (!primary.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email)) {
      newErrors.email = "Некорректный email";
    }
    if (
      !primary.phone ||
      primary.phone.includes("_") ||
      primary.phone.length !== 18
    ) {
      newErrors.phone = "Введите телефон полностью";
    }
    if (!dob || dob.length !== 10 || !isValidBirthDate(dob, 18)) {
      newErrors.dob = "Введите корректную дату рождения";
    }
    if (card.number.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Введите корректный номер карты";
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      newErrors.cardExpiry = "Введите срок в формате ММ/ГГ";
    }
    if (card.cvc.length !== 3) {
      newErrors.cardCVC = "Введите CVC код";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [primary, dob, card]);

  // Вычисляемые значения
  const completedSections = useMemo(
    () => ({
      dates: !!currentDate,
      participants: !!(
        primary.firstName &&
        primary.lastName &&
        primary.email &&
        primary.phone &&
        dob &&
        gender
      ),
      payment: !!(card.number && card.expiry && card.cvc),
    }),
    [currentDate, primary, dob, gender, card]
  );

  const totalPrice = currentDate.price * participants;
  const payNow = prepayment * participants;
  const holderName = primary.firstName
    ? `${primary.firstName}${
        primary.lastName ? " " + primary.lastName : ""
      }`.toUpperCase()
    : "";

  // Обработчики
  const handleDateSelect = (date) => {
    if (!date.active) return;
    setCurrentDate(date);
    setMaxSeats(date.seats);
    setParticipants(1);
    setIsDateDropdownOpen(false);
  };

  const updatePrimary = (field, value) =>
    setPrimary((prev) => ({ ...prev, [field]: value }));
  const updateCard = (field, value) =>
    setCard((prev) => ({ ...prev, [field]: value }));

  const updateTraveler = (index, field, value) => {
    setTravelers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const convertDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return null;
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      const hasPersonalErrors = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "dob",
      ].some((f) => errors[f]);
      const scrollId = hasPersonalErrors ? "top" : "card";
      document
        .getElementById(scrollId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setIsProcessing(true);

    // Основной путешественник
    const mainTraveler = {
      firstName: primary.firstName,
      lastName: primary.lastName,
      email: primary.email,
      phone: primary.phone,
      dob: convertDate(dob),
      gender: gender,
    };


    // Дополнительные путешественники (только заполненные)
    const additionalTravelers = travelers
      .filter((t) => (t.firstName || t.lastName) && isValidDate(t.dob))
      .map((t) => ({
        firstName: t.firstName,
        lastName: t.lastName,
        dob: isValidDate(t.dob) ? convertDate(t.dob) : null,
        gender: t.gender,
      }));

    let orderData = {
      tour_id: tourId,
      booking_date_id: currentDate.id,
      participants_count: participants,
      primary_traveler: mainTraveler,
      additional_travelers: additionalTravelers,
    };

    // Имитация обработки платежа
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const token = getToken();
      if (!token) return null;

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      const order = await response.json();
      
      setOrderNumber(`TRV-${order.order_id}`);
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen pt-20 pb-10 px-5 bg-linear-to-br from-vanilla via-cream to-vanilla dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <ProgressBar sections={completedSections} />

      {/* Попап успешной оплаты */}
      <SuccessModal
        isOpen={showSuccessModal}
        orderNumber={orderNumber}
        tourTitle={title}
        dateRange={currentDate.range}
        participants={participants}
        amount={payNow}
        currency={currency}
        email={primary.email}
      />

      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Левая колонка */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Секция дат */}
          <SectionCard>
            <SectionHeader
              icon={faCalendar}
              title="Выберите даты"
              completed={completedSections.dates}
            />
            <div className="flex z-2 gap-6 flex-col md:flex-row">
              <div className="w-full md:w-1/2 relative">
                <button
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  className="w-full flex justify-between items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl px-5 py-4 bg-white shadow-md dark:bg-gray-700/40 text-base text-gray-700 dark:text-gray-300 hover:border-lime-green dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span className="font-medium">{currentDate.range}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      isDateDropdownOpen ? "rotate-180" : ""
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

                {isDateDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 py-2 animate-fadeIn">
                    {dates.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleDateSelect(d)}
                        className={`flex items-center justify-between px-5 py-3 text-base transition-all duration-200
                          ${
                            d.active
                              ? "cursor-pointer hover:bg-cream dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:translate-x-1"
                              : "cursor-not-allowed text-gray-400 opacity-50"
                          } 
                          ${
                            d.id === currentDate.id
                              ? "bg-cream dark:bg-gray-700"
                              : ""
                          }`}
                      >
                        <span className="font-medium">{d.range}</span>
                        {d.active ? (
                          <span className="flex items-center gap-3 text-sm">
                            <span className="text-lime-green dark:text-blue-400 font-semibold">
                              {formatPrice(d.price, currency)}
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

              <div className="hidden md:block w-px bg-linear-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

              <div className="space-y-3 w-full md:w-1/2 p-5 rounded-xl shadow-md border-2 border-gray-300 dark:border-gray-600 bg-linear-to-br from-white to-cream dark:from-gray-700/40 dark:to-gray-800/40">
                {[
                  { icon: faHandshake, text: "Гарантия проведения" },
                  {
                    icon: faRotateLeft,
                    text: "Полный возврат в течение 24 часов",
                  },
                ].map(({ icon, text }) => (
                  <p
                    key={text}
                    className="text-base text-gray-700 dark:text-gray-300 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-lime-green/20 dark:bg-blue-400/20 flex items-center justify-center">
                      <FontAwesomeIcon
                        className="text-lime-green dark:text-blue-400"
                        icon={icon}
                      />
                    </div>
                    <span className="font-medium">{text}</span>
                  </p>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Секция участников */}
          <SectionCard>
            <SectionHeader
              icon={faUsers}
              title="Участники"
              completed={completedSections.participants}
            >
              <ParticipantCounter
                value={participants}
                min={1}
                max={maxSeats}
                onChange={setParticipants}
              />
            </SectionHeader>

            <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 dark:border-amber-600 rounded-lg p-4 mb-6">
              <p className="text-amber-800 dark:text-amber-200 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationCircle} />
                Основной путешественник
                <span className="text-red-600 dark:text-red-400">*</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: "firstName", placeholder: "Имя" },
                { name: "lastName", placeholder: "Фамилия" },
                { name: "email", placeholder: "Email" },
                {
                  name: "phone",
                  placeholder: "Телефон",
                  mask: "+7 (7__) ___-__-__",
                  replacement: { _: /\d/ },
                },
              ].map((field) => (
                <FormInput
                  key={field.name}
                  name={field.name}
                  value={primary[field.name]}
                  placeholder={field.placeholder}
                  mask={field.mask}
                  replacement={field.replacement}
                  error={errors[field.name]}
                  focused={focusedField}
                  onFocus={setFocusedField}
                  onBlur={setFocusedField}
                  onChange={(e) => updatePrimary(field.name, e.target.value)}
                />
              ))}

              <FormInput
                name="dob"
                value={dob}
                placeholder="Дата рождения"
                mask="dd-mm-yyyy"
                replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                error={errors.dob}
                focused={focusedField}
                onFocus={setFocusedField}
                onBlur={setFocusedField}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length === 10 && !isValidBirthDate(value, 18))
                    return;
                  setDob(value);
                }}
              />

              <GenderSelector value={gender} onChange={setGender} />

              {/* Дополнительные путешественники */}
              {travelers.map((traveler, index) => {
                const isOpen = openTravelerId === traveler.id;
                return (
                  <div
                    key={traveler.id}
                    className="col-span-full w-full bg-linear-to-br from-white to-cream dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg dark:border dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setOpenTravelerId(isOpen ? null : traveler.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-olive-dark text-lg font-semibold dark:text-gray-100">
                          {traveler.id}-й путешественник
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            Необязательно
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isOpen
                                ? "bg-lime-green dark:bg-blue-400 rotate-90"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              className={`text-sm ${
                                isOpen
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
                        isOpen
                          ? "max-h-[1000px] opacity-100 mt-6"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["firstName", "lastName"].map((field) => (
                          <input
                            key={field}
                            value={traveler[field]}
                            onChange={(e) =>
                              updateTraveler(index, field, e.target.value)
                            }
                            placeholder={
                              field === "firstName" ? "Имя" : "Фамилия"
                            }
                            className="p-4 text-base rounded-xl bg-white dark:bg-gray-900 text-forest-dark dark:text-taupe shadow-md placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60 border-2 border-transparent hover:border-lime-green dark:hover:border-blue-400 focus:border-lime-green dark:focus:border-blue-400 focus:outline-none transition-all"
                          />
                        ))}

                        <InputMask
                          mask="dd-mm-yyyy"
                          replacement={{ d: /\d/, m: /\d/, y: /\d/ }}
                          value={traveler.dob}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length === 10 && !isValidBirthDate(value))
                              return;
                            updateTraveler(index, "dob", value);
                          }}
                          placeholder="Дата рождения"
                          className="p-4 text-base rounded-xl bg-white dark:bg-gray-900 text-forest-dark dark:text-taupe shadow-md placeholder:text-forest-dark/60 dark:placeholder:text-taupe/60 border-2 border-transparent hover:border-lime-green dark:hover:border-blue-400 focus:border-lime-green dark:focus:border-blue-400 focus:outline-none transition-all"
                        />

                        <GenderSelector
                          value={traveler.gender}
                          onChange={(g) => updateTraveler(index, "gender", g)}
                          compact
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Секция оплаты */}
          <SectionCard id="card">
            <SectionHeader
              icon={faCreditCard}
              title="Оплата"
              required
              completed={completedSections.payment}
            />

            <div className="mb-8">
              <CreditCardVisual
                number={card.number}
                expiry={card.expiry}
                holderName={holderName}
              />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <FormInput
                name="cardNumber"
                value={card.number}
                placeholder="Номер карты"
                mask="0000 0000 0000 0000"
                replacement={{ 0: /\d/ }}
                error={errors.cardNumber}
                focused={focusedField}
                onFocus={setFocusedField}
                onBlur={setFocusedField}
                onChange={(e) => updateCard("number", e.target.value)}
              />

              <div className="flex gap-5">
                <FormInput
                  name="cardExpiry"
                  value={card.expiry}
                  placeholder="ММ/ГГ"
                  mask="00/00"
                  replacement={{ 0: /\d/ }}
                  error={errors.cardExpiry}
                  focused={focusedField}
                  onFocus={setFocusedField}
                  onBlur={setFocusedField}
                  onChange={(e) => updateCard("expiry", e.target.value)}
                />
                <FormInput
                  name="cardCVC"
                  value={card.cvc}
                  placeholder="CVC"
                  mask="000"
                  replacement={{ 0: /\d/ }}
                  error={errors.cardCVC}
                  focused={focusedField}
                  onFocus={setFocusedField}
                  onBlur={setFocusedField}
                  onChange={(e) => updateCard("cvc", e.target.value)}
                />
              </div>
            </div>

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
          </SectionCard>
        </div>

        {/* Правая колонка - сайдбар */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            {/* Информация о туре */}
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
                  src={tourImage}
                  alt="tour"
                  className="w-24 h-20 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-olive-dark dark:text-gray-100 mb-2 leading-tight">
                    {title}
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
                      {pluralize(days, ["день", "дня", "дней"])}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Расчет цены */}
            <div className="bg-linear-to-br from-white to-cream dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-2xl shadow-xl p-6 dark:border-2 dark:border-gray-700">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
                  <span>
                    {formatPrice(currentDate.price, currency)} ×{" "}
                    {pluralize(participants, [
                      "участник",
                      "участника",
                      "участников",
                    ])}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-700 dark:text-gray-100">
                    Итого
                  </span>
                  <span className="text-forest-dark dark:text-gray-100 text-2xl">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>

                <div className="bg-linear-to-r from-lime-green/10 to-sage-green/10 dark:from-blue-400/10 dark:to-blue-600/10 rounded-xl p-4 border-2 border-lime-green/30 dark:border-blue-400/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        К оплате сейчас
                      </p>
                      <p className="text-2xl font-bold text-lime-green dark:text-blue-400">
                        {formatPrice(payNow, currency)}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-lime-green dark:text-blue-400 text-2xl"
                    />
                  </div>
                </div>
              </div>
              {submitError && (
                <div className="p-4 mb-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-3">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{submitError}</span>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full cursor-pointer py-4 rounded-xl font-bold text-lg bg-linear-to-r from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Обработка...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-3">
                      <FontAwesomeIcon icon={faLock} />
                      Оплатить {formatPrice(payNow, currency)}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-sage-green to-forest-dark dark:from-blue-600 dark:to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </button>

              <div className="mt-6 space-y-3">
                <InfoBadge
                  icon={faShieldHalved}
                  text="Безопасная оплата"
                  colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                />
                <InfoBadge
                  icon={faRotateLeft}
                  text="100% возврат в течение 24 часов"
                  colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                />
                <InfoBadge
                  icon={faHandshake}
                  text="Гарантия проведения тура"
                  colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
