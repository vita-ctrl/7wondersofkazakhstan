/* eslint-disable */
import React, { useState, useRef } from "react";

export default function IncludedExcluded() {
  const included = [
    "Трансфер до космодрома Байконур и обратно (из Кызылорды или ж/д станции Торетам)",
    "Проживание в гостинице «Южная» с выбранным типом размещения",
    "Трёхразовое питание в гостинице, чистая питьевая вода",
    "Сопровождение профессиональным гидом",
    "Получение пропусков на космодром",
    "Экскурсия музейного комплекса",
    "Экскурсии по объектам Байконура",
    "Наблюдение за стартом ракеты со смотровой площадки",
  ];

  const excluded = [
    "Перелёт до г. Кызылорда или ж/д поезд до станции Торетам",
    "Опциональный обед на третий день в придорожном кафе (если есть время)",
    "Страховка (на ваше усмотрение, оформляется самостоятельно)",
    "Личные расходы в дороге или на объектах",
  ];

  const [showAll, setShowAll] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particlePositions, setParticlePositions] = useState([]);
  const buttonRef = useRef(null);

  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        scale: 0.5 + Math.random() * 0.5,
        delay: Math.random() * 0.5,
      });
    }
    setParticlePositions(particles);
  };

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    createParticles();
    setShowAll(!showAll);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  const CheckIcon = () => (
    <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none">
      <path d="M20 7L9 18l-5-5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  const CrossIcon = () => (
    <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  return (
    <section className="mt-10">
      <h2 className="text-[26px] font-bold text-gray-900 dark:text-gray-100 mb-2">
        Включено в стоимость
      </h2>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#4F46E5] to-transparent" />
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#4F46E5] to-transparent" />
      </div>

      {/* Включено */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
        <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Включено в ваш космический тур
        </p>

        <div>
          <ul className="space-y-4">
            {included.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-relaxed group"
              >
                <span className="shrink-0 mt-1 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-125">
                  <CheckIcon />
                </span>
                <span className="text-gray-900 dark:text-gray-100 transition-all duration-300 group-hover:text-[#4F46E5] dark:group-hover:text-[#8B5CF6] group-hover:translate-x-1">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Не включено */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          showAll
            ? "max-h-[500px] opacity-100 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
            : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="transition-all duration-500 ease-out">
          <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            Не включено в стоимость
          </p>

          <ul className="space-y-4">
            {excluded.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-relaxed group"
              >
                <span className="shrink-0 mt-1 text-rose-600 dark:text-rose-400 transition-transform duration-300 group-hover:scale-125">
                  <CrossIcon />
                </span>
                <span className="text-gray-900 dark:text-gray-100 transition-all duration-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Кнопка - БЕЗ иконок планеты и ракеты */}
      <div className="mt-8 text-center relative" ref={buttonRef}>
        {particlePositions.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] pointer-events-none ${
              showAll ? "animate-particle-out" : "animate-particle-in"
            }`}
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(${particle.x}%, ${particle.y}%) scale(${particle.scale})`,
              animationDelay: `${particle.delay}s`,
              opacity: showAll ? 0 : 1,
            }}
          />
        ))}

        <button
          onClick={handleToggle}
          disabled={isAnimating}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-[15px] font-semibold text-white transition-all duration-500 ease-out hover:scale-105 active:scale-95 overflow-hidden rounded-xl"
          style={{
            background: showAll
              ? "linear-gradient(135deg, #8B5CF6 0%, #4F46E5 50%, #3730a3 100%)"
              : "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                transform: "translateX(-100%)",
                animation: "shimmer 3s infinite",
              }}
            />
          </div>

          <div className="relative z-10">
            <span className="relative">
              {showAll ? "Свернуть детали" : "Раскрыть все условия"}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                  showAll ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </span>
          </div>

          <div
            className="absolute inset-0 rounded-xl border-2 border-transparent bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#4F46E5] bg-size-[200%_100%] animate-gradient-border"
            style={{ margin: "-2px" }}
          />
        </button>

        <div
          className={`absolute inset-0 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] opacity-20 blur-xl transition-all duration-500 ${
            showAll ? "scale-110 opacity-30" : "scale-100 opacity-20"
          }`}
          style={{ zIndex: -1 }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes particle-in {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(var(--scale)); opacity: 0; }
        }
        
        @keyframes particle-out {
          0% { transform: translate(var(--x), var(--y)) scale(var(--scale)); opacity: 1; }
          100% { transform: translate(0, 0) scale(0); opacity: 0; }
        }
        
        .animate-gradient-border {
          animation: gradient-border 3s ease infinite;
        }
        
        .animate-particle-in {
          animation: particle-in 0.8s ease-out forwards;
        }
        
        .animate-particle-out {
          animation: particle-out 0.6s ease-in forwards;
        }
      `}</style>
    </section>
  );
}