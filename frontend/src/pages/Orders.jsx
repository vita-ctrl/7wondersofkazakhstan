import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../utils/auth";
import {
  faTicket,
  faCalendar,
  faUsers,
  faCreditCard,
  faMapMarkerAlt,
  faChevronDown,
  faChevronUp,
  faCheckCircle,
  faEnvelope,
  faPhone,
  faBirthdayCake,
  faVenusMars,
  faExclamationCircle,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import LoadingPage from "../components/LoadingPage";
import { HashLink } from "react-router-hash-link";

// === УТИЛИТЫ ===
const pluralRules = new Intl.PluralRules("ru");
const pluralize = (n, [one, few, many]) => {
  const rule = pluralRules.select(n);
  return `${n} ${rule === "one" ? one : rule === "few" ? few : many}`;
};

const formatPrice = (price, currency) =>
  `${currency} ${new Intl.NumberFormat("ru-RU").format(price)}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatPhone = (phone) => {
  if (!phone) return "—";
  return phone;
};

const getGenderLabel = (gender) => {
  return gender === "male" ? "Мужской" : gender === "female" ? "Женский" : "—";
};

// === КОМПОНЕНТЫ ===

const TravelerCard = ({ traveler, isPrimary = false }) => {
  const { firstName, lastName, email, phone, dob, gender } = traveler;
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {firstName?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="font-bold text-olive-dark dark:text-gray-100">
            {fullName}
          </p>
          {isPrimary && (
            <span className="text-xs bg-lime-green/20 dark:bg-blue-400/20 text-lime-green dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              Основной
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {email && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-lime-green dark:text-blue-400 w-4"
            />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faPhone}
              className="text-lime-green dark:text-blue-400 w-4"
            />
            <span>{formatPhone(phone)}</span>
          </div>
        )}
        {dob && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBirthdayCake}
              className="text-lime-green dark:text-blue-400 w-4"
            />
            <span>{formatDate(dob)}</span>
          </div>
        )}
        {gender && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faVenusMars}
              className="text-lime-green dark:text-blue-400 w-4"
            />
            <span>{getGenderLabel(gender)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderCard = ({ order, tourData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    tour_id,
    booking_date_id,
    participants_count,
    total_amount,
    currency,
    prepayment_amount,
    primary_traveler,
    additional_travelers = [],
  } = order;

  // Фильтруем только заполненных путешественников
  const validTravelers = (additional_travelers || []).filter(
    (t) => t.firstName || t.lastName || t.dob
  );

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl dark:border dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Верхняя полоса */}
      <div className="h-1.5 bg-linear-to-r from-lime-green via-sage-green to-forest-dark dark:from-blue-400 dark:via-blue-500 dark:to-blue-600" />

      <div className="p-6">
        {/* Заголовок карточки */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faTicket} className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Заказ №
              </p>
              <p className="font-mono font-bold text-xl text-olive-dark dark:text-gray-100">
                TRV-{String(id).padStart(8, '0')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-lime-green dark:text-blue-400 text-2xl"
            />
            <span className="px-3 py-1 bg-lime-green/20 dark:bg-blue-400/20 text-lime-green dark:text-blue-400 rounded-full text-sm font-semibold">
              Подтвержден
            </span>
          </div>
        </div>

        {/* Информация о туре */}
        <div className="bg-cream/50 dark:bg-gray-900/50 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 items-start">
            {tourData?.image && (
              <img
                src={tourData.image}
                alt="tour"
                className="w-24 h-20 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/tours/${tour_id}`)}
              />
            )}
            <div className="flex-1">
              <h4
                className="font-bold text-olive-dark dark:text-gray-100 mb-3 leading-tight cursor-pointer hover:text-lime-green dark:hover:text-blue-400 transition-colors"
                onClick={() => navigate(`/tours/${tour_id}`)}
              >
                {tourData?.title || `Тур #${tour_id}`}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-lime-green dark:text-blue-400"
                  />
                  <span>
                    {tourData?.dateRange || `Дата ID: ${booking_date_id}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-lime-green dark:text-blue-400"
                  />
                  <span>
                    {pluralize(participants_count, [
                      "участник",
                      "участника",
                      "участников",
                    ])}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Стоимость */}
        <div className="bg-linear-to-r from-lime-green/10 to-sage-green/10 dark:from-blue-400/10 dark:to-blue-600/10 rounded-xl p-4 border-2 border-lime-green/30 dark:border-blue-400/30 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Общая стоимость
            </span>
            <span className="text-lg font-bold text-olive-dark dark:text-gray-100">
              {formatPrice(total_amount, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faCreditCard} />
              Оплачено
            </span>
            <span className="text-xl font-bold text-lime-green dark:text-blue-400">
              {formatPrice(prepayment_amount, currency)}
            </span>
          </div>
        </div>

        {/* Кнопка раскрытия */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-olive-dark dark:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
        >
          <span>
            {isExpanded ? "Скрыть детали" : "Показать детали"}
          </span>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Раскрывающаяся секция с участниками */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isExpanded
              ? "max-h-[2000px] opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <h5 className="font-bold text-olive-dark dark:text-gray-100 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-lime-green dark:text-blue-400"
              />
              Участники путешествия
            </h5>

            {/* Основной путешественник */}
            <TravelerCard traveler={primary_traveler} isPrimary={true} />

            {/* Дополнительные путешественники */}
            {validTravelers.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Дополнительные участники
                </p>
                {validTravelers.map((traveler, index) => (
                  <TravelerCard
                    key={index}
                    traveler={traveler}
                    isPrimary={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// === ГЛАВНЫЙ КОМПОНЕНТ ===
export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [toursData, setToursData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login", {
            replace: true,
            state: { redirectUrl: "/orders" },
          });
          return;
        }

        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login", {
              replace: true,
              state: { redirectUrl: "/orders" },
            });
            return;
          }
          throw new Error("Не удалось загрузить заказы");
        }

        const ordersData = await response.json();
        setOrders(ordersData);

        // Загружаем данные о турах
        const uniqueTourIds = [...new Set(ordersData.map((o) => o.tour_id))];
        const toursMap = {};

        await Promise.all(
          uniqueTourIds.map(async (tourId) => {
            try {
              const tourRes = await fetch(`/api/tours?tourId=${tourId}`);
              if (tourRes.ok) {
                const tour = await tourRes.json();
                const bookingDate = tour.booking?.dates?.find(
                  (d) =>
                    d.id ===
                    ordersData.find((o) => o.tour_id === tourId)
                      ?.booking_date_id
                );

                toursMap[tourId] = {
                  title: tour.title,
                  image: tour.images?.[0],
                  dateRange: bookingDate?.range,
                };
              }
            } catch (err) {
              console.error(`Error loading tour ${tourId}:`, err);
            }
          })
        );

        setToursData(toursMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen pt-20 pb-10 px-5 bg-linear-to-br from-vanilla via-cream to-vanilla dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-[1500px] mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-olive-dark dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
            <FontAwesomeIcon
              icon={faTicket}
              className="text-lime-green dark:text-blue-400"
            />
            Мои бронирования
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Здесь вы можете посмотреть все свои заказы и детали бронирований
          </p>
        </div>

        {/* Обработка ошибок */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-red-600 dark:text-red-400 text-2xl"
              />
              <div>
                <h3 className="font-bold text-red-800 dark:text-red-200 mb-1">
                  Ошибка загрузки
                </h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Список заказов */}
        {orders.length === 0 && !error ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
            <FontAwesomeIcon
              icon={faBox}
              className="text-gray-300 dark:text-gray-600 text-6xl mb-4"
            />
            <h3 className="text-2xl font-bold text-olive-dark dark:text-gray-100 mb-2">
              У вас пока нет бронирований
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Начните планировать своё путешествие прямо сейчас
            </p>
            <HashLink
            smooth
            to={"/#tours"}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-lime-green to-sage-green dark:from-blue-400 dark:to-blue-600 hover:shadow-lg transition-all duration-200"
            >
              Посмотреть туры
            </HashLink>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                tourData={toursData[order.tour_id]}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}