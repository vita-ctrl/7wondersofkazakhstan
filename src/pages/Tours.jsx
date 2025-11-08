/* eslint-disable */
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronLeft, faChevronRight, faExpand, faXmark } from "@fortawesome/free-solid-svg-icons";
import allReviews from "../data/reviews.json";
import BookingWidget from "../components/BookingWidget";
import IncludedExcluded from "../components/IncludedExcluded";

/* =========================
     Главный компонент Tours
========================= */
export default function Tours() {
  const images = [
    "https://www.russian.space/kosmodromy/kosmodrom-baykonur/scale_1200-24.jpeg",
    "https://i.pinimg.com/1200x/09/6a/1a/096a1af8b5403d9c6316133acc05669e.jpg",
    "https://the-steppe.com/wp-content/uploads/2018/11/3e4ede7defe1538ada11a425f8ac20ae.jpg",
    "https://www.advantour.com/img/kazakhstan/baikonur/baikonur-cosmodrome1.jpg",
    "https://pkzsk.info/wp-content/uploads/2018/04/0_b5330_b1309cf0_orig.jpg",
  ];

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
      
      switch(e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
        
        if (thumbOffset < containerScroll || thumbOffset + thumbWidth > containerScroll + containerWidth) {
          thumbnailsContainer.scrollTo({
            left: thumbOffset - containerWidth / 2 + thumbWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedImage]);

  return (
    <section className="pt-6 sm:pt-8 lg:pt-12 max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-20">
      {/* Галерея + инфо + цена */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mt-10 relative">
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
                  className={`relative flex-shrink-0 w-20 h-20 rounded-md cursor-pointer border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedImage === i 
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
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    direction === 1 ? 'slide-in-right' : 
                    direction === -1 ? 'slide-in-left' : ''
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

          {/* Остальной код без изменений */}
          <div className="flex flex-col items-center justify-start text-center">
            <h1 className="font-bold mb-2 text-[24px] text-gray-900 dark:text-gray-100">
              Тур: Байконур — сердце космоса
            </h1>

            {/* Рейтинг */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 mr-1" />
              ))}
              <span className="text-gray-600 dark:text-gray-400 ml-2">5 • 32 отзывов</span>
            </div>
            
            {/* Характеристики тура */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 text-[14px] text-gray-900 dark:text-gray-100 -mt-2">
              {/* Левая колонка */}
              <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Активность</span>
                <div className="mt-1 font-medium">Для всех</div>
                <div className="mt-3 text-[#8DC21F] text-[13px] font-medium hover:text-[#76A519] cursor-pointer">
                  Программа тура →
                </div>
                <div className="mt-3">
                  <span className="block text-[13px] text-gray-500 dark:text-gray-400">
                    Возраст
                  </span>
                  <span className="font-medium">4–90</span>
                </div>
              </div>

              {/* Правая колонка */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Комфорт</span>
                  <div className="mt-1 font-medium">Средний</div>
                  <a
                    href="#where"
                    className="mt-2 text-[#8DC21F] text-[13px] font-medium hover:text-[#76A519]"
                  >
                    Где будем жить →
                  </a>
                </div>

                <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">Язык</span>
                  <span className="font-medium">Английский, Русский</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Блок бронирования */}
        <aside>
          <BookingWidget />
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
        <ExpandableBlock>
          <p className="mb-3 font-medium">
            Тур на старт ракеты и путешествие на космодром Байконур
          </p>
          <p className="mb-3">
            Станьте участником тура на Байконур и увидите все самые яркие и интересные места и
            события легендарного космодрома своими глазами!
          </p>
          <p className="mb-3">
            Как и все наши туры, этот тур также имеет свои изюминки.
            <span className="more-text hidden">
              {" "}
              Мы гарантируем полное погружение в атмосферу космонавтики и духа того времени.
            </span>
          </p>
        </ExpandableBlock>
      </div>

      {/* 👇 Организатор + Включено в стоимость */}
      <div className="mt-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Левая колонка — Организатор */}
        <div className="flex-1">
          <TourGuide />
        </div>

        {/* Правая колонка — Включено в стоимость */}
        <div className="w-full lg:w-[520px]">
          <IncludedExcluded />
        </div>
      </div>

      {/* Рекомендуем также */}
      <Recommended />

      <div className="mt-10">
        <ProductTabs />
      </div>

      <ReviewsInfinite />
    </section>
  );
}

/* =========================
     Полноэкранная галерея
========================= */
function FullscreenGallery({ images, currentIndex, onClose, onNext, onPrev, onSelect }) {
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    onNext();
  };

  const handlePrev = () => {
    setDirection(-1);
    onPrev();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Закрыть"
      >
        <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
      </button>

      {/* Основное изображение */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Фото ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-transform duration-500 ${
            direction === 1 ? 'slide-in-right' : 
            direction === -1 ? 'slide-in-left' : ''
          }`}
        />
        
        {/* Кнопки навигации */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label="Предыдущее фото"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label="Следующее фото"
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-6 h-6" />
        </button>

        {/* Счетчик */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-lg backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Миниатюры внизу */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 max-w-full overflow-x-auto px-4 py-2 scrollbar-hide">
        {images.map((img, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-16 h-16 rounded-md cursor-pointer border-2 transition-all duration-300 ${
              currentIndex === i 
                ? "border-white scale-110" 
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              onSelect(i);
            }}
          >
            <img
              src={img}
              alt={`Фото ${i + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Добавляем CSS анимации
const GalleryStyles = () => (
  <style jsx global>{`
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .slide-in-right {
      animation: slideInRight 0.5s ease-out;
    }
    
    .slide-in-left {
      animation: slideInLeft 0.5s ease-out;
    }
    
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    /* Плавный скролл для миниатюр */
    .thumbnails-container {
      scroll-behavior: smooth;
    }
  `}</style>
);

// Добавляем компонент стилей в основной компонент
Tours.GalleryStyles = GalleryStyles;

/* ========================= 
   Остальные компоненты без изменений
========================= */
function ExpandableBlock({ children }) {
  return (
    <div className="relative w-full transition-all duration-500">
      {children}
    </div>
  );
}

function ProductTabs() {
  const [activeTab, setActiveTab] = useState("reviews");
  return (
    <div className="border-b border-gray-300 dark:border-gray-700 flex space-x-6 text-[20px] font-medium">
      <button
        onClick={() => setActiveTab("reviews")}
        className={`relative pb-2 transition-colors duration-300 ${activeTab === "reviews"
          ? "text-gray-900 dark:text-white"
          : "text-gray-600 dark:text-gray-400"
          }`}
      >
        Отзывы
        {activeTab === "reviews" && (
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#005BFF]" />
        )}
      </button>
    </div>
  );
}

/*=======================
     Отзывы + рейтинг
========================= */
function ReviewsInfinite() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 5, allReviews.length));
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(15px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp { animation: fadeInUp 0.5s ease forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="my-16 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
      <div className="relative">
        <div className="w-full max-w-[900px] space-y-6 relative overflow-hidden">
          {allReviews.slice(0, visibleCount).map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm relative opacity-0 animate-fadeInUp"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">
                    Пользователь
                  </h3>
                  <p className="text-sm text-gray-500">{r.date}</p>
                </div>
                <div className="flex justify-end mt-1 text-yellow-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4" />
                  ))}
                </div>
              </div>

              <p className="text-[14px] text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                {r.text}
              </p>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <button className="px-3 py-1 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  Да {r.likes}
                </button>
                <button className="px-3 py-1 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  Нет {r.dislikes}
                </button>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < allReviews.length && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`px-4 py-1.5 text-sm font-medium rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 ${isLoading ? "opacity-70 cursor-wait" : ""
                }`}
            >
              {isLoading ? "Загружаем..." : "Показать ещё"}
            </button>
          </div>
        )}
      </div>

      <div className="sticky top-24">
        <RatingSummary />
      </div>
    </div>
  );
}

/* =========================
     Блок рейтинга
========================= */
function RatingSummary() {
  const totalReviews = 5554;
  const average = 4.8;
  const ratings = [
    { stars: 5, count: 4731 },
    { stars: 4, count: 539 },
    { stars: 3, count: 136 },
    { stars: 2, count: 66 },
    { stars: 1, count: 82 },
  ];

  const getWidth = (count) => (count / totalReviews) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm max-w-[360px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex text-yellow-400 text-lg">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={i < Math.round(average) ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
        <div className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
          {average.toFixed(1)} <span className="text-gray-500 text-[16px]">/ 5</span>
        </div>
      </div>

      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-5">
        Рейтинг формируется на основе отзывов
      </p>

      <div className="space-y-2 mb-5">
        {ratings.map((r) => (
          <div key={r.stars} className="flex items-center gap-2">
            <span className="text-[12px] text-gray-700 dark:text-gray-300 w-10">{r.stars}★</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full"
                style={{ width: `${getWidth(r.count)}%` }}
              ></div>
            </div>
            <span className="text-[12px] text-gray-600 dark:text-gray-400 w-8 text-right">
              {r.count}
            </span>
          </div>
        ))}
      </div>



      <p className="text-[12px] text-gray-500 dark:text-gray-400">
        Отзывы могут оставлять только те, кто купил тур.
      </p>
    </div>

  );
}

/* =========================
     Рекомендуем также
========================= */
function Recommended() {
  const cards = [
    {
      title: "Мавзолей Ходжи Ахмеда Ясави (Туркестан)",
      img: "https://fs.tonkosti.ru/cl/0u/cl0uikkvo3s40844kocogsckk.jpg",
      price: "5089 ₸",
      oldPrice: "23 659 ₸",
      rating: 5.0,
      reviews: 67,
    },
    {
      title: "Чарынский каньон",
      img: "https://sputnik.kz/img/252/01/2520108_0:0:1200:754_1920x0_80_0_0_2f1a758190a93bf393a6da720eed4169.jpg",
      price: "2923 ₸",
      oldPrice: "20 219 ₸",
      rating: 4.9,
      reviews: 241,
    },
    {
      title: "Озеро Каинды",
      img: "https://img.tourister.ru/files/1/9/4/1/9/6/0/8/original.jpg",
      price: "2587 ₸",
      oldPrice: "20 219 ₸",
      rating: 4.9,
      reviews: 58796,
    },
    {
      title: "Наскальные изображения Тамгалы",
      img: "https://pictures.pibig.info/uploads/posts/2023-04/1680701922_pictures-pibig-info-p-naskalnie-risunki-tamgali-instagram-3.jpg",
      price: "6436 ₸",
      oldPrice: "10 559 ₸",
      rating: 4.9,
      reviews: 421,
    },
    {
      title: "Пик Победы",
      img: "https://cs17.pikabu.ru/s/2025/08/30/16/ejhflvbn_lg.jpg",
      price: "8382 ₸",
      oldPrice: "21 307 ₸",
      rating: 4.5,
      reviews: 8,
    },
    {
      title: "Поющие барханы",
      img: "https://1zoom.club/uploads/posts/2023-03/1678128765_1zoom-club-p-barkhan-79.jpg",
      price: "4073 ₸",
      oldPrice: "10 559 ₸",
      rating: 4.9,
      reviews: 13729,
    },
  ];

  // Добавляем анимацию при монтировании
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(15px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.5s ease forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-left">
        Рекомендуем также
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow hover:shadow-lg transition duration-300 animate-fadeInUp"
          >
            <img
              src={c.img}
              alt={c.title}
              className="w-full h-48 object-cover rounded-md mb-3"
              loading="lazy"
            />

            <div className="flex flex-col grow">
              <div className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[40px]">
                {c.title}
              </div>

              <div className="mt-auto">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[#FF9900] text-[15px] font-bold">{c.price}</span>
                  <span className="line-through text-gray-400 text-[13px]">{c.oldPrice}</span>
                </div>

                <div className="flex items-center text-[13px] text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                  <span>{c.rating.toFixed(1)}</span>
                  <span className="ml-1">({c.reviews.toLocaleString()} отзывов)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

function TourGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-[805px] lg:ml-0 lg:mr-auto bg-[#F6F7FA] dark:bg-gray-800 rounded-2xl p-6 mt-12 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6" >
        Организатор туров
      </h2>



      {/* Карточка */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex justify-between items-center shadow-sm">
        {/* Левая часть */}
        <div className="flex items-center gap-4">
          <img
            src="организатор.jpg"
            alt="Абдыкадыров Тамерлан"
            className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div>
            <h3 className="text-[16px] font-semibold text-[#5B2EFF] cursor-pointer hover:underline">
              Абдыкадыров Тамерлан
            </h3>

            <div className="text-[14px] text-gray-700 dark:text-gray-300 mt-1 flex flex-col gap-0.5">
              <span>⭐ 5.0 • <a href="#" className="underline">7 отзывов</a></span>
              <span>📍 Проведено 7 туров</span>
              <span className="text-[#5B2EFF]">
                🛡 Надёжный организатор: с нами с 2015 года
              </span>
            </div>
          </div>
        </div>

        {/* Кнопка */}
        <button className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-[#6D28D9] transition">
          Написать
        </button>
      </div>

      {/* Текстовое описание */}
      <div className="mt-4 text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed">
        <p>
          Путешественник, фотограф и основатель проекта о самых красивых местах Казахстана. <br />
          Создаёт яркие проморолики и вдохновляющие туры, помогая людям увидеть страну по-новому. <br />
          Каждый маршрут продуман с вниманием к деталям — от логистики до атмосферы. <br />
          Все туры — 100% реализуемые нашей командой и продуманные до мелочей
          {!expanded && "…"}
        </p>

        {expanded && (
          <p className="mt-2">
            Мы гарантируем безопасность, комфорт и незабываемые впечатления.
            Каждый маршрут проверен, а команда сопровождает туристов от начала
            до конца.
          </p>
        )}

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
