import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function FullscreenGallery({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSelect,
}) {
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
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
            direction === 1
              ? "slide-in-right"
              : direction === -1
              ? "slide-in-left"
              : ""
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
            className={`shrink-0 w-16 h-16 rounded-md cursor-pointer border-2 transition-all duration-300 ${
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
export default FullscreenGallery;