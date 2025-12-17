import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export function Recommended({ recommendedCards = [] }) {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes scaleIn {
  0% { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
  }
}

@keyframes shimmer {
  0% { 
    background-position: -1000px 0; 
  }
  100% { 
    background-position: 1000px 0; 
  }
}

@keyframes slideInLeft {
  0% { 
    opacity: 0; 
    transform: translateX(-30px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px); 
  }
  50% { 
    transform: translateY(-8px); 
  }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 153, 0, 0.3); 
  }
  50% { 
    box-shadow: 0 0 40px rgba(255, 153, 0, 0.6); 
  }
}

/* ===== UTILITY CLASSES ===== */
.animate-fadeInUp {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-scaleIn {
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-slideInLeft {
  animation: slideInLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* ===== RECOMMENDED CARD STYLES ===== */
.recommended-card {
  min-width: 240px;
  max-width: 240px;
  flex-shrink: 0;

  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  min-height: 380px;
}

.dark .recommended-card {
  background: rgba(31, 41, 55, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.recommended-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s;
  z-index: 1;
}

.recommended-card:hover::before {
  left: 100%;
}

.recommended-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 153, 0, 0.1);
}

.dark .recommended-card:hover {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 153, 0, 0.3);
}

/* ===== IMAGE CONTAINER ===== */
.recommended-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  height: 220px;
}

.dark .recommended-image-wrapper {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.recommended-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.recommended-card:hover .recommended-image {
  transform: scale(1.1);
}

/* Image overlay on hover */
.recommended-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  pointer-events: none;
}

.recommended-card:hover .recommended-image-overlay {
  opacity: 1;
}

/* ===== BADGE STYLES ===== */
.recommended-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(255, 153, 0, 0.95);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.4);
  z-index: 2;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* ===== PRICE STYLES ===== */
.recommended-price {
  position: relative;
  display: inline-block;
  background: linear-gradient(135deg, #FF9900 0%, #FF6B00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.5px;
}

.recommended-price::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #FF9900 0%, #FF6B00 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recommended-card:hover .recommended-price::after {
  width: 100%;
}

/* ===== TITLE STYLES ===== */
.recommended-title {
  position: relative;
  font-weight: 600;
  line-height: 1.4;
  color: #1f2937;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.dark .recommended-title {
  color: #f3f4f6;
}

.recommended-card:hover .recommended-title {
  color: #FF9900;
}

.dark .recommended-card:hover .recommended-title {
  color: #FFB84D;
}

/* ===== SECTION HEADER ===== */
.recommended-section-header {
  position: relative;
  display: inline-block;
  margin-bottom: 0;
}

.recommended-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
}

.dark .recommended-section-title {
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.recommended-section-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  color: #6b7280;
  margin-top: 12px;
  font-weight: 400;
}

.dark .recommended-section-subtitle {
  color: #9ca3af;
}

/* ===== CTA BUTTON ===== */
.recommended-cta {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #FF9900 0%, #FF6B00 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
  z-index: 2;
}

.recommended-card:hover .recommended-cta {
  opacity: 1;
  transform: translateY(0);
}

.recommended-cta:hover {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9900 100%);
  box-shadow: 0 6px 20px rgba(255, 153, 0, 0.5);
}

/* ===== RESPONSIVE GRID ===== */
.recommended-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 8px;
  justify-content: center;
}


.recommended-grid::-webkit-scrollbar {
  display: none;
}


@media (max-width: 640px) {
  .recommended-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }
  
  .recommended-section-title {
    font-size: 2rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .recommended-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .recommended-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1281px) {
  .recommended-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1536px) {
  .recommended-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ===== HOVER EFFECTS FOR TOUCH DEVICES ===== */
@media (hover: none) {
  .recommended-card:active {
    transform: translateY(-4px) scale(1.01);
  }
  
  .recommended-card:active .recommended-image {
    transform: scale(1.05);
  }
}

/* ===== ACCESSIBILITY ===== */
.recommended-card:focus-visible {
  outline: 3px solid #FF9900;
  outline-offset: 4px;
}

/* ===== EMPTY STATE ===== */
.recommended-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
}

.dark .recommended-empty {
  color: #6b7280;
}

.recommended-empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}
`;

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Memoize expensive calculations
  const hasCards = useMemo(() => recommendedCards.length > 0, [recommendedCards.length]);

  // Staggered animation delays
  const getAnimationDelay = useMemo(() => {
    return (index) => ({
      animationDelay: `${index * 0.08}s`,
    });
  }, []);

  if (!hasCards) {
    return (
      <div className="font-['DM_Sans'] mt-16 animate-fadeInUp">
        <div className="recommended-section-header mb-12">
          <h2 className="recommended-section-title">
            Рекомендуем также
          </h2>
        </div>

        <div className="recommended-empty">
          <div className="recommended-empty-icon">🏞️</div>
          <p className="text-lg font-medium">Рекомендации скоро появятся</p>
          <p className="text-sm mt-2">Мы подбираем для вас лучшие предложения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['DM_Sans'] mt-20 mb-16 relative">
      <div className="flex flex-col items-center gap-12">

        {/* HEADER - на уровне карточек */}
        <div className="animate-slideInLeft shrink-0 pt-2">
          <div className="recommended-section-header w-full">
            <h2 className="recommended-section-title w-full text-center">
              Рекомендуем также
            </h2>
          </div>
          <p className="recommended-section-subtitle text-center w-full">
            Специально подобранные предложения для вас
          </p>
        </div>

        {/* CARDS */}
        <div className="recommended-grid">
          {recommendedCards.map((card, index) => (
            <article
              key={card.id || index}
              className="recommended-card flex flex-col rounded-2xl p-4 shadow-lg animate-fadeInUp"
              style={getAnimationDelay(index)}
            >
              <Link
                to={card.url}
                className="flex flex-col h-full relative z-10"
                aria-label={`Подробнее о ${card.title}`}
              >
                {/* Image Container */}
                <div className="recommended-image-wrapper relative mb-4">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="recommended-image"
                    loading="lazy"
                    width="300"
                    height="220"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='220'%3E%3Crect fill='%23f3f4f6' width='300' height='220'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='Arial'%3EИзображение%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="recommended-image-overlay" />

                  {card.discount && (
                    <div className="recommended-badge">
                      -{card.discount}%
                    </div>
                  )}

                  <div className="recommended-cta">
                    Подробнее
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col grow">
                  <h3 className="recommended-title text-base mb-3">
                    {card.title}
                  </h3>

                  {card.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  {card.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {card.rating}
                      </span>
                      {card.reviewCount && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({card.reviewCount})
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        {card.oldPrice && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 line-through mr-2">
                            {card.oldPrice}
                          </span>
                        )}
                        <span className="recommended-price">
                          {new Intl.NumberFormat("ru-RU").format(card.price)} {card.currency}
                        </span>
                      </div>

                      {card.duration && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {card.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );

}