import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import BookingWidget from "../components/BookingWidget";
import { useParams } from "react-router-dom";
import { Recommended } from "../components/Recommended";
import { ReviewsInfinite } from "../components/ReviewsInfinite";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";
import MapComponent from "../components/MapComponent";

//  ГЛАВНЫЙ КОМПОНЕНТ — ЭТО default export
export default function Tours() {
  const { tourId } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return <ToursDetail {...tour} />;
}

// -----------------------------------------------------------
//               КОМПОНЕНТ СТРАНИЦЫ ТУРА
// -----------------------------------------------------------
// -----------------------------------------------------------
//               КОМПОНЕНТ СТРАНИЦЫ ТУРА
// -----------------------------------------------------------
function ToursDetail(props) {
  const images = props.images || [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);

  // смена изображений
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

  // авто-перелистывание
  useEffect(() => {
    if (!images.length) return;
    if (isLightbox) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isLightbox]);

  // клавиши
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

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <section className="pt-16 pb-12 max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --------------------- ЛЕВАЯ КОЛОНКА ---------------------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* ГАЛЕРЕЯ */}
            <div className="relative group">
              <div
                className="relative w-full h-[500px] lg:h-[550px] overflow-hidden cursor-zoom-in rounded-2xl bg-cream dark:bg-gray-800"
                onClick={openLightbox}
              >
                <img
                  src={images[selectedImage]}
                  alt={props.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />

                {/* Счётчик */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            </div>

            {/* МИНИАТЮРЫ */}
            <div className="flex gap-4 overflow-x-auto p-3 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleThumbnailClick(i)}
                  className="shrink-0 w-24 h-24 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>

            {/* ОПИСАНИЕ ТУРА */}
            <div className="bg-cream dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {props.title}
              </h1>

              {/* Рейтинг */}
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`text-lg ${
                        i < props.rating
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      } mr-1`}
                    />
                  ))}
                </div>

                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {props.rating}
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  • {props.ratingText}
                </span>
              </div>

              {/* Детали */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-blue-600 dark:text-blue-400 text-xl mr-3"
                  />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Локация
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {props.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-green-600 dark:text-green-400 text-xl mr-3"
                  />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Длительность
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {props.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-purple-600 dark:text-purple-400 text-xl mr-3"
                  />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Размер группы
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {props.groupSize}
                    </p>
                  </div>
                </div>
              </div>

              {/* Текст описания */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Описание тура
              </h2>
              <div className="space-y-4">
                {props.description.map((text, index) => (
                  <p
                    key={index}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* КАРТА */}
            <div className="bg-cream dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Где находится
              </h2>

              <div className="rounded-2xl overflow-hidden w-full h-[400px]">
                <MapComponent zoom={5} height="400px" {...props.map} />
              </div>
            </div>

            {/* ОТЗЫВЫ */}
            <div className="bg-cream dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Отзывы
              </h2>
              <ReviewsInfinite {...props.reviews} />
            </div>
          </div>

          {/* --------------------- ПРАВАЯ КОЛОНКА ---------------------- */}
          <div className="lg:col-span-1">
            <div className="ml-10 sticky top-24 w-[390px]">
              <BookingWidget tourId={props.id} {...props.booking} />

              {/* Важная информация */}
              <div className="bg-cream dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Важная информация
                </h3>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-sage-green rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Бесплатная отмена за 24 часа
                    </span>
                  </li>

                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-sage-green rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Мгновенное подтверждение
                    </span>
                  </li>

                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-sage-green rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Поддержка 24/7
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- РЕКОМЕНДОВАННЫЕ ТУРЫ ----------------- */}
      <div className="my-12 px-20">
        <Recommended recommendedCards={props.recommendedCards} />
      </div>

      {/* --------------------- ЛАЙТБОКС ---------------------- */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center px-4"
          onClick={handleLightboxBackdropClick}
        >
          <div
            className="relative px-20 max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt={props.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-700"
            />

            {/* Влево */}
            <button
              onClick={prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full 
              bg-white/20 hover:bg-white/40 text-white text-4xl flex items-center justify-center"
            >
              <FontAwesomeIcon className="text-2xl" icon={faArrowLeft} />
            </button>

            {/* Вправо */}
            <button
              onClick={nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full 
              bg-white/20 hover:bg-white/40 text-white text-4xl flex items-center justify-center"
            >
              <FontAwesomeIcon className="text-2xl" icon={faArrowRight} />
            </button>

            {/* Счётчик */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
