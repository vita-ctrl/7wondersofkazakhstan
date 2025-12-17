import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faCalendar,
  faShieldAlt,
  faHeadset,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import BookingWidget from "../components/BookingWidget";
import { useParams } from "react-router-dom";
import { Recommended } from "../components/Recommended";
import { ReviewsInfinite } from "../components/ReviewsInfinite";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";
import MapComponent from "../components/MapComponent";

export default function Tours() {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!tourId) return <NotFoundPage />;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!tourId) return;

    fetch(`/api/tours?tourId=${tourId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Tour not found");
        return res.json();
      })
      .then((data) => {
        setTour(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading tour:", error);
        setTour(null);
        setLoading(false);
      });
  }, [tourId]);

  if (loading) return <LoadingPage />;
  if (!tour) return <NotFoundPage />;

  return <ToursDetail {...tour} />;
}

function ToursDetail(props) {
  const images = props.images || [];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600;700&display=swap";
    document.head.appendChild(fontLink);

    return () => {
      if (fontLink.parentNode) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  const nextImage = () => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  useEffect(() => {
    if (!images.length || isLightbox) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isLightbox]);

  useEffect(() => {
    if (!isLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") setIsLightbox(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLightbox]);

  const openLightbox = () => setIsLightbox(true);
  const handleLightboxBackdropClick = () => setIsLightbox(false);

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

  return (
    <div className="min-h-screen pt-17 bg-linear-to-br from-slate-50 via-gray-50 to-stone-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
      {/* HERO SECTION */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={images[selectedImage]}
            alt={props.title}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80"></div>

          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
              }}>
            </div>
          </div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16">
          <h1 className="text-5xl lg:text-7xl font-['Lora'] font-bold text-white mb-6 leading-tight max-w-4xl">
            {props.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/90 font-['Montserrat']">
            {props.map?.popup && (
              <>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-400 dark:text-blue-400" />
                  <span className="text-sm font-medium">{props.map.popup}</span>
                </div>
                <div className="w-px h-5 bg-white/30"></div>
              </>
            )}

            {props.booking?.days && (
              <>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-amber-400 dark:text-blue-400" />
                  <span className="text-sm font-medium">
                    {pluralize(props.booking.days, ["день", "дня", "дней"])}
                  </span>
                </div>
                <div className="w-px h-5 bg-white/30"></div>
              </>
            )}

            {props.booking?.maxSeats && (
              <>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-amber-400 dark:text-blue-400" />
                  <span className="text-sm font-medium">До {props.booking.maxSeats} человек</span>
                </div>
                <div className="w-px h-5 bg-white/30"></div>
              </>
            )}

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`text-sm ${i < props.reviews?.ratingSummary?.average ? "text-amber-400" : "text-white/30"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{props.reviews?.ratingSummary?.average}</span>
              <span className="text-sm text-white/70">
                ({pluralize(props.reviews?.ratingSummary?.totalReviews, ["отзыв", "отзыва", "отзывов"])})
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-8">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => handleThumbnailClick(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === selectedImage
                    ? "w-12 bg-white"
                    : "w-8 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={openLightbox}
          className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-['Montserrat'] font-medium text-sm hover:bg-white/20 transition-all duration-300"
        >
          Смотреть галерею ({images.length})
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-800">
              {[
                { id: "overview", label: "Обзор" },
                { id: "details", label: "Детали" },
                { id: "location", label: "Локация" },
                { id: "reviews", label: "Отзывы" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-['Montserrat'] font-medium text-sm transition-all duration-300 relative ${activeTab === tab.id
                      ? "text-slate-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-12">
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Description */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6">
                      О туре
                    </h2>
                    <div className="space-y-4 font-['Montserrat'] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {props.description?.map((text, index) => (
                        <p key={index} className="text-base">
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Key Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        icon: faShieldAlt,
                        title: "Безопасность",
                        desc: "Сертифицированные гиды",
                        color: "blue",
                      },
                      {
                        icon: faCalendar,
                        title: "Гибкость",
                        desc: "Бесплатная отмена за 24ч",
                        color: "emerald",
                      },
                      {
                        icon: faCheck,
                        title: "Подтверждение",
                        desc: "Мгновенное бронирование",
                        color: "violet",
                      },
                      {
                        icon: faHeadset,
                        title: "Поддержка",
                        desc: "Помощь 24/7",
                        color: "amber",
                      },
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4`}
                        >
                          <FontAwesomeIcon
                            icon={feature.icon}
                            className={`text-${feature.color}-600 dark:text-${feature.color}-400 text-xl`}
                          />
                        </div>
                        <h3 className="font-['Montserrat'] font-semibold text-slate-900 dark:text-white mb-1 text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-['Montserrat']">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* What's Included / Excluded */}
                  {(props.included || props.excluded) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Included */}
                      {props.included && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                          <h3 className="text-xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <FontAwesomeIcon icon={faCheck} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            Включено
                          </h3>
                          <ul className="space-y-3">
                            {props.included.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 font-['Montserrat'] text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 dark:text-emerald-400 text-xs" />
                                </div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Excluded */}
                      {props.excluded && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                          <h3 className="text-xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                              <FontAwesomeIcon icon={faTimes} className="text-rose-600 dark:text-rose-400" />
                            </div>
                            Не включено
                          </h3>
                          <ul className="space-y-3">
                            {props.excluded.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-3 font-['Montserrat'] text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* What to Bring */}
                  {props.whatToBring && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                      <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6">
                        Что взять с собой
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {props.whatToBring.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 font-['Montserrat']"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Important Info */}
                  {props.importantInfo && (
                    <div className="bg-linear-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-200/15 dark:to-orange-200/10 rounded-2xl p-8 border border-amber-200 dark:border-amber-700/40">
                      <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6">
                        Важная информация
                      </h2>
                      <div className="space-y-4 font-['Montserrat'] text-gray-700 dark:text-gray-300">
                        {props.importantInfo.map((info, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-white text-sm font-bold">!</span>
                            </div>
                            <div>
                              <p className="font-semibold mb-1">{info.title}</p>
                              <p className="text-sm">{info.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ */}
                  {props.faq && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                      <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6">
                        Часто задаваемые вопросы
                      </h2>
                      <div className="space-y-3">
                        {props.faq.map((item, idx) => (
                          <details
                            key={idx}
                            className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                          >
                            <summary className="cursor-pointer p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors font-['Montserrat'] font-semibold text-slate-900 dark:text-white flex justify-between items-center">
                              <span className="text-sm">{item.question}</span>
                              <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform ml-4">
                                ▼
                              </span>
                            </summary>
                            <div className="px-5 pb-5 pt-2 font-['Montserrat'] text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/30">
                              {item.answer}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cancellation Policy */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6">
                      Политика отмены
                    </h2>
                    <div className="space-y-4 font-['Montserrat']">
                      <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <FontAwesomeIcon icon={faCheck} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white mb-1">Бесплатная отмена</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Полный возврат средств при отмене за 24+ часов до начала</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800/30">
                        <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                          <FontAwesomeIcon icon={faTimes} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white mb-1">Без возврата</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">При отмене менее чем за 24 часа возврат не производится</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-6">
                      Подробная информация
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {props.map?.popup && (
                        <div className="p-6 rounded-xl bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="text-3xl text-blue-600 dark:text-blue-400 mb-3"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-['Montserrat'] font-medium mb-1 uppercase tracking-wider">
                            Локация
                          </p>
                          <p className="text-lg font-['Montserrat'] font-semibold text-slate-900 dark:text-white">
                            {props.map.popup}
                          </p>
                        </div>
                      )}

                      {props.booking?.days && (
                        <div className="p-6 rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="text-3xl text-emerald-600 dark:text-emerald-400 mb-3"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-['Montserrat'] font-medium mb-1 uppercase tracking-wider">
                            Длительность
                          </p>
                          <p className="text-lg font-['Montserrat'] font-semibold text-slate-900 dark:text-white">
                            {pluralize(props.booking.days, ["день", "дня", "дней"])}
                          </p>
                        </div>
                      )}

                      {props.booking?.maxSeats && (
                        <div className="p-6 rounded-xl bg-linear-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30">
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-3xl text-violet-600 dark:text-violet-400 mb-3"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-['Montserrat'] font-medium mb-1 uppercase tracking-wider">
                            Размер группы
                          </p>
                          <p className="text-lg font-['Montserrat'] font-semibold text-slate-900 dark:text-white">
                            До {pluralize(props.booking.maxSeats, ["человек", "человека", "человек"])}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Organizer Section */}
                      {props.organizer && (
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-['Montserrat'] font-semibold text-slate-900 dark:text-white mb-4">
                            Ваш гид
                          </h3>
                          <div className="flex items-center gap-4">
                            {props.organizer.photo && (
                              <img
                                src={props.organizer.photo}
                                alt={props.organizer.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                              />
                            )}
                            <div>
                              <p className="font-['Montserrat'] font-semibold text-gray-900 dark:text-white">
                                {props.organizer.name}
                              </p>
                              {props.organizer.rating && (
                                <div className="flex items-center gap-2 mt-1">
                                  <FontAwesomeIcon
                                    icon={faStar}
                                    className="text-amber-400 text-sm"
                                  />
                                  <span className="text-sm font-['Montserrat'] text-gray-600 dark:text-gray-400">
                                    {props.organizer.rating} рейтинг
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      {(props.activity || props.comfort || props.minAge || props.language) && (
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-['Montserrat'] font-semibold text-slate-900 dark:text-white mb-4">
                            Дополнительная информация
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {props.activity && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-['Montserrat'] mb-1 uppercase tracking-wider">
                                  Уровень активности
                                </p>
                                <p className="text-sm font-['Montserrat'] font-medium text-gray-900 dark:text-white">
                                  {props.activity}
                                </p>
                              </div>
                            )}
                            {props.comfort && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-['Montserrat'] mb-1 uppercase tracking-wider">
                                  Комфорт
                                </p>
                                <p className="text-sm font-['Montserrat'] font-medium text-gray-900 dark:text-white">
                                  {props.comfort}
                                </p>
                              </div>
                            )}
                            {(props.minAge || props.maxAge) && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-['Montserrat'] mb-1 uppercase tracking-wider">
                                  Возрастные ограничения
                                </p>
                                <p className="text-sm font-['Montserrat'] font-medium text-gray-900 dark:text-white">
                                  {props.minAge && props.maxAge
                                    ? `${props.minAge}–${props.maxAge} лет`
                                    : props.minAge
                                      ? `От ${props.minAge} лет`
                                      : props.maxAge
                                        ? `До ${props.maxAge} лет`
                                        : "Не указано"}
                                </p>
                              </div>
                            )}
                            {props.language && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-['Montserrat'] mb-1 uppercase tracking-wider">
                                  Языки
                                </p>
                                <p className="text-sm font-['Montserrat'] font-medium text-gray-900 dark:text-white">
                                  {props.language}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATION TAB */}
              {activeTab === "location" && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="p-8 pb-6">
                    <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-2">
                      Место встречи
                    </h2>
                    {props.map?.popup && (
                      <p className="text-gray-600 dark:text-gray-400 font-['Montserrat']">
                        {props.map.popup}
                      </p>
                    )}
                  </div>
                  <div className="h-[500px]">
                    <MapComponent
                      key={`${props.map?.lat}-${props.map?.long}`}
                      zoom={12}
                      height="500px"
                      {...props.map}
                    />
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-['Lora'] font-bold text-slate-900 dark:text-white mb-2">
                        Отзывы гостей
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 font-['Montserrat']">
                        {pluralize(props.reviews?.ratingSummary?.totalReviews, [
                          "отзыв",
                          "отзыва",
                          "отзывов",
                        ])}
                        {/*{" "}· Рейтинг {props.reviews?.ratingSummary?.average}/5 */}
                      </p>
                    </div>
                    {/* <div className="text-right">
                      <div className="text-4xl font-['Lora'] font-bold text-slate-900 dark:text-white">
                        {props.reviews?.ratingSummary?.average}
                      </div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={`text-sm ${
                              i < props.reviews?.ratingSummary?.average
                                ? "text-amber-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div> */}
                  </div>
                  <ReviewsInfinite {...props.reviews} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - BOOKING WIDGET */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BookingWidget tourId={props.id} {...props.booking} />

              {/* Trust Indicators */}
              <div className="bg-linear-to-br from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-['Montserrat'] font-semibold text-slate-900 dark:text-white mb-4">
                  Почему выбирают нас
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      icon: faShieldAlt,
                      text: "Безопасные платежи",
                      color: "blue",
                    },
                    {
                      icon: faCalendar,
                      text: "Бесплатная отмена за 24 часа",
                      color: "emerald",
                    },
                    {
                      icon: faCheck,
                      text: "Мгновенное подтверждение",
                      color: "violet",
                    },
                    {
                      icon: faHeadset,
                      text: "Поддержка 24/7",
                      color: "amber",
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`text-${item.color}-600 dark:text-${item.color}-400 text-sm`}
                        />
                      </div>
                      <span className="text-sm font-['Montserrat'] text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED TOURS SECTION - FULL WIDTH */}
      <div className="w-full bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pb-10 border-t border-gray-200 dark:border-gray-800">
        <div className="w-full px-6 lg:px-8">
          <Recommended recommendedCards={props.recommendedCards} />
        </div>
      </div>


      {/* LIGHTBOX */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={handleLightboxBackdropClick}
        >
          <div
            className="relative w-full max-w-7xl px-4 sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt={props.title}
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-sm text-white rounded-full font-['Montserrat'] text-sm font-medium border border-white/10">
              {selectedImage + 1} / {images.length}
            </div>

            <button
              onClick={() => setIsLightbox(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 flex items-center justify-center font-['Montserrat'] text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}