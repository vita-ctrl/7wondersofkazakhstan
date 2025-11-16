import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronLeft,
  faChevronRight,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import BookingWidget from "../components/BookingWidget";
import IncludedExcluded from "../components/IncludedExcluded";
import { useParams } from "react-router-dom";
import FullscreenGallery from "../components/FullscreenGallery";
import { Recommended } from "../components/Recommended";
import { ReviewsInfinite } from "../components/ReviewsInfinite";
import NotFoundPage from "../components/NotFound";
import LoadingPage from "../components/LoadingPage";

export default function Tours() {
  const { tourId } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/tours/tours.json")
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки туров:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  // if (error) {
  //   return <ErrorPage message={error} />;
  // }

  if (tourId) {
    const tour = tours.find((t) => t.id === tourId);

    if (!tour) {
      return <NotFoundPage />;
    }

    return <ToursDetail {...tour} />;
  }

  return <LoadingPage />;
}

function ToursDetail(props) {
  const images = props.images;

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 left, 1 right, 0 none
  const mainImageRef = useRef(null);
  const thumbnailsRef = useRef(null);

  const nextImage = () => {
    setDirection(1);
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setDirection(index > selectedImage ? 1 : -1);
    setSelectedImage(index);
  };

  // Обработчик клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Автопрокрутка превью
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnailsContainer = thumbnailsRef.current;
      const activeThumb = thumbnailsContainer.children[selectedImage];

      if (activeThumb) {
        const containerScroll = thumbnailsContainer.scrollLeft;
        const thumbOffset = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.offsetWidth;
        const containerWidth = thumbnailsContainer.offsetWidth;

        if (
          thumbOffset < containerScroll ||
          thumbOffset + thumbWidth > containerScroll + containerWidth
        ) {
          thumbnailsContainer.scrollTo({
            left: thumbOffset - containerWidth / 2 + thumbWidth / 2,
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedImage]);

  return (
    <section className="pt-6 sm:pt-8 lg:pt-12 max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-20">
      {/* Галерея + инфо + цена */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start mt-10 relative">
        {/* Левая часть — галерея и описание */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Превью + главное фото */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            {/* Миниатюры */}
            <div
              ref={thumbnailsRef}
              className="flex lg:flex-col gap-3 order-2 lg:order-1 justify-center lg:justify-start overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide"
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`relative shrink-0 w-20 h-20 rounded-md cursor-pointer border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === i
                      ? "border-blue-500 scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  onClick={() => handleThumbnailClick(i)}
                >
                  <img
                    src={img}
                    alt={`Фото ${i + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {selectedImage === i && (
                    <div className="absolute inset-0 border-2 border-white rounded-md" />
                  )}
                </div>
              ))}
            </div>

            {/* Основное изображение */}
            <div className="flex-1 order-1 lg:order-2 relative group">
              <div
                ref={mainImageRef}
                className="relative w-full h-[450px] rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={images[selectedImage]}
                  alt="Основное фото"
                  className={`w-full h-full object-cover transition-transform duration-500 ${direction === 1
                      ? "slide-in-right"
                      : direction === -1
                        ? "slide-in-left"
                        : ""
                    }`}
                />

                {/* Кнопки навигации */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  aria-label="Предыдущее фото"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  aria-label="Следующее фото"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>

                {/* Кнопка полноэкранного режима */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  aria-label="Полноэкранный режим"
                >
                  <FontAwesomeIcon icon={faExpand} className="w-4 h-4" />
                </button>

                {/* Счетчик изображений */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start text-left">
            <h1 className="font-bold mb-2 text-[24px] text-gray-900 dark:text-gray-100">
              {props.title}
            </h1>

            {/* Рейтинг */}
            <div className="flex items-left mb-4">
              {[...Array(props.rating)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className="text-yellow-400 mr-1"
                />
              ))}
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                {props.rating} • {props.ratingText}
              </span>
            </div>

            {/* Характеристики тура */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 text-[14px] text-gray-900 dark:text-gray-100 -mt-2">
              {/* Левая колонка */}
              <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">
                  Активность
                </span>
                <div className="mt-1 font-medium">{props.activity}</div>
                <div className="mt-3">
                  <span className="block text-[13px] text-gray-500 dark:text-gray-400">
                    Возраст
                  </span>
                  <span className="font-medium">
                    {props.minAge}–{props.maxAge}
                  </span>
                </div>
              </div>

              {/* Правая колонка */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">
                    Комфорт
                  </span>
                  <div className="mt-1 font-medium">{props.comfort}</div>
                </div>

                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">
                    Язык
                  </span>
                  <span className="font-medium">{props.language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Блок бронирования */}
        <aside>
          <BookingWidget {...props.booking} />
        </aside>
      </div>

      {/* Полноэкранный режим */}
      {isFullscreen && (
        <FullscreenGallery
          images={images}
          currentIndex={selectedImage}
          onClose={() => setIsFullscreen(false)}
          onNext={nextImage}
          onPrev={prevImage}
          onSelect={setSelectedImage}
        />
      )}

      {/* Остальной код компонента остается без изменений */}
      <div className="mt-5 max-w-[760px] text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed">
        <div className="relative w-full transition-all duration-500">
          {props.description.map((text, index) => (
            <p key={index} className="mb-3 font-medium">
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* 👇 Организатор + Включено в стоимость */}
      <div className="mt-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Левая колонка — Организатор */}
        <div className="flex-1">
          <TourGuide {...props.tourGuide} />
        </div>

        {/* Правая колонка — Включено в стоимость */}
        <div className="w-full lg:w-[520px]">
          <IncludedExcluded {...props.includedExcluded} />
        </div>
      </div>

      {/* Рекомендуем также */}
      <Recommended recommendedCards={props.recommendedCards} />

      <div className="mt-10">
        <div className="border-b border-gray-300 dark:border-gray-700 flex space-x-6 text-[20px] font-medium">
          <p className="relative pb-2 transition-colors duration-300">
            Отзывы
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005BFF]" />
          </p>
        </div>
      </div>

      <ReviewsInfinite {...props.reviews} />
    </section>
  );
}

function TourGuide(props) {
  const [expanded, setExpanded] = useState(false);
  const maximumRating = 5;

  return (
    <div className="w-full max-w-[805px] lg:ml-0 lg:mr-auto bg-[#F6F7FA] dark:bg-gray-800 rounded-2xl p-6 mt-12 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Организатор туров
      </h2>

      {/* Карточка */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex justify-between items-center shadow-sm">
        {/* Левая часть */}
        <div className="flex items-center gap-4">
          <img
            src={props.avatar}
            alt={props.name}
            className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div>
            <h3 className="text-[16px] font-semibold text-[#5B2EFF]">
              {props.name}
            </h3>

            <div className="text-[14px] text-gray-700 dark:text-gray-300 mt-1 flex flex-col gap-0.5">
              <span>
                {[...Array(props.rating)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={"text-yellow-400"}
                  />
                ))}
                {[...Array(maximumRating - props.rating)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    className="text-yellow-400"
                    icon={faStarRegular}
                  />
                ))}
                {/* •&nbsp;
                <a href="#" className="underline">
                  {props.countReviews} отзывов
                </a> */}
              </span>
              <span>{props.firstDescription}</span>
              <span>{props.secondDescription}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Текстовое описание */}
      <div className="mt-4 text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed">
        {props.thirdDescription.map((text, index) => (
          <p className="font-medium" key={index}>
            {text}
          </p>
        ))}

        {!expanded && "…"}
        {expanded && <div className="mt-3"></div>}

        {expanded &&
          props.hiddenDescription.map((text, index) => (
            <p className="font-medium" key={index}>
              {text}
            </p>
          ))}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-[#4F46E5] font-medium hover:underline flex items-center gap-1"
        >
          {expanded ? "Свернуть описание ▲" : "Развернуть описание ▼"}
        </button>
      </div>
    </div>
  );
}
