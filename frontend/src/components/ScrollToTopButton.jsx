import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-8 right-8 z-50
          w-12 h-12
          group
          transition-all duration-500 ease-out
          ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90 pointer-events-none"}
        `}
        aria-label="Прокрутить наверх"
      >
        {/* Основная круглая кнопка */}
        <div className={`
          relative w-full h-full rounded-full
          bg-linear-to-br from-amber-500 via-amber-600 to-amber-700
          dark:from-blue-500 dark:via-blue-600 dark:to-purple-600
          shadow-xl shadow-amber-500/30 dark:shadow-blue-500/30
          flex items-center justify-center
          transition-all duration-300
          ${isHovered 
            ? "scale-110 shadow-2xl shadow-amber-500/50 dark:shadow-blue-500/50" 
            : "scale-100"
          }
        `}>
          {/* Внутренний блеск */}
          <div className={`
            absolute inset-[2px] rounded-full
            bg-linear-to-br from-white/20 to-transparent
            transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-60"}
          `} />

          {/* Анимированный градиентный оверлей */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className={`
              absolute inset-0
              bg-linear-to-tr from-transparent via-white/25 to-transparent
              transition-transform duration-700
              ${isHovered ? "translate-x-full translate-y-full" : "-translate-x-full -translate-y-full"}
            `} />
          </div>
          
          {/* Иконка */}
          <div className="relative z-10">
            <FontAwesomeIcon 
              icon={faArrowUp} 
              className={`
                text-white
                text-base
                drop-shadow-md
                transition-all duration-300
                ${isHovered ? "-translate-y-0.5 scale-105" : ""}
              `} 
            />
          </div>
        </div>

        {/* Тултип */}
        <div className={`
          absolute bottom-full mb-2 left-1/2 -translate-x-1/2
          px-3 py-1.5
          bg-gray-900 dark:bg-white
          text-white dark:text-gray-900
          text-xs font-semibold
          rounded-lg
          shadow-lg
          transition-all duration-300
          whitespace-nowrap
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
        `}>
          Наверх
          {/* Стрелка тултипа */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-white" />
          </div>
        </div>

        {/* Дополнительное свечение при ховере */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-amber-400/20 dark:bg-blue-400/20 blur-lg animate-pulse-glow" />
        )}
      </button>

      {/* Глобальные стили */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}